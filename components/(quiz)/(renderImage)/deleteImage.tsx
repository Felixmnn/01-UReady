import { View, Text, TouchableOpacity } from 'react-native'
import React, { use } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { documentConfig } from '@/types/appwriteTypes';
import { getImageConfigsFromMMKV, removeImageConfigFromMMKV } from '@/lib/mmkvFunctions';
import * as Filesystem from 'expo-file-system';
import { deleteDocument, deleteFile, delteDocumentConfig } from '@/lib/appwriteDelete';
import { useTranslation } from 'react-i18next';

/**
 * This component lets a user delete a Image on the Backend and locally
 */
const DeleteImage = ({
  imageId,
  imageConfigs,
  setImageConfigs,
  documentId
}:{
  imageId: string;
  imageConfigs: documentConfig[];
  setImageConfigs: (configs: documentConfig[]) => void;
  documentId?: string;
}) => {
  const { t } = useTranslation();
  const handleDelete = async () => {
    try {
      removeImageConfigFromMMKV(imageId);
      console.log("Updated Image Configs after deletion:", getImageConfigsFromMMKV());
      setImageConfigs(getImageConfigsFromMMKV());
      const localFilePath = `${Filesystem.documentDirectory}${imageId}.jpg`;
      const fileInfo = await Filesystem.getInfoAsync(localFilePath);
      if (fileInfo.exists) {
        await Filesystem.deleteAsync(localFilePath);
      }
      await delteDocumentConfig(documentId)
      await deleteFile(imageId);
    } catch (err) {
      console.error("Delete error:", err);
    }}

  return (
    <TouchableOpacity className='flex-row justify-center items-center  px-2  py-1 bg-red-600 rounded-full'
      onPress={handleDelete}
    >
      <Text className='text-white font-medium'>
        {t("images.deleteImage")}
      </Text>
      <Icon name='trash' size={16} color='#fff' className='ml-2'/>
    </TouchableOpacity>
  )
}

export default DeleteImage