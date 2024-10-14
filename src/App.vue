<template>
	<div>
		<header>
			<nav>
				<router-link :to="{ name: 'HomePage' }">홈</router-link>
				<router-link :to="{ name: 'CartPage' }">장바구니({{ cartItemCount }})</router-link>
			</nav>
		</header>
		<router-view></router-view>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'App',
	computed: {
		...mapGetters({
			cartItems: 'cartItems',
		}),
		cartItemCount() {
			return this.cartItems.reduce((total, item) => total + item.quantity, 0);
		},
	},
};
</script>

<style>
	@import 'vuetify/styles';
	/* 헤더 스타일링 */
	header {
		background-color: #f8f8f8;
		padding: 10px;
	}

	nav {
		display: flex;
	}

	nav a {
		margin-right: 15px;
		text-decoration: none;
		color: #333;
		font-weight: bold;
	}

	nav a:hover {
		color: #007bff;
	}
</style>