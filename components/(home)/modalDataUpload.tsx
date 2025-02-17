import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/FontAwesome5";



const ModalDataUpload = ({isVisible, setIsVisible}) => {
    {/*Modal welches die Dateiupload Optionen anzeigt*/}
    const DataType = ({ title, subTitle, iconName, handlePress}) => {
        return (
            <TouchableOpacity className='flex-row items-center' onPress={handlePress}>
                <View className='p-2 bg-gray-700 items-center justify-center rounded-full h-[35px] w-[35px] m-2'>
                    <Icon name={iconName} size={15} color="white"/>
                </View>
                <View>
                    <Text className='text-white font-semibold text-[15px]'>{title}</Text>
                    <Text className='text-white  text-[10px]'>{subTitle}</Text>
                </View>
            </TouchableOpacity>
        )
    }
  return (
    <View>
            {
                isVisible ? 
                <Modal 
                animationType="fade"
                transparent={true}
                visible={isVisible}
            >
                <TouchableOpacity className="absolute top-0 left-0 w-full h-full justify-center items-center" onPress={()=> setIsVisible(false) }>
                    <View className='p-4 bg-gray-800 border-gray-700 border-[1px] rounded-xl'>
                        <TouchableOpacity onPress={()=> setIsVisible(false)}>
                            <View className='flex-row flex-1 justify-between'>
                                <Text className='text-white font-bold mr-2'>Inhalt zum Chat hinzufügen</Text>
                                <Icon name="times" size={20} color="white"/>
                            </View>
                            <Text className='text-white text-[12px] font-semibold my-2'>Der Assisten unterstüzt Bilder, Dokumente und mehr</Text>
                            <DataType title={"Datei Auswählen"} subTitle={"Lade ein Dokument hoch oder benutze eine Datei aus einem Lernset"} iconName={"file"}/>
                            <DataType title={"Foto Auswählen"} subTitle={"Wähle eine Foto aus deiner Mediathek"} iconName={"camera"}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            
            </Modal>
    :
              null
            }
    </View>
  )
}

export default ModalDataUpload