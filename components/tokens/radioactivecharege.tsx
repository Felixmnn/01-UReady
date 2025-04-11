import { View, Text, Image, Animated, Easing, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'

const RadioactiveCharege = () => {
  const glowAnim = useRef(new Animated.Value(5)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 15,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false
        }),
        Animated.timing(glowAnim, {
          toValue: 5,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false
        })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [glowAnim])

  // Stil für Web (boxShadow) und native (shadowRadius, elevation)
  const animatedStyle = {
    ...(Platform.OS === 'web'
      ? {
          boxShadow: glowAnim.interpolate({
            inputRange: [5, 50],
            outputRange: [
              '0 0 10px #ffdf6b',
              '0 0 50px #ffdf6b'
            ]
          })
        }
      : {
          shadowColor: '#ffdf6b',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: glowAnim,
          elevation: glowAnim
        })
  }

  return (
    <View className="items-center justify-center m-1" style={{ 
        position: 'relative',        
        height: 27,
        width: 37,
        }}>
    
      {/* Glow-Hintergrund */}
      <Animated.View
        style={[
          animatedStyle,
          {
            width: 32,
            height: 6,
            position: 'absolute',
            zIndex: 0
          }
        ]}
      />
      {/* Bild */}
      <Image
        source={require('../../assets/tokens/brennstab.png')}
        style={{ width: 37, height: 37, zIndex: 1 }}
        resizeMode="contain"
      />
    </View>
  )
}

export default RadioactiveCharege