export default class Button {
  constructor({
    text = "", // 텍스트 버튼일 때 표시할 문구
    icon = null, // 이미지 버튼일 때 사용할 아이콘 경로
    ariaLabel = "", // 접근성용
    className = "primary", // 스타일 타입 (primary, text, icon 등)
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
