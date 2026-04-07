import { Platform } from "react-native";

// Props that zag-js emits but React Strict DOM does not support
const NATIVE_INVALID_RSD_PROPS = new Set([
  "autoCorrect",
  "pattern",
  "form",
  "colSpan",
]);
const WEB_INVALID_RSD_PROPS = new Set(["htmlFor"]);

const INVALID_RSD_PROPS =
  Platform.OS === "web" ? WEB_INVALID_RSD_PROPS : NATIVE_INVALID_RSD_PROPS;

const isValidRsdProp = ([key]: [string, unknown]) =>
  !INVALID_RSD_PROPS.has(key);

// Convert string booleans to actual booleans for React Native
const convertBooleanProps = ([key, value]: [string, unknown]): [
  string,
  unknown,
] => {
  if (Platform.OS === "web") {
    return [key, value];
  }

  if (value === "true") {
    return [key, true];
  }

  if (value === "false") {
    return [key, false];
  }

  return [key, value];
};

export const zagToReactStrictDom = (props: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(props).filter(isValidRsdProp).map(convertBooleanProps),
  );
