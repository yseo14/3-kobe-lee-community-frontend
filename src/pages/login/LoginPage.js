import InputField from "../../components/input-field/InputField.js";
import { renderPage, HomePage } from "../../main.js";

export default function LoginPage() {
  const container = document.createElement("div");
  container.className = "login-container";

  const title = document.createElement("h1");
  title.textContent = "로그인";
  container.appendChild(title);

  const emailField = new InputField({
    id: "email",
    label: "이메일",
    type: "email",
    placeholder: "이메일을 입력하세요",
    helperText: "* helper text",
  });
  container.appendChild(emailField.render());

  const passwordField = new InputField({
    id: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    helperText: "* helper text",
  });
  container.appendChild(passwordField.render());

  const loginButton = document.createElement("button");
  loginButton.className = "login-button";
  loginButton.textContent = "로그인";
  container.appendChild(loginButton);

  const signupButton = document.createElement("button");
  signupButton.className = "signup-button";
  signupButton.textContent = "회원가입";
  container.appendChild(signupButton);

  loginButton.addEventListener("click", (e) => {
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

    renderPage(HomePage);
  });

  return container;
}
