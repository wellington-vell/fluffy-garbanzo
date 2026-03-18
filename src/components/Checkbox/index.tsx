import { theme } from "@/src/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import Box from "../Box";

type Props = {
  value?: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: TouchableOpacityProps["style"];
  disabled?: boolean;
};

const defaultLabelStyle = {
  color: theme.colors.brown[700],
  fontFamily: theme.fontFamily.medium,
  fontSize: theme.fontSize.MD,
};

const Checkbox = ({
  value,
  onChange,
  label,
  labelStyle,
  disabled,
  style,
}: Props) => {
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
        {!!label && (
          <Text style={[defaultLabelStyle, labelStyle]}>{label}</Text>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default Checkbox;
