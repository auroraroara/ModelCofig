import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Search, Plus } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import Colors from '@/constants/Colors';

export default function ChatsScreen() {
  const { chats, isLoading } = useChat();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh chats logic would go here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const navigateToChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const navigateToNewChat = () => {
    router.push('/new-chat');
  };

  const renderChatItem = ({ item }) => {
    const lastMessage = item.lastMessage || {};
    const timeAgo = lastMessage.timestamp 
      ? formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })
      : '';
    
    return (
      <TouchableOpacity 
        style={styles.chatItem} 
        onPress={() => navigateToChat(item.id)}
        activeOpacity={0.7}
      >
        <Avatar uri={item.photoURL} size={56} />
        <View style={styles.chatInfo}>
          <View style={styles.chatNameRow}>
            <Text style={styles.chatName} numberOfLines={1}>{item.displayName}</Text>
            <Text style={styles.chatTime}>{timeAgo}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.text || 'No messages yet'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
        <Search size={20} color="#666" />
        <Text style={styles.searchText}>Search conversations</Text>
      </TouchableOpacity>

      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Start a new chat to begin messaging</Text>
          <TouchableOpacity 
            style={styles.newChatButton} 
            onPress={navigateToNewChat}
            activeOpacity={0.7}
          >
            <Text style={styles.newChatButtonText}>Start a new chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.chatsList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={navigateToNewChat}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchText: {
    fontFamily: 'Inter-Regular',
    color: '#999',
    marginLeft: 12,
    fontSize: 16,
  },
  chatsList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chatNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  chatTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  newChatButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  newChatButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});