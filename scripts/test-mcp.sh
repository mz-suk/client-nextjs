#!/bin/bash

echo "🔍 Apidog MCP 설정 검증"
echo "================================"
echo ""

echo "1. Node.js 버전 확인..."
node_version=$(node --version)
echo "   ✅ Node.js: $node_version"
echo ""

echo "2. MCP 설정 파일 확인..."
if [ -f ".cursor/mcp.json" ]; then
    echo "   ✅ .cursor/mcp.json 파일 존재"
else
    echo "   ❌ .cursor/mcp.json 파일 없음"
    exit 1
fi
echo ""

echo "3. API 엔드포인트 접근성 테스트..."
echo ""

# API 그룹 목록
api_groups=("common" "goods" "cart" "order" "member" "auth")

for group in "${api_groups[@]}"; do
    url="https://dev-api.incheondfs.kr/v3/api-docs/$group"
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" = "200" ]; then
        echo "   ✅ $group: $url"
    else
        echo "   ❌ $group: $url (HTTP $status_code)"
    fi
done

echo ""
echo "4. Common API 엔드포인트 샘플..."
curl -s https://dev-api.incheondfs.kr/v3/api-docs/common | jq -r '.paths | keys[]' | head -5
echo ""

echo "================================"
echo "✨ 검증 완료!"
echo ""
echo "다음 단계:"
echo "1. Cursor IDE를 완전히 종료"
echo "2. Cursor 재시작"
echo "3. 하단 상태바에서 MCP 서버 연결 확인"
echo "4. AI에게 'incheondfs-common API의 엔드포인트를 보여줘' 요청"

