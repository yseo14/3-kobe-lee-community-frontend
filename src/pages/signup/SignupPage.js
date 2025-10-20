import InputField from "../../components/input-field/InputField.js";
import ProfileUpload from "../../components/profile-upload/ProfileUpload.js";
import Button from "../../components/button/Button.js";
import { navigate } from "../../main.js";
import { BASE_URL } from "../../config/api.js";

export default function SignupPage() {
  const container = document.createElement("div");
  container.className = "signup-container";

  const title = document.createElement("h1");
  title.textContent = "회원가입";
  container.appendChild(title);

  const profileUpload = new ProfileUpload({
    helperText: "*helper text",
  });
  container.appendChild(profileUpload.render());

  // 이메일 필드
  const emailField = new InputField({
    id: "email",
    label: "이메일*",
    type: "email",
    placeholder: "이메일을 입력하세요",
    helperText: "* helper text",
  });
  container.appendChild(emailField.render());

  // 비밀번호 필드
  const passwordField = new InputField({
    id: "password",
    label: "비밀번호*",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    helperText: "* helper text",
  });
  container.appendChild(passwordField.render());

  // 비밀번호 확인 필드
  const passwordConfirmField = new InputField({
    id: "passwordConfirm",
    label: "비밀번호 확인*",
    type: "password",
    placeholder: "비밀번호를 한번 더 입력하세요",
    helperText: "* helper text",
  });
  container.appendChild(passwordConfirmField.render());

  // 닉네임 필드
  const nicknameField = new InputField({
    id: "nickname",
    label: "닉네임*",
    type: "text",
    placeholder: "닉네임을 입력하세요",
    helperText: "* helper text",
  });
  container.appendChild(nicknameField.render());

  const signupButton = new Button({
    text: "회원가입",
    className: "primary",
    width: "320px",
    onClick: async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document
        .getElementById("passwordConfirm")
        .value.trim();
      const nickname = document.getElementById("nickname").value.trim();

      const message =
        document.querySelector(".message") || document.createElement("p");
      message.className = "message";
      message.style.marginTop = "12px";

      if (!container.contains(message)) container.appendChild(message);
      if (!email || !password || !confirmPassword || !nickname) {
        message.textContent = "모든 필드를 입력하세요.";
        message.style.color = "red";
        return;
      }

      if (password !== confirmPassword) {
        message.textContent = "비밀번호가 일치하지 않습니다.";
        message.style.color = "red";
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/member`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            nickname,
            password,
            confirmPassword,
            imageId: null,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          message.textContent = `${data.message || "회원가입 실패"}`;
          message.style.color = "red";
          return;
        }

        message.textContent = "회원가입 성공! 로그인 페이지로 이동합니다.";
        message.style.color = "green";

        // 1초 후 로그인 페이지로 이동
        setTimeout(() => navigate("/login"), 1000);
      } catch (err) {
        console.error("회원가입 요청 실패:", err);
        message.textContent = "서버와 연결할 수 없습니다";
        message.style.color = "red";
      }
    },
  });
  container.appendChild(signupButton.render());

  const goLogin = new Button({
    text: "로그인하러 가기",
    className: "text",
    width: "auto",
    onClick: () => navigate("/login"),
  });
  container.appendChild(goLogin.render());

  return container;
}
