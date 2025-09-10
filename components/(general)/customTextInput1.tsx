import { useState } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; 

const CustomTextInput1 = ({ 
    value, 
    inputStyles, 
    placeholderSize,
    multiline, 
    numberOfLines, 
    placeholderBold, 
    password,  
    onChange }:{
    value: string, 
    inputStyles?: string, 
    placeholderSize?: number,
    multiline?: boolean, 
    numberOfLines?: number, 
    placeholderBold?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900", 
    password?: boolean,  
    onChange: (text: string) => void
    
    }) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Zustand für Passwortsichtbarkeit
    const [text, setText] = useState(value); 
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }; 
    const handleBlur = () => {
        setFocused(false);
        onChange(text); // Übergib den aktuellen Wert des Textfeldes an onChange
    };
    return (
        <View className=" w-full"
        style={{width:300}}
        >
            <TextInput
                className={`p-3 rounded-[10px] w-full ${focused ? "border-blue-500 border-w-[1px]" : "border-gray-500 "} ${inputStyles}`}
                placeholderTextColor={"white"}
                style={{
                    color: "gray",
                    fontWeight: placeholderBold ? placeholderBold : 'bold',
                    fontSize: placeholderSize ? placeholderSize : 15,
                    outline: 'none',
                    borderColor: focused ? "blue" : "gray",
                    borderWidth: 1,                 
                }}
                multiline={multiline}
                numberOfLines={numberOfLines ? numberOfLines : 1}
                onChangeText={(value)=>setText(value)}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
               
                value={text}
                placeholder={value}
                secureTextEntry={password && !showPassword}  // Wenn password true und showPassword false ist, wird der Text maskiert
            />
            
            {password && (  // Zeige das Augen-Icon nur wenn password true ist
                <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: [{ translateY: -12 }],
                    }}
                >
                    <Icon 
                        name={showPassword ? "eye-slash" : "eye"} 
                        size={20} 
                        color="gray"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CustomTextInput1;
