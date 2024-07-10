import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native';
import { CustomButton } from '../../components';
import useNotifications from '../../hooks/use-notifications';

const ExerciseDetails = ({ exerciseId }) => {
  const [exerciseData, setExerciseData] = useState({});
  const [images, setImages] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const imageURL = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${exerciseId}`;

  const fetchExerciseData = async () => {
    const url = `https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercise/${exerciseId}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '96fce37178mshf2ea6f526e71d90p171917jsn47c2d7b2af9e',
        'x-rapidapi-host': 'exercise-db-fitness-workout-gym.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setExerciseData(result);
      setImages(result.images);
      setInstructions(result.instructions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExerciseData();
  }, []);

  const { expoPushToken, sendPushNotification } = useNotifications();

  const startOrPauseTimer = () => {
    if (timer === null) {
      sendPushNotification(expoPushToken, 'Exercise started', 'Your exercise timer has started.');
      setTimer(180);
      setIsPaused(false);
    } else if (isPaused) {
      sendPushNotification(expoPushToken, 'Exercise resumed', 'Your exercise timer has resumed.');
      setIsPaused(false);
    } else {
      sendPushNotification(expoPushToken, 'Exercise paused', 'Your exercise timer has been paused.');
      setIsPaused(true);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timer === 0) {
      sendPushNotification(expoPushToken, 'Exercise ended', 'Your exercise session has ended.');
      setTimer(null);
      setIsPaused(false);
      return;
    }

    if (timer !== null && !isPaused) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, isPaused]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF9001" />
      </View>
    );
  }

  return (
    <ScrollView className="my-12 px-2">
      <View className="flex flex-col items-center px-2 my-2 h-full">
        <View className="flex flex-row gap-3 items-start">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="flex flex-justify flex-row">
              <View className="flex justify-center flex-1 gap-y-1">
                <Text className="font-psemibold text-xl text-white" numberOfLines={1}>
                  {exerciseData.name || 'Exercise Name'}
                </Text>
                <Text className="text-sm capitalize text-gray-100 font-pregular" numberOfLines={1}>
                  Category: {exerciseData.category || 'Category'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          data={images}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ index }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="w-72 mr-5 h-44 rounded-xl mt-3 relative flex justify-center items-center"
            >
              <Image
                source={{ uri: `${imageURL}/${index}.jpg` }}
                className="w-full h-full rounded-xl"
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
        <View className="flex flex-row gap-3 items-start mt-2 mb-1">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="flex flex-justify flex-row">
              <View className="flex justify-center flex-1 gap-y-1">
                <Text className="font-psemibold text-xl text-secondary-100" numberOfLines={1}>
                  Level of difficulty
                </Text>
                <Text className="font-psemibold text-gray-100 capitalize text-md" numberOfLines={1}>
                  {exerciseData.level || 'No data found'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex flex-row gap-3 items-start mt-1">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="flex flex-justify flex-row">
              <View className="flex justify-center flex-1 gap-y-1">
                <Text className="font-psemibold text-xl text-secondary-100" numberOfLines={1}>
                  Instructions
                </Text>
              </View>
            </View>
          </View>
        </View>

        {instructions?.map((instruction, index) => (
          <View key={index} className="w-full my-2">
            <View className="w-full flex flex-row gap-y-10 gap-x-2">
              <View className="w-6 h-6 rounded-full text-md bg-secondary flex flex-col justify-center items-center">
                <Text className="text-primary font-psemibold">{index + 1}</Text>
              </View>
              <Text className="font-pregular leading-6 tracking-wider rounded-full text-md text-gray-50 flex flex-col justify-center items-center">
                {instruction}
              </Text>
            </View>
          </View>
        ))}

        <View className="mt-4 mb-8 w-full">
          <CustomButton
            title={timer === null ? 'Start Exercise' : isPaused ? 'Resume Exercise' : `Time left: ${formatTime(timer)}`}
            handlePress={startOrPauseTimer}
            containerStyles="w-full"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ExerciseDetails;
