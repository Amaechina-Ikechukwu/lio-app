import React, { useState } from "react";
import { View as Box, Image, ScrollView, Dimensions } from "react-native";
import { CustomButton, CustomText, View } from "../Themed";
import { Liostore } from "../../constants/Store";
import { useTheme } from "../../context/ThemeProvider";
import Colors from "../../constants/Colors";
import ListOfImages from "./ListOfImages";
import Divider from "../../constants/Divider";
import { useAlert } from "../../context/AlertProvider";
import { useAuth } from "../../app/auth";
import UploadImage from "../../functions/UploadImage";
import { useEffect } from "react";
import { PostPortfolio } from "../../apis/CreatePortfolio";
import { shallow } from "zustand/shallow";
import { router, useGlobalSearchParams } from "expo-router";
import { UpdateProject } from "../../apis/UpdateProject";

interface PortfolioInformation {
  name: string;
  description: string;
  technologyStack: string;
  status: string; // Make sure this matches the actual type of the status property
}

export default function PreviewPortfolio({ update, navigate }: any) {
  const {
    imageBlob,
    imageBlobArray,
    imageUriArray,
    albumName,
    portfolioInformation,
    imageUri,
    projectId,
    setImageUrl,
    clearPortfolio,
  } = Liostore(
    (state: any) => ({
      imageBlob: state.imageBlob,
      imageBlobArray: state.imageBlobArray,
      imageUriArray: state.imageUriArray,
      albumName: state.albumName,
      portfolioInformation: state.portfolioInformation,
      imageUri: state.imageUri,
      projectId: state.projectId,
      setImageUrl: state.setImageUrl,
      clearPortfolio: state.clearPortfolio,
    }),
    shallow
  );

  const { width } = Dimensions.get("screen");
  const { color } = useTheme();
  const { showAlert } = useAlert();
  const { userid, user, userinformation } = useAuth();
  const [imageLink, setImageLink] = useState<string>("");
  const [imageLinkArray, setImageLinkArray] = useState<string[] | null>([]);
  const params = useGlobalSearchParams();
  useEffect(() => {}, [imageLink, imageLinkArray, portfolioInformation]);

  const ProjectStatus = ({ status }: { status: string }) => {
    if (status === "to do") {
      return (
        <Box
          style={{
            padding: 5,
            borderRadius: 10,
            backgroundColor: Colors[color].tabIconDefault,
            width: 50,
            alignItems: "center",
          }}
        >
          <CustomText>{status}</CustomText>
        </Box>
      );
    } else if (status === "in progress") {
      return (
        <Box
          style={{
            padding: 5,
            borderRadius: 10,
            backgroundColor: Colors[color].sub,
            width: 100,
            alignItems: "center",
          }}
        >
          <CustomText>{status}</CustomText>
        </Box>
      );
    } else if (status === "done") {
      return (
        <Box
          style={{
            padding: 5,
            borderRadius: 10,
            backgroundColor: Colors[color].text,
            width: 50,
            alignItems: "center",
          }}
        >
          <CustomText inverse>{status}</CustomText>
        </Box>
      );
    } else {
      return null; // Return null for unknown statuses or handle them accordingly
    }
  };
  const uploadImage = async () => {
    try {
      if (imageBlob) {
        const singleImagePath = `images/${userid}/portfolio/${imageBlob._data.name}`;
        showAlert("Uploading hero image");

        const heroImageLink = await UploadImage(singleImagePath, imageBlob);

        return heroImageLink;
      } else {
        // setImageLink(portfolioInformation.heroimage);
      }
    } catch (error: any) {
      showAlert("Error uploading image");
    }
  };
  const uploadImages = async () => {
    try {
      if (imageBlobArray.length > 0 || imageBlobArray) {
        showAlert(
          "Uploading album: " + albumName + ". Please wait, might take a while"
        );

        const paths = imageBlobArray.map(
          (blob: any) => `images/${userid}/portfolio/${blob?._data.name}`
        );

        // Use Promise.all to handle parallel uploads
        const links = await Promise.all(
          paths.map(async (path: any, index: any) => {
            try {
              const link = await UploadImage(path, imageBlobArray[index]);

              // Check if the upload was successful
              if (link) {
                return link;
              } else {
                throw new Error("Image upload failed");
              }
            } catch (error: any) {
              return null;
            }
          })
        );

        const linksArray = links.filter((link) => link !== null);

        // Update state or perform other actions with the linksArray

        return linksArray;
      } else {
        setImageLinkArray(portfolioInformation.collectionOfImages);
      }
    } catch (error: any) {
      // Return an empty array or handle the error as needed
    }
  };

  const uploadProject = async (link: string, linkArray: string[] | null) => {
    try {
      const result = await uploadImage();
      const resultArray = await uploadImages();

      showAlert(
        "Uploading project. You can always edit this project in the future"
      );
      const data = {
        ...portfolioInformation,
        heroimage: result || portfolioInformation.heroimage,

        albumName,
        collectionOfImages:
          resultArray || portfolioInformation.collectionOfImages,
        user:
          userinformation.username ||
          userinformation.displayName.toLowerCase().trim().split(" ").join("-"),
      };

      if (update == true) {
        if (!data.heroimage) {
          throw new Error("Missing heroimage field");
        }

        await UpdateProject(data, user, projectId); // Update the project
        clearPortfolio();
      } else {
        await PostPortfolio(data, user); // Upload a new project
        clearPortfolio();
      }

      showAlert(update ? "Updated" : "Uploaded");

      if (update) {
        clearPortfolio();
        navigate(); // Navigate to the updated project
      } else {
        clearPortfolio();
        router.replace("/(home)/"); // Navigate to the home screen
      }
    } catch (error: any) {
      // Handle errors appropriately
      if (error instanceof Error) {
        showAlert(error.message);
      } else {
        showAlert("An unknown error occurred.");
      }
    }
  };

  return (
    <View style={{ gap: 6 }}>
      <ScrollView
        stickyHeaderHiddenOnScroll
        contentContainerStyle={{ gap: 25 }}
        stickyHeaderIndices={[0]} // Index of the sticky header (image)
      >
        <Image
          source={{ uri: imageLink || imageUri }}
          style={{
            width: "auto",
            height: 400,
            resizeMode: "contain", // Adjust as needed
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            aspectRatio: 1,
            objectFit: "contain",
          }}
        />
        <Box style={{ gap: 10 }}>
          <Box
            style={{ flexDirection: "row", alignItems: "flex-end", gap: 10 }}
          >
            <CustomText variant="semibold" style={{ fontSize: 30 }}>
              {portfolioInformation.name}
            </CustomText>
            <ProjectStatus status={portfolioInformation.status} />
          </Box>

          <CustomText variant="regular" style={{ fontSize: 18 }}>
            {portfolioInformation.description}
          </CustomText>
          <CustomText
            variant="light"
            style={{ fontSize: 16, color: Colors[color].text }}
          >
            Technology Stack: {portfolioInformation.technologyStack}
          </CustomText>
          <CustomText
            variant="light"
            style={{ fontSize: 16, color: Colors[color].text }}
          >
            Link: {portfolioInformation.url}
          </CustomText>
          {/* Other portfolio details */}
        </Box>
        <Divider />
        <Box style={{ gap: 10 }}>
          <CustomText>Project Showcase</CustomText>
          <Box>
            <CustomText variant="semibold" style={{ fontSize: 20 }}>
              {albumName}
            </CustomText>
            <ListOfImages images={imageUriArray} />
          </Box>
        </Box>
        <Divider />
        <Box style={{ gap: 10 }}>
          <CustomText>Challenges faced:</CustomText>
          <Box>
            <CustomText variant="regular" style={{ fontSize: 16 }}>
              {portfolioInformation.challenges}
            </CustomText>
          </Box>
        </Box>
        <Box style={{ gap: 10 }}>
          <CustomText>Areas Of Strength:</CustomText>
          <Box>
            <CustomText variant="regular" style={{ fontSize: 16 }}>
              {portfolioInformation.overcome}
            </CustomText>
          </Box>
        </Box>
      </ScrollView>
      <CustomButton
        onPress={() => uploadProject(imageLink, imageLinkArray)}
        inverse
        style={{
          backgroundColor: Colors[color].text,
          width: "100%",
        }}
        text={update == true ? "Update Project" : "Post Project"}
      />
    </View>
  );
}
