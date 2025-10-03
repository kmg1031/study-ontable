-- Study OnTable Database Schema
-- 데이터베이스: study_ontable

-- 1. 메뉴 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '카테고리명 (예: 커피, 음료, 디저트)',
  display_order INT DEFAULT 0 COMMENT '표시 순서',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='메뉴 카테고리';

-- 2. 메뉴 아이템 테이블
CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL COMMENT '카테고리 ID',
  name VARCHAR(100) NOT NULL COMMENT '메뉴명',
  description TEXT COMMENT '메뉴 설명',
  base_price DECIMAL(10, 2) NOT NULL COMMENT '기본 가격',
  image_url VARCHAR(500) COMMENT '이미지 URL',
  is_available BOOLEAN DEFAULT TRUE COMMENT '판매 가능 여부',
  display_order INT DEFAULT 0 COMMENT '표시 순서',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_category (category_id),
  INDEX idx_available (is_available),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='메뉴 아이템';

-- 3. 메뉴 옵션 그룹 테이블 (예: 사이즈, 추가옵션)
CREATE TABLE IF NOT EXISTS option_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_id INT NOT NULL COMMENT '메뉴 아이템 ID',
  name VARCHAR(50) NOT NULL COMMENT '옵션 그룹명 (예: 사이즈, 추가옵션)',
  is_required BOOLEAN DEFAULT FALSE COMMENT '필수 선택 여부',
  display_order INT DEFAULT 0 COMMENT '표시 순서',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  INDEX idx_menu_item (menu_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='메뉴 옵션 그룹';

-- 4. 옵션 아이템 테이블
CREATE TABLE IF NOT EXISTS option_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  option_group_id INT NOT NULL COMMENT '옵션 그룹 ID',
  name VARCHAR(50) NOT NULL COMMENT '옵션명 (예: Regular, Large, 샷 추가)',
  price DECIMAL(10, 2) DEFAULT 0.00 COMMENT '추가 가격',
  is_available BOOLEAN DEFAULT TRUE COMMENT '선택 가능 여부',
  display_order INT DEFAULT 0 COMMENT '표시 순서',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (option_group_id) REFERENCES option_groups(id) ON DELETE CASCADE,
  INDEX idx_option_group (option_group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='옵션 아이템';

-- 5. 주문 테이블
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE COMMENT '주문 번호 (TossPayments orderId)',
  table_number VARCHAR(20) COMMENT '테이블 번호',
  customer_name VARCHAR(100) COMMENT '고객명',
  customer_phone VARCHAR(20) COMMENT '고객 연락처',
  total_amount DECIMAL(10, 2) NOT NULL COMMENT '총 주문 금액',
  status ENUM('pending', 'confirmed', 'preparing', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '주문 상태',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending' COMMENT '결제 상태',
  payment_key VARCHAR(200) COMMENT 'TossPayments paymentKey',
  payment_method VARCHAR(50) COMMENT '결제 수단',
  paid_at TIMESTAMP NULL COMMENT '결제 완료 시간',
  notes TEXT COMMENT '주문 메모',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order_number (order_number),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문';

-- 6. 주문 아이템 테이블
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '주문 ID',
  menu_item_id INT NOT NULL COMMENT '메뉴 아이템 ID',
  menu_name VARCHAR(100) NOT NULL COMMENT '메뉴명 (주문 당시)',
  base_price DECIMAL(10, 2) NOT NULL COMMENT '기본 가격 (주문 당시)',
  quantity INT NOT NULL DEFAULT 1 COMMENT '수량',
  subtotal DECIMAL(10, 2) NOT NULL COMMENT '소계 (옵션 포함)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  INDEX idx_order (order_id),
  INDEX idx_menu_item (menu_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문 아이템';

-- 7. 주문 아이템 옵션 테이블
CREATE TABLE IF NOT EXISTS order_item_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_item_id INT NOT NULL COMMENT '주문 아이템 ID',
  option_group_name VARCHAR(50) NOT NULL COMMENT '옵션 그룹명 (주문 당시)',
  option_name VARCHAR(50) NOT NULL COMMENT '옵션명 (주문 당시)',
  option_price DECIMAL(10, 2) DEFAULT 0.00 COMMENT '옵션 가격 (주문 당시)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  INDEX idx_order_item (order_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='주문 아이템 옵션';

-- 8. 결제 이력 테이블
CREATE TABLE IF NOT EXISTS payment_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '주문 ID',
  payment_key VARCHAR(200) COMMENT 'TossPayments paymentKey',
  action ENUM('confirm', 'cancel', 'inquiry') NOT NULL COMMENT '액션 타입',
  request_data JSON COMMENT '요청 데이터',
  response_data JSON COMMENT '응답 데이터',
  status ENUM('success', 'failed') NOT NULL COMMENT '처리 상태',
  error_message TEXT COMMENT '에러 메시지',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order (order_id),
  INDEX idx_payment_key (payment_key),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 이력';

-- 샘플 데이터 삽입

-- 카테고리
INSERT INTO categories (name, display_order) VALUES
('커피', 1),
('음료', 2),
('디저트', 3),
('베이커리', 4);

-- 메뉴 아이템 (커피)
INSERT INTO menu_items (category_id, name, description, base_price, image_url, display_order) VALUES
(1, '아메리카노', '진한 에스프레소에 물을 더한 깔끔한 커피', 4500.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd', 1),
(1, '카페라떼', '부드러운 우유와 에스프레소의 조화', 5000.00, 'https://images.unsplash.com/photo-1561882468-9110e03e0f78', 2),
(1, '카푸치노', '풍부한 거품이 특징인 클래식 커피', 5000.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d', 3),
(1, '카라멜 마키아또', '달콤한 카라멜과 우유, 에스프레소', 5500.00, 'https://images.unsplash.com/photo-1599750464852-a9666c2b4c99', 4);

-- 메뉴 아이템 (음료)
INSERT INTO menu_items (category_id, name, description, base_price, image_url, display_order) VALUES
(2, '녹차 라떼', '진한 녹차와 부드러운 우유', 5500.00, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9', 1),
(2, '딸기 스무디', '신선한 딸기로 만든 시원한 스무디', 6000.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888', 2),
(2, '자몽 에이드', '상큼한 자몽과 탄산의 만남', 5500.00, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8', 3);

-- 메뉴 아이템 (디저트)
INSERT INTO menu_items (category_id, name, description, base_price, image_url, display_order) VALUES
(3, '치즈케이크', '부드럽고 진한 뉴욕 스타일 치즈케이크', 6500.00, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50', 1),
(3, '티라미수', '이탈리아 전통 디저트', 6000.00, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9', 2),
(3, '초코 브라우니', '진한 초콜릿 브라우니', 5000.00, 'https://images.unsplash.com/photo-1607920591413-4ec007e70023', 3);

-- 옵션 그룹 (아메리카노 - 사이즈)
INSERT INTO option_groups (menu_item_id, name, is_required, display_order) VALUES
(1, '사이즈', TRUE, 1),
(1, '추가 옵션', FALSE, 2);

-- 옵션 아이템 (아메리카노 - 사이즈)
INSERT INTO option_items (option_group_id, name, price, display_order) VALUES
(1, 'Regular', 0.00, 1),
(1, 'Large', 500.00, 2);

-- 옵션 아이템 (아메리카노 - 추가 옵션)
INSERT INTO option_items (option_group_id, name, price, display_order) VALUES
(2, '샷 추가', 500.00, 1),
(2, '시럽 추가', 500.00, 2),
(2, '휘핑크림', 500.00, 3);

-- 모든 커피 메뉴에 동일한 옵션 추가
INSERT INTO option_groups (menu_item_id, name, is_required, display_order)
SELECT id, '사이즈', TRUE, 1 FROM menu_items WHERE id IN (2, 3, 4);

INSERT INTO option_groups (menu_item_id, name, is_required, display_order)
SELECT id, '추가 옵션', FALSE, 2 FROM menu_items WHERE id IN (2, 3, 4);

-- 카페라떼, 카푸치노, 카라멜 마키아또 사이즈 옵션
INSERT INTO option_items (option_group_id, name, price, display_order)
SELECT og.id, 'Regular', 0.00, 1
FROM option_groups og
JOIN menu_items mi ON og.menu_item_id = mi.id
WHERE mi.id IN (2, 3, 4) AND og.name = '사이즈';

INSERT INTO option_items (option_group_id, name, price, display_order)
SELECT og.id, 'Large', 500.00, 2
FROM option_groups og
JOIN menu_items mi ON og.menu_item_id = mi.id
WHERE mi.id IN (2, 3, 4) AND og.name = '사이즈';

-- 카페라떼, 카푸치노, 카라멜 마키아또 추가 옵션
INSERT INTO option_items (option_group_id, name, price, display_order)
SELECT og.id, '샷 추가', 500.00, 1
FROM option_groups og
JOIN menu_items mi ON og.menu_item_id = mi.id
WHERE mi.id IN (2, 3, 4) AND og.name = '추가 옵션';

INSERT INTO option_items (option_group_id, name, price, display_order)
SELECT og.id, '시럽 추가', 500.00, 2
FROM option_groups og
JOIN menu_items mi ON og.menu_item_id = mi.id
WHERE mi.id IN (2, 3, 4) AND og.name = '추가 옵션';

INSERT INTO option_items (option_group_id, name, price, display_order)
SELECT og.id, '휘핑크림', 500.00, 3
FROM option_groups og
JOIN menu_items mi ON og.menu_item_id = mi.id
WHERE mi.id IN (2, 3, 4) AND og.name = '추가 옵션';
