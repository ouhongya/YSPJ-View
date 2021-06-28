<template>
	<view>
		<view class="spinner-inside" :style="{
				width: size*2  + 'px'
			}">
			<view :style="{ backgroundColor: color }" class="rect1"></view>
			<view :style="{ backgroundColor: color }" class="rect2"></view>
			<view :style="{ backgroundColor: color }" class="rect3"></view>
			<view :style="{ backgroundColor: color }" class="rect4"></view>
			<view :style="{ backgroundColor: color }" class="rect5"></view>
			<view :style="{ backgroundColor: color }" class="rect6"></view>
			<view :style="{ backgroundColor: color }" class="rect7"></view>
			<view :style="{ backgroundColor: color }" class="rect8"></view>
			<view :style="{ backgroundColor: color }" class="rect9"></view>
			<view :style="{ backgroundColor: color }" class="rect10"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'note',
		props: {
			color: String,
			size: Number
		}
	};
</script>

<style scoped>
	.spinner-inside {
		margin: 25px auto;
		text-align: center;
		font-size: 10px;
		height: 22px;
	}

	.spinner-inside>view {
		height: 100%;
		width: 3px;
		margin: 0 2px;
		display: inline-block;
		-webkit-animation: stretchdelay .8s infinite;
		animation: stretchdelay .8s infinite;

	}

	.spinner-inside .rect2 {

		-webkit-animation-delay: -0.1s;
		animation-delay: -0.1s;
	}

	.spinner-inside .rect3 {

		-webkit-animation-delay: -0.2s;
		animation-delay: -0.2s;
	}

	.spinner-inside .rect4 {
		-webkit-animation-delay: -0.3s;
		animation-delay: -0.3s;
	}

	.spinner-inside .rect5 {
		-webkit-animation-delay: -0.4s;
		animation-delay: -0.4s;
	}

	.spinner-inside .rect6 {
		-webkit-animation-delay: -0.5s;
		animation-delay: -0.5s;
	}

	.spinner-inside .rect7 {

		-webkit-animation-delay: -0.6s;
		animation-delay: -0.6s;
	}

	.spinner-inside .rect8 {
		-webkit-animation-delay: -0.7s;
		animation-delay: -0.7s;
	}

	.spinner-inside .rect9 {

		-webkit-animation-delay: -0.8s;
		animation-delay: -0.8s;
	}

	.spinner-inside .rect10 {
		-webkit-animation-delay: -0.9s;
		animation-delay: -0.9s;
	}


	@-webkit-keyframes stretchdelay {
		50% {
			-ms-transform: scaleY(0);
			-webkit-transform: scaleY(0);
			transform: scaleY(0);
		}
	}

	@keyframes stretchdelay {
		50% {
			-ms-transform: scaleY(0);
			-webkit-transform: scaleY(0);
			transform: scaleY(0);
		}
	}
</style>
