import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = ({ title, ...touchableProps }: ButtonProps) => (
  <TouchableOpacity
    {...touchableProps}
    style={[styles.button, touchableProps.style]}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
