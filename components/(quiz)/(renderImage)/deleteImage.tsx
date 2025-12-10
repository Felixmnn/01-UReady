import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { documentConfig } from '@/types/appwriteTypes';
import { getImageConfigsFromMMKV, removeImageConfigFromMMKV } from '@/lib/mmkvFunctions';
import * as Filesystem from 'expo-file-system';
import { deleteDocument, deleteFile, delteDocumentConfig } from '@/lib/appwriteDelete';

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
  const handleDelete = async () => {
    try {
      removeImageConfigFromMMKV(imageId);
      setImageConfigs(getImageConfigsFromMMKV().reverse());
      const localFilePath = `${Filesystem.documentDirectory}${imageId}.jpg`;
      const fileInfo = await Filesystem.getInfoAsync(localFilePath);
      console.log("Local file info:", fileInfo);
      if (fileInfo.exists) {
        await Filesystem.deleteAsync(localFilePath);
        console.log("Locally deleted:", localFilePath);
      }
      console.log("Document ID to delete:", documentId);
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
        Delete Image</Text>
      <Icon name='trash' size={16} color='#fff' className='ml-2'/>
    </TouchableOpacity>
  )
}

export default DeleteImage