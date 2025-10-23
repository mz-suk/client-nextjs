# 보조 문서

## Apidog MCP 설정 가이드

### MCP란?

Model Context Protocol을 통해 AI가 OpenAPI 스펙을 읽고 정확한 타입과 코드를 자동 생성합니다.

### 설정 확인

#### 1. 검증 스크립트 실행

```bash
./scripts/test-mcp.sh
```

모든 항목이 ✅인지 확인:

- Node.js v22+ 설치 확인
- API 엔드포인트 접근 확인
- OpenAPI 스펙 다운로드 확인

#### 2. Cursor 재시작

1. Cmd+Q로 Cursor 완전 종료
2. Cursor 재실행
3. 하단 상태바에서 MCP 서버 연결 확인 (🟢)

#### 3. 연결 테스트

AI에게 요청:

```
"incheondfs-common API의 모든 엔드포인트를 보여줘"
```

### 연결된 API 그룹

| MCP 서버명          | 설명                        | OpenAPI 엔드포인트    |
| ------------------- | --------------------------- | --------------------- |
| `incheondfs-common` | 공통 API (국가, 통화, 공항) | `/v3/api-docs/common` |
| `incheondfs-goods`  | 상품 조회 및 관리           | `/v3/api-docs/goods`  |
| `incheondfs-cart`   | 장바구니 CRUD               | `/v3/api-docs/cart`   |
| `incheondfs-order`  | 주문 및 결제                | `/v3/api-docs/order`  |
| `incheondfs-member` | 회원 관리                   | `/v3/api-docs/member` |
| `incheondfs-auth`   | 인증 및 권한                | `/v3/api-docs/auth`   |

### 사용 예시

#### API 정보 확인

```
"incheondfs-goods API의 상품 검색 엔드포인트 구조를 알려줘"
"incheondfs-cart API에서 장바구니에 상품을 추가하는 방법은?"
```

#### 코드 자동 생성

```
"incheondfs-common API의 /common/nation/frequent 엔드포인트를
사용하는 함수를 getNations.ts 스타일로 만들어줘"

"incheondfs-goods API의 상품 목록 조회 기능을
features/goods-list 구조로 만들어줘 (api, hooks, ui 모두)"
```

#### 기존 코드 개선

```
"getNations 함수를 incheondfs-common API 스펙에 맞게
정확한 타입으로 수정해줘"
```

### 실전 워크플로우: 장바구니 기능 추가

```
1. "incheondfs-cart API의 모든 엔드포인트를 보여줘"

2. "incheondfs-cart API 스펙을 보고
   entities/cart/model/types.ts를 만들어줘"

3. "장바구니 목록 조회, 추가, 삭제 함수를
   features/cart/api/ 구조로 만들어줘"

4. "방금 만든 cart API 함수들을 사용하는
   useCart hook을 SWR로 만들어줘"

5. "useCart hook을 사용하는 CartList 컴포넌트를 만들어줘"
```

### MCP 사용 팁

#### ✅ DO

- 구체적인 요청: "getNations 스타일로", "FSD 구조에 맞게"
- 단계별 진행: 엔티티 → API → Hook → UI
- API 스펙 참조 명시: "incheondfs-goods API 스펙을 보고"

#### ❌ DON'T

- 모호한 요청: "장바구니 만들어줘"
- 한 번에 너무 많은 작업 요청
- API 그룹 명시 없이 요청

### 추가 API 그룹

현재 6개 그룹만 활성화되어 있습니다. 추가로 10개 그룹이 더 있습니다:

| 그룹명          | 엔드포인트                   | 설명               |
| --------------- | ---------------------------- | ------------------ |
| `common-goods`  | `/v3/api-docs/common-goods`  | 공통 상품 정보     |
| `email-auth`    | `/v3/api-docs/email-auth`    | 이메일 인증        |
| `event`         | `/v3/api-docs/event`         | 이벤트 및 프로모션 |
| `exhibit`       | `/v3/api-docs/exhibit`       | 전시 및 카탈로그   |
| `help`          | `/v3/api-docs/help`          | 고객 지원          |
| `login`         | `/v3/api-docs/login`         | 로그인 처리        |
| `main`          | `/v3/api-docs/main`          | 메인 페이지        |
| `mypage`        | `/v3/api-docs/mypage`        | 마이페이지         |
| `operation`     | `/v3/api-docs/operation`     | 운영 관리          |
| `search-engine` | `/v3/api-docs/search-engine` | 검색 엔진          |

### API 그룹 추가 방법

`.cursor/mcp.json`에 추가:

```json
{
  "mcpServers": {
    "incheondfs-event": {
      "command": "npx",
      "args": ["-y", "apidog-mcp-server@latest", "--oas=https://dev-api.incheondfs.kr/v3/api-docs/event"],
      "description": "인천 면세점 이벤트 API"
    }
  }
}
```

Cursor 재시작 후 사용 가능합니다.

### 트러블슈팅

#### MCP 서버가 연결되지 않음

1. Cursor 완전 재시작 (Cmd+Q)
2. `.cursor/mcp.json` 파일 존재 확인
3. `./scripts/test-mcp.sh` 실행 결과 확인

#### API 스펙을 찾을 수 없음

AI에게 요청:

```
"incheondfs-common API 서버에 연결되었는지 확인해줘"
```

#### 생성된 코드가 프로젝트 구조와 다름

요청 시 명확하게 지정:

```
"features/nation-list/api/getNations.ts 파일과
똑같은 구조로 만들어줘"
```

## Common API 주요 엔드포인트

현재 프로젝트에서 사용 중인 Common API:

### 국가 관련

- `GET /common/nation/frequent` - 자주 사용하는 국가 목록
- `GET /common/nation/list` - 전체 국가 목록
- `GET /common/search/nations` - 국가 검색 (현재 사용 중)

## MCP 설정 파일 위치

```
.cursor/mcp.json
```

## API 베이스 URL

```
https://dev-api.incheondfs.kr
```

## MCP vs 수동 코딩 비교

| 방식            | 장점                                       | 단점                         |
| --------------- | ------------------------------------------ | ---------------------------- |
| **Apidog MCP**  | OpenAPI 스펙 연동, 자동 타입 생성, AI 지원 | Cursor 재시작 필요           |
| 수동 코딩       | 완전한 제어                                | 느림, 타입 불일치 가능성     |
| Swagger Codegen | 일괄 생성                                  | Next.js/FSD 구조에 맞지 않음 |

## 개선 가능 사항

### 현재 구현

- ✅ 6개 주요 API 그룹 연결
- ✅ 검증 스크립트 제공
- ✅ 상세 문서화

### 추가 가능한 개선

1. **추가 API 그룹**: 필요 시 10개 API 그룹 더 추가 가능
2. **자동화 스크립트**: 타입 생성 자동화 스크립트
3. **CI/CD 통합**: OpenAPI 스펙 변경 감지 및 자동 타입 업데이트
4. **Mock 서버**: 개발 환경용 Mock API 서버

### 영향도 분석

- **최소 영향**: 기존 코드 변경 없음
- **선택적 사용**: MCP는 선택사항, 기존 방식 병행 가능
- **점진적 도입**: 새 기능부터 MCP 사용 후 확대

## 참고 자료

- [Apidog MCP 공식 문서](https://docs.apidog.com/en/apidog-mcp-server)
- [MCP 프로토콜 사양](https://modelcontextprotocol.io/)
- Swagger UI: https://dev-api.incheondfs.kr/swagger-ui/index.html
