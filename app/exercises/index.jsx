import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';

const AllExercises = () => {
  const imageURL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

  const [exerciseIds, setExerciseIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllExercises = async () => {
    const url = 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/exercises';
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
      if (result && Array.isArray(result.excercises_ids)) {
        setExerciseIds(result.excercises_ids);
      } else {
        console.error('Unexpected response format:', result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExercises();
  }, []);

  const goToDetails = (exerciseId) => {
    router.navigate({
      pathname: 'details',
      params: { exerciseId: exerciseId },
    });
  };

  return (
    <ScrollView className="mb-10 bg-primary">
      {loading ? (
        <View className=" flex justify-center items-center w-full mt-14">
          <ActivityIndicator size="large" color={'#FF9001'} />
        </View>
      ) : (
        exerciseIds.slice(0, 15).map((exercise) => {
          return (
            <View
              key={exercise}
              className="flex flex-col items-center mt-2 mb-4 border-2 border-secondary-100 rounded-2xl"
            >
              <View className="w-full relative">
                <TouchableOpacity
                  onPress={() => goToDetails(exercise)}
                  activeOpacity={0.7}
                  className="w-full h-56 rounded-2xl relative"
                >
                  <Image
                    source={{ uri: `${imageURL}/${exercise}/0.jpg` }}
                    className="w-full h-full rounded-2xl"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 rounded-b-2xl">
                    <Text className="font-psemibold text-xl text-white" numberOfLines={1}>
                      {exercise}
                    </Text>
                    <Text className="text-sm capitalize text-gray-100 font-pregular" numberOfLines={1}>
                      Level: beginner
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default AllExercises;
