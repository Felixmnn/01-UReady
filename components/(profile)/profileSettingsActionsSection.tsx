import React from "react";
import { Platform, View } from "react-native";
import SettingsOption from "../(tabs)/settingsOption";
import type { TFunction } from "i18next";

type ProfileSettingsActionsSectionProps = {
  t: TFunction;
  isOffline: boolean;
  actionCodeItem: React.ReactNode;
  onPressContact: () => void;
  onPressPolicys: () => void;
  onPressActionCode: () => void;
  onPressLogout: () => void;
  onPressDeleteAccount: () => void;
};

const ProfileSettingsActionsSection = ({
  t,
  isOffline,
  actionCodeItem,
  onPressContact,
  onPressPolicys,
  onPressActionCode,
  onPressLogout,
  onPressDeleteAccount,
}: ProfileSettingsActionsSectionProps) => {
  return (
    <View>
      <SettingsOption
        title={t("profileSettings.help")}
        iconName={"life-ring"}
        handlePress={onPressContact}
      />
      <SettingsOption
        title={t("profileSettings.policys")}
        iconName={"shield-alt"}
        handlePress={onPressPolicys}
      />
      {isOffline || Platform.OS == "ios" ? null : (
        <SettingsOption
          title={t("profileSettings.actioncode")}
          iconName={"bolt"}
          item={actionCodeItem}
          handlePress={onPressActionCode}
        />
      )}
      {isOffline ? null : (
        <SettingsOption
          title={t("profileSettings.logout")}
          iconName={"sign-out-alt"}
          handlePress={onPressLogout}
        />
      )}
      {isOffline ? null : (
        <SettingsOption
          title={t("profileSettings.deleteAccount")}
          iconName="trash"
          bottom
          handlePress={onPressDeleteAccount}
        />
      )}
    </View>
  );
};

export default ProfileSettingsActionsSection;
