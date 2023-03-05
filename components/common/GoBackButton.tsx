import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { baseColors } from "../../styles/colors";

export default function GoBackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={() => navigation.goBack()}
    >
      <Text style={{ color: baseColors.white }}>Back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    alignItems: "center",
    borderWidth: 2,
    borderColor: baseColors.primary,
    borderRadius: 23,
    width: 60,
    padding: 5,
    backgroundColor: baseColors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 20,
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    position: "absolute",
    top: 34,
    left: 20,
    zIndex: 99,
  },
});
