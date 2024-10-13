<template>
    <div>
        <header>
            <h1>메뉴 상세</h1>
            <router-link :to="{ name: 'OrdererHome', query: { storeIdx } }">← 뒤로가기</router-link>
        </header>

        <main>
            <div class="menu-detail">
                <img :src="item.image" :alt="item.name" />
                <div class="menu-info">
                    <h2>{{ item.name }}</h2>
                    <p>{{ item.description }}</p>
                    <span class="price">₩{{ item.price }}</span>

                    <form @submit.prevent="addToCart">
                        <label for="size">사이즈 선택:</label>
                        <select v-model="selectedSize" id="size">
                            <option v-for="(price, size) in item.sizes" :key="size" :value="size">
                            {{ size }} (+₩{{ price }})
                            </option>
                        </select>

                        <label>추가 옵션:</label>
                        <div v-for="(option, index) in item.extras" :key="index">
                            <input type="checkbox" :value="option" v-model="selectedExtras" />
                            {{ option.name }} (+₩{{ option.price }})
                        </div>

                        <button type="submit" class="btn">장바구니에 담기</button>
                    </form>
                </div>
            </div>
        </main>

        <footer>
            <p>매장 주소: 서울특별시 어딘가</p>
            <p>문의 전화: 02-123-4567</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'ItemPage',
    props: {
        storeIdx: Number,
        itemIdx: Number,
    },
    data() {
        return {
            item: {},
            selectedSize: '',
            selectedExtras: [],
        };
    },
    created() {
        // TODO: 실제 데이터 가져오기
        this.fetchItemData();
    },
    methods: {
        fetchItemData() {
            // 실제로는 API를 호출하여 데이터를 가져옵니다.
            // 여기서는 예시 데이터를 사용합니다.
            this.item = {
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
            this.selectedSize = 'Regular';
        },
        addToCart() {
            // 장바구니에 메뉴를 추가하는 로직
            const menu = {
            menuIdx: this.itemIdx,
                options: {
                    size: this.selectedSize,
                    extras: this.selectedExtras,
                },
            };

            // TODO: 실제로는 Vuex나 API를 통해 상태를 관리합니다.
            console.log('장바구니에 추가:', menu);
            alert('장바구니에 메뉴가 추가되었습니다.');
        },
    },
};
</script>

<style scoped>
/* 스타일 추가 */
</style>
