import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Appbar, Card, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { BarChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { generatePDF, sharePDF, printPDF } from '../../services/pdfService';
import { generateGradebookHTML } from '../../utils/pdfTemplates';
import { APIConfig } from '../../config';
import { getAuthToken, sanitizeError, logger, formatDate } from '../../utils/helpers';

const GradebookScreen = ({ navigation, route }) => {
  const studentData = route.params?.studentData || {};
  const [selectedTerm, setSelectedTerm] = useState(studentData.term || 'Term 1');
  const [loading, setLoading] = useState(false);
  const [gradeData, setGradeData] = useState([]);
  const [error, setError] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  const terms = [
    { label: 'Term 1', value: 'Term 1' },
    { label: 'Term 2', value: 'Term 2' },
    { label: 'Term 3', value: 'Term 3' },
  ];

  const performanceData = {
    labels: gradeData.map(item => item.subject),
    datasets: [
      {
        data: gradeData.map(item => item.totalScore),
        color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const gradeDistribution = {
    labels: ['A', 'B', 'C', 'D', 'E', 'F'],
    datasets: [
      {
        data: [3, 2, 1, 0, 1, 0],
        colors: [
          (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
          (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          (opacity = 1) => `rgba(255, 206, 86, ${opacity})`,
          (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
          (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
        ]
      }
    ]
  };

  // Fetch grade data from API
  useEffect(() => {
    const fetchGradeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken();
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get(
          `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.GRADE}?term=${selectedTerm}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.subjects) {
          throw new Error('No grade data returned from API');
        }

        setGradeData(data.subjects);
      } catch (error) {
        logger.error('Failed to fetch grade data:', error);
        setError(sanitizeError(error));
        Alert.alert('Error', 'Failed to load gradebook data');
      } finally {
        setLoading(false);
      }
    };

    fetchGradeData();
  }, [selectedTerm]);

  // Handle PDF export
  const handleExport = async () => {
    setLoading(true);
    try {
      const html = generateGradebookHTML({
        studentId: studentData.studentName || 'Student',
        selectedTerm,
        overallGrade: studentData.grade || 'B+',
        attendance: studentData.totalAttendance || '94%',
        assignments: gradeData.map(item => ({
          subject: item.name,
          name: `${item.name} Exam`,
          date: formatDate(new Date()),
          score: `${item.totalScore}/100`,
          grade: item.grade,
        })),
        subjects: gradeData.map(item => ({
          name: item.name,
          grade: item.grade,
          progress: item.totalScore,
        })),
      });

      const { filePath } = await generatePDF(html, `${studentData.studentName}_Gradebook`);
      
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
      logger.error('PDF export failed:', error);
      Alert.alert("Error", "Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  // Render grade item
  const renderGradeItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.gradeHeader}>
          <Text style={styles.subjectText}>{item.subject}</Text>
          <Chip mode="outlined" style={styles.gradeChip}>
            {item.grade}
          </Chip>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.gradeDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Class Score</Text>
            <Text style={styles.detailValue}>{item.classScore}/50</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Exam Score</Text>
            <Text style={styles.detailValue}>{item.examScore}/50</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={[styles.detailValue, styles.totalScore]}>{item.totalScore}/100</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Position</Text>
            <Text style={styles.detailValue}>{item.position}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`${studentData.studentName || 'Student'}'s Gradebook`} />
        {loading ? (
          <ActivityIndicator animating={true} color="aliceblue" />
        ) : (
          <Appbar.Action icon="download" onPress={handleExport} />
        )}
      </Appbar.Header>

      <ScrollView>
        <View style={styles.filterContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={terms}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select term"
            value={selectedTerm}
            onChange={item => setSelectedTerm(item.value)}
          />
        </View>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Overall Grade</Text>
                <Text style={styles.summaryValue}>{studentData.grade || 'B+'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Attendance</Text>
                <Text style={styles.summaryValue}>{studentData.totalAttendance || '94%'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Position</Text>
                <Text style={styles.summaryValue}>{studentData.generalPosition || '4th'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Subject Performance</Text>
        {gradeData.length > 0 && (
          <Card style={styles.chartCard}>
            <Card.Content>
              <BarChart
                data={performanceData}
                width={screenWidth - 32}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(3, 172, 19, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#00873E'
                  }
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
            </Card.Content>
          </Card>
        )}

        <Text style={styles.sectionHeader}>Grade Distribution</Text>
        <Card style={styles.chartCard}>
          <Card.Content>
            <LineChart
              data={gradeDistribution}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(3, 172, 19, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Detailed Grades</Text>
        <FlatList
          data={gradeData}
          renderItem={renderGradeItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />

        <View style={styles.exportOptions}>
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExport}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator animating={true} color="aliceblue" />
            ) : (
              <Text style={styles.exportButtonText}>Export as PDF</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    padding: 16,
  },
dropdown: {
  height: 50,
  backgroundColor: 'aliceblue',
  borderRadius: 4,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: '#00873E',
},
placeholderStyle: {
  fontSize: 14,
  color: '#666',
},
selectedTextStyle: {
  fontSize: 14,
  color: '#00873E',
},
iconStyle: {
  width: 20,
  height: 20,
},
  summaryCard: {
    margin: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    padding: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00873E',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 8,
    color: '#333',
  },
  chartCard: {
    margin: 8,
    elevation: 2,
  },
  card: {
    margin: 8,
    marginBottom: 4,
    elevation: 2,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00873E',
  },
  gradeChip: {
    backgroundColor: '#e8f5e9',
  },
  divider: {
    marginVertical: 4,
    backgroundColor: '#e0e0e0',
  },
  gradeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    width: '48%',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalScore: {
    color: '#00873E',
    fontWeight: 'bold',
  },
  exportOptions: {
    margin: 16,
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#00873E',
    padding: 12,
    borderRadius: 4,
    width: '80%',
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'aliceblue',
    fontWeight: 'bold',
  },
});

export default GradebookScreen;