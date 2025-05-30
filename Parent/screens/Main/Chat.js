import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ActivityIndicator, Text, KeyboardAvoidingView, SafeAreaView, Platform, Pressable, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { debounce, truncate, formatFileSize, formatMessageTime, pickDocument, pickImage, takePhoto, getFileType } from '../../utils/helpers';
import { getMessages, getChats, createChat, sendMessageApi, uploadFile, markMessageAsRead, updateMessageApi, deleteMessageApi, replyToMessage } from '../../services/CommService';
import ReactionPicker from '../../components/Communication/ReactionPicker';
import TypingIndicator from '../../components/Communication/TypingIndicator';
import MessageMenu from '../../components/Communication/MessageMenu';
import FileAttachmentPreview from '../../components/Communication/FileAttachmentPreview';
import ChatList from '../../components/Communication/ChatList';
import NewChatModal from '../../components/Communication/NewChatModal';

const ChatScreen = () => {
  const navigation = useNavigation();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const flatListRef = useRef(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  
  // Fetch chats and messages mock data
  const getChats = async () => {
  // Mock data for development
    return [
      {
        id: 'chat1',
        name: 'Jay\'s Haven',
        lastMessage: {
          sender: 'John Doe',
          content: 'Hello, how are you?',
          time: '10:30 AM',
        },
        unreadCount: 10,
        isGroup: true,
        participants: ['John Doe', 'Jane Smith', 'John Cook'],
        groupPicture: '../../assets/images/fiifi1.jpg',
      },
      {
        id: 'chat2',
        name: 'Jane Smith',
        lastMessage: {
          content: 'Are we still on for the meeting?',
          time: 'Yesterday',
        },
        unreadCount: 2,
        isGroup: false,
      },
      {
        id: 'chat3',
        name: 'John Cook',
        lastMessage: {
          content: 'Are we still on for the meeting?',
          time: 'Yesterday',
        },
        unreadCount: 2,
        isGroup: false,
      },
      {
        id: 'chat4',
        name: 'Group Chat',
        lastMessage: {
          content: 'Yes, we are on for the meeting.',
          time: 'Yesterday',
        },
        unreadCount: 0,
        isGroup: true,
        participants: ['John Doe', 'Jane Smith', 'John Cook'],
        groupPicture: '../../assets/images/fiifi1.jpg'
      },
      {
        id: 'chat5',
        name: 'Announcements',
        lastMessage: {
          content: 'Check out the latest announcements!',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat6',
        name: 'Support',
        lastMessage: {
          content: 'How can we assist you today?',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat7',
        name: 'Feedback',
        lastMessage: {
          content: 'We value your feedback!',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat8',
        name: 'General Discussion',
        lastMessage: {
          content: 'Let\'s talk about anything!',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat9',
        name: 'Project Updates',
        lastMessage: {
          content: 'New updates are available for the project.',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat10',
        name: 'Team Collaboration',
        lastMessage: {
          content: 'Let\'s collaborate on the new project.',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat11',
        name: 'Random Chat',
        lastMessage: {
          content: 'Just a random chat to test the app.',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat12',
        name: 'Test Chat',
        lastMessage: {
          content: 'This is a test chat for development purposes.',
          time: 'Today',
        },
        unreadCount: 0,
        isGroup: false,
      },
      {
        id: 'chat13',
        name: 'Test Chat',
        lastMessage: {
          content: 'This is a test chat for production purposes.',
          time: 'yesterday',
        },
        unreadCount: 0,
        isGroup: false,
      }
    ];
  }

  const getMessages = async (chatId) => {
    // Mock data for development
    return [
      {
        _id: 'msg1',
        text: 'Hello, how are you?',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'John Doe',
          avatar: '../../assets/images/fiifi1.jpg'
        },
        isRead: true,
        reactions: ['👍', '❤️'],
        attachments: []
      },
      {
        _id: 'msg2',
        text: 'I am fine, thank you!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Jane Smith',
          avatar: '../../assets/images/fiifi1.jpg'
        },
        replyTo: 'msg1',
        isRead: true,
        reactions: ['👍', '❤️', '😂'],
        attachments: [
          {
            url: '../../assets/images/fiifi1.jpg',
            type: 'image',
            name: 'image.jpg',
            size: 12345
          }
        ]
      },
      {
        _id: 'msg3',
        text: 'Are we still on for the meeting?',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'John Cook',
          avatar: '../../assets/images/fiifi1.jpg'
        },
        isRead: false,
        reactions: [],
        attachments: []
      },
      {
        _id: 'msg4',
        text: 'Yes, we are on for the meeting.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Jane Smith',
          avatar: '../../assets/images/fiifi1.jpg'
        },
        replyTo: 'msg3',
        isRead: false,
        reactions: [],
        attachments: []
      }
    ]
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const chatsData = await getChats();
      setChats(chatsData);
      
      if (chatsData.length > 0 && !activeChat) {
        setActiveChat(chatsData[0]);
        fetchMessages(chatsData[0].id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      setLoading(true);
      const data = await getMessages(chatId);
      setMessages(data);
      setShowChatList(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnnouncements = () => {
    navigation.navigate('Announcements');
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new chat
  const handleCreateChat = async (participants, isGroup, groupName) => {
    try {
      setLoading(true);
      const newChat = await createChat(participants, isGroup, groupName);
      setChats(prev => [newChat, ...prev]);
      setShowNewChatModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  // Typing indicator with debounce
  const handleTyping = useCallback(debounce(() => {
    setIsTyping(false);
  }, 1500), []);

  const handleTextInput = (text) => {
    setNewMessage(text);
    if (!isTyping) setIsTyping(true);
    handleTyping();
  };

  // Message sending with attachments and replies
  const handleSend = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    try {
      setLoading(true);
      const uploadedAttachments = await Promise.all(
        attachments.map(async (file) => {
          const formData = new FormData();
          formData.append('file', {
            uri: file.uri,
            name: file.name,
            type: file.type
          });
          
          const { url } = await uploadFile(formData);
          return { url, type: getFileType(file.name), name: file.name, size: file.size };
        })
      );

      const message = {
        content: newMessage,
        attachments: uploadedAttachments,
        reactions: [],
        timestamp: new Date().toISOString(),
        replyTo: replyingTo?.id || null
      };

      const sentMessage = await sendMessageApi(activeChat.id, message);
      setMessages(prev => [sentMessage, ...prev]);
      setNewMessage('');
      setAttachments([]);
      setReplyingTo(null);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Message interactions
  const handleReaction = async (messageId, reaction) => {
    try {
      const updatedMessage = await updateMessageApi(activeChat.id, messageId, { reactions: reaction });
      setMessages(prev => prev.map(msg => msg._id === messageId ? updatedMessage : msg));
    } catch (error) {
      Alert.alert('Error', 'Failed to add reaction');
    }
  };

  const handleEdit = async (messageId, newContent) => {
    try {
      const updatedMessage = await updateMessageApi(activeChat.id, messageId, { content: newContent });
      setMessages(prev => prev.map(msg => msg._id === messageId ? updatedMessage : msg));
    } catch (error) {
      Alert.alert('Error', 'Failed to edit message');
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteMessageApi(activeChat.id, messageId);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete message');
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleViewMessage = async (messageId) => {
    try {
      await markMessageAsRead(activeChat.id, messageId);
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      logger.error('Mark read error:', error);
    }
  };

  // Add attachment
  const handleAddAttachment = async (type) => {
    try {
      setShowAttachmentOptions(false); // Close the options modal
      let file;
      
      switch (type) {
        case 'document':
          file = await pickDocument();
          break;
        case 'image':
          file = await pickImage();
          break;
        case 'camera':
          file = await takePhoto();
          break;
        default:
          break;
      }

      if (file) {
        // Determine file type if not already set
        if (!file.type) {
          file.type = getFileType(file.name);
        }
        setAttachments(prev => [...prev, file]);
      }
    } catch (error) {
      console.error('Error adding attachment:', error);
      Alert.alert('Error', 'Failed to add attachment. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showChatList ? (
        <ChatList 
          chats={chats} 
          onSelectChat={(chat) => {
            setActiveChat(chat);
            fetchMessages(chat.id);
          }}
          onCreateNewChat={() => setShowNewChatModal(true)}
          onViewAnnouncements={handleViewAnnouncements}
        />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowChatList(true)}>
              <Ionicons name="arrow-back" size={24} color="#00873E" />
            </TouchableOpacity>
            <Text style={styles.chatTitle}>{activeChat?.name || 'Chat'}</Text>
          </View>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#00873E" />
            </View>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoidingView}
              keyboardVerticalOffset={90}
            >
              <FlatList
                ref={flatListRef}
                data={messages}
                inverted
                renderItem={({ item }) => (
                  <View style={styles.messageContainer}>
                    <MessageMenu 
                      onEdit={(newText) => handleEdit(item._id, newText)}
                      onDelete={() => handleDelete(item._id)}
                      onReply={() => handleReply(item)}
                    >
                      <TouchableOpacity 
                        onPress={() => handleViewMessage(item._id)}
                        onLongPress={() => setShowReactions(item._id)}
                        style={styles.messageTouchable}
                      >
                        <MessageBubble 
                          message={item} 
                          isMe={item.sender === 'me'} 
                          replyingTo={messages.find(m => m._id === item.replyTo)}
                        />
                      </TouchableOpacity>
                    </MessageMenu>

                    {showReactions === item._id && (
                      <ReactionPicker onSelect={(reaction) => handleReaction(item._id, reaction)} />
                    )}
                  </View>
                )}
                keyExtractor={item => item._id}
              />

              <TypingIndicator isVisible={isTyping} />

              {replyingTo && (
                <View style={styles.replyContainer}>
                  <Text style={styles.replyText}>Replying to {replyingTo.sender}</Text>
                  <Text numberOfLines={1} style={styles.replyContent}>
                    {replyingTo.content || (replyingTo.attachments?.length ? 'Attachment' : '')}
                  </Text>
                  <TouchableOpacity 
                    style={styles.cancelReply} 
                    onPress={() => setReplyingTo(null)}
                  >
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              )}

              <FileAttachmentPreview 
                attachments={attachments}
                maxAttachments={10}
                onRemove={(index) => setAttachments(prev => prev.filter((_, i) => i !== index))}
              />

              <View style={styles.inputContainer}>
                <TouchableOpacity 
                  onPress={() => setShowAttachmentOptions(true)}
                  style={styles.attachmentButton}
                >
                  <Ionicons name="attach" size={24} color="#00873E" />
                </TouchableOpacity>
                
                <TextInput
                  style={styles.input}
                  value={newMessage}
                  onChangeText={handleTextInput}
                  placeholder="Type a message..."
                  multiline
                  editable={!loading}
                />
                
                <TouchableOpacity 
                  style={styles.sendButton}
                  onPress={handleSend}
                  disabled={loading || (!newMessage && attachments.length === 0)}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="send" size={24} color="white" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Attachment Options Modal */}
              <Modal
                visible={showAttachmentOptions}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAttachmentOptions(false)}
              >
                <Pressable 
                  style={styles.modalOverlay} 
                  onPress={() => setShowAttachmentOptions(false)}
                >
                  <View style={styles.attachmentOptionsContainer}>
                    <TouchableOpacity 
                      style={styles.attachmentOption}
                      onPress={() => handleAddAttachment('image')}
                    >
                      <Ionicons name="image" size={24} color="#00873E" />
                      <Text style={styles.attachmentOptionText}>Photo Library</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.attachmentOption}
                      onPress={() => handleAddAttachment('camera')}
                    >
                      <Ionicons name="camera" size={24} color="#00873E" />
                      <Text style={styles.attachmentOptionText}>Take Photo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.attachmentOption}
                      onPress={() => handleAddAttachment('document')}
                    >
                      <Ionicons name="document" size={24} color="#00873E" />
                      <Text style={styles.attachmentOptionText}>Document</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Modal>
            </KeyboardAvoidingView>
          )}
        </>
      )}

      <NewChatModal 
        visible={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreateChat={handleCreateChat}
      />
    </SafeAreaView>
  );
};

const MessageBubble = ({ message, isMe, replyingTo }) => (
  <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
    {replyingTo && (
      <View style={styles.replyPreview}>
        <Text style={styles.replyPreviewText}>
          Replying to {replyingTo.sender}: {truncate(replyingTo.content || 'Attachment', 30)}
        </Text>
      </View>
    )}
    
    {message.attachments?.map((file, index) => (
      <View key={index} style={styles.filePreview}>
        <Ionicons 
          name={file.type === 'image' ? 'image' : 'document'} 
          size={32} 
          color="#666" 
        />
        <Text style={styles.fileName}>{truncate(file.name, 15)}</Text>
        <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
      </View>
    ))}
    
    {message.content && <Text style={styles.messageText}>{message.content}</Text>}
    
    <View style={styles.statusContainer}>
      <Text style={styles.time}>
        {formatMessageTime(message.createdAt || message.timestamp)}
      </Text>
      
      {message.reactions?.length > 0 && (
        <View style={styles.reactions}>
          {message.reactions.map((r, i) => (
            <Text key={i} style={styles.reaction}>{r}</Text>
          ))}
        </View>
      )}
      
      {isMe && (
        <Ionicons 
          name={message.read ? 'checkmark-done' : 'checkmark'} 
          size={14} 
          color={message.read ? '#00873E' : '#666'} 
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#00873E',
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
  },
attachmentButton: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentOptionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  attachmentOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00873E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
    marginVertical: 4,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: '#757575',
    marginRight: 8,
  },
  reactions: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reaction: {
    fontSize: 16,
    marginRight: 4,
  },
  filePreview: {
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  fileName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  fileSize: {
    fontSize: 10,
    color: '#757575',
  },
  messageTouchable: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  replyContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#00873E',
    marginHorizontal: 15,
    marginBottom: 5,
    borderRadius: 5,
  },
  replyText: {
    fontSize: 12,
    color: '#00873E',
    fontWeight: 'bold',
  },
  replyContent: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  cancelReply: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  replyPreview: {
    backgroundColor: 'rgba(0, 135, 62, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#00873E',
  },
  replyPreviewText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default ChatScreen;