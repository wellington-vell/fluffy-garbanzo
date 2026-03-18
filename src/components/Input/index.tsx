import { theme } from "@/src/theme";
import { addAlphaColor } from "@/src/utils/color.utils";
import React, { ReactNode, forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

export type InputProps = TextInputProps & {
  placeholder?: string;
  label?: string;
  leftIcon?: ReactNode;
  containerStyle?: ViewStyle;
  error?: string;
};

const Input = forwardRef<TextInput, InputProps>(
  (
    { placeholder, label, leftIcon, containerStyle, error, testID, ...inputProps },
    ref
  ) => {
    return (
      <>
        {(!!label || !!leftIcon) && (
          <View style={styles.labelRow}>
            {!!leftIcon && leftIcon}
            {!!label && <Text style={styles.Label}>{label}</Text>}
          </View>
        )}
        <View style={[styles.Container, containerStyle]} testID={testID}>
          <TextInput
            ref={ref}
            placeholder={placeholder}
            placeholderTextColor={addAlphaColor(theme.colors.gray[400], 150)}
            autoCapitalize="none"
            {...inputProps}
            style={[{ paddingVertical: 10, flex: 1 }, inputProps.style]}
          />
        </View>
        {!!error && <Text style={styles.Error}>{error}</Text>}
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;

export const styles = StyleSheet.create({
  Container: {
    backgroundColor: theme.colors.white,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 16,
    borderWidth: 1.2,
    borderColor: theme.colors.gray[200],
    flexDirection: "row",
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  Label: {
    color: theme.colors.brown[700],
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fontSize.XM,
  },
  Text: {
    color: theme.colors.brown[700],
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.SM,
  },
  Error: {
    color: theme.colors.error,
  },
});
