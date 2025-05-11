import { FlatList,Animated } from 'react-native'
import React, { useEffect } from 'react'

const SkeletonList = () => {
    const SkeletonItem = () => {
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
                height: 80,
                marginVertical: 8,
                borderRadius: 10,
                opacity,
              }}
            />
          );
        };
  return (
    <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={() => <SkeletonItem />}
            keyExtractor={(item) => item.toString()}
    />
  )
}

export default SkeletonList