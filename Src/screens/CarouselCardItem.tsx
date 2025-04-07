import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

export const SLIDER_WIDTH = Dimensions.get('window').width + 150;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const CarouselCardItem = ({ item, index }) => {
  return (
    <View  style={styles.container}key={index}>
      <Image
        source={item.image}
        style={styles.image}
      />
     
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
       
        borderRadius: 8,
        width: ITEM_WIDTH,
        paddingBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 10,
      },
  image: {
    width: ITEM_WIDTH,
    height: 120
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 20
  },

});

export default CarouselCardItem;
