import { View, Text } from 'react-native'
import React from 'react'
import CustomBottomSheet from '../(bibliothek)/(bottomSheets)/customBottomSheet'
import { useTranslation } from 'react-i18next'

const ExplanationSheet = ({
    sheetRef,
    explaination,
    typeHint
}:{
    sheetRef: React.RefObject<any>,
    explaination: string,
    typeHint: boolean
}) => {
    const { t } = useTranslation();

  return (
    <CustomBottomSheet ref={sheetRef}>
        <View className="p-4 bg-gray-900 min-h-[200px] rounded-2xl">
            <Text className="text-white text-lg font-bold mb-2">{
                typeHint ? t("quiz.hint") : t("quizNavigation.explanation")        }</Text>
            <Text className="text-gray-300">{explaination}</Text>
        </View>
    </CustomBottomSheet>
  )
}

export default ExplanationSheet