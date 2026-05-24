import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from 'lucide-react-native';

export interface SecureInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  showEntropy?: boolean;
  entropyScore?: number;
  className?: string;
}

const SecureInput = forwardRef<TextInput, SecureInputProps>(({
  className,
  label,
  error,
  leftIcon,
  showEntropy,
  entropyScore = 0,
  ...props
}, ref) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View className="w-full">
      {label ? (
        <Text className="font-mono text-[11px] text-text-secondary mb-1.5 uppercase tracking-widest">
          {label}
        </Text>
      ) : null}
      <View className="relative justify-center rounded-md overflow-hidden border border-border bg-[#0B1120]">
        {leftIcon ? (
          <View className="absolute left-3 z-10">
            {leftIcon}
          </View>
        ) : null}
        <TextInput
          ref={ref}
          secureTextEntry={isSecure}
          placeholderTextColor="rgba(148, 163, 184, 0.5)"
          className={twMerge(
            'flex h-12 w-full px-4 text-sm text-text-primary font-sans',
            leftIcon && 'pl-10',
            'pr-12',
            error && 'border-status-danger',
            className
          )}
          {...props}
        />
        <TouchableOpacity
          onPress={() => setIsSecure(!isSecure)}
          className="absolute right-3 z-10 p-1"
        >
          {isSecure ? (
            <EyeOff size={18} color="#94A3B8" />
          ) : (
            <Eye size={18} color="#94A3B8" />
          )}
        </TouchableOpacity>

        {showEntropy && (
          <View className="absolute bottom-0 left-0 h-0.5 bg-primary-accent/20 w-full">
            <View
              className={twMerge(
                'h-full',
                entropyScore < 40 ? 'bg-status-danger' : entropyScore < 70 ? 'bg-status-warning' : 'bg-status-success'
              )}
              style={{ width: `${Math.min(100, Math.max(0, entropyScore))}%` }}
            />
          </View>
        )}
      </View>
      {error ? (
        <Text className="mt-1.5 font-mono text-xs text-status-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

SecureInput.displayName = 'SecureInput';
export default SecureInput;
