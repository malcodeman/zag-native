import { css, html } from "react-strict-dom";
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
  button: {
    padding: 8,
    backgroundColor: "#000",
    borderRadius: 8,
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default function HomeScreen() {
  return (
    <html.div style={stylesStrict.container}>
      <html.p style={stylesStrict.title}>Hello cross-platform 👋</html.p>
      <html.button
        style={stylesStrict.button}
        onClick={() => alert("click cros platform")}
      >
        <html.span style={stylesStrict.buttonText}>Click me</html.span>
      </html.button>
    </html.div>
  );
}
