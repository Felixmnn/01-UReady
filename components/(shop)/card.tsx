import { View, Text, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'   
import images from '@/assets/shopItems/itemConfig'
import ModalBudyNow from './modalBudyNow'
import { Animated } from 'react-native';
import ModalVideoAdd from './modalVideoAdd'
import { useGlobalContext } from '@/context/GlobalProvider'
import ModalQuiz from './modalQuiz'
import { loadSurvey } from '@/lib/appwriteDaten'
import  languages  from '@/assets/exapleData/languageTabs.json';
import mobileAds from 'react-native-google-mobile-ads';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});
const Card = ({
    shopItem=null,
}) => {

    const { setUserUsage, userUsage,  } = useGlobalContext();
    const [ quizzes , setQuizzes ] = useState([]);
    const { language } = useGlobalContext()
    const [ selectedLanguage, setSelectedLanguage ] = useState("DEUTSCH")
    const texts = languages.shop[selectedLanguage] || languages.shop["DEUTSCH"];
    useEffect(() => {
      if(language) {
        setSelectedLanguage(language)
      }
    }, [language])

        
    useEffect(() => {
      mobileAds()
        .initialize()
        .then(() => {
        });
    }, []);
    
      const [loaded, setLoaded] = useState(false);
      useEffect(() => {
          const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setLoaded(true);
          });
          const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
            setUserUsage({
                    ...userUsage,
                    watchedComercials: userUsage.watchedComercials.length > 0 ? [...userUsage.watchedComercials, new Date().toISOString()] : [new Date().toISOString()],
                    purcharses: userUsage.purcharses.length > 0 ? [...userUsage.purcharses, shopItem?.$id] : [shopItem?.$id],
                    energy: userUsage.energy + 1,
                });
            
                setLoaded(false);
                  rewarded.load();

            },
          );
    
          // Start loading the rewarded ad straight away
          rewarded.load();
    
          // Unsubscribe from events on unmount
          return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
          };
        }, []);
    useEffect(() => {
        if (!userUsage) return;
        async function fetchQuizzes() {
            const response = await loadSurvey();
            
            const filteredResponse = response.documents.filter(i => !userUsage.participatedQuizzes.includes(i.$id)
            );
            console.log(userUsage.participatedQuizzes)

            if (filteredResponse.length > 0) {
            setQuizzes(filteredResponse);
            } else {
            setQuizzes([]); 
            }
        } 
        fetchQuizzes();
    }
    , []);
    const purchases = userUsage?.purcharses || [];
    function purchaseAmout() {
        const filtered = purchases.filter(p => p === shopItem?.$id);
        if (shopItem?.maxPurchaseAmount - filtered.length <= 0) {
            return 0;
        } else {
            return shopItem?.maxPurchaseAmount - filtered.length;
        }
    }
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
    /**
     * Formats the price from cents to euros with commas.
     */
    function priceWithCommas(priceInCents=0) {
        const euros = (priceInCents / 100).toFixed(2); 
        const parts = euros.split('.');
        return `${parts[0]},${parts[1]}`;
    }
    function amountItems(){
        if (shopItem?.itemType === "REWARDEDQUIZ") {
            const amountOfUnsolvedQuizzes = quizzes.length
            if (amountOfUnsolvedQuizzes <= 0) {
                return "0/0";
            } else {
                return `${quizzes.length }/${quizzes.length > 3 ? quizzes.length < 3 ? quizzes.length : quizzes.length : quizzes.length}`;
            }
        }
        if (shopItem?.maxPurchaseAmount > 5) {
            return null
        } else {
            const amount = purchaseAmout();
            return `${amount}/${shopItem?.maxPurchaseAmount}`;
        }
    }
    function priceItem(){
        if (shopItem?.itemType == "REWARDEDQUIZ" && quizzes.length <= 0 ){
            return "Keine Quizze"
        }
        else if( shopItem?.currency === "FREE" || shopItem?.isFree ){
            return "Gratis";
        } else if (shopItem?.currency === "CHIPS") {
            return shopItem?.price
        } else if (shopItem?.currency === "MONEY") {
            return `${priceWithCommas(shopItem?.price)}€`;
        }
        
    }
    function normalPriceItem(){
        if (shopItem?.currency === "MONEY" && shopItem?.isFree ) {
            return priceWithCommas(shopItem?.price);
        } else if ( shopItem?.currency === "MONEY"){
            return priceWithCommas(shopItem?.normalPrice);
        } else if (shopItem?.currency === "CHIPS") {
            return shopItem?.normalPrice;
        } else if (shopItem?.currency === "FREE") {
            return "Kostenlos";
        }
    }
    function isAvailable() {
        const isSoldOut = shopItem?.purchaseLimit - purchaseAmout() <= 0;
        if (isSoldOut) {
            return false;
        } else if (!shopItem?.isAvailable){
            return false;
        } else {
            return true;
        }
    }
    function shopItemWidth() {
        if (shopItem?.spaceUsage === "FULL"){
            return 300;
        } else if (shopItem?.spaceUsage === "HALF") {
            return 150;	
        } else if (shopItem?.spaceUsage === "ONETHIRD") {
            return 100;
        } else if (shopItem?.spaceUsage === "TWOTHIRD") {
            return 200;
        }
        return 150;
    }
    function styleColors(area: string): string {
    const theme = shopItem?.design || "BASIC"; 

    if (area === "background") {
        if (theme === "BASIC") return "#294a67";         
        if (theme === "GOLD") return "#644f0b";           
        return "#f4c542";                                 
    }

    if (area === "text") {
        if (theme === "BASIC") return "#ffffff";
        if (theme === "GOLD") return "#fff5cc";           
        return "#000000";                                 
    }

    if (area === "border") {
        if (theme === "BASIC") return "#1a3347";
        if (theme === "GOLD") return "#a67800";
        return "#bc8e00";                                 
    }

    if (area === "shadow") {
        if (theme === "BASIC") return "#0d1b26";          
        if (theme === "GOLD") return "#d4af37";
        return "#bc8e00";
    }

    if (area === "button") {
        if (theme === "BASIC") return "#3a6b8a";
        if (theme === "GOLD") return "#d4af37";           
        return "#ffffff";
    }

    if (area === "buttonText") {
        if (theme === "BASIC") return "#ffffff";
        if (theme === "GOLD") return "#4a4a4a";
        return "#4a4a4a";
    }

    if (area === "buttonBorder") {
        if (theme === "BASIC") return "#ffffff";
        if (theme === "GOLD") return "#f2c744";
        return "#bc8e00";
    }

    return "#ffffff";
}

    function tooExpensive() {
        return userUsage?.microchip < shopItem?.price && shopItem?.currency === "CHIPS";
    }
    const [ isVisibleB, setIsVisibleB ] = useState(false);
    const [ isVisibleC, setIsVisibleC ] = useState(false);
    const [ isVisibleD, setIsVisibleD ] = useState(false);
  return (
        
    <Animated.View
        style={{
            borderRadius: 10,
            height: 160,
            margin:5,
            position: 'relative', 
        }}
        >

    
    <TouchableOpacity className='rounded-[10px] '
        style={{
        backgroundColor: styleColors("background"),
        borderColor: styleColors("border"),
        borderWidth: 2,
        shadowColor: styleColors("shadow"),
        shadowOffset: { width: 0, height: 5 },
        width: shopItemWidth(),
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5, 
        height: 160,
        opacity: isAvailable() && !(shopItem?.itemType == "COMERCIAL" && !loaded ) ? 1 : 0.5,
        }}

        disabled={!isAvailable() || (!loaded && shopItem?.itemType == "COMERCIAL")}
         onPress={() => {
            const isTooExpensive = tooExpensive();

            const isSoldOut = !isAvailable() || shopItem?.purchaseLimit - purchaseAmout() === 0;
            if ( shopItem?.itemType == "COMERCIAL" && !(purchaseAmout() <=0) ) {
                rewarded.show();
            
            }else if (shopItem?.itemType == "REWARDEDQUIZ" && quizzes.length <= 0 ){
                flashRed()
            } else if ( shopItem?.itemType == "REWARDEDQUIZ") {
                setIsVisibleD(true);
            } else if (isTooExpensive || purchaseAmout() <=0 ) {
                flashRed(); 
            } else if (shopItem?.currency === "CHIPS") {
                setUserUsage({
                    ...userUsage,
                    energy: userUsage.energy + (shopItem?.itemAmount[0] || 1),
                    microchip: userUsage.microchip - shopItem?.price, 
                })
            } else if (isSoldOut) {
                flashRed();
            } else {
                setIsVisibleB(true); 
            }}}>   

        
        <ModalBudyNow   isVisible={isVisibleB} 
                        free={shopItem?.currency == "FREE" || shopItem?.isFree ? true : false}
                        setIsVisible={setIsVisibleB} 
                        imageSource={images[shopItem?.imageSource || "QUIZ"]} 
                        imageColor={styleColors("background")}  
                        kathegory={shopItem?.itemType || "ENERGY"} 
                        purcharses={purchases}
                        price={shopItem?.price || 0}
                        itemId={shopItem?.$id || ""}
                        amount={shopItem?.itemAmount[0] || 1}
                        name={shopItem?.itemName || ""}
                        texts={texts}
                        />
                        
        <ModalVideoAdd
            isVisible={isVisibleC}
            setIsVisible={setIsVisibleC}
            onComplete={() => {
                
                setUserUsage({
                    ...userUsage,
                    watchedComercials: userUsage.watchedComercials.length > 0 ? [...userUsage.watchedComercials, new Date().toISOString()] : [new Date().toISOString()],
                    purcharses: userUsage.purcharses.length > 0 ? [...userUsage.purcharses, shopItem?.$id] : [shopItem?.$id],
                    energy: userUsage.energy + 1,
                });
            }}
            />
        <ModalQuiz 
            isVisible={isVisibleD && quizzes.length > 0}
            texts={texts}
            setIsVisible={setIsVisibleD}
            quiz={quizzes.length > 0 ? quizzes[0] : null}
            onComplete={() => {
                
                setUserUsage({
                    ...userUsage,
                    energy: userUsage.energy + 2,
                    participatedQuizzes: userUsage.participatedQuizzes.length > 0  ?  
                    [...userUsage.participatedQuizzes, quizzes.length > 0 ? quizzes[0].$id : "PLACEHOLDER"] : [quizzes.length > 0 ? quizzes[0].$id : "PLACEHOLDER"],
                    purcharses: userUsage.purcharses.length > 0 ? [...userUsage.purcharses, shopItem?.$id] : [shopItem?.$id],
                });
                console.log("QUIZQUizzes sliced", userUsage.participatedQuizzes)
                setQuizzes(prev => prev.slice(1));
            }}
            />
        <Text className='text-white  font-semibold text-[13px] text-center'>
            {shopItem?.itemName}
        </Text>
        <View className='flex-1  items-center justify-center '>
            <Image 
                source={images[shopItem?.imageSource || "QUIZ"]} style={{
                height:"95%",
                resizeMode: 'contain',
                marginTop: 5,
                marginBottom: 5,
            }} />

        </View>
        <Text className='text-white font-semibold text-[13px] text-center'>
            {amountItems()} 
        </Text>
        <View  
            className='rounded-b-[10px] items-center justify-center flex-row'
            style={{
                height: 35,
                backgroundColor: styleColors("button"),
            }}>
        <Text className=' font-bold   text-center mr-1'
            style={{
                color: tooExpensive() ? "red" : styleColors("buttonText"),
            }}
        >
            {priceItem()}
        </Text>
        {
            (shopItem?.isOnSale || shopItem?.isFree) && shopItem?.itemType != "COMERCIAL" && shopItem?.itemType != "REWARDEDQUIZ" ? 
            <Text className='text-white font-bold text-center text-[15px]'
                style={{ textDecorationLine: 'line-through', color: "gray" }}
                >
                {normalPriceItem()}
            </Text>
            : null
        }
            {shopItem?.currency == "CHIPS" && isAvailable() ? 
            <Icon name="microchip"  size={17} color={tooExpensive() ? "red" : styleColors("buttonText")} />: 
            null}
        </View>
    </TouchableOpacity>
    <Animated.View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#D32F2F',
                borderRadius: 10,
                opacity: overlayOpacity,
                pointerEvents: 'none'
            }}
            />
    </Animated.View>

  )
}

export default Card