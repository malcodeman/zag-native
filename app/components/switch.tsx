import { normalizeProps, useMachine } from "@zag-js/react";
import { connect, machine } from "@zag-js/switch";
import { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";
import { nativeGetRootNode } from "../constants";
import { zagToReactStrictDom } from "../utils/zag-to-react-strict-dom";

function SwitchWeb() {
  const service = useMachine(machine, { id: useId() });
  const api = connect(service, normalizeProps);

  return (
    <html.label {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      <html.input {...zagToReactStrictDom(api.getHiddenInputProps())} />
      <html.span
        {...zagToReactStrictDom(api.getControlProps())}
        style={style.control}
      >
        <html.span
          {...zagToReactStrictDom(api.getThumbProps())}
          style={style.thumb}
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

  return (
    <html.div onClick={api.toggleChecked} style={style.root}>
      <html.div
        {...zagToReactStrictDom(api.getControlProps())}
        style={style.control}
      >
        <html.span
          {...zagToReactStrictDom(api.getThumbProps())}
          style={style.thumb}
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
    gap: 4,
  },
  control: {
    display: "flex",
    alignItems: "center",
    borderRadius: 99,
    backgroundColor: "#E9E8E6",
    padding: 6,
    transition: "background-color 0.2s",
    width: 48,
  },
  thumb: {
    backgroundColor: "#DC3918",
    borderRadius: 99,
    width: 20,
    height: 20,
    transition: "transform 0.2s",
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
  },
});
