import React, { useState } from "react";
import { View, Pressable, ActivityIndicator, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { uploadImageToAppwrite } from "@/lib/appwriteDatabses";

/**
 * UploadImage Component mit Appwrite Funktion
 */

const UploadImage = ({
  setImageUrl,
}: {
  setImageUrl: (url: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleUpload = async () => {
    try {
      setLoading(true);

      // Berechtigungen
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;

      // Image Picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      // Bild komprimieren + JPG
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1500 } }], // optional: Größe anpassen
        {
          compress: 0.5, // 50% Qualität
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setLocalPreview(manipulated.uri);

      // Upload via Appwrite Funktion
      const url = await uploadImageToAppwrite(manipulated.uri);

      // URL an Parent
      setImageUrl(url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleUpload}
      className="w-[90px] h-[90px] rounded-2xl border-2 border-gray-300 items-center justify-center overflow-hidden"
    >
      {loading ? (
        <ActivityIndicator />
      ) : localPreview ? (
        <Image source={{ uri: localPreview }} className="w-full h-full" />
      ) : (
        <View className="w-10 h-10 items-center justify-center">
          <View className="absolute w-10 h-1.5 bg-gray-500 rounded" />
          <View className="absolute w-1.5 h-10 bg-gray-500 rounded" />
        </View>
      )}
    </Pressable>
  );
};

export default UploadImage;
