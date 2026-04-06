import { Platform } from "react-native";

// Props that zag-js emits but React Strict DOM does not support
const NATIVE_INVALID_RSD_PROPS = new Set(["autoCorrect", "pattern", "form"]);
const WEB_INVALID_RSD_PROPS = new Set(["htmlFor"]);

const INVALID_RSD_PROPS =
  Platform.OS === "web" ? WEB_INVALID_RSD_PROPS : NATIVE_INVALID_RSD_PROPS;

const isValidRsdProp = ([key]: [string, unknown]) =>
  !INVALID_RSD_PROPS.has(key);

export const zagToReactStrictDom = (props: Record<string, any>) =>
  Object.fromEntries(Object.entries(props).filter(isValidRsdProp));
