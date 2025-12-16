import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { downloadImageFromBackend } from '@/lib/appwriteDatabses';
import { documentConfig } from '@/types/appwriteTypes';
import DeleteImage from './deleteImage';
import UploadImage from './uploadImage';
import { getImageConfigsFromMMKV } from '@/lib/mmkvFunctions';
import { getAllImageConfigs } from '@/lib/appwriteQuerys';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useTranslation } from 'react-i18next';

const DisplayAllImage = ({
  selectedImageUri,
  setSelectedImageUri,
}: {
  selectedImageUri: string | null;
  setSelectedImageUri: (id: string | null) => void; // Updated to accept only the Question ID
}) => {
  const {user} = useGlobalContext()
  const {t} = useTranslation()
  const [loading, setLoading] = React.useState(false);
  const [localUris, setLocalUris] = React.useState<Record<string, string>>({});
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const [imageConfigs, setImageConfigs] = React.useState<documentConfig[]>(getImageConfigsFromMMKV());
  const [limitAmoutTo, setLimitAmoutTo] = React.useState<number>(10);
  async function getConfigs(){
    const configs = (await getAllImageConfigs(user.$id)).reverse();
    setImageConfigs(configs as any as documentConfig[]);
  }
  
  

  useEffect(() => {
    getConfigs();
  } ,[]);


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
        setLocalUris((prev) => ({ ...prev, [imageId]: localFilePath }));
        return;
      }

      const remoteUrl = await downloadImageFromBackend({ imageId });
      const localPath = await saveImageLocally({ remoteUrl, localFilePath });

      setLocalUris((prev) => ({ ...prev, [imageId]: localPath }));
    } catch (e) {
      console.log("Fehler beim Laden von Bild:", imageId, e);
    }
  };

  const getAllImages = async () => {
    setLoading(true);
    for (const config of imageConfigs) {
      if (localUris[config.databucketID]) continue;
      await loadImage({ imageId: config.databucketID });
    }
    if (selectedImageUri) {
      const index = imageConfigs.findIndex(config => config.databucketID === selectedImageUri);
      setSelectedIndex(index !== -1 ? index : 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllImages();
  }, [imageConfigs.length]);

  if (loading) {
    return (
      <View className="w-full items-center py-10">
        <Text className="text-gray-500 text-lg">
          {t("images.imagesLoading")}          
          </Text>
      </View>
    );  
  }

  return (
    <View className="w-full items-center justify-center p-4 bg-gray-900 rounded-lg mt-2">

      {/* MAIN PREVIEW IMAGE */}
      {imageConfigs[selectedIndex] && localUris[imageConfigs[selectedIndex].databucketID] && (
        <View
          style={{
            height: 200,
            width: '100%',
            borderRadius: 20,
            backgroundColor: '#fff',
            overflow: 'hidden',
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            marginBottom: 10,
          }}
        >
          <Image
            source={{ uri: localUris[imageConfigs[selectedIndex].databucketID] }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
      )}
      {/* IMAGE thumbnails grid */}
      <View className='flex-1 flex-row flex-wrap items-center justify-start'>
          {/* ADD BUTTON (IMAGE PICKER) */}
          { imageConfigs.length < 50 &&
          <UploadImage
            setImageUrl={setSelectedImageUri}
            imageConfigs={imageConfigs}
            setImageConfigs={setImageConfigs}
            />
          }
          
          {imageConfigs.slice(0,limitAmoutTo).map((config, index) => (
            <TouchableOpacity
              key={config.databucketID}
              onPress={() => {
                setSelectedIndex(index);
                setSelectedImageUri(config.databucketID); // Set only the Question ID
              }}
              style={{
                marginRight: 8,
                marginBottom: 8,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: selectedIndex === index ? 2 : 0,
                borderColor: selectedIndex === index ? '#3b82f6' : '#e5e7eb',
              }}
            >
              {localUris[config.databucketID] && (
                <Image
                  source={{ uri: localUris[config.databucketID] }}
                  style={{ 
                      width: selectedIndex !== index ? 50 : 45,
                      height: selectedIndex !== index ? 50 : 45,
                      borderRadius: 4
                    }}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          ))}
          {
            limitAmoutTo < imageConfigs.length &&
          <TouchableOpacity onPress={() => {
            if (limitAmoutTo >= imageConfigs.length) return;
            setLimitAmoutTo((prev) => prev + 10);
          }} className='ml-3 items-center justify-center overflow-hidden'>
            <Text className='text-gray-400'>
              {t("images.more")}
            </Text>
          </TouchableOpacity>
          }
      </View>
      <View className='w-full flex-row items-center justify-between'>
          <Text className='text-white font-medium'>
            {t("images.yourImages")}: {Object.keys(localUris).length}/50
          </Text>
          <DeleteImage
            imageId={imageConfigs[selectedIndex]?.databucketID}
            imageConfigs={imageConfigs}
            setImageConfigs={setImageConfigs}
            documentId={imageConfigs[selectedIndex]?.$id}
          />
        </View>
    </View>
  );
};

export default DisplayAllImage;
