<template>
	<view class="recycle">
		<a-head bgColor="#4abdb4" text="回收站" @headHeight='getHeight'></a-head>
		<u-sticky :offset-top="0">
			<view class="task-state" :id="searchId">
				<!-- 搜索 -->
				<view class="subtop">
					<view class="subsearch">
						<u-search placeholder="请输入任务名称" v-model="search" shape="square" :action-style="actionStyle"
							border-color="#4abdb4" bg-color="#ffffff" @search="searchRecyle()" @custom="searchRecyle()"
							@clear="clear()" @change="replaceInput"></u-search>
					</view>
				</view>
			</view>
		</u-sticky>
		<view>
			<mescroll-uni @down="downCallback" @up="upCallback" :up="upOption" @init="mescrollInit"
				:height="wHeight+'px'">
				<view class="checktask-content">
					<uni-swipe-action>
						<uni-swipe-action-item class="swipe" v-for="(item, index) in list" :right-options="options"
							:key="index" @change="open($event, index)" @click="click($event, index)">
							<view class="swiperecycle">
								<view class="day" :class="item.abs == 1 ? 'red' : 'normal'">{{ item.abs }}天后过期</view>
								<view class="part">
									<view class="top-part">
										<view class="left">
											<view class="name">
												<view class="nametitle">{{ item.taskName }}</view>
												<view class="nameicon">
													<u-badge type="error" v-if="item.total_issue"
														:count="item.total_issue" class="badge-msg"></u-badge>
												</view>
											</view>
											<view class="detail">
												<view class="title">检查标准：</view>
												<!-- <view class="size">{{ item.normName }}</view> -->
												<view  class="sizemore" v-if="item.normName.length>2">
													<u-read-more show-height="110" :toggle="true" close-text="展开"  color="#c0c4cc" :shadow-style="shadowStyle" text-indent="0">
														<view class="size">
															<view class="sizename" v-for="(i,index1) in item.normName" :key="index1">
																<!-- 自己的 -->
																<text v-if="i.isFlag == 1" >{{i.name}}</text>	
																<!-- 下发的 -->
																<text v-if="i.isFlag == 2" class="noself">{{i.name}}</text>
															</view>
														</view>
													</u-read-more>
												</view>
												<view class="size" v-else>									
													<view class="sizename" v-for="(i,index1) in item.normName" :key="index1">
														<!-- 自己的 -->
														<text v-if="i.isFlag == 1">{{i.name}}</text>	
														<!-- 下发的 -->
														<text v-if="i.isFlag == 2" class="noself">{{i.name}}</text>
													</view>
												</view>
											</view>
											<view class="detail">
												<view class="title" v-if="item.type == 1">整改期限：</view>
												<view class="title" v-else>计划时间：</view>
												<view class="time">
													{{ $u.timeFormat(item.star_time, 'yyyy-mm-dd') }}
													<text>至</text>
													{{ $u.timeFormat(item.end_time, 'yyyy-mm-dd') }}
												</view>
											</view>
										</view>
										<view class="right">
											<view class="arrow">
												<u-icon name="arrow-right-double" color="#999999" size="32"
													v-if="item.show"></u-icon>
												<u-icon name="arrow-left-double" color="#999999" size="32" v-else>
												</u-icon>
											</view>
										</view>
									</view>
									<view class="action-part">
										<view class="left">
											<view class="company-part">
												<image src="../../static/company3.png" mode=""></image>
												<view class="company">{{ item.unitName }}</view>
											</view>
											<view class="prograss">
												<!-- 进度条后面需要展示（已检查/总检查）百分比;如下：-->
												<u-line-progress :striped="true" :percent="item.result"
													:striped-active="true" :show-percent="false"></u-line-progress><text
													class="rate">{{item.result}}%</text><text>({{item.checkItem}}/{{item.totalItem}})</text>
											</view>
										</view>
										<view class="right">
											<!--  #ECECEC未开始，#2979ff进行中,#19be6b已完成, #fa3534已延期,#ff9900延期已完成-->
											<view class="state gray" v-if="item.status==2">
												未开始
											</view>
											<view class="state blue" v-if="item.status==3">
												进行中
											</view>
											<view class="state green" v-if="item.status==4">
												已完成
											</view>
											<view class="state red" v-if="item.status==5">
												已延期
											</view>
											<view class="state yellow" v-if="item.status==6">
												延期完成
											</view>
											<view class="state green" v-if="item.status==7">
												待审核
											</view>
											<view class="state green" v-if="item.status==8">
												已完结
											</view>
											<view class="state yellow" v-if="item.status==9">
												复检
											</view>
										</view>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>

				</view>
				<view class="checktask-content" v-if="list.length==0">
					<a-empty :changing="false"></a-empty>
				</view>
			</mescroll-uni>
		</view>
		<!-- 删除弹框 -->
		<u-modal v-model="delshow" @confirm="delconfirm" :async-close="true" :show-cancel-button="true"
			:confirm-style="{ color: '#fa3534' }" ref='uModal' :show-title="false" content="您确认要删除吗？"></u-modal>

		<!-- 恢复弹框 -->
		<u-modal v-model="recovershow" @confirm="recoverconfirm" :async-close="true" :show-cancel-button="true"
			:confirm-style="{ color: '#fa3534' }" ref='uModal' :show-title="false" content="您确认要恢复吗？"></u-modal>
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		queryRecycleList,
		recoveryTask,
		removeTask,
		queryTaskRemove
	} from '@/api/aindex.js';
	import debounce from '@/uview-ui/libs/function/debounce.js';
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				options: [{
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
				],
				list: [],
				actionStyle: {
					backgroundColor: '#4abdb4',
					color: '#fff',
					margin: '0',
					width: '100rpx',
					height: '68rpx',
					lineHeight: '68rpx',
					borderRadius: '0 10rpx 10rpx 0'
				},
				//删除
				delshow: false,
				delindex: '',
				//恢复
				recovershow: false,
				recoverindex: '',
				upOption: {
					noMoreSize: 3,
					textNoMore: '我也是有底线的~'
				},
				// 分页
				mescroll: null,
				loading: false,
				search: '',
				arrow: true,
				wHeight: 600,
				headH: 44,
				searchId: this.$u.guid(),
				lockrecover: false,
				lockdel: false,
				shadowStyle: {
					backgroundImage: "none",
					paddingTop: "0",
					marginTop: "20rpx"				
				},
				
			};
		},
		created() {
			this.loading = true;
		},
		// watch: {
		// 	//防抖搜索
		// 	search(newVal, oldVal) {
		// 		if (newVal != oldVal) {
		// 			debounce(this.searchRecyle(), 500);
		// 		}
		// 	}
		// },
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500);
			setInterval(() => {
				this.queryTaskRemoves()
			}, 10000)
			this.$nextTick(() => {
				this.$uGetRect('#' + this.searchId).then(res => {
					this.wHeight = this.wHeight - res.height - 10 + 60
				})
			})
		},
		methods: {
			replaceInput(value){
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
				setTimeout(()=>{
					let endvalue=value.replace(patrn,'')
					this.search = endvalue;
					debounce(this.searchRecyle(), 500);
				},100)				
			},
			getHeight(res) {
				this.headH = res + 60;
				const {
					windowWidth,
					windowHeight
				} = uni.getSystemInfoSync();
				this.wHeight = windowHeight - this.headH
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			downCallback(mescroll) {
				this.mescroll.resetUpScroll();
			},
			// 上拉回调
			upCallback(mescroll) {
				queryRecycleList(mescroll.num, mescroll.size, this.search, uni.getStorageSync("USER_ID")).then(res => {
					if (res != null) {
						let totalPage = Number(res[0].total);
						this.mescroll.endBySize(res.length, totalPage);
						if (this.mescroll.num == 1) this.list = [];
						this.list = this.list.concat(res);
						this.selectprocessandstatus();
					} else {
						this.list = [];
						this.mescroll.endErr();
					}
				});
			},
			selectprocessandstatus() {
				let functionid = uni.getStorageSync("functionid")
			},
			open(e, index) {
				if (e === 'right') {
					this.list[index].show = true;
					this.list.map((val, idx) => {
						if (index != idx) {
							this.list[idx].show = false;
						}
					});
				} else {
					this.list.map((val, idx) => {
						this.list[idx].show = false;
					});
				}
			},
			click(e, index) {
				let {
					content
				} = e;
				if (content.text === '恢复') {
					this.recovershow = true;
					this.recoverindex = index;
				} else if (content.text === '删除') {
					this.delshow = true;
					this.delindex = index;
				}
			},
			//删除
			delconfirm() {
				if (this.lockdel) return;
				this.lockdel = true;
				removeTask(this.list[this.delindex].task_id).then(res => {
					if (res == true) {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						});
						this.delshow = false;
						this.mescroll.resetUpScroll()
						setTimeout(() => {
							this.lockdel = false;
						}, 500)
					} else {
						uni.showToast({
							title: '删除失败',
							icon: 'none'
						});
						this.delshow = false;
						setTimeout(() => {
							this.lockdel = false;
						}, 500)
					}
				})
			},
			//恢复
			recoverconfirm() {
				if (this.lockrecover) return;
				this.lockrecover = true;
				recoveryTask(this.list[this.recoverindex].task_id, this.list[this.recoverindex].status).then(res => {
					if (res == '操作成功') {
						uni.showToast({
							title: '恢复成功',
							icon: 'none'
						});
						this.recovershow = false;
						this.mescroll.resetUpScroll();
						setTimeout(() => {
							this.lockrecover = false;
						}, 500)
						uni.setStorageSync("flagtask", true);
					} else {
						uni.showToast({
							title: '恢复失败',
							icon: 'none'
						});
						this.recovershow = false;
						setTimeout(() => {
							this.lockrecover = false;
						}, 500)
					}
				})
			},
			//搜索时触发
			searchRecyle() {
				this.list = [];
				this.mescroll.resetUpScroll();
			},
			clear() {
				this.search = ''
				// this.mescroll.resetUpScroll();
			},
			//循环去查询然后删除数据
			queryTaskRemoves() {
				queryTaskRemove();
			}
		}
	};
</script>

<style lang="less" scoped>
	/deep/.u-swipe-action {
		border-radius: 20rpx;
	}

	/deep/.u-content {
		border-radius: 10rpx 0 0 10rpx !important;
	}

	/deep/.u-subsection {
		padding: 0 10rpx !important;
		border-radius: 0 !important;
	}

	.recycle {
		.task-state {
			padding: 20rpx 30rpx;
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

		.checktask-content {
			padding: 30rpx 30rpx 0 30rpx;

			.swipe {
				margin-bottom: 20rpx;
				background: #ffffff;
				width: 100%;
				border-radius: 20rpx 0 0 0;

				.swiperecycle {
					width: 100%;
				}

				.day {
					width: 200rpx;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 20rpx 0 20rpx 0;
					color: #ffffff;
					font-size: 28rpx;
					text-align: center;
					padding: 0 20rpx;
				}

				.red {
					background: #fab6b6;
				}

				.normal {
					background: #a0cfff;
				}
			}

			.part {
				background: #ffffff;
				position: relative;
				padding: 0 30rpx;

				.top-part {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 10rpx 0;

					.left {
						width: 80%;

						.name {
							color: #333333;
							font-size: 32rpx;
							margin-bottom: 10rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							position: relative;

							.nametitle {
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								padding-right: 10rpx;
							}

							.nameicon {
								width: 100rpx;
								height: 60rpx;
								position: relative;

								.badge-msg {
									right: auto !important;
									top: 0 !important;
									position: absolute;
								}
							}
						}

						.detail {
							display: flex;
							margin-bottom: 20rpx;
							line-height: 50rpx;

							.title {
								font-size: 30rpx;
								color: #333333;
								width: 150rpx;
							}
							.sizemore{
								width: 100%;
								flex: 1;
							}
							
							.size {
								color: #606266;
								font-size: 28rpx;
								width: 100%;
								flex: 1;
								display: flex;
								flex-wrap: wrap;	
								align-content: stretch;
								.sizename {
									display: block;							
									font-size: 28rpx;
									padding-right: 10rpx;
									.noself {
										color: #999999;
									}
								}		
							}

							.time {
								color: #999999;
								font-size: 28rpx;

								text {
									color: #606266;
									margin: 0 10rpx;
								}
							}
						}
					}

					.right {
						width: 100rpx;
						text-align: right;

						.name {
							width: 100%;
							flex: 1;
							font-size: 30rpx;
							color: #333333;
							overflow: hidden;
							display: -webkit-box;
							text-overflow: ellipsis;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							line-height: 50rpx;
						}

						.detail {
							width: 100%;
							display: flex;
							justify-content: space-between;
							line-height: 50rpx;

							.size {
								font-size: 28rpx;
								color: #606266;
							}

							.time {
								font-size: 24rpx;
								color: #999999;
							}
						}
					}
				}

				.action-part {
					display: flex;
					font-size: 28rpx;
					border-top: 2rpx solid #f6f6f6;
					padding-top: 30rpx;
					justify-content: space-between;
					align-items: center;

					.left {
						width: 60%;

						.company-part {
							display: flex;

							image {
								width: 50rpx;
								height: 50rpx;
								margin-right: 20rpx;
							}

							.company {
								font-size: 30rpx;
								color: #333333;
							}
						}

						.prograss {
							margin: 20rpx 0;
							display: flex;
							align-items: center;

							text {
								font-size: 24rpx;
								color: #999999;
								margin-left: 6rpx;
							}

							.rate {
								color: #19be6b;
							}
						}
					}

					.right {
						.state {
							text-align: center;
							margin-right: 20rpx;
							border-radius: 60rpx;
							color: #ffffff;
							padding: 10rpx 20rpx;
							font-size: 28rpx;
						}

						.red {
							background: #fa3534;
						}

						.yellow {
							background: #ff9900;
						}

						.blue {
							background: #2979ff;
						}

						.gray {
							background: #ececec;
						}

						.green {
							background: #18b566;
						}
					}
				}
			}
		}

		.bottom {
			position: fixed;
			width: 100%;
			background: #ffffff;
			height: 100rpx;
			line-height: 100rpx;
			box-shadow: 0 -6rpx 10rpx rgba(0, 0, 0, 0.15);
			bottom: 0;
			z-index: 99;

			.check-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx;

				.left {
					display: flex;
					color: #2979ff;
					font-size: 32rpx;
				}

				.right {
					display: flex;
					justify-content: flex-end;

					.batch {
						background: #19be6b;
						color: #ffffff;
						border-radius: 40rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						margin-right: 20rpx;
						padding: 0 20rpx;
						box-shadow: 0 6rpx 6rpx #71d5a1;
					}

					.stop {
						background: #ff9900;
						margin: 20rpx 0;
					}

					.del {
						background: #fa3534;
						box-shadow: 0 6rpx 6rpx #fab6b6;
					}
				}
			}
		}
	}
</style>
