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
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const screenWidth = Dimensions.get('window').width;

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

      // Generate pie chart data
      const gradeCounts = {
        A: 0, B: 0, C: 0, D: 0, E: 0, F: 0
      };

      data.subjects?.forEach(subject => {
        if (subject.grade && gradeCounts.hasOwnProperty(subject.grade)) {
          gradeCounts[subject.grade]++;
        }
      });

      const pieData = Object.entries(gradeCounts)
        .filter(([_, count]) => count > 0)
        .map(([grade, count]) => ({
          name: grade,
          population: count,
          color: getGradeColor(grade),
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }));

      setReportData({
        term: data.term || 'Term 1',
        overallGrade: data.overallGrade || 'B+',
        attendance: data.attendance || '94%',
        subjects: data.subjects || [],
        comments: data.comments || [],
        headmasterRemark: data.headmasterRemark || '',
        pieData,
      });
    } catch (error) {
      logger.error('Failed to fetch report data:', error);
      setError(sanitizeError(error));
      Alert.alert('Error', 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: '#4CAF50',
      B: '#8BC34A',
      C: '#FFC107',
      D: '#FF9800',
      E: '#FF5722',
      F: '#F44336',
    };
    return colors[grade] || '#9E9E9E';
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleExport = async () => {
    if (!reportData || reportData.subjects.length === 0) {
      Alert.alert('No Data', 'There is no report data to export');
      return;
    }

    setPdfLoading(true);
    try {
      const html = generateReportHTML({
        studentId: studentData.studentName || 'Student',
        term: reportData.term,
        overallGrade: reportData.overallGrade,
        attendance: reportData.attendance,
        subjects: reportData.subjects.map(subject => ({
          name: subject.subject || subject.name,
          grade: subject.grade,
          progress: subject.progress || subject.totalScore || 0,
        })),
        comments: reportData.comments,
        headmasterRemark: reportData.headmasterRemark,
      });

      const { filePath } = await generatePDF(html, `${studentData.studentName}_Report_${reportData.term}`);
      
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
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#00873E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchReportData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!reportData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No report data available</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchReportData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`${studentData.studentName || 'Student'}'s Report`} />
        {pdfLoading ? (
          <ActivityIndicator animating={true} color="aliceblue" />
        ) : (
          <Appbar.Action 
            icon="download" 
            onPress={handleExport} 
            disabled={!reportData || reportData.subjects.length === 0}
          />
        )}
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Overall Grade</Text>
                <Text style={styles.summaryValue}>{reportData.overallGrade || 'N/A'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Attendance</Text>
                <Text style={styles.summaryValue}>{reportData.attendance || 'N/A'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Position</Text>
                <Text style={styles.summaryValue}>{studentData.generalPosition || 'N/A'}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Grade Distribution</Text>
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
        {reportData.subjects.length > 0 ? (
          reportData.subjects.map((subject, index) => (
            <Card key={index} style={styles.subjectCard}>
              <Card.Content>
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectName}>{subject.subject || subject.name}</Text>
                  <View style={styles.gradeContainer}>
                    <Text style={[styles.subjectGrade, { color: getGradeColor(subject.grade) }]}>
                      {subject.grade}
                    </Text>
                    <Text style={styles.subjectPosition}>(Position: {subject.position || 'N/A'})</Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { 
                    width: `${subject.progress || subject.totalScore || 0}%`,
                    backgroundColor: getGradeColor(subject.grade)
                  }]} />
                </View>
                <Text style={styles.progressText}>
                  {subject.progress || subject.totalScore || 0}% mastery
                </Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>No subject data available</Text>
        )}

        <Text style={styles.sectionHeader}>Teacher Comments</Text>
        {reportData.comments.length > 0 ? (
          reportData.comments.map((comment, index) => (
            <Card key={index} style={styles.commentCard}>
              <Card.Content>
                <Text style={styles.commentHeader}>
                  {comment.teacher} ({comment.subject})
                </Text>
                <Divider style={styles.divider} />
                <Text style={styles.commentText}>{comment.text}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>No comments available</Text>
        )}

        {reportData.headmasterRemark && (
          <>
            <Text style={styles.sectionHeader}>Headmaster's Remarks</Text>
            <Card style={styles.commentCard}>
              <Card.Content>
                <Text style={styles.commentText}>{reportData.headmasterRemark}</Text>
              </Card.Content>
            </Card>
          </>
        )}

        {studentData.interest && (
          <View style={styles.interestContainer}>
            <Text style={styles.interestLabel}>Areas of Interest:</Text>
            <Text style={styles.interestValue}>{studentData.interest}</Text>
          </View>
        )}

        <View style={styles.exportOptions}>
          <TouchableOpacity 
            style={[styles.exportButton, (!reportData || reportData.subjects.length === 0) && styles.buttonDisabled]}
            onPress={handleExport}
            disabled={!reportData || reportData.subjects.length === 0 || pdfLoading}
          >
            {pdfLoading ? (
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00873E',
    padding: 12,
    borderRadius: 4,
    width: '50%',
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
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
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  exportButtonText: {
    color: 'aliceblue',
    fontWeight: 'bold',
  },
});

export default ReportScreen;