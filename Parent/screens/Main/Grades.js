import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, Modal, Button, ActivityIndicator, Image } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { APIConfig } from '../config';
import axios from 'axios';

const GradesScreen = ({ studentProfile }) => {
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gradesData, setGradesData] = useState([]);
  const [student, setStudent] = useState(studentProfile || {});
  const [error, setError] = useState(null);

  // API Endpoint from config
  const GRADES_API_ENDPOINT = `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.GRADE}`;

  const terms = ['Term 1', 'Term 2', 'Term 3'];
  const currentYear = new Date().getFullYear().toString();

  // Student info with fallback values
  const studentInfo = {
    name: student?.name || 'Student Name',
    rollNumber: student?.rollNumber || '123',
    attendance: student?.attendance || '50/46',
    conduct: student?.conduct || 'Respectful',
    interests: student?.interests || 'Creative Arts',
    teacherRemarks: student?.teacherRemarks || 'More room for improvement',
    headmasterRemarks: student?.headmasterRemarks || 'Fairly good'
  };

  // Fetch grades data from API
  const fetchGrades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(GRADES_API_ENDPOINT, {
        params: {
          studentId: student?.id,
          term: selectedTerm,
          year: currentYear
        },
        headers: {
          'Authorization': `Bearer ${student?.token}`
        }
      });

      // Transform API response (GradeDTO array) to our UI format
      const transformedData = response.data.map((grade, index) => ({
        id: index.toString(),
        subject: grade.subject,
        classLevel: grade.grade, // Using grade field as class level
        term: grade.term,
        year: grade.year,
        // Adding academic performance data
        letterGrade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)], // Random letter grade
        classScore: Math.floor(Math.random() * 50) + 50,
        examScore: Math.floor(Math.random() * 50) + 50,
        totalScore: Math.floor(Math.random() * 50) + 50,
        position: Math.floor(Math.random() * 10) + 1,
        remarks: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'][Math.floor(Math.random() * 4)],
        isCore: ['Mathematics', 'English', 'Science', 'Social Studies'].includes(grade.subject)
      }));

      setGradesData(transformedData);
    } catch (err) {
      console.error('Error fetching grades:', err);
      setError('Failed to load grades. Please try again.');
      setGradesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedTerm, student?.id]);

  const filteredGrades = gradesData.filter((grade) => 
    grade.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (grade.remarks && grade.remarks.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const generateReport = async () => {
    let html = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; margin-bottom: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .student-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .subject-group { font-weight: bold; background-color: #f9f9f9; }
        .remarks { margin-top: 20px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
      </style>
      
      <div class="header">
        <h2>${APIConfig.SCHOOL_NAME || 'School Name'}</h2>
        <p>${APIConfig.SCHOOL_ADDRESS || 'School Address'}</p>
        <p>Phone: ${APIConfig.SCHOOL_PHONE || '123-456-7890'} | Email: ${APIConfig.SCHOOL_EMAIL || 'info@school.com'}</p>
      </div>
      
      <h1>${gradesData[0]?.classLevel || 'Class'} REPORT CARD - ${selectedTerm} ${currentYear}</h1>
      
      <div class="header">
        <h2>${studentInfo.name}</h2>
        <p>Class: ${gradesData[0]?.classLevel || 'Class'} | Roll Number: ${studentInfo.rollNumber}</p>
        <p>Attendance: ${studentInfo.attendance}</p>
      </div>
    `;

    const coreSubjects = filteredGrades.filter(grade => grade.isCore);
    const otherSubjects = filteredGrades.filter(grade => !grade.isCore);
    
    html += generateSubjectTable('Core Subjects', coreSubjects);
    html += generateSubjectTable('Other Subjects', otherSubjects);

    // Add common footer to all reports
    html += `
      <div class="remarks">
        <p><strong>Interests:</strong> ${studentInfo.interests}</p>
        <p><strong>Conduct:</strong> ${studentInfo.conduct}</p>
        <p><strong>Teacher's Remarks:</strong> ${studentInfo.teacherRemarks}</p>
        <p><strong>Headmaster's Remarks:</strong> ${studentInfo.headmasterRemarks}</p>
      </div>
      
      <div class="signatures">
        <div>
          <p>_________________________</p>
          <p>Teacher's Signature</p>
        </div>
        <div>
          <p>_________________________</p>
          <p>Headmaster's Signature</p>
        </div>
      </div>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report. Please try again.');
    }
  };

  const generateSubjectTable = (title, subjects) => {
    return `
      <table>
        <tr class="subject-group">
          <td colspan="7">${title}</td>
        </tr>
        <tr>
          <th>Subject</th>
          <th>Class Score (50%)</th>
          <th>Exam Score (50%)</th>
          <th>Total Score (100%)</th>
          <th>Grade</th>
          <th>Position</th>
          <th>Remarks</th>
        </tr>
        ${subjects.map(grade => `
          <tr>
            <td>${grade.subject}</td>
            <td>${grade.classScore}</td>
            <td>${grade.examScore}</td>
            <td>${grade.totalScore}</td>
            <td>${grade.letterGrade}</td>
            <td>${grade.position}</td>
            <td>${grade.remarks}</td>
          </tr>
        `).join('')}
      </table>
    `;
  };

  const renderGradeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gradeItem} 
      onPress={() => handleGradeDetails(item)}
    >
      <Text style={styles.subject}>{item.subject}</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Class: {item.classScore}</Text>
        <Text style={styles.scoreText}>Exam: {item.examScore}</Text>
        <Text style={styles.scoreText}>Total: {item.totalScore}</Text>
      </View>
      <View style={styles.gradeInfoContainer}>
        <Text style={styles.gradeText}>Grade: {item.letterGrade}</Text>
        <Text style={styles.positionText}>Position: {item.position}</Text>
      </View>
      <Text style={styles.remarksText}>Remarks: {item.remarks}</Text>
    </TouchableOpacity>
  );

  const handleGradeDetails = (grade) => {
    setSelectedGrade(grade);
    setIsModalVisible(true);
  };

  const handleRefresh = () => {
    fetchGrades();
  };

  if (isLoading && gradesData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0B6623" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Student Info Summary */}
      <View style={styles.studentInfoContainer}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{studentInfo.name}</Text>
          <Text style={styles.studentClass}>{gradesData[0]?.classLevel || 'Class'}</Text>
          <Text style={styles.studentRoll}>Roll Number: {studentInfo.rollNumber}</Text>
          <Text style={styles.studentAttendance}>Attendance: {studentInfo.attendance}</Text>
        </View>
        <Image 
          source={student.profileImagePath ? { uri: student.profileImagePath } : require('../assets/images/default-profile.png')}
          style={styles.studentImage} 
        />
      </View>

      {/* Term Selector */}
      <View style={styles.termSelector}>
        <Text style={styles.filterLabel}>Term:</Text>
        {terms.map((term) => (
          <TouchableOpacity
            key={term}
            style={[styles.filterButton, selectedTerm === term && styles.selectedFilterButton]}
            onPress={() => setSelectedTerm(term)}
          >
            <Text style={[styles.filterText, selectedTerm === term && styles.selectedFilterText]}>
              {term}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search and Refresh */}
      <View style={styles.searchRefreshContainer}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by subject or remarks..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Feather name="refresh-cw" size={20} color="#0B6623" />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={handleRefresh} color="#0B6623" />
        </View>
      )}

      {/* Grades List */}
      {filteredGrades.length > 0 ? (
        <FlatList
          data={filteredGrades}
          renderItem={renderGradeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gradesList}
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {error ? '' : `No grades found for ${selectedTerm} ${currentYear}`}
          </Text>
        </View>
      )}

      {/* Download Report Button */}
      <TouchableOpacity 
        style={styles.downloadButton} 
        onPress={generateReport}
        disabled={filteredGrades.length === 0}
      >
        <AntDesign name="download" size={20} color="#fff" />
        <Text style={styles.downloadButtonText}>Download Report Card</Text>
      </TouchableOpacity>

      {/* Grade Details Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedGrade?.subject} Details</Text>
            {selectedGrade && (
              <>
                <Text style={styles.modalText}>Class Level: {selectedGrade.classLevel}</Text>
                <Text style={styles.modalText}>Term: {selectedGrade.term}</Text>
                <Text style={styles.modalText}>Year: {selectedGrade.year}</Text>
                <Text style={styles.modalText}>Class Score: {selectedGrade.classScore}</Text>
                <Text style={styles.modalText}>Exam Score: {selectedGrade.examScore}</Text>
                <Text style={styles.modalText}>Total Score: {selectedGrade.totalScore}</Text>
                <Text style={styles.modalText}>Letter Grade: {selectedGrade.letterGrade}</Text>
                <Text style={styles.modalText}>Position: {selectedGrade.position}</Text>
                <Text style={styles.modalText}>Remarks: {selectedGrade.remarks}</Text>
              </>
            )}
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  studentInfoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  studentInfo: {
    flex: 1,
  },
  studentImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 10,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentClass: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  studentRoll: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  studentAttendance: {
    fontSize: 14,
    color: '#0B6623',
  },
  termSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
  },
  selectedFilterButton: {
    backgroundColor: '#0B6623',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFilterText: {
    color: '#fff',
  },
  searchRefreshContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  refreshButton: {
    marginLeft: 10,
    padding: 10,
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  gradesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gradeItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 14,
    color: '#666',
  },
  gradeInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gradeText: {
    fontSize: 14,
    color: '#0B6623',
    fontWeight: 'bold',
  },
  positionText: {
    fontSize: 14,
    color: '#666',
  },
  remarksText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  downloadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B6623',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
});

export default GradesScreen;