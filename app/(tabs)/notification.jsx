import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Image, FlatList, TouchableOpacity, Text } from 'react-native';

import useAppwrite from '../../lib/useAppwrite';
import { getUserPosts, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className="bg-primary h-full my-4 px-4 space-y-6">
      <View className="mt-2">
        <Text className="text-white text-2xl font-psemibold">Notifications</Text>
      </View>
      <View className="w-full mx-auto items-center justify-between">
        <View className="mt-10">
          <Text className="text-secondary-100 font-psemibold text-lg text-center">No new notification 😴</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
