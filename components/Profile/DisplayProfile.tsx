import {
  Image,
  ScrollView,
  View as Box,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import { CustomButton, CustomText, View } from "../Themed";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeProvider";
import Colors from "../../constants/Colors";
import { useAuth } from "../../app/auth";
import UserProjects from "./UserProjects";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useAlert } from "../../context/AlertProvider";
import { useEffect } from "react";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { GetUserPortfolio } from "../../apis/GetUserPortfolio";
import * as Clipboard from "expo-clipboard";
const Copy = ({ username }: any) => {
  const { color, isDarkMode } = useTheme();
  const { showAlert } = useAlert();
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showAlert("Copied: " + text);
  };
  return (
    <TouchableOpacity
      onPress={() => copyToClipboard(`https://lio-beta.vercel.app/${username}`)}
    >
      <Box
        style={{
          padding: 6,
          paddingHorizontal: 10,
          backgroundColor: isDarkMode ? "#262626" : "#e2e8f0",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          borderRadius: 10,
          justifyContent: "space-between",
        }}
      >
        <CustomText>{`https://lio-beta.vercel.app/${username}`}</CustomText>
        <Feather name="copy" size={18} color={Colors[color].text} />
      </Box>
    </TouchableOpacity>
  );
};
export default function DisplayProfile() {
  const image =
    "https://upload.wikimedia.org/wikipedia/en/d/d6/Superman_Man_of_Steel.jpg";
  const { width } = Dimensions.get("screen");
  const { color } = useTheme();
  const { userinformation, userid, getUserInformation, user } = useAuth();
  const { showAlert } = useAlert();
  const handleLinks = async (url: string) => {
    showAlert("Opening");
    try {
      setTimeout(() => {
        WebBrowser.openAuthSessionAsync(url)
          .then(() => {})
          .catch(() => showAlert("Link is empty or invalid"));
      }, 1000);
    } catch (error: any) {
      showAlert("Link is empty or invalid");
    }
  };
  const [projects, setProjects] = useState();
  const getUserProjects = async () => {
    const { userportfolio } = await GetUserPortfolio(userid);
    setProjects(userportfolio);
    setRefreshing(false);
  };

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    getUserInformation(user);
    getUserProjects();
  };
  useEffect(() => {
    getUserProjects();
  }, []);
  if (!userinformation) {
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
          style={{
            width: 100,
            height: 100,
            backgroundColor: Colors[color].textTint,
          }}
        />
        <CustomText>An error occurred</CustomText>
        <CustomButton
          onPress={() => getUserInformation(user)}
          text="Reload Profile"
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
  return (
    <>
      <ScrollView
        contentContainerStyle={{ gap: 25 }}
        showsVerticalScrollIndicator={false}
        // stickyHeaderIndices={[0]}
        // stickyHeaderHiddenOnScroll
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            // You can customize the refresh indicator color here if needed
            // tintColor={yourColor}
          />
        }
      >
        <Image
          resizeMode="cover"
          style={{
            width: width,
            height: 300,
            zIndex: 1,
            borderBottomLeftRadius: 15,
            backgroundColor: Colors[color].textTint,
          }}
          source={{
            uri: userinformation?.coverimage,
          }}
        />
        <Box
          style={{
            position: "absolute",
            top: 240,
            zIndex: 10,
            left: 5,
          }}
        >
          <Image
            source={{ uri: userinformation?.photoURL }}
            resizeMode="contain"
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: Colors[color].textTint,
            }}
          />
        </Box>

        <Box style={{ marginTop: 35 }}>
          <Box style={{ gap: 5 }}>
            <CustomText variant="semibold" style={{ fontSize: 24 }}>
              {userinformation?.displayName}
            </CustomText>
            {userinformation?.technologyStack &&
              userinformation?.technologyStack?.length > 0 && (
                <CustomText variant="regular" style={{ fontSize: 16 }}>
                  {userinformation?.technologyStack}
                </CustomText>
              )}
            {userinformation?.bio && userinformation?.bio?.length > 0 && (
              <CustomText variant="light" style={{ fontSize: 16 }}>
                {userinformation?.bio}
              </CustomText>
            )}
            <Copy
              username={
                userinformation.username ||
                userinformation.displayName
                  .toLowerCase()
                  .trim()
                  .split(" ")
                  .join("-")
              }
            />
          </Box>

          <Box style={{ marginTop: 10, flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => handleLinks(userinformation?.github)}
              style={{
                borderWidth: 1,
                borderColor: Colors[color].textTint,
                paddingVertical: 5,
                borderRadius: 10,
                width: 40,
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <AntDesign
                name="github"
                size={14}
                color={Colors[color].textTint}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinks(userinformation.twitter)}
              style={{
                borderWidth: 1,
                borderColor: Colors[color].textTint,
                paddingVertical: 5,
                borderRadius: 10,
                width: 40,
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <AntDesign
                name="twitter"
                size={14}
                color={Colors[color].textTint}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinks(userinformation.facebook)}
              style={{
                borderWidth: 1,
                borderColor: Colors[color].textTint,
                paddingVertical: 5,
                borderRadius: 10,
                width: 40,
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <AntDesign
                name="facebook-square"
                size={14}
                color={Colors[color].textTint}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinks(userinformation.instagram)}
              style={{
                borderWidth: 1,
                borderColor: Colors[color].textTint,
                paddingVertical: 5,
                borderRadius: 10,
                width: 40,
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <AntDesign
                name="instagram"
                size={14}
                color={Colors[color].textTint}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinks(userinformation.linkedIn)}
              style={{
                borderWidth: 1,
                borderColor: Colors[color].textTint,
                paddingVertical: 5,
                borderRadius: 10,
                width: 40,
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <AntDesign
                name="linkedin-square"
                size={14}
                color={Colors[color].textTint}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLinks(userinformation.tiktok)}
              style={{
                borderWidth: 1,
                borderColor: Colors[color].textTint,
                paddingVertical: 5,
                borderRadius: 10,
                width: 40,
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <FontAwesome5
                name="tiktok"
                size={14}
                color={Colors[color].textTint}
              />
            </TouchableOpacity>
          </Box>
        </Box>

        <Box>
          <CustomText variant="light">Other links: </CustomText>
          <TouchableOpacity
            onPress={() => handleLinks(userinformation.others)}
            style={{
              width: 100,
            }}
          >
            <CustomText
              style={{
                color: Colors[color].tabIconSelected,
                textDecorationLine: "underline",
              }}
            >
              {userinformation.others
                ? `Link to ${userinformation.others}`
                : "No link added"}
            </CustomText>
          </TouchableOpacity>
        </Box>
        <Box>
          <CustomButton
            onPress={() => showAlert("Coming soon")}
            text="Blogs and Articles"
            icon={
              <AntDesign
                name="swapright"
                size={24}
                color={Colors[color].text}
              />
            }
            position="end"
            style={{
              width: "100%",
              paddingVertical: 5,
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: Colors[color].text,
            }}
          />
        </Box>
        <Box style={{ gap: 10, width: "100%" }}>
          <UserProjects projects={projects} />
        </Box>
      </ScrollView>
      <Box
        style={{
          width: "100%",
          justifyContent: "flex-end",
          position: "absolute",
          bottom: 0,
          gap: 6,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/createportfolio/")}
          style={{
            padding: 15,
            borderRadius: 10,
            width: "auto",
            alignItems: "center",
            backgroundColor: Colors[color].text,
          }}
        >
          <AntDesign name="plus" size={18} color={Colors[color].background} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(profile)/editprofile")}
          style={{
            padding: 15,
            borderRadius: 10,
            width: "auto",
            alignItems: "center",
            backgroundColor: Colors[color].text,
          }}
        >
          <AntDesign name="edit" size={18} color={Colors[color].background} />
        </TouchableOpacity>
      </Box>
    </>
  );
}
