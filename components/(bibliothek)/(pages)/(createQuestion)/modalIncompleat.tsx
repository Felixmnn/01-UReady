import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import  languages  from '@/assets/exapleData/languageTabs.json';
import { useGlobalContext } from '@/context/GlobalProvider';


const ModalIncompleat = ({modalVisible, setModalVisible, missingRequirements}) => {
    const { language } = useGlobalContext()
      const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
      const texts = languages.editQuestions;
      useEffect(() => {
        if(language) {
          setSelectedLanguage(language)
        }
      }, [language])
  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
    >
        <TouchableOpacity onPress={()=> setModalVisible(false)} className="absolute top-0 left-0 w-full h-full justify-center items-center " onPress={() => setModalVisible(false)}>
            <View className='rounded-xl bg-gray-900 border-[1px] border-gray-800 p-3' style={{ minWidth: 400 }}>
                <View>
                    <Text className='text-white font-bold text-[15px]'>
                    {texts[selectedLanguage].missingRequirements}:
                    </Text>
                    <View className='m-2'>
                        {missingRequirements.map((item, index) => {
                            return (
                                <Text key={index} className='text-white font-bold text-[15px] m-1'>
                                    {item}
                                </Text>
                            )
                        })}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
  )
}

export default ModalIncompleat