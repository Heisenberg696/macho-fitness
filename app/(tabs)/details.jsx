import { SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ExerciseDetails from '../exercises/exercise-details';

const Details = () => {
  const { exerciseId } = useLocalSearchParams();
  console.log(exerciseId);
  return (
    <SafeAreaView className="h-screen bg-primary">
      <ExerciseDetails exerciseId={exerciseId} />
    </SafeAreaView>
  );
};

export default Details;
