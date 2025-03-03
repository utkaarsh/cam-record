import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import CameraScreen from "./screens/CameraScreen";
import Gallery from "./screens/Gallery";
import "../global.css";
import { Camera, useCameraPermission } from "react-native-vision-camera";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const colorScheme = useColorScheme();

  const requestCameraPermission = async () => {
    const permission = await requestPermission();
    console.log("Has camera permission : ", hasPermission);

    if (permission !== "authorized") {
      requestPermission();
      Alert.alert("Permission Denied", "Camera access is required.");
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <NavigationContainer>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="Gallery" component={Gallery} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NavigationContainer>
  );
}
