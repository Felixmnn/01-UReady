import { Platform } from "react-native";

const ProfileRewardedCommercialEntry =
  Platform.OS === "web"
    ? require("./profileRewardedCommercial.web").default
    : require("./profileRewardedCommercial.native").default;

export default ProfileRewardedCommercialEntry;
