import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from "react-native-snap-carousel"


const { width } = Dimensions.get('window');

const slides = [
  { title: 'Folie 1', color: 'bg-red-500' },
  { title: 'Folie 2', color: 'bg-green-500' },
  { title: 'Folie 3', color: 'bg-blue-500' },
  { title: 'Folie 4', color: 'bg-yellow-500' },
];

const SlideShowPremium = () => {
    const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const slideInterval = useRef(null);

  // Automatisches Wechseln der Folien
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Alle 3 Sekunden

    return () => clearInterval(slideInterval.current); // Aufräumen bei Unmount
  }, []);

  // Funktion für das manuelle Sliden
  const handleSnapToItem = (index) => {
    setActiveIndex(index);
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, 3000); // Neu starten der Automatik
    }
  };
  return (
    <View className="flex-1 items-center justify-center">
      <Carousel
        data={slides}
        renderItem={({ item }) => (
          <View
            className={`w-[${width}px] h-[300px] rounded-lg justify-center items-center ${item.color}`}
          >
            <Text className="text-white text-xl">{item.title}</Text>
          </View>
        )}
        sliderWidth={width}
        itemWidth={width}
        onSnapToItem={handleSnapToItem}
        activeSlideAlignment="center"
        inactiveSlideScale={1}
        autoplay={false} 
        autoplayInterval={3000}
        loop
        ref={carouselRef}
        firstItem={activeIndex}
      />

      <TouchableOpacity
        className="mt-4 bg-blue-500 p-3 rounded-full"
        onPress={() => setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)}
      >
        <Text className="text-white text-lg">Nächste Folie</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SlideShowPremium