import React, { useState, useEffect } from 'react';
import { View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { generatePDF, sharePDF, printPDF } from '../services/pdfService';
import ChartImageGenerator from '../components/ChartImageGenerator';

const PDFGenerationScreen = ({ route, navigation }) => {
  const { studentData, type } = route.params;
  const [chartImages, setChartImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [chartsReady, setChartsReady] = useState(false);

  const handleChartGenerated = (chartType, uri) => {
    setChartImages(prev => ({
      ...prev,
      [chartType]: uri
    }));
  };

  useEffect(() => {
    if (type === 'report') {
      setChartsReady(chartImages.gradeDistribution && chartImages.performanceTrend);
    } else {
      setChartsReady(!!chartImages.gradeDistribution);
    }
  }, [chartImages, type]);

  const handleExport = async () => {
    setLoading(true);
    try {
      const html = type === 'report' 
        ? generateReportHTML(studentData, schoolInfo, chartImages)
        : generateGradebookHTML(studentData, schoolInfo, chartImages);

      const { filePath } = await generatePDF(html, `${studentData.studentId}_${type}`);
      
      Alert.alert(
        "Export Successful",
        "What would you like to do with the PDF?",
        [
          { text: "Print", onPress: () => printPDF(filePath) },
          { text: "Share", onPress: () => sharePDF(filePath) },
          { text: "Cancel", style: "cancel" }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate chart data based on student data
  const gradeDistributionData = {
    labels: calculateGradeDistribution(studentData.subjects).map(item => item.name),
    datasets: [{
      data: calculateGradeDistribution(studentData.subjects).map(item => item.population),
      colors: calculateGradeDistribution(studentData.subjects).map(item => item.color)
    }]
  };

  const performanceTrendData = {
    labels: ['Term 1', 'Term 2', 'Term 3'], // Example terms
    datasets: [{
      data: [75, 82, 88], // Example performance data
    }]
  };

  return (
    <View style={styles.container}>
      {/* Hidden chart generators */}
      <View style={styles.hiddenCharts}>
        <ChartImageGenerator
          type="pie"
          data={gradeDistributionData}
          onImageGenerated={(uri) => handleChartGenerated('gradeDistribution', uri)}
        />
        {type === 'report' && (
          <ChartImageGenerator
            type="line"
            data={performanceTrendData}
            onImageGenerated={(uri) => handleChartGenerated('performanceTrend', uri)}
          />
        )}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#00873E" />
        ) : (
          <TouchableOpacity
            style={[styles.button, !chartsReady && styles.buttonDisabled]}
            onPress={handleExport}
            disabled={!chartsReady || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Generating...' : 'Export as PDF'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  hiddenCharts: {
    position: 'absolute',
    left: -1000,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00873E',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PDFGenerationScreen;