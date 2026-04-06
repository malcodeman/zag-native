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

function NumberInputWeb(props: NumberInputProps) {
  const service = useMachine(machine, { ...props, id: useId() });
  const api = connect(service, normalizeProps);

  return (
    <html.div {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      <html.button
        {...zagToReactStrictDom(api.getDecrementTriggerProps())}
        style={style.button}
      >
        -
      </html.button>
      <html.input
        {...zagToReactStrictDom(api.getInputProps())}
        style={style.input}
      />
      <html.button
        {...zagToReactStrictDom(api.getIncrementTriggerProps())}
        style={style.button}
      >
        +
      </html.button>
    </html.div>
  );
}

function NumberInputNative(props: NumberInputProps) {
  const service = useMachine(machine, {
    ...props,
    id: useId(),
    getRootNode: nativeGetRootNode,
  });
  const api = connect(service, normalizeProps);

  return (
    <html.div style={style.root}>
      <html.button onClick={api.decrement} style={style.button}>
        -
      </html.button>
      <html.input
        {...zagToReactStrictDom(api.getInputProps())}
        style={style.input}
      />
      <html.button onClick={api.increment} style={style.button}>
        +
      </html.button>
    </html.div>
  );
}

export function NumberInput(props: NumberInputProps) {
  return Platform.OS === "web" ? (
    <NumberInputWeb {...props} />
  ) : (
    <NumberInputNative {...props} />
  );
}

const style = css.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: 32,
    borderWidth: 1,
    borderRadius: 99,
    borderColor: "#E9E8E6",
  },
  input: {
    borderWidth: 0,
    width: 56,
    height: 56,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    borderColor: "#E9E8E6",
  },
});
