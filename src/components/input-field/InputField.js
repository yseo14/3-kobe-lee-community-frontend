export default class InputField {
  constructor({ id, label, type = "text", placeholder = "", helperText = "" }) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.helperText = helperText;
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
    };

    return wrapper;
  }
}
