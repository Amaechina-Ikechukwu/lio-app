import { View as Box } from "react-native";
import React, { useState } from "react";
import { CustomInput, CustomText, View } from "../../Themed";
import { Liostore } from "../../../constants/Store";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import { useAuth } from "../../../app/auth";

export default function UserInfoEdit() {
  const { setUserInformationArray } = Liostore(
    (state) => ({
      setUserInformationArray: state.setUserInformationArray,
    }),
    shallow
  );
  const { userinformation } = useAuth();
  const [inputs, setInputs] = useState({
    displayName: userinformation.displayName,
    bio: userinformation.bio,
    technologyStack: userinformation.technologyStack,
    email: userinformation.email,
    phoneNumber: userinformation.phoneNumber, // Changed to string
    username: userinformation.username,
  });

  const handleInputChange = (field: string, value: string) => {
    setUserInformationArray({ [field]: value });
    setInputs((prevInputs) => ({
      ...prevInputs,
      [field]: value,
    }));
  };
  useEffect(() => {}, [inputs]);
  return (
    <Box style={{ gap: 20, width: "auto" }}>
      <Box style={{ gap: 4 }}>
        <CustomText variant="light" style={{ fontSize: 14 }}>
          Name
        </CustomText>
        <CustomInput
          placeholder={inputs.displayName}
          value={inputs.displayName}
          onChangeText={(text) => handleInputChange("displayName", text)}
          style={{ borderWidth: 0, borderBottomWidth: 1, paddingVertical: 0 }}
        />
      </Box>
      <Box style={{ gap: 6 }}>
        <CustomText variant="light" style={{ fontSize: 14 }}>
          Bio
        </CustomText>
        <CustomInput
          multiline={true}
          style={{ borderWidth: 0, borderBottomWidth: 1, paddingVertical: 0 }}
          placeholder={inputs.bio}
          value={inputs.bio}
          onChangeText={(text) => handleInputChange("bio", text)}
        />
      </Box>
      <Box style={{ gap: 6 }}>
        <CustomText variant="light" style={{ fontSize: 14 }}>
          Technology Stack
        </CustomText>
        <CustomInput
          style={{ borderWidth: 0, borderBottomWidth: 1, paddingVertical: 0 }}
          placeholder={inputs.technologyStack}
          value={inputs.technologyStack}
          onChangeText={(text) => handleInputChange("technologyStack", text)}
        />
      </Box>
      <Box style={{ gap: 6 }}>
        <CustomText variant="light" style={{ fontSize: 14 }}>
          Email
        </CustomText>
        <CustomInput
          style={{ borderWidth: 0, borderBottomWidth: 1, paddingVertical: 0 }}
          placeholder={inputs.email}
          value={inputs.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
      </Box>
      <Box style={{ gap: 6 }}>
        <CustomText variant="light" style={{ fontSize: 14 }}>
          Phone Number
        </CustomText>
        <CustomInput
          style={{ borderWidth: 0, borderBottomWidth: 1, paddingVertical: 0 }}
          placeholder={inputs.phoneNumber}
          value={inputs.phoneNumber}
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
        />
      </Box>
      <Box style={{ gap: 6 }}>
        <CustomText variant="light" style={{ fontSize: 14 }}>
          Username (gotten from Name) : changes with name
        </CustomText>
        <CustomText variant="regular" style={{ fontSize: 14 }}>
          {inputs.displayName &&
            inputs.displayName.toLowerCase().trim().split(" ").join("-")}
        </CustomText>
      </Box>
    </Box>
  );
}
