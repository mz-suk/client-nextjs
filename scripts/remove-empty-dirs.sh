#!/bin/bash

# 사용법: ./scripts/remove-empty-dirs.sh

echo "🧹 비어있는 디렉토리를 탐색합니다..."

# node_modules와 .git을 제외하고 비어있는 디렉토리를 찾아서 삭제
# -mindepth 1: 현재 디렉토리 제외
# -type d: 디렉토리만 탐색
# -empty: 비어있는 것만
# -not -path: 특정 경로 제외
find . -mindepth 1 -type d -empty \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/.next/*" \
  -print -delete

echo "✨ 정리가 완료되었습니다."

