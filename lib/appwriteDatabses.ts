import { storage } from "./appwrite";
import * as FileSystem from "expo-file-system";
import { ID } from "appwrite";

export const downloadImageFromBackend = async ({
    imageId,
}:{
    imageId: string;
}): Promise<string> => {
    const response = await storage.getFileView("67dc11e000003ae76023", imageId);
    console.log("Download URL:", response.href);
    return response.href;
  };


export async function uploadImageToAppwrite(
  fileUri: string,
  bucketId: string = "67dc11e000003ae76023"
) {
  try {
    const fileId = ID.unique();

    // Größe der Datei ermitteln
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    const file = {
      uri: fileUri,
      name: `${fileId}.jpg`,
      type: "image/jpeg",
      size: fileInfo.exists && "size" in fileInfo && typeof fileInfo.size === "number" ? fileInfo.size : 0,
    };

    await storage.createFile(bucketId, "unique()", file);

    const view = storage.getFileView(bucketId, fileId);
    return view.href;
  } catch (err) {
    console.error("Appwrite Upload Error:", err);
    throw err;
  }
}