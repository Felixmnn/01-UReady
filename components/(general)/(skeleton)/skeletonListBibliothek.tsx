import { FlatList,Animated, Dimensions, View } from 'react-native'
import React, { useEffect } from 'react'

const SkeletonListBibliothek = () => {
    const { width } = Dimensions.get('window');
    const SkeletonItem = ({height=50, width=50, padding=0, margingRight=0}) => {
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
  return (
    <View className='w-full items-center'>
        <SkeletonItem width={width - 20} height={30} padding={10} />
        <SkeletonItem width={width} height={5} />
        {
            [1,2,3,4,5].map((item, index) => (
                <SkeletonItem key={index} height={150} width={width - 20} />
            ))
        }
    </View>
  )
}

export default SkeletonListBibliothek

