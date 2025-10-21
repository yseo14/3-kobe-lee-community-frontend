import InputField from "../../components/input-field/InputField.js";
import Button from "../../components/button/Button.js";

import { navigate } from "../../main.js";

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
    helperText: "* helper text",
  });
  container.appendChild(emailField.render());

  // 비밀번호 필드
  const passwordField = new InputField({
    id: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    helperText: "* helper text",
  });
  container.appendChild(passwordField.render());

  const loginButton = new Button({
    text: "로그인",
    className: "primary",
    width: "320px",
    onClick: (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

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

      emailField.hideHelper();
      passwordField.hideHelper();

      navigate("/post-list");
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
