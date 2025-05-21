import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

interface AIResponseIndicatorProps {
  isGenerating: boolean;
}

export default function AIResponseIndicator({ isGenerating }: AIResponseIndicatorProps) {
  if (!isGenerating) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={Colors.primary} />
      <Text style={styles.text}>AI is thinking...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  text: {
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.primary,
  },
});