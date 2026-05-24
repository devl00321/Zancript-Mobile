import React from 'react';
import { View, Text, ViewProps, TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface CardProps extends ViewProps {
  elevated?: boolean;
}

const Card = ({ className, children, elevated = false, ...props }: CardProps) => (
  <View
    className={twMerge(
      'rounded-lg border border-border bg-[#0B1120] overflow-hidden',
      elevated && 'border-border bg-surface-elevated',
      className
    )}
    {...props}
  >
    {children}
  </View>
);

const CardHeader = ({ className, children, ...props }: ViewProps) => (
  <View className={twMerge('px-6 py-4 border-b border-border', className)} {...props}>
    {children}
  </View>
);

const CardTitle = ({ className, children, ...props }: TextProps) => (
  <Text className={twMerge('text-lg font-semibold text-text-primary tracking-tight', className)} {...props}>
    {children}
  </Text>
);

const CardDescription = ({ className, children, ...props }: TextProps) => (
  <Text className={twMerge('text-sm text-text-secondary mt-1', className)} {...props}>
    {children}
  </Text>
);

const CardContent = ({ className, children, ...props }: ViewProps) => (
  <View className={twMerge('p-6', className)} {...props}>
    {children}
  </View>
);

const CardFooter = ({ className, children, ...props }: ViewProps) => (
  <View className={twMerge('px-6 py-4 bg-black/10 border-t border-border flex-row items-center', className)} {...props}>
    {children}
  </View>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
