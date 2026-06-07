import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;

interface ShardDotsProps {
  count?: number;
  statuses?: ('online' | 'offline')[];
}

export function ShardDots({ count = 6, statuses = Array(6).fill('online') }: ShardDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            statuses[i] === 'offline' ? styles.offline : styles.online,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  online: {
    backgroundColor: activeTheme.acc,
    opacity: 0.7,
  },
  offline: {
    backgroundColor: activeTheme.bdrA,
    opacity: 1,
  },
});
