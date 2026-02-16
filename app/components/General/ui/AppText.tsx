import { Typography } from "@/theme/typography";
import { StyleSheet, Text, TextProps } from "react-native";

type AppTextProps = TextProps & {
  variant?: keyof typeof Typography;
};

export function AppText({ variant = "body", style, ...props }: AppTextProps) {
  return (
    <Text
      {...props}
      style={[styles.base, Typography[variant], style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Inter-Regular",
    color: "#222",
  },
});