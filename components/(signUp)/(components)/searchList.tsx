import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

const SearchList = ({data, filter, setFilter, handlePress, selectedItems}) => {
  return (
    <View className='bg-gray-900 h-full w-full max-w-[600px] max-h-[700px] rounded-[10px] '
        style={{maxWidth:600, maxHeight:700}}
        >
        <TextInput
            className={`text-gray-400 rounded-[10px] bg-[#0c111d] p-2 m-2 border-blue-700 border-[1px]  `} 
            value={filter}
            onChangeText={(text) => setFilter(text)} 
            placeholder="Deine Universität"
        />
        <View className='flex-1'>
            <FlatList
                data={data}
                keyExtractor={(item => item.id)}
                style={{
                    scrollbarWidth: 'thin', 
                    scrollbarColor: 'gray transparent'  
                }}
                renderItem={({item}) => (
                    <TouchableOpacity key={item.id} onPress={()=> handlePress(item)} 
                    className={`flex-row p-2 border-gray-800 border-[1px] rounded-[10px] ${selectedItems && selectedItems.includes(item) ? "bg-blue-700 " : "bg-gray-800"}  items-center justify-start m-2`}
                    >
                        <Icon name={item.icon} size={20} color="white" />
                        <Text className='text-gray-100 font-semibold text-[15px] text-center ml-2' numberOfLines={item.name.length > 13 ? 2 : null}>
                            {item.name}
                        </Text> 
                    </TouchableOpacity>
                )}
            />
        </View>
    </View>
  )
}

export default SearchList