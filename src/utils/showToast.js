export function showToast(message, duration = 2000) {
  // 기존 토스트 있으면 제거
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  // 토스트 생성
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // 표시 애니메이션
  setTimeout(() => toast.classList.add("show"), 10);

  // 일정 시간 후 사라지기
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
