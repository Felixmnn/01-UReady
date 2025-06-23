import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import StripeComponent from './stripeComponent.web';

const ModalBudyNow = ({isVisible, setIsVisible, imageSource, imageColor,kathegory, price,purcharses=[], itemId,amount=0, name, free=false, texts}) => {
    const { userUsage, setUserUsage } = useGlobalContext();
    
    function priceWithCommas(priceInCents) {
        const euros = (priceInCents / 100).toFixed(2); 
        const parts = euros.split('.');
        return `${parts[0]},${parts[1]}`;
    }

    const handleBuyNow = () => {
        // Hier kannst du die Logik für den Kauf implementieren
        // Zum Beispiel: setUserData({ ...userData, chips: userData.chips - price });
        if (kathegory == "ENERGY") {
            setUserUsage({
                ...userUsage,
                microchip: userUsage.microchip - price, // Beispiel: Chips abziehen
                energy: userUsage.energy + amount, // Beispiel: Energie erhöhen
                purcharses: [...purcharses,itemId], // Beispiel: Käufe erhöhen
            });
        } else if (kathegory == "CHIPS") {
            setUserUsage({
                ...userUsage,
                microchip: userUsage.microchip + amount, // Beispiel: Chips abziehen
                purcharses: [...purcharses,itemId], // Beispiel: Käufe erhöhen

            });
        
        }
        setIsVisible(false);
    
    };

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}>
        <TouchableOpacity
                    activeOpacity={1} 
                    onPress={() => setIsVisible(false)}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 30,
                    }}
        >
            <View className="bg-gray-800 p-3 rounded-xl shadow-lg items-center">
                <Text className="text-lg font-semibold mb-2 text-center text-gray-200">{texts.validdatePurchase}</Text>
                <View className='p-3'
                    style={{
                        backgroundColor: imageColor,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Image source={imageSource} style={{
                        height: 120,
                        resizeMode: 'contain',
                        borderRadius: 0,
                    }} />
                </View>
                <View className="flex-row items-center">
                    <Text className="mb-2 my-1 text-gray-200">
                        {texts.doYouWant}{name}{texts.für}{free ? "0,00" : priceWithCommas(price)}€ {texts.kaufen}
                    </Text>
                    
                </View>
                <View className="flex-row justify-end space-x-4 ">
                <TouchableOpacity onPress={() => setIsVisible(false)}
                    className='bg-red-300 p-2 rounded-[10px] w-[90px]'>
                    <Text className="text-gray-900 font-medium text-center ">{texts.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> handleBuyNow()} className='bg-blue-500 p-2 rounded-[10px] w-[90px]'>
                    <Text className=" font-medium text-center text-gray-900">{texts.buy}</Text>
                </TouchableOpacity>
                </View>
            </View>
            <StripeComponent/>
        </TouchableOpacity>
    </Modal>
  )
}

export default ModalBudyNow