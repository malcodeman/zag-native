import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import { normalizeProps, useMachine } from "@zag-js/react";
import { connect, machine } from "@zag-js/switch";
import { useEffect, useId } from "react";
import { Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { css, html } from "react-strict-dom";

function SwitchWeb() {
  const service = useMachine(machine, { id: useId() });
  const api = connect(service, normalizeProps);

  return (
    <html.label {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      <html.input {...zagToReactStrictDom(api.getHiddenInputProps())} />
      <html.span
        {...zagToReactStrictDom(api.getControlProps())}
        style={[style.control, api.checked && styleChecked.control]}
      >
        <html.span
          {...zagToReactStrictDom(api.getThumbProps())}
          style={[style.thumb, api.checked && styleChecked.thumb]}
        />
      </html.span>
      <html.span
        {...zagToReactStrictDom(api.getLabelProps())}
        style={style.label}
      >
        {api.checked ? "On" : "Off"}
      </html.span>
    </html.label>
  );
}

const nativeMachine: typeof machine = {
  ...machine,
  implementations: {
    ...machine.implementations,
    effects: {
      ...machine.implementations?.effects,
      trackFocusVisible: () => {},
    },
  },
};

function SwitchNative() {
  const service = useMachine(nativeMachine, {
    id: useId(),
    getRootNode: nativeGetRootNode,
  });
  const api = connect(service, normalizeProps);
  const translateX = useSharedValue(api.checked ? 28 : 0);
  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    translateX.value = withTiming(api.checked ? 28 : 0, { duration: 200 });
  }, [api.checked, translateX]);

  return (
    <html.div onClick={api.toggleChecked} style={style.root}>
      <html.div
        {...zagToReactStrictDom(api.getControlProps())}
        style={[style.control, api.checked && styleChecked.control]}
      >
        <Animated.View
          {...zagToReactStrictDom(api.getThumbProps())}
          style={[style.thumb, animatedThumbStyle]}
        />
      </html.div>
      <html.span
        {...zagToReactStrictDom(api.getLabelProps())}
        style={style.label}
      >
        {api.checked ? "On" : "Off"}
      </html.span>
    </html.div>
  );
}

export function Switch() {
  return Platform.OS === "web" ? <SwitchWeb /> : <SwitchNative />;
}

const style = css.create({
  root: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    gap: 8,
  },
  control: {
    display: "flex",
    alignItems: "center",
    borderRadius: 99,
    backgroundColor: "#E9E8E6",
    padding: 6,
    transition: "background-color 0.2s",
    width: 56,
  },
  thumb: {
    backgroundColor: "#FFF",
    borderRadius: 99,
    width: 28,
    height: 28,
    transition: "transform 0.2s",
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
  },
});

const styleChecked = css.create({
  control: {
    backgroundColor: "#DC3918",
  },
  thumb: {
    transform: "translateX(28px)",
  },
});
