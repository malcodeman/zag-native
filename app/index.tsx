import { Platform } from "react-native";
import { css, html } from "react-strict-dom";
import { Button } from "./components/button";
import { XStatePopover } from "./components/popover/xstate-popover";
import { Switch } from "./components/switch";
import "./strict.css";

const stylesStrict = css.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default function HomeScreen() {
  const isWeb = Platform.OS === "web";

  return (
    <html.div style={stylesStrict.container}>
      <html.p style={stylesStrict.title}>Hello cross-platform 👋</html.p>
      <Button onClick={() => alert("click cros platform")}>Click me</Button>
      {isWeb ? (
        <XStatePopover trigger={<Button>Open Popover</Button>}>
          Popover content
        </XStatePopover>
      ) : null}
      <Switch />
    </html.div>
  );
}
