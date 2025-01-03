import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View as Box,
} from "react-native";
import Colors from "../../constants/Colors";
import { useTheme } from "../../context/ThemeProvider";
import { CustomButton, CustomText, View } from "../Themed";
import GetUserID from "../../apis/GetUserID";
import { useAlert } from "../../context/AlertProvider";
import { useAuth } from "../../app/auth";
import UserInfoEdit from "./EditSection/UserInfoEdit";
import AddUserLinks from "./EditSection/AddUserLinks";
import { Liostore } from "../../constants/Store";
import { shallow } from "zustand/shallow";
import UploadImage from "../../functions/UploadImage";
import { useEffect } from "react";
import { UpdateUserProfile } from "../../apis/UpdateUserProfile";
import { router } from "expo-router";

export default function EditProfile() {
  const { width } = Dimensions.get("window");
  const { color } = useTheme();
  const { userid, user, userinformation, getUserInformation } = useAuth();
  const { showAlert } = useAlert();
  const [dp, setDp] = useState(userinformation.photoURL);
  const [coverImage, setCoverImage] = useState(userinformation.coverimage);
  const image =
    "https://upload.wikimedia.org/wikipedia/en/d/d6/Superman_Man_of_Steel.jpg";

  const { setProfileBlobArray, profileBlobArray, links, userInformationArray } =
    Liostore(
      (state) => ({
        setProfileBlobArray: state.setProfileBlobArray,
        profileBlobArray: state.profileBlobArray,
        links: state.links,
        userInformationArray: state.userInformationArray,
      }),
      shallow
    );
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
  const pickDPImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      showAlert("Preparing Image,  might take a while");
      const imageUri = result.assets[0].uri;

      try {
        const blob = await uriToBlob(imageUri); // Fetch the image data and convert to blob
        const path = `images/${userid}/profile/dp/${blob.name}`;
        const result = await UploadImage(path, blob); // Upload the image using the UploadImage function
        // Set the image URI in the state
        setProfileBlobArray({ dp: result });
        //  setImageUri(imageUri);
        setDp(imageUri);
      } catch (error: any) {
        showAlert(error);
        return;
      }
    } else {
      showAlert("Pick image again");
    }
  };
  const pickCoverImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      showAlert("Preparing Image,  might take a while");
      const imageUri = result.assets[0].uri;

      try {
        const blob = await uriToBlob(imageUri); // Fetch the image data and convert to blob
        const path = `images/${userid}/profile/coverimage/${blob.name}`;
        const result = await UploadImage(path, blob); // Upload the image using the UploadImage function

        setProfileBlobArray({ coverImage: result });
        setCoverImage(imageUri);
      } catch (error: any) {
        showAlert(error);
        return;
      }
    } else {
      showAlert("Pick image again");
    }
  };

  const updateProfile = async () => {
    try {
      if (userInformationArray.displayName.length == 0) {
        showAlert("Please add your full name");
      } else {
        showAlert("Profile is being updated");
        const userdata = {
          photoURL: profileBlobArray.dp || dp,
          coverimage: profileBlobArray.coverImage || coverImage,
          ...links,
          ...(userInformationArray || userinformation),
        };
        await UpdateUserProfile(userdata, user);

        showAlert("Profile Updated");
        await getUserInformation(user);
        router.push("/(profile)/profile");
      }
    } catch (error: any) {
      showAlert(JSON.stringify(error));
    }
  };
  useEffect(() => {}, [profileBlobArray, links, userInformationArray]);
  return (
    <View style={{ gap: 10 }}>
      <ScrollView
        contentContainerStyle={{ width: width, gap: 25 }}
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        stickyHeaderHiddenOnScroll
      >
        <TouchableOpacity onPress={() => pickCoverImage()}>
          <Image
            resizeMode="cover"
            style={{
              width: width,
              height: 300,
              zIndex: 1,
              borderBottomLeftRadius: 15,
            }}
            source={{
              uri:
                coverImage ||
                "https://guardian.ng/wp-content/uploads/2018/09/Superman-Henry-Cavill.-Photo-Superman-Wiki-Fandom-e1536767614323.jpg",
            }}
          />
        </TouchableOpacity>

        <Box
          style={{
            position: "absolute",
            top: 240,
            zIndex: 10,
            left: 5,
          }}
        >
          <TouchableOpacity onPress={() => pickDPImage()}>
            <Image
              source={{ uri: dp || image }}
              resizeMode="contain"
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
              }}
            />
          </TouchableOpacity>
        </Box>
        <CustomText variant="light" style={{ fontSize: 16, marginTop: 25 }}>
          Tap on image to change
        </CustomText>

        <Box>
          <UserInfoEdit />
        </Box>
        <Box style={{ gap: 6 }}>
          <CustomText
            variant="semibold"
            style={{
              color: Colors[color].tabIconSelected,
              // textDecorationLine: "underline",
            }}
          >
            Add Links
          </CustomText>
          <AddUserLinks />
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
              width: "90%",
              paddingVertical: 5,
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: Colors[color].text,
            }}
          />
        </Box>
      </ScrollView>
      <CustomButton
        text="Update Profile"
        inverse
        onPress={() => updateProfile()}
        style={{ backgroundColor: Colors[color].text, width: "100%" }}
      />
    </View>
  );
}
