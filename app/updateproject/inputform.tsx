import React, { useState, useEffect } from "react";
import {
  View as Box,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import RadioOptions from "../../components/CreatePorfolio/RadioOptions";
import {
  CustomInput,
  CustomText,
  CustomButton,
  View,
} from "../../components/Themed";
import Colors from "../../constants/Colors";
import { Liostore } from "../../constants/Store";
import { useTheme } from "../../context/ThemeProvider";
import { shallow } from "zustand/shallow";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useAlert } from "../../context/AlertProvider";
import CheckNickName from "../../apis/CheckNickName";

const Page = () => {
  const { imageBlob, setPortfolioInformation, portfolioInformation } = Liostore(
    (state: any) => ({
      imageBlob: state.imageBlob,
      setPortfolioInformation: state.setPortfolioInformation,
      portfolioInformation: state.portfolioInformation,
    }),
    shallow
  );

  const [inputs, setInputs] = useState({
    name: portfolioInformation.name,
    nickname: portfolioInformation.nickname,
    description: portfolioInformation.description,
    technologyStack: portfolioInformation.technologyStack,
    category: portfolioInformation.category,
    url: portfolioInformation.url,
    tags: "",
    status: portfolioInformation.status,
    challenges: portfolioInformation.challenges,
    overcome: portfolioInformation.overcome,
  });

  const { color, isDarkMode } = useTheme();
  const { showAlert } = useAlert();

  const handleInputChange = (field: string, value: string) => {
    setPortfolioInformation((prevPortfolioInfo: any) => ({
      ...prevPortfolioInfo,
      [field]: value,
    }));
    setInputs((prevInputs) => ({
      ...prevInputs,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !inputs.name ||
      !inputs.description ||
      !inputs.technologyStack ||
      !inputs.category ||
      !inputs.status
    ) {
      showAlert(
        "Name, description, technology stack, category, status are important"
      );
    } else {
      setPortfolioInformation(inputs);
      router.push("/updateproject/previewportfolio");
    }
  };

  const AddName = async (event: string) => {
    handleInputChange("name", event);
    checkAndSetNickName(event);
  };

  const checkAndSetNickName = async (inputNickname: string) => {
    let newNickName = inputNickname.trim().toLowerCase().replace(/\s+/g, "-");
    let count = 1;

    setInputs((prevInputs) => ({
      ...prevInputs,
      nickname: newNickName.toLowerCase(),
    }));

    while (true) {
      const result = await CheckNickName(newNickName);

      if (!result) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          nickname: newNickName.toLowerCase(),
        }));
        break;
      }

      newNickName = `${inputNickname
        .toLowerCase()
        .replace(/\s+/g, "-")}-${count}`;
      count++;
    }
  };

  const handleStatusChange = (value: string) => {
    handleInputChange("status", value);
  };

  useEffect(() => {}, [portfolioInformation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ gap: 20 }}>
        <Box>
          <CustomText variant="semibold" style={{ fontSize: 20 }}>
            Tell Us About This Project
          </CustomText>
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>Name of project</CustomText>
          <CustomInput
            placeholder={"name"}
            value={inputs.name}
            onChangeText={AddName}
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>
            Possible Nickname: it must match the name of the project. If the one
            you add exists, it will be adjusted.
          </CustomText>
          <CustomInput
            placeholder={inputs.nickname || inputs.name.toLowerCase()}
            value={inputs.nickname}
            cap={false}
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>What's this awesome project about 😎😎?</CustomText>
          <CustomInput
            placeholder="Description"
            value={inputs.description}
            onChangeText={(text) => handleInputChange("description", text)}
            multiline
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>
            What technologies were used ?: separate with comma
          </CustomText>
          <CustomInput
            placeholder="Technology Stack"
            value={inputs.technologyStack}
            onChangeText={(text) => handleInputChange("technologyStack", text)}
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>Any link to this project ?</CustomText>
          <CustomInput
            placeholder="https://github.com/user"
            value={inputs.url}
            onChangeText={(text) => handleInputChange("url", text)}
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>
            What category does this project belong to 🌈🌈?: separate with comma
          </CustomText>
          <CustomInput
            placeholder="Web Development, Mobile..."
            value={inputs.category}
            onChangeText={(text) => handleInputChange("category", text)}
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>What is your progress 🐌🐌?</CustomText>
          <RadioOptions
            options={[
              { label: "To Do", value: "to do" },
              { label: "In Progress", value: "in progress" },
              { label: "Done", value: "done" },
            ]}
            selectedValue={inputs.status}
            onValueChange={(value) => handleInputChange("status", value)}
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>Any Challenges 😢😢?</CustomText>
          <CustomInput
            placeholder="I didn't have internet data"
            value={inputs.challenges}
            onChangeText={(text) => handleInputChange("challenges", text)}
          />
        </Box>

        <Box
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(225,225,225,0.04)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <CustomText>How did your overcome ✔✔?</CustomText>
          <CustomInput
            placeholder="I didn't have internet data"
            value={inputs.overcome}
            onChangeText={(text) => handleInputChange("overcome", text)}
          />
        </Box>

        <CustomText>Do you want to add more images or screenshots?</CustomText>
      </View>
      <CustomButton
        inverse={isDarkMode}
        style={{ backgroundColor: Colors[color].primary, width: "100%" }}
        text="Preview Portfolio"
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  inputContainer: {
    gap: 10,
    width: "100%",
    padding: 10,
    borderRadius: 5,
  },
});

export default Page;
