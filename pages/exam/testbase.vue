<template>
	<view class="main">
		<a-head text="题库管理" bgColor="#4abdb4"></a-head>
		<view>
			<view class="part-top" :id='partid'>
				<view class="part color1" @click="toSubject()">
					<view class="txt">新增试题</view>
				</view>
				<view class="part color2" @click="newBase()">
					<view class="txt">新增题库</view>
				</view>
			</view>
			<view class="content">
				<!-- 折叠面板 -->
				<view class="collapsePart">
					<mescroll-uni :top="0" @down="downCallback" @up="upCallback" :up="upOption" @init="mescrollInit"
						ref="mescrollRef" :height="wHeight+'px'">
						<uni-swipe-action>
							<uni-swipe-action-item class="swipe" v-for="(item, index) in collapseList"
								:right-options="item.options" :key="index" @change="open($event, index)"
								@click="click($event, index)">
								<view class="u-collapse-item">
									<view :hover-stay-time="200" class="u-collapse-head" @tap="headClick(index)">
										<view class="u-icon-wrap">
											<u-icon :class="{ 'u-arrow-down-icon-active': item.isShow }"
												class="u-arrow-down-icon" name="arrow-down"></u-icon>
										</view>
										<view class="u-collapse-title">{{ item.name }} ({{ item.count }})</view>
									</view>
									<view class="u-collapse-body" v-if="item.isShow">
										<view class="u-collapse-content">
											<view class="lead">
												<u-subsection :list="item.listpart" :current="item.curNow"
													@change="sectionChange(index)" active-color="#4abdb4"
													inactive-color="#999999"></u-subsection>
											</view>
											<view class="" v-if="item.listpart[item.curNow].list.length>0">
												<view class="center"
													v-for="(i, index1) in item.listpart[item.curNow].list"
													:key="index1">
													<view class="list-center" v-if="item.curNow == 0">
														<view class="left">
															<image src="../../static/excel11.png" mode=""></image>
														</view>
														<view class="right">
															<view class="title">{{ i.title }}</view>
															<view class="sub-title">
																<view class="sub1">
																	单选:
																	<text>{{ i.radio }}</text>
																</view>
																<view class="sub1">
																	多选:
																	<text>{{ i.checkbox }}</text>
																</view>
																<view class="sub1">
																	判断:
																	<text>{{ i.judge }}</text>
																</view>
															</view>
															<view class="sub-title">
																<view class="sub">
																	<image src="../../static/person.png" mode="">
																	</image>
																	<text>{{ i.name }}</text>
																</view>
																<view class="sub">
																	<image src="../../static/time.png" mode=""></image>
																	<text>{{ $u.timeFormat(i.created_time, 'yyyy-mm-dd hh:MM') }}</text>
																</view>
															</view>
															<view class="action-part" v-if="i.isFlag == 1">
																<view class="action stop"
																	@click="stop(item.id, i.id, 2)"
																	v-if="i.status == 0">停用</view>
																<view class="action start"
																	@click="stop(item.id, i.id, 0)"
																	v-if="i.status == 2">启用</view>
																<view class="action del"
																	@click="stop(item.id, i.id, 1)">删除
																</view>
															</view>
														</view>
													</view>
													<view class="list-center" v-if="item.curNow == 1"
														@click="editSubject(index, index1, i.id,i.isFlag)">
														<!--  i.isFlag 1是自己的2是别的人-->
														<view class="sigle-right">
															<view class="title">
																<u-tag :text=" i.typename" shape="circleLeft" size="mini"  mode="plain" border-color="#4abdb4" color="#4abdb4"/>
																<text>{{ index1 + 1 }}.</text>
																<text>{{ i.title }}</text>
															</view>
															<view class="sub-single">
																
																<view class="left">
																	<view class="sub">
																		<image src="../../static/person.png" mode="">
																		</image>
																		<text>{{ i.name }}</text>
																	</view>
																	<view class="sub">
																		<image src="../../static/time.png" mode=""></image>
																		<text>{{ $u.timeFormat(i.created_time, 'yyyy-mm-dd hh:MM') }}</text>
																	</view>
																</view>
																<view class="action-part" v-if="i.isFlag == 1">
																	<view class="action del"
																		@click.stop="singledel()">删除
																	</view>
																</view>
															</view>
															
															
														</view>
														
													</view>
												</view>

											</view>
											<view class="empty" v-else>
												<a-empty :changing="false"></a-empty>
											</view>

										</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
						<view class="empty" v-if="collapseList.length==0">
							<a-empty :changing="false"></a-empty>
						</view>
					</mescroll-uni>
				</view>
			</view>
		</view>
		<!-- 删除确认框 -->
		<u-modal v-model="showrightdel" @confirm="rightdelConfirm" content="您确认要删除该题库吗？" :show-title="false"
			:show-cancel-button="true" :confirm-style="{ color: '#fa3534' }"></u-modal>
			
			<u-modal v-model="showexceldel" @confirm="exceldelConfirm" content="您确认要删除吗？" :show-title="false"
				:show-cancel-button="true" :confirm-style="{ color: '#fa3534' }"></u-modal>
				<u-modal v-model="showsingledel" @confirm="singledelConfirm" content="您确认要删除该题吗？" :show-title="false"
					:show-cancel-button="true" :confirm-style="{ color: '#fa3534' }"></u-modal>

		<!-- 新增题库 -->
		<u-modal v-model="showBase" @confirm="newConfirm" ref="uModal" :async-close="true" :show-cancel-button="true"
			:confirm-style="{ color: '#4abdb4' }" :show-title="false">
			<view class="slot-content">
				<view class="model">
					<view class="rename">
						<u-input v-model="basename" type="text" :border="true" placeholder="请输入题库名称" />
					</view>
					<view class="tips">名称长度范围为2-20个字符，请勿输入特殊符号</view>
				</view>
			</view>
		</u-modal>
		
		<!-- 重命名题库 -->
		<u-modal v-model="showBaseRemark" @confirm="remkarkConfirm" ref="uModal" :async-close="true"
			:show-cancel-button="true" :confirm-style="{ color: '#4abdb4' }" :show-title="false">
			<view class="slot-content">
				<view class="model">
					<view class="rename">
						<u-input v-model="basename" type="text" :border="true" placeholder="请输入题库名称" />
					</view>
					<view class="tips">名称长度范围为2-20个字符，请勿输入特殊符号</view>
				</view>
			</view>
		</u-modal>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>
<script>
	import {
		queryQuestionBankList,
		addQuestionBank,
		deleteQuestionBank,
		statusQuestionBank,
		queryBankDetail,
		updateExcelStatus,
		remarkQuestionBank,
		updateOneTopicStatus
	} from '@/api/exam/testbase.js';
	import debounce from '@/uview-ui/libs/function/debounce.js';
	export default {
		data() {
			return {
				lodName: null,
				type: null,
				id: null,
				mescroll: null,
				upOption: {
					noMoreSize: 5,
					textNoMore: '我也是有底线的~'
				},
				loading: false,
				showrightdel: false,
				rightdelIndex: 0,
				editlock: false,
				subjectlock: false,
				showBase: false,
				showBaseRemark: false,
				basename: '',
				wHeight: 600,
				partid: this.$u.guid(),
				showsingledel:false,
				showexceldel:false,
				collapseList: []
			};
		},
		created() {
			this.loading = true;
		},
		onLoad(option) {
			if (option.id != undefined) {
				this.id = option.id;
				this.type = option.type;
			}
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 200);
			this.$nextTick(() => {
				this.$uGetRect('#' + this.partid).then(res => {
					this.wHeight = this.wHeight - res.height - 10+60 
				})
			})
		},
		methods: {
			// 单个题目删除
			singledel(){
				this.showsingledel=true
			},
			singledelConfirm(){
				this.showsingledel=false
			},
			exceldelConfirm(){
				
			},
			stop(bankId, categoryId, status) {
				updateExcelStatus(bankId, categoryId, status).then(res => {
					this.collapseList.forEach(item => {
						if (item.id == bankId) {
							if (status != 1) {
								item.listpart[0].list.forEach(entry => {
									if (entry.id == categoryId) {
										entry.status = status;
									}
								});
								//启用时,同时启用题库
								if (status == 0 && item.status == 2 && item.isFlag == 1) {
									item.options.unshift({
										text: '停用',
										style: {
											backgroundColor: '#ff9900'
										}
									});
									item.options.unshift({
										text: '重命名',
										style: {
											backgroundColor: '#38EEDC'
										}
									});
									item.options.unshift({
										text: '默认题库',
										style: {
											backgroundColor: '#67C23A'
										}
									});
									for (var i = item.options.length - 1; i >= 0; i--) {
										if (item.options[i].text == "启用") {
											item.options.splice(i, 1);
										}
									}
								}
							} else {
								//减值
								let count = 0;
								item.listpart[0].list.forEach(entry => {
									if (entry.id == categoryId) {
										count += entry.radio;
										count += entry.checkbox;
										count += entry.judge;
									}
								});
								item.listpart[0].count = item.listpart[0].count - count;
								let num = item.listpart[0].name.substring(item.listpart[0].name.indexOf(
									'(') + 1, item.listpart[0].name.indexOf(')'));
								var a = item.listpart[0].name.split(num).join('');
								let newCount = num - count;
								item.listpart[0].name = a.slice(0, item.listpart[0].name.indexOf('(') +
									1) + newCount + a.slice(item.listpart[0].name.indexOf('(') + 1);
								//修改题库模板
								item.count -= count;
								for (var i = item.listpart[0].list.length - 1; i >= 0; i--) {
									if (item.listpart[0].list[i].id == categoryId) {
										item.listpart[0].list.splice(i, 1);
									}
								}
							}
						}
					});
					this.$forceUpdate();
				});
			},
			//初始化请求数据
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			// 下拉刷新
			downCallback(mescroll) {
				this.mescroll.resetUpScroll();
			},
			// 上拉回调
			upCallback(mescroll) {
				queryQuestionBankList(mescroll.num, mescroll.size, this.id).then(res => {
					if (res && res.list.length) {
						mescroll.endByPage(res.size, res.pages);
						//设置列表数据
						if (mescroll.num == 1) this.collapseList = []; //如果是第一页需手动制空列表
						let isShow = '';
						let curNow = '';
						if (!this.id) {
							isShow = false;
							curNow = 0;
						} else {
							isShow = true;
							if (this.type == '1') {
								curNow = 1;
							} else {
								curNow = 0;
							}
						}
						res.list.forEach(item => {
							item.isShow = isShow;
							item.show = false;
							item.curNow = curNow;
							if (item.isFlag == 1) {
								if (item.is_default == 0) {
									item.options = [{
										text: '删除',
										style: {
											backgroundColor: '#fa3534'
										}
									}];
									if (item.status == 0) {
										item.options.unshift({
											text: '停用',
											style: {
												backgroundColor: '#ff9900'
											}
										});
										item.options.unshift({
											text: '重命名',
											style: {
												backgroundColor: '#38EEDC'
											}
										});
										item.options.unshift({
											text: '默认题库',
											style: {
												backgroundColor: '#67C23A'
											}
										});
									} else {
										item.options.unshift({
											text: '启用',
											style: {
												backgroundColor: '#409EFF'
											}
										});
									}
								}
							} else {
								item.options = [];
							}
						});
						this.collapseList = this.collapseList.concat(res.list); //追加新数据
						this.id = '';
					} else {
						this.collapseList = [];
						// 隐藏下拉加载状态
						mescroll.endErr();
					}
				});
			},
			//新增试题
			toSubject() {
				if (this.subjectlock) return;
				this.subjectlock = true;
				uni.navigateTo({
					url: './subject'
				});
				setTimeout(() => {
					this.subjectlock = false;
				}, 500);
			},
			newBase(){
				this.showBase=true
			},
			//新增题库确认
			newConfirm() {
				addQuestionBank(this.basename).then(res => {
					if (res == 'SUCCESS') {
						this.basename = '';
						this.mescroll.resetUpScroll();
						this.showBase = false;
					} else {
						this.$refs.uToast.show({
							title: '题库名称重复',
							type: 'warning'
						});
						this.$refs.uModal.clearLoading();
					}
				});
			},
			//重命名题库确认
			remkarkConfirm() {
				if (this.lodName == this.basename) {
					this.basename = '';
					this.showBaseRemark = false;
					this.mescroll.resetUpScroll();
				} else {
					remarkQuestionBank(this.collapseList[this.rightdelIndex].id, this.basename).then(res => {
						if (res == 'SUCCESS') {
							this.basename = '';
							this.mescroll.resetUpScroll();
							this.showBaseRemark = false;
						} else {
							this.$refs.uToast.show({
								title: '题库名称重复',
								type: 'warning'
							});
							this.$refs.uModal.clearLoading();
						}
					});
				}
			},
			async headClick(index) {
				await queryBankDetail(this.collapseList[index].id).then(res => {
					let data = [];
					let count = 0;
					res.bankList.forEach(item => {
						count += item.radio;
						count += item.checkbox;
						count += item.judge;
					});
					data.push({
						name: '批量录入 ' + '(' + count + ')',
						type: 1,
						count: count,
						list: res.bankList
					});
					let arr = [];
					res.oneList.forEach(item => {
						let typename = '';
						if (item.type == 1) {
							typename = '单选题';
						} else if (item.type == 2) {
							typename = '多选题';
						} else {
							typename = '判断题';
						}
						arr.push({
							id: item.id,
							title: item.stem,
							created_time: item.created_time,
							typename: typename,
							name: item.name,
							isFlag: item.isFlag
						});
					});
					data.push({
						name: '单个录入 ' + '(' + arr.length + ')',
						type: 2,
						count: arr.length,
						list: arr
					});
					this.collapseList[index].isShow = !this.collapseList[index].isShow;
					this.collapseList.map((e, idx) => {
						if (idx != index) {
							e.isShow = false;
						} else {
							e.listpart = data;
						}
					});
				});
			},
			sectionChange(index) {
				if (this.collapseList[index].curNow == 0) {
					this.collapseList[index].curNow = 1;
				} else if (this.collapseList[index].curNow == 1) {
					this.collapseList[index].curNow = 0;
				}
			},
			open(e, index) {
				this.collapseList[index].show = true;
				this.collapseList.map((val, idx) => {
					if (index != idx) this.collapseList[idx].show = false;
				});
			},
			click(e, index) {
				let {
					content
				} = e;
				if (content.text === '删除') {
					this.rightdelIndex = index;
					this.showrightdel = true;
				}
				if (content.text === '重命名') {
					this.rightdelIndex = index;
					this.lodName = this.collapseList[index].name;
					this.basename = this.collapseList[index].name;
					this.showBaseRemark = true;
				}
				if (content.text === '停用' || content.text === '启用') {
					let data = this.collapseList[index];
					let status = data.status == 0 ? 2 : 0;
					statusQuestionBank(this.collapseList[index].id, status).then(res => {
						this.mescroll.resetUpScroll();
					});
				}
				if (content.text === '默认题库') {
					statusQuestionBank(this.collapseList[index].id, 666).then(res => {
						this.mescroll.resetUpScroll();
					});
				}
			},
			rightdelConfirm() {
				deleteQuestionBank(this.collapseList[this.rightdelIndex].id).then(res => {
					this.collapseList[this.rightdelIndex].show = false;
					this.collapseList.splice(this.rightdelIndex, 1);
					this.showrightdel = false;
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					});
					this.mescroll.resetUpScroll();
				});
			},
			editSubject(index, index1, id, isFlag) {
				if (this.editlock) return;
				this.editlock = true;
				uni.navigateTo({
					url: './edit?id=' + id + '&isFlag=' + isFlag
				});
				setTimeout(() => {
					this.editlock = false;
				}, 500);
			}
		}
	};
</script>

<style lang="less" scoped>
	page {
		background: #ffffff;
	}

	.main {
		padding: 30rpx;
		background: #FFFFFF;
		min-height: calc(100vh - 60rpx);
	}

	.model {
		padding: 30rpx;

		.rename {
			margin: 20rpx 0;
		}

		.stop {
			font-size: #333333;
			line-height: 50rpx;
			font-size: 32rpx;
			margin: 20rpx 0;
		}

		.tips {
			font-size: 28rpx;
			color: #999999;
		}
	}

	.part-top {
		padding: 30rpx 0 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;

		.part {
			width: 45%;
			text-align: center;
			border-radius: 10rpx;
			height: 70rpx;
			line-height: 70rpx;
			background: #f6fff9;
			box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
			margin-bottom: 40rpx;

			.txt {
				font-size: 30rpx;
				color: #ffffff;
				letter-spacing: 3px;
			}
		}

		.color1 {
			background: linear-gradient(to right, #ba6cfd, #ab33f1);
		}

		.color2 {
			background: linear-gradient(to right, #50e299, #19be6b);
		}
	}

	/deep/.u-subsection {
		padding: 0 3px !important;
	}

	.content {
		border: 1px solid #eeeeee;
		padding: 0 20rpx;

		.collapsePart {
			.u-collapse-item {
				width: 100%;
			}

			.u-collapse-head {
				display: flex;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				line-height: 1;
				padding: 10rpx 20rpx 10rpx 6rpx;
				border-bottom: 2rpx solid #f6f6f6;
			}

			.u-collapse-title {
				line-height: 60rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.u-arrow-down-icon {
				transition: all 0.3s;
				padding-right: 20rpx;
				padding-left: 14rpx;
			}

			.u-arrow-down-icon-active {
				transform: rotate(180deg);
				transform-origin: center center;
			}

			.u-collapse-body {
				transition: all 0.3s;
			}

			.u-collapse-content {
				padding: 20rpx 0;

				.center {
					.list-center {
						display: flex;
						border: 1px solid #eeeeee;
						padding: 20rpx;
						margin: 10rpx 0 20rpx;
						border-radius: 10rpx;

						.sigle-right {
							flex: 1;
							
							.title {
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								word-break: break-all;
								color: #333333;
								line-height: 40rpx;
								font-size: 28rpx;

								text {
									margin: 0 10rpx;
								}
							}
							.sub-single{
								display: flex;
								justify-content: space-between;
								align-items: center;
								padding-top: 20rpx;
								.action-part {
									display: flex;
									justify-content: flex-end;
									align-items: center;
									
								
									.action {
										width: 100rpx;
										height: 50rpx;
										line-height: 50rpx;
										text-align: center;
										font-size: 28rpx;
										border-radius: 10rpx;
										margin-left: 20rpx;
										border: 1px solid #eeeeee;
									}
								
								
									.del {
										color: #fa3534;
									}
								}
								
								.left {
										display: flex;
										color: #666666;
										font-size: 28rpx;
										padding: 10rpx 0;
								
										.sub {
											display: flex;
											align-items: center;
								
											image {
												width: 30rpx;
												height: 30rpx;
												margin-right: 6rpx;
											}
								
											
											padding-right: 20rpx;
								
											text {
												margin: 0 6rpx;
											}
										}
								
									}
							
							
							}
						}
					}

					.left {
						padding-top: 60rpx;

						image {
							width: 100rpx;
							height: 100rpx;
							padding-right: 20rpx;
						}
					}

					.right {
						width: 100%;
						flex: 1;

						.title {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							word-break: break-all;
							color: #333333;
							line-height: 50rpx;
							font-size: 30rpx;
						}

						.sub-title {
							display: flex;
							color: #666666;
							font-size: 28rpx;
							padding: 10rpx 0;

							.sub {
								display: flex;
								align-items: center;
							

								image {
									width: 30rpx;
									height: 30rpx;
									margin-right: 6rpx;
								}

								padding-right: 20rpx;

								text {
									margin: 0 6rpx;
								}
							}

							.sub1 {
								margin-right: 30rpx;

								text {
									margin: 0 6rpx;
								}
							}
						}
					}

					.action-part {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						margin-top: 20rpx;

						.action {
							width: 100rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							font-size: 28rpx;
							border-radius: 10rpx;
							margin-left: 20rpx;
							border: 1px solid #eeeeee;
						}

						.stop {
							color: #ff9900;
						}

						.start {
							color: #19be6b;
						}

						.del {
							color: #fa3534;
						}
					}
				}
			}
		}
	}
</style>
