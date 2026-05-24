import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Uploads() {
  return (
    <SafeAreaView className="flex-1 bg-[#0B1120]">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl text-text-primary font-bold">Upload Center</Text>
      </View>
    </SafeAreaView>
  );
}
