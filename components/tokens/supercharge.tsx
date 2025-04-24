//// filepath: c:\Users\felix\Data-Felix\01-Privat\05-Weiterbildung\06-React\2025\01-UReady\components\tokens\supercharge.tsx
import { View, Animated, Easing, Platform } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Svg, { Path } from 'react-native-svg'

const Supercharge = () => {
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

  // Falls du unter iOS/Android bleiben willst, verwende shadowRadius/elevation
  // Für Web baust du aus glowAnim eine "boxShadow"-Angabe
  const animatedStyle = {
    // Nur für Web: Box-Shadow-Effekt
    ...(Platform.OS === 'web'
      ? {
          boxShadow: glowAnim.interpolate({
            inputRange: [5, 15],
            outputRange: [
              '0 0 10px #ffdf6b',
              '0 0 30px #ffdf6b'
            ]
          })
        }
      : {
          // iOS/Android
          shadowColor: '#ffdf6b',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: glowAnim,
          elevation: glowAnim
        })
  }

  return (
    <View className="relative items-center justify-center m-1 "
    style={{
        height: 27,
        width: 37,
    }}
    >
      <Animated.View
        className="absolute  z-0"
        style={[
          {
            top: 35,
            left: 4,
          },
          animatedStyle
        ]}
      />
      <View>
        <Svg width={50} height={40} viewBox="0 0 300 150">
            <Path fill="#fff" d="M 73.105469 39.902344 L 125.011719 39.902344 L 134.808594 57.261719 L 132.46875 58.300781 L 96.519531 74.25 L 98.640625 76.308594 C 98.773438 76.5625 98.953125 76.796875 99.171875 76.996094 L 102.011719 79.582031 L 139.84375 116.273438 L 73.105469 116.273438 C 69.59375 116.273438 66.972656 114.460938 66.972656 112.839844 L 66.972656 43.339844 C 66.972656 41.714844 69.59375 39.902344 73.105469 39.902344 Z M 73.105469 39.902344 " />
            <Path fill="#fff" d="M 105.523438 75.851562 L 180.339844 148.421875 L 139.410156 84.492188 C 139.015625 83.824219 138.941406 83.019531 139.214844 82.296875 C 139.484375 81.570312 140.066406 81.007812 140.800781 80.765625 L 174.292969 69.585938 L 109.183594 1.433594 L 140.792969 57.449219 C 141.34375 58.730469 140.757812 60.214844 139.480469 60.785156 Z M 105.523438 75.851562 " />
            <Path fill="#fff" d="M 145.542969 84.574219 L 179.863281 73.121094 C 179.863281 73.121094 179.867188 73.117188 179.867188 73.117188 L 183.570312 71.882812 L 181.34375 69.550781 C 181.21875 69.308594 181.054688 69.078125 180.855469 68.878906 L 177.949219 66 L 153.015625 39.902344 L 204.375 39.902344 C 207.882812 39.902344 210.503906 41.714844 210.503906 43.339844 L 210.503906 112.839844 C 210.503906 114.460938 207.882812 116.273438 204.375 116.273438 L 165.839844 116.273438 Z M 145.542969 84.574219 " />
            <Path fill="#fff" d="M 215.632812 63.859375 L 215.632812 92.316406 L 226.457031 92.316406 C 229.917969 92.316406 232.726562 89.519531 232.726562 86.066406 L 232.726562 70.109375 C 232.726562 66.65625 229.917969 63.859375 226.457031 63.859375 Z M 215.632812 63.859375 " />
        </Svg>
      </View>
    </View>
  )
}

export default Supercharge