import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { TOKENS } from '../../constants/tokens';

export type NodeStatus = 'online' | 'degraded' | 'offline';

export function NodeDot({ status, size = 7 }: { status: NodeStatus; size?: number }) {
  const activeTheme = TOKENS.colors.dark;
  
  let color = activeTheme.acc;
  if (status === 'degraded') color = activeTheme.warn;
  if (status === 'offline') color = activeTheme.danger;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (status === 'online') {
      scale.value = withRepeat(withTiming(1.4, { duration: 2000, easing: Easing.out(Easing.ease) }), -1);
      opacity.value = withRepeat(withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) })
      ), -1);
    } else {
      scale.value = 1;
      opacity.value = 0;
    }
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {status === 'online' && (
        <Animated.View
          style={[
            styles.pulse,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
            animatedStyle,
          ]}
        />
      )}
      <View style={[styles.dot, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
  },
  pulse: {
    position: 'absolute',
  },
});
