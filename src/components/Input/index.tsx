import { theme } from "@/src/theme";
import { addAlphaColor } from "@/src/utils/color.utils";
import React, { forwardRef } from "react";
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
  containerStyle?: ViewStyle;
  error?: string;
};

const Input = forwardRef<TextInput, InputProps>(
  (
    { placeholder, label, containerStyle, error, testID, ...inputProps },
    ref
  ) => {
    return (
      <>
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
  Text: {
    color: theme.colors.brown[700],
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.SM,
  },
  Error: {
    color: theme.colors.error,
  },
});
