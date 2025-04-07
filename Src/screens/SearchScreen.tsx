import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { category } = route.params;
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore().collection("Listings").where('Category', '==', category).get();
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategoryData(data);
        setLoading(false);
        if (data.length === 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.listItem}>
        <View style={{ flex: 0.3 }}>
          <Image
            source={{ uri: item.Images[0] }}
            style={{ height: 100 * (4 / 3), width: 50 * (4 / 3), margin: 5 }}
            resizeMode="cover"
          />
        </View>
        <View style={{ flex: 0.7, paddingHorizontal: 10, marginTop: 10 }}>
          <Text style={{ fontSize: 18, color: 'white' }}>
            Title: {item.Title}{'\n'}
            Price: {item.Price}{'\n'}
            Duration: {item.Duration}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#8e9eab', '#eef2f3']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>{category}</Text>
        {noData ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18 }}>No items found for this category.</Text>
          </View>
        ) : (
          <FlatList
            data={categoryData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {
                  setLoading(true);
                  fetchData();
                }}
              />
            }
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
    margin: 5
  },
  listItem: {
    padding: 16,
    borderWidth: 3,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingRight: 10,
    marginRight: 10
  }
});

export default SearchScreen;
