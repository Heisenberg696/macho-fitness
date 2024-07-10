import React, { useState } from 'react';
import { ResizeMode, Video } from 'expo-av';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '../constants';

const VideoCard = ({ title, prompt, thumbnail, video, openCommand }) => {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex flex-col items-center mb-8 shadow-gray-500 shadow-lg p-2 ">
      <View className="flex flex-row gap-3 items-center">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="flex justify-center flex-1  gap-y-1">
            <Text className="font-psemibold text-md text-secondary-100 capitalize" numberOfLines={1}>
              {title}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={openCommand} className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-48 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-48 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image source={{ uri: thumbnail }} className="w-full h-full rounded-xl mt-3" resizeMode="cover" />

          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}

      <View className="flex justify-center items-center flex-row flex-1 mt-5 mb-2">
        <View className="flex justify-center flex-1  gap-y-1">
          <Text className="font-psemibold text-md text-secondary-100 capitalize" numberOfLines={1}>
            Description
          </Text>
        </View>
      </View>
      <View className="flex justify-center items-center flex-row flex-1 ">
        <View className="flex justify-center flex-1  gap-y-1">
          <Text className="font-pregular leading-6 text-md text-white capitalize">{prompt}</Text>
        </View>
      </View>
    </View>
  );
};

export default VideoCard;
