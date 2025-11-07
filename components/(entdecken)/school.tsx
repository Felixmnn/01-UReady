import { ScrollView } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import FilterPicker from "./filterPicker";
const SchoolFilters = ({
  setFilters,
  filters,
}: {
  setFilters: (filters: any) => void;
  filters: any;
}) => {
  const { t } = useTranslation();

  const grades = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];
  const schoolTypesRaw = [
    "grundschule",
    "hauptschule",
    "realschule",
    "gesamtschule",
    "gymnasium",
    "berufsschule",
    "sonstige",
  ];
  const schoolTypeObj = schoolTypesRaw.map((type) =>
    t(`school.type.${type}`, { returnObjects: true })
  );

  const subjectList = t("school.subjects", { returnObjects: true });
  const subjects = Object.values(subjectList).map((s: any) => s.name);

  // Safely extract titles from translation objects
  const schoolTypeTitles = schoolTypeObj.map(
    (type: any) => type?.title ?? String(type)
  );

  return (
    <ScrollView className=" w-full  ">
      <FilterPicker
        title={t("entdecken.schooltype")}
        options={schoolTypeTitles}
        selectedOptions={filters.schoolType}
        handlePress={(type) => {
          if (!filters.schoolType) {
            setFilters({ ...filters, schoolType: [type] });
            return;
          }
          if (filters.schoolType && filters.schoolType.includes(type)) {
            setFilters({
              ...filters,
              schoolType: filters.schoolType.filter((t: string) => t !== type),
            });
          } else {
            setFilters({
              ...filters,
              schoolType: [...filters.schoolType, type],
            });
          }
        }}
      />

      <FilterPicker
        title={t("entdecken.schoolGrade")}
        options={grades}
        selectedOptions={filters.schoolGrades}
        handlePress={(type) => {
          if (!filters.schoolGrades) {
            setFilters({ ...filters, schoolGrades: [type] });
            return;
          }
          if (filters.schoolGrades && filters.schoolGrades.includes(type)) {
            setFilters({
              ...filters,
              schoolGrades: filters.schoolGrades.filter(
                (t: string) => t !== type
              ),
            });
          } else {
            setFilters({
              ...filters,
              schoolGrades: [...filters.schoolGrades, type],
            });
          }
        }}
      />

      <FilterPicker
        title={t("entdecken.schoolGrade")}
        options={subjects}
        selectedOptions={filters.schoolSubjects}
        handlePress={(type) => {
          if (!filters.schoolSubjects) {
            setFilters({ ...filters, schoolSubjects: [type] });
            return;
          }
          if (filters.schoolSubjects && filters.schoolSubjects.includes(type)) {
            setFilters({
              ...filters,
              schoolSubjects: filters.schoolSubjects.filter(
                (t: string) => t !== type
              ),
            });
          } else {
            setFilters({
              ...filters,
              schoolSubjects: [...filters.schoolSubjects, type],
            });
          }
        }}
      />
    </ScrollView>
  );
};

export default SchoolFilters;
