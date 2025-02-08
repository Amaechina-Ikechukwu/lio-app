import React, { useState } from "react";
import {
  View as Box,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  CustomButton,
  CustomInput,
  CustomText,
  View as ThemedView,
} from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";
import { useTheme } from "../../context/ThemeProvider";

import GetUserID from "../../apis/GetUserID";
import { Liostore } from "../../constants/Store";
import { useAlert } from "../../context/AlertProvider";
import { useAuth } from "../../app/auth";
import { router } from "expo-router";

export default function MultipleImageSelection({ update }: any) {
  const {
    setImageBlobArray,
    setImageUriArray,
    imageBlobArray,
    imageUriArray,
    setAlbumName,
    portfolioInformation,
  } = Liostore((state: any) => ({
    setImageBlobArray: state.setImageBlobArray,
    setImageUriArray: state.setImageUriArray,
    imageBlobArray: state.imageBlobArray,
    imageUriArray: state.imageUriArray,
    setAlbumName: state.setAlbumName,
    portfolioInformation: state.portfolioInformation,
  }));

  const [images, setImages] = useState<string[]>(imageUriArray); // Store multiple image URIs
  const [albumName, setAlbumname] = useState("album");
  const theme = useTheme();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  async function uriToBlob(uri: string): Promise<Blob> {
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
  const handleShowPreview = () => {
    setAlbumName(albumName);
    if (update) {
      router.push("/updateproject/previewportfolio");
    } else {
      router.push("/createportfolio/previewportfolio");
    }
  };
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true, // Allow multiple image selection
    });

    if (!result.canceled) {
      showAlert("Preparing Images");

      const imageUris = result.assets.map((asset) => asset.uri);
      const useruid = await GetUserID(user);
      try {
        setImages([...images, ...imageUris]); // Add new image URIs to the state
        const blobs = await Promise.all(imageUris.map((uri) => uriToBlob(uri))); // Fetch the image data and convert to blobs
        const paths = blobs.map(
          (blob) => `images/${useruid}/portfolio/${blob.name}`
        );

        setImageBlobArray(blobs.map((blob) => blob)); // Store the blobs in the state
        setImageUriArray(imageUris); // Store the blobs in the state
      } catch (error: any) {
        showAlert(error);
        return;
      }
    } else {
      showAlert("Pick images again");
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <Image
      source={{ uri: item }}
      style={{
        width: 100, // Set a fixed width
        aspectRatio: 1, // Maintain aspect ratio
        resizeMode: "contain",
        borderRadius: 10,
        marginBottom: 10,
      }}
    />
  );

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
        <CustomText variant="semibold" style={{ fontSize: 20 }}>
          Showcase various aspect of your project
        </CustomText>
        <Box style={{ width: "100%", gap: 20 }}>
          <Box>
            <CustomInput
              focus
              style={{
                borderWidth: 0,
                height: 80,
                backgroundColor: Colors[color].background,
              }}
              placeholder="Add album name"
              value={albumName}
              onChangeText={setAlbumname}
            />
          </Box>
          <FlatList
            data={images}
            keyExtractor={(item) => item}
            numColumns={3} // Display 3 columns
            renderItem={renderItem}
            columnWrapperStyle={{ justifyContent: "space-around", gap: 10 }}
            // contentContainerStyle={{
            //   justifyContent: "space-between",
            //   gap: 10,
            // }}

            ListEmptyComponent={() => {
              return (
                <Box
                  style={{
                    width: "auto",
                    height: 60,
                    backgroundColor: Colors[color ?? "light"].tabIconDefault,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                  <CustomButton
                    inverse={isDarkMode}
                    text="Pick an image from camera roll"
                    onPress={() => pickImages()}
                  />
                </Box>
              );
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
          {images.length > 0 && (
            <CustomButton
              style={{
                borderWidth: 2,
                borderColor: Colors[color].primary,
                width: "100%",
              }}
              text="Pick more images"
              onPress={() => pickImages()}
            />
          )}
          <Link href={"/createportfolio/inputform"} asChild>
            <CustomButton
              inverse={isDarkMode && images.length == 0}
              style={{
                width: "100%",
              }}
              text="Go back"
            />
          </Link>
          <CustomButton
            inverse={isDarkMode}
            onPress={
              images.length == 0
                ? () => showAlert("Please Add Images")
                : () => handleShowPreview()
            }
            style={{
              backgroundColor: Colors[color].primary,
              width: "100%",
            }}
            text="Preview Portfolio"
          />
        </Box>
      </Box>
    </ThemedView>
  );
}
