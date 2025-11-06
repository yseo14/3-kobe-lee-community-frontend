import InputField from "/src/components/input-field/InputField.js";
import Button from "/src/components/button/Button.js";
import { showToast } from "/src/utils/showToast.js";

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

  // 파일 선택 시 목록 표시
  fileInput.addEventListener("change", () => {
    fileList.innerHTML = "";
    Array.from(fileInput.files).forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f.name;
      li.style.fontSize = "13px";
      fileList.appendChild(li);
    });
  });

  // 수정 모드일 때 기존 이미지 목록 표시
  if (mode === "edit" && initialData.imageKeyList?.length > 0) {
    initialData.imageKeyList.forEach((imgKey) => {
      const li = document.createElement("li");
      li.textContent = imgKey;
      li.style.fontSize = "13px";
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

      const files = fileInput.files;

      // 임시 데이터 (서버 연결 전)
      const imageIds = [1, 2, 3];
      const thumbnailImageId = imageIds[0];

      // onSubmit 콜백으로 부모에서 API 요청 처리
      await onSubmit({
        title,
        content,
        imageIds,
        thumbnailImageId,
        files,
      });
    },
  });

  container.appendChild(submitButton.render());
  return container;
}
