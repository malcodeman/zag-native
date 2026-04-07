import { Accordion } from "@/components/accordion";
import { Button } from "@/components/button";
import { DatePickerInline } from "@/components/date-picker-inline";
import { Dialog } from "@/components/dialog";
import { NumberInput } from "@/components/number-input";
import { Popover } from "@/components/popover/popover";
import { XStatePopover } from "@/components/popover/xstate-popover";
import { Progress } from "@/components/progress";
import { Switch } from "@/components/switch";
import { useState } from "react";
import { Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";
import "./strict.css";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <html.div style={styles.section}>
      <html.p style={styles.sectionTitle}>{title}</html.p>
      <html.div style={styles.sectionBody}>{children}</html.div>
    </html.div>
  );
}

export default function HomeScreen() {
  const isWeb = Platform.OS === "web";
  const [progress, setProgress] = useState(40);
  const [inputValue, setInputValue] = useState("0");
  const insets = useSafeAreaInsets();

  const accordionItems = [
    { title: "Watercraft", content: "Boats, ships, and other water vessels." },
    {
      title: "Automobiles",
      content: "Cars, trucks, motorcycles, and more.",
    },
    { title: "Aircraft", content: "Planes, helicopters, drones, and gliders." },
  ];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top }}>
      <html.div style={styles.container}>
        <html.div style={styles.header}>
          <html.p style={styles.title}>Component Showcase</html.p>
          <html.p style={styles.subtitle}>
            Cross-platform UI components built with Zag.js
          </html.p>
        </html.div>
        <html.div style={styles.grid}>
          <Section title="Button">
            <html.div style={styles.row}>
              <Button onClick={() => alert("Button clicked!")}>
                Primary Action
              </Button>
            </html.div>
          </Section>
          <Section title="Switch">
            <html.div style={styles.row}>
              <Switch label="Enable notifications" />
              <Switch label="Dark mode" defaultChecked />
            </html.div>
          </Section>
          <Section title="Number Input">
            <NumberInput
              value={inputValue}
              onValueChange={(details) => setInputValue(details.value)}
            />
          </Section>
          <Section title="Progress">
            <Progress value={progress} label="Completion" showValueText />
            <html.div style={styles.row}>
              <Button onClick={() => setProgress(Math.max(0, progress - 20))}>
                − Decrease
              </Button>
              <Button onClick={() => setProgress(Math.min(100, progress + 20))}>
                + Increase
              </Button>
            </html.div>
          </Section>
          <Section title="Popover">
            <html.div style={styles.row}>
              <Popover trigger={<Button>Open Zag Popover</Button>}>
                <html.p style={styles.popoverText}>
                  This popover is powered by Zag.js state machines.
                </html.p>
              </Popover>
              {isWeb ? (
                <XStatePopover trigger={<Button>Open XState Popover</Button>}>
                  <html.p style={styles.popoverText}>
                    This popover uses an XState machine.
                  </html.p>
                </XStatePopover>
              ) : null}
            </html.div>
          </Section>
          <Section title="Dialog">
            <Dialog triggerLabel="View Pricing" title="Pro Plan — $12/mo">
              <html.div style={dialogStyles.priceList}>
                {[
                  { label: "Unlimited projects", price: "Included" },
                  { label: "Priority support", price: "Included" },
                  { label: "Custom domain", price: "+$4/mo" },
                  { label: "Analytics", price: "+$2/mo" },
                ].map(({ label, price }) => (
                  <html.div key={label} style={dialogStyles.priceRow}>
                    <html.span style={dialogStyles.priceLabel}>
                      {label}
                    </html.span>
                    <html.span style={dialogStyles.priceValue}>
                      {price}
                    </html.span>
                  </html.div>
                ))}
              </html.div>
            </Dialog>
          </Section>
          <Section title="Accordion">
            <Accordion items={accordionItems} multiple />
          </Section>
          <Section title="Date Picker">
            <DatePickerInline />
          </Section>
        </html.div>
      </html.div>
    </ScrollView>
  );
}

const dialogStyles = css.create({
  priceList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: "#333",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#DC3918",
  },
});

const styles = css.create({
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9E8E6",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#21201C",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6F6D66",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E9E8E6",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6F6D66",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  sectionBody: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  popoverText: {
    fontSize: 14,
    color: "#333",
    maxWidth: 200,
  },
});
