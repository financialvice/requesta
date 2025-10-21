import { StyleSheet, TextInput, type TextInputProps } from "react-native";

export const TextField = ({ ...textInputProps }: TextInputProps) => (
  <TextInput {...textInputProps} style={[styles.input, textInputProps.style]} />
);

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
