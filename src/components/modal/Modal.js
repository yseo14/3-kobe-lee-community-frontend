import Button from "/src/components/button/Button.js";

export default class Modal {
  constructor({
    title = "",
    message = "",
    confirmText = "확인",
    cancelText = null,
    onConfirm = () => {},
    onCancel = () => {},
    width = "360px",
  }) {
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.width = width;
  }

  render() {
    // 오버레이(모달창 바깥 부분)
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    // 모달 박스
    const modal = document.createElement("div");
    modal.className = "custom-modal";
    modal.style.width = this.width;

    // 제목
    if (this.title) {
      const titleEl = document.createElement("h2");
      titleEl.className = "modal-title";
      titleEl.textContent = this.title;
      modal.appendChild(titleEl);
    }

    // 본문
    if (this.message) {
      const msgEl = document.createElement("p");
      msgEl.className = "modal-message";
      msgEl.textContent = this.message;
      modal.appendChild(msgEl);
    }

    // 버튼 박스
    const buttonBox = document.createElement("div");
    buttonBox.className = "modal-buttons";

    // 취소 버튼 (옵션)
    if (this.cancelText) {
      const cancelBtn = new Button({
        text: this.cancelText,
        className: "secondary-outline",
        width: "120px",
        height: "44px",
        onClick: () => {
          this.close();
          this.onCancel();
        },
      }).render();
      buttonBox.appendChild(cancelBtn);
    }

    // 확인 버튼
    const confirmBtn = new Button({
      text: this.confirmText,
      className: "primary",
      width: "120px",
      height: "44px",
      onClick: () => {
        this.close();
        this.onConfirm();
      },
    }).render();

    buttonBox.appendChild(confirmBtn);
    modal.appendChild(buttonBox);
    overlay.appendChild(modal);

    // 오버레이 클릭 시 닫기
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.close();
        this.onCancel();
      }
    });

    this.overlay = overlay;
    return overlay;
  }

  open() {
    document.body.appendChild(this.overlay || this.render());
  }

  close() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
