import { View, Text, Image, ScrollView, Dimensions, Platform } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ContinueBox from '../(signUp)/(components)/continueBox';
import CarouselOptions from './carouselOptions';


const PageOptions = ({ userChoices, setUserChoices }) => {
  const { width } = Dimensions.get('window');

  const options = [
    {
      text: 'Erstellen wir zusammen ein Lernset.',
      colorBorder: '#7a5af8',
      colorBG: '#372292',
      iconName: 'bot',
      handlePress: () => setUserChoices('GENERATE'),
    },
    {
      text: 'Mal schauen was deine Komilitonen lernen.',
      colorBorder: '#20c1e1',
      colorBG: '#0d2d3a',
      iconName: 'search',
      handlePress: () => setUserChoices('DISCOVER'),
    },
    {
      text: 'Erstelle dein eigenes Lernset.',
      colorBorder: '#4f9c19',
      colorBG: '#2b5314',
      iconName: 'cubes',
      handlePress: () => setUserChoices('CREATE'),
    },
  ];

 

 
  return (
    <View className='flex-1 w-full items-center justify-center '>
      {/* Überschrift */}
      { width < 700 ?
      <View className='flex-1 w-full' >
      <View className="items-center justify-center "
      style={{
        marginTop: 50,}}
      >
        <View className="w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10">
          <Text className="font-semibold text-[15px] text-gray-100 text-center">
            Zeit durchzustarten
          </Text>
        </View>
        <View className="absolute  rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1" 
        style={{
          top: 65

        }}
        />
        <View className="rounded-full p-1 bg-gray-900 border-gray-800 border-[1px] mt-3" />
        <Image source={require('../../assets/Done.gif')} style={{ height: 150, width: 150 }} />
      </View>

      {/* Carousel */}
      {
          <View
          className='w-full items-center justify-center'
          >
            {
              options.map((item, index) => {
                return (
                  <View
                    key={index}
                    className='h-[100px] w-full'
                    >
                   
                    <ContinueBox
                      text={item.text}
                      colorBorder={item.colorBorder}
                      colorBG={item.colorBG}
                      iconName={item.iconName}
                      handlePress={item.handlePress}
                      horizontal={width > 700 ? false : true}
                      selected={true}
                    />
                  </View>
                );
              })
            }
          </View>
  }
      </View>
      :
        <View className='w-full flex-1 items-center justify-center'>
          <View className='items-center justiy-center'>
              <View className='w-full max-w-[300px] px-5 h-[75px] bg-gray-900 border-gray-800 border-[1px] rounded-[10px] items-center justify-center z-10'>
                  <Text className='font-semibold text-[15px] text-gray-100 text-center'>Zeit durchzustarten</Text>
              </View>
              <View className='absoloute top-[-9] rounded-full p-2 bg-gray-900 border-gray-800 border-[1px] ml-3 mb-1 '/>
              <View className='rounded-full p-1 bg-gray-900 border-gray-800 border-[1px]'/>
              <Image source={require('../../assets/Done.gif')}  style={{height:150, width:150}}/>
          </View>
          <View className="flex-row">
              <ContinueBox text={"Erstellen wir zusammen ein Lernset."} colorBorder={"#7a5af8"} colorBG={"#372292"} iconName={"bot"} handlePress={()=> setUserChoices("GENERATE")} selected={true}/>
              <ContinueBox text={"Mal schauen was deine Komilitonen lernen."} colorBorder={"#20c1e1"} colorBG={"#0d2d3a"} iconName={"search"} handlePress={()=> setUserChoices("DISCOVER")} selected={true}/>
              <ContinueBox text={"Erstelle dein eigenes Lernset."} colorBorder={"#4f9c19"} colorBG={"#2b5314"} iconName={"cubes"} handlePress={()=> setUserChoices("CREATE")} selected={true}/>
          </View>
        </View>
  }
    </View>
  );
};

export default PageOptions;