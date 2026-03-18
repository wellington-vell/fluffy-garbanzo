import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

type BoxProps = ViewStyle & {
  children?: ReactNode;
};

const Box = ({ children, ...props }: BoxProps) => {
  return <View style={props} children={children} />;
};

export default Box;
