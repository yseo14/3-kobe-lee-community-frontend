export default class Button {
  constructor({
    text = "버튼",
    className = "primary", // 스타일 타입 (예: primary, secondary)
    width = "320px",
    onClick = () => {},
  }) {
    this.text = text;
    this.className = className;
    this.width = width;
    this.onClick = onClick;
  }

  render() {
    const button = document.createElement("button");
    button.className = `button ${this.className}`;
    button.textContent = this.text;
    button.style.width = this.width;

    // 클릭 이벤트 연결
    button.addEventListener("click", (e) => this.onClick(e));

    return button;
  }
}
