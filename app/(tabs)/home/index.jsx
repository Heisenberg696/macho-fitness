import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View, ScrollView } from 'react-native';

import { icons } from '../../../constants';
import useAppwrite from '../../../lib/useAppwrite';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { getAllPosts, getLatestPosts, signOut } from '../../../lib/appwrite';
import { EmptyState, SearchInput, Trending, VideoCard } from '../../../components';
import AllExercises from '../../exercises';
import { router } from 'expo-router';

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const { user, setUser, setIsLogged } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const goToNotification = () => {
    router.push('/notification');
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        // data={posts}
        // keyExtractor={(item) => item.$id}
        // renderItem={({ item }) => (
        //   <VideoCard
        //     title={item.title}
        //     thumbnail={item.thumbnail}
        //     video={item.video}
        //     creator={item.creator.username}
        //     avatar={item.creator.avatar}
        //   />
        // )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back</Text>
                <Text className="text-2xl font-psemibold text-white">{user ? user.username : 'No user found'}</Text>
              </View>

              <View className="mt-1.5">
                {/* <TouchableOpacity onPress={goToNotification}>
                  <Image source={icons.notification} tintColor="#FFA001" className="w-6 h-6" resizeMode="contain" />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={logout} className="flex w-full items-end mb-10">
                  <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
                </TouchableOpacity>
              </View>
            </View>

            <SearchInput />

            <Text className="text-lg font-pregular text-gray-100 mb-3">All Exercises</Text>
            {/* <Trending posts={latestPosts ?? []} /> */}
            <AllExercises />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Home;
