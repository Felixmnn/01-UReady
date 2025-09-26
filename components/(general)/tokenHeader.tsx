import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import { UserUsage } from "@/types/appwriteTypes";
import { loadUserDataKathegory, loadUserUsage } from "@/lib/appwriteDaten";
import * as Updates from "expo-updates";




const TokenHeader = ({
}) => {

  const { setUserUsage, userData,userUsage, user, setUserDataKathegory } = useGlobalContext();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Minuten bis zum nächsten Energiepunkt

  // prüft, wie viel Energie refilled werden soll
  const refillEnergy = () => {
    if (!userUsage || !setUserUsage) return;
    const now = new Date();
    const lastUpdate = new Date(userUsage.streakLastUpdate);
    const diffInMs = now.getTime() - lastUpdate.getTime();
    const hoursPassed = diffInMs / (1000 * 60 * 60);
    
    if (userUsage.energy < 10) {
      // Minuten bis nächster 2h-Block
      const msTillNext =
        2 * 60 * 60 * 1000 - (diffInMs % (2 * 60 * 60 * 1000));
      const minutesLeft = Math.ceil(msTillNext / 60000);
      setTimeLeft(minutesLeft);

   
    } else {
      setTimeLeft(null);
    }

    if (userUsage.energy < 10 && hoursPassed >= 2) {
      const steps = Math.floor(hoursPassed / 2);
      const newEnergy = Math.min(10, userUsage.energy + steps);

      const newLastUpdate = new Date(
        lastUpdate.getTime() + steps * 2 * 60 * 60 * 1000
      );
      if (!setUserUsage) return;
      setUserUsage({
        ...userUsage,
        energy: newEnergy,
        streakLastUpdate: newLastUpdate.toISOString(),
        
        
      });
    }
  };




  // prüft alle 30 Sekunden
  useEffect(() => {
    const interval = setInterval(() => {
      refillEnergy();
    }, 30 * 1000);

    // sofort einmal aufrufen für initiale Anzeige
    refillEnergy();

    return () => clearInterval(interval);
  }, [userUsage]);

  const ModalStreak = () => (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <TouchableOpacity
        onPress={() => setIsVisible(false)}
        className="flex-1 items-center justify-center "
      >
        <View className="bg-gray-800 p-5 rounded-xl shadow-lg items-center">
          <Image
            source={require("@/assets/streak.gif")}
            style={{
              height: 80,
              width: 80,
              resizeMode: "contain",
              borderRadius: 0,
            }}
          />
          <Text
            className="text-red-500 text-center"
            style={{ color: "orange" }}
          >
            {t("tokenHeader.youHave")} {userUsage?.streak}{" "}
            {t("tokenHeader.daysInARow")}
          </Text>
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-full"
          >
            <Text className="text-white font-bold">
              {t("tokenHeader.close")}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View className="w-full justify-between">
      <View className="w-full flex-row justify-between">
        <ModalStreak />
        {/* Streak */}
        <TouchableOpacity
          className="flex-row m-2 px-5 pt-2"
          onPress={() => setIsVisible(true)}
        >
          <Icon name="fire" size={20} color={"white"} />
          <Text className="text-white font-bold text-[15px] ml-2">
            {userUsage?.streak}
          </Text>
        </TouchableOpacity>

        {/* Microchip + Energie */}
        <View className="flex-row m-2 pt-2 px-5">
          <TouchableOpacity
            className="flex-row mx-5"
            onPress={() => setMoreVisible(!moreVisible)}
          >
            <Icon name="microchip" size={20} color={"white"} />
            <Text className="text-white font-bold text-[15px] ml-2">
              {userUsage?.microchip}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row"
            onPress={() => setMoreVisible(!moreVisible)}
          >
            <Icon name="bolt" size={20} color={"white"} />
            <Text className="text-white font-bold text-[15px] ml-2">
              {userUsage?.boostActive ? "∞" : userUsage?.energy}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {moreVisible && (
        <View className="w-full px-4  justify-center items-center p-2">
          <View className="w-full flex-row justify-between max-w-[200px]">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
              <Icon
                name="bolt"
                size={20}
                color={userUsage?.energy < i ? "white" : "yellow"}
                key={i}
              />
            ))}
          </View>
          <View>
            <Text className="text-white text-center mt-2 font-semibold">
              {userUsage?.energy >= 10
                ? t("tokenHeader.energyFull")
                : `${timeLeft ?? "…"} ${t("tokenHeader.minutesLeft")}`}
            </Text>
          </View>
        </View>
      )}

      <View className="w-full border-[1px] border-gray-700 mb-2" />
    </View>
  );
};

export default TokenHeader;
