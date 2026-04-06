import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import { connect, machine, Props as ZagProgressProps } from "@zag-js/progress";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useEffect, useId } from "react";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { css, html } from "react-strict-dom";

type ProgressProps = Omit<ZagProgressProps, "id" | "getRootNode"> & {
  label?: React.ReactNode;
};

function ProgressWeb(props: ProgressProps) {
  const { label, ...rest } = props;
  const service = useMachine(machine, { ...rest, id: useId() });
  const api = connect(service, normalizeProps);
  const { style: rangeInlineStyle, ...rangeAttrs } = zagToReactStrictDom(
    api.getRangeProps(),
  );

  return (
    <html.div {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      {label ? (
        <html.span
          {...zagToReactStrictDom(api.getLabelProps())}
          style={style.label}
        >
          {label}
        </html.span>
      ) : null}
      <html.div
        {...zagToReactStrictDom(api.getTrackProps())}
        style={style.track}
      >
        <html.div {...rangeAttrs} style={[style.range, rangeInlineStyle]} />
      </html.div>
    </html.div>
  );
}

function ProgressNative(props: ProgressProps) {
  const { label, ...rest } = props;
  const service = useMachine(machine, { ...rest, id: useId() });
  const api = connect(service, normalizeProps);
  const { ...rangeAttrs } = zagToReactStrictDom(api.getRangeProps());
  const percent = parseFloat(api.getRangeProps().style?.width as string) ?? 0;
  const widthPercent = useSharedValue(percent);
  const animatedRangeStyle = useAnimatedStyle(() => ({
    width: `${widthPercent.value}%`,
  }));

  useEffect(() => {
    widthPercent.value = withTiming(percent, { duration: 300 });
  }, [percent, widthPercent]);

  return (
    <html.div {...zagToReactStrictDom(api.getRootProps())} style={style.root}>
      {label ? (
        <html.span
          {...zagToReactStrictDom(api.getLabelProps())}
          style={style.label}
        >
          {label}
        </html.span>
      ) : null}
      <html.div
        {...zagToReactStrictDom(api.getTrackProps())}
        style={style.track}
      >
        <Animated.View
          {...rangeAttrs}
          style={[nativeRangeStyle.range, animatedRangeStyle]}
        />
      </html.div>
    </html.div>
  );
}

export function Progress(props: ProgressProps) {
  return Platform.OS === "web" ? (
    <ProgressWeb {...props} />
  ) : (
    <ProgressNative {...props} />
  );
}

const nativeRangeStyle = StyleSheet.create({
  range: {
    height: 8,
    backgroundColor: "#21201C",
  },
});

const style = css.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.5,
  },
  track: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: "#E9E8E6",
    height: 8,
  },
  range: {
    height: 8,
    backgroundColor: "#21201C",
    transition: "width 0.3s ease",
  },
});
