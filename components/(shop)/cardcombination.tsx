import { View, Text, Image } from 'react-native'
import React from 'react'
import Card from './card'
import images from '@/assets/shopItems/itemConfig'

const Cardcombination = ({cards,title="Title",userUsage=null,purcharses=[], amountVideos="0/0", amountQuestionarys="0/0", commercialsAvailable=[]}) => {
    const imageSource = {
    "1CHARGE": images.charge,
    "3CHARGE": images.charge3,
    "10CHARGE": images.charge10,
    "100CHIPS": images.chips,
    "550CHIPS": images.chips2,
    "1200CHIPS": images.chip3, 
    "SUPERCHARGE": images.supercharge,
    "SUPERBUNDLE": images.questionary,
    "CHARGEBUNDLE": images.bundle2,
    "VIDEO": images.video,
    "QUESTIONARY": images.bundle1,
  }

  console.log("userUsage", cards);
  console.log("CommercialsAvailable", commercialsAvailable);
  return (
    <View className='w-full items-center justify-center'>
        <View className="relative w-full h-[60px] mt-1 items-center justify-center">
            <Image source={images.head} style={{
              width: 350,
              resizeMode: 'contain',
              marginTop: 5,
            }} />
            <Text className="absolute text-white text-2xl font-bold pt-2"
              style={{
                color: "#bc8e00",
              }}
            >{title}</Text>
        </View>
        <View className='flex-row '>
            {
            cards?.map((item, index) => (
                <Card key={index} 
                    currency={item.currency} 
                    price={item.price}
                    backgroundColor={item.backgroundColor}
                    textbackgroundColor={item.textbackgroundColor}
                    borderColor={item.borderColor}
                    textColor={item.textColor}
                    width={item.tags?.includes("1/2") ? 170 : item.tags?.includes("2/3") ? 220 : 110}
                    title={item.title}
                    imageSource={item.imageSource ? imageSource[item.imageSource] : null}
                    isAvailable={item.isAvailable}
                    userUsage={userUsage}
                    kathegory={item.kathegory}
                    purchaseLimit={item.purchaseLimit}
                    purchases={purcharses}
                    id={item.$id}
                    amount={item.amount ? item.amount : 0}
                    image={item.imageSource ? item.imageSource : null}
                    amountVideos={amountVideos}
                    amountQuestionarys={amountQuestionarys}
                    commercialsAvailable={commercialsAvailable}

                    
                    />
            ))
            }
        </View>
    </View>
  )
}

export default Cardcombination