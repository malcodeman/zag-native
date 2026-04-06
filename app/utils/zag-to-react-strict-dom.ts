// Props that zag-js emits but React Strict DOM does not support
const INVALID_RSD_PROPS = new Set(["autoCorrect"]);

const isValidRsdProp = ([key]: [string, unknown]) =>
  !INVALID_RSD_PROPS.has(key);

export const zagToReactStrictDom = (props: Record<string, any>) =>
  Object.fromEntries(Object.entries(props).filter(isValidRsdProp));
