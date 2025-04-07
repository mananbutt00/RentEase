import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import auth from '@react-native-firebase/auth'; // Import Firebase Authentication module

const ChatScreen = () => {
  const navigation = useNavigation();
  const [currentUserID, setCurrentUserID] = useState(null); // State variable to hold the current user's ID
  const [currentUserData, setCurrentUserData] = useState(null); // State variable to hold the current user's data
  const [peopleInChat, setPeopleInChat] = useState([]); // State variable to hold the list of people in chat

  useEffect(() => {
    // Function to fetch the currently logged-in user's ID from Firebase Authentication
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in, retrieve the user ID
        setCurrentUserID(user.uid);
      }
    });

    return () => {
      unsubscribeAuth(); // Unsubscribe from auth state changes when component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        if (currentUserID) { // Check if userID is available
          const userDoc = await firestore().collection('UserProfile').doc(currentUserID).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setCurrentUserData(userData); // Set current user data to state
          } else {
            console.warn('User data not found');
          }
        }
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    fetchCurrentUserData();
  }, [currentUserID]); // Fetch data only when currentUserID changes

  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        if (currentUserID) { // Check if userID is available
          const peopleSnapshot = await firestore().collection('UserProfile').get();
          const peopleData = peopleSnapshot.docs.map(doc => ({
            id: doc.id,
            UserName: doc.data().UserName, // Using correct case for the field name
            ProfilePicture: doc.data().ProfilePicture, // Using correct case for the field name
            status: 'Online', // You can set status based on your logic
          }));
          setPeopleInChat(peopleData);
        }
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    };

    fetchPeopleData();
  }, [currentUserID]); // Fetch data only when currentUserID changes

  const handlePersonPress = (profile) => {
    navigation.navigate('MyChat', { user: profile });
  };

  const renderProfile = ({ item }) => (
    <TouchableOpacity onPress={() => handlePersonPress(item)}>
      <View style={styles.personContainer}>
        <Image source={{ uri: item.ProfilePicture }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.personName}>{item.UserName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Display user details in the header */}
      <View style={styles.header}>
        {currentUserData && (
          <View style={styles.userInfo}>
            <Image source={{ uri: currentUserData.ProfilePicture }} style={styles.avatar} />
            <Text style={styles.username}>{currentUserData.UserName}</Text>
            {/* Assuming you have a profile image and status for the user */}
          </View>
        )}
      </View>
      
      <FlatList
        data={peopleInChat}
        renderItem={renderProfile}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: 'black',
  },
});

export default ChatScreen;
