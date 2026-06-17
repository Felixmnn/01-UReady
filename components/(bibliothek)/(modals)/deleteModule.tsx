import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native'
import React from 'react'
import { deleteDocument } from '@/lib/appwriteDelete'; 
import Icon from "react-native-vector-icons/FontAwesome5";
import { updateModuleData } from '@/lib/appwriteUpdate';
import { useTranslation } from 'react-i18next';
import ShareModuleIcon from '../(components)/shareModule';
import { useGlobalContext } from '@/context/GlobalProvider';
import Offline from '@/components/(general)/offline';
import { deleteModuleFromMMKV } from '@/lib/mmkvFunctions';
import { module } from '@/types/appwriteTypes';
import ColorPicker from '@/components/(general)/colorPicker';

type ModuleCategory = "SCHOOL" | "UNIVERSITY" | "EDUCATION" | "OTHER";
type ChipOption = { key: string; label: string };


/*Name might be missleading - this modal is for 
  ‼️editing the module 
  data and also for deleting the module
*/
const DeleteModule = ({
  moduleID = "id",
  moduleName = "Name",
  description = "",
  tags = [],
  isVisible = false,
  setIsVisible,
  modules,
  setModules,
  setSelectedScreen,
  setModule,
  module
}: {
  moduleID: string,
  moduleName: string,
  description: string,
  tags: string[],
  isVisible: boolean, 
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  modules: module[],
  setModules: React.Dispatch<React.SetStateAction<module[]>>,
  setSelectedScreen: React.Dispatch<React.SetStateAction<string>>,
  setModule: React.Dispatch<React.SetStateAction<module>>,
  module: module,
}) => {
  const normalizeDegreeKey = (value: string) => {
    const upper = value.toUpperCase();
    if (upper === "STATE_EXAM") return "STAATSEXAMEN";
    if (upper === "OTHERS") return "OTHER";
    return upper;
  };

  const [showWarning, setShowWarning] = React.useState(false);  
  const [savedChanges, setSavedChanges] = React.useState(false);
  const { t } = useTranslation();

  const educationObjects = t("education.educationKategories", {
    returnObjects: true,
  }) as Record<string, { name: string }>;
  const educationSubjectObjectsAll = t("education.educationSubjects", {
    returnObjects: true,
  }) as Record<string, Record<string, { name: string }>>;

  const mapEducationCategoryToKey = (value: string) => {
    if (!value) return "";
    if (value in educationObjects) return value;

    const byName = Object.entries(educationObjects).find(
      ([, category]) => category?.name === value
    )?.[0];

    return byName ?? value;
  };

  const mapEducationSubjectToKey = (value: string, categoryKey?: string) => {
    if (!value) return "";

    if (categoryKey && educationSubjectObjectsAll[categoryKey]) {
      const categorySubjects = educationSubjectObjectsAll[categoryKey];
      if (value in categorySubjects) return value;

      const byName = Object.entries(categorySubjects).find(
        ([, subject]) => subject?.name === value
      )?.[0];

      if (byName) return byName;
    }

    for (const subjects of Object.values(educationSubjectObjectsAll)) {
      if (value in subjects) return value;

      const byName = Object.entries(subjects).find(
        ([, subject]) => subject?.name === value
      )?.[0];

      if (byName) return byName;
    }

    return value;
  };

  const [newModuleName, setNewModuleName] = React.useState(moduleName);
  const [newModuleDescription, setNewModuleDescription] = React.useState(description);
  const [newModuleColor, setNewModuleColor] = React.useState<string | null>(module?.color ?? null);
  const [newTags, setNewTags] = React.useState(tags);
  const [selectedCategory, setSelectedCategory] = React.useState<ModuleCategory>((module?.kategoryType as ModuleCategory) || "UNIVERSITY");
  const [selectedUniversityDegree, setSelectedUniversityDegree] = React.useState<string>(
    module?.studiengangKathegory?.[0] || module?.creationUniversityProfession || ""
  );
  const [selectedUniversitySubject, setSelectedUniversitySubject] = React.useState<string>(module?.creationUniversitySubject?.[0] || "");
  const [selectedSchoolType, setSelectedSchoolType] = React.useState<string>(module?.creationSchoolForm || "");
  const [selectedSchoolGrade, setSelectedSchoolGrade] = React.useState<string>(module?.creationKlassNumber ? String(module.creationKlassNumber) : "");
  const [selectedSchoolSubject, setSelectedSchoolSubject] = React.useState<string>(module?.creationSubject?.[0] || "");
  const [selectedEducationCategory, setSelectedEducationCategory] = React.useState<string>(
    mapEducationCategoryToKey(module?.creationEducationKathegory || "")
  );
  const [selectedEducationSubject, setSelectedEducationSubject] = React.useState<string>(
    mapEducationSubjectToKey(
      module?.creationEducationSubject || "",
      mapEducationCategoryToKey(module?.creationEducationKathegory || "")
    )
  );
  const [selectedOtherSubject, setSelectedOtherSubject] = React.useState<string>(module?.creationSubject?.[0] || "");

  const categoryOptions: { label: string; value: ModuleCategory }[] = [
    { label: t("entdecken.school"), value: "SCHOOL" },
    { label: t("entdecken.university"), value: "UNIVERSITY" },
    { label: t("entdecken.education"), value: "EDUCATION" },
    { label: t("entdecken.moreFilters"), value: "OTHER" },
  ];

  const degreeObjects = t("universityCategories.degrees", {
    returnObjects: true,
  }) as Record<string, { name: string }>;
  const universityDegreeOptions: ChipOption[] = Object.keys(degreeObjects).map((key) => ({
    key,
    label: degreeObjects[key]?.name || key,
  }));

  const schoolTypesRaw = [
    "grundschule",
    "hauptschule",
    "realschule",
    "gesamtschule",
    "gymnasium",
    "berufsschule",
    "sonstige",
  ];

  const schoolTypeOptions: ChipOption[] = schoolTypesRaw.map((type) => ({
    key: type,
    label: (t(`school.type.${type}`, { returnObjects: true }) as { title?: string })?.title || type,
  }));

  const schoolGrades: ChipOption[] = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
  ].map((grade) => ({ key: grade, label: grade }));

  const schoolSubjectObjects = t("school.subjects", { returnObjects: true }) as Record<string, { name: string }>;
  const schoolSubjectOptions: ChipOption[] = Object.keys(schoolSubjectObjects).map((key) => ({
    key: schoolSubjectObjects[key]?.name || key,
    label: schoolSubjectObjects[key]?.name || key,
  }));

  const universityObjects = t("universityCategories.universitySubjects", {
    returnObjects: true,
  }) as Record<string, { name: string }>;
  const universitySubjectOptions: ChipOption[] = Object.keys(universityObjects).map((key) => ({
    key: universityObjects[key]?.name || key,
    label: universityObjects[key]?.name || key,
  }));

  const educationCategoryOptions: ChipOption[] = Object.keys(educationObjects).map((key) => ({
    key,
    label: educationObjects[key]?.name || key,
  }));

  const educationSubjectObjects = selectedEducationCategory
    ? (t(`education.educationSubjects.${selectedEducationCategory}`, {
        returnObjects: true,
      }) as Record<string, { name: string }>)
    : {};
  const educationSubjectOptions: ChipOption[] = Object.keys(educationSubjectObjects).map((key) => ({
    key,
    label: educationSubjectObjects[key]?.name || key,
  }));

  const otherSubjectOptions = schoolSubjectOptions;

  function renderChipRow(
    title: string,
    options: ChipOption[],
    selectedValue: string,
    onPress: (value: string) => void
  ) {
    return (
      <View className="mb-3">
        <Text className="text-white font-semibold mb-1">{title}</Text>
        <FlatList
          horizontal
          data={options}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`px-3 py-2 rounded-full mr-2 ${selectedValue === item.key ? "bg-blue-600" : "bg-gray-700"}`}
              onPress={() => {
                onPress(item.key);
                setSavedChanges(false);
              }}
            >
              <Text className="text-white text-[12px]">{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  function changeColor(newColor: string) {
    setNewModuleColor(newColor === "" ? null : newColor);
    setSavedChanges(false);
  }

  const noCategoryChange =
    selectedCategory === (module?.kategoryType as ModuleCategory) &&
    normalizeDegreeKey(selectedUniversityDegree || "") === normalizeDegreeKey(module?.studiengangKathegory?.[0] || module?.creationUniversityProfession || "") &&
    (selectedUniversitySubject || "") === (module?.creationUniversitySubject?.[0] || "") &&
    (selectedSchoolType || "") === (module?.creationSchoolForm || "") &&
    (selectedSchoolGrade || "") === (module?.creationKlassNumber ? String(module.creationKlassNumber) : "") &&
    (selectedSchoolSubject || "") === (module?.creationSubject?.[0] || "") &&
    mapEducationCategoryToKey(selectedEducationCategory || "") === mapEducationCategoryToKey(module?.creationEducationKathegory || "") &&
    mapEducationSubjectToKey(selectedEducationSubject || "", mapEducationCategoryToKey(selectedEducationCategory || "")) === mapEducationSubjectToKey(module?.creationEducationSubject || "", mapEducationCategoryToKey(module?.creationEducationKathegory || "")) &&
    (selectedOtherSubject || "") === (module?.creationSubject?.[0] || "");

  const hasUnsavedChanges =
    newModuleName !== moduleName ||
    newModuleDescription !== description ||
    newModuleColor !== (module?.color ?? null) ||
    JSON.stringify(newTags) !== JSON.stringify(tags) ||
    !noCategoryChange;

  const hasArchivedTag = newTags.includes("archived");

  async function handleDelete() {
    if (!showWarning) {
      setShowWarning(true);
      return;
    }
    try  {
      
      deleteModuleFromMMKV(module.name);
      await deleteDocument(moduleID);
    const updatedModules = modules.filter((module:module) => module.$id !== moduleID);
    setModules(updatedModules);
    } catch (error) {
      if (__DEV__) {  
        console.error("Error deleting module:", error);
      }
    }
    const modulesFiltered = modules.filter((mod:module) => mod.$id !== moduleID);
    setModules(modulesFiltered);
        setIsVisible(false);

    setSelectedScreen("AllModules");

  }

  async function handleSaveChanges() {
    const audienceData =
      selectedCategory === "UNIVERSITY"
        ? {
            creationUniversityProfession: selectedUniversityDegree || null,
            studiengangKathegory: selectedUniversityDegree
              ? [normalizeDegreeKey(selectedUniversityDegree)]
              : [],
            creationUniversitySubject: selectedUniversitySubject ? [selectedUniversitySubject] : [],
            creationSchoolForm: null,
            creationKlassNumber: null,
            creationEducationKathegory: null,
            creationEducationSubject: null,
            creationSubject: [],
          }
        : selectedCategory === "SCHOOL"
        ? {
            creationUniversityProfession: null,
            studiengangKathegory: [],
            creationUniversitySubject: [],
            creationSchoolForm: selectedSchoolType || null,
            creationKlassNumber: selectedSchoolGrade ? Number(selectedSchoolGrade) : null,
            creationEducationKathegory: null,
            creationEducationSubject: null,
            creationSubject: selectedSchoolSubject ? [selectedSchoolSubject] : [],
          }
        : selectedCategory === "EDUCATION"
        ? {
            creationUniversityProfession: null,
            studiengangKathegory: [],
            creationUniversitySubject: [],
            creationSchoolForm: null,
            creationKlassNumber: null,
            creationEducationKathegory: mapEducationCategoryToKey(selectedEducationCategory || "") || null,
            creationEducationSubject:
              mapEducationSubjectToKey(
                selectedEducationSubject || "",
                mapEducationCategoryToKey(selectedEducationCategory || "")
              ) || null,
            creationSubject: [],
          }
        : {
            creationUniversityProfession: null,
            studiengangKathegory: [],
            creationUniversitySubject: [],
            creationSchoolForm: null,
            creationKlassNumber: null,
            creationEducationKathegory: null,
            creationEducationSubject: null,
            creationSubject: selectedOtherSubject ? [selectedOtherSubject] : [],
          };

    const nextData = {
      name: newModuleName,
      description: newModuleDescription,
      color: newModuleColor?.toUpperCase(),
      tags: newTags,
      kategoryType: selectedCategory,
      ...audienceData,
    };

    if ((newModuleName === moduleName && newModuleDescription === description && newModuleColor === (module?.color ?? null) && JSON.stringify(newTags) === JSON.stringify(tags) && noCategoryChange)) {
      setIsVisible(false);
      return;
    } else {
      try {
      await updateModuleData(moduleID , nextData as any)
      setModules((prevModules: any) => {
        return prevModules.map((mod: any) => {
          if (mod.$id === moduleID) {
            return {
              ...mod,
              ...nextData,
            };
          }
          return mod;
        }); 
      });
      setModule((prevModule: any) => {
        return {
          ...prevModule,
          ...nextData,
        };
      });
      } catch (error) {
        if (__DEV__) {
        console.error(error);
        }
        return;
      }
      setSavedChanges(true);
    }
  }

  const { isOffline } = useGlobalContext();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <View className="w-full h-full bg-[#0c111d]">
        <View className="px-5 pt-6 pb-4 border-b border-gray-800 bg-[#0f1627]">
          <View className="flex-row items-center justify-between">
            <View className='flex-row justify-start items-center'>
              <TouchableOpacity
                className="h-9 w-9 rounded-lg bg-gray-800 items-center justify-center mr-3"
                onPress={() => setIsVisible(false)}
              >
                <Icon name="arrow-left" size={14} color="white" />
              </TouchableOpacity>

              <View className=" py-2">
                {!hasUnsavedChanges ? ( <Text className="text-white text-[20px] font-bold py-2">{t("deleteModule.titleEdit")}</Text>) : (
                <TouchableOpacity
                  onPress={handleSaveChanges}
                  disabled={!hasUnsavedChanges || savedChanges}
                  className={`rounded-lg px-4 py-2 ${!hasUnsavedChanges || savedChanges ? "bg-gray-700" : "bg-blue-600"}`}
                >
                  <Text className="text-white font-semibold">{t("deleteModule.saveChanges")}</Text>
                </TouchableOpacity>
                  )}
                </View>
              </View>
                <ShareModuleIcon moduleID={moduleID} />
            </View>
        </View>

        {isOffline ? (
          <Offline />
        ) : (
          <ScrollView className="flex-1 px-2 py-4" contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
            <View className="rounded-xl border border-gray-800 bg-gray-900 p-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white font-bold text-[16px] mb-1">{t("deleteModule.sectionGeneralTitle")}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setNewTags((prevTags) =>
                      prevTags.includes("archived")
                        ? prevTags.filter((tag) => tag !== "archived")
                        : [...prevTags, "archived"]
                    );
                    setSavedChanges(false);
                  }}
                  className={`px-3 py-2 rounded-lg flex-row items-center ${hasArchivedTag ? "bg-amber-600" : "bg-gray-800"}`}
                >
                  <Icon name="archive" size={12} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    {hasArchivedTag ? "Archiviert" : "Archivieren"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-white font-semibold text-[14px] mb-2">{t("deleteModule.moduleName")}</Text>
              <TextInput
                maxLength={50}
                className="mb-4 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700"
                placeholder={t("deleteModule.typeModuleName")}
                placeholderTextColor="gray"
                value={newModuleName}
                onChangeText={(text) => { setNewModuleName(text); setSavedChanges(false); }}
              />

              <Text className="text-white font-semibold text-[14px] mb-2">{t("deleteModule.moduleDescription")}</Text>
              <TextInput
                className="mb-4 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700"
                placeholder={t("deleteModule.typeModuleDescription")}
                multiline
                numberOfLines={3}
                maxLength={200}
                placeholderTextColor="gray"
                value={newModuleDescription}
                onChangeText={(text) => { setNewModuleDescription(text); setSavedChanges(false); }}
              />

              <ColorPicker
                selectedColor={newModuleColor?.toLowerCase() || ""}
                changeColor={(newColor) => changeColor(newColor)}
                indexItem={0}
                title={t("createModule.color")}
              />
            </View>

            <View className="rounded-xl border border-gray-800 bg-gray-900 p-4 mb-4">
              <Text className="text-white font-bold text-[16px] mb-1">{t("deleteModule.sectionAudienceTitle")}</Text>
              <Text className="text-gray-400 text-[12px] mb-4">{t("deleteModule.sectionAudienceDescription")}</Text>

              {renderChipRow(
                t("entdecken.moreFilters"),
                categoryOptions.map((c) => ({ key: c.value, label: c.label })),
                selectedCategory,
                (value) => {
                  setSelectedCategory(value as ModuleCategory);
                }
              )}

              {selectedCategory === "UNIVERSITY" ? (
                <>
                  {renderChipRow(
                    t("entdecken.educationGoal"),
                    universityDegreeOptions,
                    selectedUniversityDegree,
                    setSelectedUniversityDegree
                  )}
                  {renderChipRow(
                    t("entdecken.fieldOfStudy"),
                    universitySubjectOptions,
                    selectedUniversitySubject,
                    setSelectedUniversitySubject
                  )}
                </>
              ) : null}

              {selectedCategory === "SCHOOL" ? (
                <>
                  {renderChipRow(
                    t("entdecken.schooltype"),
                    schoolTypeOptions,
                    selectedSchoolType,
                    setSelectedSchoolType
                  )}
                  {renderChipRow(
                    t("entdecken.schoolGrade"),
                    schoolGrades,
                    selectedSchoolGrade,
                    setSelectedSchoolGrade
                  )}
                  {renderChipRow(
                    t("entdecken.subjects"),
                    schoolSubjectOptions,
                    selectedSchoolSubject,
                    setSelectedSchoolSubject
                  )}
                </>
              ) : null}

              {selectedCategory === "EDUCATION" ? (
                <>
                  {renderChipRow(
                    t("entdecken.educationCategory"),
                    educationCategoryOptions,
                    selectedEducationCategory,
                    (value) => {
                      setSelectedEducationCategory(value);
                      setSelectedEducationSubject("");
                    }
                  )}
                  {selectedEducationCategory
                    ? renderChipRow(
                        t("entdecken.educationField"),
                        educationSubjectOptions,
                        selectedEducationSubject,
                        setSelectedEducationSubject
                      )
                    : null}
                </>
              ) : null}

              {selectedCategory === "OTHER"
                ? renderChipRow(
                    t("entdecken.subjects"),
                    otherSubjectOptions,
                    selectedOtherSubject,
                    setSelectedOtherSubject
                  )
                : null}
            </View>

            <View className={`rounded-xl p-4 border ${showWarning ? "bg-[#3a1518] border-[#f85149]" : "bg-[#2d1117] border-[#8b2a2f]"}`}
            style={{
              borderColor: showWarning ? "#f85149" : "#8b2a2f",
              backgroundColor: showWarning ? "#3a1518" : "#2d1117",
            }}
            >
              <Text className="text-[#f85149] font-bold text-[16px]"
              style={{
                color: showWarning ? "#f85149" : "#eab308",
              }}
              >{t("deleteModule.sectionDangerTitle")}</Text>
              <Text className="text-gray-300 text-[12px] mt-1">{t("deleteModule.sectionDangerDescription")}</Text>

              {showWarning ? (
                <View className="mb-3">
                  <Text className="text-red-100 font-bold text-base">{t("deleteModule.areYousureDelete")}</Text>
                </View>
              ) : null}

              <View className="flex-row justify-end">
                {showWarning ? (
                  <TouchableOpacity
                    onPress={() => setShowWarning(false)}
                    className="px-4 py-2 rounded-lg bg-gray-700 flex-row items-center mr-2"
                  >
                    <Text className="text-white mr-2">{t("deleteModule.cancel")}</Text>
                    <Icon name="times" size={15} color="white" />
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  onPress={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 flex-row items-center"
                >
                  <Text className="text-white mr-2">{t("deleteModule.delete")}</Text>
                  <Icon name="trash" size={15} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  )
}

export default DeleteModule
