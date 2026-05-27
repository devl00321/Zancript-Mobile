import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Fingerprint, Key } from 'lucide-react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';

import { TOKENS } from '../../constants/tokens';
import { HexLogo } from '../../components/ui/HexLogo';
import { CipherText } from '../../components/ui/CipherText';
import { SecureInput } from '../../components/ui/Input';
import { PrimaryButton, GhostButton, ButtonState } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { mockUser } from '../../api/mockData';

const activeTheme = TOKENS.colors.dark;

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  
  const [email, setEmail] = useState('');
  const [passkeyStatus, setPasskeyStatus] = useState<ButtonState>('default');

  const handlePasskey = async () => {
    setPasskeyStatus('loading');
    
    // Simulate API delay and local authentication
    setTimeout(async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        let success = true;
        
        if (hasHardware && isEnrolled) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Sign in to ZanCrypt',
            disableDeviceFallback: true,
            cancelLabel: 'Cancel',
          });
          success = result.success;
        } else {
          // If simulator or no biometrics, just fake success after delay
          success = true;
        }

        if (success) {
          setPasskeyStatus('success');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          // Login and redirect
          setTimeout(async () => {
            await login(mockUser, 'mock_jwt_token', 'mock_derived_aes_key');
            router.replace('/(tabs)');
          }, 900);
        } else {
          throw new Error('Authentication failed');
        }
      } catch (e) {
        setPasskeyStatus('error');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => setPasskeyStatus('default'), 600);
      }
    }, 800);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* HERO SECTION */}
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <HexLogo size={22} />
            <Text style={styles.logoText}>ZanCrypt</Text>
          </View>
          
          <Text style={styles.eyebrow}>⬡ ZanCrypt · ZERO-KNOWLEDGE VAULT</Text>
          
          <Text style={styles.title}>
            Your files.{'\n'}
            <Text style={styles.titleItalic}>Untouchable.</Text>
          </Text>
          
          <Text style={styles.subtext}>
            No password. Authentication uses your device's secure enclave.
          </Text>
        </View>

        {/* FORM SECTION */}
        <View style={styles.formContainer}>
          <View style={styles.cipherWrapper}>
            <CipherText text="3f7a9b2c · AES-256-GCM · PBKDF2 · FIDO2" />
          </View>
          
          <SecureInput
            label="Email address"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.inputWrap}
          />
          
          <PrimaryButton
            label="Verify with passkey"
            icon={<Fingerprint color={activeTheme.void} size={16} />}
            status={passkeyStatus}
            onPress={handlePasskey}
            style={styles.btnWrap}
          />
          
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <GhostButton
            label="Use access key"
            icon={<Key color={activeTheme.tx2} size={15} />}
            onPress={() => {}}
          />
          
          <Text style={styles.bottomLink}>
            No vault yet? <Text style={styles.linkAccent}>Create one →</Text>
          </Text>
          
          <View style={styles.encInfoBox}>
            <Text style={styles.encInfoText}>
              AES-256-GCM · WebAuthn W3C · PBKDF2-SHA256 · Zero plaintext storage
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: activeTheme.void,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 48, // plus safe area via ScreenWrapper normally, but we use hardcoded padding for now
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  eyebrow: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: activeTheme.tx3,
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontFamily: TOKENS.fonts.disp,
    fontSize: 34,
    color: activeTheme.tx1,
    lineHeight: 38,
    marginBottom: 6,
  },
  titleItalic: {
    fontStyle: 'italic',
    color: activeTheme.acc,
  },
  subtext: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 13,
    color: activeTheme.tx2,
    lineHeight: 19.5,
    maxWidth: 280,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  cipherWrapper: {
    marginBottom: 20,
  },
  inputWrap: {
    marginBottom: 14,
  },
  btnWrap: {
    marginBottom: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: activeTheme.bdr,
  },
  dividerText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    color: activeTheme.tx3,
    letterSpacing: 0.8,
  },
  bottomLink: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx3,
  },
  linkAccent: {
    color: activeTheme.acc,
  },
  encInfoBox: {
    marginTop: 24,
    backgroundColor: activeTheme.raised,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  encInfoText: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 10,
    color: activeTheme.tx3,
    letterSpacing: 0.5,
  },
});
