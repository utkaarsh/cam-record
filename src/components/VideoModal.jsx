import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Video from "react-native-video";
import { windowHeight } from "../utils/constants";

function VideoModal({ isEditModalVisible, toggleEditModal, src }) {
  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);
  const navigation = useNavigation();

  return (
    <Modal
      visible={isEditModalVisible}
      onRequestClose={toggleEditModal}
      animationType="slide"
      transparent
    >
      <View className="flex-1  justify-center ">
        <View style={styles.container}>
          <Video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
              zIndex: 10,
            }}
            onLoad={() => setLoading(false)}
            source={{ uri: src || null }}
            controls
          />

          {loading && (
            <View className="absolute h-full w-full z-10 flex justify-center items-center bg-black/50 ">
              <ActivityIndicator color={"#fff"} size={80} />
            </View>
          )}
        </View>

        <Text
          onPress={toggleEditModal}
          className="text-center text-2xl mt-10 text-white font-bold z-10"
        >
          X
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight - 350,
    borderRadius: 35,
    overflow: "hidden",
    marginHorizontal: 10,

    zIndex: 20,
  },
  text: {
    color: "red",
  },
});

export default VideoModal;
