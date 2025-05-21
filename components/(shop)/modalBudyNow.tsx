import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';

const ModalBudyNow = ({isVisible, setIsVisible, imageSource, imageColor,kathegory, price,purcharses=[], itemId,amount=0, name, free=false}) => {
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
            <View className="bg-white p-3 rounded-xl shadow-lg items-center">
                <Text className="text-lg font-semibold mb-2 text-center">Kauf bestätigen</Text>
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
                
                <Text className="mb-2 my-1">
                Möchtest du <Text className="font-bold">{name}</Text> für{" "}
                <Text className="font-bold">{free ? "0,00" : priceWithCommas(price)} €</Text> kaufen?
                </Text>

                <View className="flex-row justify-end space-x-4 ">
                <TouchableOpacity onPress={() => setIsVisible(false)}
                    className='bg-red-300 p-2 rounded-[10px] w-[90px]'>
                    <Text className="text-red-500 font-medium text-center">Abbrechen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> handleBuyNow()} className='bg-blue-500 p-2 rounded-[10px] w-[90px]'>
                    <Text className="text-gray-900 font-medium text-center">Kaufen</Text>
                </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
  )
}

export default ModalBudyNow