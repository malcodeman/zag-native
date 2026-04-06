import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import {
  connect,
  machine,
  type Props as ZagPopoverProps,
} from "@zag-js/popover";
import { normalizeProps, useMachine } from "@zag-js/react";
import React, { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";

type PopoverProps = Omit<ZagPopoverProps, "id" | "getRootNode"> & {
  trigger: React.ReactNode;
  children?: React.ReactNode;
};

export function Popover(props: PopoverProps) {
  const { trigger, children } = props;
  const service = useMachine(machine, {
    id: useId(),
    ...(Platform.OS !== "web" && { getRootNode: nativeGetRootNode }),
  });
  const api = connect(service, normalizeProps);

  return (
    <>
      <html.div
        {...zagToReactStrictDom(api.getTriggerProps())}
        style={styles.trigger}
      >
        {trigger}
      </html.div>
      {api.open ? (
        <html.div {...zagToReactStrictDom(api.getPositionerProps())}>
          <html.div
            {...zagToReactStrictDom(api.getContentProps())}
            style={styles.content}
          >
            {children}
            <html.button
              {...zagToReactStrictDom(api.getCloseTriggerProps())}
              style={styles.closeButton}
            >
              ✕
            </html.button>
          </html.div>
        </html.div>
      ) : null}
    </>
  );
}

const styles = css.create({
  trigger: {
    cursor: "pointer",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#E9E8E6",
    borderStyle: "solid",
    borderWidth: 1,
    maxWidth: 320,
    padding: 16,
    position: "relative",
    zIndex: 50,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    borderWidth: 0,
    backgroundColor: "transparent",
    cursor: "pointer",
  },
});
