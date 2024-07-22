import { StyleSheet, Text, View, Modal, Pressable, Share, TouchableOpacity, Image } from 'react-native';
import { icons } from '../constants';

export function BottomSheet({ isVisible, onClose }) {
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
        <View className="bg-slate-800" style={styles.titleContainer}>
          <Text className="text-xl font-psemibold  text-secondary-100"></Text>

          <Pressable onPress={onClose}>
            <Image source={icons.close} className="w-6 h-6" resizeMode="contain" />
          </Pressable>
        </View>
        <View className="bg-slate-800 rounded-lg p-2">
          <TouchableOpacity onPress={onShare} className="flex items-center flex-row gap-3 px-4 my-4">
            <View>
              <Image source={icons.share} className="w-6 h-6" resizeMode="contain" />
            </View>
            <View>
              <Text className="text-lg font-pmedium text-white">Share routine</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex items-center flex-row gap-3 px-4 my-4">
            <View>
              <Image source={icons.edit} className="w-6 h-6" resizeMode="contain" />
            </View>
            <View>
              <Text className="text-lg font-pmedium text-white">Edit routine </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex flex-row items-center gap-3 px-4 my-4">
            <View>
              <Image source={icons.trash} className="w-6 h-6" resizeMode="contain" />
            </View>
            <View>
              <Text className="text-lg font-pmedium text-white">Delete</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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
