import { View, Animated } from 'react-native'
import React, { useEffect } from 'react'
import { withDecay } from 'react-native-reanimated';

const SkeletonListProfile = () => {
    const SkeletonItem = ({width, height}) => {
          const opacity = new Animated.Value(0.3);
        
          useEffect(() => {
            Animated.loop(
              Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
              ])
            ).start();
          }, []);
        
          return (
            <Animated.View
                
              style={{
                backgroundColor: "#e0e0e0",
                height: height ? height : 80,
                width: width ? width : "100%",
                marginVertical: 8,
                borderRadius: width ? "100%" : 10,
                opacity,
              }}
            />
          );
        };
  return (
    <View className='flex-1'>
        <SkeletonItem />
        <View className='items-center'>
            <SkeletonItem width={80}/>
        </View>
        <SkeletonItem height={120}/>
        <SkeletonItem height={120}/>
        <SkeletonItem height={120}/>
        <SkeletonItem height={120}/>
        <SkeletonItem height={120}/>


    </View>
  )
}

export default SkeletonListProfile