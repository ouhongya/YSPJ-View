<template>
	<view class="main">
		<a-head text="考试明细" bgColor="#4abdb4"></a-head>
		<view>
			<view class="top">
				<view class="title">{{ examData.name }}</view>
				<view class="time">{{ $u.timeFormat(examData.startTime, 'yyyy-mm-dd') }}—{{ $u.timeFormat(examData.endTime, 'yyyy-mm-dd') }}</view>
			</view>
			<view class="center">
				<view class="part">总分：{{ examData.total_score }}</view>
				<view class="part">合格分：{{ examData.qualified_score }}</view>
				<view class="part">题目总数：{{ examData.size }}</view>
				<view class="part">
					已完成：
					<text>{{ examData.finish_user }}</text>
					人
				</view>
				<view class="part">
					平均分：
					<text>{{ examData.average }}</text>
				</view>
				<view class="part">
					合格率：
					<text>{{ examData.result }}%</text>
				</view>
			</view>
			<view class="bottom">
				<view class="subpart">
					<!-- 账户 -->
					<!-- 搜索 -->
					<view class="subtop">
						<view class="subsearch">
							<u-search
								placeholder="请输入姓名"
								v-model="name"
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
						<view class="subnew">
							<view class="new" @click="toPaper()">查看试卷</view>
							<view class="new" @click="results()">导出成绩</view>
						</view>
					</view>
					<!-- 表单 -->
					<view class="table-part">
						<u-table border-color="#6ecac3">
							<u-tr class="u-tr">
								<u-th class="u-th" width="20%">考生姓名</u-th>
								<u-th class="u-th" width="20%">得分</u-th>
								<u-th class="u-th" width="20%">重考次数</u-th>
								<u-th class="u-th" width="20%">是否合格</u-th>
								<u-th class="u-th">操作</u-th>
							</u-tr>
						</u-table>
					</view>
				</view>
				<view class="wrap">
					<!-- 表单 -->
					<view class="subpart">
						<view class="table-part">
							<mescroll-uni :top="0" @down="downCallback" @up="upCallback" :up="upOption" @init="mescrollInit" ref="mescrollRef" height="500px">
								<u-table v-if="list.length > 0">
									<u-tr class="u-tr" v-for="(item, index) in list" :key="index">
										<u-td class="u-td" width="20%">{{ item.name }}</u-td>
										<u-td class="u-td" width="20%" v-if="item.size > 0">{{ item.score }}</u-td>
										<u-td class="u-td" width="20%" v-if="item.size > 0">{{ item.size - 1 }}</u-td>
										<u-td class="u-td" width="20%" v-if="item.size > 0">
											<view class="action-part">
												<view :class="item.is_hash == '合格' ? 'pass' : 'fail'">{{ item.is_hash }}</view>
											</view>
										</u-td>
										<u-td class="u-td">
											<view class="action-part">
												<view class="edit" v-if="item.bad_topic > 0" @click="toMistake(item.user_id)">查看错题</view>
												<view class="edit" v-if="item.bad_topic == 0&&item.size > 0">暂无</view>
												<view class="no" v-if="item.size == 0">未作答</view>
											</view>
										</u-td>
									</u-tr>
								</u-table>
								<view class="empty" v-else><a-empty :changing="false"></a-empty></view>
							</mescroll-uni>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>
<script>
import { viewPaper, examDetailBody, examDetail, exportResults } from '@/api/exam/testbase.js';
import debounce from '@/uview-ui/libs/function/debounce.js';
export default {
	data() {
		return {
			id: null,
			mescroll: null,
			upOption: {
				noMoreSize: 5,
				textNoMore: '我也是有底线的~'
			},
			examData: {},
			loading: false,
			name: '',
			actionStyle: {
				backgroundColor: '#4abdb4',
				color: '#fff',
				margin: '0',
				width: '100rpx',
				height: '68rpx',
				lineHeight: '68rpx',
				borderRadius: '0 10rpx 10rpx 0'
			},
			mistakelock: false,
			paperlock: false,
			list: [
				{
					state: 1,
					type: 1,
					typename: '合格'
				},
				{
					state: 1,
					type: 2,
					typename: '不合格'
				},
				{
					state: 0
				}
			]
		};
	},
	created() {
		this.loading = true;
	},
	onLoad(options) {
		this.id = options.id;
		examDetail(this.id).then(res => {
			let num = parseFloat(res.finish_user);
			let total = parseFloat(res.finish_user) + parseFloat(res.unfinish_user);
			res.result = Math.round((num / total) * 10000) / 100.0;
			this.examData = res;
		});
	},
	mounted() {
		setTimeout(() => {
			this.loading = false;
		}, 200);
	},
	methods: {
		//导出数据
		results() {
			var w = plus.nativeUI.showWaiting('处理中，请等待...', {
				style: 'black',
				loading: {
					display: 'inline'
				}
			});
			exportResults(this.examData.id).then(res => {
				w.close();
				plus.nativeUI.toast(res);
			});
		},
		//初始化请求数据
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		// 上拉回调
		upCallback(mescroll) {
			examDetailBody(mescroll.num, mescroll.size, this.name, this.id).then(res => {
				if (res && res.list.length) {
					mescroll.endByPage(res.size, res.pages);
					//设置列表数据
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					let data = res.list;
					this.list = this.list.concat(data); //追加新数据
				} else {
					this.list = [];
					// 隐藏下拉加载状态
					mescroll.endErr();
				}
			});
		},
		// 下拉刷新
		downCallback(mescroll) {
			this.mescroll.resetUpScroll();
		},
		// 查看错题
		toMistake(user_id) {
			if (this.mistakelock) return;
			this.mistakelock = true;
			uni.navigateTo({
				url: './mistake?id=' + this.examData.id + '&name=' + this.examData.name + '&user_id=' + user_id
			});
			setTimeout(() => {
				this.mistakelock = false;
			}, 500);
		},
		//查看试卷
		toPaper() {
			if (this.paperlock) return;
			this.paperlock = true;
			uni.navigateTo({
				url: './paper?id=' + this.examData.id
			});
			setTimeout(() => {
				this.paperlock = false;
			}, 500);
		},
		searchInput(value) {
			let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
			setTimeout(() => {
				let endvalue = value.replace(patrn, '');
				this.name = endvalue;
				debounce(this.search(), 500);
			}, 100);
		},
		clear() {
			this.mescroll.resetUpScroll();
		},
		search() {
			this.mescroll.resetUpScroll();
		}
	}
};
</script>

<style lang="less" scoped>
page {
	background: #ffffff;
}

.main {
	padding: 30rpx 20rpx;
}

.top {
	border-bottom: 1px solid #eeeeee;

	.title {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		color: #333333;
		text-align: center;
		margin-bottom: 20rpx;
		font-size: 32rpx;
	}

	.time {
		color: #666666;
		text-align: center;
		line-height: 40rpx;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}
}

.center {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	font-size: 30rpx;
	color: #333333;
	margin: 20rpx 0;
	border-bottom: 1px solid #eeeeee;

	.part {
		width: 33%;
		margin-bottom: 20rpx;

		text {
			color: #06c1ae;
		}
	}
}

/deep/.u-content {
	border-radius: 10rpx 0 0 10rpx !important;
}

/deep/.u-subsection {
	padding: 0 10rpx !important;
	border-radius: 0 !important;
}

.wrap {
	position: relative;
}

.u-th {
	background-color: #6ecac3;
	color: #ffffff;
	padding: 10rpx 0 !important;
}

.u-td {
	padding: 20rpx 10rpx !important;
}

.subpart {
	.subtop {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0;
		background: #ffffff;
		margin-bottom: 20rpx;

		.subsearch {
			width: 100%;
			flex: 1;
		}

		.subnew {
			display: flex;
			justify-content: flex-end;

			.new {
				background-color: #4abdb4;
				color: #ffffff;
				height: 68rpx;
				line-height: 68rpx;
				border-radius: 10rpx;
				width: auto;
				padding: 0 20rpx;
				text-align: center;
				font-size: 28rpx;
				margin-left: 20rpx;
			}
		}
	}
}

.table-part {
	.action-part {
		display: flex;
		justify-content: space-around;

		.fail {
			color: #fa3534;
		}

		.pass {
			color: #00b2a4;
		}

		.edit {
			color: #2979ff;
		}

		.no {
			color: #ff9900;
		}
	}
}
</style>
