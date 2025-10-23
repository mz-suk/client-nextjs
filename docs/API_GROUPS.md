# 인천 면세점 API 그룹 목록

## 전체 API 그룹 (16개)

MCP에 추가 가능한 모든 API 그룹 목록입니다.

### 현재 MCP에 설정된 그룹 (6개)

| 그룹명     | 엔드포인트            | 설명                           |
| ---------- | --------------------- | ------------------------------ |
| **common** | `/v3/api-docs/common` | 공통 API (국가, 통화, 공항 등) |
| **goods**  | `/v3/api-docs/goods`  | 상품 조회 및 관리              |
| **cart**   | `/v3/api-docs/cart`   | 장바구니 기능                  |
| **order**  | `/v3/api-docs/order`  | 주문 및 결제                   |
| **member** | `/v3/api-docs/member` | 회원 관리                      |
| **auth**   | `/v3/api-docs/auth`   | 인증 및 권한                   |

### 추가 가능한 그룹 (10개)

| 그룹명            | 엔드포인트                   | 설명               |
| ----------------- | ---------------------------- | ------------------ |
| **common-goods**  | `/v3/api-docs/common-goods`  | 공통 상품 정보     |
| **email-auth**    | `/v3/api-docs/email-auth`    | 이메일 인증        |
| **event**         | `/v3/api-docs/event`         | 이벤트 및 프로모션 |
| **exhibit**       | `/v3/api-docs/exhibit`       | 전시 및 카탈로그   |
| **help**          | `/v3/api-docs/help`          | 고객 지원          |
| **login**         | `/v3/api-docs/login`         | 로그인 처리        |
| **main**          | `/v3/api-docs/main`          | 메인 페이지        |
| **mypage**        | `/v3/api-docs/mypage`        | 마이페이지         |
| **operation**     | `/v3/api-docs/operation`     | 운영 관리          |
| **search-engine** | `/v3/api-docs/search-engine` | 검색 엔진          |

## Common API 주요 엔드포인트

현재 프로젝트에서 사용 중인 Common API의 주요 엔드포인트:

### 국가 관련

- `GET /common/nation/frequent` - 자주 사용하는 국가 목록
- `GET /common/nation/list` - 전체 국가 목록
- `GET /common/search/nations` - 국가 검색 (현재 사용 중)

## MCP 그룹 추가 방법

`.cursor/mcp.json`에 새로운 API 그룹을 추가하려면:

```json
{
  "mcpServers": {
    "기존-그룹들...": {},
    "incheondfs-새그룹명": {
      "command": "npx",
      "args": ["-y", "apidog-mcp-server@latest", "--oas=https://dev-api.incheondfs.kr/v3/api-docs/그룹명"],
      "description": "설명"
    }
  }
}
```

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

## 참고사항

- 각 API 그룹은 독립적인 MCP 서버로 실행됩니다
- 필요한 그룹만 선택적으로 활성화할 수 있습니다
- 모든 그룹을 추가할 경우 Cursor 시작 시간이 길어질 수 있습니다
- 개발 중인 기능에 필요한 그룹만 활성화하는 것을 권장합니다
