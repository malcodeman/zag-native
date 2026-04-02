import { css, html } from "react-strict-dom";

const style = css.create({
  button: {
    padding: 16,
    backgroundColor: "#DC3918",
    borderRadius: 12,
    borderWidth: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: -0.5,
  },
});

export function Button(props: React.ComponentProps<typeof html.button>) {
  return (
    <html.button {...props} style={style.button}>
      <html.span style={style.buttonText}>{props.children}</html.span>
    </html.button>
  );
}
