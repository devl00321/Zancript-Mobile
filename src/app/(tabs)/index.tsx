import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/Button';
import { router } from 'expo-router';

export default function Dashboard() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B1120]">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl text-text-primary font-bold mb-4">Dashboard</Text>
        <Button variant="primary" onPress={() => router.push('/(auth)/login')}>
          Go to Login
        </Button>
      </View>
    </SafeAreaView>
  );
}
