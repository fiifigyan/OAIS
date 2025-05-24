import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Appbar, Card, Divider, ActivityIndicator } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { generatePDF, sharePDF, printPDF } from '../../services/pdfService';
import { generateReportHTML } from '../../utils/pdfTemplates';
import { APIConfig } from '../../config';
import { getAuthToken, sanitizeError, logger, formatDate } from '../../utils/helpers';

const ReportScreen = ({ navigation, route }) => {
  const studentData = route.params?.studentData || {};
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch report data from API
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken();
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(
          `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.REPORT}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data) throw new Error('No report data returned from API');

        setReportData({
          term: data.term || 'Term 1',
          overallGrade: data.overallGrade || 'B+',
          attendance: data.attendance || '94%',
          subjects: data.subjects || [],
          comments: data.comments || [],
          headmasterRemark: data.headmasterRemark || '',
        });
      } catch (error) {
        logger.error('Failed to fetch report data:', error);
        setError(sanitizeError(error));
        Alert.alert('Error', 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Handle PDF export
  const handleExport = async () => {
    if (!reportData) return;
    
    setLoading(true);
    try {
      const html = generateReportHTML({
        studentId: studentData.studentName || 'Student',
        ...reportData,
      }, schoolInfo);

      const { filePath } = await generatePDF(html, `${studentData.studentName}_Report`);
      
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

  if (!reportData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#00873E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`${studentData.studentName || 'Student'}'s Report`} />
        {loading ? (
          <ActivityIndicator animating={true} color="aliceblue" />
        ) : (
          <Appbar.Action icon="download" onPress={handleExport} />
        )}
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Overall Grade</Text>
                <Text style={styles.summaryValue}>{reportData.overallGrade}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Attendance</Text>
                <Text style={styles.summaryValue}>{reportData.attendance}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Position</Text>
                <Text style={styles.summaryValue}>{studentData.generalPosition || '4th'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Academic Performance</Text>
        <Card style={styles.chartCard}>
          <Card.Content>
            <PieChart
              data={reportData.pieData}
              width={screenWidth - 32}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Subject Breakdown</Text>
        {reportData.subjects.map((subject, index) => (
          <Card key={index} style={styles.subjectCard}>
            <Card.Content>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <View style={styles.gradeContainer}>
                  <Text style={styles.subjectGrade}>{subject.grade}</Text>
                  <Text style={styles.subjectPosition}>(Position: {subject.position})</Text>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${subject.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{subject.progress}% mastery</Text>
            </Card.Content>
          </Card>
        ))}

        <Text style={styles.sectionHeader}>Teacher Comments</Text>
        {reportData.comments.map((comment, index) => (
          <Card key={index} style={styles.commentCard}>
            <Card.Content>
              <Text style={styles.commentHeader}>
                {comment.teacher} ({comment.subject})
              </Text>
              <Divider style={styles.divider} />
              <Text style={styles.commentText}>{comment.text}</Text>
            </Card.Content>
          </Card>
        ))}

        <Text style={styles.sectionHeader}>Headmaster's Remarks</Text>
        <Card style={styles.commentCard}>
          <Card.Content>
            <Text style={styles.commentText}>{reportData.headmasterRemark}</Text>
          </Card.Content>
        </Card>

        <View style={styles.interestContainer}>
          <Text style={styles.interestLabel}>Areas of Interest:</Text>
          <Text style={styles.interestValue}>{studentData.interest || 'English, Creative Arts'}</Text>
        </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  subjectCard: {
    margin: 8,
    marginBottom: 4,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradeContainer: {
    alignItems: 'flex-end',
  },
  subjectGrade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00873E',
  },
  subjectPosition: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#00873E',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  commentCard: {
    margin: 8,
    marginBottom: 4,
    elevation: 2,
  },
  commentHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  interestContainer: {
    margin: 16,
    marginTop: 8,
  },
  interestLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  interestValue: {
    fontSize: 14,
    color: '#333',
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
    marginBottom: 20,
  },
  exportButtonText: {
    color: 'aliceblue',
    fontWeight: 'bold',
  },
});

export default ReportScreen;