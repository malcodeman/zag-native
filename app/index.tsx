import { css, html } from "react-strict-dom";
import { Button } from "./components/button";
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
  return (
    <html.div style={stylesStrict.container}>
      <html.p style={stylesStrict.title}>Hello cross-platform 👋</html.p>
      <Button onClick={() => alert("click cros platform")}>Click me</Button>
    </html.div>
  );
}
