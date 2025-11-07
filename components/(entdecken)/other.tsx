import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import FilterPicker from "./filterPicker";
import { useTranslation } from "react-i18next";

const OtherFilters = ({
  setFilters,
  filters,
}: {
  setFilters: (filters: any) => void;
  filters: any;
}) => {
  const { t } = useTranslation();

  const subjectList = t("school.subjects", { returnObjects: true });
  const subjects = Object.values(subjectList).map((s: any) => s.name);

  const searchTextOptions = [
    { label: t("entdecken.name"), value: "NAME" },
    { label: t("entdecken.description"), value: "DESCRIPTION" },
    { label: t("entdecken.creator"), value: "CREATOR" },
  ];

  const minimumQuestionsOptions = [
    { label: "0 " + t("entdecken.questions"), value: 0 },
    { label: "≥ 20 " + t("entdecken.questions"), value: 20 },
    { label: "≥ 50 " + t("entdecken.questions"), value: 50 },
    { label: "≥ 100 " + t("entdecken.questions"), value: 100 },
  ];

  const includeCopiesOptions = [
    { label: t("entdecken.includeCopiesYes"), value: true },
    { label: t("entdecken.includeCopiesNo"), value: false },
  ];

  return (
    <ScrollView className=" w-full">
      {/*
      <FilterPicker
        title={t("entdecken.subjects")}
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
      />*/}
      <FilterPicker
        title={t("entdecken.textSearchType")}
        options={searchTextOptions.map((option) => option.label)}
        selectedOptions={
          filters.textSearchType
            ? [
                searchTextOptions.find(
                  (option) => option.value === filters.textSearchType
                )?.label,
              ]
            : []
        }
        handlePress={(type) => {
          const selectedOption = searchTextOptions.find(
            (option) => option.label === type
          );
          if (selectedOption) {
            setFilters({
              ...filters,
              textSearchType: selectedOption.value,
            });
          }
        }}
      />
      <FilterPicker
        title={t("entdecken.minimumQuestionsAmount")}
        options={minimumQuestionsOptions.map((option) => option.label)}
        selectedOptions={
          filters.minQuestions !== undefined
            ? [
                minimumQuestionsOptions.find(
                  (option) => option.value === filters.minQuestions
                )?.label,
              ]
            : []
        }
        handlePress={(type) => {
          const selectedOption = minimumQuestionsOptions.find(
            (option) => option.label === type
          );
          if (selectedOption) {
            setFilters({
              ...filters,
              minQuestions: selectedOption.value,
            });
          }
        }}
      />
      <FilterPicker
        title={t("entdecken.includeCopies")}
        options={includeCopiesOptions.map((option) => option.label)}
        selectedOptions={
          filters.includeCopies !== undefined
            ? [
                includeCopiesOptions.find(
                  (option) => option.value === filters.includeCopies
                )?.label,
              ]
            : []
        }
        handlePress={(type) => {
          const selectedOption = includeCopiesOptions.find(
            (option) => option.label === type
          );
          if (selectedOption) {
            setFilters({
              ...filters,
              includeCopies: selectedOption.value,
            });
          }
        }}
      />
    </ScrollView>
  );
};

export default OtherFilters;
