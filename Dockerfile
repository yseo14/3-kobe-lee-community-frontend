# 1. Node.js 22 Alpine (최신 버전 사용 좋음)
FROM node:22-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사
COPY package*.json ./

# 4. [핵심 변경] 개발용 의존성 제외하고 설치 (용량/속도 최적화)
# npm install 대신 npm ci 사용
RUN npm ci --only=production

# 5. 소스 코드 복사
COPY . .

# 6. 포트 노출
EXPOSE 3000

# 7. npm 프로세스 없이 Node 직접 실행 (안정성)
CMD ["node", "server/app.js"]