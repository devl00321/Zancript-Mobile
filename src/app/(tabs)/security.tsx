import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Monitor, Smartphone, Link } from 'lucide-react-native';
import { TOKENS } from '../../constants/tokens';
import { TopHeader } from '../../components/layout/TopHeader';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/Input';
import { StatusBadge, Severity } from '../../components/ui/Badge';
import { NodeDot, NodeStatus } from '../../components/ui/NodeDot';
import { GhostButton, DangerButton } from '../../components/ui/Button';
import { mockSecurityEvents, mockSessions, mockNodes } from '../../api/mockData';

const activeTheme = TOKENS.colors.dark;

export default function SecurityScreen() {
  const [activeTab, setActiveTab] = useState<'events' | 'sessions' | 'nodes'>('events');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopHeader 
        type="security" 
        title="Security" 
        badge={<StatusBadge severity="success" label="All clear" />} 
      />
      
      <View style={styles.tabBar}>
        <TabButton label="Events" active={activeTab === 'events'} onPress={() => setActiveTab('events')} />
        <TabButton label="Sessions" active={activeTab === 'sessions'} onPress={() => setActiveTab('sessions')} />
        <TabButton label="Nodes" active={activeTab === 'nodes'} onPress={() => setActiveTab('nodes')} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'events' && <EventsPanel />}
        {activeTab === 'sessions' && <SessionsPanel />}
        {activeTab === 'nodes' && <NodesPanel />}
      </ScrollView>
    </View>
  );
}

function TabButton({ label, active, onPress }: any) {
  return (
    <Pressable onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function EventsPanel() {
  return (
    <View>
      {mockSecurityEvents.map(event => (
        <View key={event.id} style={styles.eventCard}>
          <View style={styles.eventBadgeWrap}>
            <StatusBadge severity={event.severity as Severity} label={event.severity} />
          </View>
          <View style={styles.eventTextCol}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDetail}>{event.detail}</Text>
          </View>
        </View>
      ))}

      <SectionLabel text="Shares" style={{ marginTop: 24 }} />
      <Card style={styles.sharesCard}>
        <View style={styles.shareRow}>
          <View style={styles.shareTop}>
            <Text style={styles.shareName}>contract-draft.docx</Text>
            <Text style={styles.shareTimer}>23h 14m</Text>
          </View>
          <View style={styles.shareMeta}>
            <StatusBadge severity="info" label="HTML Wrapper" />
            <StatusBadge severity="success" label="0/1 views" />
          </View>
        </View>
        <View style={[styles.shareRow, styles.noBorder]}>
          <View style={styles.shareTop}>
            <Text style={styles.shareName}>design-v3.fig</Text>
            <Text style={[styles.shareTimer, styles.timerExpired]}>Expired</Text>
          </View>
          <View style={styles.shareMeta}>
            <StatusBadge severity="muted" label="Direct link" />
            <StatusBadge severity="muted" label="1/1 views" />
          </View>
        </View>
        <View style={styles.createShareWrap}>
          <GhostButton 
            label="Create share link" 
            icon={<Link size={20} color={activeTheme.tx2} />}
            style={styles.createShareBtn}
            fullWidth={false}
          />
        </View>
      </Card>
    </View>
  );
}

function SessionsPanel() {
  return (
    <Card style={styles.sessionsCard}>
      {mockSessions.map((session, i) => (
        <View key={session.id} style={[styles.sessionRow, i === mockSessions.length - 1 && styles.noBorder]}>
          <View style={styles.deviceIcon}>
            {session.device === 'desktop' ? 
              <Monitor size={20} color={session.current ? activeTheme.acc : activeTheme.tx2} /> : 
              <Smartphone size={20} color={session.current ? activeTheme.acc : activeTheme.tx2} />}
          </View>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionName}>{session.name}</Text>
            <Text style={styles.sessionDetail}>{session.detail}</Text>
          </View>
          {session.current ? (
            <StatusBadge severity="success" label="Active" />
          ) : (
            <DangerButton label="Revoke" style={styles.revokeBtn} fullWidth={false} />
          )}
        </View>
      ))}
    </Card>
  );
}

function NodesPanel() {
  return (
    <Card style={styles.nodesCard}>
      {mockNodes.map((node, i) => {
        let barColor = activeTheme.acc;
        if (node.status === 'degraded') barColor = activeTheme.warn;
        if (node.status === 'offline') barColor = activeTheme.danger;

        return (
          <View key={node.id} style={[styles.nodeRow, i === mockNodes.length - 1 && styles.noBorder]}>
            <NodeDot status={node.status as NodeStatus} />
            <View style={styles.nodeInfo}>
              <Text style={styles.nodeName}>{node.name}</Text>
              <Text style={styles.nodeMeta}>{node.provider} · {node.region}</Text>
              <View style={styles.healthBarTrack}>
                <View style={[styles.healthBarFill, { width: `${node.uptime}%`, backgroundColor: barColor }]} />
              </View>
            </View>
            <View style={styles.nodeStats}>
              <Text style={[styles.uptimeTxt, { color: barColor }]}>{node.uptime}%</Text>
              <Text style={[styles.latencyTxt, node.latency > 100 && { color: activeTheme.warn }]}>
                {node.latency > 100 ? 'timeout' : `${node.latency}ms`}
              </Text>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: activeTheme.void,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
    marginHorizontal: 20,
  },
  tabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabBtnActive: {
    borderBottomColor: activeTheme.acc,
  },
  tabLabel: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: activeTheme.tx3,
  },
  tabLabelActive: {
    color: activeTheme.acc,
  },
  scrollContent: {
    padding: 20,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: activeTheme.raised,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    marginBottom: 8,
  },
  eventBadgeWrap: {
    flexShrink: 0,
  },
  eventTextCol: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 14,
    color: activeTheme.tx1,
    marginBottom: 2,
  },
  eventDetail: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 13,
    color: activeTheme.tx2,
  },
  sharesCard: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  shareRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  shareTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  shareName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 14,
    color: activeTheme.tx1,
  },
  shareTimer: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 13,
    color: activeTheme.warn,
  },
  timerExpired: {
    color: activeTheme.tx3,
    textDecorationLine: 'line-through',
  },
  shareMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  createShareWrap: {
    marginTop: 12,
    marginBottom: 8,
  },
  createShareBtn: {
    height: 40,
  },
  sessionsCard: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  deviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: activeTheme.raised,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 14,
    color: activeTheme.tx1,
  },
  sessionDetail: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    color: activeTheme.tx2,
  },
  revokeBtn: {
    height: 28,
    paddingHorizontal: 8,
  },
  nodesCard: {
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 14,
    color: activeTheme.tx1,
  },
  nodeMeta: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    color: activeTheme.tx2,
  },
  healthBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: activeTheme.raised,
    overflow: 'hidden',
    marginTop: 4,
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  nodeStats: {
    alignItems: 'flex-end',
  },
  uptimeTxt: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
  },
  latencyTxt: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    color: activeTheme.tx3,
  },
});
