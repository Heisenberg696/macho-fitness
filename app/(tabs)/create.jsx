import { useState } from 'react';
import { router } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';

import { icons } from '../../constants';
import { createVideoPost } from '../../lib/appwrite';
import { CustomButton, FormField } from '../../components';
import { useGlobalContext } from '../../context/GlobalProvider';
import Toast from 'react-native-toast-message';

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    video: null,
    thumbnail: null,
    prompt: '',
  });

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ['image/png', 'image/jpg'] : ['video/mp4', 'video/gif'],
    });

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === 'video') {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Toast.show({
          type: 'info',
          text1: `No ${selectType} selected`,
        });
        // Alert.alert('Document picked', JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if ((form.prompt === '') | (form.title === '') | !form.thumbnail | !form.video) {
      return Toast.show({ type: 'error', text1: 'Please fill all fields' });
    }

    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      // Alert.alert('Success', 'Post uploaded successfully');
      Toast.show({ type: 'success', text1: `Routine added successfully ` });

      router.push('/routine');
    } catch (error) {
      // Alert.alert('Error', error.message);
      Toast.show({ type: 'error', text1: `Error ${error.message}` });
    } finally {
      setForm({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Add new routine</Text>

        <FormField
          title="Routine title"
          value={form.title}
          placeholder="ex: Working on my 6 packs"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video <Text className="text-base text-secondary-100 font-psemibold">*50mb max*</Text>
          </Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center ">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center ">
                  <Image source={icons.upload} resizeMode="contain" alt="upload" className="w-1/2 h-1/2" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Thumbnail (Optional)</Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image source={{ uri: form.thumbnail.uri }} resizeMode="cover" className="w-full h-64 rounded-2xl" />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image source={icons.upload} resizeMode="contain" alt="upload" className="w-5 h-5" />
                <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="Description"
          value={form.prompt}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
          inputHeight={'h-32'}
        />
        {/* <FormField
          title="Remind me ⏰"
          value={form.prompt}
          placeholder="Set a time reminder..."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        /> */}

        <CustomButton title="Add routine" handlePress={submit} containerStyles="mt-7" isLoading={uploading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
