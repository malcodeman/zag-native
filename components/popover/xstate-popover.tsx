"use client";
import React from "react";
import { css, html } from "react-strict-dom";
import { usePopover } from "./popover-machine";
import type { PopoverProps } from "./types";

const styles = css.create({
  trigger: {
    cursor: "pointer",
  },
  positioner: {
    zIndex: 1000,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: "4px",
    borderColor: "#ccc",
    borderStyle: "solid",
    borderWidth: 1,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 320,
    padding: 16,
    position: "relative",
  },
  "content:focus": {
    borderColor: "red",
  },
  closeButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    cursor: "pointer",
    backgroundColor: "transparent",
    borderStyle: "none",
    borderWidth: 0,
    padding: "8px",
    color: "#666",
    fontSize: "16px",
    lineHeight: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transitionDuration: "150ms",
    transitionProperty: "background-color",
  },
});

export function XStatePopover(props: PopoverProps): React.JSX.Element {
  const { trigger, children, closeOnEscape = true } = props;
  const { isOpen, parts } = usePopover({ closeOnEscape, ...props });

  return (
    <>
      <html.div {...parts.trigger} style={styles.trigger}>
        {trigger}
      </html.div>
      {isOpen && (
        <html.div {...parts.positioner} style={styles.positioner}>
          <html.div {...parts.content} style={styles.content}>
            {children}
            <html.button
              {...parts.closeTrigger}
              aria-label="Close"
              style={styles.closeButton}
              type="button"
            >
              ✕
            </html.button>
          </html.div>
        </html.div>
      )}
    </>
  );
}
