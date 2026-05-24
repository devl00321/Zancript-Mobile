import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends ViewProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'security' | 'outline';
  textClassName?: string;
}

const Badge = ({ className, textClassName, variant = 'default', children, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-surface-elevated border-border',
    success: 'bg-status-success/10 border-status-success/20',
    warning: 'bg-status-warning/10 border-status-warning/20',
    danger: 'bg-status-danger/10 border-status-danger/20',
    security: 'bg-security/10 border-security/20',
    outline: 'bg-transparent border-border',
  };

  const textVariants = {
    default: 'text-text-secondary',
    success: 'text-status-success',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
    security: 'text-security',
    outline: 'text-text-secondary',
  };

  return (
    <View
      className={twMerge(
        'items-center justify-center rounded-full border px-2.5 py-0.5',
        variants[variant],
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className={twMerge('text-xs font-semibold', textVariants[variant], textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

export default Badge;
