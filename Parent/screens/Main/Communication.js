import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  RefreshControl,
  Modal,
  ActivityIndicator
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  pickDocument, 
  pickImage, 
  takePhoto, 
  getFileType, 
  formatFileSize,
  getMessageStatus,
  formatMessageTime } from '../../utils/helpers';
import { uploadFile } from '../../services/CommService';

const mockMessages = [
  {
    id: '1',
    sender: 'Teacher Smith',
    senderImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    content: 'Johnny did great in math today! He solved all the problems correctly.',
    timestamp: '2023-10-10T09:30:00',
    isMe: false,
    unread: false
  },
  {
    id: '2',
    sender: 'You',
    senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'Just confirming Johnny will be absent next Tuesday for his dentist appointment',
    timestamp: '2023-10-08T14:15:00',
    isMe: true,
    unread: false
  },
  {
    id: '3',
    sender: 'School Admin',
    senderImage: 'https://randomuser.me/api/portraits/women/60.jpg',
    content: 'Reminder: Parent-teacher conferences next week. Please sign up for a slot.',
    timestamp: '2023-10-05T11:45:00',
    isMe: false,
    unread: true
  },
  {
    id: '4',
    sender: 'You',
    senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'Thanks for the reminder. I will be there.',
    timestamp: '2023-10-05T12:00:00',
    isMe: true,
    unread: false
  }
];

const mockAnnouncements = [
  {
    id: '1',
    title: 'School Closed Monday',
    content: 'School will be closed next Monday for professional development day. Please make alternative childcare arrangements.',
    date: '2023-10-09',
    priority: 'high',
    attachments: 1
  },
  {
    id: '2',
    title: 'Fall Festival',
    content: 'Join us for our annual Fall Festival on October 30th from 3-6pm. Food, games, and fun for the whole family!',
    date: '2023-10-02',
    priority: 'normal',
    attachments: 0
  },
  {
    id: '3',
    title: 'Winter Break',
    content: 'Winter break starts on December 15th. We will be closed for the holidays.',
    date: '2023-12-15',
    priority: 'low',
    attachments: 2
  }
];

const mockTeachers = [
  { label: 'Ms. Sarah Johnson (Math)', value: 'Ms. Sarah Johnson', image: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { label: 'Mr. David Wilson (Science)', value: 'Mr. David Wilson', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { label: 'Mrs. Emily Brown (English)', value: 'Mrs. Emily Brown', image: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { label: 'Mr. Michael Davis (History)', value: 'Mr. Michael Davis', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { label: 'Ms. Jessica Taylor (Art)', value: 'Ms. Jessica Taylor', image: 'https://randomuser.me/api/portraits/women/55.jpg' },
];

const mockChildren = [
  { label: 'Johnny Smith (Grade 5)', value: 'Johnny Smith' },
  { label: 'Samantha Smith (Grade 2)', value: 'Samantha Smith' },
  { label: 'Michael Johnson (Grade 1)', value: 'Michael Johnson' },
  { label: 'Emily Davis (Grade 3)', value: 'Emily Davis' },
  { label: 'Sophia Brown (Grade 4)', value: 'Sophia Brown' },
  { label: 'Liam Wilson (Grade 6)', value: 'Liam Wilson' },
  { label: 'Olivia Taylor (Grade 7)', value: 'Olivia Taylor' },
  { label: 'Noah Anderson (Grade 8)', value: 'Noah Anderson' },
];

const recipientOptions = [
  { label: 'Class Teacher', value: 'Class Teacher' },
  { label: 'Subject Teacher', value: 'Subject Teacher' },
  { label: 'School Admin', value: 'School Admin' },
  { label: 'All Teachers', value: 'All Teachers' },
];
const CommunicationScreen = () => {
  // State
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [recipientType, setRecipientType] = useState('Class Teacher');
  const [specificRecipient, setSpecificRecipient] = useState('');
  const [specificChild, setSpecificChild] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [replyingTo, setReplyingTo] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const flatListRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    fetchMessages();
    fetchAnnouncements();
  }, []);

  const fetchMessages = async () => {
    try {
      setRefreshing(true);
      // Replace with your API call
      // const response = await getMessages();
      // setMessages(response.data);
      setMessages(mockMessages);
    } catch (error) {
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      // Replace with your API call
      // const response = await getAnnouncements();
      // setAnnouncements(response.data);
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      Alert.alert('Error', 'Failed to load announcements');
    }
  };

  const onRefresh = () => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else {
      fetchAnnouncements();
    }
  };

  const handleRecipientChange = (value) => {
    setRecipientType(value);
    setShowSearch(value === 'Subject Teacher');
    setSpecificRecipient('');
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearch = () => {
    if (recipientType === 'Subject Teacher') {
      setSearchResults(mockTeachers.filter(teacher => 
        teacher.label.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  };

  const selectRecipient = (recipient) => {
    setSpecificRecipient(recipient);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleAddAttachment = async (type) => {
    try {
      let attachment;
      switch (type) {
        case 'document':
          attachment = await pickDocument();
          break;
        case 'image':
          attachment = await pickImage();
          break;
        case 'camera':
          attachment = await takePhoto();
          break;
        default:
          return;
      }

      if (attachment) {
        setAttachments(prev => [...prev, attachment]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add attachment');
    } finally {
      setShowAttachmentOptions(false);
    }
  };

  const handleRemoveAttachment = (attachmentToRemove) => {
    setAttachments(prev => prev.filter(a => a.uri !== attachmentToRemove.uri));
  };

  const uploadAttachments = async () => {
    const uploadedAttachments = [];
    
    for (const attachment of attachments) {
      try {
        setIsLoading(true);
        setUploadProgress(0);
        
        const formData = new FormData();
        formData.append('file', {
          uri: attachment.uri,
          name: attachment.name,
          type: attachment.type,
        });

        const response = await uploadFile(formData, (progress) => {
          setUploadProgress(progress);
        });

        uploadedAttachments.push({
          name: attachment.name,
          url: response.data.url,
          type: getFileType(attachment.name),
          size: attachment.size,
        });
      } catch (error) {
        logger.error('Error uploading attachment', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    }

    return uploadedAttachments;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) {
      Alert.alert('Error', 'Please enter a message or add an attachment');
      return;
    }

    try {
      setIsLoading(true);
      
      // Upload attachments if any
      let uploadedAttachments = [];
      if (attachments.length > 0) {
        uploadedAttachments = await uploadAttachments();
      }

      // Prepare message data
      const messageData = {
        content: newMessage,
        recipientType,
        specificRecipient,
        specificChild,
        attachments: uploadedAttachments,
        repliedTo: replyingTo?.id || null,
      };

      // Replace with your API call
      // const response = await sendMessageApi(messageData);
      
      // For demo purposes, we'll add it locally
      const newMessageObj = {
        id: Date.now().toString(),
        sender: 'You',
        senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: newMessage,
        timestamp: new Date().toISOString(),
        isMe: true,
        unread: false,
        readAt: null,
        deliveredAt: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        attachments: uploadedAttachments,
        repliedTo: replyingTo?.id || null,
      };

      setMessages(prev => [newMessageObj, ...prev]);
      setNewMessage('');
      setAttachments([]);
      setReplyingTo(null);
      setSpecificRecipient('');
      
      // Scroll to top
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Replace with your API call
      // await markMessageAsRead(id);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? {...msg, unread: false, readAt: new Date().toISOString()} : msg
        )
      );
    } catch (error) {
      logger.error('Error marking message as read', error);
    }
  };

  // Render components
  const AttachmentPreview = ({ attachment, onRemove }) => {
    const fileType = getFileType(attachment.name);
    const iconName = {
      image: 'image',
      pdf: 'document',
      document: 'document-text',
      spreadsheet: 'document-attach',
      video: 'videocam',
      audio: 'musical-notes',
      unknown: 'document'
    }[fileType];

    return (
      <View style={styles.attachmentPreview}>
        <Ionicons name={iconName} size={24} color="#3498db" />
        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentName} numberOfLines={1}>
            {attachment.name}
          </Text>
          <Text style={styles.attachmentSize}>
            {formatFileSize(attachment.size)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onRemove(attachment)}>
          <Ionicons name="close" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  };

  const ReplyPreview = ({ message, onCancel }) => {
    return (
      <View style={styles.replyPreview}>
        <View style={styles.replyPreviewContent}>
          <Text style={styles.replyPreviewSender}>
            Replying to {message.sender}
          </Text>
          <Text style={styles.replyPreviewText} numberOfLines={1}>
            {message.content}
          </Text>
        </View>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  };

  const MessageStatus = ({ message }) => {
    const status = getMessageStatus(message);
    const iconName = {
      read: 'checkmark-done',
      delivered: 'checkmark-done',
      sent: 'checkmark',
      pending: 'time'
    }[status];

    const iconColor = {
      read: '#00873E',
      delivered: '#3498db',
      sent: '#7f8c8d',
      pending: '#7f8c8d'
    }[status];

    return (
      <View style={styles.messageStatus}>
        <Ionicons name={iconName} size={14} color={iconColor} />
        <Text style={[styles.timestamp, { marginLeft: 4 }]}>
          {formatMessageTime(message.timestamp)}
        </Text>
      </View>
    );
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.messageContainer,
        item.isMe ? styles.myMessage : styles.otherMessage,
        item.unread && styles.unreadMessage
      ]}
      onPress={() => markAsRead(item.id)}
      onLongPress={() => setReplyingTo(item)}
    >
      {!item.isMe && (
        <Image 
          source={{ uri: item.senderImage }} 
          style={styles.senderImage}
        />
      )}
      <View style={styles.messageContentContainer}>
        {item.repliedTo && (
          <View style={styles.repliedToContainer}>
            <Text style={styles.repliedToText}>
              Replying to: {messages.find(m => m.id === item.repliedTo)?.content}
            </Text>
          </View>
        )}
        <Text style={styles.senderName}>{item.sender}</Text>
        <Text style={styles.messageContent}>{item.content}</Text>
        
        {item.attachments && item.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            {item.attachments.map((attachment, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.attachmentItem}
                onPress={() => handleViewAttachment(attachment)}
              >
                <Ionicons 
                  name={getFileType(attachment.name) === 'image' ? 'image' : 'document-attach'} 
                  size={20} 
                  color="#3498db" 
                />
                <Text style={styles.attachmentText}>
                  {attachment.name} ({formatFileSize(attachment.size)})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <MessageStatus message={item} />
      </View>
    </TouchableOpacity>
  );

  const renderAnnouncement = ({ item }) => (
    <View style={[
      styles.announcementCard,
      item.priority === 'high' && styles.highPriorityCard
    ]}>
      <View style={styles.announcementHeader}>
        <Text style={[
          styles.announcementTitle,
          item.priority === 'high' && styles.highPriorityTitle
        ]}>
          {item.title}
        </Text>
        {item.priority === 'high' && (
          <Ionicons name="alert-circle" size={20} color="#e74c3c" />
        )}
      </View>
      <Text style={styles.announcementDate}>{item.date}</Text>
      <Text style={styles.announcementContent}>{item.content}</Text>
      {item.attachments > 0 && (
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach-outline" size={16} color="#3498db" />
          <Text style={styles.attachmentText}>1 attachment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          {/* implement back arrow functionality */}
          <Ionicons name="arrow-back" size={20} color="#00873E" />
        </TouchableOpacity>
        <Text style={styles.title}>Parent Communication</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'messages' && styles.activeTab
          ]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'messages' && styles.activeTabText
          ]}>
            Messages
          </Text>
          {messages.some(m => m.unread) && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {messages.filter(m => m.unread).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'announcements' && styles.activeTab
          ]}
          onPress={() => setActiveTab('announcements')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'announcements' && styles.activeTabText
          ]}>
            Announcements
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'messages' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexContainer}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            inverted
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#00873E']}
              />
            }
          />

          <View style={styles.composeContainer}>
            {replyingTo && (
              <ReplyPreview 
                message={replyingTo} 
                onCancel={() => setReplyingTo(null)} 
              />
            )}

            {attachments.length > 0 && (
              <View style={styles.attachmentsPreview}>
                {attachments.map((attachment, index) => (
                  <AttachmentPreview
                    key={index}
                    attachment={attachment}
                    onRemove={handleRemoveAttachment}
                  />
                ))}
              </View>
            )}

            <View style={styles.recipientRow}>
              <View style={styles.recipientContainer}>
                <RNPickerSelect
                  onValueChange={handleRecipientChange}
                  items={recipientOptions}
                  value={recipientType}
                  style={pickerStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  Icon={() => {
                    return <Ionicons name="chevron-down" size={16} color="#3498db" />;
                  }}
                />
              </View>

              <View style={styles.childContainer}>
                <RNPickerSelect
                  onValueChange={setSpecificChild}
                  items={mockChildren}
                  value={specificChild}
                  style={pickerStyles}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: 'Select child', value: '' }}
                  Icon={() => {
                    return <Ionicons name="chevron-down" size={16} color="#3498db" />;
                  }}
                />
              </View>
            </View>

            {showSearch && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                >
                  <Ionicons name="search" size={20} color="aliceblue" />
                </TouchableOpacity>
              </View>
            )}

            {searchResults.length > 0 && (
              <View style={styles.resultsContainer}>
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.resultItem}
                    onPress={() => selectRecipient(item.value)}
                  >
                    <Image source={{ uri: item.image }} style={styles.resultImage} />
                    <Text style={styles.resultText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {(specificRecipient || recipientType) && (
              <View style={styles.selectedRecipientContainer}>
                <Text style={styles.selectedRecipientText}>
                  To: {specificRecipient || recipientType}
                  {specificChild && ` (${specificChild})`}
                </Text>
                {specificRecipient && (
                  <TouchableOpacity onPress={() => setSpecificRecipient('')}>
                    <Ionicons name="close" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TextInput
              style={styles.messageInput}
              placeholder="Type your message here..."
              multiline
              value={newMessage}
              onChangeText={setNewMessage}
            />

            <View style={styles.messageActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowAttachmentOptions(true)}
              >
                <Ionicons name="attach-outline" size={20} color="#00873E" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#00873E" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={(!newMessage.trim() && attachments.length === 0) || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="aliceblue" />
                ) : (
                  <Ionicons name="send" size={20} color="aliceblue" />
                )}
              </TouchableOpacity>
            </View>

            <Modal
              visible={showAttachmentOptions}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowAttachmentOptions(false)}
            >
              <View style={styles.attachmentOptionsModal}>
                <View style={styles.attachmentOptionsContainer}>
                  <Text style={styles.attachmentOptionsTitle}>Add Attachment</Text>
                  <View style={styles.attachmentOptionsRow}>
                    <TouchableOpacity 
                      style={styles.attachmentOption}
                      onPress={() => handleAddAttachment('document')}
                    >
                      <Ionicons name="document" size={32} color="#3498db" />
                      <Text style={styles.attachmentOptionText}>Document</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.attachmentOption}
                      onPress={() => handleAddAttachment('image')}
                    >
                      <Ionicons name="image" size={32} color="#3498db" />
                      <Text style={styles.attachmentOptionText}>Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.attachmentOption}
                      onPress={() => handleAddAttachment('camera')}
                    >
                      <Ionicons name="camera" size={32} color="#3498db" />
                      <Text style={styles.attachmentOptionText}>Camera</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowAttachmentOptions(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {isLoading && uploadProgress > 0 && (
              <View style={styles.uploadProgressContainer}>
                <Text style={styles.uploadProgressText}>
                  Uploading: {Math.round(uploadProgress)}%
                </Text>
                <View style={styles.uploadProgressBar}>
                  <View 
                    style={[
                      styles.uploadProgressFill,
                      { width: `${uploadProgress}%` }
                    ]} 
                  />
                </View>
              </View>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      )}

      {activeTab === 'announcements' && (
        <FlatList
          data={announcements}
          renderItem={renderAnnouncement}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.announcementsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#00873E']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'aliceblue',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: 'aliceblue',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#00873E',
    borderRadius: 10,
  },
  tabButtonText: {
    fontWeight: '600',
    color: '#00873E',
  },
  activeTabText: {
    color: 'aliceblue',
  },
  unreadBadge: {
    backgroundColor: '#00873E',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  unreadBadgeText: {
    color: 'aliceblue',
    fontSize: 12,
    fontWeight: 'bold',
  },
  composeContainer: {
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    backgroundColor: 'aliceblue',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  recipientRow: {
    flexDirection: 'row',
  },
  recipientContainer: {
    flex: 2,
    marginRight: 10,
  },
  childContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    backgroundColor: 'aliceblue',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  searchButton: {
    width: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00873E',
  },
  resultsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'aliceblue',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  resultText: {
    color: '#2c3e50',
  },
  selectedRecipientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ebf5fb',
    borderRadius: 5,
  },
  selectedRecipientText: {
    color: '#3498db',
    fontWeight: '500',
  },
  messageInput: {
    maxHeight: 100,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: 'aliceblue',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00873E',
  },
  messagesList: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    backgroundColor: 'aliceblue',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  unreadMessage: {
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3f2fd',
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  senderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContentContainer: {
    flex: 1,
  },
  senderName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#03C04A',
  },
  messageContent: {
    lineHeight: 20,
    color: '#34495e',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  unreadDot: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  announcementsList: {
    padding: 16,
  },
  announcementCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'aliceblue',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  highPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  highPriorityTitle: {
    color: '#e74c3c',
  },
  announcementDate: {
    color: '#7f8c8d',
    marginBottom: 8,
    fontSize: 14,
  },
  announcementContent: {
    lineHeight: 22,
    color: '#34495e',
    marginBottom: 8,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ebf5fb',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  attachmentText: {
    color: '#3498db',
    marginLeft: 5,
    fontWeight: '500',
  },
    attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ebf5fb',
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  attachmentName: {
    color: '#2c3e50',
    fontSize: 14,
  },
  attachmentSize: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  attachmentsContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  attachmentText: {
    color: '#3498db',
    marginLeft: 4,
    fontSize: 14,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
    borderRadius: 4,
    marginBottom: 8,
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewSender: {
    color: '#3498db',
    fontSize: 12,
    fontWeight: '500',
  },
  replyPreviewText: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  repliedToContainer: {
    padding: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 4,
  },
  repliedToText: {
    color: '#7f8c8d',
    fontSize: 12,
    fontStyle: 'italic',
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  attachmentOptionsModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  attachmentOptionsContainer: {
    backgroundColor: 'aliceblue',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  attachmentOptionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  attachmentOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  attachmentOption: {
    alignItems: 'center',
    padding: 10,
  },
  attachmentOptionText: {
    marginTop: 8,
    color: '#2c3e50',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'aliceblue',
    fontWeight: 'bold',
  },
  uploadProgressContainer: {
    marginTop: 10,
  },
  uploadProgressText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  uploadProgressBar: {
    height: 4,
    backgroundColor: '#ecf0f1',
    borderRadius: 2,
    overflow: 'hidden',
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: '#00873E',
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    color: '#2c3e50',
    paddingRight: 30,
    backgroundColor: 'aliceblue',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    color: '#2c3e50',
    paddingRight: 30,
    backgroundColor: 'aliceblue',
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
};

export default CommunicationScreen;