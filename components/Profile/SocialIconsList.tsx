import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons"; // Make sure to import the appropriate icons
import Colors from "../../constants/Colors";
import { useTheme } from "../../context/ThemeProvider";

export default function SocialIconsList() {
  const { color } = useTheme();
  const data = [
    { icon: "github" },
    { icon: "twitter" },
    { icon: "facebook-square" },
    { icon: "instagram" },
    { icon: "linkedin-square" },
    { icon: "tiktok" },
    // Add more items here if needed
  ];

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={[
          styles.socialButton,
          {
            borderColor: Colors[color].textTint,
          },
        ]}
      >
        {item.icon === "tiktok" ? (
          <FontAwesome5
            name={item.icon}
            size={14}
            color={Colors[color].textTint}
          />
        ) : (
          <AntDesign
            name={item.icon}
            size={14}
            color={Colors[color].textTint}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        style={{ width: "auto" }}
        horizontal // Number of columns you want
        keyExtractor={(item) => item.icon}
        renderItem={renderItem}
        //   columnWrapperStyle={{ gap: 5 }}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  socialButton: {
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 10,
    width: 40,
    alignItems: "center",
    paddingHorizontal: 10, // Adjust spacing between items
  },
  flatListContainer: {
    gap: 10,
  },
});
