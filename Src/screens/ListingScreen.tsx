import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import UUIDGenerator from 'react-native-uuid-generator';
const ListingScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Any');
  const [duration, setDuration] = useState('Daily');
  const [uuid, setUuid] = useState('');
  //new
  const [approve,setApprove]=useState(false);
  const user = auth().currentUser;
  const userId = user.uid;

  const Upload = () => {
    let options = {
      storageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, async (response) => {
      if (response.assets) {
        setSelectedImages((prevImages) => [...prevImages, ...response.assets.map((asset) => asset.uri)]);
      }
    });
  };
  useEffect(() => {
    UUIDGenerator.getRandomUUID((uuid) => {
      setUuid(uuid);
    });
  }, []);
  const handleAddItem = () => {
    const listingRef = firestore().collection('Listings').add({
      UserId: userId,
      Title: title,
      Description: description,
      Price: price,
      Images: selectedImages,
      Category: category,
      Duration: duration,
      Itemid: uuid,
      //new
      approve:approve,
    });

    console.log('Listing added with ID: ', listingRef.id);
    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Upload Photos</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={Upload}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>

        <FlatList
          data={selectedImages}
          renderItem={({ item }) => (
            <Image key={item} style={styles.uploadedImage} source={{ uri: item }} />
          )}
          horizontal
        />

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Category</Text>
        <Picker style={styles.input} selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>

          <Picker.Item label="Vehicles" value="Vehicles" />
          <Picker.Item label="Property" value="Property" />
          <Picker.Item label="Electronics" value="Electronics" />
          <Picker.Item label="Fashion & Beauty" value="Fashion & Beauty" />

          <Picker.Item label="Services" value="Services" />
          <Picker.Item label="Equipment" value="Equipment" />
          <Picker.Item label="others" value="others" />
        </Picker>
        <Text>Duration</Text>
        <Picker style={styles.input} selectedValue={duration} onValueChange={(itemValue) => setDuration(itemValue)}>
          <Picker.Item label="Daily" value="Daily" />
          <Picker.Item label="Hourly" value="Hourly" />
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
        </Picker>

        <TouchableOpacity style={styles.addButton} onLongPress={handleAddItem} >
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  uploadedImage: {
    height: 100,
    width: 100,
    margin: 5,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
});

export default ListingScreen;
