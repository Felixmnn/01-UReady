import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import { router } from "expo-router";

const Policys = () => {
  const { t } = useTranslation();
  type PolicySection = {
    icon: string;
    title: string;
    subsections: { [key: string]: any };
    [key: string]: any;
  };

  const obj = t("info.policys", { returnObjects: true }) as Record<string, PolicySection>;
  const objKeys = Object.keys(obj);

  // State für geöffnete Sections und Subsections
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [openSubSections, setOpenSubSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubSection = (key: string) => {
    setOpenSubSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const RenderSubItems = ({
    subItems,
    parentKey,
  }: {
    subItems: { [key: string]: any };
    parentKey: string;
  }) => {
    const subItemKeys = Object.keys(subItems);

    return (
      <View className="pl-4">
        {subItemKeys.map((subKey) => {
          const uniqueKey = `${parentKey}-${subKey}`;
          const isOpen = openSubSections[uniqueKey];

          return (
            <View key={uniqueKey} className="mb-2">
              <TouchableOpacity
                onPress={() => toggleSubSection(uniqueKey)}
                className="flex-row items-center"
              >
                {subItems[subKey]["subItems"] && (
                  <Icon
                    name={isOpen ? "chevron-down" : "chevron-right"}
                    size={14}
                    color="white"
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text className="text-white font-semibold">
                  {subItems[subKey]["title"]}
                </Text>
              </TouchableOpacity>

              {isOpen && (
                <View className="pl-4">
                  <Text className="text-white mb-1">
                    {subItems[subKey]["content"]}
                  </Text>
                  {subItems[subKey]["subItems"] && (
                    <RenderSubItems
                      subItems={subItems[subKey]["subItems"]}
                      parentKey={uniqueKey}
                    />
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full w-full bg-[#0c111d] p-2">
      <View className="w-full items-center mb-2 flex-row justify-between p-2">
        <TouchableOpacity className="justify-center items-start h-[30px] w-[30px]" onPress={()=> router.push("/profil")}><Icon name="arrow-left" size={20} color={"white"} /></TouchableOpacity>
        <Text className="text-white text-2xl font-bold">{t("info.title")}</Text>
        <View style={{width:30}}/>
      </View>
      <ScrollView>
        {objKeys.map((key) => {
          const isOpen = openSections[key];

          return (
            <View className="w-full mb-2 bg-gray-800 rounded-xl" key={key}>
              <TouchableOpacity
                onPress={() => toggleSection(key)}
                className="flex-row items-center p-3"
              >
                <Icon name={obj[key]["icon"]} size={20} color={"white"} />
                <Text className="text-white ml-2 font-bold text-lg">
                  {obj[key]["title"]}
                </Text>
                <View className="ml-auto">
                  <Icon
                    name={isOpen ? "chevron-down" : "chevron-right"}
                    size={16}
                    color="white"
                  />
                </View>
              </TouchableOpacity>

              {isOpen && (
                <View className="p-2">
                  <RenderSubItems
                    subItems={obj[key]["subsections"]}
                    parentKey={key}
                  />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Policys;
