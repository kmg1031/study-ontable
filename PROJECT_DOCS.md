# Study OnTable - 테이블 오더 시스템

## 📋 프로젝트 개요

**Study OnTable**은 레스토랑 테이블에서 고객이 직접 메뉴를 보고 주문할 수 있는 웹 기반 테이블 오더 시스템입니다.
React 기반의 front-sample을 참고하여 Vue 3로 완전히 새롭게 개발되었습니다.

### 🎯 주요 특징
- 모바일 친화적인 터치 인터페이스
- 직관적인 메뉴 브라우징 및 주문 프로세스
- 실시간 장바구니 관리
- 다양한 메뉴 옵션 선택 (사이즈, 추가 옵션)
- 현대적이고 세련된 UI/UX

---

## 🏗 프로젝트 구조

```
study-ontable/
├── public/
│   ├── index.html              # HTML 템플릿
│   └── favicon.ico             # 파비콘
├── src/
│   ├── views/                  # 페이지 컴포넌트
│   │   ├── MenuView.vue        # 메뉴 목록 페이지
│   │   ├── OptionView.vue      # 옵션 선택 페이지
│   │   ├── CartView.vue        # 장바구니 페이지
│   │   └── OrderView.vue       # 주문 완료 페이지
│   ├── stores/                 # Pinia 상태 관리
│   │   ├── menu.js            # 메뉴 데이터 관리
│   │   └── cart.js            # 장바구니 상태 관리
│   ├── styles/                 # 스타일 파일
│   │   └── globals.css        # Tailwind CSS + 전역 스타일
│   ├── App.vue                # 루트 컴포넌트
│   └── main.js                # 앱 진입점
├── package.json               # 프로젝트 설정 및 의존성
├── tailwind.config.js         # Tailwind CSS 설정
├── postcss.config.js          # PostCSS 설정
└── PROJECT_DOCS.md           # 프로젝트 문서 (이 파일)
```

---

## 🛠 기술 스택

### 🔧 핵심 기술
- **Vue 3**: 프론트엔드 프레임워크 (Composition API 사용)
- **Vue Router 4**: SPA 라우팅
- **Pinia**: 상태 관리 라이브러리
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크

### 📦 주요 의존성
```json
{
  "dependencies": {
    "core-js": "^3.8.3",
    "vue": "^3.2.13",
    "vue-router": "^4.4.5",
    "pinia": "^2.1.7",
    "lucide-vue-next": "^0.400.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@vue/cli-service": "~5.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### 🎨 UI/UX 라이브러리
- **Lucide Vue**: 아이콘 라이브러리
- **Tailwind CSS**: 디자인 시스템 및 스타일링

---

## 🚀 주요 기능

### 1. 📱 메뉴 화면 (MenuView)
- **카테고리별 필터링**: 전체, 메인 요리, 찌개, 음료 등
- **메뉴 카드 표시**: 이미지, 이름, 설명, 가격, 카테고리
- **장바구니 버튼**: 현재 담긴 상품 개수 표시
- **테이블 번호 표시**: 현재 테이블 정보

### 2. ⚙️ 옵션 선택 화면 (OptionView)
- **메뉴 정보 표시**: 선택한 메뉴의 상세 정보
- **사이즈 선택**: 라디오 버튼으로 단일 선택
- **추가 옵션 선택**: 체크박스로 다중 선택
- **수량 조절**: +/- 버튼으로 수량 변경
- **실시간 가격 계산**: 옵션에 따른 총 가격 계산
- **장바구니 담기**: 선택한 옵션과 함께 장바구니에 추가

### 3. 🛒 장바구니 화면 (CartView)
- **장바구니 아이템 목록**: 이미지, 이름, 옵션, 수량, 가격
- **수량 변경**: 각 아이템별 수량 증감
- **아이템 삭제**: 개별 상품 제거
- **총 금액 계산**: 모든 아이템의 합계
- **주문하기 버튼**: 주문 페이지로 이동

### 4. 💳 주문 화면 (OrderView)
- **주문 내역 확인**: 최종 주문할 아이템 목록
- **테이블 정보**: 테이블 번호 및 예상 조리시간
- **결제 방법 선택**: 신용카드, 모바일페이, 현금
- **가격 요약**: 주문 금액, 배달비, 총 결제금액
- **주문 처리**: 주문 완료 시뮬레이션 (2초 로딩)

---

## 🗃 상태 관리 (Pinia Stores)

### 📋 Menu Store (`stores/menu.js`)
```javascript
{
  state: {
    menuItems: [...] // 메뉴 데이터 배열
  },
  getters: {
    getMenuItemById,        // ID로 메뉴 찾기
    getCategories,          // 카테고리 목록
    getMenuItemsByCategory  // 카테고리별 메뉴 필터링
  }
}
```

### 🛒 Cart Store (`stores/cart.js`)
```javascript
{
  state: {
    items: [],        // 장바구니 아이템 배열
    tableNumber: 7    // 테이블 번호
  },
  getters: {
    itemCount,        // 총 아이템 개수
    totalPrice,       // 총 금액
    getItemById       // ID로 아이템 찾기
  },
  actions: {
    addItem,          // 아이템 추가
    updateItem,       // 아이템 수정
    removeItem,       // 아이템 제거
    clearCart,        // 장바구니 비우기
    updateQuantity    // 수량 변경
  }
}
```

---

## 🎨 디자인 시스템

### 🎨 색상 팔레트 (CSS Variables)
```css
:root {
  --background: 0 0% 100%;           /* 배경색 */
  --foreground: 222.2 84% 4.9%;      /* 기본 텍스트 */
  --primary: 221.2 83.2% 53.3%;      /* 주요 색상 */
  --secondary: 210 40% 96%;          /* 보조 색상 */
  --muted: 210 40% 96%;              /* 비활성 색상 */
  --destructive: 0 84.2% 60.2%;      /* 경고/삭제 색상 */
  --border: 214.3 31.8% 91.4%;       /* 테두리 색상 */
}
```

### 🖼 UI 컴포넌트 패턴
- **카드형 레이아웃**: `rounded-lg border bg-card shadow-sm`
- **버튼 스타일**: Primary, Secondary, Outline, Ghost 변형
- **배지/태그**: 카테고리 표시용 작은 배지
- **고정 헤더**: 상단 네비게이션 및 타이틀
- **하단 고정 버튼**: 주요 액션 버튼

---

## 🚀 개발 및 실행 가이드

### 📋 사전 요구사항
- Node.js 14.0 이상
- npm 또는 yarn

### 🔧 설치 및 실행
```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run serve

# 3. 브라우저에서 접속
# http://localhost:8081
```

### 🏗 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# ESLint 검사
npm run lint
```

### 🌐 접속 정보
- **로컬 개발**: http://localhost:8081
- **메인 페이지**: `/` (자동으로 `/menu`로 리다이렉트)

---

## 📱 화면별 상세 설명

### 🍽 메뉴 화면 (`/menu`)
**주요 UI 요소:**
- 헤더: 테이블 번호, 장바구니 버튼
- 카테고리 탭: 가로 스크롤 가능한 필터 버튼들
- 메뉴 카드: 이미지, 제목, 설명, 가격, 카테고리 배지

**상호작용:**
- 카테고리 탭 클릭 → 해당 카테고리 메뉴 필터링
- 메뉴 카드 클릭 → 옵션 선택 페이지로 이동
- 장바구니 버튼 클릭 → 장바구니 페이지로 이동

### ⚙️ 옵션 선택 화면 (`/option/:id`)
**주요 UI 요소:**
- 뒤로 가기 버튼
- 메뉴 정보 카드: 이미지, 이름, 설명, 기본 가격
- 사이즈 선택 섹션 (있는 경우)
- 추가 옵션 선택 섹션 (있는 경우)
- 수량 조절 섹션
- 하단 고정 버튼: 총 가격과 함께 "장바구니에 담기"

**상호작용:**
- 옵션 선택 시 실시간 가격 계산
- 수량 변경 시 총 가격 업데이트
- 장바구니 담기 → 메뉴 페이지로 돌아가기

### 🛒 장바구니 화면 (`/cart`)
**주요 UI 요소:**
- 헤더: 뒤로 가기, 제목, 상품 개수 배지
- 아이템 카드들: 이미지, 이름, 옵션, 수량 조절, 삭제 버튼
- 하단 요약: 총 결제금액, 주문하기 버튼

**상호작용:**
- 수량 +/- → 즉시 가격 업데이트
- 삭제 버튼 → 해당 아이템 제거
- 주문하기 → 주문 페이지로 이동

### 💳 주문 화면 (`/order`)
**주요 UI 요소:**
- 테이블 정보 카드: 테이블 번호, 예상 조리시간
- 주문 내역 카드: 아이템별 상세 정보
- 결제 방법 선택: 라디오 버튼 리스트
- 가격 요약 카드: 상세 금액 내역
- 하단 결제 버튼: 총 금액과 함께

**상호작용:**
- 결제 방법 선택
- 결제하기 → 2초 로딩 → 장바구니 초기화 → 메뉴로 돌아가기

---

## 🔄 라우팅 구조

```javascript
const routes = [
  { path: '/', redirect: '/menu' },
  { path: '/menu', name: 'menu', component: MenuView },
  { path: '/option/:id', name: 'option', component: OptionView, props: true },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/order', name: 'order', component: OrderView }
]
```

---

## 📊 데이터 구조

### 메뉴 아이템 구조
```javascript
{
  id: '1',
  name: '비빔밥',
  description: '신선한 나물과 고추장이 어우러진 전통 비빔밥',
  price: 12000,
  category: '메인 요리',
  image: 'https://...',
  options: {
    sizes: [
      { name: '소 (1인분)', price: 0 },
      { name: '중 (2인분)', price: 8000 }
    ],
    extras: [
      { name: '계란후라이 추가', price: 2000 },
      { name: '고기 추가', price: 3000 }
    ]
  }
}
```

### 장바구니 아이템 구조
```javascript
{
  id: 'unique-id',
  menuItem: { /* 메뉴 아이템 객체 */ },
  quantity: 2,
  selectedSize: '중 (2인분)',
  selectedExtras: ['계란후라이 추가'],
  totalPrice: 30000
}
```

---

## 🚧 향후 개선 계획

### 🔧 기술적 개선
- [ ] TypeScript 도입으로 타입 안정성 강화
- [ ] 컴포넌트 단위 테스트 추가
- [ ] PWA 지원 (오프라인 사용)
- [ ] 성능 최적화 (이미지 레이지 로딩, 코드 스플리팅)

### 🎨 UX/UI 개선
- [ ] 다크 모드 지원
- [ ] 애니메이션 및 트랜지션 효과
- [ ] 접근성(A11y) 개선
- [ ] 다국어 지원

### 🔗 기능 확장
- [ ] 실제 백엔드 API 연동
- [ ] 실시간 주문 상태 업데이트
- [ ] 결제 시스템 연동
- [ ] 주문 히스토리 관리
- [ ] 메뉴 추천 시스템
- [ ] 영수증 출력 기능

---

## 📝 개발 참고사항

### 🎯 코드 컨벤션
- Vue 3 Composition API 사용
- ES6+ 문법 활용
- Tailwind CSS 유틸리티 클래스 우선
- 컴포넌트명은 PascalCase
- 파일명은 kebab-case

### 🔍 디버깅 팁
- Vue Devtools 확장 프로그램 사용 권장
- Pinia store 상태는 Vue Devtools에서 확인 가능
- 개발 모드에서 hot reload 지원

### 📋 주의사항
- 이미지 URL이 외부 링크이므로 네트워크 연결 필요
- 브라우저 로컬 스토리지는 사용하지 않음 (새로고침 시 장바구니 초기화)
- 모바일 퍼스트 반응형 디자인

---

## 📞 문의 및 지원

이 프로젝트는 학습 목적으로 개발되었습니다.
추가 질문이나 개선 제안이 있으시면 이슈를 등록해 주세요.

---

**개발 완료일**: 2024년 9월 23일
**개발 환경**: Vue 3 + Tailwind CSS + Pinia
**참고 프로젝트**: front-sample (React + TypeScript)