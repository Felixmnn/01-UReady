import { View, Text } from 'react-native'
import React, { useState } from 'react'
import SessionProgress from '../sessionProgress'

const RoadMap = ({data, selected, setSelected, questions}) => { 
  function getAmount (index) {
    console.log("Questions and Module",module,questions)
    let bad = 0
    let ok = 0
    let good = 0
    let great = 0
    let total = 0
    for (let i = 0; i < questions.length; i++) {
      console.log(questions[i].sessionID,data[index],questions[i].status, index )
      if (questions[i].sessionID == data[index] && questions[i].status == "BAD" ){
        bad += 1
      } else if (questions[i].sessionID == data[index] && questions[i].status == "OK" ){
        ok += 1
      } else if (questions[i].sessionID == data[index] && questions[i].status == "GOOD" ){
        good += 1
      } else if (questions[i].sessionID == data[index] && questions[i].status == "GREAT" ){
        great += 1
      } if (questions[i].sessionID == data[index]) {
        total += 1
      }
    }
    console.log({bad:Math.floor(bad/total*100),ok:Math.floor(bad/total*100),good:Math.floor(bad/total*100),great:Math.floor(bad/total*100)})
    return {bad:Math.floor(bad/total*100),ok:Math.floor(bad/total*100),good:Math.floor(bad/total*100),great:Math.floor(bad/total*100)}
  }
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
  return (
    <View>
      {
        data.map((module, index) => {
          const percent = getAmount(index)
            return (
                <SessionProgress 
                selected={selected == index} 
                setSelected={()=> setSelected(index)} 
                first={index == 0}  
                progressr={percent.bad}
                progressy={percent.ok}
                progressg={percent.good}
                progressb={percent.great} 
>
                    <Text className='text-white'>S{index +1}</Text>
                </SessionProgress>
            )
    })
    }
    <SessionProgress selected={selected == data.length +1}
                     setSelected={()=> setSelected(data.length +1)}
                     first={false} progress={10}
                     progressr={percentA.bad}
                      progressy={percentA.ok}
                      progressg={percentA.good}
                      progressb={percentA.great}  >
                    <Text className='text-white'>All</Text>
    </SessionProgress>
    </View>

  )
}

export default RoadMap