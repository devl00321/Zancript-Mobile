import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { TOKENS } from '../../constants/tokens';

const activeTheme = TOKENS.colors.dark;

interface SecureInputProps extends TextInputProps {
  label: string;
  hint?: string;
  containerStyle?: object;
}

export function SecureInput({ label, hint, containerStyle, onFocus, onBlur, ...props }: SecureInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={activeTheme.tx3}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          {...props}
        />
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

export function SectionLabel({ text, style }: { text: string; style?: object }) {
  return <Text style={[styles.sectionLabel, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: activeTheme.tx3,
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: activeTheme.void,
    borderWidth: 1,
    borderColor: activeTheme.bdr,
    borderRadius: 7,
    height: 48,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderColor: activeTheme.accB,
    shadowColor: activeTheme.acc,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  input: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 15,
    color: activeTheme.tx1,
    height: '100%',
  },
  hint: {
    fontFamily: TOKENS.fonts.sans,
    fontSize: 10,
    color: activeTheme.tx3,
    marginTop: 6,
  },
  sectionLabel: {
    fontFamily: TOKENS.fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: activeTheme.tx3,
    marginTop: 16,
    marginBottom: 10,
  },
});
