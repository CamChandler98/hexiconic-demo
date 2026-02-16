import { StyleSheet, View, ViewProps } from "react-native";

type HeaderRightGroupProps = ViewProps & {
  children: React.ReactNode;
};

export const HeaderRightGroup = ({
  children,
  style,
  ...rest
}: HeaderRightGroupProps) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
