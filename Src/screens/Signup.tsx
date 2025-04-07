import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errmessage, setErrorMessage] = useState('');
  const navigation = useNavigation<any>();

  const handleSignup = async () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        auth().currentUser?.sendEmailVerification();
        Alert.alert("Please Verify your Email");
        auth().signOut();
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        setErrorMessage(error.message);
        console.error(error);
      });
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../images/logo.png")} />
      <View style={styles.inputView}>
      <Icon style={{ width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,}} name="user" size={20} color="black" />
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
      </View>
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
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputView}>
      <Icon style={{ width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,}} name="lock" size={20} color="black" />
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity onPress={handleSignup} style={styles.loginBtn}>
        <Text style={styles.loginText}>Signup</Text>
      </TouchableOpacity>
      <Text style={styles.errorMessage}>{errmessage}</Text>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.loginText, styles.loginLink]}>Login</Text>
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
  inputView: {
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 30,
    width: "100%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
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
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    bottom: 10,
  },
  image: {
    marginBottom: 40,
    height:150,
    width:200,
  },
  loginText: {
    fontSize: 18,
    color: 'white',
  },
  loginLink: {
    color: 'orange',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default Signup;
