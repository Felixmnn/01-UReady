import React, { useState, useEffect } from "react";
import { View, Pressable, ActivityIndicator, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { uploadImageToAppwrite } from "@/lib/appwriteDatabses";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useTranslation } from "react-i18next";

const UploadImage = ({ 
  setImageUrl,
  imageConfigs,
  setImageConfigs
 }:{
  setImageUrl: (url: string) => void;
  imageConfigs: any[];
  setImageConfigs: (configs: any[]) => void;
 }) => {
  const {isOffline} = useGlobalContext()
  const [loading, setLoading] = useState(false);
  const [selectedUri, setSelectedUri] = useState<string >("");
  const {t} = useTranslation();

  useEffect(() => {
    if (!selectedUri) return;
    (async () => {
      try {
        setLoading(true);
        // iOS kann HEIC liefern – manipulator konvertiert explizit zu JPEG
        const manipulated = await manipulateAsync(
          selectedUri,
          [],
          { format: SaveFormat.JPEG, compress: 0.5 }
        );

        const fileId = await uploadImageToAppwrite(manipulated.uri, imageConfigs, setImageConfigs);
        setImageUrl(fileId);

      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedUri]);

  const handleUpload = async () => {
    if (isOffline) {

      alert(t("info.goOnlineToUploadNewImages"));
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      // iOS: Konvertiert HEIC automatisch zu JPEG, reduziert Abstürze
      imageExportPreset: Platform.OS === "ios" 
        ? ImagePicker.ImageExportPreset.JPEG 
        : ImagePicker.ImageExportPreset.Automatic,
    });

    if (!result.canceled) {
      setSelectedUri(result.assets[0].uri);
    }
  };

  return (
    <Pressable
      onPress={handleUpload}
      className="w-[50px] h-[50px] mr-2 rounded-xl border-2 border-gray-300 items-center justify-center overflow-hidden"
      style={{
        width: 50,
        height: 50,
      }}
    >
      {loading ? (
        <ActivityIndicator />
      ) : 
        <View className="w-10 h-10 items-center justify-center">
          <View className="absolute w-10 h-1.5 bg-gray-500 rounded" />
          <View className="absolute w-1.5 h-10 bg-gray-500 rounded" />
        </View>
      }
    </Pressable>
  );
};

export default UploadImage;
