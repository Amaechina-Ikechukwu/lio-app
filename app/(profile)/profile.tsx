import { View as Box, Text, Image } from "react-native";
import React from "react";
import DisplayProfile from "../../components/Profile/DisplayProfile";
import { CustomButton, CustomText, View } from "../../components/Themed";
import { useTheme } from "../../context/ThemeProvider";
import { useAlert } from "../../context/AlertProvider";
import Colors from "../../constants/Colors";
import { router } from "expo-router";
export function ErrorBoundary(props: any) {
  const { color } = useTheme();
  const { showAlert } = useAlert();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[color].background,
        gap: 20,
        width: "100%",
      }}
    >
      <Image
        source={require("../../assets/images/lio-error.png")}
        resizeMode="contain"
        style={{ width: 100, height: 100 }}
      />
      <CustomText>An error occurred</CustomText>
      <CustomButton
        onPress={() => {
          if (props.reload) {
            props.reload();
          } else {
            showAlert("Can't reload at the moment");
          }
        }}
        text="Reload"
        style={{
          width: "100%",
          borderColor: Colors[color].primary,
          borderWidth: 2,
        }}
      />
      <CustomButton
        inverse
        onPress={() => router.back()}
        text="Go back"
        style={{ width: "100%", backgroundColor: Colors[color].text }}
      />
    </View>
  );
}
export default function Profile() {
  return (
    <View>
      <DisplayProfile />
    </View>
  );
}
