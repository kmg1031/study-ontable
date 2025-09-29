import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/globals.css'

import MenuView from './views/MenuView.vue'
import OptionView from './views/OptionView.vue'
import CartView from './views/CartView.vue'
import OrderView from './views/OrderView.vue'
import PaymentSuccessView from './views/PaymentSuccessView.vue'
import PaymentFailView from './views/PaymentFailView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/menu' },
  { path: '/menu', name: 'menu', component: MenuView },
  { path: '/option/:id', name: 'option', component: OptionView, props: true },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/order', name: 'order', component: OrderView },
  { path: '/payment/success', name: 'payment-success', component: PaymentSuccessView },
  { path: '/payment/fail', name: 'payment-fail', component: PaymentFailView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')