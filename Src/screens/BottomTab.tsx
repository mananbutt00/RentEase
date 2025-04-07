//import liraries
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet,Image } from 'react-native';
const Tab = createBottomTabNavigator();
import FavouriteScreen from './FavouriteScreen';
import ListingScreen from './ListingScreen';

// create a component
const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{
        tabBarLabelStyle: {
          color: 'black',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="home" size={25} color={focused ? 'black' : color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="comment" size={25} color={focused ? 'black' : color} />
          ),
        }}
      />

      <Tab.Screen
        name=" "
        component={ListingScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={require('../images/plus.png')}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="heart" size={25} color={focused ? 'black' : color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name="user" size={25} color={focused ? 'black' : color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
