export default class InputField {
  constructor({
    id,
    label,
    type = "text",
    placeholder = "",
    helperText = "",
    required = false,
    requiredMessage = "",
    validateFn = null,
    invalidMessage = "",
    width = "320px",
    height = null,
  }) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.helperText = helperText;
    this.required = required;
    this.requiredMessage = requiredMessage;
    this.validateFn = validateFn;
    this.invalidMessage = invalidMessage;
    this.width = width;
    this.height = height;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "input-field-component";

    const labelEl = document.createElement("label");
    labelEl.className = "input-label";
    labelEl.setAttribute("for", this.id);
    labelEl.textContent = this.label;

    // type이 "textarea"일 경우 textarea 생성
    const inputEl =
      this.type === "textarea"
        ? document.createElement("textarea")
        : document.createElement("input");

    inputEl.className = "input-field";
    inputEl.id = this.id;
    inputEl.placeholder = this.placeholder;

    // type이 input일 때만 type 속성 부여
    if (this.type !== "textarea") inputEl.type = this.type;

    // width / height 반영
    inputEl.style.width = this.width;
    if (this.height) inputEl.style.height = this.height;

    const helperEl = document.createElement("p");
    helperEl.className = "helper-text";
    helperEl.textContent = this.helperText;

    wrapper.appendChild(labelEl);
    wrapper.appendChild(inputEl);
    wrapper.appendChild(helperEl);

    // Helper 표시/숨김 함수
    this.showHelper = (message) => {
      helperEl.textContent = message;
      helperEl.classList.add("show");
    };

    this.hideHelper = () => {
      helperEl.classList.remove("show");
      helperEl.textContent = "";
    };

    this.inputEl = inputEl;
    this.helperEl = helperEl;

    // focus/blur 기반 검증 자동 적용
    inputEl.addEventListener("focus", () => {
      this.hideHelper();
    });

    inputEl.addEventListener("blur", () => {
      const value = inputEl.value.trim();

      // 필수값 검증
      if (this.required && !value) {
        this.showHelper(
          this.requiredMessage || "이 필드는 필수 입력 항목입니다."
        );
        return;
      }

      // 커스텀 유효성 검증
      if (this.validateFn && !this.validateFn(value)) {
        this.showHelper(this.invalidMessage || "유효하지 않은 입력입니다.");
        return;
      }

      this.hideHelper();
    });

    return wrapper;
  }
}
