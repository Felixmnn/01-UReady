import { storage } from "./appwrite";

export const downloadImageFromBackend = async ({
    imageId,
}:{
    imageId: string;
}): Promise<string> => {
    const response = await storage.getFileView("67dc11e000003ae76023", imageId);
    console.log("Download URL:", response.href);
    return response.href;
  };