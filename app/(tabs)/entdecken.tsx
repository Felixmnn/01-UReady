import { View, Text, TouchableOpacity, Modal, TextInput ,Image, ActivityIndicator, FlatList} from 'react-native'
import React from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import { useState, useEffect } from 'react'
import Svg, { Circle } from "react-native-svg";
import VektorCircle from '@/components/(karteimodul)/vektorCircle';
import Icon from "react-native-vector-icons/FontAwesome5";
import { useWindowDimensions } from 'react-native';
import SwichTab from '@/components/(tabs)/swichTab';
import OptionSelector from '@/components/(tabs)/optionSelector';
import { loadUserDataKathegory } from '@/lib/appwriteDaten';
import { useGlobalContext } from '@/context/GlobalProvider';
import { addUserDatakathegory } from '@/lib/appwriteAdd';
import { ausbildungsListDeutschland, ausbildungsTypen, countryList, languages, LeibnizSubjects, schoolListDeutschland, universityListDeutschland } from '@/assets/exapleData/countryList';
import UniversityFilters from '@/components/(entdecken)/university';
import Karteikarte from '@/components/(karteimodul)/karteiKarte';

const entdecken = () => {
  
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
  const numColumns = Math.floor(width / 300);

  const tabWidth = width / 2; // Da es zwei Tabs gibt
  const longVertical = width > 900;
  const [ tab, setTab ] = useState(0)
  

  //Liste mit Filern
  const countrys = countryList
  const kathegorys = ["UNIVERSITY", "SCHOOL", "AUSBLIDUNG","OTHER"]

  //Allgemeine Filter
  const [ selctedCountry, setSelectedCountry] = useState(countryList[0])
  const [ selectedKathegory, setSelectedKathegory ] = useState("UNIVERSITY")

  //Module entdecken
  const [ loading, setLoading ] = useState(false)
  const [ modules, setModules ] = useState([])

  return (
      <Tabbar content={()=> { return(
        <View className='flex-1  w-full bg-[#0c111d] rounded-[10px] relative'>
          <View className={`flex-row p-4 justify-between items-center  h-[60px] rouned-[10px] `}>
            <Text className='font-bold text-3xl text-gray-100'>
              Entdecken
            </Text>
          </View>
          <View className='flex-row w-full items-center'>
            <View className='flex-1 h-[35px] bg-gray-800 rounded-[10px] ml-4 mr-2 mb-2 p-3 flex-row items-center justify-between'>
              <View className='flex-row'>
                <Icon name="search" size={18} color="white" />
                <TextInput  placeholder='Was möchtest du lernen?' 
                            className='ml-3' 
                            placeholderTextColor={"#797d83"} 
                            style={{
                              borderWidth: 0,
                            }}/>
              </View>
            </View>
            {longVertical ? null : <TouchableOpacity className='h-[35px] rounded-[10px] mr-4 p-2 mb-2 bg-gray-800 items-center justify-center'><Icon name="filter" size={15} color="white"/> </TouchableOpacity> }
          </View>
          <View className="w-full flex-1" style={{ flex: 1, position: "relative" }}>
  
            {/* UniversityFilters liegt ganz oben */}
            <View style={{ zIndex: 10, position: "relative" }}>
              <UniversityFilters
                setModules={setModules}
                setLoading={setLoading}
                country={countryList[0]}
              />
            </View>

            {/* Restlicher Inhalt liegt darunter */}
            <View
              className="flex-1 p-4"
              style={{ zIndex: 1, position: "relative" }}
            >
              {!loading ? (
                <View className='flex-1'>
                  {modules.length > 0 ? (
                    <View className='flex-1 w-full'>
                    <FlatList
                      data={modules}
                      renderItem={({ item,index }) => (
                        <View className='flex-1 mr-2  '>
                          <Karteikarte handlePress={()=> {}} farbe={item.color} percentage={null} titel={item.name} studiengang={item.subject} fragenAnzahl={item.questions} notizAnzahl={item.notes} creator={item.creator} availability={item.public} icon={"clock"} publicM={item.public} />
                        </View>
                      )}
                      keyExtractor={(item) => item.$id}
                      key={numColumns}
                      numColumns={numColumns}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                    />
                    </View>
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Image
                        source={require("../../assets/noResults.png")}
                        style={{ width: 200, height: 200, borderRadius: 5 }}
                      />
                      <Text className="text-gray-300 font-bold text-[18px]">
                        Keine Ergebnisse gefunden
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <ActivityIndicator size="small" color="#b2e0fe" />
                  <Text className="text-gray-300 font-bold text-[18px]">
                    Lade deine Module...
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      

    )}} page={"Entdecken"} />
  )
}

export default entdecken