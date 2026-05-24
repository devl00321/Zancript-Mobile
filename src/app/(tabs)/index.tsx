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
import { mockUser, mockMetrics, mockNodes, mockAuditLogs } from '../../api/mockData';
import { useRouter } from 'expo-router';

const activeTheme = TOKENS.colors.dark;

function AnimatedNumber({ value }: { value: number }) {
  // Simple representation, in reality we'd animate this, but for now we'll just display it.
  // Full counter animation requires Reanimated worklets which are complex for a mock.
  return <Text style={styles.cardValue}>{value}</Text>;
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const usedPercent = (mockMetrics.storageUsedGB / mockMetrics.storageTotalGB) * 100;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopHeader type="dashboard" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting}>
            Good morning,{'\n'}{mockUser.displayName}.
          </Text>
          <Text style={styles.activitySub}>
            Last activity 14 min ago · {mockMetrics.activeNodes} nodes healthy
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard label="Files stored" value={mockMetrics.filesStored} sub={`+${mockMetrics.filesAddedToday} today`} />
          <StatCard label="Total shards" value={mockMetrics.totalShards} sub={`across ${mockMetrics.totalNodes} nodes`} />
          <StatCard 
            label="Active nodes" 
            value={`${mockMetrics.activeNodes}/${mockMetrics.totalNodes}`} 
            valueColor={activeTheme.acc}
            sub={<View style={styles.subRow}><NodeDot status="online" size={7} /><Text style={styles.cardSub}>all healthy</Text></View>} 
          />
          <StatCard 
            label="Storage used" 
            value={mockMetrics.storageUsedGB.toString()} 
            unit="GB"
            sub={`of ${mockMetrics.storageTotalGB} GB free`} 
          />
        </View>

        <ProgressBar value={usedPercent} />
        
        <View style={styles.storageLabels}>
          <Text style={styles.storageLabelText}>{mockMetrics.storageUsedGB} GB used</Text>
          <Text style={styles.storageLabelText}>{mockMetrics.storageTotalGB - mockMetrics.storageUsedGB} GB free</Text>
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
          {mockAuditLogs.map((log, index, arr) => {
            let severity: Severity = 'muted';
            if (log.action === 'UPLOAD') severity = 'success';
            if (log.action === 'DOWNLOAD') severity = 'muted';
            if (log.action === 'SHARE') severity = 'info';
            
            return (
              <View key={log.id} style={[styles.auditRow, index === arr.length - 1 && styles.noBorder]}>
                <View style={styles.auditBadgeWrap}>
                  <StatusBadge severity={severity} label={log.action} />
                </View>
                <View style={styles.auditInfo}>
                  <Text style={styles.auditFile} numberOfLines={1}>{log.file}</Text>
                  <Text style={styles.auditSub}>{log.sub}</Text>
                </View>
                <Text style={styles.auditTime}>{log.time}</Text>
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
    fontSize: 34,
    fontStyle: 'italic',
    color: activeTheme.tx1,
    lineHeight: 38,
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
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: activeTheme.tx3,
    marginBottom: 8,
  },
  cardValue: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 30,
    color: activeTheme.tx1,
    lineHeight: 34,
  },
  cardUnit: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 16,
    color: activeTheme.tx2,
    marginLeft: 2,
  },
  cardSub: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
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
    fontSize: 11,
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
    fontSize: 14,
    color: activeTheme.tx1,
    marginBottom: 2,
  },
  nodeMeta: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
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
    fontSize: 13,
    color: activeTheme.tx1,
    maxWidth: 180,
    marginBottom: 2,
  },
  auditSub: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    color: activeTheme.tx3,
  },
  auditTime: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    color: activeTheme.tx3,
  },
});
