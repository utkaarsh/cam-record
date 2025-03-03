import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  View,
} from "react-native";

export default function Screen({ children, style }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.screen, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "white", // Adjust the background color as needed
  },
  screen: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
