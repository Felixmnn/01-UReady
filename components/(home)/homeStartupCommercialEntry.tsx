import { Platform } from "react-native";

const HomeStartupCommercialEntry =
  Platform.OS === "web"
    ? require("./homeStartupCommercial.web").default
    : require("./homeStartupCommercial.native").default;

export default HomeStartupCommercialEntry;
