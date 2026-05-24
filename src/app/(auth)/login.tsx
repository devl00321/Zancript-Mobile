import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import SecureInput from '@/components/ui/SecureInput';
import Button from '@/components/ui/Button';
import { Lock } from 'lucide-react-native';

export default function Login() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B1120]">
      <View className="flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-sm" elevated>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Authenticate to access your encrypted vault</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 gap-4 flex-col">
            <SecureInput
              label="Master Password"
              placeholder="Enter your master password"
              leftIcon={<Lock size={18} />}
            />
            <Button variant="primary" className="w-full">
              Unlock Vault
            </Button>
          </CardContent>
        </Card>
      </View>
    </SafeAreaView>
  );
}
