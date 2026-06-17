import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import { Ionicons } from "@expo/vector-icons";
import {
  connect,
  machine,
  Props as ZagRatingGroupProps,
} from "@zag-js/rating-group";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";

type RatingGroupProps = Omit<ZagRatingGroupProps, "id" | "getRootNode"> & {
  label?: string;
};

export function RatingGroup(props: RatingGroupProps) {
  const { label, ...rest } = props;
  const service = useMachine(machine, {
    ...rest,
    id: useId(),
    ...(Platform.OS !== "web" && { getRootNode: nativeGetRootNode }),
  });
  const api = connect(service, normalizeProps);

  return (
    <html.div {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      <html.label
        {...zagToReactStrictDom(api.getLabelProps())}
        style={style.label}
      >
        {label ?? "Rating"}
      </html.label>
      <html.div
        {...zagToReactStrictDom(api.getControlProps())}
        style={style.control}
      >
        {api.items.map((index) => {
          const state = api.getItemState({ index });
          const iconName = state.half
            ? "star-half"
            : state.highlighted
              ? "star"
              : "star-outline";

          return (
            <html.div
              key={index}
              {...zagToReactStrictDom(api.getItemProps({ index }))}
              {...(Platform.OS !== "web" && {
                onClick: () => api.setValue(index),
              })}
              style={style.item}
            >
              <Ionicons
                name={iconName}
                size={28}
                color={state.highlighted ? "#DC3918" : "#C7C5BF"}
              />
            </html.div>
          );
        })}
      </html.div>
      <html.input {...zagToReactStrictDom(api.getHiddenInputProps())} />
    </html.div>
  );
}

const style = css.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
  },
  control: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
  },
  item: {
    cursor: "pointer",
  },
});
