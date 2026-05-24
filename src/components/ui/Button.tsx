import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps extends PressableProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'security';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = React.forwardRef<View, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  ...props
}, ref) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.98); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  const variants: Record<string, string> = {
    primary: 'bg-primary-accent border border-transparent',
    secondary: 'bg-surface-elevated border border-border',
    ghost: 'bg-transparent border border-border',
    danger: 'bg-status-danger',
    outline: 'bg-transparent border border-primary-accent',
    security: 'bg-primary-bg border border-primary-accent',
  };

  const textVariants: Record<string, string> = {
    primary: 'text-primary-bg font-mono tracking-widest uppercase',
    secondary: 'text-text-primary',
    ghost: 'text-text-secondary',
    danger: 'text-white',
    outline: 'text-primary-accent',
    security: 'text-primary-accent',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    icon: 'p-2',
  };

  const textSizes: Record<string, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    icon: '',
  };

  return (
    <AnimatedPressable
      ref={ref}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={twMerge(
        'relative flex-row items-center justify-center rounded-md',
        variants[variant],
        sizes[size],
        (isLoading || props.disabled) ? 'opacity-50' : '',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <ActivityIndicator color="currentColor" className="mr-2" size="small" />}
      {!isLoading && leftIcon && <View className="mr-2">{leftIcon}</View>}
      {typeof children === 'string' ? (
        <Text className={twMerge(textVariants[variant], textSizes[size])}>{children}</Text>
      ) : (
        children
      )}
      {!isLoading && rightIcon && <View className="ml-2">{rightIcon}</View>}
    </AnimatedPressable>
  );
});

Button.displayName = 'Button';
export default Button;
