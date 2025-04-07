//import liraries
import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text, TextInput, Image, TouchableOpacity, Alert, Button,ScrollView
} from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
// create a component
const Onboardingscreen = () => {
  const navigation = useNavigation<any>();
  return (
    <Onboarding
    onDone={() => navigation.navigate("Signup")}
    pages={[
    {
    backgroundColor: 'black',
    image: <Image source={require('../images/logo.png')} style={{height:'60%',width:'100%',top:100}}/>,
    title: (
      <View style={{ bottom:50}}>
        <Text style={{ fontSize: 24, color: 'orange',fontWeight:'bold' }}>Welcome</Text>
      </View>
    ),
    subtitle: (
      <View style={{ bottom:50}}>
        <Text style={{ fontSize: 16, color: 'white',textAlign:'center' }}>
          Discover the power of our platform, where you can rent, buy, sell, and book assets seamlessly.
        </Text>
      </View>
    ),
    },
    {
      backgroundColor: 'black',
    image: <Image source={require('../images/buysell.png')} style={{height:'60%',width:'60%',top:100}}/>,
    title: (
      <View style={{ bottom:50}}>
        <Text style={{ fontSize: 24, color: '#05c6a1',fontWeight:'bold' }}>Buy & Sell</Text>
      </View>
    ),
    subtitle: (
      <View style={{ bottom:50}}>
        <Text style={{ fontSize: 16, color: 'white',textAlign:'center', }}>
        Explore a marketplace where you can buy and sell a wide variety of products and services.
        </Text>
      </View>
    ),
  },
  {
    backgroundColor: 'black',
    image: <Image source={require('../images/renting.png')} style={{height:'60%',width:'60%',top:100}}/>,
    title: (
      <View style={{ bottom:50}}>
        <Text style={{ fontSize: 24, color: 'red',fontWeight:'bold' }}>Renting Made Easy</Text>
      </View>
    ),
    subtitle: (
      <View style={{ bottom:50}}>
        <Text style={{ fontSize: 16, color: 'white',textAlign:'center', }}>
        Renting has never been easier. Explore a variety of rental options and secure your ideal space with confidence.
        </Text>
      </View>
    ),
  },
    ]}
/>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#white',
  },
  
});

//make this component available to the app
export default Onboardingscreen;
