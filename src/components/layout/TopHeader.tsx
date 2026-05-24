import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { HexLogo } from '../ui/HexLogo';
import { TOKENS } from '../../constants/tokens';
import { Bell, Settings, Search, CloudUpload } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const activeTheme = TOKENS.colors.dark;

interface TopHeaderProps {
  type: 'dashboard' | 'vault' | 'upload' | 'security' | 'settings';
  title?: string;
  badge?: React.ReactNode;
}

export function TopHeader({ type, title, badge }: TopHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {type === 'dashboard' ? (
        <View style={styles.logoRow}>
          <HexLogo size={22} />
          <Text style={styles.logoText}>ZANCRYPT</Text>
        </View>
      ) : (
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badge && <View style={styles.badgeWrap}>{badge}</View>}
        </View>
      )}

      <View style={styles.actions}>
        {type === 'dashboard' && (
          <>
            <IconButton icon={<Bell size={18} color={activeTheme.tx2} />} />
            <IconButton icon={<Settings size={18} color={activeTheme.tx2} />} onPress={() => router.push('/(tabs)/settings')} />
          </>
        )}
        {type === 'vault' && (
          <>
            <IconButton icon={<Search size={18} color={activeTheme.tx2} />} />
            <IconButton icon={<CloudUpload size={18} color={activeTheme.tx2} />} onPress={() => router.push('/(tabs)/upload' as any)} />
          </>
        )}
      </View>
    </View>
  );
}

function IconButton({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        pressed && styles.iconBtnPressed,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  logoText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx1,
    letterSpacing: 1.3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: TOKENS.fonts.disp,
    fontSize: 26,
    fontStyle: 'italic',
    color: activeTheme.tx1,
  },
  badgeWrap: {
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: activeTheme.raised,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    borderColor: activeTheme.bdrA,
  },
});
