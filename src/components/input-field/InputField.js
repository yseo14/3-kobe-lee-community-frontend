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
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "input-field-component";

    const labelEl = document.createElement("label");
    labelEl.className = "input-label";
    labelEl.setAttribute("for", this.id);
    labelEl.textContent = this.label;

    const inputEl = document.createElement("input");
    inputEl.className = "input-field";
    inputEl.type = this.type;
    inputEl.id = this.id;
    inputEl.placeholder = this.placeholder;

    const helperEl = document.createElement("p");
    helperEl.className = "helper-text";
    helperEl.textContent = this.helperText;

    wrapper.appendChild(labelEl);
    wrapper.appendChild(inputEl);
    wrapper.appendChild(helperEl);

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
      this.hideHelper(); // 포커스 들어오면 기존 메시지 숨기기
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

      // 통과 시 숨김
      this.hideHelper();
    });

    return wrapper;
  }
}
