import React, { forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const Input = forwardRef<TextInput, InputProps>(({
  className,
  label,
  error,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <View className="w-full">
      {label ? (
        <Text className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-widest">
          {label}
        </Text>
      ) : null}
      <View className="relative justify-center">
        {leftIcon ? (
          <View className="absolute left-3 z-10">
            {leftIcon}
          </View>
        ) : null}
        <TextInput
          ref={ref}
          placeholderTextColor="rgba(148, 163, 184, 0.5)"
          className={twMerge(
            'flex h-12 w-full rounded-md border border-border bg-surface-secondary/50 px-3 text-sm text-text-primary',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-status-danger text-status-danger',
            className
          )}
          {...props}
        />
        {rightIcon ? (
          <View className="absolute right-3 z-10">
            {rightIcon}
          </View>
        ) : null}
      </View>
      {error ? (
        <Text className="mt-1.5 text-xs text-status-danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

Input.displayName = 'Input';
export default Input;
