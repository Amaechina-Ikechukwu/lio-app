import {
  View as Box,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React from "react";
import { CustomButton, CustomText, View } from "../Themed";
import Colors from "../../constants/Colors";
import { Link, router } from "expo-router";
import { useAuth } from "../../app/auth";
import { useTheme } from "../../context/ThemeProvider";
import { Entypo } from "@expo/vector-icons";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../../firebaseConfig";
const Visitations = ({ projectId }: any) => {
  const { isDarkMode, color } = useTheme();
  const [docCount, setDocCount] = useState<number>(0);
  const auth = useAuth();
  useEffect(() => {
    const user = auth.userid;
    const q = query(collection(db, "clicks", `${user}`, `${projectId}`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setDocCount(querySnapshot.size);
    });
    return () => unsubscribe();
  }, []);
  return (
    <Box style={{ alignItems: "flex-end" }}>
      <Box style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <Entypo name="eye" size={25} color={Colors[color].textTint} />
        <CustomText variant="semibold" style={{ fontSize: 20 }}>
          {docCount}
        </CustomText>
      </Box>
    </Box>
  );
};
export default function UserProjects({ projects }: any) {
  const { isDarkMode, color } = useTheme();

  const image =
    "https://upload.wikimedia.org/wikipedia/en/d/d6/Superman_Man_of_Steel.jpg";
  // useEffect(() => {
  //   getUserProjects();
  // }, []);
  const renderItem = ({ item }: any) => {
    return (
      <Link key={item.description} href={`/(profile)/${item.id}`} asChild>
        <TouchableOpacity>
          <Box
            style={{
              gap: 5,
              backgroundColor: isDarkMode ? "#262626" : "#e2e8f0",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Image
              source={{ uri: item.heroimage || image }}
              resizeMode="contain"
              style={{ width: "auto", height: 300 }}
            />
            <Box style={{ gap: 5 }}>
              <CustomText variant="semibold" style={{ fontSize: 16 }}>
                {item.name}
              </CustomText>
              <CustomText>{item.description}</CustomText>
            </Box>
            <Visitations projectId={item.nickname} />
          </Box>
        </TouchableOpacity>
      </Link>
    );
  };
  return (
    <Box
      style={{
        gap: 10,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <FlatList
        data={projects}
        style={{ width: "100%", rowGap: 5 }}
        contentContainerStyle={{
          rowGap: 15,
        }}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <CustomText variant="regular" style={{ fontSize: 18 }}>
            Your Projects
          </CustomText>
        }
        ListEmptyComponent={
          <Box
            style={{
              width: "100%",
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CustomText variant="light">
              Seems like you haven't added a project
            </CustomText>
            <CustomButton
              inverse={isDarkMode ? true : false}
              onPress={() => router.push("/createportfolio/")}
              style={{ backgroundColor: Colors.light.primary, width: "100%" }}
              text="Click to add a project"
            />
          </Box>
        }
      />
    </Box>
  );
}
