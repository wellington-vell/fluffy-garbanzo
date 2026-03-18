import { theme } from "@/src/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Box from "../Box";

type Props = {
  value?: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  style?: TouchableOpacityProps["style"];
  disabled?: boolean;
};

const Checkbox = ({ value, onChange, label, disabled, style }: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => onChange(!value)}
      style={style}
    >
      <Box flexDirection="row" alignItems="center" gap={5}>
        <Ionicons
          name={value ? "checkbox" : "square-outline"}
          size={24}
          color={theme.colors.blue[500]}
        />
        <Text>{label}</Text>
      </Box>
    </TouchableOpacity>
  );
};

export default Checkbox;
