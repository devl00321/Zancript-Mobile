import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface LogoProps {
  size?: number;
  style?: ViewStyle;
}

export function Logo({ size = 160, style }: LogoProps) {
  // Scale the component based on the target size (base size is 160x160)
  const scale = size / 160;

  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      <View style={[styles.container, { transform: [{ scale }] }]}>
        <View style={styles.lockIcon}>
          <View style={styles.lockShackle} />
          <View style={styles.lockBody} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 160,
    height: 160,
    backgroundColor: '#4fffb0', // Zancript Neon Mint
    borderRadius: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4fffb0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  lockIcon: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transform: [{ translateY: -2 }],
  },
  lockShackle: {
    width: 62, // 44 + 18 (border)
    height: 41, // 32 + 9 (border top)
    borderWidth: 9,
    borderColor: '#050507', // Zancript Dark Base
    borderBottomWidth: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginBottom: -2,
    zIndex: 1,
  },
  lockBody: {
    width: 94, // 76 + 18 (border)
    height: 66, // 48 + 18 (border)
    borderWidth: 9,
    borderColor: '#050507',
    borderRadius: 12,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
});
