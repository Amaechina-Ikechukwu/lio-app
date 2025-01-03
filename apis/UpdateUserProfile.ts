export async function UpdateUserProfile(userData: any, token: string | null) {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_LIOSERVER; // Get the API URL from environment
    if (!apiUrl) {
      throw new Error("API URL not defined");
    }

    const response = await fetch(apiUrl + "/updateuserprofile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}
