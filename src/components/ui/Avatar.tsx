import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;

interface AvatarProps {
  initials: string;
  size?: 'small' | 'large';
}

export function Avatar({ initials, size = 'large' }: AvatarProps) {
  const isSmall = size === 'small';
  const dimensions = isSmall ? 32 : 56;
  const fontSize = isSmall ? 12 : 16;

  return (
    <View
      style={[
        styles.container,
        {
          width: dimensions,
          height: dimensions,
          borderRadius: dimensions / 2,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials.substring(0, 2).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: activeTheme.accD,
    borderWidth: 1.5,
    borderColor: activeTheme.accB,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: TOKENS.fonts.mono,
    color: activeTheme.acc,
  },
});
