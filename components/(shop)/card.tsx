import { View, Text, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'   
import images from '@/assets/shopItems/itemConfig'
import ModalToExpensive from './modalToExpensive'
import ModalBudyNow from './modalBudyNow'
import { Animated } from 'react-native';
import ModalVideoAdd from './modalVideoAdd'
import { useGlobalContext } from '@/context/GlobalProvider'



const Card = ({
    currency="€",
    price=0,
    backgroundColor="#644f0b",
    textbackgroundColor="#373225",
    borderColor="#644f0b",
    textColor="#bc8e00",
    title="Chips",
    imageSource=images.chips,
    width=110,
    isAvailable=true,
    userUsage=null,
    kathegory="",
    purchaseLimit=100,
    purcharsesLeft=0,
    purchases=[],
    id="",
    amount=0
   

}) => {

    const { setUserUsage } = useGlobalContext();
    
    console.log("purcharses3", amount);
    function purchaseAmout() {
        

    const filtered = purchases.filter(p => p === id);
        console.log("filtered", filtered);
    return filtered.length;
}
    const bgColorAnim = useRef(new Animated.Value(0)).current;
    const interpolatedColor = bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [backgroundColor, '#D32F2F'], // z. B. Rot als Warnfarbe
    });
    const overlayOpacity = useRef(new Animated.Value(0)).current;


    const flashRed = () => {
    overlayOpacity.setValue(0); // Reset
    Animated.sequence([
        Animated.timing(overlayOpacity, {
        toValue: 0.3, // halbtransparentes Rot
        duration: 200,
        useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: false,
        }),
        Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
        }),
    ]).start();
    };

    function priceWithCommas(priceInCents) {
        const euros = (priceInCents / 100).toFixed(2); 
        const parts = euros.split('.');
        return `${parts[0]},${parts[1]}`;
    }




    const [ isVisible, setIsVisible ] = useState(false);
    const [ isVisibleB, setIsVisibleB ] = useState(false);
    const [ isVisibleC, setIsVisibleC ] = useState(false);


    console.log("kathegorie", kathegory);
  return (
        
    <Animated.View
        style={{
            borderRadius: 10,
            width: width,
            height: 160,
            margin:5,
            
            position: 'relative', // wichtig!
        }}
        >

    <TouchableOpacity className='rounded-[10px] '
        style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 2,
        shadowColor: backgroundColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5, 
        width: width,
        height: 160,
        opacity: isAvailable && !(purchaseLimit- purchaseAmout() == 0) ? 1 : 0.5,

        }}
 
        disabled={!isAvailable || purchaseLimit- purchaseAmout() == 0}
         onPress={() => {
        const isTooExpensive = userUsage?.microchip < price && currency === "Chips";
        const isSoldOut = !isAvailable || purchaseLimit - purchaseAmout() === 0;
        
        if ( kathegory == "FREEITEM" ) {
            setIsVisibleC(true); // Video Modal öffnen
        } else if (isTooExpensive) {
            flashRed(); // Animation starten
            //setIsVisible(true); // Modal anzeigen
        } else if (isSoldOut) {
            flashRed(); // optional auch für Sold Out
        } else {
            setIsVisibleB(true); // Kaufmodal öffnen
        }
        }}
        

    >   

        <ModalToExpensive isVisible={isVisible} setIsVisible={setIsVisible}/>
        <ModalBudyNow   isVisible={isVisibleB} 
                        setIsVisible={setIsVisibleB} 
                        imageSource={imageSource} 
                        imageColor={backgroundColor}  
                        kathegory={kathegory} 
                        purcharses={purchases}
                        price={price}
                        itemId={id}
                        amount={amount}
                        />
        <ModalVideoAdd
            isVisible={isVisibleC}
            setIsVisible={setIsVisibleC}
            url="https://www.youtube.com/watch?v=9rx7-ec0p0A"
            duration={30} 
            award={() => setUserUsage({
                ...userUsage,
                energy: userUsage.energy + 1, // Beispiel: Energie erhöhen
            })}
            
            />
        <Text className='text-white font-semibold text-[13px] text-center'>
            {title}
        </Text>
        <View className='flex-1  items-center justify-center '>
            <Image source={imageSource} style={{
                height:"95%",
                resizeMode: 'contain',
                marginTop: 5,
                marginBottom: 5,
            }} />

        </View>
        {
            purchaseLimit == 100 ?
            null : 
        <Text className='text-white font-semibold text-[13px] text-center'>
            {purchaseLimit- purchaseAmout()}/{purchaseLimit}
        </Text>
        }
        <View   className='rounded-b-[10px] items-center justify-center flex-row'
                style={{
                    height: 35,
                    backgroundColor: textbackgroundColor,
                }}
        >
            
            <Text className='text-white font-bold   text-center mr-1'

                style={{
                    color: userUsage?.microchip < price && currency == "Chips" ? "#D32F2F" : textColor ,
                    fontSize: 20,

                }}>
                {currency == "Free" && isAvailable && !(purchaseLimit- purchaseAmout() == 0) ? "Free" : null}
                {!isAvailable || purchaseLimit- purchaseAmout() == 0 ? "Sold Out" : null}
                {currency == "Chips" && isAvailable ? price : null}
            </Text>
            <Text className='text-white font-bold text-center text-[15px]'
                style={{ textDecorationLine: 'line-through', color: "gray" }}
                >
                {currency == "Free" && isAvailable && !(purchaseLimit- purchaseAmout() == 0) && price !== 0 ? `${priceWithCommas(price)}€` : null}
            </Text>
            {currency == "Chips" && isAvailable ? <Icon name="microchip"  size={17} color={userUsage?.microchip < price && currency == "Chips" ? "#D32F2F" : textColor} />: null}
        </View>
    </TouchableOpacity>
    <Animated.View
            pointerEvents="none"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#D32F2F',
                borderRadius: 10,
                opacity: overlayOpacity,
            }}
            />
    </Animated.View>

  )
}

export default Card