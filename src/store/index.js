// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    cart: [],
  },
  mutations: {
    ADD_TO_CART(state, menuItem) {
      // 메뉴 아이템과 옵션을 고유하게 식별하기 위해 키 생성
      const itemKey = `${menuItem.menuIdx}_${JSON.stringify(menuItem.options)}`;
      const item = state.cart.find(item => item.key === itemKey);
      if (item) {
        item.quantity += menuItem.quantity; // 선택한 수량만큼 증가
      } else {
        state.cart.push({
          ...menuItem,
          key: itemKey,
          optionsData: menuItem.optionsData,
        });
      }
    },
    REMOVE_FROM_CART(state, key) {
      state.cart = state.cart.filter(item => item.key !== key);
    },
    CLEAR_CART(state) {
      state.cart = [];
    },
    UPDATE_CART_ITEM_QUANTITY(state, { key, quantity }) {
      const item = state.cart.find(item => item.key === key);
      if (item) {
        item.quantity = quantity;
      }
    },
  },
  actions: {
    addToCart({ commit }, menuItem) {
      commit('ADD_TO_CART', menuItem);
    },
    removeFromCart({ commit }, key) {
      commit('REMOVE_FROM_CART', key);
    },
    clearCart({ commit }) {
      commit('CLEAR_CART');
    },
    updateCartItemQuantity({ commit }, payload) {
      commit('UPDATE_CART_ITEM_QUANTITY', payload);
    },
  },
  getters: {
    cartItems(state) {
      return state.cart;
    },
    cartTotalPrice(state) {
      return state.cart.reduce((total, item) => total + calculateItemTotalPrice(item), 0);
    },
  },
});

function calculateItemTotalPrice(item) {
  let totalPrice = item.price || 0;

  // 옵션 가격 합산
  if (item.options && item.optionsData) {
    for (const [groupName, value] of Object.entries(item.options)) {
      const optionGroup = item.optionsData.find(group => group.name === groupName);
      if (optionGroup) {
        const optionItem = optionGroup.items.find(opt => opt.value === value);
        if (optionItem) {
          totalPrice += optionItem.price || 0;
        }
      }
    }
  }

  return totalPrice * item.quantity;
}