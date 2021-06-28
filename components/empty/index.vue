<template>
	<view class="empty" :class="marginShow?'hasMargin':'noMargin'">
		<view class="changing" v-if="changing">
			<u-loading mode="flower" size="50"></u-loading><text>加载中...</text>
		</view>
		<view v-else>
			<image :src="base64" mode="" ></image>
			<view class="empty-tips">
				{{text}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			changing: {
				type: Boolean,
				default () {
					return true;
				}
			},
			text: {
				type: String,
				default () {
					return '暂无数据';
				}
			},
			marginShow: {
				type: Boolean,
				default () {
					return true;
				}
			}
		},
		data() {
			return {
				base64:"data:image/png;base64,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"

			}
		}
	}
</script>

<style lang="less" scoped>
	// 空状态
	.noMargin {
		margin: 0;
	}

	.hasMargin {
		margin: 70px 0 30px;
	}

	.empty {
		width: 100%;
		text-align: center;

		image {
			width: 180rpx;
			height: 120rpx;
		}

		.changing {
			text {
				color: #999999;
				font-size: 28rpx;
				margin-left: 6rpx;
			}
		}

		.empty-tips {
			color: #e6e6e6;
			margin-top: 10rpx;
			font-size: 28rpx;
		}
	}
</style>
