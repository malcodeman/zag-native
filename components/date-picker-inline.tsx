import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
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

  const handleToday = () => {
    const todayDate = today(getLocalTimeZone());
    api.setValue([todayDate]);
  };

  const handleTomorrow = () => {
    const todayDate = today(getLocalTimeZone());
    const tomorrowDate = todayDate.add({ days: 1 });
    api.setValue([tomorrowDate]);
  };

  return (
    <html.div {...zagToReactStrictDom(api.getContentProps())}>
      <html.div style={styles.presets}>
        <html.button onClick={handleToday} style={styles.presetButton}>
          <html.span>Today</html.span>
        </html.button>
        <html.button onClick={handleTomorrow} style={styles.presetButton}>
          <html.span>Tomorrow</html.span>
        </html.button>
      </html.div>
      <html.div
        {...zagToReactStrictDom(api.getViewControlProps({ view: "day" }))}
        style={styles.viewControl}
      >
        <html.button
          {...zagToReactStrictDom(api.getPrevTriggerProps())}
          style={styles.navButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12.7314 5.18262L7.30078 11H21V13H7.30078L12.7314 18.8184L11.2686 20.1826L3.63184 12L11.2686 3.81738L12.7314 5.18262Z"
              fill="#1A2B49"
            />
          </svg>
        </html.button>
        <html.span style={styles.viewTrigger}>
          {api.visibleRangeText.formatted}
        </html.span>
        <html.button
          {...zagToReactStrictDom(api.getNextTriggerProps())}
          style={styles.navButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M20.3682 12L12.7314 20.1826L11.2686 18.8184L16.6992 13H3V11H16.6992L11.2686 5.18262L12.7314 3.81738L20.3682 12Z"
              fill="#1A2B49"
            />
          </svg>
        </html.button>
      </html.div>
      <html.div style={styles.multipleMonths}>
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
                <html.div
                  key={i}
                  aria-label={day.long}
                  style={styles.tableHeader}
                >
                  <html.span>{day.narrow}</html.span>
                </html.div>
              ))}
            </html.div>
          </html.div>
          <html.div
            {...zagToReactStrictDom(api.getTableBodyProps({ view: "day" }))}
          >
            {api.weeks.map((week, i) => (
              <html.div
                key={i}
                {...zagToReactStrictDom(api.getTableRowProps({ view: "day" }))}
                style={styles.tableRow}
              >
                {week.map((value, i) => {
                  const dayProps = api.getDayTableCellTriggerProps({
                    value,
                    visibleRange: api.visibleRange,
                  });
                  const isSelected =
                    (dayProps as Record<string, unknown>)["data-selected"] ===
                    "";
                  const isOutsideRange =
                    (dayProps as Record<string, unknown>)[
                      "data-outside-range"
                    ] === "";
                  const isInRange =
                    (dayProps as Record<string, unknown>)["data-in-range"] ===
                    "";
                  const isDisabled =
                    (dayProps as Record<string, unknown>)["data-disabled"] ===
                    "";

                  return (
                    <html.div
                      key={i}
                      {...zagToReactStrictDom(
                        api.getDayTableCellProps({ value }),
                      )}
                    >
                      <html.button
                        {...zagToReactStrictDom(dayProps)}
                        style={[
                          styles.tableCellTrigger,
                          isInRange && styles.tableCellTriggerInRange,
                          isSelected && styles.tableCellTriggerSelected,
                          isOutsideRange && styles.tableCellTriggerOutsideRange,
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
                <html.div
                  key={i}
                  aria-label={day.long}
                  style={styles.tableHeader}
                >
                  <html.span>{day.narrow}</html.span>
                </html.div>
              ))}
            </html.div>
          </html.div>
          <html.div
            {...zagToReactStrictDom(api.getTableBodyProps({ view: "day" }))}
          >
            {secondMonth.weeks.map((week, i) => (
              <html.div
                key={i}
                {...zagToReactStrictDom(api.getTableRowProps({ view: "day" }))}
                style={styles.tableRow}
              >
                {week.map((value, i) => {
                  const dayProps = api.getDayTableCellTriggerProps({
                    value,
                    visibleRange: secondMonth.visibleRange,
                  });
                  const isSelected =
                    (dayProps as Record<string, unknown>)["data-selected"] ===
                    "";
                  const isOutsideRange =
                    (dayProps as Record<string, unknown>)[
                      "data-outside-range"
                    ] === "";
                  const isInRange =
                    (dayProps as Record<string, unknown>)["data-in-range"] ===
                    "";
                  const isDisabled =
                    (dayProps as Record<string, unknown>)["data-disabled"] ===
                    "";

                  return (
                    <html.div
                      key={i}
                      {...zagToReactStrictDom(
                        api.getDayTableCellProps({ value }),
                      )}
                    >
                      <html.button
                        {...zagToReactStrictDom(dayProps)}
                        style={[
                          styles.tableCellTrigger,
                          isInRange && styles.tableCellTriggerInRange,
                          isSelected && styles.tableCellTriggerSelected,
                          isOutsideRange && styles.tableCellTriggerOutsideRange,
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
  viewControl: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 24,
    cursor: "pointer",
    padding: 4,
    color: "#333",
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
  table: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxWidth: 480,
  },
  tableRow: {
    display: "flex",
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
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 400,
    color: "#1A2B49",
  },
  tableCellTriggerInRange: {
    backgroundColor: "#EBEEF1",
  },
  tableCellTriggerSelected: {
    backgroundColor: "#1A2B49",
    borderRadius: 100,
  },
  tableCellTriggerOutsideRange: {
    visibility: "hidden",
  },
  tableCellTriggerDisabled: {
    color: "#D1D5DB",
    cursor: "not-allowed",
    textDecorationLine: "line-through",
  },
  tableCellTextSelected: {
    color: "#fff",
  },
});
