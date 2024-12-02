<template>
	<div id="wrap">
		<header>
			<nav>
				<div class="nav-l">
					<router-link :to="{ name: 'HomePage' }">홈</router-link>
				</div>
				<div class="nav-r">
					<router-link :to="{ name: 'CartPage' }">장바구니({{ cartItemCount }})</router-link>
				</div>
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
	nav .nav-l {
		flex: 1;
	}
	nav .nav-r {
		text-align: right;
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