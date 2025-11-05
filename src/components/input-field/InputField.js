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
    onBlur = null,
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
    this.onBlur = onBlur; // 외부에서 전달받은 추가적인 onBlur 콜백 (필수값 외에 중복검사 같은 것)
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "input-field-component";

    const labelEl = document.createElement("label");
    labelEl.className = "input-label";
    labelEl.setAttribute("for", this.id);
    labelEl.textContent = this.label;

    const inputEl =
      this.type === "textarea"
        ? document.createElement("textarea")
        : document.createElement("input");

    inputEl.className = "input-field";
    inputEl.id = this.id;
    inputEl.placeholder = this.placeholder;

    if (this.type !== "textarea") inputEl.type = this.type;
    inputEl.style.width = this.width;
    if (this.height) inputEl.style.height = this.height;

    const helperEl = document.createElement("p");
    helperEl.className = "helper-text";
    helperEl.textContent = this.helperText;

    wrapper.append(labelEl, inputEl, helperEl);

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

    inputEl.addEventListener("blur", async (e) => {
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

      // 외부 onBlur 콜백이 있을 경우 추가 실행
      if (typeof this.onBlur === "function") {
        try {
          await this.onBlur(e);
        } catch (err) {
          console.error("InputField onBlur error:", err);
        }
      }
    });

    // focus 시 helper 숨기기
    inputEl.addEventListener("focus", () => this.hideHelper());

    return wrapper;
  }
}
