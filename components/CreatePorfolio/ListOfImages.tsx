import React from "react";
import { View, FlatList, Image, StyleSheet } from "react-native";

interface ImageListProps {
  images: string[]; // Array of image URIs
}

const ListOfImages: React.FC<ImageListProps> = ({ images }) => {
  const renderItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item} // Assuming URIs are unique
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
    resizeMode: "cover",
  },
});

export default ListOfImages;
