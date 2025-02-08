export async function DeleteProject(
  token: string | null,
  projectId: string | string[]
) {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_LIOSERVER; // Get the API URL from environment

    if (!apiUrl) {
      throw new Error("API URL not defined");
    }

    const response = await fetch(
      `${apiUrl}/deleteproject?user=${token}&projectId=${projectId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const responseData = await response.json(); // Parse the response body
    if (!response.ok) {
      throw new Error(`Failed to update user project: ${responseData}`);
    }

    return responseData;
  } catch (error) {
    throw error;
  }
}
