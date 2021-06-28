<template>
	<u-modal v-model="show" :show-cancel-button="true" confirm-text="升级" title="发现新版本" @cancel="cancel" @confirm="confirm">
		<view class="u-update-content">
			<rich-text :nodes="content"></rich-text>
		</view>
	</u-modal>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				content: `
					<view class="list_t">
						<view>2020-05-05  15:15:20</view>
						<view>剩余：562.00</view>
					</view>
				`,
			}
		},
		onReady() {
			this.show = true;
		},
		methods: {
			cancel() {
				this.closeModal();
			},
			confirm() {
				this.closeModal();
			},
			closeModal() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../libs/css/style.components.scss";
	
	.u-full-content {
		background-color: #00C777;
	}
	.list_t {
		background-color: #007AFF;
	}
	.u-update-content {
		font-size: 26rpx;
		color: $u-content-color;
		line-height: 1.7;
		padding: 30rpx;
	}
</style>
