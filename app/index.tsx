import { Accordion } from "@/components/accordion";
import { Button } from "@/components/button";
import { NumberInput } from "@/components/number-input";
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
        <XStatePopover trigger={<Button>Open Popover</Button>}>
          Popover content
        </XStatePopover>
      ) : null}
      <Switch label="Toggle" />
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
