import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SessionProgress from '../sessionProgress'
import Icon from "react-native-vector-icons/FontAwesome5";
import { ScrollView } from 'react-native-gesture-handler';

const RoadMap = ({data, selected, setSelected, questions}) => { 
  
  function getAll(){
    let bad = 0
    let ok = 0
    let good = 0
    let great = 0
    let total = 0
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].status == "BAD" ){
        bad += 1
      } else if (questions[i].status == "OK" ){
        ok += 1
      } else if (questions[i].status == "GOOD" ){
        good += 1
      } else if (questions[i].status == "GREAT" ){
        great += 1
      }
    }
    return {bad:Math.floor(bad/questions.length*100),ok:Math.floor(bad/questions.length*100),good:Math.floor(bad/questions.length*100),great:Math.floor(bad/questions.length*100)}

  }
  const percentA = getAll()
  const {width} = useWindowDimensions()
  const exampleSessions = [
    {
      title:"Session 1",
      percent: 50,
      iconName: "layer-group",
      color: "red",
      questions: 1,
      description:"",
      tags: []
      
    },
    {
      title:"Session 2",
      percent: 70,
      iconName: "layer-group"
    },
    {
      title:"Session 3",
      percent: 90,
      iconName: "layer-group"
    },
    {
      title:"Session 4",
      percent: 100,
      iconName: "layer-group"
    },
    {
      title:"Session 5",
      percent: 100,
      iconName: "layer-group"
    },
    {
      title:"Session 6",
      percent: 100,
      iconName: "layer-group"
    }
    
   
    
    
  ]
  const CircularButton = ({ onPress,children }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    return (
      <View className="items-center justify-center">
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className="rounded-full flex items-center justify-center  bg-red-500"
        style={{
          transform: [{ translateY: isPressed ? 2 : 0 }], 
          shadowColor: "#800000",
          shadowOffset: { width: 0, height: isPressed ? 2 : 6 },
          shadowOpacity: 1,
          shadowRadius: 2,
          marginBottom: 5,
          marginLeft:1,
          width:60,
          height:60
        }}
      >
        <View className="absolute">{children}</View>
      </TouchableOpacity>
    </View>
    );
  };

  const getMargins = (index, totalItems) => {
    const marginValue = 200;
    
    const curveFactor = 5;  
    if (totalItems === 1 || totalItems === 2) {
        return { marginLeft: 0, marginRight: 0, marginTop:0, marginBottom: 0 };
    } else if (totalItems === 3){
        if (index === 0) {
            return { marginLeft: 0, marginRight: 0, marginTop:0 , marginBottom: 0};
        } else if (index === 1) {
            return { marginLeft: 0, marginRight: 100 };
        } else {
            return { marginLeft: 0, marginRight: 0, marginTop:0, marginBottom: 0 };
        }
    } else if (totalItems === 4){
      if (index === 0) {
        return { marginLeft: 0, marginRight: 0, marginTop:0, marginBottom: 0 };
    } else if (index === 1) {
        return { marginLeft: 0, marginRight: 100, marginTop:0, marginBottom: 0 };
    } else if (index === 2) {
      return { marginLeft: 0, marginRight: 75, marginTop:10, marginBottom: 0 };
    }
  } else if (totalItems === 5){
    if (index === 0) {
      return { marginLeft: 0, marginRight: 0, marginTop:0, marginBottom: 0 };
  } else if (index === 1) {
    return { marginLeft: 0, marginRight: 75, marginTop:0, marginBottom: 0 };
  } else if (index === 2) {
    return { marginLeft: 0, marginRight: 100, marginTop:10, marginBottom: 0 };
  } else if (index === 3) {
    return { marginLeft: 0, marginRight: 50, marginTop:5, marginBottom: 0 };
  }
  } else if (totalItems === 6){
    if (index === 0) {
      return { marginLeft: 0, marginRight: 0, marginTop:0 , marginBottom: 0};
  } else if (index === 1) {
    return { marginLeft: 0, marginRight: 75, marginTop:0, marginBottom: 0 };
  } else if (index === 2) {
    return { marginLeft: 0, marginRight: 100, marginTop:10, marginBottom: 0 };
  } else if (index === 3) {
    return { marginLeft: 0, marginRight: 50, marginTop:5, marginBottom: 0 };
  } else if (index === 4) {
    return { marginLeft: 50, marginRight: 0, marginTop:0, marginBottom: 10 };
  }
  } else if (totalItems === 7){
    if (index === 0) {
      return { marginLeft: 0, marginRight: 0, marginTop:0 , marginBottom: 0};
  } else if (index === 1) {
    return { marginLeft: 0, marginRight: 75, marginTop:0, marginBottom: 0 };
  } else if (index === 2) {
    return { marginLeft: 0, marginRight: 100, marginTop:10, marginBottom: 0 };
  } else if (index === 3) {
    return { marginLeft: 0, marginRight: 50, marginTop:5, marginBottom: 0 };
  } else if (index === 4) {
    return { marginLeft: 50, marginRight: 0, marginTop:0, marginBottom: 10 };
  } else if (index === 5) {
    return { marginLeft: 75, marginRight: 0, marginTop:0, marginBottom: 5 };
  }
  } else if (totalItems === 8){
    if (index === 0) {
      return { marginLeft: 0, marginRight: 0, marginTop:0 , marginBottom: 0};
  } else if (index === 1) {
    return { marginLeft: 0, marginRight: 75, marginTop:0, marginBottom: 0 };
  } else if (index === 2) {
    return { marginLeft: 0, marginRight: 100, marginTop:10, marginBottom: 0 };
  } else if (index === 3) {
    return { marginLeft: 0, marginRight: 50, marginTop:5, marginBottom: 0 };
  } else if (index === 4) {
    return { marginLeft: 50, marginRight: 0, marginTop:0, marginBottom: 10 };
  } else if (index === 5) {
    return { marginLeft: 100, marginRight: 0, marginTop:0, marginBottom: 10 };
  } else if (index === 6) {
    return { marginLeft: 75, marginRight: 0, marginTop:0, marginBottom: 5 };
  }
  } else if (totalItems === 9){
    if (index === 0) {
      return { marginLeft: 0, marginRight: 0, marginTop:0 , marginBottom: 0};
  } else if (index === 1) {
    return { marginLeft: 0, marginRight: 75, marginTop:0, marginBottom: 0 };
  } else if (index === 2) {
    return { marginLeft: 0, marginRight: 100, marginTop:10, marginBottom: 0 };
  } else if (index === 3) {
    return { marginLeft: 0, marginRight: 50, marginTop:5, marginBottom: 0 };
  } else if (index === 4) {
    return { marginLeft: 50, marginRight: 0, marginTop:0, marginBottom: 10 };
  } else if (index === 5) {
    return { marginLeft: 125, marginRight: 0, marginTop:0, marginBottom: 10 };
  } else if (index === 6) {
    return { marginLeft: 100, marginRight: 0, marginTop:0, marginBottom: 5 };
  } else if (index === 7) {
    return { marginLeft: 50, marginRight: 0, marginTop:0, marginBottom: 10 };
  }
  } else {
    if (index === 0) {
      return { marginLeft: 0, marginRight: 0, marginTop:0 , marginBottom: 0};
  }  else if (index % 6 === 0) {
    return { marginLeft: 100, marginRight: 0, marginTop:0, marginBottom: 5 };
  } else if (index % 4 === 0) {
    return { marginLeft: 50, marginRight: 0, marginTop:0, marginBottom: 10 };
  } else if (index % 2 === 0) {
    return { marginLeft: 0, marginRight: 100, marginTop:10, marginBottom: 0 };
  } else if (index % 3 === 0) {
    return { marginLeft: 0, marginRight: 50, marginTop:5, marginBottom: 0 };
  }  else if (index % 5 === 0) {
    return { marginLeft: 125, marginRight: 0, marginTop:0, marginBottom: 10 };
  }  else if (index % 7 === 0) {
    return { marginLeft: 50, marginRight: 0, marginTop:0, marginBottom: 0 };
  } else if (index % 1 === 0) {
    return { marginLeft: 0, marginRight: 75, marginTop:0, marginBottom: 0 };
  }
  }
}

  return (
    <ScrollView className={`${width > 700 ? "" : null} ` }  style={{
      scrollbarWidth: 'thin', // Dünne Scrollbar
      scrollbarColor: 'gray transparent', // Graue Scrollbar mit transparentem Hintergrund
    }}>
      {
        exampleSessions.map((module, index) => {
          //const percent = getAmount(index)
          const { marginLeft, marginRight, marginTop,marginBottom } = getMargins(index, exampleSessions.length + 1);

            return (

              <View style={{
                marginLeft, marginRight, marginTop,marginBottom
              }}>
                <SessionProgress 
                selected={selected == index} 
                setSelected={()=> setSelected(index)} 
                first={index == 0}  
                progressr={module.percent}
                > 
                     <CircularButton >
                        <Icon name={module.iconName} size={20} color="white"/>
                      </CircularButton>
                </SessionProgress>
              </View>
            )
    })
    }
    <SessionProgress selected={selected == data.length +1}
                     setSelected={()=> setSelected(data.length +1)}
                     first={false} progress={10}
                     progressr={percentA.bad}
                        >
                    <Text className='text-white'>All</Text>
    </SessionProgress>
    
    </ScrollView>

  )
}

export default RoadMap