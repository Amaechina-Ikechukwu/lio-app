import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import Button from "../../constants/Button";
import Colors from "../../constants/Colors";
import * as Linking from "expo-linking";
import * as Google from "expo-auth-session/providers/google";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { CustomButton, CustomText, View } from "../../components/Themed";
import { useRouter } from "expo-router";
import { useAlert } from "../../context/AlertProvider";
import { useTheme } from "../../context/ThemeProvider";
import { View as Box, FlatList, Dimensions, StyleSheet } from "react-native";
WebBrowser.maybeCompleteAuthSession();

const data = [
  {
    text: "A suitable developer portfolio display platform",
  },
  {
    text: "A platform to host all your projects",
  },
  {
    text: "Project so awesome,meant for the world to see",
  },
];
const GoogleSignIn = () => {
  const authProvider = useAuth();
  const router = useRouter();
  const { showAlert } = useAlert();
  useEffect(() => {
    Linking.addEventListener("url", handleDeepLink);
    return () => {};
    // Cleanup function to remove the event listener when the component unmounts
  }, []); // Empty dependency array ensures the effect only runs once during mount

  // ... Your imports and component definition ...
  const handleDeepLink = async (event: any) => {
    const accessParam = "access_token=";
    const idParam = "id_token=";
    const code = "code=";
    if (event.url.includes(accessParam) && event.url.includes(idParam)) {
      const access_token = event.url.split(accessParam)[1].split("&")[0];
      const id_token = event.url.split(idParam)[1].split("&")[0];
      const codeId = event.url.split(code)[1];
      // Now 'access_token', 'id_token', and 'codeId' contain the extracted values
      showAlert("Logging in,please wait");
      await connectToFirebase(id_token);
      return;
      // Close the in-app browser
      // Note: WebBrowser.dismissBrowser(); may not work in some cases
    }
  };
  const connectToFirebase = async (id_token: string) => {
    const credential = GoogleAuthProvider.credential(id_token);
    const result = await signInWithCredential(auth, credential);
    const user = { uid: result.user.uid };

    await loginToLioServer(user);
    return;
  };
  const appurl = Linking.createURL("");
  const handleLogin = async () => {
    const authEndpoint =
      process.env.EXPO_PUBLIC_LIOSERVER + "/auth/google?redirectUri=" + appurl;
    WebBrowser.openAuthSessionAsync(authEndpoint);
  };
  const loginToLioServer = async (userInfo: any) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_LIOSERVER}/registeruser` || "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );

      // Log the response text
      const responseData = await response.json(); // Parse JSON

      await authProvider.signIn(responseData?.token);
      // router.push("/(home)/");

      return;
    } catch (error) {
      throw new Error("Error");
    }
  };
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const colorSchemeAsKey = theme.colorScheme as keyof typeof Colors;
  const backgroundColors = ["#7f1d1d", "#0c4a6e", "#059669"]; // Example colors
  const textColors = ["#fca5a5", "#7dd3fc", "#86efac"]; // Example colors

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Box
      style={{
        backgroundColor: backgroundColors[index % backgroundColors.length], // Use modulo to cycle through colors if there are more items than colors
        padding: 20,
        margin: 5,
        borderRadius: 15,
        height: 400,
        justifyContent: "flex-end",
        width: width * 0.85,
      }}
    >
      <CustomText
        style={{
          color: textColors[index % textColors.length],
          fontSize: 34,
        }}
      >
        {item}
      </CustomText>
    </Box>
  );
  const dataArray = data.map((item) => item.text);

  return (
    <View lightColor="white" darkColor="black" style={{ flex: 1, gap: 24 }}>
      <Box style={{ width: "100%" }}>
        <FlatList
          horizontal
          data={dataArray}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item} // Assuming URIs are unique
        />
      </Box>

      <CustomButton
        onPress={() => handleLogin()}
        inverse
        style={{
          backgroundColor: Colors[colorSchemeAsKey].text,
          width: "100%",
          paddingHorizontal: 30,
        }}
        text={"Sign In With Google"}
      />
    </View>
  );
};

export default GoogleSignIn;
