import { View, Text, Modal, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, {useEffect, useState} from 'react'
import Video from "react-native-video";


const ModalVideoAdd = ({isVisible, setIsVisible, onComplete, duration=30}) => {
  const [claimReward, setClaimReward] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [ videoStarted, setVideoStarted] = useState(false);
  const { width, height } = useWindowDimensions(); // Bildschirmbreite holen
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => videoStarted ? prev - 1 : prev);
    }, 1000);

    return () => clearInterval(interval); 
  }, [timeLeft, videoStarted]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
        <View className="bg-gray-800 rounded-lg p-4 w-11/12  "
          style={{ height: width* 0.6, maxHeight:"90%" }} 
        >
          <View style={{width: '100%', height: 6, backgroundColor: '#4B5563', borderRadius: 3, alignContent: 'center', alignItems: 'start'}}>
            <View style={{ height: 6, width: `${Math.floor((timeLeft / duration) * 100)}%`, borderRadius: 3, backgroundColor: "green"}}/>
          </View>
          
          <View className='flex-1 item-center justify-center'
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}
          >
            <Video
              source={{ uri: 'https://www.example.com/video.mp4' }} // Ersetze dies durch die tatsächliche Video-URL
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              paused={!videoStarted}
              onEnd={() => {
                setTimeLeft(0);
                setVideoStarted(false);
              }}
            />
          </View>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-2 items-center"
            onPress={() => {
              if (timeLeft <= 0) {
                onComplete();
                setTimeLeft(duration);
                setVideoStarted(false);
                setIsVisible(false);
              } else {
                setVideoStarted(true);
              }
            }}
          >
            <Text className="text-white font-semibold">{timeLeft == 0 ? "Claim Reward" : timeLeft == duration ?  "Watch Video" : `${timeLeft} Seconds Remaining`}</Text>
          </TouchableOpacity>
          {/*
          <TouchableOpacity
            className="mt-4 bg-gray-300 rounded-lg p-2 items-center"
            onPress={() => {setIsVisible(false); setTimeLeft(duration); setVideoStarted(false);}}
          >
            <Text className="text-gray-800 font-semibold">Close</Text>
          </TouchableOpacity>
          */}
        </View>
      </View>
    </Modal>
  )
}

export default ModalVideoAdd