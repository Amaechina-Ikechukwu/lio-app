import React, { useState } from "react";
import { View as Box, Text, Image, Dimensions } from "react-native";
import {
  CustomButton,
  CustomText,
  View as ThemedView,
} from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Link, router } from "expo-router";
import { useTheme } from "../../context/ThemeProvider";
import UploadImage from "../../functions/UploadImage";
import { useAuth } from "../auth";
import GetUserID from "../../apis/GetUserID";
import { Liostore } from "../../constants/Store";
import { useAlert } from "../../context/AlertProvider";
import { Redirect } from "expo-router";
export function ErrorBoundary(props: any) {
  const { color } = useTheme();
  const { showAlert } = useAlert();
  return (
    <ThemedView
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
    </ThemedView>
  );
}
export default function Page() {
  const theme = useTheme();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { setImageBlob, setImageUri, imageUri } = Liostore((state: any) => ({
    setImageBlob: state.setImageBlob,
    setImageUri: state.setImageUri,
    imageUri: state.imageUri,
  }));
  const [image, setImage] = useState<string | null>("");
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

  const { isDarkMode, colorScheme } = useTheme();
  const color = colorScheme as keyof typeof Colors;

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
          {!image ? (
            <Box
              style={{
                width: "auto",
                height: 400,
                backgroundColor: Colors[color ?? "light"].tabIconDefault,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <CustomButton
                inverse={isDarkMode}
                text="Tap here to pick an image"
                onPress={() => pickImage()}
              />
            </Box>
          ) : (
            <Image
              source={{ uri: image }}
              style={{
                width: "auto",
                height: 500,
                resizeMode: "contain",
              }}
            />
          )}
        </Box>
        <Box
          style={{
            gap: 10,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {image && (
            <CustomButton
              style={{
                borderWidth: 2,
                borderColor: Colors[color].primary,
                width: "100%",
              }}
              text="Pick another image"
              onPress={() => pickImage()}
            />
          )}
          <Link href={"/createportfolio/inputform"} asChild={image !== null}>
            <CustomButton
              inverse
              onPress={
                image == null
                  ? () => showAlert("Please add an image")
                  : undefined
              }
              style={{
                backgroundColor: !image
                  ? Colors[color].background
                  : Colors[color].text,
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
