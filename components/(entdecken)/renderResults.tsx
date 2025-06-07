import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import ToggleSwitch from '../(general)/toggleSwich'
import Karteikarte from '../(karteimodul)/karteiKarte'

const RenderResults = ({modules, texts, selectedLanguage, selectedModules, myModules, updateModuleData, setSelectedModules, numColumns, searchBarText}) => {
  return (
    <View  className='flex-1 w-full pl-2 justify-center '>
            <FlatList
              data={modules.filter((item) =>
                item.name.toLowerCase().includes(searchBarText.toLowerCase())
              )}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center">
                      <Image
                        source={require("../../assets/noResults.png")}
                        style={{ width: 200, height: 200, borderRadius: 5 }}
                      />
                      <Text className="text-gray-300 font-bold text-[18px]">
                        {texts[selectedLanguage].noResults}
                      </Text>
                    </View>
              }
              renderItem={({ item, index }) => (
                <View className={`flex-1 mr-2 mb-2 justify-center ${selectedModules.includes(item.$id) || myModules?.some((mod) => mod.name == item.name + " (Kopie)") ? "" : "opacity-50"} 
                `}>
                  {myModules?.some((mod) => mod.name == item.name + " (Kopie)") && (
                    <View className="absolute w-full h-full z-10 rounded-b-[10px] rounded-t-[5px] overflow-hidden">
                      <View className={`absolute w-full h-full rounded-b-[10px]  ${item.synchronization  ? "bg-green-500" : "bg-black"} opacity-50`} 
                      style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                      />
                        <View className="flex-row items-center justify-center h-full p-1">
                        <Text className="text-white font-semibold text-[15px] mr-2">Synchronisation</Text>
                        <ToggleSwitch
                          isOn={item.synchronization}
                          onToggle={async() => {await updateModuleData(item.$id, {synchronization: !item.synchronization})}}
                        />
                      </View>
                    </View>
                  )}
                  
                  <Karteikarte
                    handlePress={()=> {
                      if (selectedModules.includes(item.$id)){
                          setSelectedModules(selectedModules.filter((module) => module !== item.$id))
                      } else {  
                          setSelectedModules([...selectedModules, item.$id])
                      }
                    }}
                    farbe={item.color}
                    percentage={null}
                    titel={item.name}
                    studiengang={item.description}
                    fragenAnzahl={item.questions}
                    notizAnzahl={item.notes}
                    creator={item.creator}
                    icon={"clock"}
                    publicM={item.public}
                  />
                </View>
              )}
              keyExtractor={(item) => item.$id}
              key={numColumns}
              numColumns={numColumns}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
  )
}

export default RenderResults