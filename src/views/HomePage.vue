<template>
    <div>
        <header>
            <h5>매장 이름</h5>
        </header>

        <main>
            <MenuList :storeIdx="storeIdx" />
        </main>

        <footer>
            <p>매장 주소: 서울특별시 어딘가</p>
            <p>문의 전화: 02-123-4567</p>
        </footer>
    </div>
</template>

<script>
import MenuList from '@/components/MenuListComponent.vue';

export default {
    name: 'HomePage',
    components: {
        MenuList,
    },
    props: {
        storeIdx: Number,
        tableIdx: Number,
        tableKey: String,
    },
};
</script>

<style scoped>
/* 스타일 추가 */
</style>
