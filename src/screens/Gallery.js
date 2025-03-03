import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Video from "react-native-video";
import { useNavigation } from "@react-navigation/native";
import Screen from "../components/Screen";
import playbutton from "../../assets/images/playbutton.png";
import VideoModal from "../components/VideoModal";

const Gallery = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const [videoUrl, setVideoUrl] = useState("");
  const [toggleModal, setToggleModal] = useState(false);
  const [playAll, setPlayAll] = useState(false);

  const toggleEditModal = () => {
    setToggleModal(!toggleModal);
  };

  const handleVideoPlay = (src) => {
    console.log("Item ", src);
    setVideoUrl(src);
    setToggleModal(true);
  };

  useEffect(() => {
    loadVideos();
  }, []);
  console.log("VIDEOS ", videoUrl);

  const loadVideos = async () => {
    try {
      const savedVideos = await AsyncStorage.getItem("videos");
      if (savedVideos) setVideos(JSON.parse(savedVideos));
    } catch (error) {
      console.error("Failed to load videos:", error);
    }
  };
  const clearAllVideos = async () => {
    try {
      await AsyncStorage.removeItem("videos");
      setVideos([]); // Update state to reflect changes
      Alert.alert("Success", "All videos have been deleted.");
    } catch (error) {
      console.error("Failed to delete videos:", error);
    }
  };

  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      setPlayAll(false);

      Alert.alert("Playback Complete", "All videos have been played.");
    }
  };

  const renderVideoList = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => handleVideoPlay(item)}
        key={index}
        className="m-3 w-40 h-40 rounded-lg overflow-hidden border-2 border-white"
      >
        <Image
          source={playbutton}
          style={{
            position: "absolute",
            alignSelf: "center",
            height: 28,
            width: 28,
            top: 60,
            zIndex: 30,
          }}
        />

        <Video
          ref={videoRef}
          source={{ uri: item }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
          paused
          controls={false}
          onEnd={handleVideoEnd}
        />
      </TouchableOpacity>
    );
  };

  const HEADER = () => {
    return (
      <View className="w-full p-2 h-20 m-2 bg-blue-800 flex-row items-center justify-between px-3 absolute top-0">
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text className="text-xl font-semibold text-white">Home</Text>
        </TouchableOpacity>
        {videos?.length > 0 && (
          <TouchableOpacity onPress={() => setPlayAll(true)}>
            <Text className="text-xl font-semibold text-white">Play all</Text>
          </TouchableOpacity>
        )}

        {videos?.length > 0 && (
          <TouchableOpacity onPress={clearAllVideos}>
            <Text className="text-xl font-semibold text-red-700">
              Clear all
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Screen style={styles.container}>
      {!playAll && <HEADER />}

      {playAll ? (
        <>
          <Video
            ref={videoRef}
            source={{ uri: videos[currentVideoIndex] }}
            style={styles.video}
            controls
            resizeMode="cover"
            onEnd={handleVideoEnd}
          />

          <Text style={styles.videoCounter}>
            Video {currentVideoIndex + 1} / {videos.length}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
        </>
      ) : videos.length == 0 ? (
        <Text style={styles.noVideosText}>
          No videos found. Record some first!
        </Text>
      ) : (
        toggleModal && (
          <VideoModal
            src={videoUrl}
            isEditModalVisible={toggleModal}
            toggleEditModal={toggleEditModal}
          />
        )
      )}
      {!playAll && (
        <View className="flex-row flex-wrap items-start mx-3 justify-evenly space-x-3 w-full space-y-3">
          {videos?.map((item, index) => renderVideoList(item, index))}
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  video: { width: "100%", height: 500 },
  videoCounter: { color: "white", fontSize: 18, marginTop: 10 },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: "white", fontSize: 18 },
  noVideosText: { color: "white", fontSize: 18 },
});

export default Gallery;
