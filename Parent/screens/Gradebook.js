import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dropdown } from 'react-native-element-dropdown';
import { generatePDF, sharePDF, printPDF } from '../services/pdfService';
import { generateGradebookHTML } from '../utils/pdfTemplates';
import { schoolInfo } from '../config';

const GradebookScreen = ({ navigation, route }) => {
  const studentId = route.params?.studentId;
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample data
  const terms = ['Term 1', 'Term 2', 'Term 3'];
  const subjects = ['All Subjects', 'Mathematics', 'Science', 'English', 'History'];
  
  const assignments = [
    { id: '1', subject: 'Mathematics', name: 'Algebra Test', date: '2023-10-15', score: '85/100', grade: 'B+' },
    { id: '2', subject: 'Science', name: 'Chemistry Lab', date: '2023-10-18', score: '92/100', grade: 'A' },
    { id: '3', subject: 'English', name: 'Essay Writing', date: '2023-10-20', score: '78/100', grade: 'C+' },
  ];

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [75, 80, 82, 85],
        color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const html = generateGradebookHTML({
        studentId,
        selectedTerm,
        overallGrade: 'B+',
        attendance: '94%',
        assignments,
        subjects: [
          { name: 'Mathematics', grade: 'A-', progress: 85 },
          { name: 'Science', grade: 'B+', progress: 78 },
          { name: 'English', grade: 'B', progress: 72 },
          { name: 'History', grade: 'A', progress: 92 },
        ]
      }, schoolInfo);

      const { filePath } = await generatePDF(html, `${studentId}_Gradebook`);
      
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

  const renderAssignment = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.assignmentHeader}>
          <Text style={styles.subjectText}>{item.subject}</Text>
          <Chip mode="outlined" style={styles.gradeChip}>
            {item.grade}
          </Chip>
        </View>
        <Text style={styles.assignmentName}>{item.name}</Text>
        <View style={styles.assignmentDetails}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.scoreText}>{item.score}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`${studentId}'s Gradebook`} />
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
          
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={subjects}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select subject"
            value={selectedSubject}
            onChange={item => setSelectedSubject(item.value)}
          />
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Performance Trend</Text>
            <LineChart
              data={performanceData}
              width={350}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#03ac13'
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </Card.Content>
        </Card>

        <Text style={styles.sectionHeader}>Recent Assignments</Text>
        <FlatList
          data={assignments}
          renderItem={renderAssignment}
          keyExtractor={item => item.id}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 4,
    height: 50,
    backgroundColor: 'aliceblue',
    borderRadius: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#03ac13',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#03ac13',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 8,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  subjectText: {
    fontWeight: 'bold',
    color: '#03ac13',
  },
  gradeChip: {
    alignSelf: 'flex-end',
  },
  assignmentName: {
    fontSize: 16,
    marginBottom: 4,
  },
  assignmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    color: '#666',
  },
  scoreText: {
    fontWeight: 'bold',
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
  },
  exportButtonText: {
    color: 'aliceblue',
    fontWeight: 'bold',
  },
});

export default GradebookScreen;