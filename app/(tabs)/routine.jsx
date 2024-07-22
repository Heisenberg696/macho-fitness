import { Text, View, FlatList, Button, RefreshControl, StatusBar, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import { EmptyState, VideoCard } from '../../components';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useState } from 'react';
import { BottomSheet } from '../../components/bottom-sheet';
import Accordion from '../../components/accordion';

const Routine = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onOpenModal = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const open = useSharedValue(false);
  const onPress = () => {
    open.value = !open.value;
  };

  return (
    <>
      <SafeAreaView className="px-6 my-6 bg-primary h-full">
        <View>
          <BottomSheet isVisible={isModalVisible} onClose={onModalClose} />
          <StatusBar style="auto" />
        </View>

        <Text className="text-2xl text-white font-psemibold">My routines</Text>
        {/* <Accordion title={'My routines'} details={'fff'} /> */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard
              openCommand={onOpenModal}
              closeCommand={onModalClose}
              title={item.title}
              thumbnail={item?.thumbnail}
              video={item?.video}
              creator={item.creator.username}
              prompt={item?.prompt}
            />
          )}
          ListEmptyComponent={() => <EmptyState title="No routines found" subtitle="No routines added yet" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={() => <View className="w-full flex justify-center items-center mb-6"></View>}
        />
      </SafeAreaView>
    </>
  );
};

export default Routine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    paddingBottom: '1rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parent: {
    width: 200,
  },
  wrapper: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },
  box: {
    height: 120,
    width: 120,
    color: '#f8f9ff',
    backgroundColor: '#b58df1',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
