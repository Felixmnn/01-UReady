import { storage } from "./appwrite";
import * as FileSystem from "expo-file-system";
import { ID } from "appwrite";
import { addImageConfig } from "./appwriteAdd";
import { addImageConfigToMMKV, getSessionFromMMKV } from "./mmkvFunctions";
import { documentConfig } from "@/types/appwriteTypes";

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
  imageConfigs?: documentConfig[],
  setImageConfigs?: (configs: documentConfig[]) => void
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

    const user = await getSessionFromMMKV(); // Hole die aktuelle Benutzersession
    const res = await storage.createFile(
      "67dc11e000003ae76023", 
      "unique()", 
      file,
      [
        `delete("user:${user.$id}")` // Schreibberechtigung für den Benutzer
      ]
    );

    const view = storage.getFileView("67dc11e000003ae76023", fileId);
    const config = await addImageConfig({
      databucketID: res.$id,
      title: file.name,
      sessionID: "-",
      subjectID: "-",
      seitenanzahl: 1,
      fileType: "jpg",
      uploaded: true,
      creator: user ? user.$id : undefined,
    })
    console.log("✂️Coniffigging")
    if (config) {
      console.log("Image config added:", config);
      addImageConfigToMMKV(config as any as  documentConfig);
      if (imageConfigs && setImageConfigs) {
        console.log("Updating imageConfigs state");
        setImageConfigs([ config as any as documentConfig,...imageConfigs]);
      }
    }

    return fileId;
  } catch (err) {
    console.error("Appwrite Upload Error:", err);
    throw err;
  }
}