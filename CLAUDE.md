# Claude Code 프로젝트 정보

## 📋 프로젝트 개요
**Study OnTable**은 레스토랑 테이블에서 고객이 직접 메뉴를 보고 주문할 수 있는 웹 기반 테이블 오더 시스템입니다.

## 🔄 개발 과정
1. **기존 프로젝트 초기화**: Vue 프로젝트 기본 구조만 유지하고 나머지 모든 파일 삭제
2. **참조 프로젝트 분석**: `front-sample/` (React + TypeScript) 구조와 기능 분석
3. **Vue 3 변환**: React 컴포넌트들을 Vue 3 Composition API로 완전 재작성
4. **상태 관리 구현**: Pinia를 사용한 메뉴 및 장바구니 상태 관리
5. **UI/UX 구현**: Tailwind CSS를 사용한 모바일 친화적 디자인
6. **TypeScript 도입**: 완전한 타입 안전성 확보 (2024.09.23 완료)

## 🛠 주요 기술 스택
- **Vue 3** (Composition API + TypeScript)
- **Vue Router 4** (SPA 라우팅)
- **Pinia** (상태 관리)
- **Tailwind CSS** (스타일링)
- **Lucide Vue** (아이콘)
- **토스페이먼츠 위젯 v2** (결제 시스템)

## 📱 구현된 기능
- **메뉴 화면**: 카테고리별 필터링, 장바구니 상태 표시
- **옵션 선택**: 사이즈/추가옵션 선택, 수량 조절, 실시간 가격 계산
- **장바구니**: 아이템 수량 변경/삭제, 총액 계산
- **결제 시스템**: 토스페이먼츠 v2 위젯을 통한 실제 결제 처리
- **주문 완료**: 토스페이먼츠 연동 결제 및 주문 처리

## 📁 주요 파일 설명

### 🎯 핵심 파일들
- **`PROJECT_DOCS.md`**: 프로젝트 전체 상세 문서
  - 프로젝트 구조, 기술 스택, 기능 설명
  - 개발/실행 가이드, 화면별 상세 설명
  - 데이터 구조, 상태 관리, 향후 개선 계획
  - 완전한 프로젝트 레퍼런스 문서

- **`DEVELOPMENT_ROADMAP.md`**: 체계적인 개발 계획 문서
  - 단기/중기/장기 개발 로드맵
  - 마일스톤 및 우선순위 매트릭스
  - 기술 스택 진화 계획
  - 성공 지표 및 KPIs

- **`WORK_LOG.md`**: 일일 작업 기록
  - 작업 완료 내용 및 진행 상황
  - 기술적 성과와 해결된 이슈들
  - 학습 내용 및 개발 인사이트
  - 다음 작업 계획

### 🏗 프로젝트 구조 파일들
- **`src/main.ts`**: 앱 진입점, 라우터 및 Pinia 설정
- **`src/App.vue`**: 루트 컴포넌트
- **`src/types/index.ts`**: TypeScript 타입 정의
- **`package.json`**: 프로젝트 의존성 및 스크립트
- **`tsconfig.json`**: TypeScript 설정
- **`tailwind.config.js`**: Tailwind CSS 설정
- **`postcss.config.js`**: PostCSS 설정

### 📱 뷰 컴포넌트들
- **`src/views/MenuView.vue`**: 메뉴 목록 페이지
- **`src/views/OptionView.vue`**: 옵션 선택 페이지
- **`src/views/CartView.vue`**: 장바구니 페이지
- **`src/views/OrderView.vue`**: 토스페이먼츠 v2 위젯 연동 주문/결제 페이지
- **`src/views/PaymentSuccessView.vue`**: 결제 성공 페이지
- **`src/views/PaymentFailView.vue`**: 결제 실패 페이지

### 🗃 상태 관리
- **`src/stores/menu.ts`**: 메뉴 데이터 및 카테고리 관리 (TypeScript)
- **`src/stores/cart.ts`**: 장바구니 상태 및 아이템 관리 (TypeScript)

### 🎨 스타일링
- **`src/styles/globals.css`**: Tailwind CSS + 커스텀 스타일, CSS 변수 정의

## 💳 토스페이먼츠 v2 위젯 연동

### 🔧 기술 구현
- **SDK 버전**: 토스페이먼츠 Payment Widget v2
- **SDK URL**: `https://js.tosspayments.com/v2/payment-widget`
- **환경변수**: `VUE_APP_TOSSPAYMENT_CLIENT_KEY`를 통한 안전한 키 관리
- **결제 방식**: 카드결제, 계좌이체, 간편결제 등 다양한 결제수단 지원

### 🎯 주요 기능
1. **동적 위젯 로드**: SDK 자동 로드 및 초기화
2. **실시간 결제 금액**: 장바구니 총액에 따른 동적 결제 금액 설정
3. **고급 에러 처리**: 로딩 상태, 에러 표시, 재시도 기능
4. **결제 플로우**: 성공/실패 페이지로 자동 리다이렉트

### 📝 환경 설정
```bash
# .env 파일 설정
VUE_APP_TOSSPAYMENT_CLIENT_KEY=test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm
TOSSPAYMENT_SECRET_KEY=test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6
TOSSPAYMENT_SECURITY_KEY=3095f2145767f33afd79ce67a101457cc4f314d2b06d843e0f0f4b871b69ff58
```

## 🚀 실행 방법
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run serve

# 브라우저 접속
# http://localhost:8084
```

## 📊 현재 상태 (2024.09.30)
### ✅ 새로 완료된 작업들
- **토스페이먼츠 v2 위젯 연동**: 실제 결제 시스템 구현 완료
- **환경변수 관리**: API 키 보안 관리 체계 구축
- **결제 플로우**: 성공/실패 처리 페이지 및 라우팅 완성
- **TypeScript 파싱 문제 해결**: 웹팩 설정 및 import 경로 수정 완료

### 📈 완성도 평가 (업데이트)
- **기능 완성도**: 90% (결제 시스템 추가로 향상)
- **UI/UX 완성도**: 85% (결제 위젯 UI 추가)
- **코드 품질**: 80% (환경변수 관리 및 에러 처리 개선)
- **확장성**: 70% (실제 결제 시스템 연동으로 개선)

💡 **자세한 정보는 다음 문서들을 참조하세요:**
- **전체 기능**: `PROJECT_DOCS.md`
- **개발 계획**: `DEVELOPMENT_ROADMAP.md`
- **작업 기록**: `WORK_LOG.md`