import InputField from "../../components/input-field/InputField.js";
import ProfileUpload from "../../components/profile-upload/ProfileUpload.js";
import Button from "../../components/button/Button.js";
import { renderPage } from "../../main.js";

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
    onClick: (e) => {
      e.preventDefault();
      console.log("회원가입 시도");
    },
  });
  container.appendChild(signupButton.render());


  const goLogin = new Button({
    text: "로그인하러 가기",
    className: "text",
    width: "auto",
    onClick: () => renderPage(SignupPage),
  });
  container.appendChild(goLogin.render());

  return container;
}
