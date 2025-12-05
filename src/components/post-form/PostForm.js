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
  helperText.textContent = "여러 이미지를 선택할 수 있습니다. 드래그하여 순서를 변경하거나 × 버튼으로 삭제할 수 있습니다.";
  helperText.style.fontSize = "13px";
  helperText.style.color = "#666";
  helperText.style.marginTop = "4px";

  const imagePreviewContainer = document.createElement("div");
  imagePreviewContainer.className = "image-preview-container";

  // 이미지 상태 관리: { objectKey, isExisting, imageUrl } 배열
  const imageList = [];

  // 이미지 목록 업데이트 및 UI 렌더링
  const renderImagePreviews = () => {
    // 기존 미리보기 모두 제거
    const existingItems = imagePreviewContainer.querySelectorAll(".image-preview-item");
    existingItems.forEach(item => item.remove());
    
    // 새로 렌더링
    imageList.forEach((image, index) => {
      const previewItem = createImagePreviewItem(
        image.imageUrl,
        image.objectKey,
        image.isExisting,
        index
      );
      imagePreviewContainer.appendChild(previewItem);
    });
  };

  // 이미지 미리보기 아이템 생성 함수
  const createImagePreviewItem = (
    imageUrl,
    objectKey,
    isExisting = false,
    index = 0
  ) => {
    const previewItem = document.createElement("div");
    previewItem.className = "image-preview-item";
    previewItem.dataset.objectKey = objectKey;
    previewItem.dataset.index = index;
    previewItem.draggable = true;

    // 썸네일 표시 (첫 번째 이미지만)
    if (index === 0) {
      previewItem.classList.add("thumbnail");
    }

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "이미지 미리보기";
    img.className = "preview-image";
    img.draggable = false; // 이미지 자체는 드래그 불가

    const overlay = document.createElement("div");
    overlay.className = "preview-overlay";

    const statusText = document.createElement("span");
    statusText.className = "preview-status";
    if (index === 0) {
      statusText.textContent = "썸네일";
      statusText.style.background = "#a78bfa";
    } else if (isExisting) {
      statusText.textContent = "기존 이미지";
      statusText.style.background = "#3498db";
    } else {
      statusText.textContent = "업로드 완료";
      statusText.style.background = "#27ae60";
    }

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "preview-delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.title = "이미지 삭제";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      removeImage(index);
    };

    // 드래그 여부 추적
    let isDragging = false;
    let mouseDownX = 0;
    let mouseDownY = 0;

    // 썸네일로 설정하는 함수
    const setAsThumbnail = (e) => {
      // 드래그 중이거나 삭제 버튼 클릭인 경우 무시
      if (isDragging || e.target === deleteBtn || deleteBtn.contains(e.target)) {
        return;
      }
      
      // 마우스 이동 거리가 5px 이상이면 드래그로 간주
      const deltaX = Math.abs(e.clientX - mouseDownX);
      const deltaY = Math.abs(e.clientY - mouseDownY);
      if (deltaX > 5 || deltaY > 5) {
        return;
      }
      
      if (index !== 0) {
        // 해당 이미지를 첫 번째 위치로 이동
        const [movedItem] = imageList.splice(index, 1);
        imageList.unshift(movedItem);
        renderImagePreviews();
        showToast("썸네일로 설정되었습니다.");
      }
    };

    // 마우스 다운 위치 저장
    previewItem.addEventListener("mousedown", (e) => {
      mouseDownX = e.clientX;
      mouseDownY = e.clientY;
      isDragging = false;
    });

    // 이미지 클릭 시 썸네일로 설정
    previewItem.addEventListener("click", setAsThumbnail);
    previewItem.style.cursor = "pointer";
    previewItem.title = "클릭하여 썸네일로 설정";

    overlay.appendChild(statusText);
    previewItem.appendChild(img);
    previewItem.appendChild(overlay);
    previewItem.appendChild(deleteBtn);

    // 드래그 앤 드롭 이벤트
    previewItem.addEventListener("dragstart", (e) => {
      isDragging = true;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", index.toString());
      previewItem.classList.add("dragging");
    });

    previewItem.addEventListener("dragend", () => {
      isDragging = false;
      previewItem.classList.remove("dragging");
    });

    previewItem.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const draggingItem = imagePreviewContainer.querySelector(".dragging");
      if (draggingItem && draggingItem !== previewItem) {
        const allItems = Array.from(
          imagePreviewContainer.querySelectorAll(".image-preview-item:not(.loading):not(.error)")
        );
        const draggingIndex = allItems.indexOf(draggingItem);
        const currentIndex = allItems.indexOf(previewItem);

        // 시각적 피드백을 위해 DOM 조작 (실제 데이터는 drop에서 변경)
        if (draggingIndex < currentIndex) {
          previewItem.parentNode.insertBefore(draggingItem, previewItem.nextSibling);
        } else {
          previewItem.parentNode.insertBefore(draggingItem, previewItem);
        }
      }
    });

    previewItem.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const fromIndex = parseInt(e.dataTransfer.getData("text/html"));
      
      // dragover로 인해 변경된 DOM 위치를 기반으로 실제 위치 찾기
      const allItems = Array.from(
        imagePreviewContainer.querySelectorAll(".image-preview-item:not(.loading):not(.error)")
      );
      
      // draggingItem의 현재 DOM 위치를 찾음
      const draggingItem = imagePreviewContainer.querySelector(".dragging");
      let toIndex;
      
      if (draggingItem) {
        // draggingItem이 있으면 그 위치를 사용
        toIndex = allItems.indexOf(draggingItem);
      } else {
        // dragging 클래스가 제거된 경우 (dragend가 먼저 발생한 경우)
        // dragover에서 draggingItem이 previewItem 앞이나 뒤로 이동했으므로
        // previewItem의 위치를 기준으로 계산
        const previewIndex = allItems.indexOf(previewItem);
        // dragover에서 draggingItem이 previewItem 앞으로 이동했다면 previewItem의 인덱스가 toIndex
        // dragover에서 draggingItem이 previewItem 뒤로 이동했다면 previewItem의 인덱스가 toIndex
        toIndex = previewIndex;
      }

      // 순서가 실제로 변경되었는지 확인하고 데이터 업데이트
      if (fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0 && fromIndex < imageList.length && toIndex < imageList.length) {
        // 배열에서 순서 변경
        const [movedItem] = imageList.splice(fromIndex, 1);
        imageList.splice(toIndex, 0, movedItem);
        // 썸네일 갱신을 위해 전체 다시 렌더링
        renderImagePreviews();
      }
    });

    return previewItem;
  };

  // 이미지 제거 함수
  const removeImage = (index) => {
    imageList.splice(index, 1);
    renderImagePreviews();
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
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
      return;
    }

    // 각 파일에 대해 업로드 진행
    for (const file of files) {
      const loadingItem = createLoadingPreviewItem(file);
      imagePreviewContainer.appendChild(loadingItem);

      try {
        const { ok, data } = await uploadPostImage(file);
        if (ok && data.status === 201 && data.data && data.data.length > 0) {
          const objectKey = data.data[0].objectKey;
          const imageUrl = getS3ImageUrl(objectKey);

          // 이미지 목록에 추가
          imageList.push({
            objectKey,
            isExisting: false,
            imageUrl,
          });

          // 로딩 아이템 제거하고 다시 렌더링
          loadingItem.remove();
          renderImagePreviews();
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

    // 파일 입력 초기화
    fileInput.value = "";
  });

  // 수정 모드일 때 기존 이미지 미리보기 표시
  if (mode === "edit" && initialData.imageKeyList?.length > 0) {
    initialData.imageKeyList.forEach((imgKey) => {
      const imageUrl = getS3ImageUrl(imgKey);
      imageList.push({
        objectKey: imgKey,
        isExisting: true,
        imageUrl,
      });
    });
    renderImagePreviews();
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

      // 이미지 목록에서 objectKey 추출
      // 기존 이미지는 그대로 유지, 새 이미지는 temp/ 경로로 전송
      const objectKeys = imageList.map((img) => img.objectKey);
      const thumbnailObjectKey =
        imageList.length > 0 ? imageList[0].objectKey : null;

      // onSubmit 콜백으로 부모에서 API 요청 처리
      await onSubmit({
        title,
        content,
        objectKeys,
        thumbnailObjectKey,
      });
    },
  });

  container.appendChild(submitButton.render());
  return container;
}
