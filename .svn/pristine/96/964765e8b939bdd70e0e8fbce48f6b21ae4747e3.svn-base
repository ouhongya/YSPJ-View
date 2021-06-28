<template>
	<view class="head_box">
		<view class='head' :style="'background:'+bgColor">
			<view class='head_title' :style="'margin-top:'+PhoneHeight+'px;'">
				<view v-if="showBack" class="head_back" @click="back">
					<u-icon name="arrow-left" :color="backColor" size="32"></u-icon>
				</view>
				<view class="title" :style="'color:'+textColor">{{text}}</view>
			</view>
		</view>
		<view v-if="station" :style="'min-height:'+(PhoneHeight+44)+'px;height:'+headHeight">
			<image v-if="bgImage" :style="bgStyle" :src="bgImage" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	/**
	 * head 头部
	 * @description 本组件一般用于页面头部
	 * @property {Boolean} show-back 是否显示左边的返回图标(默认为true)
	 * @property {Boolean} station 是否占用高度(默认为true)
	 * @property {Boolean} height 高度(默认为true)
	 * @property {String} back-url 左边的返回图标跳转页面（默认返回上一页）
	 * @property {String} back-color 左边的返回图标颜色(默认颜色#ffffff)
	 * @property {String} text 标题名称(默认为空)
	 * @property {String} text-color 标题字体颜色（默认#ffffff,不需要背景颜色为none）
	 * @property {String} bg-color 背景颜色（默认#ffffff,不需要背景颜色为none）
	 * @property {String} bg-image 背景图片链接（有背景图片就会占用高度）
	 * @property {String} bg-style 背景图片样式(父页面自定义)
	 * @property {String} show-lead 是否展示头部导航
	 * @property {String} question 是否展示小圆点
	 * @property {String} action 是否展示小圆点
	 * @property {Boolean} active1 是否当前选中(默认为false)
	 * @example <a-head :show-back="false" :text="个人中心"></a-head>
	 */
	import app from '@/App.vue'
	export default {
		props: {
			showBack: {
				type: Boolean,
				default () {
					return true;
				}
			},
			showList: {
				type: Boolean,
				default () {
					return false;
				}
			},

			height: {
				type: String,
				default () {
					return '';
				}
			},
			backUrl: {
				type: String,
				default () {
					return '';
				}
			},
			backColor: {
				type: String,
				default () {
					return '#ffffff';
				}
			},
			station: {
				type: Boolean,
				default () {
					return true;
				}
			},
			text: {
				type: String,
				default () {
					return '';
				}
			},
			bgColor: {
				type: String,
				default () {
					return '#00b2a4';
				}
			},
			textColor: {
				type: String,
				default () {
					return '#ffffff';
				}
			},
			bgImage: {
				type: String,
				default () {
					return '';
				}
			},
			bgStyle: {
				type: String,
				default () {
					return '';
				}
			},
		},
		data() {
			return {
				headHeight: '',
				PhoneHeight: 0,
				windowHeight: 0
			}
		},
		created() {

			let that = this
			this.PhoneHeight = app.methods.getPhoneHeight()
			this.headHeight = this.height ? this.height : (this.PhoneHeight + 44) + 'px'
			this.scorllheight = this.height ? this.height : (this.PhoneHeight + 44)
			this.$emit('headHeight', this.scorllheight)
			uni.getSystemInfo({
				success(res) {
					that.windowHeight = res.windowHeight
				}
			})
		},
		methods: {
			// 返回
			back() {
				if (this.backUrl) {
					uni.navigateTo({
						url: this.backUrl
					})
				} else {
					uni.navigateBack()
				}
			},
		}
	}
</script>

<style scoped lang="less">
	// 头部
	.head_box {
		position: relative;
		z-index: 997;

		.head {
			position: fixed;
			width: 100%;
			top: 0;
			left: 0;
			z-index: 99;

			.head_title {
				height: 44px;
				padding: 0 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.title {
					width: calc(100% - 60px);
					margin: 0 auto;
					font-size: 36rpx;
					color: #FFFFFF;
					font-weight: bold;
					text-align: center;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.head_back {
					display: flex;
					align-items: center;
					width: 88rpx;
					height: 88rpx;
					position: absolute;
				}
			}
		}
	}
</style>
