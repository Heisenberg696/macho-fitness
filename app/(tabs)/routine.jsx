import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Modal,
  StyleSheet,
  Pressable,
  StatusBar,
  Share,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import { EmptyState, VideoCard } from '../../components';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useMemo, useState } from 'react';
// import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function BottomSheet({ isVisible, children, onClose }) {
  const url = 'https://www.google.com';

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey! I found this routine on Macho, check it out: ${url}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismissed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View className="bg-primary shadow-lg shadow-secondary-100" style={styles.modalContent}>
        <View className="bg-primary" style={styles.titleContainer}>
          <Text className="text-xl font-psemibold  text-secondary-100"></Text>
          <View className="text-xl font-psemibold w-12 rounded-xl h-2  bg-gray-300"></View>
          <Pressable onPress={onClose}>
            <Text>❌</Text>
          </Pressable>
        </View>
        <TouchableOpacity onPress={onShare} className="flex flex-row gap-3 px-4 my-4">
          <View>
            <Text className="text-xl">👉</Text>
          </View>
          <View>
            <Text className="text-xl font-pmedium text-secondary-100">Share routine</Text>
          </View>
        </TouchableOpacity>
        <View className="flex flex-row gap-3 px-4 my-4">
          <View>
            <Text className="text-xl">🖊</Text>
          </View>
          <View>
            <Text className="text-xl font-pmedium text-secondary-100">Edit routine </Text>
          </View>
        </View>
        <View className="flex flex-row gap-3 px-4 my-4">
          <View>
            <Text className="text-xl">🗑</Text>
          </View>
          <View>
            <Text className="text-xl font-pmedium text-secondary-100">Delete</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <SafeAreaView className="px-6 my-6 bg-primary h-full">
        {/* <GestureHandlerRootView>
          <View style={{ flex: 1 }}>
            <BottomSheet snapPoints={snapPoints}>
              <View className="bg-white p-4">
                <Text>This is awesome</Text>
              </View>
            </BottomSheet>
          </View>
        </GestureHandlerRootView> */}
        <View style={styles.container}>
          <BottomSheet isVisible={isModalVisible} onClose={onModalClose} />
          <StatusBar style="auto" />
        </View>

        <Text className="text-2xl text-white font-psemibold">My routines</Text>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <VideoCard
              openCommand={onAddSticker}
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

export default Bookmark;

const styles = StyleSheet.create({
  modalContent: {
    height: '35%',
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '16%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
