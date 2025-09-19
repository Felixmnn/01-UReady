import React from "react";
import { useTranslation } from "react-i18next";
import FilterPicker from "./filterPicker";
import { ScrollView } from "react-native";

const UniversityFilters = ({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: any;
}) => {
  //Allgemeine Universitätsdaten

  const { t } = useTranslation();

  const degreeObject = t("universityCategories.degrees", {
    returnObjects: true,
  }) as Record<string, { name: string }>;
  const keys = Object.keys(degreeObject);
  const degreeNames = keys.map((key) => degreeObject[key].name);

  const subjectObjects = t("universityCategories.universitySubjects", {
    returnObjects: true,
  }) as Record<string, { name: string }>;
  const subjectKeys = Object.keys(subjectObjects);
  const subjectList = subjectKeys.map((key) => subjectObjects[key].name);

  return (
    <ScrollView className=" w-full  ">
      <FilterPicker
        title="Anschlussziel"
        options={degreeNames}
        selectedOptions={filters.universityDegreeType}
        handlePress={(option) => {
          console.log("Pressed: ", option);
          if (
            filters.universityDegreeType &&
            filters.universityDegreeType.includes(option)
          ) {
            setFilters({
              ...filters,
              universityDegreeType:
                filters.universityDegreeType.length > 1
                  ? filters.universityDegreeType.filter(
                      (item: string) => item !== option
                    )
                  : [],
            });
          } else {
            setFilters({
              ...filters,
              universityDegreeType: filters.universityDegreeType
                ? [...filters.universityDegreeType, option]
                : [option],
            });
          }
        }}
      />
      <FilterPicker
        title="Fachrichtung"
        options={subjectList}
        selectedOptions={filters.universityKategorie}
        handlePress={(option) => {
          console.log("Pressed: ", option);
          if (
            filters.universityKategorie &&
            filters.universityKategorie.includes(option)
          ) {
            setFilters({
              ...filters,
              universityKategorie:
                filters.universityKategorie.length > 1
                  ? filters.universityKategorie.filter(
                      (item: string) => item !== option
                    )
                  : [],
            });
          } else {
            setFilters({
              ...filters,
              universityKategorie: filters.universityKategorie
                ? [...filters.universityKategorie, option]
                : [option],
            });
          }
        }}
      />
    </ScrollView>
  );
};

export default UniversityFilters;
