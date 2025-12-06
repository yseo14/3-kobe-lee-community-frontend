import { uploadProfileImage } from "/src/api/uploadApi.js";

export default class ProfileUpload {
  constructor({
    id = "profile-upload",
    label = "프로필 사진",
    helperText = "",
    currentImageUrl = null, // 현재 프로필 이미지 URL
  }) {
    this.id = id;
    this.label = label;
    this.helperText = helperText;
    this.currentImageUrl = currentImageUrl;
    this.imageData = null; // 업로드된 이미지 저장용
    this.objectKey = null; // 업로드된 이미지의 objectKey 저장용
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

    // 현재 프로필 이미지가 있으면 표시, 없으면 + 아이콘 표시
    if (this.currentImageUrl) {
      const currentImg = document.createElement("img");
      currentImg.src = this.currentImageUrl;
      uploadArea.appendChild(currentImg);
      
      // 편집 가능하다는 것을 알려주는 오버레이 추가
      const editOverlay = document.createElement("div");
      editOverlay.className = "edit-overlay";
      const editIcon = document.createElement("span");
      editIcon.className = "edit-icon";
      editIcon.textContent = "✎"; // 편집 아이콘
      editOverlay.appendChild(editIcon);
      uploadArea.appendChild(editOverlay);
    } else {
      uploadArea.appendChild(plusIcon);
    }
    uploadArea.appendChild(fileInput);

    uploadArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        // 이미지 미리보기
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadArea.innerHTML = ""; // 기존 내용 제거
          const img = document.createElement("img");
          img.src = event.target.result;
          uploadArea.appendChild(img);
          
          // 편집 오버레이도 새 이미지에 추가
          const editOverlay = document.createElement("div");
          editOverlay.className = "edit-overlay";
          const editIcon = document.createElement("span");
          editIcon.className = "edit-icon";
          editIcon.textContent = "✎";
          editOverlay.appendChild(editIcon);
          uploadArea.appendChild(editOverlay);
          
          this.imageData = event.target.result; // 저장
        };
        reader.readAsDataURL(file);

        // 이미지 업로드 API 호출
        try {
          console.log("[ProfileUpload] 이미지 업로드 시작");
          const { ok, data } = await uploadProfileImage(file);
          console.log("[ProfileUpload] 업로드 응답:", { ok, data });
          
          if (ok && data.status === 201 && data.data && data.data.length > 0) {
            this.objectKey = data.data[0].objectKey;
            console.log("[ProfileUpload] objectKey 저장됨:", this.objectKey);
            this.hideHelper();
          } else {
            console.warn("[ProfileUpload] 업로드 실패 - 응답 형식이 올바르지 않음:", { ok, data });
            this.showHelper("이미지 업로드에 실패했습니다.");
            this.objectKey = null;
          }
        } catch (err) {
          console.error("[ProfileUpload] 이미지 업로드 실패:", err);
          this.showHelper("이미지 업로드에 실패했습니다.");
          this.objectKey = null;
        }
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
    this.getObjectKey = () => {
      console.log("[ProfileUpload] getObjectKey 호출됨, 현재 objectKey:", this.objectKey);
      return this.objectKey;
    };

    wrapper.appendChild(labelEl);
    wrapper.appendChild(helperEl);
    wrapper.appendChild(uploadArea);

    return wrapper;
  }
}
