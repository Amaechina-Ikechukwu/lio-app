import { View as Box } from "react-native";
import React, { useState } from "react";
import { CustomInput, CustomText } from "../../Themed";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useTheme } from "../../../context/ThemeProvider";
import { Liostore } from "../../../constants/Store";
import { shallow } from "zustand/shallow";
import { useAuth } from "../../../app/auth";

export default function AddUserLinks() {
  const { userinformation } = useAuth();
  const [links, setLinks] = useState({
    twitter: userinformation.twitter,
    linkedIn: userinformation.linkedIn,
    tiktok: userinformation.tiktok,
    instagram: userinformation.instagram,
    facebook: userinformation.facebook,
    github: userinformation.github,
    others: userinformation.others,
  });

  const { color } = useTheme();
  const { setSocialLinks } = Liostore(
    (state) => ({
      setSocialLinks: state.setLinks,
    }),
    shallow
  );
  const handleLinkChange = (platform: string, value: string) => {
    setLinks((prevLinks) => ({
      ...prevLinks,
      [platform]: value,
    }));
    setSocialLinks({ [platform]: value });
  };

  return (
    <Box>
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-around",
        }}
      >
        <AntDesign name="github" size={14} color={Colors[color].textTint} />
        <CustomInput
          style={{
            paddingVertical: 0,
            width: "80%",
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
          placeholder="GitHub"
          value={links.github}
          onChangeText={(text) => handleLinkChange("github", text)}
        />
      </Box>
      {/* Add other social media platforms similarly */}
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-around",
        }}
      >
        <AntDesign name="twitter" size={14} color={Colors[color].textTint} />
        <CustomInput
          style={{
            paddingVertical: 0,
            width: "80%",
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
          placeholder="Twitter"
          value={links.twitter}
          onChangeText={(text) => handleLinkChange("twitter", text)}
        />
      </Box>
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-around",
        }}
      >
        <AntDesign
          name="linkedin-square"
          size={14}
          color={Colors[color].textTint}
        />
        <CustomInput
          style={{
            paddingVertical: 0,
            width: "80%",
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
          placeholder="LinkedIn"
          value={links.linkedIn}
          onChangeText={(text) => handleLinkChange("linkedIn", text)}
        />
      </Box>
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-around",
        }}
      >
        <AntDesign name="instagram" size={14} color={Colors[color].textTint} />
        <CustomInput
          style={{
            paddingVertical: 0,
            width: "80%",
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
          placeholder="Instagram"
          value={links.instagram}
          onChangeText={(text) => handleLinkChange("instagram", text)}
        />
      </Box>
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-around",
        }}
      >
        <AntDesign
          name="facebook-square"
          size={14}
          color={Colors[color].textTint}
        />
        <CustomInput
          style={{
            paddingVertical: 0,
            width: "80%",
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
          placeholder="Facebook"
          value={links.facebook}
          onChangeText={(text) => handleLinkChange("facebook", text)}
        />
      </Box>
      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-around",
        }}
      >
        <FontAwesome5 name="tiktok" size={14} color={Colors[color].textTint} />
        <CustomInput
          style={{
            paddingVertical: 0,
            width: "80%",
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
          placeholder="TikTok"
          value={links.tiktok}
          onChangeText={(text) => handleLinkChange("tiktok", text)}
        />
      </Box>

      <Box
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          justifyContent: "space-around",
        }}
      >
        <AntDesign name="plus" size={14} color={Colors[color].textTint} />
        <Box style={{ width: "80%" }}>
          <CustomInput
            style={{
              paddingVertical: 0,
              borderWidth: 0,
              borderBottomWidth: 1,
              width: "100%",
            }}
            placeholder="More Links"
            value={links.others}
            onChangeText={(text) => handleLinkChange("others", text)}
          />
          <CustomText variant="light" style={{ width: "90%" }}>
            To add more links, end each link with a comma for easy seperation
          </CustomText>
        </Box>
      </Box>
    </Box>
  );
}
