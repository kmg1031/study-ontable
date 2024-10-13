<template>
    <div>
        <section class="menu-category">
            <h2>메뉴 카테고리</h2>
            <ul>
            <li v-for="category in categories" :key="category">
                <a href="#" @click.prevent="selectCategory(category)">{{ category }}</a>
            </li>
            </ul>
        </section>

        <section v-for="(menus, category) in filteredMenus" :key="category" class="menu-list">
            <h3>{{ category }}</h3>
            <div class="menu-item" v-for="menu in menus" :key="menu.menuIdx">
            <img :src="menu.image" :alt="menu.name" />
            <div class="menu-info">
                <h4>{{ menu.name }}</h4>
                <p>{{ menu.description }}</p>
                <span class="price">₩{{ menu.price }}</span>
                <router-link :to="{ name: 'Item', params: { itemIdx: menu.menuIdx }, query: { storeIdx } }" class="btn">
                주문하기
                </router-link>
            </div>
            </div>
        </section>
    </div>
</template>

<script>
import axios from '@/plugins/axios';

export default {
    name: 'MenuListComponent',
    props: {
        storeIdx: Number,
    },
    data() {
    return {
        categories: ['커피', '차', '디저트'],
        selectedCategory: '커피',
        menus: [],
    };
    },
    computed: {
    filteredMenus() {
        return {
            [this.selectedCategory]: this.menus.filter(menu => menu.category === this.selectedCategory),
        };
    },
    },
    created() {
        // TODO: 실제 데이터 가져오기
        this.fetchMenuData();
    },
    methods: {
        fetchMenuData() {
            axios
                .get('/api/menus', {
                    params: {
                        storeIdx: this.storeIdx,
                    },
                })
                .then(response => {
                    this.menus = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        // fetchMenuData() {
        //     // 실제로는 API를 호출하여 데이터를 가져옵니다.
        //     // 여기서는 예시 데이터를 사용합니다.
        //     this.menus = [
        //     {
        //         menuIdx: 1,
        //         name: '아메리카노',
        //         description: '신선한 원두로 만든 아메리카노입니다.',
        //         price: 4000,
        //         image: '/images/coffee1.jpg',
        //         category: '커피',
        //     },
        //     // 추가 메뉴 데이터
        //     ];
        // },
        selectCategory(category) {
            this.selectedCategory = category;
        },
    },
};
</script>

<style scoped>
/* 스타일 추가 */
</style>
