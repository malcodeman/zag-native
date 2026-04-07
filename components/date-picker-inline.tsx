import { nativeGetRootNode } from "@/utils/native";
import { zagToReactStrictDom } from "@/utils/zag-to-react-strict-dom";
import * as datePicker from "@zag-js/date-picker";
import { normalizeProps, useMachine } from "@zag-js/react";
import { useId } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";

type DatePickerInlineProps = Omit<datePicker.Props, "id">;

const nativeMachine: typeof datePicker.machine = {
  ...datePicker.machine,
  implementations: {
    ...datePicker.machine.implementations,
    effects: {
      ...datePicker.machine.implementations?.effects,
      setupLiveRegion: () => {},
    },
  },
};

export function DatePickerInline(props: DatePickerInlineProps) {
  const machine = Platform.OS === "web" ? datePicker.machine : nativeMachine;
  const service = useMachine(machine, {
    id: useId(),
    locale: "en-US",
    selectionMode: "single",
    open: true,
    closeOnSelect: false,
    ...props,
    ...(Platform.OS !== "web" && { getRootNode: nativeGetRootNode }),
  });
  const api = datePicker.connect(service, normalizeProps);

  return (
    <html.div
      {...zagToReactStrictDom(api.getContentProps())}
      style={styles.content}
    >
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
              <html.span>‹</html.span>
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
              <html.span>›</html.span>
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
  content: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    minWidth: 280,
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
    fontSize: 14,
    fontWeight: "600",
    cursor: "pointer",
    padding: 4,
    color: "#333",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  tableRow: {
    display: "flex",
    gap: 4,
  },
  tableHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    padding: 8,
  },
  tableCell: {
    flex: 1,
  },
  tableCellTrigger: {
    width: "100%",
    padding: 8,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    color: "#333",
  },
  tableCellTriggerSelected: {
    backgroundColor: "#DC3918",
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
