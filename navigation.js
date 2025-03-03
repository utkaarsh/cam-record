import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CameraScreen from "./src/screens/CameraScreen";
import PlaybackScreen from "./src/screens/PlaybackScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Playback" component={PlaybackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
