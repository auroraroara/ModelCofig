import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useChat } from '@/context/ChatContext';
import { Search, UserPlus } from 'lucide-react-native';
import Avatar from '@/components/Avatar';
import Colors from '@/constants/Colors';

export default function ContactsScreen() {
  const { contacts } = useChat();
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredContacts = contacts.filter(contact => 
    contact.displayName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleStartChat = (contactId: string) => {
    router.push(`/chat/${contactId}`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Contact refresh logic would go here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderContactItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contactItem} 
      onPress={() => handleStartChat(item.id)}
      activeOpacity={0.7}
    >
      <Avatar uri={item.photoURL} size={56} />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.displayName}</Text>
        <Text style={styles.contactEmail} numberOfLines={1}>{item.email}</Text>
      </View>
      <TouchableOpacity 
        style={styles.chatButton} 
        onPress={() => handleStartChat(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
          <Text style={styles.emptySubtext}>
            {searchText 
              ? `No results for "${searchText}"`
              : "You don't have any contacts yet"}
          </Text>
          {!searchText && (
            <TouchableOpacity 
              style={styles.inviteButton} 
              activeOpacity={0.7}
            >
              <UserPlus size={20} color="#fff" />
              <Text style={styles.inviteButtonText}>Invite friends</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.contactsList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  contactsList: {
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  contactEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  chatButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  chatButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  inviteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
});