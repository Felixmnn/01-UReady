import { View, Text, Modal,TouchableOpacity } from 'react-native'
import React from 'react'

const ModalSelectSession = ({modalVisible, setModalVisible, selectedQuestion, selectedModule, changeSession}) => {
  return (
    <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
            >
                <TouchableOpacity className="absolute top-0 left-0 w-full h-full justify-center items-center " onPress={() => setModalVisible(false)}>
                    <View className='rounded-xl bg-gray-900 border-[1px] border-gray-800 p-3' style={{ minWidth: 400 }}>
                    <View className='justify-between flex-row'>
                        <Text className='text-white font-bold text-[15px]'>
                        Sitzung auswählen
                        </Text>
                    </View>
                    <View className='flex-row flex-wrap m-2'>
                        {
                            selectedModule.sessions.map((session, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={()=> changeSession(session)}
                                        className={`p-2 m-1 rounded-[10px] items-center justify-center border-gray-700 border-[1px] ${selectedQuestion.sessionID === session ? 'bg-blue-700' : 'bg-gray-800'}`}
                                        
                                    >
                                        <Text className='text-white font-bold text-[12px]'>
                                            {session}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                    </View>
                    <TouchableOpacity className=' items-center justify-center m-1  p-2 rounded-[10px] bg-gray-800 border-[1px] border-gray-600' onPress={() => setModalVisible(false)}>
                        <Text className='text-white font-bold text-[12px]'>
                        Ok
                        </Text>
                    </TouchableOpacity>
                    </View>
                </TouchableOpacity>

    </Modal>
  )
}

export default ModalSelectSession