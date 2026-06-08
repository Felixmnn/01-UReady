import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { userDataKathegory } from "@/types/appwriteTypes";
import type { TFunction } from "i18next";

type UserLite = {
  $id: string;
  email: string;
  emailVerification: boolean;
};

type ProfileSettingsEducationSectionProps = {
  t: TFunction;
  user: UserLite;
  isVertical: boolean;
  isOffline: boolean;
  verified: boolean | null;
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  onRenewEmail: () => Promise<void>;
  onVerifyEmailCode: () => Promise<void>;
  userDataKathegory?: userDataKathegory;
  schoolType: string;
  onPressEditEducationGoals: () => void;
};

const ProfileSettingsEducationSection = ({
  t,
  user,
  isVertical,
  isOffline,
  verified,
  verificationCode,
  setVerificationCode,
  onRenewEmail,
  onVerifyEmailCode,
  userDataKathegory,
  schoolType,
  onPressEditEducationGoals,
}: ProfileSettingsEducationSectionProps) => {
  return (
    <View className="w-full items-center ">
      {!user.emailVerification && (verified == null || verified === false) ? (
        <View
          className={`${isVertical ? "flex-row w-[96%] justify-between items-center" : "justify-start items-start"} py-2 `}
        >
          <Text className="text-red-300 font-bold text-[12px]">
            {t("profileSettings.emailvalid")}
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="py-2 px-3 m-2 rounded-full border-gray-500 border-[1px]"
              onPress={onRenewEmail}
            >
              <Text className="text-gray-300 font-bold text-[12px]">
                {t("profileSettings.emailrenew")}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <TextInput
              placeholder={t("profileSettings.validationCode")}
              className="flex-1 bg-gray-800 text-white p-2 rounded-[10px] border border-gray-600  text-[12px]"
              placeholderTextColor="#808080"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            <TouchableOpacity
              disabled={verificationCode.length != 6}
              onPress={onVerifyEmailCode}
              className="flex-1 py-2 px-3 m-2 rounded-full bg-blue-500 items-center justify-center"
              style={{
                opacity: verificationCode.length != 6 ? 0.5 : 1,
              }}
            >
              <Text className="text-gray-300 font-bold text-[12px]">
                {t("profileSettings.verify")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="w-full m-2 px-2">
          <Text>
            <Text className="text-green-300 font-bold text-[12px]">
              {t("profileSettings.emailvalid2")}
            </Text>
          </Text>
        </View>
      )}

      <View className="justify-start w-full">
        {userDataKathegory && userDataKathegory.kategoryType == "UNIVERSITY" ? (
          <View className="w-full">
            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.universityEducationGoals")}
            </Text>
            <Text className="font-semibold text-white ml-2">
              {t(
                `universityCategories.degrees.${userDataKathegory.studiengangZiel}.name`
              )}
            </Text>

            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.universityCategories")}
            </Text>
            <View>
              {userDataKathegory.schoolSubjects.map((schoolSubjects, index) => {
                return (
                  <Text key={index} className="font-semibold text-white ml-2">
                    {t(
                      `universityCategories.universitySubjects.${schoolSubjects}.name`
                    )}
                  </Text>
                );
              })}
            </View>
          </View>
        ) : userDataKathegory && userDataKathegory.kategoryType == "SCHOOL" ? (
          <View className="w-full">
            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.schooltype")}
            </Text>
            <Text className="font-semibold text-white ml-2">{schoolType}</Text>

            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.schoolgrade")}
            </Text>
            <Text className="font-semibold text-white ml-2">
              {userDataKathegory.schoolGrade}
            </Text>
            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.schoolsubjects")}
            </Text>
            <View>
              {userDataKathegory.schoolSubjects.map((schoolSubjects, index) => {
                return (
                  <Text key={index} className="font-semibold text-white ml-2">
                    {t(`school.subjects.${schoolSubjects}.name`)}
                  </Text>
                );
              })}
            </View>
          </View>
        ) : userDataKathegory && userDataKathegory.kategoryType == "EDUCATION" ? (
          <View className="w-full">
            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.educationKathegory")}
            </Text>
            <Text className="font-semibold text-white ml-2">
              {t(
                `education.educationKategories.${userDataKathegory.educationKathegory}.name`
              )}
            </Text>

            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.educationSubject")}
            </Text>
            <Text className="font-semibold text-white ml-2">
              {t(
                `education.educationSubjects.${userDataKathegory.educationKathegory}.${userDataKathegory.educationSubject}.name`
              )}
            </Text>
          </View>
        ) : (
          <View className="w-full">
            <Text
              className="font-semibold text-white text-gray-500  "
              style={{
                color: "#808080",
              }}
            >
              {t("profileSettings.schoolsubjects")}
            </Text>
            <View>
              {userDataKathegory &&
                userDataKathegory.schoolSubjects.map((schoolSubjects, index) => {
                  return (
                    <Text key={index} className="font-semibold text-white ml-2">
                      {t(`school.subjects.${schoolSubjects}.name`)}
                    </Text>
                  );
                })}
            </View>
          </View>
        )}

        <View className="justify-start w-full items-start">
          <TouchableOpacity
            disabled={isOffline}
            className={`mt-3 mb-1 py-1 px-2 rounded-full border ${isOffline ? "border-gray-500" : "border-blue-500"} items-center justify-center`}
            onPress={onPressEditEducationGoals}
          >
            {isOffline ? (
              <Text className="text-gray-500 font-bold text-[12px]">
                {t("profileSettings.goOnlineToEdit")}
              </Text>
            ) : (
              <Text className="text-blue-500 font-bold">
                {t("profileSettings.editEducationGoals")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileSettingsEducationSection;
