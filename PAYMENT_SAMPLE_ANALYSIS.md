# 📋 Payment Sample 분석 리포트

## 📁 프로젝트 구조

```
payment-sample/
└── html-node/
    ├── server.js                 # Express 서버 (결제 승인 API)
    ├── package.json             # 프로젝트 설정 및 의존성
    ├── package-lock.json        # 의존성 버전 고정
    ├── README.md                # 프로젝트 실행 가이드
    └── public/                  # 정적 파일들
        ├── checkout.html        # 결제 위젯 메인 페이지
        ├── success.html         # 결제 성공 페이지
        ├── fail.html            # 결제 실패 페이지
        └── style.css            # 토스 디자인 시스템 기반 스타일
```

---

## 🛠 기술 스택 분석

### Backend (Node.js/Express)
```json
{
  "dependencies": {
    "body-parser": "^1.20.2",     // HTTP 요청 본문 파싱
    "express": "^4.18.2",         // 웹 서버 프레임워크
    "got": "^11.8.0"              // HTTP 클라이언트 (토스페이먼츠 API 호출용)
  }
}
```

### Frontend
- **Vanilla JavaScript**: 프레임워크 없는 순수 자바스크립트
- **토스페이먼츠 SDK**: `https://js.tosspayments.com/v2/standard`
- **토스 디자인 시스템**: 통일된 UI/UX 구현

---

## 💳 결제 시스템 아키텍처

### 1. 결제 프로세스 플로우
```
1. 사용자 접속 (/)
   ↓
2. checkout.html 로딩
   ↓
3. 토스페이먼츠 위젯 초기화
   ↓
4. 결제 정보 입력 및 결제 요청
   ↓
5. 토스페이먼츠 서버 처리
   ↓
6. success.html (성공) 또는 fail.html (실패)
   ↓
7. 서버 결제 승인 API 호출 (/confirm)
```

### 2. API 엔드포인트 분석

#### 🔵 POST `/confirm` - 결제 승인
```javascript
// 요청 데이터
{
  "paymentKey": "string",  // 토스페이먼츠에서 발급한 결제 키
  "orderId": "string",     // 주문 고유 ID
  "amount": "number"       // 결제 금액
}

// 응답: 토스페이먼츠 API 응답을 그대로 전달
```

#### 🔵 GET `/` - 메인 결제 페이지
- `checkout.html` 반환

#### 🔵 GET `/success` - 결제 성공 페이지
- `success.html` 반환

#### 🔵 GET `/fail` - 결제 실패 페이지
- `fail.html` 반환

---

## 🔐 보안 구현 분석

### 1. API 키 관리
```javascript
// 시크릿 키 (서버용)
var secretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

// 클라이언트 키 (브라우저용)
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
```

### 2. 인증 방식
```javascript
// Basic Authentication with Secret Key
var encryptedSecretKey = "Basic " + Buffer.from(secretKey + ":").toString("base64");
```

### 3. 결제 금액 검증
- 클라이언트에서 전송된 결제 정보를 서버에서 재검증
- 악의적인 금액 조작 방지

---

## 🎨 UI/UX 분석

### 디자인 시스템
- **토스 브랜드 컬러**: 블루 계열 (#3182f6, #1b64da)
- **그레이 스케일**: 총 9단계 세밀한 색상 조정
- **타이포그래피**: 'Toss Product Sans' 폰트 패밀리
- **반응형**: 모바일 친화적 레이아웃

### 주요 컴포넌트
1. **결제 위젯**: 토스페이먼츠 SDK로 자동 렌더링
2. **이용약관**: SDK 내장 약관 동의 UI
3. **쿠폰 시스템**: 5,000원 할인 체크박스
4. **버튼**: 토스 디자인 가이드라인 준수

---

## ⚡ 주요 기능 분석

### 1. 결제 위젯 초기화 (checkout.html:47-64)
```javascript
// 고객 키 생성 (랜덤)
const customerKey = generateRandomString();

// 토스페이먼츠 객체 초기화
const tossPayments = TossPayments(clientKey);

// 위젯 객체 생성 (회원/비회원 구분)
const widgets = tossPayments.widgets({ customerKey });

// 초기 결제 금액 설정
await widgets.setAmount({ currency: "KRW", value: 50000 });
```

### 2. 실시간 금액 계산 (checkout.html:82-96)
```javascript
// 쿠폰 체크박스 이벤트
coupon.addEventListener("change", async function () {
  if (coupon.checked) {
    // 5,000원 할인 적용
    await widgets.setAmount({
      currency: "KRW",
      value: amount.value - 5000
    });
  } else {
    // 원래 금액으로 복구
    await widgets.setAmount({
      currency: "KRW",
      value: amount
    });
  }
});
```

### 3. 결제 요청 (checkout.html:100-112)
```javascript
await widgets.requestPayment({
  orderId: generateRandomString(),           // 주문 ID
  orderName: "토스 티셔츠 외 2건",           // 주문명
  successUrl: window.location.origin + "/success.html",  // 성공 URL
  failUrl: window.location.origin + "/fail.html",        // 실패 URL
  customerEmail: "customer123@gmail.com",    // 구매자 이메일
  customerName: "김토스",                    // 구매자 명
  customerMobilePhone: "01012341234",        // 구매자 전화번호
});
```

### 4. 결제 승인 처리 (success.html:46-75)
```javascript
// URL 파라미터에서 결제 정보 추출
const urlParams = new URLSearchParams(window.location.search);

// 서버로 결제 승인 요청
const response = await fetch("/confirm", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    paymentKey: urlParams.get("paymentKey"),
    orderId: urlParams.get("orderId"),
    amount: urlParams.get("amount")
  })
});
```

### 5. 서버 결제 승인 (server.js:15-49)
```javascript
// 토스페이먼츠 결제 승인 API 호출
got.post("https://api.tosspayments.com/v1/payments/confirm", {
  headers: {
    Authorization: encryptedSecretKey,
    "Content-Type": "application/json",
  },
  json: { orderId, amount, paymentKey }
})
.then(response => {
  // 성공: 결제 완료 비즈니스 로직
  res.status(response.statusCode).json(response.body);
})
.catch(error => {
  // 실패: 결제 실패 비즈니스 로직
  res.status(error.response.statusCode).json(error.response.body);
});
```

---

## 🚀 실행 방법

### 1. 환경 설정
```bash
cd payment-sample/html-node
npm install
```

### 2. 서버 실행
```bash
npm start
# 또는
node server.js
```

### 3. 접속
- **개발 서버**: http://localhost:4242
- **메인 페이지**: 자동으로 checkout.html 로딩

---

## 💡 Study OnTable 프로젝트 적용 방안

### 1. 즉시 적용 가능한 요소
- **토스페이먼츠 SDK**: 동일한 결제 위젯 사용
- **디자인 시스템**: 토스 스타일 가이드 참조
- **결제 플로우**: 검증된 사용자 경험 패턴

### 2. Vue 3 적용 시 고려사항
```typescript
// Vue 3 Composition API 예시
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const tossPayments = ref(null)
    const widgets = ref(null)

    const initializePayment = async () => {
      tossPayments.value = TossPayments(clientKey)
      widgets.value = tossPayments.value.widgets({ customerKey })
      await widgets.value.setAmount({ currency: "KRW", value: totalAmount.value })
    }

    onMounted(() => {
      initializePayment()
    })

    return { initializePayment }
  }
}
```

### 3. 장바구니 연동 구조
```typescript
// Pinia Store와 연동
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const totalAmount = computed(() => cartStore.totalAmount)

// 결제 요청 시 장바구니 정보 활용
await widgets.value.requestPayment({
  orderId: generateOrderId(),
  orderName: generateOrderName(cartStore.items),  // 장바구니 아이템 기반
  amount: totalAmount.value,                      // 장바구니 총액
  // ... 기타 정보
})
```

---

## 🎯 개선 제안사항

### 1. 보안 강화
- [ ] 환경변수로 API 키 관리 (`process.env`)
- [ ] HTTPS 강제 적용
- [ ] CSRF 토큰 적용
- [ ] 결제 금액 서버 검증 로직 강화

### 2. 사용자 경험 개선
- [ ] 로딩 상태 표시
- [ ] 결제 진행 단계 표시
- [ ] 에러 메시지 한국어화
- [ ] 모바일 최적화

### 3. 기능 확장
- [ ] 다양한 결제수단 지원
- [ ] 할부 옵션
- [ ] 쿠폰/할인 시스템 확장
- [ ] 영수증/영수증 발급

### 4. 모니터링 및 로깅
- [ ] 결제 성공/실패 로그 수집
- [ ] 사용자 행동 분석
- [ ] 성능 모니터링
- [ ] 알림 시스템

---

## 📊 분석 결과 요약

### ✅ 장점
1. **간단한 구현**: 최소한의 코드로 완전한 결제 시스템 구현
2. **검증된 SDK**: 토스페이먼츠의 안정적인 결제 위젯 활용
3. **완성도 높은 UI**: 토스 디자인 시스템 기반의 세련된 인터페이스
4. **보안 고려**: 기본적인 보안 절차 준수

### ⚠️ 개선점
1. **하드코딩된 설정**: API 키와 고객 정보가 코드에 직접 포함
2. **에러 처리**: 부족한 예외 상황 처리
3. **확장성**: 단일 상품 결제에 특화된 구조
4. **테스트**: 실제 결제 테스트 환경 부족

### 🎯 Study OnTable 프로젝트 적용 권장도
**⭐⭐⭐⭐⭐ (5/5)** - 즉시 적용 가능한 완성도 높은 참조 프로젝트

---

**분석 완료일**: 2024.09.26
**분석 대상**: payment-sample/html-node/
**분석자**: Claude Code