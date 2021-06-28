<template>
	<view class="main">
		<a-head text="我发布的考试" bgColor="#4abdb4"></a-head>
		<u-sticky :offset-top="0">
			<view class="task-state">
				<!-- 搜索 -->
				<view class="subtop">
					<view class="subsearch">
						<u-search
							placeholder="请输入考试名称"
							v-model="searchname"
							shape="square"
							:action-style="actionStyle"
							border-color="#4abdb4"
							bg-color="#ffffff"
							@search="search()"
							@custom="search()"
							@clear="clear()"
							@change="searchInput"
						></u-search>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="center">
			<view class="list-center">
				<mescroll-uni :top="0" @down="downCallback" @up="upCallback" :up="upOption" @init="mescrollInit" ref="mescrollRef" height="400px">
					<uni-swipe-action>
						<uni-swipe-action-item
							class="swipe"
							v-for="(item, index) in selflist"
							:right-options="item.options"
							:key="index"
							@change="open($event, index)"
							@click="click($event, index)"
						>
							<view class="list" @click="toDetail(index)">
								<view class="title">{{ item.name }}({{ item.createdTime }})</view>
								<view class="subtitle">
									考试时间:
									<text>{{ $u.timeFormat(item.startTime, 'yyyy-mm-dd') }}</text>
									至
									<text>{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}</text>
								</view>
								<view class="sublast">
									<view class="last border">
										总人数：
										<text>{{ item.totalUser }}</text>
										人
									</view>
									<view class="last border">
										已完成：
										<text>{{ item.finishUser }}</text>
										人
									</view>
									<view class="last border">
										未完成：
										<text>{{ item.unfinishUser }}</text>
										人
									</view>
									<view class="last">
										合格率：
										<text>{{ item.result }}%</text>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</mescroll-uni>
			</view>
		</view>
		<view class="empty"><a-empty :changing="false"></a-empty></view>
		<!-- 删除确认框 -->
		<u-modal
			v-model="showrightdel"
			@confirm="rightdelConfirm"
			content="您确认要删除该考试吗？"
			:show-title="false"
			:show-cancel-button="true"
			:confirm-style="{ color: '#fa3534' }"
		></u-modal>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>
<script>
import { queryExamListRoleLaunch, examStopToEnable, deleteExam } from '@/api/exam/testbase.js';
import debounce from '@/uview-ui/libs/function/debounce.js';
export default {
	data() {
		return {
			id: null,
			showrightdel: false,
			mescroll: null,
			upOption: {
				noMoreSize: 5,
				textNoMore: '我也是有底线的~'
			},
			loading: false,
			jumplock: false,
			searchname: '',
			selflist: [
				{
					show: false,
					options: [
						{
							text: '删除',
							style: {
								backgroundColor: '#fa3534'
							}
						}
					]
				},
				{
					show: false,
					options: [
						{
							text: '停考',
							style: {
								backgroundColor: '#ff9900'
							}
						}
					]
				},
				{
					show: false,
					options: [
						{
							text: '恢复',
							style: {
								backgroundColor: '#19be6b'
							}
						}
					]
				}
			],
			actionStyle: {
				backgroundColor: '#4abdb4',
				color: '#fff',
				margin: '0',
				width: '100rpx',
				height: '68rpx',
				lineHeight: '68rpx',
				borderRadius: '0 10rpx 10rpx 0'
			}
		};
	},
	created() {
		this.loading = true;
	},
	mounted() {
		setTimeout(() => {
			this.loading = false;
		}, 200);
	},
	methods: {
		//删除考试
		rightdelConfirm() {
			deleteExam(this.selflist[this.id].id).then(res => {
				this.selflist[this.id].show = false;
				this.showrightdel = false;
				uni.showToast({
					title: '删除成功',
					icon: 'none'
				});
				this.mescroll.resetUpScroll();
			});
		},
		searchInput(value) {
			let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
			setTimeout(() => {
				let endvalue = value.replace(patrn, '');
				this.standardName = endvalue;
				debounce(this.search(), 500);
			}, 100);
		},
		//初始化请求数据
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		// 上拉回调
		upCallback(mescroll) {
			queryExamListRoleLaunch(mescroll.num, mescroll.size, this.searchname).then(res => {
				if (res && res.list.length) {
					mescroll.endByPage(res.size, res.pages);
					//设置列表数据
					if (mescroll.num == 1) this.selflist = []; //如果是第一页需手动制空列表
					let data = res.list;
					data.forEach(item => {
						item.show = false;
						if (item.status == 0) {
							item.options = [
								{
									text: '停考',
									style: {
										backgroundColor: '#ff9900'
									}
								},
								{
									text: '删除',
									style: {
										backgroundColor: '#fa3534'
									}
								}
							];
						}
						if (item.status == 2) {
							item.options = [
								{
									text: '恢复',
									style: {
										backgroundColor: '#19be6b'
									}
								},
								{
									text: '删除',
									style: {
										backgroundColor: '#fa3534'
									}
								}
							];
						}
						let num = parseFloat(item.finishUser);
						let total = parseFloat(item.totalUser);
						item.result = Math.round((num / total) * 10000) / 100.0;
						item.createdTime = new Date(item.createdTime).toLocaleString();
					});
					this.selflist = this.selflist.concat(data); //追加新数据
				} else {
					this.selflist = [];
					// 隐藏下拉加载状态
					mescroll.endErr();
				}
			});
		},
		// 下拉刷新
		downCallback(mescroll) {
			this.mescroll.resetUpScroll();
		},
		//发布考试详情
		toDetail(index) {
			if (this.jumplock) return;
			this.jumplock = true;
			uni.navigateTo({
				url: './detail'
			});
			setTimeout(() => {
				this.jumplock = false;
			}, 500);
		},
		open(e, index) {
			this.selflist[index].show = true;
			this.selflist.map((val, idx) => {
				if (index != idx) this.selflist[idx].show = false;
			});
		},
		click(e, index) {
			let { content } = e;
			this.id = index;
			if (content.text === '删除') {
				this.showrightdel = true;
			}
			if (content.text === '停考') {
				examStopToEnable(this.selflist[this.id].id, 2).then(res => {
					this.mescroll.resetUpScroll();
				});
			}
			if (content.text === '恢复') {
				examStopToEnable(this.selflist[this.id].id, 0).then(res => {
					this.mescroll.resetUpScroll();
				});
			}
		},
		search() {
			this.mescroll.resetUpScroll();
		},
		clear() {
			this.mescroll.resetUpScroll();
		}
	}
};
</script>

<style lang="less" scoped>
page {
	background: #ffffff;
}

/deep/.u-content {
	border-radius: 10rpx 0 0 10rpx !important;
}

.main {
	padding: 30rpx;
}

.task-state {
	padding-bottom: 20rpx;
	background: #ffffff;

	.subtop {
		display: flex;
		justify-content: space-between;

		.subsearch {
			width: 80%;
			flex: 1;
		}

		.subnew {
			display: flex;
			justify-content: flex-end;
			margin-left: 20rpx;

			.new {
				background-color: #4abdb4;
				color: #ffffff;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 10rpx;
				width: 120rpx;
				text-align: center;
				font-size: 28rpx;
				margin-right: 20rpx;
			}

			.reset {
				background-color: #909399;
				color: #ffffff;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 10rpx;
				width: 120rpx;
				text-align: center;
				font-size: 28rpx;
			}
		}
	}
}

.list-center {
	margin-bottom: 40rpx;

	.section {
		margin-bottom: 30rpx;
	}
}

.swipe {
	margin: 20rpx 0;
}

.list {
	width: 100%;
	padding: 20rpx;
	border: 1px solid #eeeeee;
	border-radius: 10rpx 0 0 10rpx;

	.title {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		color: #333333;
		border-bottom: 1px solid #eeeeee;
		line-height: 50rpx;
		font-size: 30rpx;
	}

	.subtitle {
		color: #333333;
		padding-top: 20rpx;
		font-size: 28rpx;

		text {
			padding: 0 10rpx;
		}
	}

	.sublast {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.last {
			width: 25%;
			text-align: center;
			color: #666666;
			font-size: 24rpx;

			text {
				color: #19be6b;
			}
		}
	}

	.border {
		border-right: 1px solid #eeeeee;
	}
}
</style>
