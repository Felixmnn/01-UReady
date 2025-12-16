import React, { useState, useEffect } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useImageManipulator, SaveFormat } from "expo-image-manipulator";
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
  const [selectedUri, setSelectedUri] = useState<string >("null");
  const {t} = useTranslation();

  // Hook immer oben – bekommt aktuelle URI bei jedem Render
  const manipulator = useImageManipulator(selectedUri);

  useEffect(() => {
    if (!selectedUri) return;

    (async () => {
      try {
        setLoading(true);
        if (selectedUri === "null") return;
        // render ohne Parameter, weil Hook uri kennt
        const rendered = await manipulator.renderAsync();

        const manipulated = await rendered.saveAsync({
          format: SaveFormat.JPEG,
          compress: 0.5,
        });


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
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
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
