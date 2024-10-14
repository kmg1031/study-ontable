<template>
    <div>
        <!-- 카테고리 목록 -->
        <nav class="category-nav">
            <ul>
                <li v-for="category in categories" :key="category">
                    <a href="#" @click.prevent="scrollToCategory(category)">{{ category }}</a>
                </li>
            </ul>
        </nav>

        <!-- 메뉴 리스트 -->
        <div class="menu-list">
            <section
                v-for="category in categories"
                :key="category"
                :id="category"
                class="menu-category"
            >
                <h2>{{ category }}</h2>
                <div
                    class="menu-item"
                    v-for="menu in filteredMenusByCategory(category)"
                    :key="menu.menuIdx"
                >
                    <div class="menu-info">
                        <div class="menu-tags">
                            <span v-for="tag in menu.tags" :key="tag" class="menu-tag">{{ tag }}</span>
                        </div>
                        <h3>{{ menu.name }}</h3>
                        <p>{{ menu.description }}</p>
                        <button @click="addToCartItem(menu)" class="btn-add-to-cart">담기</button>
                    </div>
                    <div class="menu-image" v-if="menu.image">
                        <img :src="menu.image" :alt="menu.name" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'MenuListComponent',
    props: {
        storeIdx: Number,
    },
    data() {
        return {
            categories: ['커피', '차', '디저트'],
            menus: [],
        };
    },
    created() {
        this.fetchMenuData();
    },
    methods: {
        fetchMenuData() {
            // 실제로는 API를 호출하여 데이터를 가져옵니다.
            this.menus = [
                {
                    menuIdx: 1,
                    name: '아메리카노',
                    description: '신선한 원두로 만든 아메리카노입니다.',
                    tags: ['HOT', 'BEST'],
                    image: '/images/coffee1.jpg',
                    category: '커피',
                    price : 3000,
                },
                {
                    menuIdx: 2,
                    name: '카페 라떼',
                    description: '부드러운 우유와 함께하는 카페 라떼입니다.',
                    tags: ['ICE'],
                    image: '/images/coffee2.jpg',
                    category: '커피',
                    price : 3000,
                },
                {
                    menuIdx: 3,
                    name: '카페 라떼',
                    description: '부드러운 우유와 함께하는 카페 라떼입니다.',
                    tags: ['ICE'],
                    image: '/images/coffee2.jpg',
                    category: '커피',
                    price : 5000,
                },
                {
                    menuIdx: 4,
                    name: '카페 라떼',
                    description: '부드러운 우유와 함께하는 카페 라떼입니다.',
                    tags: ['ICE'],
                    image: '/images/coffee2.jpg',
                    category: '커피',
                    price : 5000,
                },
                {
                    menuIdx: 5,
                    name: '녹차',
                    description: '향긋한 녹차 한 잔으로 힐링하세요.',
                    tags: [],
                    image: '',
                    category: '차',
                    price : 5000,
                },
                {
                    menuIdx: 6,
                    name: '녹차',
                    description: '향긋한 녹차 한 잔으로 힐링하세요.',
                    tags: [],
                    image: '',
                    category: '차',
                    price : 6000,
                },
                {
                    menuIdx: 7,
                    name: '녹차',
                    description: '향긋한 녹차 한 잔으로 힐링하세요.',
                    tags: [],
                    image: '',
                    category: '차',
                    price : 5000,
                },
                {
                    menuIdx: 8,
                    name: '녹차',
                    description: '향긋한 녹차 한 잔으로 힐링하세요.',
                    tags: [],
                    image: '',
                    category: '차',
                    price : 5000,
                },
                {
                    menuIdx: 9,
                    name: '녹차',
                    description: '향긋한 녹차 한 잔으로 힐링하세요.',
                    tags: [],
                    image: '',
                    category: '차',
                    price : 5000,
                },
            ];
        },
        filteredMenusByCategory(category) {
            return this.menus.filter((menu) => menu.category === category);
        },
        scrollToCategory(category) {
            const element = document.getElementById(category);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        },
        addToCart(menu) {
            console.log('장바구니에 추가:', menu);
            alert(`${menu.name}이(가) 장바구니에 담겼습니다.`);
        },
        ...mapActions(['addToCart']),
        addToCartItem(menu) {
            this.addToCart(menu);
            alert(`${menu.name}이(가) 장바구니에 담겼습니다.`);
        },
    },
};
</script>

<style scoped>
/* 카테고리 네비게이션 */
.category-nav {
    background-color: #f8f8f8;
    padding: 10px;
}

.category-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
}

.category-nav li {
    margin-right: 15px;
}

.category-nav a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
}

.category-nav a:hover {
    color: #007bff;
}

/* 메뉴 리스트 */
.menu-list {
    margin-top: 20px;
}

.menu-category {
    margin-bottom: 40px;
}

.menu-category h2 {
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
}

.menu-item {
    display: flex;
    border-bottom: 1px solid #ccc;
    padding: 15px 0;
}

.menu-info {
    flex: 1;
}

.menu-tags {
    margin-bottom: 5px;
}

.menu-tag {
    display: inline-block;
    background-color: #eee;
    color: #555;
    padding: 2px 6px;
    margin-right: 5px;
    border-radius: 3px;
    font-size: 12px;
}

.menu-info h3 {
    margin: 5px 0;
}

.menu-info p {
    margin: 5px 0;
    color: #666;
}

.btn-add-to-cart {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.btn-add-to-cart:hover {
    background-color: #0056b3;
}

.menu-image {
    margin-left: 15px;
}

.menu-image img {
    max-width: 150px;
    max-height: 100px;
    object-fit: cover;
}

@media (max-width: 768px) {
    .menu-item {
    flex-direction: column;
    }
    .menu-image {
    margin-left: 0;
    margin-top: 10px;
    }
}
</style>
