import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

app.enable("trust proxy");

// ES 모듈 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일을 /public에서 서빙
app.use(express.static(path.join(__dirname, "../public")));

// JS 모듈 등 정적 자원 요청은 여기서 처리
app.use("/src", express.static(path.join(__dirname, "../src")));

// 나머지 경로는 SPA 라우팅 fallback (HTML만)
app.get(/^(?!\/src).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
