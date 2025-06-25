import { FlatList,Animated, Dimensions, View,ScrollView } from 'react-native'
import React, { useEffect } from 'react'

const SkeletonListProfile = () => {
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
  return (
    <ScrollView >
        <SkeletonItem width={width > 800 ? width - 120 : width - 20} height={400} padding={10} />
        <SkeletonItem width={width > 800 ? width - 120 : width - 20} height={300} />
        <SkeletonItem width={width > 800 ? width - 120 : width - 20} height={300} />

    </ScrollView>
  )
}

export default SkeletonListProfile

