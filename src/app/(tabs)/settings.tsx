import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import { TOKENS } from '../../constants/tokens';
import { TopHeader } from '../../components/layout/TopHeader';
import { Card } from '../../components/ui/Card';
import { SectionLabel, SecureInput } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { EncBadge } from '../../components/ui/Badge';
import { Toggle } from '../../components/ui/Toggle';
import { DangerButton, GhostButton } from '../../components/ui/Button';
import { mockUser, mockMetrics } from '../../api/mockData';
import { useThemeStore } from '../../store/themeStore';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

const activeTheme = TOKENS.colors.dark;

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore(s => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  const insets = useSafeAreaInsets();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [toggles, setToggles] = useState({
    replication: true,
    secAlerts: true,
    nodeAlerts: false,
  });

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TopHeader type="settings" title="You" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileCard}>
          <Avatar initials={mockUser.displayName} size="large" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{mockUser.displayName.toLowerCase()}</Text>
            <Text style={styles.profileSub}>
              Free Plan · {mockMetrics.storageUsedGB} GB / {mockMetrics.storageTotalGB} GB
            </Text>
            <View style={styles.badgeWrap}>
              <EncBadge />
            </View>
          </View>
        </View>

        <SectionLabel text="Authentication" />
        <Card style={styles.settingsCard}>
          <SettingRow label="Passkeys" sub="MacBook Pro · iPhone 15" action={<ChevronRight size={16} color={activeTheme.tx3} />} />
          <SettingRow label="Access key" sub="Fallback login method" action={<ChevronRight size={16} color={activeTheme.tx3} />} isLast />
        </Card>

        <SectionLabel text="Encryption info" />
        <Card style={styles.settingsCard}>
          <InfoRow label="Algorithm" value="AES-256-GCM" valueAccent />
          <InfoRow label="Key derivation" value="PBKDF2-SHA256" />
          <InfoRow label="Iterations" value="100,000" />
          <InfoRow label="Key storage" value="Memory only" isLast />
        </Card>

        <SectionLabel text="Preferences" />
        <Card style={styles.settingsCard}>
          <SettingRow 
            label="Auto-replication" 
            sub="Re-replicate on node failure" 
            action={<Toggle value={toggles.replication} onChange={(v) => setToggles({...toggles, replication: v})} />} 
          />
          <SettingRow 
            label="Security alerts" 
            sub="Login, new IP, failed attempts" 
            action={<Toggle value={toggles.secAlerts} onChange={(v) => setToggles({...toggles, secAlerts: v})} />} 
          />
          <SettingRow 
            label="Node status alerts" 
            sub="When a node goes offline" 
            action={<Toggle value={toggles.nodeAlerts} onChange={(v) => setToggles({...toggles, nodeAlerts: v})} />} 
          />
          <SettingRow 
            label="Dark Mode" 
            sub="Toggle app theme" 
            action={<Toggle value={theme === 'dark'} onChange={toggleTheme} />} 
            isLast
          />
        </Card>

        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <GhostButton label="Log out securely" onPress={handleLogout} />
        </View>

        <SectionLabel text="Danger zone" />
        <Card style={styles.dangerCard}>
          <Text style={styles.dangerDesc}>
            Permanently deletes your vault, all files, and all shards from every node.
          </Text>
          <DangerButton 
            label="Delete my account" 
            icon={<Trash2 size={16} color={activeTheme.danger} />}
            onPress={() => setModalVisible(true)}
          />
        </Card>

      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Are you absolutely sure?</Text>
            <Text style={styles.modalBody}>
              This action cannot be undone. This will permanently delete your account, 
              wipe all shards from the global network, and destroy your keys.
            </Text>
            
            <SecureInput
              label=""
              placeholder="Type DELETE MY VAULT to confirm"
              value={deleteConfirm}
              onChangeText={setDeleteConfirm}
              containerStyle={{ marginBottom: 20 }}
            />
            
            <DangerButton 
              label="Delete my account" 
              style={{ opacity: deleteConfirm === 'DELETE MY VAULT' ? 1 : 0.5 }}
              onPress={() => {
                if (deleteConfirm === 'DELETE MY VAULT') {
                  // Perform delete
                  setModalVisible(false);
                  handleLogout();
                }
              }}
            />
            <GhostButton 
              label="Cancel" 
              onPress={() => {
                setModalVisible(false);
                setDeleteConfirm('');
              }}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>

    </View>
  );
}

function SettingRow({ label, sub, action, isLast }: any) {
  return (
    <View style={[styles.settingRow, !isLast && styles.rowBorder]}>
      <View style={styles.settingTextCol}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingSub}>{sub}</Text>
      </View>
      <View style={styles.settingAction}>{action}</View>
    </View>
  );
}

function InfoRow({ label, value, valueAccent, isLast }: any) {
  return (
    <View style={[styles.infoRow, !isLast && styles.rowBorder]}>
      <Text style={styles.infoKey}>{label}</Text>
      <Text style={[styles.infoValue, valueAccent && styles.infoValueAccent]}>{value}</Text>
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
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    padding: 16,
    backgroundColor: activeTheme.surf,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 14,
    color: activeTheme.tx1,
  },
  profileSub: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx2,
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: 6,
  },
  settingsCard: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 14,
    color: activeTheme.tx1,
  },
  settingSub: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx3,
    marginTop: 2,
  },
  settingAction: {
    flexShrink: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  infoKey: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx3,
  },
  infoValue: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx1,
  },
  infoValueAccent: {
    color: activeTheme.acc,
  },
  dangerCard: {
    borderColor: 'rgba(255, 51, 85, 0.2)',
  },
  dangerDesc: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 13,
    color: activeTheme.tx2,
    marginBottom: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: activeTheme.surf,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 28,
    borderTopWidth: 1,
    borderTopColor: activeTheme.bdr,
    paddingBottom: 48,
  },
  modalTitle: {
    fontFamily: TOKENS.fonts.disp,
    fontSize: 22,
    fontStyle: 'italic',
    color: activeTheme.tx1,
    marginBottom: 10,
  },
  modalBody: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 14,
    color: activeTheme.tx2,
    lineHeight: 20,
    marginBottom: 24,
  },
});
