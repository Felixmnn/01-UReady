import React, { useState } from 'react'
import { View,TextInput } from 'react-native'
import Header from '@/components/(bibliothek)/(pages)/(createQuestion)/header';
import { useWindowDimensions } from 'react-native';
import Tabbar from '@/components/(tabs)/tabbar';
import { router } from 'expo-router';

const CreateNote = () => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const [ungespeichert, setUngespeichert] = useState(false)

    const loading = false
    return (
        <Tabbar content={()=> { return(
        
            <View className='flex-1'>
              {loading ? (

                null
            ) : (
        <View className='flex-1 items-center '>
            {isVertical ? <View className='rounded-t-[10px] h-[15px] w-[95%] bg-gray-900 bg-opacity-70  opacity-50'></View> : null }
            <View className='flex-1 w-full bg-gray-900 rounded-[10px] border-gray-700 border-[1px]'>
                <Header setSelected={()=> router.back()} ungespeichert={ungespeichert} moduleName={"Edit Note"}/>
                <View className=''>
                </View>
                <TextInput
                    className='flex-1 bg-gray-800 m-2 border-gray-700 border-[1px] rounded-[10px] p-2 text-white '
                    multiline={true}
                    style={{
                        scrollbarWidth: 'thin', // Dünne Scrollbar
                        scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
                      }}
                />
            </View>       
        </View>
        )
                }
                </View>
                
            )}} page={"Bibliothek"} hide={true} />
          )
    
}

export default CreateNote