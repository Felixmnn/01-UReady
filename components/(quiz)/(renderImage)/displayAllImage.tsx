import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { downloadImageFromBackend } from '@/lib/appwriteDatabses';
import { documentConfig } from '@/types/appwriteTypes';

const DisplayAllImage = ({
  imageConfigs,
  selectedImageUri,
  setSelectedImageUri,
}: {
  imageConfigs: documentConfig[];
  selectedImageUri: string | null;
  setSelectedImageUri: (uri: string | null) => void;
}) => {

  const [loading, setLoading] = React.useState(false);
  const [localUris, setLocalUris] = React.useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const checkIfExistsLocally = async ({
    localFilePath,
  }: {
    localFilePath: string;
  }) => {
    const fileInfo = await FileSystem.getInfoAsync(localFilePath);
    return fileInfo.exists;
  };

  const saveImageLocally = async ({ remoteUrl, localFilePath }: any) => {
    const downloaded = await FileSystem.downloadAsync(remoteUrl, localFilePath);
    return downloaded.uri;
  };

  const loadImage = async ({ imageId }: { imageId: string }) => {
    try {
      const localFilePath = `${FileSystem.documentDirectory}${imageId}.jpg`;

      const exists = await checkIfExistsLocally({ localFilePath });

      if (exists) {
        setLocalUris((prev) => [...prev, localFilePath]);
        return;
      }

      const remoteUrl = await downloadImageFromBackend({ imageId });
      const localPath = await saveImageLocally({ remoteUrl, localFilePath });

      setLocalUris((prev) => [...prev, localPath]);

    } catch (e) {
      console.log("Fehler beim Laden von Bild:", imageId, e);
    }
  };

  const getAllImages = async () => {
    setLoading(true);
    for (const config of imageConfigs) {
      if (localUris.some(uri => uri.includes(config.databucketID))) continue;
      await loadImage({ imageId: config.databucketID });
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllImages();
  }, []);

  if (loading) {
    return (
      <View className="w-full items-center py-10">
        <Text className="text-gray-500 text-lg">Bilder werden geladen…</Text>
      </View>
    );  
  }

  return (
    <View className="w-full items-center justify-center p-4">

      {/* MAIN PREVIEW IMAGE */}
      {localUris[selectedIndex] && (
        <View
          style={{
            width: 320,
            height: 320,
            borderRadius: 20,
            backgroundColor: '#fff',
            overflow: 'hidden',
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            marginBottom: 20,
          }}
        >
          <Image
            source={{ uri: localUris[selectedIndex] }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      )}
      <View className='w-full flex-row justify-between px-4'>
          <Text className='text-white font-medium'>
            Dein Bilder:
          </Text>
          <Text className='text-white font-medium'>
            {localUris.length}/50
          </Text>
        </View>
      {/* IMAGE thumbnails grid */}
      <View className="flex-row flex-wrap justify-center mt-2">

        {localUris.map((uri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedIndex(index);
              setSelectedImageUri(uri);
            }}
            style={{
              margin: 6,
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: selectedIndex === index ? 3 : 1,
              borderColor: selectedIndex === index ? '#3b82f6' : '#e5e7eb',
              elevation: selectedIndex === index ? 5 : 1,
              shadowColor: selectedIndex === index ? '#3b82f6' : '#000',
              shadowOpacity: selectedIndex === index ? 0.3 : 0.1,
              shadowRadius: selectedIndex === index ? 10 : 4,
            }}
          >
            <Image
              source={{ uri }}
              style={{ width: 95, height: 95, borderRadius: 12 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
        {/* ADD BUTTON (IMAGE PICKER) */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => console.log("Pick image")}
          style={{
            width: 95,
            height: 95,
            margin: 6,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: '#d1d5db',
            borderStyle: 'dashed',
            backgroundColor: '#2e2f31ff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 34, color: '#9ca3af' }}>+</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default DisplayAllImage;
