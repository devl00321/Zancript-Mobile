import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Vault, CloudUpload, ShieldCheck, User } from 'lucide-react-native';
import { TOKENS } from '../../constants/tokens';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const activeTheme = TOKENS.colors.dark;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: activeTheme.surf,
          borderTopWidth: 1,
          borderTopColor: activeTheme.bdr,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 12,
        },
        tabBarActiveTintColor: activeTheme.acc,
        tabBarInactiveTintColor: activeTheme.tx3,
        tabBarLabelStyle: {
          fontFamily: TOKENS.fonts.mono,
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          marginTop: 4,
        },
        sceneStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dash',
          tabBarIcon: ({ color }) => <LayoutDashboard size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color }) => <Vault size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => <CloudUpload size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: 'Security',
          tabBarIcon: ({ color }) => <ShieldCheck size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
