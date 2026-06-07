import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

export function AnimatedSplashScreen({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const startAnimation = () => {
    // Pulse animation before zoom out
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withTiming(10, { duration: 800 });
      opacity.value = withTiming(0, { duration: 600 }, () => {
        runOnJS(onAnimationFinish)();
      });
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={StyleSheet.absoluteFill} className="bg-[#050507] justify-center items-center">
      <Animated.Image
        source={require('../../assets/images/splash-icon.png')}
        style={[{ width: 160, height: 160 }, animatedStyle]}
        onLoadEnd={startAnimation}
        resizeMode="contain"
      />
    </View>
  );
}
