import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase authentication module
import Icon from 'react-native-vector-icons/FontAwesome';
const Tab = createMaterialTopTabNavigator();

const ItemDetails = ({itemData}) => {
  if (!itemData) {
    return <Text>Loading...</Text>; // or any loading indicator you prefer
  }
  const handleChatPress = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('Listings')
        .where('Itemid', '==', itemid)
        .get();
      const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

      if (data.length > 0) {
        data.forEach(item => {
          if (item && item.UserId) {
            navigation.navigate('MyChat', {user: {id: item.UserId}});
          } else {
            console.warn('User ID not found for the item:', item.id);
          }
        });
      } else {
        console.warn('No items found for the provided item ID.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1, margin: 5}}>
      <ScrollView style={{backgroundColor: 'white'}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            fontFamily: 'Caveat-VariableFont_wght',
          }}>
          Description
        </Text>
        <Text style={styles.description}>{itemData.Description}</Text>
      </ScrollView>

      <View style={{backgroundColor: 'white', marginTop: 100}}>
        <TouchableOpacity style={styles.chatbutton} onPress={handleChatPress}>
          <Icon name="comment" size={18} color={'white'} />
          <Text style={styles.chatbuttonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ItemScreen = ({route}) => {
  const {itemid} = route.params;
  const [itemData, setItemData] = useState([]);
  const navigation = useNavigation();
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [starRating, setStarRating] = useState(0);
  const [currentUserEmail, setCurrentUserEmail] = useState(''); // State to store current user's email
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState(null); // State to hold user data
  const user = auth().currentUser;
  const userId = user.uid;
  useEffect(() => {
    // Fetch current user's email when component mounts
    const currentUser = auth().currentUser;
    if (currentUser) {
      setCurrentUserEmail(currentUser.email);
    }
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('Listings')
          .where('Itemid', '==', itemid)
          .get();
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItemData(data[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchdata();
  }, [itemid]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('Reviews')
          .where('itemid', '==', itemid)
          .get();
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const reviewsWithUser = await Promise.all(
          data.map(async review => {
            const userData = await firestore()
              .collection('Users')
              .doc(review.userId)
              .get();
            const user = userData.data();
            return {...review, user};
          }),
        );

        setReviews(reviewsWithUser);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [itemid]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore()
          .collection('UserProfile')
          .doc(userId)
          .get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserData(userData); // Set user data to state
          console.log(userData);
        } else {
          console.warn('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleReviewSubmit = async () => {
    if (reviewText.trim() !== '') {
      try {
        await firestore().collection('Reviews').add({
          itemid: itemid,
          text: reviewText,
          rating: starRating, // Include star rating in the review data
          userId: userId, // Include user ID
          createdAt: firestore.FieldValue.serverTimestamp(),
          useremail: currentUserEmail,
          username: userData.UserName,
          image: userData.ProfilePicture,
        });
        setReviewText('');
        setStarRating(0); // Reset star rating after submission
        setIsModalVisible(false); // Hide the modal after submission
        // Refresh reviews after submission
        fetchReviews();
      } catch (error) {
        console.error('Error adding review:', error);
      }
    }
  };

  const translateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -300],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={
          itemData && itemData.Images && itemData.Images[0]
            ? {uri: itemData.Images[0]}
            : null
        }
        style={[styles.image, {transform: [{translateY}]}]}
        resizeMode="cover"
      />
      <Animated.View style={[styles.tabContainer, {transform: [{translateY}]}]}>
        <Text
          style={{
            color: 'black',
            fontSize: 35,
            fontWeight: 'bold',
            marginLeft: 5,
          }}>
          {itemData.Title}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 5,
          }}>
          {' '}
          {itemData.Price + ' ' + 'Rs'}
        </Text>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: 'black'},
          }}>
          <Tab.Screen name="Details">
            {() => (
              <ScrollView style={styles.scrollView}>
                <ItemDetails itemData={itemData} />
              </ScrollView>
            )}
          </Tab.Screen>
          <Tab.Screen name="Reviews">
            {() => (
              <ScrollView style={styles.scrollView}>
                <View style={styles.reviewsContainer}>
                  {reviews.map((review, index) => (
                    <View key={index} style={styles.reviewContainer}>
                      <View style={styles.userInfo}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                          }}>
                          <Image
                            source={{uri: review.image}}
                            style={styles.avatar}
                          />
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'flex-start',
                            }}>
                            <Text style={styles.userName}>
                              {' '}
                              {review.username}
                            </Text>
                            <View style={styles.starRatingContainer}>
                              {[...Array(review.rating)].map((_, i) => (
                                <Icon
                                  key={i}
                                  name={i < starRating ? 'star' : 'star'}
                                  size={20}
                                  color={i < starRating ? 'orange' : 'orange'}
                                />
                              ))}
                            </View>
                          </View>
                        </View>
                        <Text
                          style={{color: 'white', fontSize: 20, marginTop: 10}}>
                          {review.text}
                        </Text>
                      </View>

                      {/* Display star rating */}
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.reviewbtn}
                  onPress={() => setIsModalVisible(true)}>
                  <Text style={{color: 'white', fontSize: 18}}>
                    write a review
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </Animated.View>

      {/* Review modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 20,
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Sedan-Regular',
                fontSize: 20,
                color: 'black',
              }}>
              What is your Rate?
            </Text>
            <View style={styles.starRatingContainer}>
              {[...Array(5)].map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setStarRating(i + 1)}>
                  <Icon
                    name={i < starRating ? 'star' : 'star-o'}
                    size={30}
                    color={i < starRating ? 'orange' : 'black'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Sedan-Regular',
                fontSize: 20,
                color: 'black',
              }}>
              Please share your opinion about product!
            </Text>
            <View
              style={{alignItems: 'flex-start', justifyContent: 'flex-start'}}>
              <TextInput
                style={styles.modalInput}
                placeholder="Write a review"
                value={reviewText}
                onChangeText={setReviewText}
                multiline={true}
              />
            </View>
            <Button title="Submit Review" onPress={handleReviewSubmit} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
    color: 'white',
  },
  reviewbtn: {
    borderWidth: 2,
    height: 50,
    width: 300,
    backgroundColor: 'green',
    borderRadius: 20,
    margin: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    height: 300,
    width: '100%',
    marginBottom: 10,
  },
  tabContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
  },
  description: {
    fontSize: 20,
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
  },
  button: {
    borderWidth: 5,
    height: 30,
    width: 150,
    backgroundColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  reviewContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'black',
  },
  reviewsContainer: {
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  starRatingContainer: {
    flexDirection: 'row',
  },
  star: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginRight: 5,
  },
  userInfo: {
    marginBottom: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  userName: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 30,
  },
  userEmail: {
    color: '#888',
  },
  modalContainer: {
    height: '70%', // Set height to half the screen height

    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    marginTop: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,

    marginBottom: 10,
    width: 350,
    height: 150,
    backgroundColor: 'white',
  },
  chatbutton: {
    borderWidth: 5,
    height: 50,
    width: 300,
    backgroundColor: 'black',
    borderRadius: 20,
    margin: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chatbuttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ItemScreen;
