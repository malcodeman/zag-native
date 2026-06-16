import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import { Ionicons } from "@expo/vector-icons";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Props as ZagDatePickerProps,
  connect,
  machine,
} from "@zag-js/date-picker";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";

type DatePickerInlineProps = Omit<ZagDatePickerProps, "id">;

const nativeMachine: typeof machine = {
  ...machine,
  implementations: {
    ...machine.implementations,
    effects: {
      ...machine.implementations?.effects,
      setupLiveRegion: () => {},
    },
  },
};

export function DatePickerInline(props: DatePickerInlineProps) {
  const dateMachine = Platform.OS === "web" ? machine : nativeMachine;
  const service = useMachine(dateMachine, {
    id: useId(),
    locale: "en-US",
    selectionMode: "range",
    inline: true,
    startOfWeek: 1,
    numOfMonths: 2,
    min: today(getLocalTimeZone()),
    ...props,
    ...(Platform.OS !== "web" && { getRootNode: nativeGetRootNode }),
  });
  const api = connect(service, normalizeProps);
  const secondMonth = api.getOffset({ months: 1 });

  const prevTriggerProps = api.getPrevTriggerProps();
  const nextTriggerProps = api.getNextTriggerProps();
  const isPrevDisabled =
    (prevTriggerProps as Record<string, unknown>)["data-disabled"] === "";
  const isNextDisabled =
    (nextTriggerProps as Record<string, unknown>)["data-disabled"] === "";

  return (
    <html.div {...zagToReactStrictDom(api.getContentProps())}>
      <Presets api={api} />
      <html.div style={styles.multipleMonths}>
        <html.div style={styles.monthWrapper}>
          <html.div style={styles.monthHeader}>
            <html.button
              {...zagToReactStrictDom(prevTriggerProps)}
              style={[
                styles.navButton,
                isPrevDisabled && styles.navButtonDisabled,
              ]}
            >
              <Ionicons name="arrow-back" size={24} color="#1A2B49" />
            </html.button>
            <html.span style={styles.viewTrigger}>
              {api.visibleRangeText.start}
            </html.span>
            <html.span />
          </html.div>
          <MonthCalendar
            api={api}
            weeks={api.weeks}
            visibleRange={api.visibleRange}
          />
        </html.div>
        <html.div style={styles.monthWrapper}>
          <html.div style={styles.monthHeader}>
            <html.span />
            <html.span style={styles.viewTrigger}>
              {secondMonth.visibleRangeText.start}
            </html.span>
            <html.button
              {...zagToReactStrictDom(nextTriggerProps)}
              style={[
                styles.navButton,
                isNextDisabled && styles.navButtonDisabled,
              ]}
            >
              <Ionicons name="arrow-forward" size={24} color="#1A2B49" />
            </html.button>
          </html.div>
          <MonthCalendar
            api={api}
            weeks={secondMonth.weeks}
            visibleRange={secondMonth.visibleRange}
          />
        </html.div>
      </html.div>
    </html.div>
  );
}

type PresetsProps = {
  api: ReturnType<typeof connect>;
};

function Presets({ api }: PresetsProps) {
  const handleToday = () => {
    const todayDate = today(getLocalTimeZone());
    const currentValue = api.value[0];

    if (currentValue && currentValue.compare(todayDate) === 0) {
      api.clearValue();
    } else {
      api.setValue([todayDate]);
    }
  };

  const handleTomorrow = () => {
    const todayDate = today(getLocalTimeZone());
    const tomorrowDate = todayDate.add({ days: 1 });
    const currentValue = api.value[0];

    if (currentValue && currentValue.compare(tomorrowDate) === 0) {
      api.clearValue();
    } else {
      api.setValue([tomorrowDate]);
    }
  };

  const todayDate = today(getLocalTimeZone());
  const tomorrowDate = todayDate.add({ days: 1 });
  const currentValue = api.value[0];
  const isTodaySelected = currentValue && currentValue.compare(todayDate) === 0;
  const isTomorrowSelected =
    currentValue && currentValue.compare(tomorrowDate) === 0;

  return (
    <html.div style={styles.presets}>
      <html.button
        onClick={handleToday}
        style={[
          styles.presetButton,
          isTodaySelected && styles.presetButtonSelected,
        ]}
      >
        <html.span>Today</html.span>
      </html.button>
      <html.button
        onClick={handleTomorrow}
        style={[
          styles.presetButton,
          isTomorrowSelected && styles.presetButtonSelected,
        ]}
      >
        <html.span>Tomorrow</html.span>
      </html.button>
    </html.div>
  );
}

type MonthCalendarProps = {
  api: ReturnType<typeof connect>;
  weeks: ReturnType<typeof connect>["weeks"];
  visibleRange: ReturnType<typeof connect>["visibleRange"];
};

function MonthCalendar({ api, weeks, visibleRange }: MonthCalendarProps) {
  return (
    <html.div
      {...zagToReactStrictDom(api.getTableProps({ view: "day" }))}
      style={styles.table}
    >
      <html.div
        {...zagToReactStrictDom(api.getTableHeaderProps({ view: "day" }))}
      >
        <html.div
          {...zagToReactStrictDom(api.getTableRowProps({ view: "day" }))}
          style={styles.tableRow}
        >
          {api.weekDays.map((day, i) => (
            <html.div key={i} aria-label={day.long} style={styles.tableHeader}>
              <html.span>{day.short}</html.span>
            </html.div>
          ))}
        </html.div>
      </html.div>
      <html.div
        {...zagToReactStrictDom(api.getTableBodyProps({ view: "day" }))}
      >
        {weeks.map((week, i) => (
          <html.div
            key={i}
            {...zagToReactStrictDom(api.getTableRowProps({ view: "day" }))}
            style={styles.tableRow}
          >
            {week.map((value, i) => {
              const dayProps = api.getDayTableCellTriggerProps({
                value,
                visibleRange,
              });
              const isSelected =
                (dayProps as Record<string, unknown>)["data-selected"] === "";
              const isOutsideRange =
                (dayProps as Record<string, unknown>)["data-outside-range"] ===
                "";
              const isInRange =
                (dayProps as Record<string, unknown>)["data-in-range"] === "";
              const isDisabled =
                (dayProps as Record<string, unknown>)["data-disabled"] === "";

              return (
                <html.div
                  key={i}
                  {...zagToReactStrictDom(api.getDayTableCellProps({ value }))}
                  style={[
                    isInRange && styles.tableCellTriggerInRange,
                    isOutsideRange && styles.tableCellTriggerOutsideRange,
                  ]}
                >
                  <html.button
                    {...zagToReactStrictDom(dayProps)}
                    style={[
                      styles.tableCellTrigger,
                      isSelected && styles.tableCellTriggerSelected,
                      isDisabled && styles.tableCellTriggerDisabled,
                    ]}
                  >
                    <html.span
                      style={isSelected && styles.tableCellTextSelected}
                    >
                      {value.day}
                    </html.span>
                  </html.button>
                </html.div>
              );
            })}
          </html.div>
        ))}
      </html.div>
    </html.div>
  );
}

const styles = css.create({
  presets: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
  },
  presetButton: {
    paddingLeft: 16,
    paddingTop: 8,
    paddingRight: 16,
    paddingBottom: 8,
    backgroundColor: "#EBEEF1",
    borderRadius: 100,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 400,
    color: "#1A2B49",
    borderWidth: 0,
  },
  presetButtonSelected: {
    backgroundColor: "#1A2B49",
    color: "#fff",
  },
  navButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 24,
    cursor: "pointer",
    padding: 10,
  },
  navButtonDisabled: {
    opacity: 0.2,
    cursor: "not-allowed",
  },
  viewTrigger: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1A2B49",
  },
  multipleMonths: {
    display: "flex",
    gap: 24,
  },
  monthWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  monthHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxWidth: 480,
  },
  tableRow: {
    display: "flex",
    marginBottom: 4,
  },
  tableHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 400,
    color: "#63687A",
    height: 44,
  },
  tableCellTrigger: {
    width: 44,
    height: 44,
    padding: 12,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "#1A2B49",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 400,
    color: "#1A2B49",
    borderRadius: 100,
    ":hover": {
      borderWidth: 1,
    },
  },
  tableCellTriggerInRange: {
    backgroundColor: "#EBEEF1",
  },
  tableCellTriggerSelected: {
    backgroundColor: "#1A2B49",
  },
  tableCellTriggerOutsideRange: {
    visibility: "hidden",
  },
  tableCellTriggerDisabled: {
    color: "#D1D5DB",
    cursor: "not-allowed",
    textDecorationLine: "line-through",
    ":hover": {
      borderWidth: 0,
    },
  },
  tableCellTextSelected: {
    color: "#fff",
  },
});
