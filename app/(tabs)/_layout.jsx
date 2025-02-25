import { StatusBar } from 'expo-status-bar';
import { Redirect, Tabs } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { icons } from '../../constants';
import { Loader } from '../../components';
import { useGlobalContext } from '../../context/GlobalProvider';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image source={icon} resizeMode="contain" tintColor={color} className="w-5 h-5" />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home/index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="routine"
          options={{
            title: 'Routine',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.bookmark} color={color} name="Routine" focused={focused} />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="step-counter"
          options={{
            title: 'Step Counter',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.tracker} color={color} name="Tracker" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            href: null,
            title: 'Notifications',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.notification} color={color} name="Reminders" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="details"
          options={{
            href: null,
            title: 'Details',
            headerShown: false,
          }}
        />
      </Tabs>

      <Loader isLoading={loading} />
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
