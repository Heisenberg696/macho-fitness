import { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Dimensions, Alert, Image } from 'react-native';

import { images } from '../../constants';
import { CustomButton, FormField } from '../../components';
import { getCurrentUser, signIn, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import Toast from 'react-native-toast-message';
import { TouchableOpacity } from 'react-native-gesture-handler';

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace('/sign-in');
  };

  const submit = async () => {
    if (form.email === '' || form.password === '') {
      // Alert.alert('Error', 'Please fill in all fields');
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields',
      });
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Toast.show({
        type: 'success',
        text1: 'User signed in successful',
      });
      router.replace('/home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Invalid credentials`,
      });
      console.log(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get('window').height - 100,
          }}
        >
          <View className="flex flex-row items-center gap-3">
            <Text className="text-3xl text-white font-pbold ">Macho</Text>
            <Image source={images.dumbell} resizeMode="contain" className="w-[35px] h-[34px]" />
          </View>
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">Log in to Macho</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton title="Sign In" handlePress={submit} containerStyles="mt-7" isLoading={isSubmitting} />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
              Signup
            </Link>
            {/* <CustomButton title="Sign out" handlePress={logout} /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
