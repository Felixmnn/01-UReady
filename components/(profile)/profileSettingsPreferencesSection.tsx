import React from "react";
import { View } from "react-native";
import OptionSelector from "../(tabs)/optionSelector";
import type { TFunction } from "i18next";

type Option = {
  label: string;
  value: string;
};

type ProfileSettingsPreferencesSectionProps = {
  t: TFunction;
  colorOptions: Option[];
  selectedColorMode: string | null;
  setSelectedColorMode: (value: string | null) => void;
  onChangeColor: (value: string | null) => Promise<void>;
  languageOptions: Option[];
  selectedLanguage: string | null;
  setSelectedLanguage: (value: string | null) => void;
  onChangeLanguage: (value: string) => Promise<void>;
};

const ProfileSettingsPreferencesSection = ({
  t,
  colorOptions,
  selectedColorMode,
  setSelectedColorMode,
  onChangeColor,
  languageOptions,
  selectedLanguage,
  setSelectedLanguage,
  onChangeLanguage,
}: ProfileSettingsPreferencesSectionProps) => {
  return (
    <View className="w-full items-start">
      <OptionSelector
        title={t("profileSettings.colorMode")}
        options={colorOptions}
        selectedValue={selectedColorMode}
        setSelectedValue={setSelectedColorMode}
        onChangeItem={onChangeColor}
      />
      <OptionSelector
        title={t("profileSettings.language")}
        options={languageOptions}
        selectedValue={
          languageOptions.find((option) => option.value === selectedLanguage)
            ?.label ?? "Deutsch"
        }
        setSelectedValue={setSelectedLanguage}
        onChangeItem={onChangeLanguage}
      />
    </View>
  );
};

export default ProfileSettingsPreferencesSection;
