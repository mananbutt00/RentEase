import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errmessage, setErrorMessage] = useState('');
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        setErrorMessage(error.message);
        console.error(error);
        console.log(errmessage);
      });

    auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          navigation.navigate('BottomTab');
        } else {
          auth().signOut();
          Alert.alert('Please Verify your Email');
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>
        <StatusBar style="auto" />
      </Text>
      <Image style={styles.image} source={require("../images/logo.png")} />
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
      <Icon style={{ width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10, }} name="envelope" size={20} color="black" />
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
      </View>
      <View style={styles.inputView}>
      <Icon style={{ width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10, }} name="lock" size={20} color="black" />
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <Text style={{ color: 'red' }}>{errmessage}</Text>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText2}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={[styles.loginText, styles.loginLink]}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  inputView: {
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 30,
    width: "100%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "green",
  },
  loginContainer: {
    flexDirection: 'row',
    bottom: 10,
  },
  loginText: {
    fontSize: 18,
    color: 'black',
  },
  loginLink: {
    color: 'orange',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  image: {
    marginBottom: 40,
    height:150,
    width:200,
  },
  loginText2:{
    fontSize: 18,
    color: 'white',
  }
});

export default Login;
