import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/native";

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <Screen style={styles.container}>
      <Text className="text-3xl font-bold text-center uppercase">
        React Native Assignment
      </Text>
      <View className="flex h-2/4 mx-5 items-center justify-around space-y-2 p-2 my-5 bg-blue-500">
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Camera")}
        >
          <Text style={styles.text}> Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Gallery")}
        >
          <Text style={styles.text}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    color: "#fff",
    fontSize: 28,
    textTransform: "uppercase",
  },
  baseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "20",
    justifyContent: "space-around",
  },

  button: {
    backgroundColor: "blue",
    padding: 10,
    width: 156,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
