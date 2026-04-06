import { useMachine } from "@xstate/react";
import { useId } from "react";
import { setup } from "xstate";
import type { PopoverProps } from "./types";

type PopoverMachineInput = {
  closeOnEscape?: boolean;
};

const machineSetup = setup({
  types: {
    input: {} as PopoverMachineInput,
    context: {} as PopoverMachineInput,
  },
  guards: {
    closeOnEscape: ({ context: { closeOnEscape } }) => closeOnEscape ?? false,
  },
  actions: {
    focusContent: () => {},
    focusTrigger: () => {},
  },
});

const machine = machineSetup.createMachine({
  context: ({ input: { closeOnEscape } }) => ({ closeOnEscape }),
  initial: "close",
  states: {
    open: {
      entry: ["focusContent"],
      on: {
        CLOSE: {
          target: "close",
        },
        TOGGLE: {
          target: "close",
        },
        "KEY:ESCAPE": {
          guard: "closeOnEscape",
          target: "close",
        },
      },
    },
    close: {
      entry: ["focusTrigger"],
      on: {
        OPEN: {
          target: "open",
        },
        TOGGLE: {
          target: "open",
        },
      },
    },
  },
});

export const usePopover = (props: PopoverProps) => {
  const triggerId = useId();
  const contentId = useId();

  const machineDef = machine.provide({
    actions: {
      focusContent: () => {
        requestAnimationFrame(() => {
          document.getElementById(contentId)?.focus();
        });
      },
      focusTrigger: () => {
        requestAnimationFrame(() => {
          document.getElementById(triggerId)?.focus();
        });
      },
    },
  });

  const [state, send] = useMachine(machineDef, {
    input: { closeOnEscape: props.closeOnEscape },
  });

  return {
    isOpen: state.value === "open",
    parts: {
      content: {
        id: contentId,
        tabIndex: -1,
        onKeyUp: (e: { key: string; stopPropagation: () => void }) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            send({ type: "KEY:ESCAPE" });
          }
        },
      },
      trigger: {
        id: triggerId,
        onClick: () => {
          send({ type: "TOGGLE" });
        },
      },
      positioner: {},
      closeTrigger: {
        onClick: () => {
          send({ type: "CLOSE" });
        },
      },
    },
  } as const;
};
