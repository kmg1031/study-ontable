import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ItemPage from '@/views/ItemPage.vue';
import CartPage from '@/views/CartPage.vue';

const routes = [
    {
        path: '/orderer/index',
        name: 'HomePage',
        component: HomePage,
        props: route => ({
            storeIdx: route.query.storeIdx,
            tableIdx: route.query.tableIdx,
            tableKey: route.query.tableKey,
        }),
    },
    {
        path: '/orderer/item/:itemIdx',
        name: 'ItemPage',
        component: ItemPage,
        props: route => ({
            storeIdx: route.query.storeIdx,
            itemIdx: route.params.itemIdx,
        }),
    },
    {
        path: '/orderer/cart',
        name: 'CartPage',
        component: CartPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
