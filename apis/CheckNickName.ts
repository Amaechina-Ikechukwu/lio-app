import Constants from "expo-constants";

// Replace 'YOUR_BEARER_TOKEN' with your actual bearer token
const BEARER_TOKEN = "YOUR_BEARER_TOKEN";
const API_URL = "https://lio-uec9.onrender.com/userid";

const CheckNickName = async (nickname: string | null) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_LIOSERVER}/searchproject?search=${nickname}`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.projectData) {
        return true;
      } else {
        return;
      }
    } else {
      const status = response.status;
      const responseText = await response.text();
      throw new Error(
        `Network response was not ok. Status: ${status}. Response: ${responseText}`
      );
    }
  } catch (error: any) {
    return null;
  }
};

export default CheckNickName;
