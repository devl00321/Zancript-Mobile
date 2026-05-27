import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;

interface CipherTextProps {
  text: string;
  duration?: number;
  delay?: number;
  style?: object;
}

const chars = '0123456789abcdef';

export function CipherText({ text, duration = 80, delay = 40, style }: CipherTextProps) {
  const [displayText, setDisplayText] = useState<string>('');
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    
    // Pre-calculate the exact timeline for each character
    const charConfigs = text.split('').map((finalChar, index) => {
      const flips = 4 + Math.floor(Math.random() * 3); // 4-6 flips
      const startFlippingAt = index * delay;
      const finishFlippingAt = startFlippingAt + (flips * duration);
      return { finalChar, startFlippingAt, finishFlippingAt };
    });

    const tick = () => {
      const elapsed = Date.now() - startTime;
      let currentText = '';
      let allResolved = true;

      for (let i = 0; i < charConfigs.length; i++) {
        const config = charConfigs[i];
        if (elapsed < config.startFlippingAt) {
          // Not started flipping yet
          currentText += '0';
          allResolved = false;
        } else if (elapsed >= config.finishFlippingAt) {
          // Finished flipping, show real character
          currentText += config.finalChar;
        } else {
          // Actively flipping
          // Only update the random character every 'duration' ms roughly
          // Or just update it every frame for a smoother look
          currentText += chars[Math.floor(Math.random() * chars.length)];
          allResolved = false;
        }
      }

      setDisplayText(currentText);

      if (allResolved) {
        setIsResolved(true);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [text, duration, delay]);

  return (
    <Text style={[styles.text, isResolved && styles.resolvedText, style]}>
      {displayText}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 11,
    color: activeTheme.tx3,
    letterSpacing: 0.5,
  },
  resolvedText: {
    color: activeTheme.acc,
  },
});
