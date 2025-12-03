import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AquariumListScreen from '../screens/AquariumListScreen';

export type RootStackParamList = {
  Home: undefined;
  AquariumList: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'AquaCircle' }}
        />
        <Stack.Screen 
          name="AquariumList" 
          component={AquariumListScreen}
          options={{ title: '魚缸列表' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

