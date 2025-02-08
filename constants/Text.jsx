// import React from "react";
// import { Text, StyleSheet } from "react-native";
// import {
//   useFonts,
//   OpenSans_300Light,
//   OpenSans_400Regular,
//   OpenSans_600SemiBold,
// } from "@expo-google-fonts/open-sans";

// const CustomText = ({ children, style, variant }) => {
//   const [fontsLoaded] = useFonts({
//     light: OpenSans_300Light,
//     regular: OpenSans_400Regular,
//     semibold: OpenSans_600SemiBold,
//   });

//   if (!fontsLoaded) {
//     return null; // You might want to render a loading indicator or fallback text here
//   }

//   const textStyle = [
//     styles.text,
//     styles[variant], // Apply the selected variant's style
//     style,
//   ];

//   return <Text style={textStyle}>{children}</Text>;
// };

// const styles = StyleSheet.create({
//   text: {
//     fontFamily: "regular", // Default to regular variant
//   },
//   light: {
//     fontFamily: "light",
//   },
//   regular: {
//     fontFamily: "regular",
//   },
//   semibold: {
//     fontFamily: "semibold",
//   },
// });

// export default CustomText;
