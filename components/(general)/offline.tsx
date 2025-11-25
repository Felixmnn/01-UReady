import { View, Text, Image } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';

const Offline = () => {
   const { t } = useTranslation();
  return (
    <View className='flex-1 p-4'>
      <Image source={require("../../assets/Uncertain.gif")} style={{height: 100, width: 100, alignSelf: 'center', marginBottom: 12}} />
      <Text className='text-white text-center font-medium'>
        {t("info.thisOnlyWorksIfYouAreOnline")}
      </Text>
    </View>
  )
}

export default Offline