import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { SendHorizontal, ArrowLeft, MoveVertical as MoreVertical } from 'lucide-react-native';
import { formatRelative } from 'date-fns';
import Avatar from '@/components/Avatar';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';
import AIResponseIndicator from '@/components/AIResponseIndicator';
import Colors from '@/constants/Colors';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { getChatById, sendMessage, messages, isLoading, isGeneratingResponse } = useChat();
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const chatData = getChatById(id);
      setChat(chatData);
    }
  }, [id, getChatById]);

  const handleSend = () => {
    if (messageText.trim() && user && chat) {
      sendMessage({
        chatId: id as string,
        text: messageText,
        senderId: user.uid,
        timestamp: new Date().toISOString(),
      });
      setMessageText('');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderMessageItem = ({ item }) => {
    const isUserMessage = item.senderId === user?.uid;
    const date = new Date(item.timestamp);
    const formattedTime = formatRelative(date, new Date());

    return (
      <ChatBubble
        message={item.text}
        isUser={isUserMessage}
        time={formattedTime}
        status={item.status || 'sent'}
      />
    );
  };

  if (isLoading || !chat) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isAIChat = id === 'ai-assistant';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerProfile} activeOpacity={0.7}>
          <Avatar uri={chat.photoURL} size={40} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{chat.displayName}</Text>
            <Text style={styles.headerStatus}>
              {isAIChat ? 'AI Assistant' : (chat.isOnline ? 'Online' : 'Offline')}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages[id as string] || []}
        keyExtractor={(item, index) => `${item.id || index}`}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        onContentSizeChange={() => {
          if (flatListRef.current && messages[id as string]?.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />

      {isTyping && <TypingIndicator name={chat.displayName} />}
      {isAIChat && <AIResponseIndicator isGenerating={isGeneratingResponse} />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder={isAIChat ? "Ask me anything..." : "Type a message..."}
          placeholderTextColor="#999"
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            !messageText.trim() && styles.sendButtonDisabled
          ]} 
          onPress={handleSend}
          disabled={!messageText.trim()}
        >
          <SendHorizontal size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
  },
  headerStatus: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 48,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    bottom: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});