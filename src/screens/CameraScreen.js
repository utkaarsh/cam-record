import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Video from "react-native-video";
import { windowHeight, windowWidth } from "../utils/constants";
import Screen from "../components/Screen";
import { useNavigation } from "@react-navigation/native";

const VideoRecorder = () => {
  const device = useCameraDevice("back");
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const [savedVideos, setSavedVideos] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const navigation = useNavigation();

  // Choose timer position: "top-right" or "bottom-center"
  const timerPosition = "top-right";

  useEffect(() => {
    loadSavedVideos();
  }, []);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isRecording]);

  if (!device) return <Text>No Camera Available</Text>;

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const loadSavedVideos = async () => {
    try {
      const videos = await AsyncStorage.getItem("videos");
      if (videos) {
        setSavedVideos(JSON.parse(videos));
      }
    } catch (error) {
      console.error("Failed to load videos:", error);
    }
  };

  const saveVideo = async (uri) => {
    try {
      const updatedVideos = [...savedVideos, uri];
      await AsyncStorage.setItem("videos", JSON.stringify(updatedVideos));
      setSavedVideos(updatedVideos);
      setVideoUri(null);
      Alert.alert("Saved!", "Video has been saved successfully.");
    } catch (error) {
      console.error("Failed to save video:", error);
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.error("Camera ref is null!");
      return;
    }
    try {
      setIsRecording(true);
      setRecordingTime(0);

      await cameraRef.current.startRecording({
        onRecordingFinished: (video) => {
          console.log("Video recorded:", video);
          setVideoUri(video.path);
          setIsRecording(false);
          clearInterval(timerInterval);
        },
        onRecordingError: (error) => {
          console.error("Recording error:", error);
          setIsRecording(false);
          clearInterval(timerInterval);
        },
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
    }
  };

  useEffect(() => {
    if (isRecording) {
      setTimeout(() => {
        stopRecording();
      }, 4000);
    }
  }, [isRecording]);

  return (
    <Screen style={styles.container}>
      {!videoUri ? (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={true}
            video={true}
            audio={true}
            enableZoomGesture
          />

          <View className="absolute top-5 left-5">
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Text className="text-xl font-semibold text-white">Home</Text>
            </TouchableOpacity>
          </View>
          {/* Timer - Choose between "top-right" or "bottom-center" */}
          {isRecording && (
            <View
              style={
                timerPosition === "top-right"
                  ? styles.timerTopRight
                  : styles.timerBottomCenter
              }
            >
              <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
            </View>
          )}
        </>
      ) : (
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          controls
          resizeMode="cover"
        />
      )}

      <View className="flex-row items-center justify-around space-x-3 bottom-20 absolute w-full ">
        {/* Circular Button */}
        <TouchableOpacity
          onPress={() => {
            if (!isRecording && !videoUri) startRecording();
            else if (isRecording) stopRecording();
            else setVideoUri(null);
          }}
          style={[
            styles.circularButton,
            { backgroundColor: isRecording ? "red" : "white" },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                fontWeight: "bold",
              },
            ]}
          >
            {isRecording ? "Stop" : videoUri ? "↻" : "Start"}
          </Text>
        </TouchableOpacity>

        {/* Save Video Option */}
        {videoUri && (
          <TouchableOpacity
            onPress={() => saveVideo(videoUri)}
            style={styles.saveButton}
          >
            <Text style={styles.buttonText}>Save 💾 </Text>
          </TouchableOpacity>
        )}
      </View>
    </Screen>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    // justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    overflow: "hidden",
  },
  video: {
    width: windowWidth - 30,
    height: windowHeight * 0.81,
    borderRadius: 15,
    padding: 20,
    margin: 20,
    overflow: "hidden",
  },

  // Timer Positions
  timerTopRight: {
    position: "absolute",
    top: 15,
    right: 18,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 5,
  },
  timerBottomCenter: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 5,
  },
  timerText: { color: "white", fontSize: 16, fontWeight: "bold" },

  // Circular Button
  circularButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    // position: "absolute",
    // bottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "black", fontSize: 20 },

  // Save Button
  saveButton: {
    // position: "absolute",
    // bottom: 110,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
});

export default VideoRecorder;
