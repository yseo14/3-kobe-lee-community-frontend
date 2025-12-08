import InputField from "/src/components/input-field/InputField.js";
import ProfileUpload from "/src/components/profile-upload/ProfileUpload.js";
import Button from "/src/components/button/Button.js";
import { navigate } from "/src/main.js";
import { signUp } from "/src/api/memberApi.js";
import { showToast } from "/src/utils/showToast.js";
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
} from "/src/api/memberApi.js";

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

  // 이메일 입력 필드
  const emailField = new InputField({
    id: "email",
    label: "이메일*",
    type: "email",
    placeholder: "이메일을 입력하세요",
    required: true,
    requiredMessage: "이메일을 입력하세요.",
    validateFn: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    invalidMessage: "올바른 이메일 주소 형식을 입력해주세요.",
    onBlur: async (e) => {
      const email = e.target.value.trim();
      if (!email) return;

      try {
        const { ok, data } = await checkEmailDuplicate(email);

        if (ok && data.isSuccess) {
          if (!data.result.available) {
            showToast("이미 사용 중인 이메일입니다.");
            emailField.showHelper("이미 등록된 이메일이에요.");
          } else {
            showToast("사용 가능한 이메일입니다.");
            emailField.hideHelper();
          }
        } else {
          showToast(data?.message || "이메일 중복 확인 실패");
        }
      } catch (err) {
        console.error("이메일 중복 확인 실패:", err);
        showToast("서버 오류로 이메일 확인에 실패했습니다.");
      }
    },
  });
  container.appendChild(emailField.render());

  // 비밀번호 입력 필드
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

  // 비밀번호 확인 입력 필드
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

  // 닉네임 입력 필드
  const nicknameField = new InputField({
    id: "nickname",
    label: "닉네임*",
    type: "text",
    placeholder: "닉네임을 입력하세요",
    required: true,
    requiredMessage: "닉네임을 입력하세요.",
    onBlur: async (e) => {
      const nickname = e.target.value.trim();
      if (!nickname) return;

      try {
        const { ok, data } = await checkNicknameDuplicate(nickname);

        if (ok && data.isSuccess) {
          if (!data.result.available) {
            showToast("이미 사용 중인 닉네임입니다.");
            nicknameField.showHelper("이미 등록된 닉네임이에요.");
          } else {
            showToast("사용 가능한 닉네임입니다.");
            nicknameField.hideHelper();
          }
        } else {
          showToast(data?.message || "닉네임 중복 확인 실패");
        }
      } catch (err) {
        console.error("닉네임 중복 확인 실패:", err);
        showToast("서버 오류로 닉네임 확인에 실패했습니다.");
      }
    },
  });
  container.appendChild(nicknameField.render());


  // 회원가입 버튼
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

      // 필수 입력 확인
      if (!email || !password || !confirmPassword || !nickname) {
        showToast("모든 필드를 입력하세요.");
        return;
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast("올바른 이메일 주소 형식을 입력해주세요.");
        return;
      }

      if (password !== confirmPassword) {
        showToast("비밀번호가 일치하지 않습니다.");
        return;
      }

      // 프로필 이미지 objectKey 가져오기
      const objectKey = profileUpload.getObjectKey();
      console.log("[SignUpPage] 가져온 objectKey:", objectKey);

      const signUpData = {
        email,
        nickname,
        password,
        confirmPassword,
        ...(objectKey && { profileImageObjectKey: objectKey }), // objectKey가 있으면 포함
      };
      console.log("[SignUpPage] 회원가입 요청 데이터:", signUpData);

      try {
        const { ok, data } = await signUp(signUpData);

        if (!ok) {
          showToast(data.message || "서버 오류가 발생했습니다.");
          return;
        }

        if (data.isSuccess === false) {
          showToast(data.message || "회원가입 실패");
          return;
        }

        showToast("회원가입 성공! 로그인 페이지로 이동합니다.");

        setTimeout(() => navigate("/login"), 1000);
      } catch (err) {
        console.error("회원가입 요청 실패:", err);
        showToast(err.message || "서버와 연결할 수 없습니다.");
      }
    },
  });
  container.appendChild(signupButton.render());

  // 로그인 페이지 이동 버튼
  const goLogin = new Button({
    text: "로그인하러 가기",
    className: "text",
    width: "auto",
    onClick: () => navigate("/login"),
  });
  container.appendChild(goLogin.render());

  return container;
}
