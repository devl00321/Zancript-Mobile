import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Pressable } from 'react-native';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function Card({ children, style, onPress }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: activeTheme.surf,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 12,
    padding: 16,
  },
  cardPressed: {
    borderColor: activeTheme.bdrA,
  },
});
