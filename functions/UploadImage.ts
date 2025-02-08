import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

export default async function UploadImage(
  path: string,
  file: Blob | Uint8Array | ArrayBuffer
): Promise<string> {
  const imageRef = ref(storage, path);

  try {
    await uploadBytes(imageRef, file);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(imageRef);

    // Log the download URL for debugging

    return downloadURL; // Return the download URL
  } catch (error: any) {
    throw new Error("Error uploading image:", error);
    // Return null to indicate an error
  }
}
