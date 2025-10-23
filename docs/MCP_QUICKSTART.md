# Apidog MCP 빠른 시작 가이드

## 1분 안에 시작하기

### 1️⃣ 검증 (10초)

```bash
./scripts/test-mcp.sh
```

모든 항목이 ✅인지 확인

### 2️⃣ Cursor 재시작 (20초)

1. Cursor 완전 종료 (Cmd+Q)
2. Cursor 재실행
3. 하단 상태바에서 MCP 서버 연결 확인

### 3️⃣ 첫 번째 요청 (30초)

AI에게 다음과 같이 요청:

```
incheondfs-common API의 모든 엔드포인트를 보여줘
```

✅ **성공**: API 엔드포인트 목록이 표시됨  
❌ **실패**: [MCP_SETUP.md](./MCP_SETUP.md) 트러블슈팅 참조

## 자주 사용하는 요청 예시

### 기본 API 정보 확인

```
"incheondfs-goods API의 상품 검색 엔드포인트 구조를 알려줘"
"incheondfs-cart API에서 장바구니에 상품을 추가하는 방법은?"
```

### 코드 자동 생성

```
"incheondfs-common API의 /common/nation/frequent 엔드포인트를
사용하는 함수를 getNations.ts 스타일로 만들어줘"

"incheondfs-goods API의 상품 목록 조회 기능을
features/goods-list 구조로 만들어줘 (api, hooks, ui 모두)"

"incheondfs-order API의 주문 생성 타입을
entities/order/model/types.ts에 추가해줘"
```

### 기존 코드 개선

```
"getNations 함수를 incheondfs-common API 스펙에 맞게
정확한 타입으로 수정해줘"

"현재 cart 관련 함수들을 incheondfs-cart API 스펙을 보고
타입 안전하게 개선해줘"
```

## 연결된 API 그룹

| MCP 서버명          | 설명         | 주요 기능                 |
| ------------------- | ------------ | ------------------------- |
| `incheondfs-common` | 공통 API     | 국가, 통화, 공항, 항공사  |
| `incheondfs-goods`  | 상품 API     | 상품 조회, 검색, 카테고리 |
| `incheondfs-cart`   | 장바구니 API | 장바구니 CRUD             |
| `incheondfs-order`  | 주문 API     | 주문 생성, 조회, 결제     |
| `incheondfs-member` | 회원 API     | 회원가입, 정보 수정       |
| `incheondfs-auth`   | 인증 API     | 로그인, 토큰 관리         |

## 실전 워크플로우

### 시나리오: 장바구니 기능 추가

1. **API 확인**

   ```
   "incheondfs-cart API의 모든 엔드포인트를 보여줘"
   ```

2. **엔티티 생성**

   ```
   "incheondfs-cart API 스펙을 보고
   entities/cart/model/types.ts를 만들어줘"
   ```

3. **API 함수 생성**

   ```
   "장바구니 목록 조회, 추가, 삭제 함수를
   features/cart/api/ 구조로 만들어줘"
   ```

4. **Hook 생성**

   ```
   "방금 만든 cart API 함수들을 사용하는
   useCart hook을 SWR로 만들어줘"
   ```

5. **UI 컴포넌트**
   ```
   "useCart hook을 사용하는 CartList 컴포넌트를 만들어줘"
   ```

완료! 🎉

## 팁 & 트릭

### ✅ DO

- 구체적인 요청: "getNations 스타일로", "FSD 구조에 맞게"
- 단계별 진행: 엔티티 → API → Hook → UI
- API 스펙 참조 명시: "incheondfs-goods API 스펙을 보고"

### ❌ DON'T

- 모호한 요청: "장바구니 만들어줘"
- 한 번에 너무 많은 작업 요청
- API 그룹 명시 없이 요청

## 문제 해결

### MCP 서버가 연결되지 않음

1. Cursor 완전 재시작
2. `.cursor/mcp.json` 파일 존재 확인
3. `./scripts/test-mcp.sh` 실행 결과 확인

### API 스펙을 찾을 수 없음

```
"incheondfs-common API 서버에 연결되었는지 확인해줘"
```

AI가 MCP 연결 상태를 확인합니다.

### 생성된 코드가 프로젝트 구조와 다름

요청 시 명확하게 지정:

```
"features/nation-list/api/getNations.ts 파일과
똑같은 구조로 만들어줘"
```

## 다음 단계

- 📖 [MCP_SETUP.md](./MCP_SETUP.md) - 상세 설정 가이드
- 📋 [API_GROUPS.md](./API_GROUPS.md) - 전체 API 목록
- 🏗️ [FSD_GUIDE.md](./FSD_GUIDE.md) - FSD 아키텍처 가이드

## 추가 API 그룹 활성화

현재 6개 그룹만 활성화되어 있습니다. 추가 그룹이 필요하면:

1. [API_GROUPS.md](./API_GROUPS.md)에서 원하는 그룹 확인
2. `.cursor/mcp.json`에 그룹 추가
3. Cursor 재시작

예: Event API 추가

```json
{
  "incheondfs-event": {
    "command": "npx",
    "args": ["-y", "apidog-mcp-server@latest", "--oas=https://dev-api.incheondfs.kr/v3/api-docs/event"],
    "description": "인천 면세점 이벤트 API"
  }
}
```

---

**이제 AI와 함께 빠르게 개발하세요! 🚀**
