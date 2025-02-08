import { View as Box, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { CustomButton, CustomText, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { useTheme } from "../../context/ThemeProvider";
import { useAuth } from "../auth";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useAlert } from "../../context/AlertProvider";
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
export default function Settings() {
  const { color, isDarkMode } = useTheme();

  const { userinformation, signOut, signIn } = useAuth();
  if (!userinformation) {
    return (
      <View>
        <CustomText variant="semibold">Sign In please</CustomText>
        <Link href={"/(auth)/sign-in"} asChild>
          <CustomButton
            inverse
            onPress={() => router.push("/(auth)/sign-in")}
            style={{
              backgroundColor: Colors[color].text,
              width: "80%",
            }}
            text="Sign In"
          />
        </Link>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <Box style={{ height: "100%", width: "100%" }}>
        <Box
          style={{
            backgroundColor: isDarkMode ? "#262626" : "#e2e8f0",
            width: "100%",
            padding: 10,
            borderRadius: 10,
            height: 90,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(profile)/profile")}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Image
              source={{ uri: userinformation.photoURL }}
              resizeMode="contain"
              style={{ width: 40, height: 40, borderRadius: 100 }}
            />
            <CustomText variant="semibold">
              {userinformation.displayName}
            </CustomText>
          </TouchableOpacity>
        </Box>
      </Box>

      <Box style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <CustomButton
          onPress={() => signOut()}
          text="Logout"
          style={{
            borderColor: Colors[color].error,
            borderWidth: 1,
            width: "100%",
            color: Colors[color].error,
          }}
        />
      </Box>
    </View>
  );
}
