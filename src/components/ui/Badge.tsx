import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TOKENS } from '../../constants/tokens';
import { NodeDot } from './NodeDot';

const activeTheme = TOKENS.colors.dark;

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'success' | 'muted';

export function StatusBadge({ severity, label }: { severity: Severity; label: string }) {
  let bgColor = 'transparent';
  let borderColor = activeTheme.bdr;
  let textColor = activeTheme.tx2;

  switch (severity) {
    case 'critical':
      bgColor = 'rgba(255, 51, 85, 0.1)';
      borderColor = 'rgba(255, 51, 85, 0.4)';
      textColor = activeTheme.danger;
      break;
    case 'high':
      bgColor = 'transparent';
      borderColor = 'rgba(255, 51, 85, 0.3)';
      textColor = activeTheme.danger;
      break;
    case 'medium':
      bgColor = 'rgba(255, 170, 51, 0.07)';
      borderColor = 'rgba(255, 170, 51, 0.3)';
      textColor = activeTheme.warn;
      break;
    case 'low':
    case 'muted':
      bgColor = 'transparent';
      borderColor = activeTheme.bdr;
      textColor = activeTheme.tx3;
      break;
    case 'info':
      bgColor = 'rgba(68, 153, 255, 0.07)';
      borderColor = 'rgba(68, 153, 255, 0.3)';
      textColor = activeTheme.info;
      break;
    case 'success':
      bgColor = activeTheme.accD;
      borderColor = activeTheme.accB;
      textColor = activeTheme.acc;
      break;
  }

  return (
    <View style={[styles.statusBadge, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.statusBadgeText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

export function FileTypeBadge({ type }: { type: string }) {
  return (
    <View style={styles.fileTypeBadge}>
      <Text style={styles.fileTypeBadgeText}>{type}</Text>
    </View>
  );
}

export function EncBadge() {
  return (
    <View style={styles.encBadge}>
      <NodeDot status="online" size={5} />
      <Text style={styles.encBadgeText}>ENCRYPTED · AES-256-GCM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 7,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fileTypeBadge: {
    width: 38,
    height: 38,
    backgroundColor: activeTheme.raised,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileTypeBadgeText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    color: activeTheme.tx2,
  },
  encBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: activeTheme.accD,
    borderWidth: 1,
    borderColor: activeTheme.accB,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  encBadgeText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: activeTheme.acc,
    marginLeft: 5,
  },
});
