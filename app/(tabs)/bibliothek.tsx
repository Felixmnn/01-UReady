import { View, Text, TouchableOpacity,FlatList,Animated, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Tabbar from '@/components/(tabs)/tabbar'
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import Svg, { Circle } from "react-native-svg";
import VektorCircle from '@/components/(karteimodul)/vektorCircle';
import { useWindowDimensions } from 'react-native';
import Karteikarte from '@/components/(karteimodul)/karteiKarte';
import AllModules from '@/components/(bibliothek)/(pages)/allModules';
import SingleModule from '@/components/(bibliothek)/(pages)/singleModule';
import {loadModules, loadQuestions} from "../../lib/appwriteDaten"
import CreateQuestion from '@/components/(bibliothek)/(pages)/createQuestion';
import { getModules } from '@/lib/appwriteQuerys';
import { useGlobalContext } from '@/context/GlobalProvider';
import { router } from 'expo-router';

const Bibliothek = () => {
  const {user, isLoggedIn,isLoading, reloadNeeded, setReloadNeeded } = useGlobalContext();
  const [last7Hidden, setLast7Hidden ] = useState(true)
  const { width } = useWindowDimensions(); // Bildschirmbreite holen
    const isVertical = width > 700;
    const toTight = width > 800;
    const longVertical = width > 900;
    const [selected, setSelected] = useState("AllModules")
    const [modules,setModules] = useState(null)
    const [loading,setLoading] = useState(true)
    const [selectedModule, setSelectedModule] = useState(null)

    const fetchModules = async () => {
      if (!user) return;
      console.log("User:",user);
      setLoading(true);
      await loadQuestions();
      const modulesLoaded = await getModules(user.$id);
      if (modulesLoaded) {
        setModules(modulesLoaded);
      }
      setLoading(false);
    };

    useEffect(() => {
        if (!isLoading && (!user || !isLoggedIn)) {
          router.replace("/"); // oder "/sign-in"
        }
      }, [user, isLoggedIn, isLoading]);

      useEffect(() => {
        console.log("ReloadNeeded",reloadNeeded)
        fetchModules()
      },[reloadNeeded])

    useEffect(() => {
      if (user === null) return;
      fetchModules()
    }
    ,[user])

    const SkeletonItem = () => {
      const opacity = new Animated.Value(0.3);
    
      useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
          ])
        ).start();
      }, []);
    
      return (
        <Animated.View
          style={{
            backgroundColor: "#e0e0e0",
            height: 80,
            marginVertical: 8,
            borderRadius: 10,
            opacity,
          }}
        />
      );
    };
    
     const SkeletonList = () => (
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={() => <SkeletonItem />}
        keyExtractor={(item) => item.toString()}
      />
    );
    


  return (
      <Tabbar content={()=> { return(
        
        <View className='flex-1 '>
          {loading ? (
          <SkeletonList />
        ) : (
        <View className='flex-1'>
        {selected == "AllModules" ? <AllModules setSelected={setSelected} modules={modules} setSelectedModule={setSelectedModule}/> : null}
        {selected == "SingleModule" ? <SingleModule setSelectedScreen={setSelected} module={modules.documents[selectedModule]}  /> : null}
        {selected == "CreateQuestion" ? <CreateQuestion setSelected2={setSelected} module={modules} selectedModule={selectedModule} /> : null}

        </View>
        )
        }
        </View>
        
    )}} page={"Bibliothek"} hide={selected == "SingleModule" || selected == "CreateQuestion"  ? true : false}/>
  )
}

export default Bibliothek