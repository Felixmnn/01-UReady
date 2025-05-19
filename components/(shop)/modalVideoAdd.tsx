import { View, Modal, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useRef, useState, useCallback } from 'react'
import YoutubePlayer from 'react-native-youtube-iframe'

const extractVideoId = (url) => {
  const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}
const {height, width} = Dimensions.get('window')

const ModalVideoAdd = ({ isVisible, setIsVisible, url, duration, award }) => {
  const [playedSeconds, setPlayedSeconds] = useState(0)
  const playerRef = useRef(null)

  const onProgress = useCallback((e) => {
    setPlayedSeconds(e)
    if (e >= duration) {
      award()
      setIsVisible(false)
    }
  }, [duration])

  const videoId = extractVideoId(url)

  if (!videoId) return null

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <YoutubePlayer
            ref={playerRef}
            height={height * 0.5}
            play={true}
            videoId={videoId}
            onChangeState={(state) => {
              if (state === 'ended') {
                award()
                setIsVisible(false)
              }
            }}
            onProgress={onProgress}
          />
          <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
            <Text style={{ color: 'white' }}>Claim Reward</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '70%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: 'center'
  }
})

export default ModalVideoAdd
