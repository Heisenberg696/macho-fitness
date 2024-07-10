import { Image, View, Text, SafeAreaView } from 'react-native';
import { FormField, CustomButton } from '../../components';
import React, { useState, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';
import { images } from '../../constants';
import useNotifications from '../../hooks/use-notifications';

const StepCounter = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [stepGoal, setStepGoal] = useState(1);
  const [isAccelerometerActive, setIsAccelerometerActive] = useState(false);
  const accelerometerSubscription = useRef(null);
  const [totalCaloriesBurnt, setTotalCaloriesBurnt] = useState(0);
  let estimatedCaloriesBurnt = Math.round(stepCount * 0.01, 10);

  const { expoPushToken, sendPushNotification } = useNotifications();

  const startTracking = () => {
    sendPushNotification(expoPushToken, 'Macho Fitness', 'Step tracking started💪');
    setIsAccelerometerActive(true);
    Accelerometer.isAvailableAsync().then((isAvailable) => {
      if (isAvailable) {
        accelerometerSubscription.current = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timestamp = new Date().getTime();

          if (Math.abs(y - lastY) > threshold && !isCounting && timestamp - lastTimestamp > 800) {
            setIsCounting(true);
            setLastTimestamp(timestamp);
            setStepCount((prev) => {
              const newStepCount = prev + 1;
              if (newStepCount >= stepGoal) {
                sendPushNotification(expoPushToken, 'Macho Fitness', `You've reached your goal of ${stepGoal} steps!`);

                if (accelerometerSubscription.current) {
                  accelerometerSubscription.current.remove();
                  setIsAccelerometerActive(false);
                  setTotalCaloriesBurnt((prev) => prev + estimatedCaloriesBurnt);
                }
              }
              return newStepCount;
            });

            setTimeout(() => {
              setIsCounting(false);
            }, 1000);
          }
        });
      } else {
        console.log('Accelerometer not available on device');
      }
    });
  };

  const resetStepCount = () => {
    setStepCount(0);
  };

  return (
    <SafeAreaView className="bg-primary h-full my-6 px-4 space-y-6">
      <View className="mt-10">
        <Text className="text-white text-2xl font-psemibold">Steps Tracker</Text>
      </View>
      <View className="flex flex-col mb-6">
        <FormField
          title="Enter your step goal for today 💪"
          placeholder="Enter number of steps"
          handleChangeText={(text) => setStepGoal(Number(text))}
        />
        <CustomButton
          title={`${stepCount === stepGoal ? 'Reset' : 'Start tracking'}`}
          handlePress={stepCount === stepGoal ? resetStepCount : startTracking}
          containerStyles="mt-7"
        />
      </View>
      <View className="w-full">
        <View className="w-full mx-auto flex flex-row justify-center">
          <CircularProgress
            value={stepCount}
            radius={120}
            initialValue={0}
            duration={10000}
            inActiveStrokeOpacity={0.2}
            inActiveStrokeColor={'#FF8E01'}
            progressValueColor={'#ecf0f1'}
            maxValue={stepGoal * 10}
            activeStrokeColor="#FF8E01"
            title={'Step count'}
            titleColor={'white'}
            titleFontSize={20}
            titleStyle={{ fontWeight: 'bold' }}
          />
        </View>
      </View>
      <View className="w-full mx-auto flex flex-col gap-2 items-center justify-between">
        <View className="flex flex-col">
          <Text className="text-white text-lg text-center font-psemibold">Calories Burnt 🔥</Text>
          <Text className="text-secondary-200 text-center text-lg font-psemibold">
            {stepCount === stepGoal ? totalCaloriesBurnt : estimatedCaloriesBurnt} cal
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StepCounter;
