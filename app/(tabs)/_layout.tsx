import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";
import { View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

const RootLayout = () => {
    const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700; // Prüfen, ob Breite über 700px ist

    return (
        <View className="flex-1">
         <Tabs
            screenOptions={({ route }) => ({
                tabBarStyle: { display: isVertical ? 'none' : 'flex', 
                                backgroundColor: '#0c111d', 
                                height: 50, 
                                paddingTop:5,
                                borderTopWidth: 1,
                                borderTopColor: '#6b7280',
                                
                              
                              }, // Verstecke die Tab-Leiste auf kleinen Bildschirmen
                              tabBarShowLabel: false, 
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    let iconSize = focused ? 35 : 24; // Größere Icons für aktive Tabs


                    if (route.name === 'home') {
                        iconName = 'home';
                    } else if (route.name === 'bibliothek') {
                        iconName = 'book';
                    } else if (route.name === 'entdecken') {
                        iconName = 'search';
                    } else if (route.name === 'profil') {
                        iconName = 'user';
                    } else if (route.name === 'shop') {
                      iconName = 'store';
                  }

                    return <Icon name={iconName} size={iconSize} color={color} />;
                },
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#A1A1AA',
            })}
        >
          <Tabs.Screen name="shop" 
          options={{
            headerShown: false,
             }}
        />
          <Tabs.Screen name="bibliothek" 
          options={{
            headerShown: false,
             }}
        />
        <Tabs.Screen name="home" 
            options={{
                headerShown: false,
            }}
          />
          <Tabs.Screen name="entdecken" 
          options={{
            headerShown: false,
            }}
        />
          <Tabs.Screen name="profil" 
            options={{
                headerShown: false,
            }}  
        />
          
        </Tabs>
      </View>
    )
}
export default RootLayout