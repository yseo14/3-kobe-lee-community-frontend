export default class ProfileUpload {
  constructor({
    id = "profile-upload",
    label = "프로필 사진",
    helperText = "",
  }) {
    this.id = id;
    this.label = label;
    this.helperText = helperText;
    this.imageData = null; // 업로드된 이미지 저장용
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "profile-upload-component";

    const labelEl = document.createElement("label");
    labelEl.className = "input-label";
    labelEl.textContent = this.label;

    const helperEl = document.createElement("p");
    helperEl.className = "helper-text";
    helperEl.textContent = this.helperText;

    const uploadArea = document.createElement("div");
    uploadArea.className = "profile-upload-area";
    uploadArea.id = this.id;

    const plusIcon = document.createElement("span");
    plusIcon.className = "plus-icon";
    plusIcon.textContent = "+";

    // 파일 입력
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.hidden = true;

    // upload Area에 이미지, + 기호 붙이기
    uploadArea.appendChild(plusIcon);
    uploadArea.appendChild(fileInput);

    uploadArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadArea.innerHTML = ""; // 기존 "+" 제거
          const img = document.createElement("img");
          img.src = event.target.result;
          uploadArea.appendChild(img);
          this.imageData = event.target.result; // 저장
        };
        reader.readAsDataURL(file);
      }
    });

    this.showHelper = (message) => {
      helperEl.textContent = message;
      helperEl.classList.add("show");
    };

    this.hideHelper = () => {
      helperEl.classList.remove("show");
    };

    this.getImage = () => this.imageData;

    wrapper.appendChild(labelEl);
    wrapper.appendChild(helperEl);
    wrapper.appendChild(uploadArea);

    return wrapper;
  }
}
