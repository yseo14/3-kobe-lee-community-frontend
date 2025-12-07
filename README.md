# ⛹️‍♂️ Locker Room 🏀
## 🏆 소개
Locker Room: 농구인들을 위한 오프 코트(Off-Court) 커뮤니티 <p>
땀 흘린 뒤 라커룸에서 나누는 대화처럼, 농구인들이 경기 전후의 설렘과 정보를 나누는 공간입니다. 플레이어들을 위한 정보 공유부터 가벼운 잡담까지, 코트 밖에서도 이어지는 커뮤니티 문화를 지향합니다.

## 🛠 기술 스택
- **Frontend**: Vanilla JavaScript
- **Web Server**: Express.js (정적 파일 서빙)
- **스타일링**: CSS
- **인증**: JWT (Access Token + Refresh Token)
- **이미지 저장**: AWS S3
- **컨테이너화**: Docker
- **테스트**: Jest


## ✨ 주요 기능

### 인증/인가
- 회원가입 (이메일, 닉네임 중복 체크)
- 로그인/로그아웃
- JWT 기반 인증
- Refresh Token 자동 갱신

### 회원 관리
- 회원 정보 조회
- 프로필 수정
- 비밀번호 변경
- 프로필 이미지 업로드 (S3)

### 게시글 관리
- 게시글 작성/수정/삭제
- 게시글 목록 조회 (무한 스크롤)
- 게시글 상세 조회
- 게시글 좋아요
- 이미지 업로드 (S3)

### 댓글 관리
- 댓글 작성/수정/삭제
- 댓글 목록 조회 (무한 스크롤)

## 🌳 패키지 구조
<details>
 <summary>패키지 구조 확인하기</summary>
 
 ```
📁
community-fe/
├── public/                 # 정적 파일
│   ├── assets/            # 이미지, 폰트 등 리소스
│   └── index.html         # 메인 HTML 파일
├── src/
│   ├── api/               # API 통신 모듈
│   │   ├── api.js         # 공통 API 유틸리티
│   │   ├── authApi.js     # 인증 API
│   │   ├── commentApi.js  # 댓글 API
│   │   ├── memberApi.js  # 회원 API
│   │   ├── postApi.js    # 게시글 API
│   │   └── uploadApi.js  # 업로드 API
│   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── button/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── input-field/
│   │   ├── modal/
│   │   ├── post-form/
│   │   └── profile-upload/
│   ├── config/            # 설정 파일
│   │   └── appConfig.js   # 앱 설정 (API URL, S3 설정 등)
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── edit-profile/
│   │   ├── login/
│   │   ├── password-change/
│   │   ├── post/
│   │   ├── post-detail/
│   │   ├── post-list/
│   │   └── signup/
│   ├── utils/             # 유틸리티 함수
│   │   └── showToast.js   # 토스트 메시지
│   ├── layout.css         # 레이아웃 스타일
│   └── main.js            # 앱 진입점 및 라우팅
├── server/                # Express 웹서버
│   └── server.js          # 정적 파일 서빙 설정
├── scripts/               # 스크립트 파일
├── Dockerfile             # Docker 이미지 빌드 설정
├── docker-compose.yml     # Docker Compose 설정
└── package.json           # 프로젝트 의존성

 ```

</details>

`홈`
|로그인|회원가입|
|---|---|
|![image](https://github.com/user-attachments/assets/e175a3f1-5ce6-41ea-bab6-e3f441a1e92b)|![image](https://github.com/user-attachments/assets/0cf4a29c-95fe-436f-8b56-2ef9beceeb31)|

`게시글 목록`
|전체 게시글|정렬 기준 변경|
|---|---|
|![image](https://github.com/user-attachments/assets/e7f44eab-d640-4f27-89b9-6741219f3059)|![image](https://github.com/user-attachments/assets/08fe0eed-2db4-4972-b1fd-bda0aa4020a7)|


`게시물 작성 / 상세 / 수정 / 삭제`
|게시물 작성|게시물 상세|게시글 수정|게시글 삭제|
|---|---|---|---|
|![image](https://github.com/user-attachments/assets/e7f44eab-d640-4f27-89b9-6741219f3059)|![image](https://github.com/user-attachments/assets/f4d10fb6-5f36-4699-b17e-5a72355a3204)|![image](https://github.com/user-attachments/assets/0a0a10c6-017f-4e7d-a01e-e7cb44112084)|![image](https://github.com/user-attachments/assets/df418c4c-f87c-4d57-ac17-a2a44162d290)|


`댓글 목록 / 등록 / 수정 /삭제`
|댓글 화면|댓글 등록|댓글 수정|댓글 삭제|
|---|---|---|---|
|![image](https://github.com/user-attachments/assets/9e14986b-70e1-4d8d-810d-4083b07f81b3)|![image](https://github.com/user-attachments/assets/fdb72d72-1842-4347-a159-84bb70c3ba67)|![image](https://github.com/user-attachments/assets/4d3fd1c7-1d73-4498-aef2-a662b4301519)|![image](https://github.com/user-attachments/assets/addd259d-b29b-44b1-bccc-bc58bea0a06e)|

  
`프로필 수정 / 비밀번호 수정 / 회원 탈퇴 / 로그아웃`

|프로필 수정|비밀번호 수정|회원 탈퇴|로그아웃|
|---|---|---|---|
|![image](https://github.com/user-attachments/assets/856f1165-cc55-4536-b422-389535248109)|![image](https://github.com/user-attachments/assets/5ea5e35e-397e-4309-8a65-94c35f621165)|![image](https://github.com/user-attachments/assets/132c58ae-5f32-4fb5-91da-d41ece9384eb)|![image](https://github.com/user-attachments/assets/d623b40a-d7c1-468b-9985-645e6f19fd28)|

<br/>


