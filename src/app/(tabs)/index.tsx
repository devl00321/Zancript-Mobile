import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { TOKENS } from '../../constants/tokens';
import { TopHeader } from '../../components/layout/TopHeader';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/Input';
import { NodeDot, NodeStatus } from '../../components/ui/NodeDot';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatusBadge, Severity } from '../../components/ui/Badge';
import { mockUser, mockNodes } from '../../api/mockData';
import { useRouter } from 'expo-router';
import { API, DashboardStats } from '../../api/endpoints';
import { useVaultStore } from '../../store/vaultStore';

const activeTheme = TOKENS.colors.dark;

function AnimatedNumber({ value }: { value: number }) {
  // Simple representation, in reality we'd animate this, but for now we'll just display it.
  // Full counter animation requires Reanimated worklets which are complex for a mock.
  return <Text style={styles.cardValue}>{value}</Text>;
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [metrics, setMetrics] = React.useState<DashboardStats | null>(null);
  const { files, fetchFiles } = useVaultStore();

  React.useEffect(() => {
    API.dashboard.getStats().then(setMetrics).catch(() => {});
    fetchFiles();
  }, []);
  
  const storageUsedGB = metrics ? (metrics.total_storage_bytes / (1024 * 1024 * 1024)) : 0;
  const storageTotalGB = 5.0; // Assume 5GB free tier limit for now
  const usedPercent = (storageUsedGB / storageTotalGB) * 100;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopHeader type="dashboard" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting}>
            Good morning,{'\n'}{mockUser.displayName}.
          </Text>
          <Text style={styles.activitySub}>
            Last activity 14 min ago · {metrics ? metrics.active_nodes : 0} nodes healthy
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Files stored" value={metrics ? metrics.stored_files : 0} sub="total encrypted" />
          <StatCard label="Security Score" value={metrics ? metrics.security_score : 100} sub="integrity check" />
          <StatCard 
            label="Active nodes" 
            value={`${metrics ? metrics.active_nodes : 0}/6`} 
            valueColor={activeTheme.acc}
            sub={<View style={styles.subRow}><NodeDot status="online" size={7} /><Text style={styles.cardSub}>all healthy</Text></View>} 
          />
          <StatCard 
            label="Storage used" 
            value={storageUsedGB.toFixed(2)} 
            unit="GB"
            sub={`of ${storageTotalGB} GB free`} 
          />
        </View>

        <ProgressBar value={usedPercent} />
        
        <View style={styles.storageLabels}>
          <Text style={styles.storageLabelText}>{storageUsedGB.toFixed(2)} GB used</Text>
          <Text style={styles.storageLabelText}>{(storageTotalGB - storageUsedGB).toFixed(2)} GB free</Text>
        </View>

        <SectionLabel text="Storage nodes" />
        <Card style={styles.nodesCard}>
          {mockNodes.slice(0, 4).map((node, index, arr) => (
            <View key={node.id} style={[styles.nodeRow, index === arr.length - 1 && styles.noBorder]}>
              <NodeDot status={node.status as NodeStatus} />
              <View style={styles.nodeInfo}>
                <Text style={styles.nodeName} numberOfLines={1}>{node.name}</Text>
                <Text style={styles.nodeMeta}>{node.region} · {node.provider}</Text>
              </View>
              <Text style={[styles.nodeLat, node.latency > 100 && styles.nodeLatWarn]}>
                {node.latency > 100 ? 'timeout' : `${node.latency}ms`}
              </Text>
            </View>
          ))}
        </Card>

        <SectionLabel text="Recent activity" />
        <Card style={styles.auditCard}>
          {files.length === 0 ? (
            <Text style={{ fontFamily: TOKENS.fonts.mono, color: activeTheme.tx3, fontSize: 13, textAlign: 'center', paddingVertical: 20 }}>No recent activity</Text>
          ) : files.slice(0, 3).map((file, index, arr) => {
            const decryptedName = file.encrypted_metadata ? 
              (file.encrypted_metadata.includes('.') ? file.encrypted_metadata : file.encrypted_filename) 
              : file.encrypted_filename;
              
            // Simple format for the timestamp, just showing date or time
            const dateObj = new Date(file.created_at);
            const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
            
            return (
              <View key={file.id} style={[styles.auditRow, index === arr.length - 1 && styles.noBorder]}>
                <View style={styles.auditBadgeWrap}>
                  <StatusBadge severity="success" label="UPLOAD" />
                </View>
                <View style={styles.auditInfo}>
                  <Text style={styles.auditFile} numberOfLines={1}>{decryptedName}</Text>
                  <Text style={styles.auditSub}>{(file.file_size / (1024 * 1024)).toFixed(2)} MB · 6 shards</Text>
                </View>
                <Text style={styles.auditTime}>{timeStr}</Text>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, sub, valueColor, unit }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.cardValue, valueColor && { color: valueColor }]}>{value}</Text>
        {unit && <Text style={styles.cardUnit}>{unit}</Text>}
      </View>
      {typeof sub === 'string' ? <Text style={styles.cardSub}>{sub}</Text> : sub}
    </View>
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
  greetingWrap: {
    marginBottom: 24,
    marginTop: 10,
  },
  greeting: {
    fontFamily: TOKENS.fonts.disp,
    fontSize: 42,
    fontStyle: 'italic',
    color: activeTheme.tx1,
    lineHeight: 46,
  },
  activitySub: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    color: activeTheme.tx3,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: activeTheme.surf,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
  },
  cardLabel: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: activeTheme.tx3,
    marginBottom: 8,
  },
  cardValue: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 34,
    color: activeTheme.tx1,
    lineHeight: 38,
  },
  cardUnit: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 16,
    color: activeTheme.tx2,
    marginLeft: 2,
  },
  cardSub: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx2,
    marginTop: 6,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  storageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    marginTop: 4,
  },
  storageLabelText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx3,
  },
  nodesCard: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 16,
    color: activeTheme.tx1,
    marginBottom: 2,
  },
  nodeMeta: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx2,
  },
  nodeLat: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx2,
  },
  nodeLatWarn: {
    color: activeTheme.warn,
  },
  auditCard: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  auditBadgeWrap: {
    marginTop: 2,
  },
  auditInfo: {
    flex: 1,
  },
  auditFile: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 15,
    color: activeTheme.tx1,
    maxWidth: 180,
    marginBottom: 2,
  },
  auditSub: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx3,
  },
  auditTime: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.tx3,
  },
});
