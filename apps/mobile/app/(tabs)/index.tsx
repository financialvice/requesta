import { StyleSheet, Text } from "react-native";
import Container from "@/components/container";

export default function TabOneScreen() {
  return (
    <Container style={textStyle.container}>
      <Text style={textStyle.fontBold}>Hello World</Text>
    </Container>
  );
}

const textStyle = StyleSheet.create({
  container: {
    backgroundColor: "blue",
  },
  fontBold: {
    fontWeight: "bold",
  },
});
