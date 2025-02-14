import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screen imports
import HomeScreen from './src/screens/HomeScreen';
import YoloPayScreen from './src/screens/YoloPayScreen';
import GinnieScreen from './src/screens/GinnieScreen';

// Param list for routes
export type RootTabParamList = {
  Home: undefined;
  'Yolo Pay': undefined;
  Ginnie: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {backgroundColor: '#000'},
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({color, size}) => {
            let iconName = 'home';
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Yolo Pay') {
              iconName = 'card';
            } else if (route.name === 'Ginnie') {
              iconName = 'person';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Yolo Pay" component={YoloPayScreen} />
        <Tab.Screen name="Ginnie" component={GinnieScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
