import { ScrollView } from "react-native";
import React from "react";
import FilterPicker from "./filterPicker";
import { useTranslation } from "react-i18next";
const EudcationFilters = ({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: any;
}) => {
  const { t } = useTranslation();
  const eduObjects = t("education.educationKategories", {
    returnObjects: true,
  }) as { [key: string]: { name: string } };
  const eduKeys = Object.keys(eduObjects);
  const eduList = eduKeys.map((key) => eduObjects[key].name);

  const indexOfKathegory = eduKeys.findIndex(
    (key) =>
      eduObjects[key].name ===
      (filters.educationKathegory && filters.educationKathegory.length > 0
        ? filters.educationKathegory[0]
        : "")
  );
  const keyOfKathegory =
    indexOfKathegory !== -1 ? eduKeys[indexOfKathegory] : null;
  const eduSubObjects = t(`education.educationSubjects.${keyOfKathegory}`, {
    returnObjects: true,
  }) as { [key: string]: { name: string } };
  const eduSubKeys = Object.keys(eduSubObjects);
  const eduSubList = eduSubKeys.map((key) => eduSubObjects[key]?.name);

  return (
    <ScrollView className=" w-full  ">
      <FilterPicker
        title={t("entdecken.educationCategory")}
        options={eduList}
        selectedOptions={filters.educationKathegory}
        handlePress={(option) => {
          if (
            filters.educationKathegory &&
            filters.educationKathegory.includes(option)
          ) {
            setFilters({
              ...filters,
              educationKathegory: [],
              educationSubject: null,
            });
          } else {
            setFilters({
              ...filters,
              educationKathegory: [option],
            });
          }
        }}
      />
      {filters.educationKathegory && filters.educationKathegory.length > 0 && (
        <FilterPicker
          title={t("entdecken.educationField")}
          options={eduSubList}
          selectedOptions={filters.educationSubject}
          handlePress={(option) => {
            console.log("option", filters.educationSubject &&
                  filters.educationSubject.length > 0
                    ? filters.educationSubject.filter(
                        (item: string) => item !== option
                      )
                    : [],);
            if (
              filters.educationSubject &&
              filters.educationSubject.includes(option)
            ) {
              setFilters({
                ...filters,
                educationSubject:
                  filters.educationSubject &&
                  filters.educationSubject.length > 0
                    ? filters.educationSubject.filter(
                        (item: string) => item !== option
                      )
                    : [],
              });
            } else {
              setFilters({
                ...filters,
                educationSubject:
                  filters.educationSubject &&
                  filters.educationSubject.length > 0
                    ? [...filters.educationSubject, option]
                    : [option],
              });
            }
          }}
        />
      )}
    </ScrollView>
  );
};

export default EudcationFilters;
