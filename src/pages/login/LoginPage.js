import InputField from "../../components/input-field/InputField.js";
import Button from "../../components/button/Button.js";

import { navigate } from "../../main.js";
import { login } from "../../api/authApi.js";

export default function LoginPage() {
  const container = document.createElement("div");
  container.className = "login-container";

  const title = document.createElement("h1");
  title.textContent = "로그인";
  container.appendChild(title);

  // 이메일 필드
  const emailField = new InputField({
    id: "email",
    label: "이메일",
    type: "email",
    placeholder: "이메일을 입력하세요",
    required: true,
    requiredMessage: "이메일을 입력하세요.",
    validateFn: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    invalidMessage: "올바른 이메일 주소 형식을 입력해주세요.",
  });
  container.appendChild(emailField.render());

  // 비밀번호 필드
  const passwordField = new InputField({
    id: "password",
    label: "비밀번호",
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

  const message =
    document.querySelector(".message") || document.createElement("p");
  message.className = "message";
  message.style.marginTop = "12px";

  const loginButton = new Button({
    text: "로그인",
    className: "primary",
    width: "320px",
    onClick: async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!container.contains(message)) container.appendChild(message);

      if (!email) {
        emailField.showHelper("이메일을 입력하세요.");
        passwordField.hideHelper();
        return;
      }

      if (!password) {
        passwordField.showHelper("비밀번호를 입력하세요.");
        emailField.hideHelper();
        return;
      }

      try {
        const { ok, data } = await login({
          email,
          password,
        });

        if (!ok) {
          message.textContent = data.message || "서버 오류가 발생했습니다.";
          message.style.color = "red";
          return;
        }

        if (data.isSuccess === false) {
          message.textContent = data.message || "로그인 실패";
          message.style.color = "red";
          return;
        }

        if (!data.result.accessToken) {
          throw new Error("로그인 응답에 access token이 존재하지 않습니다.");
        }

        sessionStorage.setItem(
          "accessToken",
          data.result.accessToken
        );

        message.textContent = "로그인 성공! 게시글 목록 페이지로 이동합니다.";
        message.style.color = "green";


        setTimeout(() => navigate("/post-list"), 1000);
      } catch (err) {
        console.error("로그인 요청 실패:", err);
        message.textContent = err.message || "서버와 연결할 수 없습니다.";
        message.style.color = "red";
      }
    },
  });

  container.appendChild(loginButton.render());

  const signupButton = new Button({
    text: "회원가입",
    className: "text",
    width: "auto",
    onClick: () => navigate("/signup"),
  });
  container.appendChild(signupButton.render());

  return container;
}
