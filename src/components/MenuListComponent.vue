<template>
    <div class="container">
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
                    <div class="menu-info" @click="addToCartItem(menu)">
                        <div class="menu-tags">
                            <span v-for="tag in menu.tags" :key="tag" class="menu-tag">{{ tag }}</span>
                        </div>
                        <h3>{{ menu.name }}</h3>
                        <p>{{ menu.description }}</p>
                    </div>
                    <div class="menu-image"
                        @click="addToCartItem(menu)"
                        v-if="menu.image">
                        <img :src="menu.image" :alt="menu.name" />
                    </div>
                </div>
            </section>
        </div>
        <!-- 옵션 모달 컴포넌트 추가 -->
        <OptionModal
        :visible="isModalVisible"
        :menu="selectedMenu"
        @confirm="addToCartWithOptions"
        @close="closeModal"
        />
    </div>
</template>
<script>
import OptionModal from '@/components/OptionModal.vue';
import { mapActions } from 'vuex';

export default {
    name: 'MenuListComponent',
    components: {
        OptionModal,
    },
    props: {
        storeIdx: Number,
    },
    data() {
        return {
            categories: ['음료', '디저트'],
            menus: [],
            isModalVisible: false,
            selectedMenu: null,
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
                    price: 4000,
                    tags: ['HOT', 'BEST'],
                    image: null,
                    category: '음료',
                    options: [
                        {
                            name: '사이즈',
                            required: true, // 필수 옵션
                            items: [
                            { label: 'Small', value: 'small', price: 0 },
                            { label: 'Medium', value: 'medium', price: 500 },
                            { label: 'Large', value: 'large', price: 1000 },
                            ],
                        },
                        {
                            name: '샷 추가',
                            items: [
                            { label: '연하게(1삿)', value: 'shot1', price: 0 },
                            { label: '추가 안함(기본 2샷)', value: 'shot2', price: 0 },
                            { label: '샷 1개 추가(3샷)', value: 'shot3', price: 500 },
                            { label: '샷 2개 추가(4샷)', value: 'shot4', price: 1000 },
                            ],
                        },
                    ],
                },
                {
                    menuIdx: 2,
                    name: '아이스티',
                    description: '신선한 원두로 만든 아메리카노입니다.',
                    price: 4000,
                    tags: [],
                    image: null,
                    category: '음료',
                    options: [
                        {
                            name: '사이즈',
                            required: true, // 필수 옵션
                            items: [
                            { label: 'Small', value: 'small', price: 0 },
                            { label: 'Medium', value: 'medium', price: 500 },
                            { label: 'Large', value: 'large', price: 1000 },
                            ],
                        },
                        {
                            name: '샷 추가',
                            items: [
                            { label: '연하게(1삿)', value: 'shot1', price: 0 },
                            { label: '추가 안함(기본 2샷)', value: 'shot2', price: 0 },
                            { label: '샷 1개 추가(3샷)', value: 'shot3', price: 500 },
                            { label: '샷 2개 추가(4샷)', value: 'shot4', price: 1000 },
                            ],
                        },
                    ],
                },
                {
                    menuIdx: 3,
                    name: '핫밀크',
                    description: '신선한 원두로 만든 아메리카노입니다.',
                    price: 4000,
                    tags: ['BEST'],
                    image: null,
                    category: '음료',
                    options: [
                        {
                            name: '사이즈',
                            required: true, // 필수 옵션
                            items: [
                            { label: 'Small', value: 'small', price: 0 },
                            { label: 'Medium', value: 'medium', price: 500 },
                            { label: 'Large', value: 'large', price: 1000 },
                            ],
                        },
                        {
                            name: '샷 추가',
                            items: [
                            { label: '연하게(1삿)', value: 'shot1', price: 0 },
                            { label: '추가 안함(기본 2샷)', value: 'shot2', price: 0 },
                            { label: '샷 1개 추가(3샷)', value: 'shot3', price: 500 },
                            { label: '샷 2개 추가(4샷)', value: 'shot4', price: 1000 },
                            ],
                        },
                    ],
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
            this.selectedMenu = menu;
            this.isModalVisible = true;
        },
        addToCartWithOptions({ menu, options, quantity }) {
            const menuItemWithOptions = {
                ...menu,
                options,
                quantity,
                optionsData: menu.options,
            };
            this.addToCart(menuItemWithOptions);
            alert(`${menu.name}이(가) 장바구니에 담겼습니다.`);
        },
        closeModal() {
            this.isModalVisible = false;
            this.selectedMenu = null;
        },
    },
};
</script>

<style scoped>
/* 컨테이너 스타일 */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 헤더 스타일 */
.header {
  background-color: #333;
  color: #fff;
  padding: 15px;
  text-align: center;
}

/* 메뉴 리스트 스타일 */
.menu-list {
  padding: 15px 0;
}

.menu-category h2 {
  border-bottom: 2px solid #333;
  padding-bottom: 5px;
  margin-top: 20px;
}

.menu-info {
  margin-top: 10px;
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
  font-size: 18px;
}

.menu-info p {
  margin: 5px 0;
  color: #666;
}

/* menu-item을 flex 컨테이너로 설정 */
.menu-item {
  display: flex;
  align-items: center; /* 수직 정렬 */
  justify-content: space-between; /* 양쪽 끝으로 배치 */
  margin-bottom: 20px;
}

/* menu-info를 왼쪽에 배치하고, flex-grow로 공간을 차지하게 함 */
.menu-info {
  flex: 1;
}

/* menu-image를 오른쪽에 배치 */
.menu-image {
  margin-left: 15px;
}

/* 이미지 크기 설정 */
.menu-image img {
  width: 100px; /* 원하는 크기로 설정 */
  height: 100px; /* 정사각형으로 고정 */
  object-fit: cover; /* 이미지 비율 유지하며 영역 채우기 */
}

.menu-item {
    flex-direction: row;
}
</style>
