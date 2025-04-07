import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import Onboardingscreen from './Src/screens/Onboardingscreen';
import Signup from './Src/screens/Signup';
import HomeScreen from './Src/screens/HomeScreen';
import Login from './Src/screens/Login';
import BottomTab from './Src/screens/BottomTab';
import ProfileScreen from './Src/screens/ProfileScreen';
import Data from './Src/screens/Data';
import SearchScreen from './Src/screens/SearchScreen';
import Auth from '@react-native-firebase/auth';
import ItemScreen from './Src/screens/ItemScreen';
import MyChat from './Src/screens/MyChat';
import Verifyemail from './Src/screens/Verifyemail';
const Stack = createStackNavigator();

const App = () => {
  const [isUserLogin, setIsUserLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = Auth().onAuthStateChanged(user => {
      setIsUserLogin(user !== null);
    });
    getDeviceToken();
    return unsubscribe;
  }, []);
  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    console.log('tokennnnnnnnnnn', token);
  };
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        'New Notification',
        remoteMessage.notification.body,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboardingscreen">
        {!isUserLogin && (
          <>
            <Stack.Screen
              name="Onboardingscreen"
              component={Onboardingscreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{headerShown: false}}
            />
          </>
        )}

        {isUserLogin && (
          <>
            <Stack.Screen
              name="BottomTab"
              component={BottomTab}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="UserProfile"
              component={Data}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="SearchScreen"
              component={SearchScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ItemScreen"
              component={ItemScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MyChat"
              component={MyChat}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
