import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import {
  connect,
  machine,
  Props as ZagAccordionProps,
} from "@zag-js/accordion";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";

export type AccordionItem = {
  title: string;
  content: string;
};

type AccordionProps = Omit<ZagAccordionProps, "id" | "getRootNode"> & {
  items: AccordionItem[];
};

function AccordionWeb({ items, ...rest }: AccordionProps) {
  const service = useMachine(machine, { ...rest, id: useId() });
  const api = connect(service, normalizeProps);

  return (
    <html.div {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      {items.map((item) => (
        <html.div
          key={item.title}
          {...zagToReactStrictDom(api.getItemProps({ value: item.title }))}
          style={style.item}
        >
          <html.h3 style={style.heading}>
            <html.button
              {...zagToReactStrictDom(
                api.getItemTriggerProps({ value: item.title }),
              )}
              style={style.trigger}
            >
              <html.span>{item.title}</html.span>
              <html.span
                {...zagToReactStrictDom(
                  api.getItemIndicatorProps({ value: item.title }),
                )}
                style={[
                  style.indicator,
                  api.value.includes(item.title) && style.indicatorOpen,
                ]}
              >
                ▾
              </html.span>
            </html.button>
          </html.h3>
          <html.div
            {...zagToReactStrictDom(
              api.getItemContentProps({ value: item.title }),
            )}
            style={style.content}
          >
            {item.content}
          </html.div>
        </html.div>
      ))}
    </html.div>
  );
}

function AccordionNative({ items, ...rest }: AccordionProps) {
  const service = useMachine(machine, {
    ...rest,
    id: useId(),
    getRootNode: nativeGetRootNode,
  });
  const api = connect(service, normalizeProps);

  return (
    <html.div {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      {items.map((item) => (
        <html.div
          key={item.title}
          {...zagToReactStrictDom(api.getItemProps({ value: item.title }))}
          style={style.item}
        >
          <html.div style={style.heading}>
            <html.div
              onClick={() =>
                api.setValue(
                  api.value.includes(item.title)
                    ? api.value.filter((v) => v !== item.title)
                    : [...api.value, item.title],
                )
              }
              style={style.trigger}
            >
              <html.span>{item.title}</html.span>
              <html.span
                style={[
                  style.indicator,
                  api.value.includes(item.title) && style.indicatorOpen,
                ]}
              >
                ▾
              </html.span>
            </html.div>
          </html.div>
          <html.div
            {...zagToReactStrictDom(
              api.getItemContentProps({ value: item.title }),
            )}
            style={style.content}
          >
            {item.content}
          </html.div>
        </html.div>
      ))}
    </html.div>
  );
}

export function Accordion(props: AccordionProps) {
  return Platform.OS === "web" ? (
    <AccordionWeb {...props} />
  ) : (
    <AccordionNative {...props} />
  );
}

const style = css.create({
  root: {
    width: "100%",
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "#E9E8E6",
    borderBottomStyle: "solid",
  },
  heading: {
    margin: 0,
  },
  trigger: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 16,
    paddingBottom: 16,
    textAlign: "left",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "transparent",
    borderWidth: 0,
    color: "inherit",
  },
  indicator: {
    transition: "transform 0.2s",
    display: "inline-block",
    fontSize: 18,
  },
  indicatorOpen: {
    transform: "rotate(180deg)",
  },
  content: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#6B6B6B",
    paddingRight: 16,
    paddingBottom: 16,
  },
});
