import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import { connect, machine, Props as ZagDialogProps } from "@zag-js/dialog";
import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import React, { useId } from "react";
import { Modal, Platform } from "react-native";
import { css, html } from "react-strict-dom";

type DialogProps = Omit<ZagDialogProps, "id" | "getRootNode"> & {
  triggerLabel?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

function DialogWeb(props: DialogProps) {
  const {
    triggerLabel = "Open",
    title,
    description,
    children,
    ...zagProps
  } = props;
  const service = useMachine(machine, { ...zagProps, id: useId() });
  const api = connect(service, normalizeProps);

  return (
    <>
      <html.button
        {...zagToReactStrictDom(api.getTriggerProps())}
        style={style.trigger}
      >
        {triggerLabel}
      </html.button>
      {api.open && (
        <Portal>
          <html.div
            {...zagToReactStrictDom(api.getBackdropProps())}
            style={style.backdrop}
          />
          <html.div
            {...zagToReactStrictDom(api.getPositionerProps())}
            style={style.positioner}
          >
            <html.div
              {...zagToReactStrictDom(api.getContentProps())}
              style={style.content}
            >
              {title && (
                <html.h2
                  {...zagToReactStrictDom(api.getTitleProps())}
                  style={style.title}
                >
                  {title}
                </html.h2>
              )}
              {description && (
                <html.p
                  {...zagToReactStrictDom(api.getDescriptionProps())}
                  style={style.description}
                >
                  {description}
                </html.p>
              )}
              {children}
              <html.button
                {...zagToReactStrictDom(api.getCloseTriggerProps())}
                style={style.closeButton}
              >
                Close
              </html.button>
            </html.div>
          </html.div>
        </Portal>
      )}
    </>
  );
}

const nativeMachine: typeof machine = {
  ...machine,
  implementations: {
    ...machine.implementations,
    effects: {
      ...machine.implementations?.effects,
      trackDismissableElement: () => {},
      preventScroll: () => {},
      trapFocus: () => {},
      hideContentBelow: () => {},
    },
  },
};

function DialogNative(props: DialogProps) {
  const {
    triggerLabel = "Open",
    title,
    description,
    children,
    ...zagProps
  } = props;
  const service = useMachine(nativeMachine, {
    ...zagProps,
    id: useId(),
    getRootNode: nativeGetRootNode,
  });
  const api = connect(service, normalizeProps);

  return (
    <>
      <html.button onClick={() => api.setOpen(true)} style={style.trigger}>
        {triggerLabel}
      </html.button>
      <Modal
        visible={api.open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => api.setOpen(false)}
      >
        <html.div style={style.backdrop} />
        <html.div style={style.positioner} onClick={() => api.setOpen(false)}>
          <html.div style={[style.content, style.contentNative]}>
            {title && <html.h2 style={style.title}>{title}</html.h2>}
            {description && (
              <html.p style={style.description}>{description}</html.p>
            )}
            {children}
            <html.button
              onClick={() => api.setOpen(false)}
              style={style.closeButton}
            >
              Close
            </html.button>
          </html.div>
        </html.div>
      </Modal>
    </>
  );
}

export function Dialog(props: DialogProps) {
  return Platform.OS === "web" ? (
    <DialogWeb {...props} />
  ) : (
    <DialogNative {...props} />
  );
}

const style = css.create({
  trigger: {
    cursor: "pointer",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#DC3918",
    color: "#FFF",
    borderRadius: 8,
    borderWidth: 0,
    fontSize: 14,
    fontWeight: 500,
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  positioner: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  contentNative: {
    marginTop: "auto",
  },
  content: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 24,
    maxWidth: 480,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
  },
  description: {
    fontSize: 14,
    color: "#555",
    margin: 0,
  },
  closeButton: {
    alignSelf: "flex-end",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    backgroundColor: "transparent",
  },
});
