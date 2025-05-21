import React from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/Colors';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  name?: string;
}

export default function Avatar({ uri, size = 40, name }: AvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderAvatar = () => {
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 }
          ]}
        />
      );
    }

    return (
      <View
        style={[
          styles.fallbackAvatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: Colors.primary + '60',
          }
        ]}
      >
        <Text
          style={[
            styles.fallbackText,
            { fontSize: size * 0.4 }
          ]}
        >
          {name ? getInitials(name) : '?'}
        </Text>
      </View>
    );
  };

  return renderAvatar();
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#e1e1e1',
  },
  fallbackAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
});