import React, { useState } from "react";
import {
  View as Box,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  CustomButton,
  CustomText,
  View as ThemedView,
  View,
} from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../context/ThemeProvider";
import UploadImage from "../../functions/UploadImage";
import { useAuth } from "../auth";
import GetUserID from "../../apis/GetUserID";
import { Liostore } from "../../constants/Store";
import { useAlert } from "../../context/AlertProvider";
import { Redirect } from "expo-router";
import { GetProject } from "../../apis/GetProject";
import { useEffect } from "react";
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
export default function Page() {
  const theme = useTheme();
  const { user, userid } = useAuth();
  const { showAlert } = useAlert();
  const [portfolioInformation, setportfolioInformation] = useState<any | null>(
    []
  );
  const {
    setImageBlob,
    setImageUri,
    imageUri,
    setPortfolioInformation,
    setProjectId,
  } = Liostore((state: any) => ({
    setImageBlob: state.setImageBlob,
    setImageUri: state.setImageUri,
    imageUri: state.imageUri,
    setPortfolioInformation: state.setPortfolioInformation,
    setProjectId: state.setProjectId,
  }));
  const [image, setImage] = useState<string | null>(imageUri);

  function uriToBlob(uri: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send();
    });
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      showAlert("Preparing Image,  might take a while");
      const imageUri = result.assets[0].uri;

      const useruid = await GetUserID(user);
      try {
        const blob = await uriToBlob(imageUri); // Fetch the image data and convert to blob
        const path = `images/${useruid}/portfolio/${blob.name}`;
        // await UploadImage(path, blob); // Upload the image using the UploadImage function
        // Set the image URI in the state
        setImageBlob(blob);
        setImageUri(imageUri);
        setImage(imageUri);
      } catch (error: any) {
        showAlert(error);
        return;
      }
    } else {
      showAlert("Pick image again");
    }
  };

  const { project } = useLocalSearchParams();
  const getUserProject = async () => {
    const result = await GetProject(userid, project);
    const {
      name,
      description,
      technologyStack,
      category,
      tags,
      status,
      url,
      challenges,
      overcome,
      nickname,
    } = result;
    setportfolioInformation(result);
    setPortfolioInformation(
      name,
      description,
      technologyStack,
      category,
      tags,
      status,
      url,
      challenges,
      overcome,
      nickname
    );
    setProjectId(project);
    setImageUri(result.heroimage);
  };
  useEffect(() => {
    getUserProject();
  }, []);
  const { isDarkMode, colorScheme } = useTheme();
  const color = colorScheme as keyof typeof Colors;
  if (portfolioInformation == null) {
    return (
      <View style={{ gap: 6 }}>
        <ActivityIndicator color={Colors[color].primary} />
      </View>
    );
  }
  return (
    <ThemedView>
      <Box
        style={{
          gap: 16,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Redirect href={"/createportfolio/inputform"} /> */}
        <CustomText
          inverse={isDarkMode}
          variant="semibold"
          style={{ fontSize: 20 }}
        >
          Add a hero image for this project
        </CustomText>
        <Box style={{ width: "100%" }}>
          <Image
            source={{ uri: image || portfolioInformation.heroimage }}
            style={{
              width: "auto",
              height: 500,
              resizeMode: "contain",
            }}
          />
        </Box>
        <Box
          style={{
            gap: 10,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomButton
            style={{
              borderWidth: 2,
              borderColor: Colors[color].primary,
              width: "100%",
            }}
            text="Change Project Image"
            onPress={() => pickImage()}
          />

          <Link href={"/updateproject/inputform"} asChild>
            <CustomButton
              inverse
              style={{
                backgroundColor: Colors[color].text,
                width: "100%",
              }}
              text="Continue"
            />
          </Link>
        </Box>
      </Box>
    </ThemedView>
  );
}
