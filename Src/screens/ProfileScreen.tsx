import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileScreen = () => {
  const [myData, setMyData] = useState([]);
  const [profileData, setProfileData] = useState();
  const user = auth().currentUser;
  const userId = user.uid;
  const navigation = useNavigation<any>();

  const signout = () => {
    auth().signOut().then(() => console.log('User signed out!'));
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('Listings')
      .where('UserId', '==', userId)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyData(data);

        // Fetch user profile data
        firestore()
          .collection('UserProfile')
          .doc(userId)
          .get()
          .then(snapshot => {
            const profileDataFromFirestore = snapshot.data();
            setProfileData(profileDataFromFirestore);
          })
          .catch(error => {
            console.error('Error fetching profile data: ', error);
          });
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [userId]);

  const renderItem = ({ item }) => {
    return (
      item.approve === false ? (
      
        <View style={styles.listItemblur}>
          
          <FlatList
            data={item.Images}
            horizontal
            renderItem={({ item: image }) => (
              <Image source={{ uri: image }} style={{ height: 120, width: 80, margin: 5, backgroundColor: 'green' }} />
            )}
            keyExtractor={(image, index) => index.toString()}
          />
          <View style={{  width:'50%'  }}>
            <Text style={{ fontSize: 16, color: 'white' }}>
              Title: {item.Title}{'\n'}
              Duration: {item.Duration}{'\n'}
              Price: {item.Price}{'\n'}
              <Text >Waiting for Approval</Text>
            </Text>
           
          </View>
                </View>
       
      ) : (
        <View style={styles.listItem}>
          <FlatList
            data={item.Images}
            horizontal
            renderItem={({ item: image }) => (
              <Image source={{ uri: image }} style={{ height: 120, width: 80, margin: 5, backgroundColor: '#EAC43D' }} />
            )}
            keyExtractor={(image, index) => index.toString()}
          />
          <View style={{ width:'50%' }}>
            <Text style={{ fontSize: 16, color: 'white' }}>
              Title: {item.Title}{'\n'}
              Duration: {item.Duration}{'\n'}
              Price: {item.Price}{'\n'}
              <Text style={{color:'green'}}>Approved</Text>
            </Text>
           
          </View>
        </View>
      )
    );
  };
  

  return (
    <LinearGradient colors={['#8e9eab', '#eef2f3']} style={{ flex: 1 }}>
      <View style={{ flex: 1, margin: 10 }}>
        <View style={{ flex: 0.35, alignItems: 'center', borderBottomStartRadius: 20, borderBottomEndRadius: 20, }}>
          <Image style={styles.profilePictureContainer} source={{ uri: profileData?.ProfilePicture || 'fallback_image_url' }} />
          <Text style={{ color: 'black', fontSize: 16 }}>{user.email}</Text>
          <TouchableOpacity style={{ borderRadius: 10, borderWidth: 2, height: 25, width: 150, backgroundColor: 'black', top: 5 }} onPress={() => navigation.navigate("UserProfile")}>
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 18,fontFamily:'Caveat-VariableFont_wght' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.65, marginVertical: 10 }}>
          <FlatList data={myData} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
        </View>

        <Button onPress={signout} title="LogOut" color="black" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 16,
    borderWidth: 3,
    marginBottom: 10,
    borderRadius: 10,
  
  
    backgroundColor: 'black',
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
 
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemblur:
  {
    padding: 16,
    borderWidth: 3,
    marginBottom: 10,
    borderRadius: 10,
   
    backgroundColor: 'grey',
    width:'100%',
    flexDirection:'row',justifyContent:'space-between',
  }
});

export default ProfileScreen;
