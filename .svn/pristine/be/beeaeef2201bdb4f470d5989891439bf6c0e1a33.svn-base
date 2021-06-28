<template>
	<view class="main">
		<a-head text="考试结果" bgColor='#4abdb4' :showBack="false"></a-head>
		<view class="content">
			<view class="top">
				<!-- 合格 -->
				<view class="part">
					<image src="../../static/suc1.png" mode="" class="success"></image>
					<view class="grade">
						得分:80分
					</view>
				</view>
				<!-- 不合格 -->
				<!-- <view class="part">
					<image src="../../static/fail1.png" mode="" class="fail"></image>
					<view class="grade red">
						得分:38分
					</view>
				</view> -->
			</view>
			<view class="center">
				<view class="list">
					<view class="txt">考试总分:<text>120</text></view>
				</view>
				<view class="list">
					<view class="txt">及格分数线:<text>60</text></view>
				</view>
				<view class="list">
					<view class="txt">答对题数:<text>60</text></view>
				</view>
				<view class="list">
					<view class="txt">正确率:<text>60%</text></view>
				</view>
				<view class="list">
					<view class="txt">考试用时:<text>55分43秒</text></view>
				</view>
			</view>

		</view>
		<view class="bottom">
			<view class="action">
				<u-button type="success" size="medium " @click="finish()">完成考试</u-button>
				<u-button type="warning" size="medium " @click="again()">再考一次</u-button>
				<!-- <u-button type="warning" size="medium " @click="mistake()">查看错题</u-button> -->
			</view>
		</view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>

</template>
<script>
	export default {
		data() {
			return {
				loading: false,
				jumplock: false,
				mislock: false
			}
		},
		created() {
			this.loading = true;
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 200)
		},
		methods: {
			// 完成考试
			finish() {
				if (this.jumplock) return;
				this.jumplock = true;
				if (uni.getStorageSync("functionid") == 1) {
					uni.navigateTo({
						url: '../../pages/exam/administer'
					})
				} else {
					uni.navigateTo({
						url: '../../pages/exam/center'
					})
				}
				setTimeout(() => {
					this.jumplock = false;
				}, 500)
			},
			//重考
			again() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 查看错题
			mistake() {
				if (this.mislock) return;
				this.mislock = true;

				uni.navigateTo({
					url: './mistake'
				})
				setTimeout(() => {
					this.mislock = false;
				}, 500)
			}
		},
	}
</script>

<style lang="less" scoped>
	.main {
		background: #FFFFFF;
		min-height: 100vh;
	}

	.content {
		padding: 30rpx 20rpx;
	}

	.top {
		text-align: center;
		padding: 20rpx 0;

		.part {
			padding: 0 20rpx;
			image {
				width: 460rpx;
				height: 320rpx;
			}
			.success {
				filter: drop-shadow(6rpx 6rpx 6rpx #ff8721);
			}
			.fail {
				filter: drop-shadow(6rpx 6rpx 6rpx #6c807f);
			}
		}

		.grade {
			font-size: 42rpx;
			color: #ff8721;
			letter-spacing: 6rpx;
			text-align: center;
			text-shadow: 0 0 8px #fcbd71;
		}

		.red {
			color: #6c807f !important;
			text-shadow: 0 0 8px #999999;
		}
	}

	.center {
		border-top: 1px solid #EEEEEE;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 30rpx;

		.list {
			line-height: 100rpx;
			font-size: 32rpx;
			width: 46%;

			.txt {
				color: #333333;

				text {
					color: #666666;
					margin: 0 20rpx;
				}
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		padding: 20rpx 0;
		width: 100%;
		border-top: 1px solid #EEEEEE;

		.action {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
