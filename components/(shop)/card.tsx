import { View, Text, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'   
import images from '@/assets/shopItems/itemConfig'
import ModalToExpensive from './modalToExpensive'
import ModalBudyNow from './modalBudyNow'
import { Animated } from 'react-native';
import ModalVideoAdd from './modalVideoAdd'
import { useGlobalContext } from '@/context/GlobalProvider'
import ModalQuiz from './modalQuiz'



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
    amount=0,
    image=null,
    amountVideos="0/0",
    amountQuestionarys="0/0",
    commercialsAvailable=[],

}) => {

    const { setUserUsage } = useGlobalContext();
    
    function purchaseAmout() {
        

    const filtered = purchases.filter(p => p === id);
    return filtered.length;
}
    const bgColorAnim = useRef(new Animated.Value(0)).current;
    const interpolatedColor = bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [backgroundColor, '#D32F2F'], // z. B. Rot als Warnfarbe
    });
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    console.log("User Usage 🐋🐋🐋", userUsage);

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
    const [ isVisibleD, setIsVisibleD ] = useState(false);

    
    function amountItems({image, purchaseLimit}) {
        if (image == "VIDEO") {
            return amountVideos
        } else if (image == "QUESTIONARY") {
            return amountQuestionarys
        } else {
            return `${purchaseLimit- purchaseAmout()}/${purchaseLimit }`;
        }
    }
    function priceItems() {
        if ((image == "VIDEO" && amountVideos== "0/0") || (image == "QUESTIONARY" && amountQuestionarys == "0/0")){
            return "Sold Out";
        }
        if (currency == "Free" && isAvailable && !(purchaseLimit- purchaseAmout() == 0)) {
            return "Free";
        }
        if (currency == "Chips" && isAvailable) {
            return price;
        } else if (!isAvailable || purchaseLimit- purchaseAmout() == 0 ) {
            return "Sold Out";
        }
        return "";
    }
    console.log("COmmercials Available 🐋🐋🐋", commercialsAvailable);
    
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
        console.log("Currency 🐋🐋🐋", currency);  
        console.log("isTooExpensive", image);
        if ( kathegory == "FREEITEM" && image == "VIDEO") {
            setIsVisibleC(true);
        } else if ( image == "QUESTIONARY") {
            setIsVisibleD(true);
        } else if (isTooExpensive) {
            flashRed(); 
        } else if (currency == "Chips") {
            setUserUsage({
                ...userUsage,
                energy: userUsage.energy + amount,
                microchip: userUsage.microchip - price, 
            })
        } else if (isSoldOut) {
            flashRed();
        } else {
            setIsVisibleB(true); 
        }
        }}
        

    >   

        <ModalToExpensive isVisible={isVisible} setIsVisible={setIsVisible}/>
        <ModalBudyNow   isVisible={isVisibleB} 
                        free={currency == "Free" ? true : false}
                        setIsVisible={setIsVisibleB} 
                        imageSource={imageSource} 
                        imageColor={backgroundColor}  
                        kathegory={kathegory} 
                        purcharses={purchases}
                        price={price}
                        itemId={id}
                        amount={amount}
                        name={title}
                        />
        <ModalVideoAdd
            isVisible={isVisibleC}
            setIsVisible={setIsVisibleC}
            duration={commercialsAvailable.length > 0 ? commercialsAvailable[0].duration : 30}
            commercialUrl={ commercialsAvailable.length > 0 ? commercialsAvailable[0].url : ""}
            onComplete={() => {
                const id = commercialsAvailable.length > 0 ? commercialsAvailable[0].$id : ""
                setUserUsage({
                    ...userUsage,
                    energy: userUsage.energy + 1,
                    purcharses: [...userUsage.purcharses, `${id}|VIDEO|${new Date().getDate()}`],
                    watchedComercials: userUsage.watchedComercials.length == 0 ? [ id ] : [...userUsage.watchedComercials, id],
                    
                });
            }}
            />
        <ModalQuiz 
            isVisible={isVisibleD}
            setIsVisible={setIsVisibleD}
            onComplete={() => {
                setUserUsage({
                    ...userUsage,
                    energy: userUsage.energy + 2,
                });
            }}
            />
        <Text className='text-white  font-semibold text-[13px] text-center'>
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
            {amountItems({image, purchaseLimit, purcharses: purchases, amountVideos, amountQuestionarys})} 
        </Text>
        }
        <View   className='rounded-b-[10px] items-center justify-center flex-row'
                style={{
                    height: 35,
                    backgroundColor: textbackgroundColor,
                }}>
            <Text className='text-white font-bold   text-center mr-1'
                    style={{
                        color: userUsage?.microchip < price && currency == "Chips" ? "#D32F2F" : textColor ,fontSize: 20,}}>
                {priceItems()}
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