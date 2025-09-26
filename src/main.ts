import { createApp } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/globals.css'

import MenuView from './views/MenuView.vue'
import OptionView from './views/OptionView.vue'
import CartView from './views/CartView.vue'
import OrderView from './views/OrderView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/menu' },
  { path: '/menu', name: 'menu', component: MenuView },
  { path: '/option/:id', name: 'option', component: OptionView, props: true },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/order', name: 'order', component: OrderView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')