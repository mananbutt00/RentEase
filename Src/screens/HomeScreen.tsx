import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItem';
import CarouselData from './CarouselData';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [mydata, setMyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('any');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // State to track search status

  const category = [
    {title: 'property', image: require('../images/propertyrent.png')},
    {title: 'Vehicles', image: require('../images/carrent.png')},
    {title: 'Equipment', image: require('../images/equipmentrent.png')},
    {title: 'Electronics', image: require('../images/electronicrent.png')},
    {title: 'Fashion & Beauty', image: require('../images/fashionrent.png')},
  ];

  const getDatabase = async () => {
    try {
      const listingSnapshot = await firestore().collection('Listings').get();
      const listingData = listingSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch reviews for each listing
      const reviewsSnapshot = await firestore().collection('Reviews').get();
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Associate reviews with listings based on itemid
      const listingsWithReviews = listingData.map(listing => {
        const reviewsForListing = reviewsData.filter(
          review => review.itemid === listing.Itemid,
        );
        return {...listing, Reviews: reviewsForListing};
      });

      console.log('Listings with reviews:', listingsWithReviews);
      setMyData(listingsWithReviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDatabase();
  }, []);

  const filterDataByCategory = categoryTitle => {
    if (categoryTitle === 'any') {
      return mydata;
    }
    const filteredData = mydata.filter(
      item => item.Category.toLowerCase() === categoryTitle.toLowerCase(),
    );
    return filteredData;
  };

  const handleSearch = () => {
    const result = mydata.filter(item =>
      item.Title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResult(result);
    setIsSearching(true); // Set searching status to true
  };

  const handleRefresh = () => {
    setSearchTerm(''); // Clear search term
    setSearchResult([]); // Clear search result
    setIsSearching(false); // Reset searching status to false
    setLoading(true); // Set loading to true to trigger reload
    getDatabase(); // Reload data from the database
  };
  const renderRatingStars = averageRating => {
    const totalStars = 5;
    const filledStars = Math.floor(averageRating);
    const emptyStars = totalStars - filledStars;
    let stars = '';

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      stars += '★';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆';
    }

    return stars;
  };

  const renderItem = ({item}) => {
    // Calculate average rating and total number of reviews
    const reviews = item.Reviews;
    let averageRating = 0;
    let totalReviews = 0;

    if (reviews && reviews.length > 0) {
      totalReviews = reviews.length;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = sum / totalReviews;
    }

    return (
      item.approve === true && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ItemScreen', {itemid: item.Itemid});
          }}>
          <View style={styles.listItem}>
            <View style={{flex: 0.8}}>
              <Image
                source={{uri: item.Images[0]}}
                style={{height: 100 * (4 / 3), width: 50 * (4 / 3), margin: 5}}
                resizeMode="cover"
              />
            </View>
            <View style={{flex: 0.2, paddingHorizontal: 10, marginTop: 10}}>
              <Text style={{fontSize: 18}}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {item.Title}
                </Text>
                <Text style={{color: 'green'}}>
                  {'\n'}
                  Rs {item.Price}
                </Text>
                <Text style={{color: 'white'}}>
                  {'\n'}
                  {item.Duration}
                </Text>

                {reviews && reviews.length > 0 && (
                  <Text style={{color: 'orange'}}>
                    {'\n'}
                    {renderRatingStars(averageRating)} ({totalReviews} reviews)
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )
    );
  };

  const renderCategory = ({item}) => (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 5,
        right: 10,
      }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('SearchScreen', {category: item.title})
        }>
        <Image source={item.image} style={{height: 40, width: 40}} />
        <Text style={{color: 'black', fontSize: 12, fontWeight: 'bold'}}>
          {item.title}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#8e9eab', '#eef2f3']} style={{flex: 1}}>
      <View style={styles.container}>
        <View
          style={{
            flex: 0.3,
            borderBottomStartRadius: 20,
            borderBottomEndRadius: 20,
            backgroundColor: 'black',
            marginHorizontal: -10,
            bottom: 10,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Image
              source={require('../images/logo.png')}
              style={{height: 70, width: 100}}
            />
            <Icon
              style={{top: 40, right: 10}}
              name="bell"
              size={20}
              color="white"
            />
          </View>
          <View
            style={{flexDirection: 'row', justifyContent: 'center', top: 10}}>
            <Icon
              style={{left: 40, margin: 5}}
              name="search"
              size={25}
              color="white"
            />
            <TextInput
              style={{
                borderWidth: 3,
                borderRadius: 16,
                height: 40,
                textAlign: 'center',
                paddingHorizontal: 80,
                marginRight: 40,
                borderColor: 'white',
                color: 'white', // Text color
                fontFamily: 'Sedan-Regular',
              }}
              placeholderTextColor="white"
              placeholder="Please Enter to Search"
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
              onBlur={handleSearch} // Trigger search on blur
            />
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 20,
            paddingBottom: 40,
          }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh} // Call handleRefresh on pull-to-refresh
            />
          }>
          {isSearching && searchResult.length > 0 ? ( // Render search result if available
            <FlatList
              data={searchResult}
              renderItem={renderItem}
              horizontal
              keyExtractor={item => item.id}
            />
          ) : (
            <View>
              <View style={{right: 80}}>
                <Carousel
                  layout="tinder"
                  layoutCardOffset={9}
                  data={CarouselData}
                  renderItem={CarouselCardItem}
                  sliderWidth={SLIDER_WIDTH}
                  itemWidth={ITEM_WIDTH}
                  inactiveSlideShift={0}
                  useScrollView={true}
                />
              </View>
              <View style={{flex: 0.4}}>
                <Text
                  style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
                  Browse Categories
                </Text>
                <FlatList
                  data={category}
                  renderItem={renderCategory}
                  horizontal
                  keyExtractor={item => item.title}
                />
              </View>
              {category.map((categoryItem, index) => (
                <View style={{}} key={index}>
                  <Text
                    style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
                    {categoryItem.title}
                  </Text>
                  <FlatList
                    data={filterDataByCategory(categoryItem.title)}
                    renderItem={renderItem}
                    horizontal
                    keyExtractor={item => item.id}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
  },
  listItem: {
    // padding: 16,
    // borderWidth: 3,
    // marginBottom: 10,
    // borderRadius: 10,
    // flexDirection: 'row',
    // backgroundColor: 'black',
    // paddingRight: 10,
    // marginRight: 10,
    height: 150,
    width: 300,
    borderRadius: 15,
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    right: 10,
  },
});

export default HomeScreen;
