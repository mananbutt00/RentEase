import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';

const UserDataForm = ({ conversationId }) => { // Accepting conversationId as prop
  const navigation = useNavigation<any>();
  const [selectedImage, setSelectedImage] = useState();
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [about, setAbout] = useState('');
  const [address, setAddress] = useState('');
  const user = auth().currentUser;
  const userId = user.uid;

  const handleSubmit = () => {
    firestore()
      .collection('UserProfile')
      .doc(userId)
      .set({
        UserName: username,
        MobileNumber: mobileNumber,
        About: about,
        Address: address,
        ProfilePicture: selectedImage,
        // ConversationId: conversationId, // Include conversationId in the document
      })
      .then(() => {
        console.log('User profile added!');
      })
      .catch((error) => {
        console.error('Error adding user profile: ', error);
      });

    navigation.goBack();
    console.log('Username:', username);
    console.log('Mobile Number:', mobileNumber);
    console.log('About:', about);
    Alert.alert("User Profile Created Successfully!!");
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        console.log('sss',imageUri);
        setSelectedImage(imageUri);
      }
    });
  };
  return (
    <View style={styles.container}>
     

     
      <TouchableOpacity style={styles.profilePictureContainer} onPress={openImagePicker}>
     
        {/* <Icon name="user" size={80} color="black" /> */}
        <Image
            source={{ uri: selectedImage }}
            style={{ width: 140,
              height: 140,
              borderRadius: 60,
              backgroundColor: '#EAC43D',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,}}
           
          />
      </TouchableOpacity>

     
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />

    
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={mobileNumber}
        onChangeText={(text) => setMobileNumber(text)}
      />
 <TextInput
        style={styles.input}
        placeholder="Address"
        multiline
        numberOfLines={4}
        value={address}
        onChangeText={(text) => setAddress(text)}
      />
  
      <TextInput
        style={styles.input}
        placeholder="About"
        multiline
        numberOfLines={4}
        value={about}
        onChangeText={(text) => setAbout(text)}
      />


  
      <TouchableOpacity style={styles.button} onPress={handleSubmit} >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserDataForm;
