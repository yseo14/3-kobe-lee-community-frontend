import InputField from "../../components/input-field/InputField.js";
import ProfileUpload from "../../components/profile-upload/ProfileUpload.js";
import Button from "../../components/button/Button.js";
import { navigate } from "../../main.js";
import { signUp } from '../../api/memberApi.js';

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

  const emailField = new InputField({
    id: "email",
    label: "이메일*",
    type: "email",
    placeholder: "이메일을 입력하세요",
    required: true,
    requiredMessage: "이메일을 입력하세요.",
    validateFn: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    invalidMessage: "올바른 이메일 주소 형식을 입력해주세요.",
  });
  container.appendChild(emailField.render());

  const passwordField = new InputField({
    id: "password",
    label: "비밀번호*",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    required: true,
    requiredMessage: "비밀번호를 입력하세요.",
    validateFn: (value) =>
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(
        value
      ),
    invalidMessage: "올바른 비밀번호 형식을 입력해주세요.",
  });
  container.appendChild(passwordField.render());

  const passwordConfirmField = new InputField({
    id: "passwordConfirm",
    label: "비밀번호 확인*",
    type: "password",
    placeholder: "비밀번호를 한번 더 입력하세요",
    required: true,
    requiredMessage: "비밀번호 확인을 입력하세요.",
    validateFn: (value) => {
      const pwd = document.getElementById("password")?.value.trim();
      return value === pwd;
    },
    invalidMessage: "비밀번호가 일치하지 않습니다.",
  });
  container.appendChild(passwordConfirmField.render());

  const nicknameField = new InputField({
    id: "nickname",
    label: "닉네임*",
    type: "text",
    placeholder: "닉네임을 입력하세요",
    required: true,
    requiredMessage: "닉네임을 입력하세요.",
  });
  container.appendChild(nicknameField.render());
  const message =
    document.querySelector(".message") || document.createElement("p");
  message.className = "message";
  message.style.marginTop = "12px";

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

      if (!email || !password || !passwordConfirm || !nickname) {
        message.textContent = "모든 필드를 입력하세요.";
        message.style.color = "red";
        return;
      }

      if (!container.contains(message)) container.appendChild(message);

      if (password !== confirmPassword) {
        message.textContent = "비밀번호가 일치하지 않습니다.";
        message.style.color = "red";
        return;
      }

      try {
        const { ok, data } = await signUp({ //  회원가입 API 호출
          email,
          nickname,
          password,
          confirmPassword,
        });

        if (!ok || !data.success) {
          message.textContent = data.message || "회원가입 실패";
          message.style.color = "red";
          return;
        }

        message.textContent = "회원가입 성공! 로그인 페이지로 이동합니다.";
        message.style.color = "green";

        // 1초 후 로그인 페이지로 이동
        setTimeout(() => navigate("/login"), 1000);
      } catch (err) {
        message.textContent = error.message;
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
