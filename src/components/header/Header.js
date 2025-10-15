export default function Header({ title, rightActions = [], leftActions = [] }) {
  const header = document.createElement("header");
  header.className = "app-header";

  const inner = document.createElement("div");
  inner.className = "header-inner";

  const left = document.createElement("div");
  left.className = "header-left";
  leftActions.forEach((btn) => left.appendChild(btn));

  const center = document.createElement("h1");
  center.className = "header-title";
  center.textContent = title;

  const right = document.createElement("div");
  right.className = "header-right";
  rightActions.forEach((btn) => right.appendChild(btn));

  inner.appendChild(left);
  inner.appendChild(center);
  inner.appendChild(right);

  header.appendChild(inner);

  return header;
}
