import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import {
  connect,
  machine,
  Props as ZagNumberInputProps,
} from "@zag-js/number-input";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";

type NumberInputProps = Omit<ZagNumberInputProps, "id" | "getRootNode">;

export function NumberInput(props: NumberInputProps) {
  const service = useMachine(machine, {
    ...props,
    id: useId(),
    ...(Platform.OS !== "web" && { getRootNode: nativeGetRootNode }),
  });
  const api = connect(service, normalizeProps);
  const { defaultValue } = api.getInputProps();

  return (
    <html.div {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      <html.button
        {...zagToReactStrictDom(api.getDecrementTriggerProps())}
        {...(Platform.OS !== "web" && { onClick: api.decrement })}
        style={style.button}
      >
        -
      </html.button>
      <html.span style={style.value}>{defaultValue}</html.span>
      <html.button
        {...zagToReactStrictDom(api.getIncrementTriggerProps())}
        {...(Platform.OS !== "web" && { onClick: api.increment })}
        style={style.button}
      >
        +
      </html.button>
    </html.div>
  );
}

const style = css.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    backgroundColor: "#e9e8e6",
    color: "#21201C",
    cursor: "pointer",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 99,
    borderColor: "#E9E8E6",
  },
  value: {
    fontSize: 16,
    fontWeight: 500,
    minWidth: 32,
    textAlign: "center",
  },
});
