import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; 

const MyChat = ({ route }) => {
  const { user } = route.params;
  console.log('Item Id', user.id);
  console.log('item title', user.title);
  console.log('item user id', user.item_userid);
  const item_userid = user.item_userid;
  const [messages, setMessages] = useState([]);
  const [userID, setUserID] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [userData, setUserData] = useState(null); // State to hold user data
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        const currentUserID = user.uid;
        console.log('Current User Id ',currentUserID)
        setUserID(currentUserID);
        setCurrentUser(user);
      } else {
        navigation.navigate('Login');
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('UserProfile').doc(item_userid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserData(userData); // Set user data to state
          console.log('User data found:', userData);
        } else {
          console.warn('User data not found for ID:', item_userid);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [item_userid]);
  
  useEffect(() => {
    const querySnapShot = firestore()
      .collection("Chats")
      .doc(user.id) 
      .collection("messages")
      .orderBy("createdAt", "desc");
    
    const unsubscribeMessages = querySnapShot.onSnapshot(snapShot => {
      const allMessages = snapShot.docs.map(snap => {
        return { ...snap.data(), createdAt: new Date() }
      });
      setMessages(allMessages);
    });

    return () => {
      unsubscribeMessages();
    };
  }, [user]);

  const onSend = messageArray => {
    const message = messageArray[0];
    const currentUserID = auth().currentUser.uid;
    const myMsg = { ...message, senderId: currentUserID, receiverId: user.id };
    
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));

    firestore()
      .collection("Chats")
      .doc(user.id) 
      .collection("messages")
      .add({
        ...myMsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
      {userData && (
  <View style={styles.userInfo}>
    <Image source={{ uri: userData.ProfilePicture }} style={styles.avatar} />
    <Text style={styles.username}>{userData.UserName}</Text>
    {/* Assuming you have a profile image and status for the user */}
  </View>
)}

      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
        }}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: 'lightblue',
                marginRight: 0,
              },
              right: {
                backgroundColor: 'orange',
              },
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    color:'black'
  },
  textContainer: {
    flexDirection: 'column',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    color:'black'
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'black'
  },
  status: {
    fontSize: 14,
    color: 'black',
  },
});

export default MyChat;
