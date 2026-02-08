import { View, Image, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { downloadImageFromBackend } from '@/lib/appwriteDatabses';
import { useTranslation } from 'react-i18next';


const DisplayImage = ({ imageId }: { imageId: string }) => {
  const {t} = useTranslation();
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** ------------------------------------
   *  1) Local: Prüfen ob schon vorhanden
   ------------------------------------ */

  const getLocalFilePath = () =>
    `${FileSystem.documentDirectory}${imageId}.jpg`;

  const checkIfExistsLocally = async (): Promise<boolean> => {
    const fileInfo = await FileSystem.getInfoAsync(getLocalFilePath());
    return fileInfo.exists;
  };


  /** ------------------------------------
   *  3) Speichern im Filesystem
   ------------------------------------ */
  const saveImageLocally = async (remoteUrl: string): Promise<string> => {
    const localPath = getLocalFilePath();
    const downloaded = await FileSystem.downloadAsync(remoteUrl, localPath);
    const info = await FileSystem.getInfoAsync(downloaded.uri);

    return downloaded.uri;
  };

  /** ------------------------------------
   *  4) Main Loader – alles zusammenführen
   ------------------------------------ */
  const loadImage = async () => {
    try {
      setLoading(true);
      // 1. Prüfen ob lokal gespeichert
      const exists = await checkIfExistsLocally();
      
      if (exists) {
        const uri = getLocalFilePath();

        setLocalUri(uri);
        return;
      }

      // 2. Wenn nicht vorhanden → von Backend laden
      const remoteUrl = await downloadImageFromBackend({
        imageId,
      });


      // 3. Lokal speichern
      const localPath = await saveImageLocally(remoteUrl);
      setLocalUri(localPath);
    } catch (e: any) {
      setError(e.message ?? t("images.loadingError"));
    } finally {
      setLoading(false);
    }
  };

  /** ------------------------------------
   *  5) useEffect beim Mount starten
   ------------------------------------ */
  useEffect(() => {
    loadImage();
  }, [imageId]);

  // Loading State
  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error State
  if (error || !localUri) {
    return (
      <View style={{ padding: 20 }}>
        <Text>
          {t("images.requireOnlineOnce")}
        </Text>
      </View>
    );
  }

  // Erfolg → Bild anzeigen
  return (
    <View className='w-full items-center justify-center p-2'>
      <Image
        source={{ uri: localUri }}
        style={{ width: "100%", height:200, borderRadius: 8 }}
      />
    </View>
  );
};

export default DisplayImage;
