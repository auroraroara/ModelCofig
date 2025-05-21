import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, withDelay } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

interface TypingIndicatorProps {
  name: string;
}

export default function TypingIndicator({ name }: TypingIndicatorProps) {
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  // Animate the dots
  React.useEffect(() => {
    dot1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 400 })
      ),
      -1
    );

    dot2Opacity.value = withRepeat(
      withSequence(
        withDelay(200, 
          withTiming(1, { duration: 400 })
        ),
        withTiming(0.3, { duration: 400 })
      ),
      -1
    );

    dot3Opacity.value = withRepeat(
      withSequence(
        withDelay(400, 
          withTiming(1, { duration: 400 })
        ),
        withTiming(0.3, { duration: 400 })
      ),
      -1
    );
  }, []);

  const dot1Style = useAnimatedStyle(() => {
    return {
      opacity: dot1Opacity.value,
    };
  });

  const dot2Style = useAnimatedStyle(() => {
    return {
      opacity: dot2Opacity.value,
    };
  });

  const dot3Style = useAnimatedStyle(() => {
    return {
      opacity: dot3Opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} is typing</Text>
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, dot1Style]} />
        <Animated.View style={[styles.dot, dot2Style]} />
        <Animated.View style={[styles.dot, dot3Style]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginHorizontal: 2,
  },
});