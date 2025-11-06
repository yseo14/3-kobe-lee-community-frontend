import InputField from "/src/components/input-field/InputField.js";
import Button from "/src/components/button/Button.js";
import { navigate } from "/src/main.js";
import { login } from "/src/api/authApi.js";
import { showToast } from "/src/utils/showToast.js";

export default function LoginPage() {
  const container = document.createElement("div");
  container.className = "login-container";

  const title = document.createElement("h1");
  title.textContent = "로그인";
  container.appendChild(title);

  // 이메일 입력
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

  // 비밀번호 입력
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

  // 로그인 로직
  const handleLogin = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email) {
      emailField.showHelper("이메일을 입력하세요.");
      passwordField.hideHelper();
      showToast("이메일을 입력하세요.");
      return;
    }

    if (!password) {
      passwordField.showHelper("비밀번호를 입력하세요.");
      emailField.hideHelper();
      showToast("비밀번호를 입력하세요.");
      return;
    }

    try {
      const { ok, data } = await login({ email, password });

      if (!ok) {
        showToast(data.message || "서버 오류가 발생했습니다.");
        return;
      }

      if (data.isSuccess === false) {
        showToast(data.message || "로그인 실패");
        return;
      }

      if (!data.result.accessToken) {
        throw new Error("로그인 응답에 access token이 존재하지 않습니다.");
      }

      sessionStorage.setItem("accessToken", data.result.accessToken);

      showToast("로그인 성공! 게시글 목록 페이지로 이동합니다.");
      setTimeout(() => navigate("/post-list"), 1000);
    } catch (err) {
      console.error("로그인 요청 실패:", err);
      showToast(err.message || "서버와 연결할 수 없습니다.");
    }
  };

  // 로그인 버튼
  const loginButton = new Button({
    text: "로그인",
    className: "primary",
    width: "320px",
    onClick: async (e) => {
      e.preventDefault();
      await handleLogin();
    },
  });
  container.appendChild(loginButton.render());

  // Enter 키 입력 시 로그인 처리
  container.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleLogin();
    }
  });

  // 회원가입 이동 버튼
  const signupButton = new Button({
    text: "회원가입",
    className: "text",
    width: "auto",
    onClick: () => navigate("/signup"),
  });
  container.appendChild(signupButton.render());

  return container;
}
