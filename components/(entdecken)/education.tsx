import { View, Text } from 'react-native'
import React from 'react'
import { countryList } from '@/assets/exapleData/countryList'

const EudcationFilters = ({country=countryList[0], setModules, setLoading}) => {
  return (
    <View>
      <Text>EudcationFilters</Text>
    </View>
  )
}

export default EudcationFilters