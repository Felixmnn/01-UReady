import { View, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import CreateModule from '../createModule';

const AddModule = ({isVisible, setIsVisible, newModule, setNewModule,amount=0}) => {
    const {user} = useGlobalContext();

    const [loading , setLoading] = useState(false);

    useEffect(() => {
        setIsVisible(false)
    }
    , [amount])

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
    >
        <View  className='absolute top-0 left-0 w-full h-full justify-center items-center '>
            <CreateModule newModule={newModule} setNewModule={setNewModule} setUserChoices={()=> setIsVisible(false)} isModal={setIsVisible}/>
        </View>
    </Modal>
  )
}

export default AddModule