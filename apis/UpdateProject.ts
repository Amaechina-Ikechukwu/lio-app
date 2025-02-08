export async function UpdateProject(
  userData: any,
  token: string | null,
  projectId: string
) {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_LIOSERVER; // Get the API URL from environment

    if (!apiUrl) {
      throw new Error("API URL not defined");
    }

    const response = await fetch(
      apiUrl + "/updateproject?projectId=" + projectId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );
    const responseData = await response.json(); // Parse the response body
    if (!response.ok) {
      throw new Error(`${responseData}`);
    }

    return responseData;
  } catch (error) {
    throw error;
  }
}
