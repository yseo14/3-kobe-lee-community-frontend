import InputField from "/src/components/input-field/InputField.js";
import ProfileUpload from "/src/components/profile-upload/ProfileUpload.js";
import Button from "/src/components/button/Button.js";
import { navigate } from "/src/main.js";
import { getMyInfo, updateMember, deleteMember } from "/src/api/memberApi.js";
import { showToast } from "/src/utils/showToast.js";

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
    // 프로필 업로드
    const profileUpload = new ProfileUpload({
      helperText: "*프로필 사진을 선택하세요",
    });
    container.appendChild(profileUpload.render());
    // 이메일 (읽기 전용)
    const emailField = new InputField({
      id: "email",
      label: "이메일",
      type: "text",
      placeholder: "이메일을 입력하세요",
      helperText: "",
    });
    const emailEl = emailField.render();
    emailEl.querySelector("input").value =
      userData?.email || "startupcode@gmail.com";
    emailEl.querySelector("input").readOnly = true;
    container.appendChild(emailEl);

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
          const { ok, data } = await updateMember({
            nickname,
            imageId: null, // 나중에 업로드 기능 연결
          });

          if (!ok || !data.isSuccess) {
            message.textContent = data.message || "회원정보 수정 실패";
            message.style.color = "red";
            return;
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
      onClick: async () => {
        if (!confirm("정말 탈퇴하시겠습니까?")) return;

        try {
          const { ok, data } = await deleteMember();

          if (!ok || !data.isSuccess) {
            alert(data.message || "회원 탈퇴 실패");
            return;
          }

          alert("회원 탈퇴가 완료되었습니다.");
          navigate("/signup");
        } catch (err) {
          alert("서버와 연결할 수 없습니다.");
        }
      },
    });
    container.appendChild(deleteButton.render());
  }

  return container;
}
