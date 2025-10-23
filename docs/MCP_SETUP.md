# Apidog MCP 설정 가이드

## 개요

인천 면세점 API(https://dev-api.incheondfs.kr)를 Apidog MCP를 통해 AI 어시스턴트와 연결하여 자동화된 코드 생성 및 API 호출을 지원합니다.

## 설정 완료 사항

### 1. MCP 서버 구성

`.cursor/mcp.json` 파일에 6개의 주요 API 그룹이 설정되었습니다:

- **incheondfs-common**: 공통 API (국가, 통화, 공항 등)
- **incheondfs-goods**: 상품 API
- **incheondfs-cart**: 장바구니 API
- **incheondfs-order**: 주문 API
- **incheondfs-member**: 회원 API
- **incheondfs-auth**: 인증 API

```json
{
  "mcpServers": {
    "incheondfs-common": {
      "command": "npx",
      "args": ["-y", "apidog-mcp-server@latest", "--oas=https://dev-api.incheondfs.kr/v3/api-docs/common"],
      "description": "인천 면세점 공통 API (국가, 통화 등)"
    }
    // ... 기타 5개 API 그룹
  }
}
```

### 2. 확인 사항

- ✅ Node.js 버전: v22.16.0 (요구사항: 18 이상)
- ✅ MCP 호환 IDE: Cursor
- ✅ OpenAPI 엔드포인트: https://dev-api.incheondfs.kr/v3/api-docs

## 사용 방법

### 1. Cursor IDE 재시작

MCP 설정을 적용하려면 Cursor를 **완전히 종료 후 재시작**해야 합니다.

### 2. MCP 연결 확인

재시작 후 Cursor 하단에서 MCP 서버 연결 상태를 확인할 수 있습니다:

- 🟢 녹색: 정상 연결
- 🔴 빨간색: 연결 실패

### 3. API 사양 확인

AI 어시스턴트에게 다음과 같이 요청할 수 있습니다:

```
"incheondfs-common API의 모든 엔드포인트를 보여줘"
"국가 목록 조회 API의 타입스크립트 인터페이스를 생성해줘"
"상품 검색 API를 호출하는 함수를 features 구조에 맞게 만들어줘"
"/common/nation/frequent 엔드포인트의 응답 구조를 알려줘"
```

### 4. 자동화된 코드 생성 예시

#### 예제 1: 새로운 API 함수 생성

```
요청: "incheondfs-common API의 /common/nation/frequent
      엔드포인트를 사용하는 함수를 getNations.ts 스타일로 만들어줘"
```

AI가 자동으로:

- OpenAPI 스펙에서 엔드포인트 정보 확인
- 요청/응답 타입 생성
- API 호출 함수 생성
- 에러 핸들링 추가

#### 예제 2: 타입 정의 자동 생성

```
요청: "incheondfs-goods API의 상품 상세 조회 응답 타입을
      entities/goods/model/types.ts 형식으로 만들어줘"
```

#### 예제 3: 전체 Feature 생성

```
요청: "incheondfs-cart API의 장바구니 목록 조회 기능을
      features/cart-list 구조로 만들어줘 (api, hooks, ui 포함)"
```

### 5. 실제 사용 예시

현재 프로젝트의 `getNations.ts`를 MCP로 개선:

```typescript
// AI에게 요청: "incheondfs-common API 스펙을 보고
// getNations 함수의 타입을 정확하게 수정해줘"

// AI가 자동으로 OpenAPI 스펙에서 정확한 타입을 가져와 생성
import type { Nation } from '@/entities/nation';
import { fetchAPI } from '@/shared/api';

export async function getNations(): Promise<Nation[]> {
  const response = await fetchAPI<{
    result: Nation[];
    message?: string;
  }>('/common/search/nations');
  return response.result || [];
}
```

## OpenAPI 엔드포인트 대체 옵션

만약 `/v3/api-docs` 엔드포인트가 작동하지 않는 경우, 다음 대안을 시도하세요:

1. Swagger JSON 다운로드:

   ```bash
   # Swagger UI에서 JSON 스펙 다운로드
   curl https://dev-api.incheondfs.kr/swagger-ui/index.html
   ```

2. MCP 설정 수정:
   ```json
   {
     "mcpServers": {
       "incheondfs-api": {
         "command": "npx",
         "args": ["-y", "apidog-mcp-server@latest", "--oas=./openapi.json"]
       }
     }
   }
   ```

## 트러블슈팅

### OpenAPI 스펙을 찾을 수 없는 경우

1. Swagger UI 페이지에서 직접 JSON 다운로드
2. 로컬 파일로 저장 후 경로 지정
3. 관리자에게 OpenAPI 스펙 엔드포인트 문의

### MCP 연결 실패 시

1. Cursor 재시작
2. `.cursor/mcp.json` 파일 권한 확인
3. `npx apidog-mcp-server@latest --help` 명령으로 설치 확인

## 현재 프로젝트 구조와의 통합

현재 프로젝트는 다음과 같은 API 레이어를 사용하고 있습니다:

```
src/
├── shared/
│   └── api/
│       ├── client.ts      # axios 기반 API 클라이언트
│       └── fetcher.ts     # SWR용 fetcher
└── features/
    └── nation-list/
        └── api/
            └── getNations.ts  # 국가 목록 조회 함수
```

MCP를 통해 새로운 API 함수를 자동 생성할 때, 이 구조를 따라 생성하도록 요청하면 됩니다.

## 다음 단계

1. **Cursor 재시작**: MCP 설정 적용
2. **API 스펙 확인**: AI에게 "인천 면세점 API의 모든 엔드포인트를 보여줘"라고 요청
3. **코드 생성 테스트**: 새로운 API 함수 자동 생성 요청
4. **타입 생성**: OpenAPI 스펙 기반 TypeScript 타입 자동 생성

## 참고 자료

- [Apidog MCP 공식 문서](https://docs.apidog.com/en/apidog-mcp-server)
- [MCP 프로토콜 사양](https://modelcontextprotocol.io/)
- Swagger UI: https://dev-api.incheondfs.kr/swagger-ui/index.html
