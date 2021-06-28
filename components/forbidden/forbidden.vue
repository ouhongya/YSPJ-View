<template>
	<view class="forbidden">
		<view class="empty1">
			<view>
				<image src="../../static/mescroll-empty.png" mode=""></image>
				<view class="empty-tips">
					当前角色没有该菜单权限~
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.empty1 {
		width: 100%;
		text-align: center;
		padding: 100rpx 0 60rpx;

		image {
			width: 300rpx;
			height: 300rpx;
			max-width: 150px;
			max-height: 150px;
		}

		.empty-tips {
			color: #bfbfbf;
			margin-top: 10rpx;
			font-size: 28rpx;
		}
	}
</style>
