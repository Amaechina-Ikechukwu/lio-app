const API_URL = process.env.EXPO_PUBLIC_LIOSERVER + "/userprofile";

const GetUserProfileInformation = async (token: string | null) => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
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

export default GetUserProfileInformation;
