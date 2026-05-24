import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, interpolateColor } from 'react-native-reanimated';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;

interface ToggleProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

export function Toggle({ value, onChange }: ToggleProps) {
  const isEnabled = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    isEnabled.value = withTiming(value ? 1 : 0, { duration: 200, easing: Easing.out(Easing.ease) });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        isEnabled.value,
        [0, 1],
        [activeTheme.raised, activeTheme.accD]
      ),
      borderColor: interpolateColor(
        isEnabled.value,
        [0, 1],
        [activeTheme.bdr, activeTheme.accB]
      ),
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: isEnabled.value * 16 }],
      backgroundColor: interpolateColor(
        isEnabled.value,
        [0, 1],
        [activeTheme.tx3, activeTheme.acc]
      ),
    };
  });

  return (
    <Pressable onPress={() => onChange?.(!value)}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 38,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    left: 2,
  },
});
