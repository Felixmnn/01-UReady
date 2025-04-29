import { View, Text, useWindowDimensions, TouchableOpacity,ScrollView } from 'react-native'
import React, { useState } from 'react'
import SessionProgress from '../sessionProgress'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useGlobalContext } from '@/context/GlobalProvider';
import { updateUserUsageSessions } from '@/lib/appwriteUpdate';

const RoadMap = ({moduleSessions, selected, setSelected, questions, addDocument, setTab}) => { 
  const { user } = useGlobalContext();
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
  

 
  const CircularButton = ({ onPress,children,index,color,session }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    return (
      <View className="items-center justify-center">
      <TouchableOpacity
        activeOpacity={1}
        onPress={()=> {
          if (index > moduleSessions.length) {
            setSelected(index); setTab(0); return
          }
          setSelected(index); setTab(0);  updateUserUsageSessions(user.$id, {
          name: session.title,
          sessionID: session.id,
          percent : session.percent,
          color: session.color,
          iconName: session.iconName,
          questions : session.questions,
        })}}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className="rounded-full flex items-center justify-center"
        
        style={{
          transform: [{ translateY: isPressed ? 2 : 0 }], 
          shadowColor: 
          color == "red" ? "#800000" :       // Dunkelrot
          color == "orange" ? "#803300" :    // Dunkelorange
          color == "yellow" ? "#806600" :    // Senfgelb
          color == "emerald" ? "#006644" :   // Dunkelgrün
          color == "cyan" ? "#006666" :      // Dunkelcyan
          color == "blue" ? "#0056B3" :      // Dunkelblau
          color == "purple" ? "#400080" :    // Dunkellila
          color == "pink" ? "#800040" :      // Dunkelpink
          "#1F2937", 
          backgroundColor:
            color == "red" ? "#FF4D4D" :      // Kräftiges Hellrot  
            color == "orange" ? "#FF884D" :   // Kräftiges Hellorange  
            color == "yellow" ? "#FFD700" :   // Kräftiges Goldgelb  
            color == "emerald" ? "#2ECC71" :  // Kräftiges Smaragdgrün  
            color == "cyan" ? "#17D4FC" :     // Kräftiges Cyanblau  
            color == "blue" ? "#1E90FF" :     // Kräftiges Hellblau  
            color == "purple" ? "#A64DFF" :   // Kräftiges Lila  
            color == "pink" ? "#FF4DA6" :     // Kräftiges Pink  
            "#E5E7EB",
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
        moduleSessions.map((module, index) => {
          //const percent = getAmount(index)
          const { marginLeft, marginRight, marginTop,marginBottom } = getMargins(index, moduleSessions.length + 1);

            return (

              <View style={{
                marginLeft, marginRight, marginTop,marginBottom
              }}
              key={`${module.$id}-${index}`}

              >
                <SessionProgress 
                selected={selected == index} 
                setSelected={()=> {setSelected(index)}} 
                first={index == 0}  
                progressr={module.percent}
                strokeColor={module.color == "red" ? "#FF4D4D" :      // Kräftiges Hellrot  
                  module.color == "orange" ? "#FF884D" :   // Kräftiges Hellorange  
                  module.color == "yellow" ? "#FFD700" :   // Kräftiges Goldgelb  
                  module.color == "emerald" ? "#2ECC71" :  // Kräftiges Smaragdgrün  
                  module.color == "cyan" ? "#17D4FC" :     // Kräftiges Cyanblau  
                  module.color == "blue" ? "#1E90FF" :     // Kräftiges Hellblau  
                  module.color == "purple" ? "#A64DFF" :   // Kräftiges Lila  
                  module.color == "pink" ? "#FF4DA6" :     // Kräftiges Pink  
                  "#E5E7EB"}
                > 
                     <CircularButton index={index} color={module.color} session={module}> 
                        <Icon name={module.iconName} size={20} color="white"/>
                      </CircularButton>
                </SessionProgress>
              </View>
            )
    })
    }
    <SessionProgress selected={selected == moduleSessions.length +1}
                     setSelected={()=> setSelected(moduleSessions.length +1)}
                     first={false} progress={10}
                     progressr={percentA.bad}
                        >
                    <CircularButton index={moduleSessions.length +1} >
                        <Icon name={"file"} size={20} color="white"/>
                    </CircularButton>
    </SessionProgress>
    
    </ScrollView>

  )
}

export default RoadMap