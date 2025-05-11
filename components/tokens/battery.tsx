import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import Svg, { Rect,Path } from 'react-native-svg';


const Battery = ({charge}) => {
    const [ show, setShow ] = React.useState(null)
    useEffect(() => {
        const interval = setInterval(() => {
          if (charge < 5) {
            setShow((prev) => (prev === null ? charge + 1 : null)) 
          }
        }, 1000) 
    
        return () => clearInterval(interval) 
      }, [charge]) 

  return (
    <View className='items-center justify-center m-1 '
    style={{
        height: 27,
        width: 37,
    }}
    >
    <Svg width={40} height={20} viewBox="0 0 300 140">
        <Path fill={charge < 1 ? "#9c1f2d" : charge < 3 ? "#f57929" : "#6cb63d" } d="M 252.195312 128.210938 L 252.195312 22.011719 C 252.195312 14.484375 246.089844 8.371094 238.570312 8.371094 L 33.007812 8.371094 C 25.542969 8.371094 19.4375 14.484375 19.4375 22.011719 L 19.4375 128.210938 C 19.4375 135.683594 25.542969 141.851562 33.058594 141.851562 L 238.570312 141.851562 C 246.089844 141.851562 252.195312 135.683594 252.195312 128.210938 Z M 34.105469 127.113281 L 34.105469 23.054688 L 237.527344 23.054688 L 237.527344 127.113281 Z M 34.105469 127.113281 "  />
        <Path fill={charge < 1 ? "#9c1f2d" : charge < 3 ? "#f57929" : "#6cb63d" } d="M 270.777344 100.5625 C 276.105469 100.5625 280.4375 96.226562 280.4375 90.945312 L 280.4375 59.273438 C 280.4375 53.945312 276.105469 49.605469 270.777344 49.605469 L 261.121094 49.605469 L 261.121094 100.5625 Z M 270.777344 100.5625 "  />
        { charge > 0 || show == 1 ? <Path fill={charge < 1 ? "#9c1f2d" : charge < 3 ? "#f57929" : "#6cb63d" } d="M 73.359375 32.253906 L 73.359375 117.96875 L 44.753906 117.96875 L 44.753906 32.253906 Z M 73.359375 32.253906 "  />:null}
        { charge > 1 || show == 2 ? <Path fill={charge < 1 ? "#9c1f2d" : charge < 3 ? "#f57929" : "#6cb63d" } d="M 111.882812 32.253906 L 111.882812 117.96875 L 83.277344 117.96875 L 83.277344 32.253906 Z M 111.882812 32.253906 "  />:null}
        { charge > 2 || show == 3 ? <Path fill={charge < 1 ? "#9c1f2d" : charge < 3 ? "#f57929" : "#6cb63d" } d="M 150.457031 32.253906 L 150.457031 117.96875 L 121.851562 117.96875 L 121.851562 32.253906 Z M 150.457031 32.253906 " />:null}
        { charge > 3 || show == 4 ? <Path fill={charge < 1 ? "#9c1f2d" : charge < 3 ? "#f57929" : "#6cb63d" } d="M 188.980469 32.253906 L 188.980469 117.96875 L 160.375 117.96875 L 160.375 32.253906 Z M 188.980469 32.253906 "  />:null}
        { charge > 4 || show == 5 ? <Path fill={charge < 1 ? "#9c1f2d" : charge < 3 ? "#f57929" : "#6cb63d" } d="M 227.558594 32.253906 L 227.558594 117.96875 L 198.953125 117.96875 L 198.953125 32.253906 Z M 227.558594 32.253906 "  />:null}
    </Svg>
    </View>
  )
}

export default Battery

