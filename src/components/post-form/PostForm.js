import InputField from "/src/components/input-field/InputField.js";
import Button from "/src/components/button/Button.js";
import { showToast } from "/src/utils/showToast.js";
import { uploadPostImage } from "/src/api/uploadApi.js";
import { getS3ImageUrl } from "/src/config/appConfig.js";

export default function PostForm({
  mode = "create",
  initialData = {},
  onSubmit,
}) {
  const container = document.createElement("div");
  container.className = "post-form-container";

  // ===== 제목 영역 (게시글 작성 / 수정 제목 표시) =====
  const header = document.createElement("h1");
  header.className = "post-form-title";
  header.textContent = mode === "edit" ? "게시글 수정" : "게시글 작성";
  container.appendChild(header);

  // ===== 제목 입력 필드 =====
  const titleField = new InputField({
    id: "title",
    label: "제목*",
    type: "text",
    placeholder: "제목을 입력해주세요. (최대 26글자)",
    required: true,
    validateFn: (v) => v.length <= 26,
    invalidMessage: "제목은 26자 이내로 입력해주세요.",
    width: "560px",
  });
  const titleEl = titleField.render();
  container.appendChild(titleEl);

  // ===== 내용 입력 필드 =====
  const contentField = new InputField({
    id: "content",
    label: "내용*",
    type: "textarea",
    placeholder: "내용을 입력해주세요.",
    height: "300px",
    required: true,
    width: "560px",
  });
  const contentEl = contentField.render();
  container.appendChild(contentEl);

  // ===== 이미지 업로드 영역 =====
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image-upload-wrapper";

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "이미지";
  imageLabel.style.display = "block";
  imageLabel.style.marginBottom = "6px";
  imageWrapper.appendChild(imageLabel);

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.multiple = true;
  fileInput.accept = "image/*";

  const helperText = document.createElement("p");
  helperText.className = "helper-text";
  helperText.textContent = "여러 이미지를 선택할 수 있습니다.";
  helperText.style.fontSize = "13px";
  helperText.style.color = "#666";
  helperText.style.marginTop = "4px";

  const imagePreviewContainer = document.createElement("div");
  imagePreviewContainer.className = "image-preview-container";

  // 업로드된 이미지 objectKey 저장
  const uploadedImageKeys = [];

  // 이미지 미리보기 아이템 생성 함수
  const createImagePreviewItem = (imageUrl, objectKey, isExisting = false) => {
    const previewItem = document.createElement("div");
    previewItem.className = "image-preview-item";
    previewItem.dataset.objectKey = objectKey;

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "이미지 미리보기";
    img.className = "preview-image";

    const overlay = document.createElement("div");
    overlay.className = "preview-overlay";

    const statusText = document.createElement("span");
    statusText.className = "preview-status";
    if (isExisting) {
      statusText.textContent = "기존 이미지";
      statusText.style.background = "#3498db";
    } else {
      statusText.textContent = "업로드 완료";
      statusText.style.background = "#27ae60";
    }

    overlay.appendChild(statusText);
    previewItem.appendChild(img);
    previewItem.appendChild(overlay);

    return previewItem;
  };

  // 로딩 중 미리보기 아이템 생성 함수
  const createLoadingPreviewItem = (file) => {
    const previewItem = document.createElement("div");
    previewItem.className = "image-preview-item loading";

    // FileReader로 로컬 파일 미리보기
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = previewItem.querySelector("img");
      if (img) {
        img.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);

    const img = document.createElement("img");
    img.alt = "업로드 중...";
    img.className = "preview-image";

    const overlay = document.createElement("div");
    overlay.className = "preview-overlay";

    const statusText = document.createElement("span");
    statusText.className = "preview-status";
    statusText.textContent = "업로드 중...";
    statusText.style.background = "#f39c12";

    overlay.appendChild(statusText);
    previewItem.appendChild(img);
    previewItem.appendChild(overlay);

    return previewItem;
  };

  // 에러 미리보기 아이템 생성 함수
  const createErrorPreviewItem = (fileName) => {
    const previewItem = document.createElement("div");
    previewItem.className = "image-preview-item error";

    const errorDiv = document.createElement("div");
    errorDiv.className = "preview-error";
    errorDiv.innerHTML = `
      <span class="error-icon">⚠️</span>
      <span class="error-text">${fileName}</span>
      <span class="error-message">업로드 실패</span>
    `;

    previewItem.appendChild(errorDiv);
    return previewItem;
  };

  // 파일 선택 시 업로드 및 미리보기 표시
  fileInput.addEventListener("change", async () => {
    // 기존 이미지 미리보기 유지
    const existingPreviews = Array.from(
      imagePreviewContainer.querySelectorAll(".image-preview-item[data-is-existing='true']")
    );

    // 새로 선택한 파일들만 업로드
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
      // 파일이 없으면 기존 미리보기만 표시
      imagePreviewContainer.innerHTML = "";
      existingPreviews.forEach((preview) => {
        imagePreviewContainer.appendChild(preview);
      });
      return;
    }

    // 기존 미리보기 초기화 후 기존 이미지 다시 추가
    imagePreviewContainer.innerHTML = "";
    existingPreviews.forEach((preview) => {
      imagePreviewContainer.appendChild(preview);
    });

    // 각 파일에 대해 업로드 진행
    for (const file of files) {
      const loadingItem = createLoadingPreviewItem(file);
      imagePreviewContainer.appendChild(loadingItem);

      try {
        const { ok, data } = await uploadPostImage(file);
        if (ok && data.status === 201 && data.data && data.data.length > 0) {
          const objectKey = data.data[0].objectKey;
          uploadedImageKeys.push(objectKey);
          const imageUrl = getS3ImageUrl(objectKey);
          
          // 로딩 아이템을 완료 아이템으로 교체
          const completedItem = createImagePreviewItem(imageUrl, objectKey, false);
          loadingItem.replaceWith(completedItem);
        } else {
          // 로딩 아이템을 에러 아이템으로 교체
          const errorItem = createErrorPreviewItem(file.name);
          loadingItem.replaceWith(errorItem);
          showToast(`${file.name} 업로드에 실패했습니다.`);
        }
      } catch (err) {
        console.error("[PostForm] 이미지 업로드 실패:", err);
        const errorItem = createErrorPreviewItem(file.name);
        loadingItem.replaceWith(errorItem);
        showToast(`${file.name} 업로드에 실패했습니다.`);
      }
    }
  });

  // 수정 모드일 때 기존 이미지 미리보기 표시
  const existingImageKeys = [];
  if (mode === "edit" && initialData.imageKeyList?.length > 0) {
    initialData.imageKeyList.forEach((imgKey) => {
      existingImageKeys.push(imgKey);
      const imageUrl = getS3ImageUrl(imgKey);
      const previewItem = createImagePreviewItem(imageUrl, imgKey, true);
      previewItem.dataset.isExisting = "true";
      imagePreviewContainer.appendChild(previewItem);
    });
  }

  imageWrapper.append(fileInput, helperText, imagePreviewContainer);
  container.appendChild(imageWrapper);

  // ===== 초기값 세팅 (수정 모드) =====
  if (mode === "edit" && initialData) {
    titleField.inputEl.value = initialData.title || "";
    contentField.inputEl.value = initialData.content || "";
  }

  // ===== 제출 버튼 =====
  const submitButton = new Button({
    text: mode === "edit" ? "수정하기" : "작성하기",
    className: "primary",
    width: "560px",
    onClick: async (e) => {
      e.preventDefault();

      const title = titleField.inputEl.value.trim();
      const content = contentField.inputEl.value.trim();

      if (!title) return showToast("제목을 입력해주세요.");
      if (title.length > 26)
        return showToast("제목은 최대 26자까지 입력 가능합니다.");
      if (!content) return showToast("내용을 입력해주세요.");

      // 업로드된 이미지 objectKey 사용
      // 수정 모드일 때 기존 이미지와 새로 업로드한 이미지 합치기
      let finalImageKeyList = [...uploadedImageKeys];
      
      if (mode === "edit" && initialData.imageKeyList?.length > 0) {
        // 기존 이미지 키들도 포함 (새로 업로드한 이미지 뒤에 추가)
        finalImageKeyList = [...uploadedImageKeys, ...initialData.imageKeyList];
      }

      // onSubmit 콜백으로 부모에서 API 요청 처리
      await onSubmit({
        title,
        content,
        objectKeys: finalImageKeyList,
        thumbnailObjectKey: finalImageKeyList.length > 0 ? finalImageKeyList[0] : null,
      });
    },
  });

  container.appendChild(submitButton.render());
  return container;
}
