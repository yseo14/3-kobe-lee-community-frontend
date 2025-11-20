# Node.js 22 기반의 공식 이미지를 사용
FROM node:22-alpine

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 의존성 설치 단계의 캐시 활용을 위해 패키지 파일을 먼저 복사
# package.json과 package-lock.json 파일을 현재 작업 디렉토리(./)로 복사
COPY package.json package-lock.json ./

# npm을 사용하여 종속성을 설치
RUN npm install

# 현재 디렉토리의 모든 파일을 Docker 이미지 내의 작업 디렉토리(WORKDIR)로 복사
#  두 번째 점(.)은 이미지 내의 현재 작업 디렉토리, 즉 WORKDIR로 지정된 위치를 의미
COPY . .

# 애플리케이션이 사용할 포트를 노출
EXPOSE 3000

# 컨테이너가 실행될 때 앱을 시작
CMD ["npm", "start"]