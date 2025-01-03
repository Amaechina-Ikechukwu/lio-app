const API_URL = process.env.EXPO_PUBLIC_LIOSERVER;

const GetUserID = async (token: string | null) => {
  if (!API_URL) {
    throw new Error("API URL not defined");
  }
  try {
    const response = await fetch(API_URL + "/userid", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.userid) {
        return data.userid;
      } else {
        throw new Error("UID not found in response data");
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

export default GetUserID;
