import { Link, Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  useColorScheme,
  View as Box,
} from "react-native";
import { CustomButton, CustomText, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { useAlert } from "../../context/AlertProvider";
import * as Linking from "expo-linking";
import { useAuth } from "../auth";
import { useTheme } from "../../context/ThemeProvider";
import { GetNumberOfClicks } from "../../apis/GetNumberOfClicks";
import { GetUserPortfolio } from "../../apis/GetUserPortfolio";
import UserProjects from "../../components/Profile/UserProjects";
import { db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
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
export default function Feed() {
  const theme = useColorScheme();
  const auth = useAuth();
  const { showAlert, alert, hideAlert } = useAlert();
  const url = Linking.useURL();
  const [numberOfClicks, setNumberOfClicks] = useState(0);
  const [projects, setProjects] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const getClicks = async () => {
    try {
      const result = await GetNumberOfClicks(auth.userid);
      setNumberOfClicks(result.number);
      setRefreshing(false);
    } catch {
      setRefreshing(false);
    }
  };
  const getUserProjects = async () => {
    try {
      const { userportfolio } = await GetUserPortfolio(auth.userid);
      setProjects(userportfolio);
      setRefreshing(false);
    } catch {
      setRefreshing(false);
    }
  };
  const handleRefresh = () => {
    try {
      setRefreshing(true);
      getUserProjects();
    } catch {
      setRefreshing(false);
    }
  };
  const [docCount, setDocCount] = useState<number | null>(null);

  useEffect(() => {
    const user = auth.userid;
    const q = query(collection(db, "clicks", `${user}`, `${user}`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setDocCount(querySnapshot.size);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      if (auth.userid) {
        handleRefresh();
        const user = auth.userid;
        const q = query(collection(db, "clicks", `${user}`, `${user}`));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          setDocCount(querySnapshot.size);
        });
      }
    } catch {
      setDocCount(0);
    }
  }, [auth.userid]);

  const { isDarkMode, colorScheme } = useTheme();
  const color = colorScheme as keyof typeof Colors;

  return (
    <View style={{ gap: 8, flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Box style={{ gap: 20 }}>
          <Box
            style={{
              backgroundColor: "#60a5fa",
              width: "100%",
              padding: 10,
              borderRadius: 10,
              height: 200,
              flexDirection: "row",
              // justifyContent: "center",
            }}
          >
            <Box
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 10,
                justifyContent: "space-around",
              }}
            >
              <CustomText variant="regular" style={{ fontSize: 16 }}>
                Visits on your link
              </CustomText>
              {auth.userid && auth.userid.length > 0 ? (
                docCount !== null ? (
                  <CustomText variant="semibold" style={{ fontSize: 50 }}>
                    {docCount}
                  </CustomText>
                ) : (
                  <ActivityIndicator
                    color={Colors[color].textTint}
                    size="large"
                  />
                )
              ) : (
                <ActivityIndicator color={Colors[color].primary} size="large" />
              )}
            </Box>
            <Box
              style={{
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: "70%",
              }}
            >
              <Image
                source={require("../../assets/images/lio.png")}
                resizeMode="contain"
                style={{ width: 50, height: 50 }}
              />
            </Box>
          </Box>
          <Box
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <UserProjects projects={projects} />
          </Box>
        </Box>
      </ScrollView>
    </View>
  );
}
