import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Appbar, Card, Divider, ActivityIndicator } from 'react-native-paper';
import { generatePDF, sharePDF, printPDF } from '../../services/pdfService';
import { generatePreSchoolHTML, generatePrimaryHTML, generateJHSHTML } from '../../utils/pdfTemplates';
import { schoolInfo } from '../../config';

const ReportCardGenerator = ({ navigation, route }) => {
  const { studentData, gradeLevel } = route.params;
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const transformedData = transformReportData(studentData, gradeLevel);
        setReportData(transformedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentData, gradeLevel]);

  const transformReportData = (data, level) => {
    const baseData = {
      studentName: data.studentName,
      className: data.className,
      term: data.term,
      attendance: `${data.totalAttendance || 0}/${data.attendanceTotal || 0}`,
      rollNumber: data.rollNumber,
      position: data.generalPosition,
      teacherRemark: data.teacherRemark,
      headmasterRemark: data.headmasterRemark,
      interest: data.interest,
      conduct: data.conduct,
      promotedTo: data.promotion,
      vacationDate: data.vacationDate,
      points: data.points
    };

    switch(level) {
      case 'pre-school':
        return {
          ...baseData,
          subjects: [
            { name: 'Language and Literacy', classScore: data.languageScore, examScore: data.languageExam, total: data.languageTotal, level: getProficiencyLevel(data.languageScore) },
            { name: 'Environmental Studies', classScore: data.environmentScore, examScore: data.environmentExam, total: data.environmentTotal, level: getProficiencyLevel(data.environmentScore) },
            { name: 'Mathematics', classScore: data.mathScore, examScore: data.mathExam, total: data.mathTotal, level: getProficiencyLevel(data.mathScore) },
            { name: 'Phonics', classScore: data.phonicsScore, examScore: data.phonicsExam, total: data.phonicsTotal, level: getProficiencyLevel(data.phonicsScore) },
            { name: 'Writing', classScore: data.writingScore, examScore: data.writingExam, total: data.writingTotal, level: getProficiencyLevel(data.writingScore) },
            { name: 'Creative Arts', classScore: data.artsScore, examScore: data.artsExam, total: data.artsTotal, level: getProficiencyLevel(data.artsScore) },
            { name: 'Natural Science', classScore: data.scienceScore, examScore: data.scienceExam, total: data.scienceTotal, level: getProficiencyLevel(data.scienceScore) }
          ]
        };
      case 'primary':
        return {
          ...baseData,
          subjects: [
            { name: 'English', classScore: data.englishClassScore, examScore: data.englishExamScore, total: data.englishTotal, grade: data.englishGrade, position: data.englishPosition, remarks: data.englishRemarks },
            { name: 'Fante', classScore: data.fanteClassScore, examScore: data.fanteExamScore, total: data.fanteTotal, grade: data.fanteGrade, position: data.fantePosition, remarks: data.fanteRemarks },
            { name: 'French', classScore: data.frenchClassScore, examScore: data.frenchExamScore, total: data.frenchTotal, grade: data.frenchGrade, position: data.frenchPosition, remarks: data.frenchRemarks },
            { name: 'Mathematics', classScore: data.mathClassScore, examScore: data.mathExamScore, total: data.mathTotal, grade: data.mathGrade, position: data.mathPosition, remarks: data.mathRemarks },
            { name: 'Science', classScore: data.scienceClassScore, examScore: data.scienceExamScore, total: data.scienceTotal, grade: data.scienceGrade, position: data.sciencePosition, remarks: data.scienceRemarks },
            { name: 'Creative Arts', classScore: data.artsClassScore, examScore: data.artsExamScore, total: data.artsTotal, grade: data.artsGrade, position: data.artsPosition, remarks: data.artsRemarks },
            { name: 'Computing', classScore: data.computingClassScore, examScore: data.computingExamScore, total: data.computingTotal, grade: data.computingGrade, position: data.computingPosition, remarks: data.computingRemarks },
            { name: 'RME', classScore: data.rmeClassScore, examScore: data.rmeExamScore, total: data.rmeTotal, grade: data.rmeGrade, position: data.rmePosition, remarks: data.rmeRemarks }
          ]
        };
      case 'jhs':
        return {
          ...baseData,
          coreSubjects: [
            { name: 'English', classScore: data.englishClassScore, examScore: data.englishExamScore, total: data.englishTotal, grade: data.englishGrade, position: data.englishPosition, remarks: data.englishRemarks },
            { name: 'Mathematics', classScore: data.mathClassScore, examScore: data.mathExamScore, total: data.mathTotal, grade: data.mathGrade, position: data.mathPosition, remarks: data.mathRemarks },
            { name: 'Integrated Science', classScore: data.scienceClassScore, examScore: data.scienceExamScore, total: data.scienceTotal, grade: data.scienceGrade, position: data.sciencePosition, remarks: data.scienceRemarks },
            { name: 'Social Studies', classScore: data.socialClassScore, examScore: data.socialExamScore, total: data.socialTotal, grade: data.socialGrade, position: data.socialPosition, remarks: data.socialRemarks },
            { name: 'Career Tech', classScore: data.careerClassScore, examScore: data.careerExamScore, total: data.careerTotal, grade: data.careerGrade, position: data.careerPosition, remarks: data.careerRemarks }
          ],
          electiveSubjects: [
            { name: 'Fante', classScore: data.fanteClassScore, examScore: data.fanteExamScore, total: data.fanteTotal, grade: data.fanteGrade, position: data.fantePosition, remarks: data.fanteRemarks },
            { name: 'French', classScore: data.frenchClassScore, examScore: data.frenchExamScore, total: data.frenchTotal, grade: data.frenchGrade, position: data.frenchPosition, remarks: data.frenchRemarks },
            { name: 'Creative Arts', classScore: data.artsClassScore, examScore: data.artsExamScore, total: data.artsTotal, grade: data.artsGrade, position: data.artsPosition, remarks: data.artsRemarks },
            { name: 'Computing', classScore: data.computingClassScore, examScore: data.computingExamScore, total: data.computingTotal, grade: data.computingGrade, position: data.computingPosition, remarks: data.computingRemarks },
            { name: 'RME', classScore: data.rmeClassScore, examScore: data.rmeExamScore, total: data.rmeTotal, grade: data.rmeGrade, position: data.rmePosition, remarks: data.rmeRemarks }
          ]
        };
      default:
        return baseData;
    }
  };

  const getProficiencyLevel = (score) => {
    if (!score) return 'BRONZE';
    if (score >= 80) return 'GOLD';
    if (score >= 50) return 'SILVER';
    return 'BRONZE';
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      let html;
      switch(gradeLevel) {
        case 'pre-school':
          html = generatePreSchoolHTML(reportData, schoolInfo);
          break;
        case 'primary':
          html = generatePrimaryHTML(reportData, schoolInfo);
          break;
        case 'jhs':
          html = generateJHSHTML(reportData, schoolInfo);
          break;
        default:
          html = generatePrimaryHTML(reportData, schoolInfo);
      }

      const { filePath } = await generatePDF(html, `${reportData.studentName}_ReportCard`);
      
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

  const renderPreSchoolReport = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.schoolHeader}>{schoolInfo.SCHOOL_NAME}</Text>
      <Text style={styles.contactText}>CONTACT: {schoolInfo.SCHOOL_PHONE}</Text>
      
      <View style={styles.studentInfoContainer}>
        <Text style={styles.studentName}>{reportData.studentName}</Text>
        <Text style={styles.classInfo}>Class: {reportData.className}</Text>
        <Text style={styles.termInfo}>Term: {reportData.term}</Text>
        <Text style={styles.attendanceInfo}>Attendance: {reportData.attendance}</Text>
      </View>

      <Text style={styles.sectionTitle}>SUBJECT PERFORMANCE</Text>
      <View style={styles.subjectTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Subject</Text>
          <Text style={styles.headerCell}>Class Score (50%)</Text>
          <Text style={styles.headerCell}>Exam Score (50%)</Text>
          <Text style={styles.headerCell}>Total (100%)</Text>
          <Text style={styles.headerCell}>Level</Text>
        </View>
        {reportData.subjects.map((subject, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.subjectCell}>{subject.name}</Text>
            <Text style={styles.scoreCell}>{subject.classScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.examScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.total || '0'}</Text>
            <Text style={styles.levelCell}>{subject.level || 'BRONZE'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.remarksContainer}>
        <Text style={styles.remarksTitle}>INTEREST: {reportData.interest}</Text>
        <Text style={styles.remarksTitle}>CONDUCT: {reportData.conduct}</Text>
        <Text style={styles.remarksText}>Teacher's Remarks: {reportData.teacherRemark}</Text>
        <Text style={styles.remarksText}>Headmaster's Remarks: {reportData.headmasterRemark}</Text>
      </View>

      <View style={styles.signatureContainer}>
        <Text style={styles.signatureLine}>Teacher's Signature: ___________________</Text>
        <Text style={styles.signatureLine}>Headmaster's Signature: ___________________</Text>
      </View>
    </ScrollView>
  );

  const renderPrimaryReport = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.schoolHeader}>{schoolInfo.SCHOOL_NAME}</Text>
      <Text style={styles.contactText}>CONTACT: {schoolInfo.SCHOOL_PHONE}</Text>
      
      <View style={styles.studentInfoContainer}>
        <Text style={styles.studentName}>{reportData.studentName}</Text>
        <Text style={styles.classInfo}>Roll: {reportData.rollNumber} | Position: {reportData.position}</Text>
        <Text style={styles.termInfo}>Class: {reportData.className} | Term: {reportData.term}</Text>
        <Text style={styles.attendanceInfo}>Vacation Resuming: {reportData.vacationDate}</Text>
        <Text style={styles.attendanceInfo}>Points: {reportData.points} | Attendance: {reportData.attendance}</Text>
      </View>

      <Text style={styles.sectionTitle}>SUBJECT PERFORMANCE</Text>
      <View style={styles.subjectTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Subject</Text>
          <Text style={styles.headerCell}>Class Score (50%)</Text>
          <Text style={styles.headerCell}>Exam Score (50%)</Text>
          <Text style={styles.headerCell}>Total</Text>
          <Text style={styles.headerCell}>Grade</Text>
          <Text style={styles.headerCell}>Position</Text>
          <Text style={styles.headerCell}>Remarks</Text>
        </View>
        {reportData.subjects.map((subject, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.subjectCell}>{subject.name}</Text>
            <Text style={styles.scoreCell}>{subject.classScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.examScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.total || '0'}</Text>
            <Text style={styles.gradeCell}>{subject.grade || 'F'}</Text>
            <Text style={styles.scoreCell}>{subject.position || ''}</Text>
            <Text style={styles.remarksCell}>{subject.remarks || ''}</Text>
          </View>
        ))}
      </View>

      <View style={styles.remarksContainer}>
        <Text style={styles.remarksTitle}>INTEREST: {reportData.interest}</Text>
        <Text style={styles.remarksTitle}>CONDUCT: {reportData.conduct}</Text>
        <Text style={styles.remarksText}>Teacher's Remarks: {reportData.teacherRemark}</Text>
        <Text style={styles.remarksText}>Headmaster's Remarks: {reportData.headmasterRemark}</Text>
      </View>

      <View style={styles.signatureContainer}>
        <Text style={styles.signatureLine}>Teacher's Signature: ___________________</Text>
        <Text style={styles.signatureLine}>Headmaster's Signature: ___________________</Text>
      </View>
    </ScrollView>
  );

  const renderJHSReport = () => (
    <ScrollView style={styles.container}>
      <Text style={styles.schoolHeader}>{schoolInfo.SCHOOL_NAME}</Text>
      <Text style={styles.contactText}>CONTACT: {schoolInfo.SCHOOL_PHONE}</Text>
      
      <View style={styles.studentInfoContainer}>
        <Text style={styles.studentName}>{reportData.studentName}</Text>
        <Text style={styles.classInfo}>Roll: {reportData.rollNumber} | Position: {reportData.position}</Text>
        <Text style={styles.termInfo}>Class: {reportData.className} | Term: {reportData.term}</Text>
        <Text style={styles.attendanceInfo}>Promoted To: {reportData.promotedTo}</Text>
        <Text style={styles.attendanceInfo}>Attendance: {reportData.attendance}</Text>
      </View>

      <Text style={styles.sectionTitle}>CORE SUBJECTS</Text>
      <View style={styles.subjectTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Subject</Text>
          <Text style={styles.headerCell}>Class Score (50%)</Text>
          <Text style={styles.headerCell}>Exam Score (50%)</Text>
          <Text style={styles.headerCell}>Total</Text>
          <Text style={styles.headerCell}>Grade</Text>
          <Text style={styles.headerCell}>Position</Text>
          <Text style={styles.headerCell}>Remarks</Text>
        </View>
        {reportData.coreSubjects.map((subject, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.subjectCell}>{subject.name}</Text>
            <Text style={styles.scoreCell}>{subject.classScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.examScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.total || '0'}</Text>
            <Text style={styles.gradeCell}>{subject.grade || 'F'}</Text>
            <Text style={styles.scoreCell}>{subject.position || ''}</Text>
            <Text style={styles.remarksCell}>{subject.remarks || 'Excellent'}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>ELECTIVE SUBJECTS</Text>
      <View style={styles.subjectTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Subject</Text>
          <Text style={styles.headerCell}>Class Score (50%)</Text>
          <Text style={styles.headerCell}>Exam Score (50%)</Text>
          <Text style={styles.headerCell}>Total</Text>
          <Text style={styles.headerCell}>Grade</Text>
          <Text style={styles.headerCell}>Position</Text>
          <Text style={styles.headerCell}>Remarks</Text>
        </View>
        {reportData.electiveSubjects.map((subject, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.subjectCell}>{subject.name}</Text>
            <Text style={styles.scoreCell}>{subject.classScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.examScore || '0'}</Text>
            <Text style={styles.scoreCell}>{subject.total || '0'}</Text>
            <Text style={styles.gradeCell}>{subject.grade || 'F'}</Text>
            <Text style={styles.scoreCell}>{subject.position || ''}</Text>
            <Text style={styles.remarksCell}>{subject.remarks || 'Very Good'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.remarksContainer}>
        <Text style={styles.remarksTitle}>INTEREST: {reportData.interest}</Text>
        <Text style={styles.remarksTitle}>CONDUCT: {reportData.conduct}</Text>
        <Text style={styles.remarksText}>Teacher's Remarks: {reportData.teacherRemark}</Text>
        <Text style={styles.remarksText}>Headmaster's Remarks: {reportData.headmasterRemark}</Text>
      </View>

      <View style={styles.signatureContainer}>
        <Text style={styles.signatureLine}>Teacher's Signature: ___________________</Text>
        <Text style={styles.signatureLine}>Headmaster's Signature: ___________________</Text>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`${studentData.studentName}'s Report Card`} />
        {loading ? (
          <ActivityIndicator animating={true} color="aliceblue" />
        ) : (
          <Appbar.Action icon="download" onPress={handleExport} />
        )}
      </Appbar.Header>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0B6623" />
        </View>
      ) : reportData ? (
        <>
          {gradeLevel === 'pre-school' && renderPreSchoolReport()}
          {gradeLevel === 'primary' && renderPrimaryReport()}
          {gradeLevel === 'jhs' && renderJHSReport()}
        </>
      ) : (
        <Text style={styles.errorText}>No report data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
  },
  schoolHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#555',
  },
  studentInfoContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classInfo: {
    fontSize: 14,
  },
  termInfo: {
    fontSize: 14,
  },
  attendanceInfo: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  subjectTable: {
    marginVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0B6623',
    padding: 8,
  },
  headerCell: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
  },
  subjectCell: {
    flex: 2,
    textAlign: 'left',
    fontSize: 12,
  },
  scoreCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  gradeCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  levelCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  remarksCell: {
    flex: 2,
    textAlign: 'left',
    fontSize: 12,
  },
  remarksContainer: {
    marginTop: 16,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  remarksTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  remarksText: {
    marginBottom: 8,
    fontSize: 14,
  },
  signatureContainer: {
    marginTop: 24,
    padding: 8,
  },
  signatureLine: {
    marginBottom: 16,
    fontSize: 14,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});

export default ReportCardGenerator;