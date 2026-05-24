import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, withRepeat, withSequence } from 'react-native-reanimated';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProgressBarProps {
  value: number; // 0 to 100
  fill?: string;
  isShimmering?: boolean;
}

export function ProgressBar({ value, fill = activeTheme.acc, isShimmering = false }: ProgressBarProps) {
  const widthAnim = useSharedValue(0);
  const shimmerTrans = useSharedValue(-SCREEN_WIDTH);

  useEffect(() => {
    widthAnim.value = withTiming(value, { duration: 600, easing: Easing.out(Easing.ease) });
  }, [value]);

  useEffect(() => {
    if (isShimmering) {
      shimmerTrans.value = withRepeat(
        withSequence(
          withTiming(-100, { duration: 0 }),
          withTiming(SCREEN_WIDTH, { duration: 1500, easing: Easing.linear })
        ),
        -1
      );
    }
  }, [isShimmering]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${widthAnim.value}%`,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTrans.value }],
    opacity: isShimmering ? 1 : 0,
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { backgroundColor: fill }, fillStyle]}>
        {isShimmering && (
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 3,
    backgroundColor: activeTheme.raised,
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFill as object,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
