<template>
	<view class="public">
		<a-head bgColor='#4abdb4' text="公告"></a-head>
		<u-sticky offset-top="0" fixed>
			<view class="top">
				<view class="left">
					<view class="line"></view>
					<view class="txt">
						公告列表
					</view>
				</view>
				<view class="right" @click="jump()">
					<u-icon name="plus" color="#00b2a4" size="28"></u-icon>新增公告
				</view>
			</view>
		</u-sticky>
		<view class="content">
			<mescroll-uni top="200" @down="downCallback" @up="upCallback" :up="upOption" @init='mescrollInit'>
				<uni-swipe-action>
					<uni-swipe-action-item class="swipe" v-for="(item, index) in publiclist" :key="index" :right-options="options"
					 @change="open($event, index)" @click="click($event, index)">
						<view class="list">
							<view class="title">
								{{item.title}}
							</view>
							<view class="swipetxt">
								{{item.content}}
							</view>
							<u-line color="#dbdbdb" />
							<view class="info">
								<view class="left">
									{{item.NAME}}
								</view>
								<view class="right">
									{{$u.timeFormat(item.created_time, 'yyyy-mm-dd hh:MM:ss')}}
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</mescroll-uni>
		</view>
		<view class="content" v-if="publiclist.length==0">
			<a-empty :changing="changing"></a-empty>
		</view>
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	import {
		queryBulletin,
		deleteBulletin
	} from '@/api/application.js'
	import {
		queryPublicList
	} from '@/api/public.js'
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#FF5377'
					}
				}],
				publiclist: [],
				uid: null,
				loading: true, //页面加载动画
				// 分页
				changing: true,
				mescroll: null,
				upOption: {
					textNoMore: '我也是有底线的'
				},
			}
		},
		created() {
			this.publiclist = [];
			this.uid = uni.getStorageSync("USER_ID")
		},
		onShow() {
			if (uni.getStorageSync("publicflag")) {
				uni.setStorageSync("publicflag", false);
				this.mescroll.resetUpScroll()
			}
			this.isOpenDB()
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500)
		},
		methods: {
			//打开数据库
			isOpenDB() {
				var isOpen = plus.sqlite.isOpenDatabase({
					name: 'local',
					path: '_doc/local.db'
				});
				console.log("数据库是否打开：" +!isOpen);
				if (!isOpen) {
					this.openDB()
				}
			},
			openDB() {
				openComDB('local', '_doc/local.db', res => {
					console.log("打开数据库");
				})
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			// 下拉刷新
			downCallback(mescroll) {
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
				mescroll.endErr()
			},
			// 上拉回调
			upCallback(mescroll) {
				let param = {
					size: mescroll.num,
					page: mescroll.size,
					uid: this.uid
				}
				queryPublicList(this.uid,mescroll.num,mescroll.size).then(res=>{
					if (res && res.length) {
						let totalPage = Number(res[0].total);
						if (mescroll.num == 1) this.publiclist = [];
						this.publiclist = this.publiclist.concat(res);
						this.changing = false;
						if (mescroll.num < totalPage) {
							mescroll.endUpScroll(false);
						} else {
							mescroll.endUpScroll(true);
						}
					} else {
						this.publiclist = []
						this.changing = false;
						// 隐藏下拉加载状态
						mescroll.endErr()
					}
				})
				helper.requestUrl(`${queryBulletin}`, param, 'POST', res => {
					if (res && res.length) {
						let totalPage = Number(res[0].total);
						if (mescroll.num == 1) this.publiclist = [];
						this.publiclist = this.publiclist.concat(res);
						this.changing = false;
						if (mescroll.num < totalPage) {
							mescroll.endUpScroll(false);
						} else {
							mescroll.endUpScroll(true);
						}
					} else {
						this.publiclist = []
						this.changing = false;
						// 隐藏下拉加载状态
						mescroll.endErr()
					}
				})
			},
			//左滑删除
			open(e, index) {
				this.publiclist[index].show = true;
				this.publiclist.map((val, idx) => {
					if (index != idx) this.publiclist[idx].show = false;
				})
			},
			click(e, index) {
				let param = {
					id: this.publiclist[index].id,
					uid: this.uid
				}
				helper.requesturl(`${deleteBulletin}`, param, 'POST', res => {
					this.publiclist.splice(index, 1);
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					})
					if (this.publiclist.length == 0) {
						this.mescroll.resetUpScroll()
					}
				})
			},
			//新增公告
			jump() {
				uni.navigateTo({
					url: './newpublic'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.public {
		min-height: 100vh;
		background: #f6f6f6;

		.top {
			height: 100rpx;
			line-height: 100rpx;
			background: #f6fff9;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;
			box-shadow: 0px 10rpx 10rpx rgba(0, 0, 0, 0.15);

			.left {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.line {
					width: 10rpx;
					height: 36rpx;
					border-radius: 10rpx;
					background: #666666;
					margin-right: 10rpx;
				}

				.txt {
					font-size: 30rpx;
					color: #666666;
				}
			}

			.right {
				font-size: 30rpx;
				color: #00b2a4;
			}
		}

		.content {
			padding: 20rpx 0 100rpx;
			position: relative;


			.swipe {
				margin-bottom: 10rpx;
			}

			.list {
				width: 100%;
				padding: 20rpx 30rpx;
				background: #FFFFFF;

				.title {
					width: 100%;
					line-height: 60rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					color: #333333;
					font-weight: bold;
					font-size: 30rpx;
					color: #333333;

				}

				.swipetxt {
					color: #666666;
					margin-bottom: 10rpx;
					line-height: 50rpx;
					font-size: 28rpx;
					white-space: pre-wrap;
				}

				.info {
					display: flex;
					justify-content: space-between;
					margin-top: 10rpx;

					.left,
					.right {
						font-size: 26rpx;
						color: #999999;
					}
				}
			}
		}
	}
</style>
