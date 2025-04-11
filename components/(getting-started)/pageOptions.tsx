import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import ContinueBox from '../(signUp)/(components)/continueBox';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;
const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;

const PageOptions = ({ userChoices, setUserChoices }) => {
  const scrollRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const extendedOptions = [...options, ...options, ...options];
  const middleIndex = Math.floor(extendedOptions.length / 3);

  useEffect(() => {
    if (width > 700) return;
    scrollRef.current.scrollTo({ x: middleIndex * ITEM_WIDTH, animated: false });
    setCurrentIndex(middleIndex);
  }, []);

  const onScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  const onScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const totalWidth = ITEM_WIDTH * extendedOptions.length;

    if (offsetX <= 0 || offsetX >= totalWidth - width) {
      scrollRef.current.scrollTo({ x: totalWidth / 3, animated: false });
      setCurrentIndex(options.length);
    }
  };

  return (
    <View className='flex-1 w-full items-center justify-center '>
      {/* Überschrift */}
      { width < 700 ?
      <View className='flex-1'>
      <View className="items-center justify-center"
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
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        onScroll={onScroll}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        bounces={false}
      >
        <View style={{ width: SPACER_WIDTH }} />
        {extendedOptions.map((item, index) => {
          const isCenter = index === currentIndex;
          return (
            <View
              key={index}
              style={{
                width: ITEM_WIDTH,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ scale: isCenter ? 1.1 : 0.9 }],
                opacity: isCenter ? 1 : 0.5,
              }}
            >
              <ContinueBox
                text={item.text}
                colorBorder={item.colorBorder}
                colorBG={item.colorBG}
                iconName={item.iconName}
                handlePress={item.handlePress}
                selected={isCenter}
              />
            </View>
          );
        })}
        <View style={{ width: SPACER_WIDTH }} />
      </ScrollView>
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