import InputField from "../../components/input-field/InputField.js";
import Button from "../../components/button/Button.js";
import { showToast } from "../../utils/showToast.js";
import { createPost } from '../../api/postApi.js';

export default function PostCreatePage() {
  const container = document.createElement("div");
  container.className = "post-create-container";

  // 제목 필드
  const titleField = new InputField({
    id: "title",
    label: "제목*",
    type: "text",
    placeholder: "제목을 입력해주세요. (최대 26글자)",
    required: true,
    requiredMessage: "제목을 입력해주세요. (최대 26글자)",
    validateFn: (value) => value.length <= 26,
    invalidMessage: "제목은 26자 이내로 입력해주세요.",
  });
  container.appendChild(titleField.render());

  // 내용 필드
  const contentField = new InputField({
    id: "content",
    label: "내용*",
    type: "textarea",
    placeholder: "내용을 입력해주세요.",
    required: true,
    requiredMessage: "내용을 입력해주세요.",
    height: "300px",
  });
  container.appendChild(contentField.render());

  // 이미지 업로드 영역
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image-upload-wrapper";

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "이미지";
  imageLabel.style.display = "block";
  imageLabel.style.marginBottom = "6px";
  imageWrapper.appendChild(imageLabel);

  // 다중 이미지 업로드 input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "images";
  fileInput.accept = "image/*";
  fileInput.multiple = true; // 여러 장 업로드 가능

  const helperText = document.createElement("p");
  helperText.className = "helper-text";
  helperText.textContent = "여러 이미지를 선택할 수 있습니다.";
  helperText.style.fontSize = "13px";
  helperText.style.color = "#666";
  helperText.style.marginTop = "4px";

  // 선택된 파일 목록 표시
  const fileList = document.createElement("ul");
  fileList.className = "file-list";
  fileList.style.listStyle = "disc";
  fileList.style.paddingLeft = "16px";
  fileList.style.marginTop = "8px";

  fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    fileList.innerHTML = ""; // 기존 목록 초기화

    if (files.length === 0) {
      helperText.textContent = "파일을 선택해주세요.";
      return;
    }

    helperText.textContent = `${files.length}개의 파일이 선택되었습니다.`;

    files.forEach((file) => {
      const li = document.createElement("li");
      li.textContent = file.name;
      li.style.fontSize = "13px";
      fileList.appendChild(li);
    });
  });

  imageWrapper.appendChild(fileInput);
  imageWrapper.appendChild(helperText);
  imageWrapper.appendChild(fileList);
  container.appendChild(imageWrapper);

  // 완료 버튼
  const submitButton = new Button({
    text: "작성 완료",
    className: "primary",
    width: "320px",
    onClick: async (e) => {
      e.preventDefault();

      const title = titleField.inputEl?.value.trim() || "";
      const content = contentField.inputEl?.value.trim() || "";
      const files = fileInput.files;

      // 입력 필드들 유효성 검증
      if (!title) {
        showToast("제목을 입력해주세요.");
        return;
      }
      if (title.length > 26) {
        showToast("제목은 최대 26자까지 입력 가능합니다.");
        return;
      }
      if (!content) {
        showToast("내용을 입력해주세요.");
        return;
      }

      // 임시 imageIds 생성 (백엔드 구현 전) 
      const imageIds = [1,2,3];
      const thumbnailImageId = imageIds.length > 0 ? imageIds[0] : null;

      // 백엔드의 DTO 형태로 테스트 데이터 생성
      const postRequestBody = {
        title,
        content,
        imageIds, // 실제로는 presigned 업로드 후 받은 ID 배열로 교체 예정
        thumbnailImageId,
      };

      console.log("게시글 등록 요청 DTO:", postRequestBody);

      try {
        const { ok, data } = await createPost(postRequestBody);
        if (!ok || !data.isSuccess) throw new Error(data.message);

        showToast("게시글 작성 요청이 전송되었습니다!");
      } catch (err) {
        showToast(err.message || "게시글 등록 실패");
      }
    },
  });

  container.appendChild(submitButton.render());

  return container;
}
