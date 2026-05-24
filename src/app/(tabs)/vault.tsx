import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';
import { ChevronRight, Download, Share, Trash } from 'lucide-react-native';
import { TOKENS } from '../../constants/tokens';
import { TopHeader } from '../../components/layout/TopHeader';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/Input';
import { EncBadge, FileTypeBadge, StatusBadge } from '../../components/ui/Badge';
import { ShardDots } from '../../components/ui/ShardDots';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';
import { NodeDot } from '../../components/ui/NodeDot';
import { mockFiles, mockDecryptedNames } from '../../api/mockData';

const activeTheme = TOKENS.colors.dark;

function FileRow({ file, isLast }: { file: any, isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  
  // Bug 1 Fix: Decrypt filename client-side
  const decryptedName = mockDecryptedNames[file.encrypted_filename] || 'Unknown File';

  const progress = useDerivedValue(() => withTiming(expanded ? 1 : 0, { duration: 250 }));
  
  const detailStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    maxHeight: progress.value * 500, // Approximate max height
    overflow: 'hidden',
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 90}deg` }],
  }));

  return (
    <View style={!isLast && styles.rowBorder}>
      <Pressable 
        style={styles.fileRow}
        onPress={() => setExpanded(!expanded)}
      >
        <FileTypeBadge type={file.type} />
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>{decryptedName}</Text>
          <Text style={styles.fileMeta}>{file.size} · {file.shards} shards</Text>
          <ShardDots count={6} statuses={file.status} />
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronRight size={16} color={activeTheme.tx3} />
        </Animated.View>
      </Pressable>

      <Animated.View style={detailStyle}>
        <View style={styles.detailContainer}>
          <SectionLabel text="File details" style={{ marginTop: 0 }} />
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailName}>{decryptedName}</Text>
                <Text style={styles.detailSize}>{file.size} · {file.type}</Text>
              </View>
              <StatusBadge severity="success" label="Encrypted" />
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.shardHeader}>Shard distribution</Text>
            
            <View style={styles.shardGrid}>
              <ShardDetailCard id={0} label="Shard 0" status={file.status[0]} location="Mumbai · Oracle" />
              <ShardDetailCard id={1} label="Shard 1" status={file.status[1]} location="Singapore · Oracle" />
              <ShardDetailCard id={2} label="Shard 2" status={file.status[2]} location="Tokyo · Fly.io" />
              <ShardDetailCard id={3} label="Replica" status={file.status[3]} location="Frankfurt · GCP" />
            </View>
            
            <View style={styles.actionRow}>
              <PrimaryButton 
                label="Download" 
                icon={<Download size={14} color={activeTheme.void} />} 
                style={styles.actionBtn} 
                fullWidth={false}
              />
              <GhostButton 
                label="Share" 
                icon={<Share size={14} color={activeTheme.tx2} />} 
                style={styles.actionBtn} 
                fullWidth={false}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function ShardDetailCard({ label, status, location }: any) {
  return (
    <View style={styles.shardDetailCard}>
      <View style={styles.shardLabelRow}>
        <NodeDot status={status} size={5} />
        <Text style={[styles.shardLabel, status === 'offline' && { color: activeTheme.bdrA }]}>{label}</Text>
      </View>
      <Text style={styles.shardLocation}>{location}</Text>
    </View>
  );
}

export default function VaultScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <TopHeader type="vault" title="My Vault" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.badgeWrap}>
          <EncBadge />
        </View>
        
        <Card style={styles.filesCard}>
          {mockFiles.map((file, i) => (
            <FileRow key={file.id} file={file} isLast={i === mockFiles.length - 1} />
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: activeTheme.void,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  badgeWrap: {
    marginBottom: 14,
  },
  filesCard: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    color: activeTheme.tx1,
  },
  fileMeta: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx2,
  },
  detailContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: activeTheme.surf,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 12,
    padding: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx1,
  },
  detailSize: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx2,
  },
  divider: {
    height: 1,
    backgroundColor: activeTheme.bdr,
    marginVertical: 4,
  },
  shardHeader: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    color: activeTheme.tx3,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginVertical: 8,
  },
  shardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  shardDetailCard: {
    width: '48.5%',
    backgroundColor: activeTheme.raised,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 6,
    padding: 8,
  },
  shardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  shardLabel: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    color: activeTheme.acc,
  },
  shardLocation: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    color: activeTheme.tx2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 40,
  },
});
