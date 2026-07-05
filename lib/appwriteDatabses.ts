import { storage } from "./appwrite";
import { File } from "expo-file-system";
import { ID, Permission, Role } from "react-native-appwrite";
import { addImageConfig } from "./appwriteAdd";
import {
  addImageConfigToMMKV,
  getSessionFromMMKV,
} from "./mmkvFunctions";
import { documentConfig } from "@/types/appwriteTypes";

const BUCKET_ID = "67dc11e000003ae76023";

export const downloadImageFromBackend = async ({
  imageId,
}: {
  imageId: string;
}): Promise<string> => {
  const downloadUrl = storage.getFileDownloadURL(BUCKET_ID, imageId);
  return downloadUrl.toString();
};

export async function uploadImageToAppwrite(
  fileUri: string,
  imageConfigs?: documentConfig[],
  setImageConfigs?: (configs: documentConfig[]) => void
) {
  try {
    const user = await getSessionFromMMKV();

    if (!user?.$id) {
      throw new Error("Kein Benutzer angemeldet.");
    }

    const fileId = ID.unique();

    // Neues Expo FileSystem
    const localFile = new File(fileUri);
    const info = localFile.info();

    if (!info.exists) {
      throw new Error("Datei existiert nicht.");
    }

    const file = {
      uri: fileUri,
      name: `${fileId}.jpg`,
      type: "image/jpeg",
      size: info.size ?? 0,
    };

    const uploadedFile = await storage.createFile(
      BUCKET_ID,
      fileId,
      file,
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );

    const config = await addImageConfig({
      databucketID: uploadedFile.$id,
      title: file.name,
      sessionID: "-",
      subjectID: "-",
      seitenanzahl: 1,
      fileType: "jpg",
      uploaded: true,
      creator: user.$id,
    } as unknown as documentConfig);

    if (config) {
      addImageConfigToMMKV(config as unknown as documentConfig);

      if (imageConfigs && setImageConfigs) {
        setImageConfigs([
          config as unknown as documentConfig,
          ...imageConfigs,
        ]);
      }
    }
    console.log("Image uploaded and config added:", uploadedFile.$id);
    return uploadedFile.$id;
  } catch (err) {
    console.error("Appwrite Upload Error:", err);
    throw err;
  }
}