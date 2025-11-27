#!/bin/bash
set -e

# 배포 디렉토리로 이동 (appspec.yml에서 지정한 위치)
cd /home/ubuntu/frontend

ECR_REGISTRY="__ECR_REGISTRY__"
ECR_REPOSITORY="__ECR_REPOSITORY__"
IMAGE_TAG="__IMAGE_TAG__"

# 1. AWS ECR 로그인
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin $ECR_REGISTRY

# 2. .env 파일 생성
# docker-compose.yml이 읽을 수 있도록 환경변수 파일 생성
echo "Generating .env file..."
echo "ECR_REGISTRY=$ECR_REGISTRY" > .env
echo "ECR_REPOSITORY=$ECR_REPOSITORY" >> .env
echo "IMAGE_TAG=$IMAGE_TAG" >> .env

# 3. Docker Compose 실행
# pull: 최신 이미지를 ECR에서 당겨옴
echo "Deploying with Docker Compose..."
docker compose pull
docker compose up -d --force-recreate

# 사용하지 않는 이미지 삭제 (공간 확보)
docker image prune -f