import React from 'react'
import { countryList } from '@/assets/exapleData/countryList'
import { ScrollView } from 'react-native-gesture-handler'
import FilterPicker from './filterPicker'
import { useTranslation } from 'react-i18next'

const OtherFilters = ({
  setFilters,
  filters}
:{
    setFilters: (filters: any) => void,
    filters: any
}) => {
    const { t } = useTranslation();

    const subjectList = t("school.subjects", { returnObjects: true });
    const subjects = Object.values(subjectList).map((s: any) => s.name);

  return (
    <ScrollView className=' w-full' >
      <FilterPicker
            title='Fächer'
            options={subjects}
            selectedOptions={filters.schoolSubjects}
            handlePress={(type)=>{
              if (!filters.schoolSubjects) {setFilters({...filters, schoolSubjects: [type]}) ;return;}
              if (filters.schoolSubjects && filters.schoolSubjects.includes(type)) {
                setFilters({...filters, schoolSubjects: filters.schoolSubjects.filter((t: string) => t !== type)});
              } else {
                setFilters({...filters, schoolSubjects: [...filters.schoolSubjects, type]});
              }
            }}
        />
      
    </ScrollView>
  )
}

export default OtherFilters