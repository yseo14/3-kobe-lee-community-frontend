import InputField from "/src/components/input-field/InputField.js";
import Button from "/src/components/button/Button.js";
import { showToast } from "/src/utils/showToast.js";
import { uploadPostImage } from "/src/api/uploadApi.js";

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

  const fileList = document.createElement("ul");
  fileList.className = "file-list";
  fileList.style.listStyle = "disc";
  fileList.style.paddingLeft = "16px";
  fileList.style.marginTop = "8px";

  // 업로드된 이미지 objectKey 저장
  const uploadedImageKeys = [];

  // 파일 선택 시 업로드 및 목록 표시
  fileInput.addEventListener("change", async () => {
    // 기존 이미지 목록은 유지하고, 새로 업로드한 이미지만 추가
    const existingListItems = Array.from(fileList.querySelectorAll("li")).filter(
      (li) => li.textContent.includes("(기존 이미지)")
    );
    
    // 새로 선택한 파일들만 업로드 (기존 업로드된 키는 유지)
    const files = Array.from(fileInput.files);
    if (files.length === 0) {
      // 파일이 없으면 기존 목록만 표시
      fileList.innerHTML = "";
      existingListItems.forEach((li) => fileList.appendChild(li));
      return;
    }

    // 기존 목록 초기화 후 기존 이미지 목록 다시 추가
    fileList.innerHTML = "";
    existingListItems.forEach((li) => fileList.appendChild(li));

    // 각 파일에 대해 업로드 진행
    for (const file of files) {
      const li = document.createElement("li");
      li.style.fontSize = "13px";
      li.textContent = `${file.name} (업로드 중...)`;
      li.style.color = "#666";
      fileList.appendChild(li);

      try {
        const { ok, data } = await uploadPostImage(file);
        if (ok && data.status === 201 && data.data && data.data.length > 0) {
          const objectKey = data.data[0].objectKey;
          uploadedImageKeys.push(objectKey);
          li.textContent = `${file.name} ✓`;
          li.style.color = "#333";
        } else {
          li.textContent = `${file.name} (업로드 실패)`;
          li.style.color = "#e74c3c";
          showToast(`${file.name} 업로드에 실패했습니다.`);
        }
      } catch (err) {
        console.error("[PostForm] 이미지 업로드 실패:", err);
        li.textContent = `${file.name} (업로드 실패)`;
        li.style.color = "#e74c3c";
        showToast(`${file.name} 업로드에 실패했습니다.`);
      }
    }
  });

  // 수정 모드일 때 기존 이미지 목록 표시
  const existingImageKeys = [];
  if (mode === "edit" && initialData.imageKeyList?.length > 0) {
    initialData.imageKeyList.forEach((imgKey) => {
      existingImageKeys.push(imgKey);
      const li = document.createElement("li");
      li.textContent = `${imgKey} (기존 이미지)`;
      li.style.fontSize = "13px";
      li.style.color = "#666";
      fileList.appendChild(li);
    });
  }

  imageWrapper.append(fileInput, helperText, fileList);
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
    width: "320px",
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
