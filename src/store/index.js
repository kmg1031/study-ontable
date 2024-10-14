// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    cart: [],
  },
  mutations: {
    ADD_TO_CART(state, menuItem) {
      // 동일한 메뉴가 이미 장바구니에 있는지 확인
      const item = state.cart.find(item => item.menuIdx === menuItem.menuIdx);
      if (item) {
        item.quantity += 1; // 수량 증가
      } else {
        state.cart.push({ ...menuItem, quantity: 1 });
      }
    },
    REMOVE_FROM_CART(state, menuIdx) {
      state.cart = state.cart.filter(item => item.menuIdx !== menuIdx);
    },
    CLEAR_CART(state) {
      state.cart = [];
    },
  },
  actions: {
    addToCart({ commit }, menuItem) {
      commit('ADD_TO_CART', menuItem);
    },
    removeFromCart({ commit }, menuIdx) {
      commit('REMOVE_FROM_CART', menuIdx);
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
    },
  },
  getters: {
    cartItems(state) {
      return state.cart;
    },
    cartTotalPrice(state) {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
});
