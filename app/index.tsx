import { Accordion } from "@/components/accordion";
import { Button } from "@/components/button";
import { Dialog } from "@/components/dialog";
import { NumberInput } from "@/components/number-input";
import { Popover } from "@/components/popover/popover";
import { XStatePopover } from "@/components/popover/xstate-popover";
import { Progress } from "@/components/progress";
import { Switch } from "@/components/switch";
import { useState } from "react";
import { Platform } from "react-native";
import { css, html } from "react-strict-dom";
import "./strict.css";

export default function HomeScreen() {
  const isWeb = Platform.OS === "web";
  const [progress, setProgress] = useState(0);
  const [inputValue, setInputValue] = useState("0");

  const accordionItems = [
    { title: "Watercraft", content: "Sample accordion content" },
    { title: "Automobiles", content: "Sample accordion content" },
    { title: "Aircraft", content: "Sample accordion content" },
  ];

  return (
    <html.div style={styles.container}>
      <html.p style={styles.title}>Hello cross-platform 👋</html.p>
      <Button onClick={() => alert("click cros platform")}>Click me</Button>
      {isWeb ? (
        <XStatePopover trigger={<Button>Open xstate Popover</Button>}>
          Popover content
        </XStatePopover>
      ) : null}
      <Popover trigger={<Button>Open zag Popover</Button>}>
        Popover content
      </Popover>
      <Switch label="Toggle" />
      <Dialog triggerLabel="View Pricing" title="Pro Plan — $12/mo">
        <html.div style={dialogStyles.priceList}>
          {[
            { label: "Unlimited projects", price: "Included" },
            { label: "Priority support", price: "Included" },
            { label: "Custom domain", price: "+$4/mo" },
            { label: "Analytics", price: "+$2/mo" },
          ].map(({ label, price }) => (
            <html.div key={label} style={dialogStyles.priceRow}>
              <html.span style={dialogStyles.priceLabel}>{label}</html.span>
              <html.span style={dialogStyles.priceValue}>{price}</html.span>
            </html.div>
          ))}
        </html.div>
      </Dialog>
      <Accordion items={accordionItems} multiple />
      <NumberInput
        value={inputValue}
        onValueChange={(details) => setInputValue(details.value)}
      />
      <Progress value={progress} label="Loading..." showValueText />
      <html.div style={styles.buttonGroup}>
        <Button onClick={() => setProgress(progress - 20)}>Decrease</Button>
        <Button onClick={() => setProgress(progress + 20)}>Increase</Button>
      </html.div>
    </html.div>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonGroup: {
    display: "flex",
    gap: 8,
    marginTop: 16,
  },
});
