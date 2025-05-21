import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { googleApi } from '@/services/googleApi';

// Mock data for demo purposes
const MOCK_CHATS = [
  {
    id: '1',
    displayName: 'John Doe',
    photoURL: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: {
      text: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      senderId: '2',
    },
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    displayName: 'Jane Smith',
    photoURL: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: {
      text: 'Let me know when you\'re free to chat!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      senderId: '1',
    },
    unreadCount: 0,
    isOnline: false,
  },
];

const MOCK_CONTACTS = [
  {
    id: '1',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    photoURL: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: true,
  },
  {
    id: '2',
    displayName: 'Jane Smith',
    email: 'jane.smith@example.com',
    photoURL: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: false,
  },
  {
    id: '3',
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    photoURL: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: true,
  },
  {
    id: 'ai-assistant',
    displayName: 'AI Assistant',
    email: 'ai@assistant.com',
    photoURL: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    isOnline: true,
  },
];

const MOCK_MESSAGES = {
  '1': [
    {
      id: '101',
      text: 'Hey there!',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'read',
    },
    {
      id: '102',
      text: 'Hi! How are you doing?',
      senderId: '2', // Current user
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'read',
    },
    {
      id: '103',
      text: 'I\'m doing well, thanks for asking. How about you?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      status: 'read',
    },
    {
      id: '104',
      text: 'Pretty good! Just working on some projects.',
      senderId: '2', // Current user
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      status: 'delivered',
    },
    {
      id: '105',
      text: 'Hey, how are you doing?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'delivered',
    },
  ],
  '2': [
    {
      id: '201',
      text: 'Hello!',
      senderId: '2', // Current user
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'read',
    },
    {
      id: '202',
      text: 'Hi there! I was wondering if you\'d like to meet up this weekend?',
      senderId: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'read',
    },
    {
      id: '203',
      text: 'Let me know when you\'re free to chat!',
      senderId: '2', // Current user
      timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(),
      status: 'delivered',
    },
  ],
  'ai-assistant': [],
};

interface Message {
  id?: string;
  text: string;
  senderId: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface SendMessageParams {
  chatId: string;
  text: string;
  senderId: string;
  timestamp: string;
}

interface ChatContextType {
  chats: any[];
  contacts: any[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  isGeneratingResponse: boolean;
  sendMessage: (params: SendMessageParams) => void;
  getChatById: (id: string) => any;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState(MOCK_CHATS);
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getChatById = (id: string) => {
    return chats.find(chat => chat.id === id) || contacts.find(contact => contact.id === id);
  };

  const generateAIResponse = async (text: string) => {
    setIsGeneratingResponse(true);
    try {
      const response = await googleApi.generateResponse(text);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'I apologize, but I encountered an error while processing your message. Please try again.';
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const sendMessage = async ({ chatId, text, senderId, timestamp }: SendMessageParams) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId,
      timestamp,
      status: 'sent',
    };

    setMessages(prev => {
      const chatMessages = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: [...chatMessages, newMessage],
      };
    });

    // Update the last message in chats
    setChats(prev => {
      return prev.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: {
              text,
              timestamp,
              senderId,
            },
            unreadCount: senderId === user?.uid ? 0 : chat.unreadCount + 1,
          };
        }
        return chat;
      });
    });

    // Generate AI response if messaging the AI assistant
    if (chatId === 'ai-assistant') {
      const aiResponse = await generateAIResponse(text);
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        senderId: 'ai-assistant',
        timestamp: new Date().toISOString(),
        status: 'sent',
      };

      setMessages(prev => ({
        ...prev,
        'ai-assistant': [...(prev['ai-assistant'] || []), aiMessage],
      }));
    }

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => {
        const chatMessages = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: chatMessages.map(message => {
            if (message.id === newMessage.id) {
              return { ...message, status: 'delivered' };
            }
            return message;
          }),
        };
      });
    }, 1000);

    setTimeout(() => {
      setMessages(prev => {
        const chatMessages = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: chatMessages.map(message => {
            if (message.id === newMessage.id) {
              return { ...message, status: 'read' };
            }
            return message;
          }),
        };
      });
    }, 2000);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        chats, 
        contacts, 
        messages, 
        isLoading,
        isGeneratingResponse,
        sendMessage,
        getChatById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}