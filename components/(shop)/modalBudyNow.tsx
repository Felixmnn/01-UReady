import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';

const ModalBudyNow = ({isVisible, setIsVisible, imageSource, imageColor,kathegory, price,purcharses=[], itemId,amount=0}) => {
    const { userUsage, setUserUsage } = useGlobalContext();
    console.log("purcharses4", amount);
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
                    activeOpacity={1} // wichtig, damit Klick nicht durchgeht
                    onPress={() => setIsVisible(false)}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // 💡 nur hier Transparenz
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 30,
                    }}
        >
            <View className='p-3 bg-white rounded-[10px] items-center justify-center '>
                <Text className='font-bold text-[18px]'> Are you sure you want to buy:</Text>
                <View style={{
                    backgroundColor: imageColor,
                    borderRadius: 10,
                    margin: 10,
                }}
                    >
                    <Image source={imageSource} style={{
                        height: 120,
                        resizeMode: 'contain',
                        borderRadius: 25,
                    }} />
                </View> 
                <TouchableOpacity className='rounded-[10px] bg-blue-500 p-3 mt-5 '  onPress={() => handleBuyNow()} >
                    <Text className='text-gray-300 font-bold text-[20px]'>BUDY NOW</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    </Modal>
  )
}

export default ModalBudyNow