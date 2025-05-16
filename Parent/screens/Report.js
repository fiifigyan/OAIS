import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Card, Divider, ActivityIndicator } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { generatePDF, sharePDF, printPDF } from '../services/pdfService';
import { generateReportHTML } from '../utils/pdfTemplates';
import { schoolInfo } from '../config';

const ReportScreen = ({ navigation, route }) => {
  const studentId = route.params?.studentId;
  const [loading, setLoading] = useState(false);

  // Sample data
  const reportData = {
    term: 'Term 1',
    overallGrade: 'B+',
    attendance: '94%',
    subjects: [
      { name: 'Mathematics', grade: 'A-', progress: 85 },
      { name: 'Science', grade: 'B+', progress: 78 },
      { name: 'English', grade: 'B', progress: 72 },
      { name: 'History', grade: 'A', progress: 92 },
    ],
    pieData: [
      { name: 'A', population: 2, color: '#4CAF50', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'B', population: 4, color: '#2196F3', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'C', population: 1, color: '#FFC107', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ],
    comments: [
      { teacher: 'Mr. Johnson', subject: 'Mathematics', text: 'Showing excellent problem-solving skills but needs to show work more clearly.' },
      { teacher: 'Ms. Williams', subject: 'English', text: 'Creative writer but needs to focus more on grammar and structure.' },
    ],
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const html = generateReportHTML({
        studentId,
        ...reportData
      }, schoolInfo);

      const { filePath } = await generatePDF(html, `${studentId}_Report`);
      
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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`${studentId}'s Report`} />
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
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Subject Performance</Text>
        {reportData.subjects.map((subject, index) => (
          <Card key={index} style={styles.subjectCard}>
            <Card.Content>
              <View style={styles.subjectHeader}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectGrade}>{subject.grade}</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${subject.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{subject.progress}% mastery</Text>
            </Card.Content>
          </Card>
        ))}

        <Text style={styles.sectionHeader}>Grade Distribution</Text>
        <Card style={styles.card}>
          <Card.Content>
            <PieChart
              data={reportData.pieData}
              width={350}
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
    padding: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03ac13',
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 8,
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
  subjectGrade: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03ac13',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#03ac13',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  card: {
    margin: 8,
    elevation: 2,
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
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  exportOptions: {
    margin: 16,
    alignItems: 'center',
  },
  exportButton: {
    backgroundColor: '#03ac13',
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