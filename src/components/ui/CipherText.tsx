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
    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let intervalIds: ReturnType<typeof setInterval>[] = [];

    const animate = () => {
      setIsResolved(false);
      setDisplayText(Array(text.length).fill('00').join('').substring(0, text.length));

      const resolvedChars: string[] = Array(text.length).fill('');
      
      text.split('').forEach((finalChar, index) => {
        // Delay before starting this character
        const startTimeout = setTimeout(() => {
          let flips = 0;
          const maxFlips = 4 + Math.floor(Math.random() * 3); // 4-6 flips
          
          const flipInterval = setInterval(() => {
            if (flips >= maxFlips) {
              clearInterval(flipInterval);
              resolvedChars[index] = finalChar;
              
              setDisplayText((prev) => {
                const arr = prev.split('');
                arr[index] = finalChar;
                return arr.join('');
              });

              if (index === text.length - 1) {
                setIsResolved(true);
              }
            } else {
              resolvedChars[index] = chars[Math.floor(Math.random() * chars.length)];
              setDisplayText((prev) => {
                const arr = prev.split('');
                arr[index] = resolvedChars[index];
                return arr.join('');
              });
              flips++;
            }
          }, duration);
          
          intervalIds.push(flipInterval);
        }, index * delay);
        
        timeoutIds.push(startTimeout);
      });
    };

    animate();

    let loopTimeout: ReturnType<typeof setTimeout>;
    if (isResolved) {
      loopTimeout = setTimeout(() => {
        animate();
      }, 3000);
    }

    return () => {
      timeoutIds.forEach(clearTimeout);
      intervalIds.forEach(clearInterval);
      if (loopTimeout) clearTimeout(loopTimeout);
    };
  }, [text, duration, delay, isResolved]);

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
