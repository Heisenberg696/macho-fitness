import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { FlatList } from 'react-native';

const ExerciseCard = () => {
  const [play, setPlay] = useState(false);
  const [exerciseData, setExerciseData] = useState({});
  const [images, setImages] = useState([]);
  const [instructions, setInstructions] = useState([]);

  const imageURL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/90_90_Hamstring';

  const fetchExerciseData = async () => {
    const url = 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercise/90_90_Hamstring';
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
    }
  };

  useEffect(() => {
    fetchExerciseData();
  }, []);

  return (
    <ScrollView>
      <View className="flex flex-col items-center px-4 my-8">
        <View className="flex flex-row gap-3 items-start">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="flex flex-justify flex-row">
              <View className="flex justify-center flex-1  gap-y-1">
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
        <View className="flex flex-row gap-3 items-start mt-6 mb-1">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="flex flex-justify flex-row">
              <View className="flex justify-center flex-1  gap-y-1">
                <Text className="font-psemibold text-lg text-secondary-100" numberOfLines={1}>
                  Level of difficulty
                </Text>
                <Text className="font-psemibold text-white capitalize text-md " numberOfLines={1}>
                  {exerciseData.level || 'No data found'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex flex-row gap-3 items-start mt-1">
          <View className="flex justify-center items-center flex-row flex-1">
            <View className="flex flex-justify flex-row">
              <View className="flex justify-center flex-1  gap-y-1">
                <Text className="font-psemibold text-lg text-secondary-100" numberOfLines={1}>
                  Instructions
                </Text>
              </View>
            </View>
          </View>
        </View>

        {instructions?.map((instruction, index) => (
          <View key={index} className="w-full my-2">
            <View className="w-full">
              <Text className="font-psemibold leading-6 tracking-wider rounded-full text-md text-white flex flex-col justify-center items-center">
                {index + 1}. {instruction}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ExerciseCard;
