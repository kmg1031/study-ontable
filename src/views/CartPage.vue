<template>
	<div class="cart-page">
		<h1>장바구니</h1>
		<div v-if="cartItems.length > 0">
			<table class="cart-table">
				<thead>
					<tr>
						<th>메뉴명</th>
						<th>수량</th>
						<th>가격</th>
						<th>삭제</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in cartItems" :key="item.key">
						<td>
							{{ item.name }}
							<!-- 옵션 표시 -->
							<div class="item-options">
								<div v-for="(value, key) in item.options" :key="key">
									<span>{{ key }}: {{ getOptionLabel(item, key, value) }}</span>
								</div>
							</div>
						</td>
						<td>
							<input
								type="number"
								v-model.number="item.quantity"
								min="1"
								@change="updateQuantity(item)"
							/>
						</td>
						<td>₩{{ calculateItemTotalPrice(item).toLocaleString() }}</td>
						<td>
							<button @click="removeItem(item.key)">삭제</button>
						</td>
					</tr>
				</tbody>
			</table>
			<div class="cart-total">
				총 합계: ₩{{ cartTotalPrice.toLocaleString() }}
			</div>
			<button @click="placeOrder" class="btn-order">주문하기</button>
		</div>
		<div v-else>
			<p>장바구니가 비어 있습니다.</p>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import axios from '@/plugins/axios';

	export default {
		name: 'CartPage',
		computed: {
			...mapGetters(['cartItems', 'cartTotalPrice']),
		},
		methods: {
			...mapActions(['removeFromCart', 'clearCart', 'updateCartItemQuantity']),
			placeOrder() {
				// 주문 데이터 준비
				const orderData = {
					storeIdx: 1, // 실제 매장 인덱스로 대체
					tableIdx: 1, // 실제 테이블 인덱스로 대체
					menuList: this.cartItems.map(item => ({
						menuIdx: item.menuIdx,
						quantity: item.quantity,
						options: item.options,
						totalPrice: this.calculateItemTotalPrice(item) / item.quantity, // 아이템 1개당 총 가격
					})),
				};
			
				// 주문 API 호출
				axios
					.post('/api/order/store', orderData)
					.then(response => {
						if (response.data.success) {
						alert('주문이 완료되었습니다.');
						this.clearCart(); // 장바구니 비우기
						this.$router.push({ name: 'HomePage' }); // 홈 페이지로 이동
						} else {
						alert('주문에 실패하였습니다.');
						}
					})
					.catch(error => {
						console.error(error);
						alert('주문 중 오류가 발생하였습니다.');
					});
			},
			getOptionLabel(item, groupName, value) {
				const optionGroup = item.optionsData.find(group => group.name === groupName);
				if (optionGroup && optionGroup.items) {
					const optionItem = optionGroup.items.find(opt => opt.value === value);
					return optionItem ? optionItem.label : value;
				}
				return value;
			},
			updateQuantity(item) {
				if (item.quantity < 1) {
					item.quantity = 1;
				}
				this.updateCartItemQuantity({ key: item.key, quantity: item.quantity });
			},
			removeItem(key) {
				this.removeFromCart(key);
			},
			calculateItemTotalPrice(item) {
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
			},
		},
	};
</script>

<style scoped>
	.cart-page {
		padding: 20px;
	}

	.cart-table {
		width: 100%;
		border-collapse: collapse;
	}

	.cart-table th,
	.cart-table td {
		border: 1px solid #ccc;
		padding: 10px;
		text-align: center;
	}

	.cart-total {
		margin-top: 20px;
		font-size: 18px;
		font-weight: bold;
		text-align: right;
	}

	.btn-order {
		margin-top: 20px;
		padding: 10px 20px;
		background-color: #007bff;
		color: #fff;
		border: none;
		cursor: pointer;
	}

	.btn-order:hover {
		background-color: #0056b3;
	}
	.item-options {
		font-size: 12px;
		color: #666;
	}
</style>
