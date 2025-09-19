import { View, Text, Image, Dimensions } from "react-native";
import React, { useEffect, useState, useTransition } from "react";
import ContinueBox from "../(signUp)/(components)/continueBox";
import languages from "@/assets/exapleData/languageTabs.json";
import { useGlobalContext } from "@/context/GlobalProvider";
import BotCenter from "../(signUp)/botCenter";
import { useTranslation } from "react-i18next";

const PageOptions = ({
  userChoices,
  setUserChoices,
}: {
  userChoices: string | null;
  setUserChoices: React.Dispatch<
    React.SetStateAction<"GENERATE" | "DISCOVER" | "CREATE" | null>
  >;
}) => {
  const { t } = useTranslation();
  const { width } = Dimensions.get("window");

  const options = [
    {
      text: t("gettingStarted.setTogether"),
      colorBorder: "#7a5af8",
      colorBG: "#372292",
      iconName: "bot",
      handlePress: () => setUserChoices("GENERATE"),
    },
    {
      text: t("gettingStarted.comilitones"),
      colorBorder: "#20c1e1",
      colorBG: "#0d2d3a",
      iconName: "search",
      handlePress: () => setUserChoices("DISCOVER"),
    },
    {
      text: t("gettingStarted.createSet"),
      colorBorder: "#4f9c19",
      colorBG: "#2b5314",
      iconName: "cubes",
      handlePress: () => setUserChoices("CREATE"),
    },
  ];

  return (
    <View className="flex-1 w-full items-center justify-center ">
      {/* Überschrift */}
      {width < 700 ? (
        <View className="flex-1 w-full">
          <View
            className="items-center justify-center "
            style={{
              marginTop: 50,
            }}
          >
            <BotCenter
              message={t("gettingStarted.timeToStart")}
              imageSource="Waving"
            />
          </View>

          {/* Carousel */}
          {
            <View className="w-full items-center justify-center">
              {options.map((item, index) => {
                return (
                  <View key={index} className="h-[100px] w-full">
                    <ContinueBox
                      text={item.text}
                      colorBorder={item.colorBorder}
                      colorBG={item.colorBG}
                      iconName={item.iconName}
                      handlePress={item.handlePress}
                      horizontal={width > 700 ? false : true}
                      selected={true}
                    />
                  </View>
                );
              })}
            </View>
          }
        </View>
      ) : (
        <View className="w-full flex-1 items-center justify-center">
          <BotCenter
            message={t("gettingStarted.timeToStart")}
            imageSource="Frage"
          />

          <View className="flex-row">
            <ContinueBox
              text={t("gettingStarted.setTogether")}
              colorBorder={"#7a5af8"}
              colorBG={"#372292"}
              iconName={"bot"}
              handlePress={() => setUserChoices("GENERATE")}
              selected={true}
            />
            <ContinueBox
              text={t("gettingStarted.comilitones")}
              colorBorder={"#20c1e1"}
              colorBG={"#0d2d3a"}
              iconName={"search"}
              handlePress={() => setUserChoices("DISCOVER")}
              selected={true}
            />
            <ContinueBox
              text={t("gettingStarted.createSet")}
              colorBorder={"#4f9c19"}
              colorBG={"#2b5314"}
              iconName={"cubes"}
              handlePress={() => setUserChoices("CREATE")}
              selected={true}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default PageOptions;
