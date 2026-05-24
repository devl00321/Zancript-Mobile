import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { CloudUpload, Plus, Lock, LayoutGrid, Globe, CheckCircle } from 'lucide-react-native';
import { TOKENS } from '../../constants/tokens';
import { TopHeader } from '../../components/layout/TopHeader';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/Input';
import { FileTypeBadge } from '../../components/ui/Badge';
import { PrimaryButton } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';

const activeTheme = TOKENS.colors.dark;

export default function UploadScreen() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0=none, 1=enc, 2=shard, 3=dist, 4=done

  const simulateUpload = () => {
    setIsUploading(true);
    setProgress(0);
    setStage(1);

    setTimeout(() => {
      setProgress(35);
      setTimeout(() => {
        setStage(2);
        setProgress(65);
        setTimeout(() => {
          setStage(3);
          setProgress(92);
          setTimeout(() => {
            setStage(4);
            setProgress(100);
            setTimeout(() => {
              setIsUploading(false);
              setStage(0);
            }, 2000);
          }, 800);
        }, 1200);
      }, 1500);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopHeader type="upload" title="Upload" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {!isUploading && (
          <Pressable style={styles.uploadZone}>
            <CloudUpload size={32} color={activeTheme.tx3} style={styles.zoneIcon} />
            <Text style={styles.zoneTitle}>Drop files here to encrypt</Text>
            <Text style={styles.zoneSub}>or tap to browse your device</Text>
            
            <PrimaryButton 
              label="Select Files" 
              icon={<Plus size={14} color={activeTheme.void} />}
              onPress={simulateUpload}
              style={styles.selectBtn}
              fullWidth={false}
            />
          </Pressable>
        )}

        {isUploading && (
          <Card style={styles.progressCard}>
            <View style={styles.fileRow}>
              <FileTypeBadge type="PDF" />
              <View>
                <Text style={styles.fileName}>contract-nda.pdf</Text>
                <Text style={styles.fileSize}>2.1 MB</Text>
              </View>
            </View>

            <View style={styles.progWrap}>
              <ProgressBar value={progress} isShimmering={stage > 0 && stage < 4} />
              <View style={styles.progLabels}>
                <Text style={styles.progLabelText}>
                  {stage === 1 ? 'Encrypting...' : stage === 2 ? 'Sharding...' : stage === 3 ? 'Distributing...' : stage === 4 ? 'Upload complete' : 'Preparing...'}
                </Text>
                <Text style={styles.progLabelText}>{progress}%</Text>
              </View>
            </View>

            <View style={styles.stepsWrap}>
              <UploadStep icon={Lock} label="Encrypting" status={stage > 1 ? 'AES-256-GCM ✓' : stage === 1 ? 'Pending...' : 'Pending'} active={stage === 1} done={stage > 1} />
              <UploadStep icon={LayoutGrid} label="Sharding" status={stage > 2 ? '3 shards ✓' : stage === 2 ? 'Pending...' : 'Pending'} active={stage === 2} done={stage > 2} />
              <UploadStep icon={Globe} label="Distributing" status={stage > 3 ? 'All nodes ✓' : stage === 3 ? 'Pending...' : 'Pending'} active={stage === 3} done={stage > 3} />
              <UploadStep icon={CheckCircle} label="Verified" status={stage === 4 ? 'Stored ✓' : 'Pending'} active={false} done={stage === 4} isLast />
            </View>
          </Card>
        )}

        <SectionLabel text="How your file is protected" style={{ marginTop: 24 }} />
        <Card style={styles.eduCard}>
          <View style={styles.eduRow}>
            <Lock size={18} color={activeTheme.acc} style={styles.eduIcon} />
            <View style={styles.eduTextCol}>
              <Text style={styles.eduTitle}>Encrypted on device</Text>
              <Text style={styles.eduBody}>AES-256-GCM with a key that never leaves your phone.</Text>
            </View>
          </View>
          <View style={styles.eduRow}>
            <LayoutGrid size={18} color={activeTheme.acc} style={styles.eduIcon} />
            <View style={styles.eduTextCol}>
              <Text style={styles.eduTitle}>Split into shards</Text>
              <Text style={styles.eduBody}>Minimum 3 shards regardless of file size.</Text>
            </View>
          </View>
          <View style={[styles.eduRow, styles.noBorder, { paddingBottom: 0 }]}>
            <Globe size={18} color={activeTheme.acc} style={styles.eduIcon} />
            <View style={styles.eduTextCol}>
              <Text style={styles.eduTitle}>Distributed globally</Text>
              <Text style={styles.eduBody}>Each shard on a different provider and region.</Text>
            </View>
          </View>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

function UploadStep({ icon: Icon, label, status, active, done, isLast }: any) {
  return (
    <View style={[styles.stepRow, !isLast && styles.stepBorder]}>
      <Icon size={14} color={done ? activeTheme.acc : activeTheme.tx3} />
      <Text style={styles.stepLabel}>{label}</Text>
      <Text style={[styles.stepStatus, done && styles.stepStatusDone, active && styles.stepStatusActive]}>{status}</Text>
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
  uploadZone: {
    borderWidth: 2,
    borderColor: activeTheme.bdr,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  zoneIcon: {
    marginBottom: 10,
  },
  zoneTitle: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    color: activeTheme.tx2,
    marginBottom: 4,
  },
  zoneSub: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 11,
    color: activeTheme.tx3,
  },
  selectBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    height: 40,
  },
  progressCard: {
    marginBottom: 16,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  fileName: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 12,
    color: activeTheme.tx1,
  },
  fileSize: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx2,
  },
  progWrap: {
    marginBottom: 14,
  },
  progLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progLabelText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    color: activeTheme.tx3,
  },
  stepsWrap: {
    marginTop: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  stepLabel: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    color: activeTheme.tx2,
  },
  stepStatus: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx3,
    marginLeft: 'auto',
  },
  stepStatusDone: {
    color: activeTheme.acc,
  },
  stepStatusActive: {
    color: activeTheme.tx2,
  },
  eduCard: {
    padding: 14,
  },
  eduRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: activeTheme.bdr,
  },
  noBorder: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  eduIcon: {
    marginTop: 1,
  },
  eduTextCol: {
    flex: 1,
  },
  eduTitle: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    color: activeTheme.tx1,
    marginBottom: 2,
  },
  eduBody: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 12,
    color: activeTheme.tx2,
  },
});
