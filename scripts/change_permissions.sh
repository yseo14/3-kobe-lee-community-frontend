#!/bin/bash

# 배포 폴더로 이동
cd /home/ubuntu

# 1. 혹시 폴더가 없으면 생성 (mkdir -p는 이미 있으면 무시함)
mkdir -p /home/ubuntu/frontend

# 2. 폴더와 그 안의 모든 내용물의 주인을 ubuntu로 강제 변경
# (이 스크립트는 root 권한으로 실행될 것이므로 sudo가 필요 없음)
chown -R ubuntu:ubuntu /home/ubuntu/frontend

# 3. 쓰기 권한 확실하게 부여
chmod -R 755 /home/ubuntu/frontend

echo "Permissions updated: /home/ubuntu/frontend is now owned by ubuntu"s