import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ModalEditTag = ({ modalVisible, setModalVisible, tag , updateTags, selectedTagIndex}) => {
  const [newTag, setNewTag] = useState(tag);
  const [on, setOn] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const colorOptions = [
    null,
    "red",
    "orange",
    "yellow",
    "emerald",
    "cyan",
    "blue",
    "purple",
    "pink"
  ];

  useEffect(() => {
    setNewTag(tag);
  }, [tag]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setNewTag({ ...newTag, color: color });
  };

  return (
    <View>
      {modalVisible ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
        >
          <View className="absolute top-0 left-0 w-full h-full justify-center items-center ">
            <View className='rounded-xl bg-gray-900 border-[1px] border-gray-800 p-3' style={{ minWidth: 400 }}>
              <View className='justify-between flex-row'>
                <Text className='text-white font-bold text-[15px]'>
                  Tags bearbeiten
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="times" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Text className='text-gray-400 font-bold text-[12px]'>
                Tag Name
              </Text>

              <TextInput
                className={`text-white flex-1 rounded-[10px] p-1  p-2 my-2 mx-2 border-blue-700 border-[1px] ${on ? 'border-blue-500' : 'border-gray-700'}`}
                value={newTag ? newTag.name : null}
                placeholder='Tag Name'
                onChangeText={(e) => setNewTag({ ...newTag, name: e })}
              />
              <Text className='text-gray-400 font-bold text-[12px]'>
                Tag Farbe
              </Text>
              <View className='flex-row flex-1 items-center justify-center border-gray-700 border-[1px] p-2 rounded-[10px] m-2'>
                {colorOptions.map((color, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      className={`p-1 m-1 rounded-full items-center justify-center`}
                      onPress={() => handleColorChange(color)}
                      style={{
                        backgroundColor:
                          selectedColor !== color ? null :
                          color === "red" ? "rgba(220, 38, 38, 0.4)" :
                          color === "blue" ? "rgba(37, 99, 235, 0.4)" :
                          color === "green" ? "rgba(5, 150, 105, 0.4)" :
                          color === "yellow" ? "rgba(202, 138, 4, 0.4)" :
                          color === "orange" ? "rgba(194, 65, 12, 0.4)" :
                          color === "purple" ? "rgba(124, 58, 237, 0.4)" :
                          color === "pink" ? "rgba(219, 39, 119, 0.4)" :
                          color === "emerald" ? "rgba(5, 150, 105, 0.4)" :
                          color === "cyan" ? "rgba(8, 145, 178, 0.4)" :
                          "rgba(31, 41, 55, 0.4)"
                      }}
                    >
                      <View className="items-center justify-center rounded-full" style={{
                        backgroundColor:
                          color === "red" ? "#DC2626" :
                          color === "blue" ? "#2563EB" :
                          color === "green" ? "#059669" :
                          color === "yellow" ? "#CA8A04" :
                          color === "orange" ? "#C2410C" :
                          color === "purple" ? "#7C3AED" :
                          color === "pink" ? "#DB2777" :
                          color === "emerald" ? "#059669" :
                          color === "cyan" ? "#0891B2" :
                          "#1F2937",
                        width: 25,
                        height: 25
                      }}>
                        {selectedColor == color && selectedColor !== null ? <Icon name="check" size={15} color="white" /> : null}
                        {color == null ? <Icon name="ban" size={15} color="gray" /> : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View className='flex-row justify-between p-3'>
                {newTag ?
                  <View className='flex-row items-center'>
                    <Text className='text-[12px] text-gray-400 font-semibold'>Vorschau:</Text>
                    <View className='items-center justify-center m-1 border-[2px] rounded-[5px] px-1 py-1 '
                      style={{
                        backgroundColor:
                          newTag.color === "red" ? "#DC2626" :
                          newTag.color === "blue" ? "#2563EB" :
                          newTag.color === "green" ? "#059669" :
                          newTag.color === "yellow" ? "#CA8A04" :
                          newTag.color === "orange" ? "#C2410C" :
                          newTag.color === "purple" ? "#7C3AED" :
                          newTag.color === "pink" ? "#DB2777" :
                          newTag.color === "emerald" ? "#059669" :
                          newTag.color === "cyan" ? "#0891B2" :
                          "#1F2937",
                          borderColor:
                          newTag.color === "red" ? "#F87171" :      
                          newTag.color === "blue" ? "#93C5FD" :     
                          newTag.color === "green" ? "#6EE7B7" :    
                          newTag.color === "yellow" ? "#FDE047" :   
                          newTag.color === "orange" ? "#FDBA74" :   
                          newTag.color === "purple" ? "#C4B5FD" :   
                          newTag.color === "pink" ? "#F9A8D4" :     
                          newTag.color === "emerald" ? "#6EE7B7" :  
                          newTag.color === "cyan" ? "#67E8F9" :     
                          "#4B5563"  
                      }}>
                      <Text className='text-[12px] font-semibold'
                        style={{
                          color: newTag.color === "red" ? "#F87171" :
                            newTag.color === "blue" ? "#93C5FD" :
                            newTag.color === "green" ? "#6EE7B7" :
                            newTag.color === "yellow" ? "#FDE047" :
                            newTag.color === "orange" ? "#FDBA74" :
                            newTag.color === "purple" ? "#C4B5FD" :
                            newTag.color === "pink" ? "#F9A8D4" :
                            newTag.color === "emerald" ? "#6EE7B7" :
                            newTag.color === "cyan" ? "#67E8F9" :
                            "#D1D5DB"
                        }}
                      >
                        {newTag.name}
                      </Text>
                    </View>
                  </View>
                  : null}
                <TouchableOpacity className='bg-white rounded-full p-2' onPress={()=> {updateTags( newTag); setModalVisible(false)}}>
                  <Text>Speichern</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

export default ModalEditTag;