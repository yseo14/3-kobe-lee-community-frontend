import InputField from "/src/components/input-field/InputField.js";
import ProfileUpload from "/src/components/profile-upload/ProfileUpload.js";
import Button from "/src/components/button/Button.js";
import Modal from "/src/components/modal/Modal.js";
import { navigate, header } from "/src/main.js";
import { getMyInfo, updateMember, deleteMember } from "/src/api/memberApi.js";
import { showToast } from "/src/utils/showToast.js";
import { getS3ImageUrl } from "/src/config/appConfig.js";

export default function EditProfilePage(userData) {
  const container = document.createElement("div");
  container.className = "edit-profile-container";

  // 제목
  const title = document.createElement("h1");
  title.textContent = "회원정보수정";
  container.appendChild(title);

  // 로딩 표시
  const loading = document.createElement("p");
  loading.textContent = "사용자 정보를 불러오는 중입니다...";
  container.appendChild(loading);

  // 비동기 데이터 요청
  (async () => {
    try {
      const { ok, data } = await getMyInfo();

      if (!ok || !data.isSuccess) {
        navigate("/login");
        return;
      }

      const userData = data.result;
      container.removeChild(loading);

      renderForm(userData);
    } catch (err) {
      console.error("사용자 정보 요청 실패:", err);
      loading.textContent = "정보를 불러오지 못했습니다.";
    }
  })();

  function renderForm(userData) {
    // 현재 프로필 이미지 URL 생성
    const currentProfileImageUrl = userData?.profileImageKey
      ? getS3ImageUrl(userData.profileImageKey)
      : null;

    // 프로필 업로드
    const profileUpload = new ProfileUpload({
      helperText: "*프로필 사진을 선택하세요",
      currentImageUrl: currentProfileImageUrl,
    });
    container.appendChild(profileUpload.render());
    // 이메일 (읽기 전용 - 텍스트로 표시)
    const emailSection = document.createElement("div");
    emailSection.className = "email-display-section";
    
    const emailLabel = document.createElement("label");
    emailLabel.className = "email-label";
    emailLabel.textContent = "이메일";
    emailSection.appendChild(emailLabel);
    
    const emailValue = document.createElement("div");
    emailValue.className = "email-value";
    emailValue.textContent = userData?.email || "startupcode@gmail.com";
    emailValue.style.cursor = "pointer";
    emailSection.appendChild(emailValue);
    
    const emailHelper = document.createElement("p");
    emailHelper.className = "email-helper";
    emailHelper.textContent = "이메일은 변경할 수 없습니다";
    emailHelper.style.display = "none";
    emailSection.appendChild(emailHelper);
    
    // 이메일 칸 클릭 시 헬퍼 텍스트 토글
    emailValue.addEventListener("click", () => {
      const isVisible = emailHelper.style.display !== "none";
      emailHelper.style.display = isVisible ? "none" : "block";
    });
    
    container.appendChild(emailSection);

    // 닉네임
    const nicknameField = new InputField({
      id: "nickname",
      label: "닉네임",
      type: "text",
      placeholder: "닉네임을 입력하세요",
      required: true,
      requiredMessage: "닉네임을 입력하세요.",
    });
    const nicknameEl = nicknameField.render();
    nicknameEl.querySelector("input").value = userData?.nickname || "";
    container.appendChild(nicknameEl);

    // 상태 메시지
    const message = document.createElement("p");
    message.className = "message";
    message.style.marginTop = "12px";
    container.appendChild(message);

    // 수정하기 버튼
    const updateButton = new Button({
      text: "수정하기",
      className: "primary",
      width: "320px",
      onClick: async (e) => {
        e.preventDefault();
        const nickname = document.getElementById("nickname").value.trim();

        if (!nickname) {
          nicknameField.showHelper("닉네임을 입력하세요.");
          return;
        }

        try {
          // 프로필 이미지 objectKey 가져오기
          const objectKey = profileUpload.getObjectKey();
          console.log("[EditProfilePage] 가져온 objectKey:", objectKey);

          const updateData = {
            nickname,
            ...(objectKey && { profileImageObjectKey: objectKey }), // objectKey가 있으면 포함
          };
          console.log("[EditProfilePage] 회원정보 수정 요청 데이터:", updateData);

          const { ok, data } = await updateMember(updateData);

          if (!ok || !data.isSuccess) {
            message.textContent = data.message || "회원정보 수정 실패";
            message.style.color = "red";
            return;
          }

          // 프로필 이미지가 변경된 경우 Header의 프로필 이미지 새로고침
          if (objectKey && header && header.refreshProfileImage) {
            await header.refreshProfileImage();
          }

          showToast("회원정보가 수정되었습니다");
        } catch (err) {
          message.textContent = err.message || "서버와 연결할 수 없습니다.";
          message.style.color = "red";
        }
      },
    });
    container.appendChild(updateButton.render());

    // 회원 탈퇴 버튼
    const deleteButton = new Button({
      text: "회원 탈퇴",
      className: "text",
      width: "auto",
      onClick: () => {
        // 회원 탈퇴 확인 모달 표시
        const deleteModal = new Modal({
          title: "회원 탈퇴",
          message: "정말 탈퇴하시겠습니까? 탈퇴한 계정은 복구할 수 없습니다.",
          confirmText: "탈퇴하기",
          cancelText: "취소",
          onConfirm: async () => {
            try {
              const { ok, data } = await deleteMember();

              if (!ok || !data.isSuccess) {
                showToast(data.message || "회원 탈퇴 실패");
                return;
              }

              showToast("회원 탈퇴가 완료되었습니다.");
              navigate("/signup");
            } catch (err) {
              showToast("서버와 연결할 수 없습니다.");
            }
          },
          onCancel: () => {
            // 취소 시 아무 동작 없음
          },
        });

        deleteModal.open();
      },
    });
    container.appendChild(deleteButton.render());
  }

  return container;
}
