const express = require('express');
const router = express.Router();

// 메뉴 리스트 가져오기
router.get('/menus', (req, res) => {
const { storeIdx } = req.query;

// TODO: 데이터베이스에서 메뉴 데이터 가져오기

const menus = [
    {
        menuIdx: 1,
        name: '아메리카노',
        description: '신선한 원두로 만든 아메리카노입니다.',
        price: 4000,
        image: '/images/coffee1.jpg',
        category: '커피',
    },
    // 추가 메뉴 데이터
];

res.json(menus);
});

// 메뉴 상세 정보 가져오기
router.get('/menus/:itemIdx', (req, res) => {
    const { storeIdx } = req.query;
    const { itemIdx } = req.params;

    // TODO: 데이터베이스에서 메뉴 상세 정보 가져오기

    const item = {
        menuIdx: itemIdx,
        name: '아메리카노',
        description: '신선한 원두로 만든 아메리카노입니다.',
        price: 4000,
        image: '/images/coffee1.jpg',
        sizes: {
            Regular: 0,
            Large: 500,
        },
        extras: [
            { name: '샷 추가', price: 500 },
            { name: '시럽 추가', price: 300 },
        ],
    };

    res.json(item);
});

// 주문하기
router.post('/order/store', (req, res) => {
    const { storeIdx, tableIdx, menuList } = req.body;

    // TODO: 주문 처리 로직 추가
    console.log('주문 데이터:', { storeIdx, tableIdx, menuList });

    // 주문이 성공적으로 처리되었다고 가정
    res.json({ success: true, message: '주문이 완료되었습니다.' });
});

module.exports = router;
