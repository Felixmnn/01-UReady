import { View, Animated, Dimensions } from 'react-native'
import React, { useEffect } from 'react'

const SkeletonListShop = () => {
    const { width } = Dimensions.get('window');
    const SkeletonItem = ({height=50, width=50, padding=0, margingRight=0}) => {
          const opacity = new Animated.Value(0.3);
         
          useEffect(() => {
          const animation = Animated.loop(
            Animated.sequence([
              Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
          );

          animation.start();

          return () => {
            animation.stop(); // <— Wichtig! Stoppt den Leak
          };
        }, []);
        
          return (
            <Animated.View
              style={{
                backgroundColor: "#e0e0e0",
                height: height,
                width: width,
                marginVertical: 8,
                borderRadius: 10,
                padding: padding,
                marginRight: margingRight,
                opacity,
              }}
            />
          );
        };
        const ShopItem = () => {
            return (
               <View>
                    <View className='w-full items-center'>
                    <SkeletonItem width={150} height={20}/>
                    </View>
                    <View className='flex-row'>
                        {
                        [1,2,3].map((item, index) => (
                            <SkeletonItem key={index} height={120} width={width/3 - 10} margingRight={10}/>
                        ))}
                    </View>
               </View> 
            )
        }
  return (
    <View className='justify-start items-start w-full flex-1 p-3'>
        {
            [1,2,3,4].map((item, index) => (
                <View key={index} className='w-full mb-5'>
                    <ShopItem />
                </View>
            ))
        }
    </View>
  )
}

export default SkeletonListShop