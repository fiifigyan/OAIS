import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from 'react-native';
import bookImage from '../assets/images/fiifi1.jpg';

const HomeWorkScreen = () => {
  const [selectedDate, setSelectedDate] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newHomeworkSubject, setNewHomeworkSubject] = useState('');
  const [newHomeworkDetails, setNewHomeworkDetails] = useState('');

  const homeworkDataByDate = {
    2: [
      { id: '1', subject: 'Science', details: 'Chapter 1: 5 mark test' },
      { id: '2', subject: 'Math', details: 'Chapter 3: 10 mark test' },
    ],
    3: [
      { id: '3', subject: 'Social Studies', details: 'Chapter 4: 8 mark test' },
      { id: '4', subject: 'English', details: 'Chapter 2: 6 mark test' },
    ],
    4: [
      { id: '5', subject: 'English', details: 'Chapter 5: 7 mark test' },
      { id: '6', subject: 'Science', details: 'Chapter 2: 5 mark test' },
    ],
    5: [
      { id: '7', subject: 'Fante', details: 'Chapter 1: 5 mark test' },
      { id: '8', subject: 'English', details: 'Chapter 4: 8 mark test' },
    ],
    6: [
      { id: '9', subject: 'Maths', details: 'Chapter 2: 8 mark test' },
      { id: '10', subject: 'Social Studies', details: 'Chapter 8: 10 mark test' },
    ],
    7: [
      { id: '11', subject: 'ICT', details: 'Chapter 6: 4 mark test' },
      { id: '12', subject: 'Home Economics', details: 'Chapter 9: 6 mark test' },
    ],
  };

  const handleAddHomework = () => {
    if (newHomeworkSubject && newHomeworkDetails) {
      const newHomework = {
        id: String(Object.keys(homeworkDataByDate[selectedDate] || []).length + 1),
        subject: newHomeworkSubject,
        details: newHomeworkDetails,
      };
      homeworkDataByDate[selectedDate] = [...(homeworkDataByDate[selectedDate] || []), newHomework];
      setIsModalVisible(false);
      setNewHomeworkSubject('');
      setNewHomeworkDetails('');
    }
  };

  const renderHomeworkItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={bookImage} style={styles.icon} />
      <View style={styles.cardContent}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Text style={styles.details}>{item.details}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Calendar Section */}
      <View style={styles.calendar}>
        <Text style={styles.monthYear}>September 2024</Text>
        <View style={styles.weekDays}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                selectedDate === index + 2 && styles.selectedDateContainer,
              ]}
              onPress={() => setSelectedDate(index + 2)}
            >
              <Text style={styles.day}>{day}</Text>
              <Text
                style={[
                  styles.date,
                  selectedDate === index + 2 && styles.selectedDateText,
                ]}
              >
                {index + 2}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Homework List */}
      <FlatList
        data={homeworkDataByDate[selectedDate] || []}
        renderItem={renderHomeworkItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.homeworkList}
      />

      {/* Add Homework Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Homework</Text>
      </TouchableOpacity>

      {/* Add Homework Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Homework</Text>
            <TextInput
              style={styles.input}
              placeholder="Subject"
              value={newHomeworkSubject}
              onChangeText={setNewHomeworkSubject}
            />
            <TextInput
              style={styles.input}
              placeholder="Details"
              value={newHomeworkDetails}
              onChangeText={setNewHomeworkDetails}
            />
            <Button title="Add Homework" onPress={handleAddHomework} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  calendar: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  monthYear: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayContainer: {
    alignItems: 'center',
    padding: 10,
  },
  day: {
    fontSize: 14,
    color: '#888',
  },
  date: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  selectedDateContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  selectedDateText: {
    color: '#fff',
  },
  homeworkList: {
    paddingTop: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default HomeWorkScreen;