import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from './src/utils/CustomBottomTab';

// Screen imports
import HomeScreen from './src/screens/HomeScreen';
import YoloPayScreen from './src/screens/YoloPayScreen';
import GinnieScreen from './src/screens/GinnieScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'home'}}
        />
        <Tab.Screen
          name="YoloPay"
          component={YoloPayScreen}
          options={{title: 'yolo pay'}}
        />
        <Tab.Screen
          name="Ginnie"
          component={GinnieScreen}
          options={{title: 'ginnie'}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default App;
