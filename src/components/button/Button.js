export default class Button {
  constructor({
    text = "",
    icon = null,
    ariaLabel = "",
    className = "primary", // primary, text, icon, secondary-outline
    width = "auto",
    height = "auto",
    onClick = () => {},
  }) {
    this.text = text;
    this.icon = icon;
    this.ariaLabel = ariaLabel;
    this.className = className;
    this.width = width;
    this.height = height;
    this.onClick = onClick;
  }

  render() {
    const button = document.createElement("button");
    button.className = `button ${this.className}`;
    button.style.width = this.width;
    button.style.height = this.height;
    button.setAttribute("type", "button");
    if (this.ariaLabel) button.setAttribute("aria-label", this.ariaLabel);

    if (this.icon) {
      const img = document.createElement("img");
      img.src = this.icon;
      img.alt = this.ariaLabel || this.text || "button icon";
      img.className = "button-icon";
      button.appendChild(img);
    }

    if (this.text) {
      const span = document.createElement("span");
      span.textContent = this.text;
      button.appendChild(span);
    }

    button.addEventListener("click", (e) => this.onClick(e));
    return button;
  }
}
