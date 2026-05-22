import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  GestureResponderEvent,
} from "react-native";
import React, { useEffect, useState } from "react";
import VektorCircle from "./vektorCircle";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useGlobalContext } from "@/context/GlobalProvider";
import { reportModule } from "@/lib/appwriteAdd";
import { useTranslation } from "react-i18next";
import {
  AppwritePublicProfile,
  getCachedPublicProfileNameByID,
  getPublicProfileByID,
  subscribePublicProfileCacheByID,
} from "@/lib/collections/publicProfile";
import { useRouter } from "expo-router";
import CreatorProfileModal from "./creatorProfileModal";
const Karteikarte = ({
  titel,
  studiengang,
  fragenAnzahl,
  notizAnzahl,
  farbe,
  creator,
  handlePress,
  percentage,
  publicM,
  reportVisible = false,
  moduleID = "",
}: {
  titel: string;
  studiengang: string | null;
  fragenAnzahl: number;
  notizAnzahl: number;
  farbe: string;
  creator: string;
  handlePress: () => void;
  percentage: number | null;
  publicM: boolean;
  reportVisible?: boolean;
  moduleID?: string;
}) => {
  // Studiengang ist jetz Beschreibung
  const { t } = useTranslation();
  const { user } = useGlobalContext();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [creatorProfileModalVisible, setCreatorProfileModalVisible] =
    useState(false);
  const [creatorProfile, setCreatorProfile] =
    useState<AppwritePublicProfile | null>(null);
  const [creatorName, setCreatorName] = useState("Anonym");
  const [creatorHasDoerTag, setCreatorHasDoerTag] = useState(false);
  const [isCreatorProfileLoading, setIsCreatorProfileLoading] =
    useState(false);
  const [profileHintVisible, setProfileHintVisible] = useState(false);
  const [profileHintMessage, setProfileHintMessage] = useState("");

  useEffect(() => {
    if (user && creator == user.$id) {
      setCreatorName(t("karteikarte.you"));
      return;
    }

    const cachedName = getCachedPublicProfileNameByID(creator);
    setCreatorName(cachedName || "Anonym");
  }, [creator, user, t]);

  useEffect(() => {
    if (user && creator == user.$id) return;

    const unsubscribe = subscribePublicProfileCacheByID(creator, (snapshot) => {
      if (!snapshot.isFresh || snapshot.status !== "public") {
        setCreatorName("Anonym");
        return;
      }

      setCreatorName(snapshot.name || "Anonym");
    });

    return unsubscribe;
  }, [creator, user]);

  useEffect(() => {
    if (user && creator == user.$id) {
      setCreatorHasDoerTag(false);
      return;
    }

    let isMounted = true;

    const loadCreatorTagState = async () => {
      const result = await getPublicProfileByID(creator);
      if (!isMounted) return;

      if (result.status !== "public") {
        setCreatorHasDoerTag(false);
        return;
      }

      setCreatorHasDoerTag(result.profile.badges?.includes("DOER") ?? false);
    };

    loadCreatorTagState();

    return () => {
      isMounted = false;
    };
  }, [creator, user]);

  const truncateName = (name: string) =>
    name.length > 10 ? `${name.substring(0, 10)}...` : name;

  const handleCreatorPress = async (event: GestureResponderEvent) => {
    event.stopPropagation();

    if (user && creator == user.$id) {
      router.push("/profil");
      return;
    }

    setIsCreatorProfileLoading(true);

    const profileResult = await getPublicProfileByID(creator);
    setIsCreatorProfileLoading(false);

    if (profileResult.status === "public") {
      setCreatorProfile(profileResult.profile);
      setCreatorName(profileResult.profile.name || "Anonym");
      setCreatorHasDoerTag(profileResult.profile.badges?.includes("DOER") ?? false);
      setCreatorProfileModalVisible(true);
      return;
    }

    setCreatorProfile(null);
    setCreatorProfileModalVisible(false);
    setCreatorName("Anonym");
    setCreatorHasDoerTag(false);
    setProfileHintMessage(
      profileResult.status === "hidden"
        ? "Profil ist nicht öffentlich."
        : "Kein öffentliches Profil gefunden."
    );
    setProfileHintVisible(true);
  };

  const ReportModal = () => {
    const [reason, setReason] = useState("");
    const handleSubmit = async () => {
      await reportModule({
        moduleID: moduleID,
        moduleCreator: creator,
        personThatReported: user ? user.$id : "",
        message: reason,
      });
      setModalVisible(false);
    };

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-4">
          <View className="w-full bg-gray-900 rounded-2xl p-6 border border-gray-800">
            {/* Titel */}
            <Text className="text-lg text-white font-bold mb-2">
              {titel} {t("entdecken.report")}
            </Text>

            {/* Label */}
            <Text className="text-sm mb-2 text-gray-300">
              {t("entdecken.reasonForReport")}
            </Text>

            {/* Input */}
            <TextInput
              className="border border-gray-700 rounded-xl px-4 py-3 text-sm min-h-[100px] text-white bg-gray-800"
              multiline
              placeholder={t("entdecken.reportText")}
              placeholderTextColor="#888"
              value={reason}
              maxLength={200}
              onChangeText={setReason}
            />

            {/* Buttons */}
            <View className="flex-row  mt-6  mt-2">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 py-2   rounded-lg bg-gray-700 justify-center items-center "
              >
                <Text className="text-white font-medium ">
                  {t("entdecken.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                className={`flex-1 py-2 ${
                  reason.trim().length === 0
                    ? "bg-red-600 opacity-50"
                    : "bg-red-600"
                } rounded-lg ml-2 justify-center items-center`}
                disabled={reason.trim().length === 0}
              >
                <Text className="text-white font-semibold">
                  {t("entdecken.send")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ProfileHintModal = () => {
    return (
      <Modal
        visible={profileHintVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileHintVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-start pt-6 items-center bg-black/40"
          onPress={() => setProfileHintVisible(false)}
          activeOpacity={1}
        >
          <View className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 w-[90%]">
            <Text className="text-gray-200 text-center">{profileHintMessage}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const color =
    farbe === "RED"
      ? "#DC2626"
      : farbe === "BLUE"
        ? "#2563EB"
        : farbe === "GREEN"
          ? "#059669"
          : farbe === "YELLOW"
            ? "#CA8A04"
            : farbe === "ORANGE"
              ? "#C2410C"
              : farbe === "PURPLE"
                ? "#7C3AED"
                : farbe === "PINK"
                  ? "#DB2777"
                  : farbe === "EMERALD"
                    ? "#059669"
                    : farbe === "CYAN"
                      ? "#0891B2"
                      : "#1F2937";

  return (
    <TouchableOpacity className={`${user && creator == user.$id && reportVisible ? "opacity-50" : ""}`

    }
     onPress={handlePress} 
      disabled={user && reportVisible && creator == user.$id}
    >
      <ReportModal />
      <CreatorProfileModal
        visible={creatorProfileModalVisible}
        onClose={() => setCreatorProfileModalVisible(false)}
        creatorProfile={creatorProfile}
      />
      <ProfileHintModal />
      <View
        className={` rounded-t-[10px]  border-gray-700 `}
        style={{ height: 5, backgroundColor: color }}
      />
      <View
        className=" p-3 bg-[#1f242f] border-[1px] border-gray-700 rounded-b-[10px] "
        style={{ borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="my-1 font-semibold text-[15px] text-gray-100">
              {titel.length > 30 ? titel.substring(0, 30) + "..." : titel}
            </Text>
            <Text
              className="my-1 text-[12px] text-gray-400"
              style={{ height: 50 }}
            >
              {studiengang
                ? studiengang.length > 150
                  ? studiengang.substring(0, 150) + "..."
                  : studiengang
                : null}
            </Text>
          </View>
          {percentage !== null ? (
            <VektorCircle
              color={color}
              percentage={percentage}
              icon={"clock"}
              strokeColor={color}
            /> 
          ) : 
           user && reportVisible && creator == user.$id ? (<Text className="text-blue-500 p-1 border-blue-500 border italic mb-1">{t("karteikarte.fromYou")}</Text>) : null
          }
        </View>
        <View className="flex-row">
          <Text className="my-1 text-gray-300 font-semibold text-[14px]">
            {fragenAnzahl} {t("karteikarte.questio")} • {notizAnzahl}{" "}
            {t("karteikarte.notes")}
          </Text>
        </View>
        <View className="border-t-[1px] border-gray-700 my-2" />
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="py-[2px] px-2 border-[1px] border-gray-700 rounded-full flex-row items-center"
            onPress={handleCreatorPress}
            activeOpacity={0.8}
            style={
              creatorHasDoerTag
                ? { backgroundColor: "#92400E", borderColor: "#FACC15" }
                : undefined
            }
          >
            <Icon
              name="user"
              size={10}
              color={creatorHasDoerTag ? "#FFF8E1" : "white"}
            />
            <Text
              className="text-[12px] ml-1"
              style={{ color: creatorHasDoerTag ? "#FFF8E1" : "#d1d5db" }}
            >
              {user && creator == user.$id
                ? t("karteikarte.you")
                : truncateName(creatorName)}
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-between">
            <TouchableOpacity className="">
              {!publicM ? (
                <Icon name="lock" size={18} color="white" />
              ) : (
                <Icon name="globe" size={18} color="white" />
              )}
            </TouchableOpacity>

            {reportVisible ? (
              <TouchableOpacity
                className="ml-2"
                onPress={() => setModalVisible(true)}
              >
                <Icon name="exclamation-triangle" size={18} color="white" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Karteikarte;
