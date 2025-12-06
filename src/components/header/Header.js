import Button from "/src/components/button/Button.js";
import { navigate } from "/src/main.js";
import { getMyInfo } from "/src/api/memberApi.js";
import { getS3ImageUrl } from "/src/config/appConfig.js";
import { logout } from "/src/api/authApi.js";
import { showToast } from "/src/utils/showToast.js";

export default function Header({
  title,
  showBack = false,
  showProfile = false,
  onBack = null,
  onProfileClick = null,
}) {
  const header = document.createElement("header");
  header.className = "app-header";

  const inner = document.createElement("div");
  inner.className = "header-inner";

  // 왼쪽: 뒤로가기 버튼
  const left = document.createElement("div");
  left.className = "header-left";

  // 🧩 기존엔 조건부 생성이었지만, update()에서 제어할 수 있게 항상 생성
  const backButton = new Button({
    icon: "/assets/images/back_button.png",
    className: "icon",
    ariaLabel: "뒤로가기",
    onClick: () => (onBack ? onBack() : history.back()),
  }).render();
  left.appendChild(backButton);

  // 중앙: 제목
  const center = document.createElement("h1");
  center.className = "header-title";
  center.textContent = title;

  // 제목 클릭 시 게시글 목록으로 이동
  center.addEventListener("click", () => {
    navigate("/post-list");
  });
  // 오른쪽: 프로필 버튼
  const right = document.createElement("div");
  right.className = "header-right";

  // 프로필 버튼 컨테이너
  const profileContainer = document.createElement("div");
  profileContainer.className = "profile-container";

  // 프로필 이미지 URL (기본값)
  let profileImageUrl = "/assets/images/default_profile.png";

  const profileButton = new Button({
    icon: profileImageUrl,
    className: "icon",
    ariaLabel: "프로필",
    onClick: (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    },
  }).render();

  // 프로필 이미지 업데이트 함수
  const updateProfileImage = (imageUrl) => {
    const img = profileButton.querySelector("img");
    if (img && imageUrl) {
      img.src = imageUrl;
    }
  };

  // 사용자 정보를 가져와서 프로필 이미지 업데이트
  (async () => {
    // accessToken이 없으면 (로그아웃 상태) 프로필 정보를 가져오지 않음
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    try {
      const { ok, data } = await getMyInfo();
      if (ok && data.isSuccess && data.result) {
        const userData = data.result;
        
        // profileImageKey가 있는 경우 S3 이미지 URL 구성
        if (userData.profileImageKey) {
          const userProfileImageUrl = getS3ImageUrl(userData.profileImageKey);
          if (userProfileImageUrl) {
            updateProfileImage(userProfileImageUrl);
          }
        }
      }
    } catch (err) {
      // 401 에러는 로그아웃 상태에서 정상적인 동작이므로 조용히 처리
      if (err.message && err.message.includes("세션이 만료")) {
        return;
      }
      console.error("프로필 이미지 로드 실패:", err);
      // 에러 발생 시 기본 이미지 유지
    }
  })();

  // 드롭다운 메뉴 생성
  const dropdown = document.createElement("div");
  dropdown.className = "profile-dropdown";

  const editProfile = document.createElement("button");
  editProfile.textContent = "회원정보 수정";
  editProfile.onclick = async () => {
    dropdown.classList.remove("show");
    navigate("/edit-profile");
  };

  const changePassword = document.createElement("button");
  changePassword.textContent = "비밀번호 수정";
  changePassword.onclick = () => {
    dropdown.classList.remove("show");
    navigate("/password-change");
  };

  const logoutButton = document.createElement("button");
  logoutButton.textContent = "로그아웃";
  logoutButton.onclick = async () => {
    dropdown.classList.remove("show");
    
    try {
      const { ok, data } = await logout();
      
      if (!ok || !data.isSuccess) {
        showToast(data.message || "로그아웃 실패");
        return;
      }
      
      sessionStorage.clear();
      showToast("로그아웃되었습니다.");
      navigate("/login");
    } catch (err) {
      console.error("로그아웃 요청 실패:", err);
      // 에러가 발생해도 로컬 세션은 정리하고 로그인 페이지로 이동
      sessionStorage.clear();
      navigate("/login");
    }
  };

  dropdown.append(editProfile, changePassword, logoutButton);

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener("click", (e) => {
    if (!profileContainer.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  profileContainer.append(profileButton, dropdown);
  right.appendChild(profileContainer);

  // 구조 조립
  inner.append(left, center, right);
  header.appendChild(inner);

  // 헤더의 상태를 갱신하는 update() 메서드
  header.update = ({ title, showBack, showProfile }) => {
    if (title !== undefined) center.textContent = title;

    // 조건에 따라 뒤로가기, 프로필 버튼 노출 여부 변경
    backButton.style.display = showBack ? "flex" : "none";
    right.style.display = showProfile ? "flex" : "none";
  };

  // 프로필 이미지를 새로고침하는 메서드
  header.refreshProfileImage = async () => {
    // accessToken이 없으면 (로그아웃 상태) 프로필 정보를 가져오지 않음
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    try {
      const { ok, data } = await getMyInfo();
      if (ok && data.isSuccess && data.result) {
        const userData = data.result;
        
        // profileImageKey가 있는 경우 S3 이미지 URL 구성
        if (userData.profileImageKey) {
          const userProfileImageUrl = getS3ImageUrl(userData.profileImageKey);
          if (userProfileImageUrl) {
            updateProfileImage(userProfileImageUrl);
          }
        } else {
          // 프로필 이미지가 없으면 기본 이미지로 변경
          updateProfileImage("/assets/images/default_profile.png");
        }
      }
    } catch (err) {
      // 401 에러는 로그아웃 상태에서 정상적인 동작이므로 조용히 처리
      if (err.message && err.message.includes("세션이 만료")) {
        return;
      }
      console.error("프로필 이미지 새로고침 실패:", err);
    }
  };

  // 초기 상태 설정
  header.update({ title, showBack, showProfile });

  return header;
}
