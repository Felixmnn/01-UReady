import React, { useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import HomeGeneral from '@/components/(home)/homeGeneral';
import { ScrollView, View } from 'react-native';
import HomeChat from '@/components/(home)/homeChat';

const home = () => {
  const [selected, setSelected] = useState("HomeGeneral")
  
  return (
    <Tabbar content={()=> { return(

      <View className="flex-1">
      { selected == "HomeGeneral" ? <HomeGeneral setSelectedPage={setSelected}/> : null}
      { selected == "HomeChat" ? <HomeChat setSelectedPage={setSelected}/> : null}
      </View>
  )}} page={"Home"} hide={selected == "HomeChat" ? true : false}/>
  )
}

export default home