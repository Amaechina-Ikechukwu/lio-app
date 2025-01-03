import { Image, TouchableOpacity, View as Box } from "react-native";
import React from "react";
import { useThemeColor, View } from "../../components/Themed";
import { useAuth } from "../auth";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeProvider";
import Colors from "../../constants/Colors";
import { router } from "expo-router";

export default function Header() {
  const backgroundColor = useThemeColor(
    { light: "rgba(255,255,255,0.8)", dark: "rgba(0,0,0,0.9)" },
    "background"
  );
  const { color, isDarkMode } = useTheme();
  const { userinformation } = useAuth();
  return (
    <Box
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        position: "relative",
        top: 0,
        alignItems: "center",
        paddingVertical: 10,
        zIndex: 1,
        paddingHorizontal: 20,
        backgroundColor: isDarkMode
          ? "rgba(0,0,0,0.9)"
          : "rgba(255,255,255,0.7)",
      }}
    >
      <Image
        source={require("../../assets/images/lio.png")}
        resizeMode="contain"
        style={{ width: 50, height: 50 }}
      />
      <Box style={{ gap: 20, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.push("/(profile)/profile")}>
          {userinformation && userinformation.photoURL ? (
            <Image
              source={{ uri: userinformation.photoURL }}
              resizeMode="contain"
              style={{ width: 40, height: 40, borderRadius: 100 }}
            />
          ) : (
            <AntDesign name="user" size={30} color={Colors[color].text} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/settings/")}>
          <AntDesign name="setting" size={30} color={Colors[color].text} />
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
