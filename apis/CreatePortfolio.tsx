export async function PostPortfolio(userData: any, token: string | null) {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_LIOSERVER; // Get the API URL from environment

    if (!apiUrl) {
      throw new Error("API URL not defined");
    }

    const response = await fetch(apiUrl + "/createportfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const responseData = await response.json(); // Parse the response body
    if (!response.ok) {
      throw new Error(responseData.error);
    }

    return responseData;
  } catch (error) {
    throw error;
  }
}
