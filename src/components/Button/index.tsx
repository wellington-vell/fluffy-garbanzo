import { theme } from "@/src/theme";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Props = TouchableOpacityProps & {
  label?: string;
};

const Button = ({ label, style, ...props }: Props) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      {!!label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default Button;

export const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: theme.colors.blue[500],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    boxShadow:
      "rgba(0, 0, 0, 0.4) 0px 2px 3px -1px, rgba(0, 0, 0, 0.08) 0px 1px 2px -1px",
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
