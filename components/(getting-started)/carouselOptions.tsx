import { View, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ContinueBox from '../(signUp)/(components)/continueBox';




const CarouselOptions = ({options,width}) => {
    const ITEM_WIDTH = width * 0.6;
    const SPACER_WIDTH = (width - ITEM_WIDTH) / 2;
    const extendedOptions = [...options, ...options, ...options];
    const middleIndex = Math.floor(extendedOptions.length / 3);
    const scrollRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
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
  )
}

export default CarouselOptions