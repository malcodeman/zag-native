import { normalizeProps, useMachine } from "@zag-js/react";
import { connect, machine } from "@zag-js/switch";
import { useId } from "react";
import { html } from "react-strict-dom";
import { zagToReactStrictDom } from "../utils/zag-to-react-strict-dom";

export function Switch() {
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
