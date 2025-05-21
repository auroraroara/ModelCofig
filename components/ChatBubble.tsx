import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function ChatBubble({ message, isUser, time, status = 'sent' }: ChatBubbleProps) {
  const renderMessageStatus = () => {
    if (!isUser) return null;

    switch (status) {
      case 'read':
        return <CheckCheck size={14} color="#4CAF50" style={styles.statusIcon} />;
      case 'delivered':
        return <CheckCheck size={14} color="#999" style={styles.statusIcon} />;
      case 'sent':
      default:
        return <Check size={14} color="#999" style={styles.statusIcon} />;
    }
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.otherContainer]}>
      <View 
        style={[
          styles.bubble, 
          isUser ? styles.userBubble : styles.otherBubble
        ]}
      >
        <Text style={[styles.message, isUser ? styles.userMessage : styles.otherMessage]}>
          {message}
        </Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{time}</Text>
          {renderMessageStatus()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  userBubble: {
    backgroundColor: Colors.primary,
  },
  otherBubble: {
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  userMessage: {
    color: '#fff',
  },
  otherMessage: {
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 11,
    color: '#ccc',
    marginRight: 4,
    fontFamily: 'Inter-Regular',
  },
  statusIcon: {
    marginLeft: 2,
  },
});