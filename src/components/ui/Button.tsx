import React, { useState } from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { TOKENS } from '../../constants/tokens';

// Helper to determine active theme (using hardcoded dark for now as per prompt default)
const activeTheme = TOKENS.colors.dark;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonState = 'default' | 'loading' | 'success' | 'error';

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  status?: ButtonState;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function PrimaryButton({ label, icon, onPress, status = 'default', style, fullWidth = true }: ButtonProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  React.useEffect(() => {
    if (status === 'error') {
      translateX.value = withSequence(
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(4, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [status]);

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading || isSuccess}
      style={[
        styles.primaryBase,
        fullWidth && { width: '100%' },
        isSuccess && styles.primarySuccess,
        status === 'error' && styles.primaryError,
        animatedStyle,
        style,
      ]}
    >
      {({ pressed }) => (
        <View style={[styles.contentRow, { opacity: pressed && status === 'default' ? 0.88 : 1 }]}>
          {isLoading ? (
            <ActivityIndicator color={activeTheme.void} size="small" style={styles.iconMargin} />
          ) : isSuccess ? (
            <Check color={activeTheme.acc} size={16} style={styles.iconMargin} />
          ) : (
            icon && <View style={styles.iconMargin}>{icon}</View>
          )}
          <Text style={[styles.primaryText, isSuccess && styles.primaryTextSuccess]}>
            {isLoading ? 'PLEASE WAIT...' : isSuccess ? 'VERIFIED' : label}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

export function GhostButton({ label, icon, onPress, style, fullWidth = true }: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={({ pressed }) => [
        styles.ghostBase,
        fullWidth && { width: '100%' },
        pressed && styles.ghostPressed,
        animatedStyle,
        style,
      ]}
    >
      {({ pressed }) => (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconMargin}>{icon}</View>}
          <Text style={[styles.ghostText, pressed && styles.ghostTextPressed]}>{label}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

export function DangerButton({ label, icon, onPress, style, fullWidth = true }: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
      style={({ pressed }) => [
        styles.dangerBase,
        fullWidth && { width: '100%' },
        pressed && { backgroundColor: 'rgba(255, 51, 85, 0.1)' },
        animatedStyle,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {icon && <View style={styles.iconMargin}>{icon}</View>}
        <Text style={styles.dangerText}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMargin: {
    marginRight: 8,
  },
  primaryBase: {
    height: 52,
    borderRadius: 8,
    backgroundColor: activeTheme.acc,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primarySuccess: {
    backgroundColor: activeTheme.accD,
    borderWidth: 1,
    borderColor: activeTheme.accB,
  },
  primaryError: {
    borderWidth: 1,
    borderColor: activeTheme.danger,
  },
  primaryText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: activeTheme.void,
    fontWeight: '500',
  },
  primaryTextSuccess: {
    color: activeTheme.acc,
  },
  ghostBase: {
    height: 52,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostPressed: {
    borderColor: activeTheme.bdrA,
  },
  ghostText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: activeTheme.tx2,
  },
  ghostTextPressed: {
    color: activeTheme.tx1,
  },
  dangerBase: {
    height: 48,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 85, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: activeTheme.danger,
  },
});
