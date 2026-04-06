import { normalizeProps, useMachine } from "@zag-js/react";
import { connect, machine } from "@zag-js/switch";
import { useId } from "react";
import { Platform } from "react-native";
import { html } from "react-strict-dom";
import { zagToReactStrictDom } from "../utils/zag-to-react-strict-dom";

function SwitchWeb() {
  const service = useMachine(machine, { id: useId() });
  const api = connect(service, normalizeProps);

  return (
    <html.label {...zagToReactStrictDom(api.getRootProps())}>
      <html.input {...zagToReactStrictDom(api.getHiddenInputProps())} />
      <html.span {...zagToReactStrictDom(api.getControlProps())}>
        <html.span {...zagToReactStrictDom(api.getThumbProps())} />
      </html.span>
      <html.span {...zagToReactStrictDom(api.getLabelProps())}>
        {api.checked ? "On" : "Off"}
      </html.span>
    </html.label>
  );
}

const nativeMachine = {
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
    getRootNode: () => ({ getElementById: () => null }) as any,
  });
  const api = connect(service, normalizeProps);

  return (
    <html.div onClick={api.toggleChecked}>
      <html.span {...zagToReactStrictDom(api.getControlProps())}>
        <html.span {...zagToReactStrictDom(api.getThumbProps())} />
      </html.span>
      <html.span {...zagToReactStrictDom(api.getLabelProps())}>
        {api.checked ? "On" : "Off"}
      </html.span>
    </html.div>
  );
}

export function Switch() {
  return Platform.OS === "web" ? <SwitchWeb /> : <SwitchNative />;
}
