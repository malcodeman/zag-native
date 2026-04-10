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
    ...props,
    ...(Platform.OS !== "web" && { getRootNode: nativeGetRootNode }),
  });
  const api = connect(service, normalizeProps);

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
      <html.div hidden={api.view !== "day" ? true : undefined}>
        <html.div
          {...zagToReactStrictDom(api.getViewControlProps({ view: "day" }))}
          style={styles.viewControl}
        >
          <html.button
            {...zagToReactStrictDom(api.getPrevTriggerProps())}
            style={styles.navButton}
          >
            <html.span>‹</html.span>
          </html.button>
          <html.button
            {...zagToReactStrictDom(api.getViewTriggerProps())}
            style={styles.viewTrigger}
          >
            <html.span>{api.visibleRangeText.start}</html.span>
          </html.button>
          <html.button
            {...zagToReactStrictDom(api.getNextTriggerProps())}
            style={styles.navButton}
          >
            <html.span>›</html.span>
          </html.button>
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
            {api.weeks.map((week, i) => (
              <html.div
                key={i}
                {...zagToReactStrictDom(api.getTableRowProps({ view: "day" }))}
                style={styles.tableRow}
              >
                {week.map((value, i) => {
                  const dayProps = api.getDayTableCellTriggerProps({ value });
                  const isSelected =
                    (dayProps as Record<string, unknown>)["data-selected"] ===
                    "";

                  return (
                    <html.div
                      key={i}
                      {...zagToReactStrictDom(
                        api.getDayTableCellProps({ value }),
                      )}
                      style={styles.tableCell}
                    >
                      <html.button
                        {...zagToReactStrictDom(dayProps)}
                        style={[
                          styles.tableCellTrigger,
                          isSelected && styles.tableCellTriggerSelected,
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
      <html.div style={styles.viewsContainer}>
        <html.div
          hidden={api.view !== "month" ? true : undefined}
          style={styles.viewSection}
        >
          <html.div
            {...zagToReactStrictDom(api.getViewControlProps({ view: "month" }))}
            style={styles.viewControl}
          >
            <html.button
              {...zagToReactStrictDom(
                api.getPrevTriggerProps({ view: "month" }),
              )}
              style={styles.navButton}
            >
              <html.span>‹</html.span>
            </html.button>
            <html.button
              {...zagToReactStrictDom(
                api.getViewTriggerProps({ view: "month" }),
              )}
              style={styles.viewTrigger}
            >
              <html.span>{api.visibleRange.start.year}</html.span>
            </html.button>
            <html.button
              {...zagToReactStrictDom(
                api.getNextTriggerProps({ view: "month" }),
              )}
              style={styles.navButton}
            >
              <html.span>›</html.span>
            </html.button>
          </html.div>
          <html.div
            {...zagToReactStrictDom(
              api.getTableProps({ view: "month", columns: 4 }),
            )}
            style={styles.table}
          >
            <html.div
              {...zagToReactStrictDom(api.getTableBodyProps({ view: "month" }))}
            >
              {api
                .getMonthsGrid({ columns: 4, format: "short" })
                .map((months, row) => (
                  <html.div
                    key={row}
                    {...zagToReactStrictDom(api.getTableRowProps())}
                    style={styles.tableRow}
                  >
                    {months.map((month, index) => (
                      <html.div
                        key={index}
                        {...zagToReactStrictDom(
                          api.getMonthTableCellProps({
                            ...month,
                            columns: 4,
                          }),
                        )}
                        style={styles.tableCell}
                      >
                        <html.button
                          {...zagToReactStrictDom(
                            api.getMonthTableCellTriggerProps({
                              ...month,
                              columns: 4,
                            }),
                          )}
                          style={styles.tableCellTrigger}
                        >
                          <html.span>{month.label}</html.span>
                        </html.button>
                      </html.div>
                    ))}
                  </html.div>
                ))}
            </html.div>
          </html.div>
        </html.div>
        <html.div
          hidden={api.view !== "year" ? true : undefined}
          style={styles.viewSection}
        >
          <html.div
            {...zagToReactStrictDom(api.getViewControlProps({ view: "year" }))}
            style={styles.viewControl}
          >
            <html.button
              {...zagToReactStrictDom(
                api.getPrevTriggerProps({ view: "year" }),
              )}
              style={styles.navButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
              >
                <path
                  opacity="0.2"
                  d="M9.09961 1.36523L3.66895 7.18262H17.3682V9.18262H3.66895L9.09961 15.001L7.63672 16.3652L0 8.18262L7.63672 0L9.09961 1.36523Z"
                  fill="#1A2B49"
                />
              </svg>
            </html.button>
            <html.span style={styles.decadeLabel}>
              {api.getDecade().start} - {api.getDecade().end}
            </html.span>
            <html.button
              {...zagToReactStrictDom(
                api.getNextTriggerProps({ view: "year" }),
              )}
              style={styles.navButton}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
              >
                <path
                  d="M17.3682 8.18262L9.73145 16.3652L8.26855 15.001L13.6992 9.18262H0V7.18262H13.6992L8.26855 1.36523L9.73145 0L17.3682 8.18262Z"
                  fill="#1A2B49"
                />
              </svg>
            </html.button>
          </html.div>
          <html.div
            {...zagToReactStrictDom(
              api.getTableProps({ view: "year", columns: 4 }),
            )}
            style={styles.table}
          >
            <html.div {...zagToReactStrictDom(api.getTableBodyProps())}>
              {api.getYearsGrid({ columns: 4 }).map((years, row) => (
                <html.div
                  key={row}
                  {...zagToReactStrictDom(
                    api.getTableRowProps({ view: "year" }),
                  )}
                  style={styles.tableRow}
                >
                  {years.map((year, index) => (
                    <html.div
                      key={index}
                      {...zagToReactStrictDom(
                        api.getYearTableCellProps({
                          ...year,
                          columns: 4,
                        }),
                      )}
                      style={styles.tableCell}
                    >
                      <html.button
                        {...zagToReactStrictDom(
                          api.getYearTableCellTriggerProps({
                            ...year,
                            columns: 4,
                          }),
                        )}
                        style={styles.tableCellTrigger}
                      >
                        <html.span>{year.label}</html.span>
                      </html.button>
                    </html.div>
                  ))}
                </html.div>
              ))}
            </html.div>
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
    backgroundColor: "transparent",
    borderWidth: 0,
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    color: "#1A2B49",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    maxWidth: 480,
  },
  tableRow: {
    display: "flex",
    gap: 4,
  },
  tableHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 400,
    color: "#63687A",
    height: 44,
  },
  tableCell: {
    flex: 1,
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
  tableCellTriggerSelected: {
    backgroundColor: "#1A2B49",
    borderRadius: 100,
  },
  tableCellTextSelected: {
    color: "#fff",
  },
  viewsContainer: {
    display: "flex",
    gap: 40,
  },
  viewSection: {
    width: "100%",
  },
  decadeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
