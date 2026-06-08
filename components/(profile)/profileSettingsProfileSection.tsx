import React from "react";
import { View, Text } from "react-native";
import ToggleSwitch from "../(general)/toggleSwich";
import ProfileTagsSection from "../(general)/profileTagsSection";
import { AppwritePublicProfile } from "@/lib/collections/publicProfile";
import ProfileSettingsPersonalInput from "./profileSettingsPersonalInput";
import type { TFunction } from "i18next";

type ProfileSettingsProfileSectionProps = {
  t: TFunction;
  userName: string;
  publicProfile: AppwritePublicProfile | null;
  isOffline: boolean;
  onTogglePublic: (newValue: boolean) => void;
  onUpdateName: (text: string) => Promise<void>;
  onUpdateBio: (text: string) => Promise<void>;
};

const ProfileSettingsProfileSection = ({
  t,
  userName,
  publicProfile,
  isOffline,
  onTogglePublic,
  onUpdateName,
  onUpdateBio,
}: ProfileSettingsProfileSectionProps) => {
  return (
    <View className="w-full items-center ">
      <View className="bg-blue-900 border-gray-500 border-[1px] rounded-full h-[60px] w-[60px] mr-3 items-center justify-center">
        <Text className="text-2xl text-gray-300 font-bold">{userName[0]}</Text>
      </View>
      <View className="w-full mt-3 px-1 flex-row items-center justify-between pr-3">
        <Text className="text-gray-300 font-bold text-[13px]">
          {t("profileSettings.publicProfileIsPublic")}
        </Text>
        <ToggleSwitch
          isOn={publicProfile?.isPublic || false}
          onToggle={onTogglePublic}
        />
      </View>
      <ProfileSettingsPersonalInput
        value={publicProfile?.name || userName}
        title={t("profileSettings.vorname")}
        onChange={onUpdateName}
        isOffline={isOffline}
      />
      <ProfileSettingsPersonalInput
        value={publicProfile?.bio || ""}
        title={t("profileSettings.bio")}
        onChange={onUpdateBio}
        isOffline={isOffline}
      />

      <View className="w-full mt-3 px-1">
        <ProfileTagsSection
          educationKategory={publicProfile?.educationKategory}
          badges={publicProfile?.badges}
          creatorName={publicProfile?.name || userName}
        />
      </View>
    </View>
  );
};

export default ProfileSettingsProfileSection;
