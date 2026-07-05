import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { documentConfig } from '@/types/appwriteTypes';
import { getImageConfigsFromMMKV, removeImageConfigFromMMKV } from '@/lib/mmkvFunctions';
import { File, Paths } from 'expo-file-system';
import { deleteFile, deleteDocumentConfig } from '@/lib/appwriteDelete';
import { useTranslation } from 'react-i18next';

/**
 * This component lets a user delete a Image on the Backend and locally
 */
const DeleteImage = ({
  imageId,
  setImageConfigs,
  documentId
}:{
  imageId: string;
  setImageConfigs: (configs: documentConfig[]) => void;
  documentId?: string;
}) => {
  const { t } = useTranslation();
  const handleDelete = async () => {
    try {
      removeImageConfigFromMMKV(imageId);
      setImageConfigs(getImageConfigsFromMMKV());
      const localFile = new File(Paths.document, `${imageId}.jpg`);
      if (localFile.exists) {
        localFile.delete();
      }
      if (!documentId) return;
      await deleteDocumentConfig(documentId)
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