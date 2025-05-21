import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { LogIn } from 'lucide-react-native';

export default function LoginScreen() {
  const { user, signIn, isAuthLoading } = useAuth();

  useEffect(() => {
    // Redirect to tabs if user is already logged in
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/3957616/pexels-photo-3957616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
          style={styles.logoImage}
        />
        <Text style={styles.title}>ChatSync</Text>
        <Text style={styles.subtitle}>Connect with Google, chat with anyone</Text>
      </View>

      <View style={styles.loginContainer}>
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={signIn}
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <LogIn color="#fff" size={20} />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eae7f3',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#3d0446',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: '#8e0530',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  googleButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 12,
  },
  footer: {
    marginBottom: 32,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});