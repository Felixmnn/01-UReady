import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

const BotCenter = ({message="", imageSource="Waving", spechBubbleStyle, spBCStyle}) => {
    const TypewriterText = ({ text, speed = 50 }) => {
          const [displayedText, setDisplayedText] = useState('');
        
          useEffect(() => {
            let index = 0;
            let isCancelled = false;
        
            const typeNext = () => {
              if (index < text.length-1) { 
                setDisplayedText((prev) => prev + text[index]);
                index++;
                setTimeout(typeNext, speed);
              }
            };
        
            setDisplayedText(''); // Reset text when `text` prop changes
            typeNext();
        
            return () => {
              isCancelled = true;
            };
          }, [text]);
        
          return <Text style={{color: 'white', fontSize: 18}}>{displayedText}</Text>;
        };
    
    const imageSources = {
        'Waving': require('../../assets/Waving.gif'),
        'Frage':require('../../assets/Frage.gif'),
        'Language': require('../../assets/Language.gif'),
        'Location': require('../../assets/Location.gif'),
        'Search': require('../../assets/Search.gif'),
        'Done': require('../../assets/Done.gif'),
    }

  return (
    <View className='items-center justiy-center'>
                    
                        <View
                                      className="bg-blue-500 p-4 rounded-lg shadow-lg"
                                      style={{
                                        maxWidth: 300,
                                        minWidth: 200,
                                        borderRadius: 15,
                                        position: 'relative',
                                        right: 20,
                                        bottom: 10,
                                      }}
                                    >
                                        <TypewriterText text={message} speed={40} />
                                      <View
                                        style={{
                                          position: 'absolute',
                                          bottom: -10,
                                          left: '50%',
                                          width: 0,
                                          height: 0,
                                          borderLeftWidth: 10,
                                          borderRightWidth: 10,
                                          borderTopWidth: 10,
                                          borderLeftColor: 'transparent',
                                          borderRightColor: 'transparent',
                                          borderTopColor: '#3B82F6',
                                        }}
                                      />
                                      </View>
                        <Image source={imageSources[imageSource]}  style={{height:150, width:150}}/>
                </View>
  )
}

export default BotCenter