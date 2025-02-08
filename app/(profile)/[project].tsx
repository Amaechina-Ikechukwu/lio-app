import React, { useState } from "react";
import {
  View as Box,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "../../context/ThemeProvider";
import Colors from "../../constants/Colors";
import Divider from "../../constants/Divider";
import { useAlert } from "../../context/AlertProvider";
import { useAuth } from "../auth";
import { useEffect } from "react";
import { router } from "expo-router";
import { CustomButton, CustomText, View } from "../../components/Themed";
import ListOfImages from "../../components/CreatePorfolio/ListOfImages";
import { GetProject } from "../../apis/GetProject";
import { useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { DeleteProject } from "../../apis/DeleteProject";
import { Liostore } from "../../constants/Store";
import { shallow } from "zustand/shallow";
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

const Copy = ({ username, project }: any) => {
  const { color, isDarkMode } = useTheme();
  const { showAlert } = useAlert();

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    showAlert("Copied: " + text);
  };
  return (
    <TouchableOpacity
      onPress={() =>
        copyToClipboard(`https://lio-beta.vercel.app/${username}/${project}`)
      }
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
        <CustomText>{`https://lio-beta.vercel.app/${username}/${project}`}</CustomText>
        <Feather name="copy" size={18} color={Colors[color].text} />
      </Box>
    </TouchableOpacity>
  );
};
export default function PreviewPortfolio() {
  const { width } = Dimensions.get("screen");
  const { color } = useTheme();
  const { showAlert } = useAlert();
  const { userid, user } = useAuth();
  const [imageLink, setImageLink] = useState<string>("");
  const [portfolioInformation, setportfolioInformation] = useState<any | null>(
    []
  );
  const { setPortfolioInformation } = Liostore(
    (state: any) => ({
      setPortfolioInformation: state.setPortfolioInformation,
    }),
    shallow
  );

  const [refreshing, setRefreshing] = useState(false);
  const { project } = useLocalSearchParams();
  const getUserProject = async () => {
    const result = await GetProject(userid, project);
    setportfolioInformation(result);
    setPortfolioInformation(result);
    setRefreshing(false);
  };
  const deleteProject = () => {
    showAlert("Deleting project: " + portfolioInformation.name);
    setTimeout(async () => {
      await DeleteProject(user, project);
      showAlert("Project Deleted");
      router.back();
    }, 5000);
  };
  const handleRefresh = () => {
    // Put your refresh logic here, e.g., fetch new data from the server
    // Once the refresh is complete, setRefreshing(false)
    // You can also update your 'projects' data state here if needed
    // For example:
    setRefreshing(true);
    getUserProject();
    setRefreshing(false);
  };
  useEffect(() => {
    setRefreshing(true);
    getUserProject();
  }, []);

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

  const image =
    "https://upload.wikimedia.org/wikipedia/en/d/d6/Superman_Man_of_Steel.jpg";
  if (!portfolioInformation.name) {
    return (
      <View style={{ gap: 6 }}>
        <ActivityIndicator color={Colors[color].primary} />
      </View>
    );
  }
  return (
    <View style={{ gap: 6 }}>
      <ScrollView
        stickyHeaderHiddenOnScroll
        contentContainerStyle={{ gap: 25 }}
        stickyHeaderIndices={[0]} // Index of the sticky header (image)
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
          source={{ uri: portfolioInformation.heroimage || image }}
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
          <Copy
            username={portfolioInformation.user}
            project={portfolioInformation.nickname}
          />
          <CustomText
            variant="light"
            style={{ fontSize: 16, color: Colors[color].text }}
          >
            Technology Stack: {portfolioInformation.technologyStack}
          </CustomText>
          {/* Other portfolio details */}
        </Box>
        <Divider />
        <Box style={{ gap: 10 }}>
          <CustomText>Project Showcase</CustomText>
          <Box>
            <CustomText variant="semibold" style={{ fontSize: 20 }}>
              {portfolioInformation.albumName}
            </CustomText>
            <ListOfImages images={portfolioInformation.collectionOfImages} />
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
      <Box
        style={{
          width: "100%",
          justifyContent: "flex-end",
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          gap: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/updateproject/${project}`)}
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
        <TouchableOpacity
          onPress={() => deleteProject()}
          style={{
            padding: 15,
            borderRadius: 10,
            width: "auto",
            alignItems: "center",
            backgroundColor: Colors[color].text,
          }}
        >
          <AntDesign name="delete" size={18} color={Colors[color].error} />
        </TouchableOpacity>
      </Box>
    </View>
  );
}
