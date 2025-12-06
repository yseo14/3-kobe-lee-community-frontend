import InputField from "/src/components/input-field/InputField.js";
import Button from "/src/components/button/Button.js";
import { navigate } from "/src/main.js";
import { updatePassword } from "/src/api/memberApi.js";
import { showToast } from "/src/utils/showToast.js";

export default function PasswordChangePage() {
  const container = document.createElement("div");
  container.className = "password-change-container";

  // 제목
  const title = document.createElement("h1");
  title.textContent = "비밀번호 변경";
  container.appendChild(title);

  // 현재 비밀번호 입력 필드
  const currentPasswordField = new InputField({
    id: "currentPassword",
    label: "현재 비밀번호*",
    type: "password",
    placeholder: "현재 비밀번호를 입력하세요",
    required: true,
    requiredMessage: "현재 비밀번호를 입력하세요.",
  });
  container.appendChild(currentPasswordField.render());

  // 새 비밀번호 입력 필드
  const newPasswordField = new InputField({
    id: "password",
    label: "새 비밀번호*",
    type: "password",
    placeholder: "새 비밀번호를 입력하세요",
    required: true,
    requiredMessage: "새 비밀번호를 입력하세요.",
    validateFn: (value) =>
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        value
      ),
    invalidMessage: "올바른 비밀번호 형식을 입력해주세요. (대문자, 소문자, 숫자, 특수문자 포함, 8-20자)",
  });
  container.appendChild(newPasswordField.render());

  // 새 비밀번호 확인 입력 필드
  const confirmPasswordField = new InputField({
    id: "confirmPassword",
    label: "새 비밀번호 확인*",
    type: "password",
    placeholder: "새 비밀번호를 한번 더 입력하세요",
    required: true,
    requiredMessage: "새 비밀번호 확인을 입력하세요.",
    validateFn: (value) => {
      const newPassword = document.getElementById("password")?.value.trim();
      return value === newPassword;
    },
    invalidMessage: "비밀번호가 일치하지 않습니다.",
  });
  container.appendChild(confirmPasswordField.render());

  // 메시지 표시 영역
  const message = document.createElement("p");
  message.className = "message";
  message.style.marginTop = "12px";
  container.appendChild(message);

  // 비밀번호 변경 버튼
  const changeButton = new Button({
    text: "비밀번호 변경",
    className: "primary",
    width: "320px",
    onClick: async (e) => {
      e.preventDefault();

      const currentPassword = document.getElementById("currentPassword").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      // 필수 입력 확인
      if (!currentPassword || !password || !confirmPassword) {
        showToast("모든 필드를 입력하세요.");
        if (!currentPassword) {
          currentPasswordField.showHelper("현재 비밀번호를 입력하세요.");
        }
        if (!password) {
          newPasswordField.showHelper("새 비밀번호를 입력하세요.");
        }
        if (!confirmPassword) {
          confirmPasswordField.showHelper("새 비밀번호 확인을 입력하세요.");
        }
        return;
      }

      // 비밀번호 형식 검증
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
      if (!passwordRegex.test(password)) {
        newPasswordField.showHelper("올바른 비밀번호 형식을 입력해주세요. (대문자, 소문자, 숫자, 특수문자 포함, 8-20자)");
        return;
      }

      // 비밀번호 일치 확인
      if (password !== confirmPassword) {
        confirmPasswordField.showHelper("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 현재 비밀번호와 새 비밀번호가 같은지 확인
      if (currentPassword === password) {
        message.textContent = "현재 비밀번호와 새 비밀번호가 같습니다.";
        message.style.color = "red";
        return;
      }

      try {
        const updateData = {
          currentPassword,
          password,
          confirmPassword,
        };
        console.log("[PasswordChangePage] 비밀번호 변경 요청 데이터:", updateData);

        const { ok, data } = await updatePassword(updateData);

        if (!ok || !data.isSuccess) {
          message.textContent = data.message || "비밀번호 변경 실패";
          message.style.color = "red";
          return;
        }

        showToast("비밀번호가 변경되었습니다.");
        
        // 성공 시 입력 필드 초기화
        document.getElementById("currentPassword").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
        message.textContent = "";
        
        // 잠시 후 이전 페이지로 이동
        setTimeout(() => {
          navigate("/edit-profile");
        }, 1500);
      } catch (err) {
        message.textContent = err.message || "서버와 연결할 수 없습니다.";
        message.style.color = "red";
      }
    },
  });
  container.appendChild(changeButton.render());

  // 취소 버튼
  const cancelButton = new Button({
    text: "취소",
    className: "text",
    width: "auto",
    onClick: () => navigate("/edit-profile"),
  });
  container.appendChild(cancelButton.render());

  return container;
}

