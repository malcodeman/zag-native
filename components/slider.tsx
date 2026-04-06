import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import { normalizeProps, useMachine } from "@zag-js/react";
import { connect, machine, Props as ZagSliderProps } from "@zag-js/slider";
import { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";

type SliderProps = Omit<ZagSliderProps, "id" | "getRootNode"> & {
  label?: string;
};

export function Slider(props: SliderProps) {
  const { label, ...rest } = props;
  const service = useMachine(machine, {
    ...rest,
    id: useId(),
    ...(Platform.OS !== "web" && { getRootNode: nativeGetRootNode }),
  });
  const api = connect(service, normalizeProps);
  const { style: rootInlineStyle, ...rootAttrs } = zagToReactStrictDom(
    api.getRootProps(),
  );
  const { style: rangeInlineStyle, ...rangeAttrs } = zagToReactStrictDom(
    api.getRangeProps(),
  );

  return (
    <html.div {...rootAttrs} style={[style.root, rootInlineStyle]}>
      <html.div style={style.header}>
        <html.label
          {...zagToReactStrictDom(api.getLabelProps())}
          style={style.label}
        >
          {label ?? "Slider"}
        </html.label>
        <html.span
          {...zagToReactStrictDom(api.getValueTextProps())}
          style={style.valueText}
        >
          {api.value.at(0)}
        </html.span>
      </html.div>
      <html.div
        {...zagToReactStrictDom(api.getControlProps())}
        style={style.control}
      >
        <html.div
          {...zagToReactStrictDom(api.getTrackProps())}
          style={style.track}
        >
          <html.div {...rangeAttrs} style={[style.range, rangeInlineStyle]} />
        </html.div>
        {api.value.map((_, index) => {
          const { style: thumbInlineStyle, ...thumbAttrs } =
            zagToReactStrictDom(api.getThumbProps({ index }));
          return (
            <html.div
              key={index}
              {...thumbAttrs}
              style={[style.thumb, thumbInlineStyle]}
            >
              <html.input
                {...zagToReactStrictDom(api.getHiddenInputProps({ index }))}
              />
            </html.div>
          );
        })}
      </html.div>
    </html.div>
  );
}

const style = css.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
  },
  valueText: {
    fontSize: 14,
    fontWeight: 600,
    color: "#6F6D66",
  },
  control: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 24,
    cursor: "pointer",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E9E8E6",
  },
  range: {
    height: 6,
    backgroundColor: "#DC3918",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DC3918",
    cursor: "grab",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
  },
});
