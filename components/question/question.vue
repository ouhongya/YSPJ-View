<template>
	<view class="problem">
		<u-sticky :offset-top="offset">
			<view>
				<u-tabs :list="sublist" :is-scroll="false" disabled="true" :current="curNow" @change="sectionChange" active-color="#6ecac3" bg-color="#f6fff9" height="90"></u-tabs>
				<view class="subtop">
					<view class="subsearch">
						<u-search
							placeholder="请输入关键字"
							v-model="searchName"
							shape="square"
							:action-style="actionStyle"
							border-color="#4abdb4"
							bg-color="#ffffff"
							@search="search()"
							@custom="search()"
							@clear="clear()"
							@change="replaceInput"
						></u-search>
					</view>
					<view class="subnew"><view class="new" @click="quicksearch()">快捷筛选</view></view>
				</view>
			</view>
		</u-sticky>

		<swiper :style="{ height: subHeight - 40 + 'px' }" :current="subIndex" @change="swiperChange">
			<swiper-item>
				<view class="problemList">
					<mescroll-uni :down="downOption" @init="mescrollInit0" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scrollfun">
						<view class="collapsePart">
							<view class="u-collapse-item" v-for="(item, index) in tab0.collapseList" :key="index">
								<view :hover-stay-time="200" class="u-collapse-head">
									<view class="problemTitle" @tap="headClick(index, 0)">
										<view class="left">
											<view class="line"></view>
											<view class="left-part">
												<view class="name">
													<view class="nameleft">
														<view class="nametitle">{{ item.taskName }}</view>
														<view class="nameicon"><u-badge type="error" :count="item.count" class="badge-msg"></u-badge></view>
													</view>
												</view>
												<view class="detail">{{ item.unitName }}</view>
											</view>
										</view>
										<view class="right" :class="ipadFlag ? 'wrap' : ''">
											<image src="../../static/out.png" mode="" @click.stop="exportTaskIssue(item.taskName, item.task_id)"></image>
											<view class="state gray" v-if="item.status == 2">未开始</view>
											<view class="state blue" v-if="item.status == 3">进行中</view>
											<view class="state green" v-if="item.status == 4">已完成</view>
											<view class="state red" v-if="item.status == 5">已延期</view>
											<view class="state yellow" v-if="item.status == 6">延期完成</view>
											<view class="state yellow" v-if="item.status == 7">待审核</view>
											<view class="state green" v-if="item.status == 8">已完结</view>
											<view class="state yellow" v-if="item.status == 9">复检</view>
											<view class="u-icon-wrap">
												<u-icon v-if="arrow" :class="{ 'u-arrow-down-icon-active': item.isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon>
											</view>
										</view>
									</view>
								</view>
								<view class="u-collapse-body" v-if="item.isShow && item.child && item.child.length">
									<view class="u-collapse-content">
										<view class="scorll-content">
											<scroll-view class="scroll-view_H" scroll-x="true">
												<view class="top">
													<view class="scorll-th"><view class="srorll-title">项目序号</view></view>
													<view class="scorll-th"><view class="srorll-title">问题性质</view></view>
													<view class="scorll-th detail"><view class="srorll-title">检查单位</view></view>
													<view class="scorll-th detail"><view class="srorll-title">评判项目</view></view>
													<view class="scorll-th"><view class="srorll-title">标准</view></view>
													<view class="scorll-th"><view class="srorll-title">负责人</view></view>
													<view class="scorll-th detail"><view class="srorll-title">问题信息</view></view>
													<view class="scorll-th"><view class="srorll-title">扣分</view></view>
													<view class="scorll-th pic"><view class="srorll-title">问题图片</view></view>
													<view class="scorll-th detail"><view class="srorll-title">问题备注</view></view>
													<view class="scorll-th detail"><view class="srorll-title">记录时间</view></view>
												</view>
												<view v-for="(entry, index1) in item.child" :key="index1" class="tableheight">
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.serial }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.status == 0 ? '一般' : '严重' }}</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td detail">
															<view class="content">{{ entry.unitName }}</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content">{{ entry.item }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.normName }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.username }}</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content">{{ entry.content }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">- {{ entry.score }}</view>
														</view>
													</view>
													<view class="scorll-th pic">
														<view class="scorll-td">
															<view class="content">
																<view class="imgpart" v-if="entry.issueImage.length != 0">
																	<u-swiper :list="entry.issueImage" @click="previewImage(entry.issueImage)"></u-swiper>
																</view>
																<view class="imgpart" v-else><view class="empty-tips">暂无图片</view></view>
															</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content" v-if="entry.remark">{{ entry.remark }}</view>
															<view class="content" v-else><view class="empty-tips">暂无备注</view></view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content">{{ $u.timeFormat(entry.checkTime, 'yyyy-mm-dd hh:MM') }}</view>
														</view>
													</view>
												</view>
											</scroll-view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="collapsePart" v-if="tab0.collapseList == 0"><a-empty :changing="false"></a-empty></view>
					</mescroll-uni>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="problemList">
					<mescroll-uni :down="downOption" @init="mescrollInit1" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scrollfun">
						<view class="collapsePart">
							<view class="u-collapse-item" v-for="(item, index) in tab1.collapseList" :key="index">
								<view :hover-stay-time="200" class="u-collapse-head">
									<view class="problemTitle" @tap="headClick(index, 1)">
										<view class="left">
											<view class="line"></view>
											<view class="left-part">
												<view class="name">
													<view class="nameleft">
														<view class="nametitle">{{ item.taskName }}</view>
														<view class="nameicon"><u-badge type="error" :count="item.count" class="badge-msg"></u-badge></view>
													</view>
												</view>
												<view class="detail">{{ item.unitName }}</view>
											</view>
										</view>
										<view class="right" :class="ipadFlag ? 'wrap' : ''">
											<image src="../../static/out.png" mode="" @click.stop="exportTaskIssue(item.taskName, item.task_id)"></image>
											<view class="state gray" v-if="item.status == 2">未开始</view>
											<view class="state blue" v-if="item.status == 3">进行中</view>
											<view class="state green" v-if="item.status == 4">已完成</view>
											<view class="state red" v-if="item.status == 5">已延期</view>
											<view class="state yellow" v-if="item.status == 6">延期完成</view>
											<view class="state green" v-if="item.status == 7">待审核</view>
											<view class="state green" v-if="item.status == 8">已完结</view>
											<view class="state yellow" v-if="item.status == 9">复检</view>
											<view class="u-icon-wrap">
												<u-icon v-if="arrow" :class="{ 'u-arrow-down-icon-active': item.isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon>
											</view>
										</view>
									</view>
								</view>
								<view class="u-collapse-body" v-if="item.isShow && item.child && item.child.length">
									<view class="u-collapse-content">
										<view class="scorll-content">
											<scroll-view class="scroll-view_H" scroll-x="true">
												<view class="top">
													<view class="scorll-th"><view class="srorll-title">项目序号</view></view>
													<view class="scorll-th"><view class="srorll-title">问题性质</view></view>
													<view class="scorll-th detail"><view class="srorll-title">检查单位</view></view>
													<view class="scorll-th detail"><view class="srorll-title">评判项目</view></view>
													<view class="scorll-th"><view class="srorll-title">标准</view></view>
													<view class="scorll-th"><view class="srorll-title">负责人</view></view>
													<view class="scorll-th detail"><view class="srorll-title">问题信息</view></view>
													<view class="scorll-th"><view class="srorll-title">扣分</view></view>
													<view class="scorll-th pic"><view class="srorll-title">问题图片</view></view>
													<view class="scorll-th detail"><view class="srorll-title">问题备注</view></view>
													<!-- <view class="scorll-th detail"><view class="srorll-title">记录时间</view></view> -->
													<view class="scorll-th detail" v-if="item.type == 2"><view class="srorll-title">整改措施</view></view>
													<view class="scorll-th pic" v-if="item.type == 2"><view class="srorll-title">整改图片</view></view>
													<view class="scorll-th detail" v-if="item.type == 2"><view class="srorll-title">整改备注</view></view>
													<view class="scorll-th" v-if="item.type == 2"><view class="srorll-title">整改时间</view></view>
												</view>
												<view v-for="(entry, index1) in item.child" :key="index1" class="tableheight">
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.serial }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.status == 0 ? '一般' : '严重' }}</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td detail">
															<view class="content">{{ entry.unitName }}</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content">{{ entry.item }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.normName }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content">{{ entry.username }}</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content">{{ entry.content }}</view>
														</view>
													</view>
													<view class="scorll-th">
														<view class="scorll-td">
															<view class="content"> - {{ entry.score }}</view>
														</view>
													</view>
													<view class="scorll-th pic">
														<view class="scorll-td">
															<view class="content">
																<view class="imgpart" v-if="entry.issueImage.length != 0">
																	<u-swiper :list="entry.issueImage" @click="previewImage(entry.issueImage)"></u-swiper>
																</view>
																<view class="imgpart" v-else><view class="empty-tips">暂无图片</view></view>
															</view>
														</view>
													</view>
													<view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content" v-if="entry.remark">{{ entry.remark }}</view>
															<view class="content" v-else><view class="empty-tips">暂无备注</view></view>
														</view>
													</view>
													<!-- <view class="scorll-th detail">
														<view class="scorll-td">
															<view class="content">{{ $u.timeFormat(entry.checkTime, 'yyyy-mm-dd hh:MM') }}</view>
														</view>
													</view> -->
													<view class="scorll-th detail" v-if="item.type == 2">
														<view class="scorll-td">
															<view class="content">{{ entry.rectifyMes }}</view>
														</view>
													</view>
													<view class="scorll-th pic" v-if="item.type == 2">
														<view class="scorll-td">
															<view class="content">
																<view class="imgpart" v-if="entry.rectifyImage.length != 0">
																	<u-swiper :list="entry.rectifyImage" @click="previewImage(entry.rectifyImage)"></u-swiper>
																</view>
																<view class="imgpart" v-else><view class="empty-tips">暂无图片</view></view>
															</view>
														</view>
													</view>
													<view class="scorll-th detail" v-if="item.type == 2">
														<view class="scorll-td">
															<view class="content" v-if="entry.rectifyRemark">{{ entry.rectifyRemark }}</view>
															<view class="content" v-else><view class="empty-tips">暂无备注</view></view>
														</view>
													</view>
													<view class="scorll-th" v-if="item.type == 2">
														<view class="scorll-td">
															<view class="content" v-if="entry.rectifyTime!=null">{{ $u.timeFormat(entry.rectifyTime, 'yyyy-mm-dd hh:MM') }}</view>
															<view class="content" v-if="entry.rectifyTime==null"><view class="empty-tips">暂无时间</view></view>
														</view>
													</view>
												</view>
											</scroll-view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="collapsePart" v-if="tab1.collapseList == 0"><a-empty :changing="false"></a-empty></view>
					</mescroll-uni>
				</view>
			</swiper-item>
		</swiper>
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="navshow" :mode="curMode" width="40%" height="80%" @close="close()">
				<view class="roleModel">
					<view class="roleTop">筛选</view>
					<view class="nav">
						<view class="navleft">
							<view class="navitem" v-for="(item, index) in navlist" :key="index" :class="item.active ? 'active' : ''" @click="navChange(index)">
								{{ item.name }}
							</view>
						</view>
						<view class="navright">
							<view class="navpart" v-for="(item, index) in navlist" :key="index" :class="item.active ? 'active' : ''" v-if="item.active">
								<view class="navcontent">
									<view class="all">
										<u-checkbox-group @change="checkedAll(index)" icon-size="40" size="44">
											<u-checkbox v-model="item.listchoose" active-color="#4abdb4" label-size="30">{{ item.listname }}</u-checkbox>
										</u-checkbox-group>
									</view>
									<view class="part">
										<scroll-view scroll-y :class="ipadFlag ? 'ipadH' : 'normalH'">
											<u-checkbox-group @change="checkboxGroupChange" :wrap="true" icon-size="36" size="40">
												<u-checkbox @change="checkboxChange" v-model="i.checked" v-for="(i,index2) in item.list" :key="index2" :name="i.name" active-color="#4abdb4">
													{{ i.name }}
													<text v-if="i.type == 2" class="gray">(本地)</text>
												</u-checkbox>
											</u-checkbox-group>
											<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="item.list.length > 10" />
										</scroll-view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="reset()">重置</view>
						<view class="sure" @click="sure()">确定</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
var timer; //判断页面滚动
import debounce from '@/uview-ui/libs/function/debounce.js';
import { queryQuestionList, exportProblem, queryUserToCondition, quertTaskIssueList } from '@/api/question.js';
import { importUserToTask } from '@/api/importExcel.js';
export default {
	props: {
		offset: {
			type: Number,
			default: 0
		},
		subHeight: {
			type: Number,
			default: 0
		},
		curMode: {
			type: String,
			default: 'bottom'
		}
	},
	data() {
		return {
			actionStyle: {
				backgroundColor: '#4abdb4',
				color: '#fff',
				margin: '0',
				width: '100rpx',
				height: '68rpx',
				lineHeight: '68rpx',
				borderRadius: '0 10rpx 10rpx 0'
			},
			searchName: '',
			navlist: [],
			navindex: 0,
			navshow: false,
			headTitle: '问题明细',
			themeColor: '#4abdb4',
			titleColor: '#666666',
			old: {
				scrollTop: 0,
				isScrollUp: false
			},
			//触摸弹窗坐标及状态
			touchDotX: 0,
			touchDotY: 0,
			touchMoveX: 0,
			touchMoveY: 0,
			time: 0,
			interval: 0,
			// 头部导航
			curNow: 0, //当前选中
			subIndex: 0, //当前选中内容
			sublist: [
				{
					name: '检查'
				},
				{
					name: '整改'
				}
			],
			functionId: 0,
			uid: null,
			// 分页
			downOption: {
				auto: true //是否在初始化后,自动执行下拉回调callback; 默认true
			},
			upOption: {
				onScroll: true,
				auto: false,
				noMoreSize: 5,
				textNoMore: '我也是有底线的~',
				offset: 300
			},
			arrow: true, //显示箭头
			tab0: {
				mescroll: null,
				isListInit: false,
				scrollY: 0,
				collapseList: []
			},
			changing0: true,
			tab1: {
				mescroll: null,
				isListInit: false,
				scrollY: 0,
				collapseList: []
			},
			changing1: true,
			ipadFlag: false, //平板端搜索框样式
			isFlag: false, //搜索栏的点击状态
			isStatus: false, //搜索栏的点击状态
			clickindex: 0,
			filter: '',
			initFlag: false ,//初始化数据
			navlist0:[],//搜索数据初始化
			navlist1:[]//搜索数据初始化
			
		};
	},
	created() {
		this.initFlag = true;
		if (this.curMode == 'left') {
			this.ipadFlag = true;
		} else {
			this.ipadFlag = false;
		}
		this.uid = uni.getStorageSync('USER_ID');
		let functionId = uni.getStorageSync('functionid');
		this.functionId = functionId;
		const list = uni.getStorageSync('navlists');
		if (list) {
			uni.removeStorageSync('navlists');
		}
	},
	onLoad(options) {
		if (options) {
			this.headTitle = options.title + '问题明细';
		} else {
			this.headTitle = '问题明细';
		}
	},
	// watch: {
	// 	//防抖搜索
	// 	searchName(newVal, oldVal) {
	// 		if (newVal != oldVal&&this.searchName!='') {
	// 			debounce(this.search(), 500);
	// 		}
	// 	}
	// },
	methods: {
		replaceInput(value){
			let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
			setTimeout(()=>{
				let endvalue=value.replace(patrn,'')
				this.searchName = endvalue;
				debounce(this.search(), 500);
			},100)
		},
		//搜索
		search() {
			if (this.subIndex == 0) {
				this.tab0.mescroll.resetUpScroll();
			} else if (this.subIndex == 1) {
				this.tab1.mescroll.resetUpScroll();
			}
		},
		clear() {
			this.searchName = '';
			// if (this.subIndex == 0) {
			// 	this.tab0.mescroll.resetUpScroll();
			// } else if (this.subIndex == 1) {
			// 	this.tab1.mescroll.resetUpScroll();
			// }
		},
		//筛选
		quicksearch() {
			queryUserToCondition(uni.getStorageSync('USER_ID'), uni.getStorageSync('functionid'), this.curNow).then(res => {
				if (res == null) {
					this.$refs.uToast.show({
						title: '暂无筛选条件',
						type: 'warning'
					});
					return true;
				}
				const list = uni.getStorageSync('navlists');
				if (list) {
					this.navlist = list;
					this.navshow = true;
					this.isStatus = false;
				} else {
					this.navlist = res;
					uni.setStorageSync('reslist', this.navlist);
					this.navshow = true;
					this.isStatus = false;
				}
			});
		},
		//筛选
		quicksearch1() {
			queryUserToCondition(uni.getStorageSync('USER_ID'), uni.getStorageSync('functionid'), this.curNow).then(res => {
				const list = uni.getStorageSync('navlists');
				this.navlist = res;
				uni.setStorageSync('reslist', this.navlist);
				this.isStatus = false;
			});
		},
		//左侧导航切换
		navChange(index) {
			this.navlist[index].active = true;
			this.navindex = index;
			this.navlist.map((val, idx) => {
				if (index != idx) this.navlist[idx].active = false;
			});
		},
		checkedAll(index) {
			if (this.navlist[index].listchoose == true) {
				this.navlist[index].list.map(val => {
					val.checked = true;
				});
			} else {
				this.navlist[index].list.map(val => {
					val.checked = false;
				});
			}
		},
		checkboxChange(e) {},
		checkboxGroupChange(e) {
			let index = this.navindex;
			if (e.length == this.navlist[index].list.length) {
				this.navlist[index].listchoose = true;
			} else {
				this.navlist[index].listchoose = false;
			}
		},
		close() {
			const list = uni.getStorageSync('navlists');
			if (list) {
				this.navlist = list;
			}
			this.navshow = false;
		},
		sure() {
			if (!this.isStatus) {
				uni.setStorageSync('navlists', this.navlist);
				if (this.subIndex == 0) {
					this.tab0.mescroll.resetUpScroll();
				} else if (this.subIndex == 1) {
					this.tab1.mescroll.resetUpScroll();
				}
				this.navshow = false;
				this.isStatus = true;
			}
		},
		reset() {
			if (!this.isStatus) {
				const list = uni.getStorageSync('reslist');
				if (list) {
					uni.removeStorageSync('navlists');
					this.navlist = list;
				}
				if (this.subIndex == 0) {
					this.tab0.mescroll.resetUpScroll();
				} else if (this.subIndex == 1) {
					this.tab1.mescroll.resetUpScroll();
				}
				this.navshow = false;
				this.isStatus = true;
			}
		},
		// 点击collapsehead头部
		async headClick(index, flag) {
			this.clickindex = index;
			if (flag == 0) {
				if (this.tab0.collapseList[index].child == null) {
					await quertTaskIssueList(this.navindex, this.tab0.collapseList[index].task_id, uni.getStorageSync('functionid'), this.tab0.collapseList[index].user_id).then(
						res => {
							this.tab0.collapseList[index].child = res;
							this.tab0.collapseList[index].isShow = !this.tab0.collapseList[index].isShow;
							this.tab0.collapseList.map((e, index) => {
								if (index != this.clickindex) {
									e.isShow = false;
								}
							});
						}
					);
				} else {
					this.tab0.collapseList[index].isShow = !this.tab0.collapseList[index].isShow;
					this.tab0.collapseList.map((e, index) => {
						if (index != this.clickindex) {
							e.isShow = false;
						}
					});
				}
			} else {
				if (this.tab1.collapseList[index].child == null) {
					await quertTaskIssueList(1, this.tab1.collapseList[index].task_id, uni.getStorageSync('functionid'), this.tab1.collapseList[index].user_id).then(res => {
						this.tab1.collapseList[index].child = res;
						this.tab1.collapseList[index].isShow = !this.tab1.collapseList[index].isShow;
						this.tab1.collapseList.map((e, index) => {
							if (index != this.clickindex) {
								e.isShow = false;
							}
						});
					});
				} else {
					this.tab1.collapseList[index].isShow = !this.tab1.collapseList[index].isShow;
					this.tab1.collapseList.map((e, index) => {
						if (index != this.clickindex) {
							e.isShow = false;
						}
					});
				}
				// this.tab1.collapseList[index].isShow = !this.tab1.collapseList[index].isShow;
				// this.tab1.collapseList.map((e, index) => {
				// 	if (index != this.clickindex) {
				// 		e.isShow = false;
				// 	}
				// });
			}
		},
		scrollfun() {
			// 只要滚动就清除状态
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (this.curNow == 0) {
					this.old.scrollTop = this.tab0.mescroll.scrollTop;
					this.old.isScrollUp = this.tab0.mescroll.isScrollUp;
					if (this.old.scrollTop <= 50 && this.old.isScrollUp == false&& this.tab0.mescroll.num > 1) {
						this.tab0.mescroll.scrollTo(0, 0);
						this.old.scrollTop = 0;
						this.$emit('scorllway', false);
					}
					// 告知标识 -> 结束滚动
					if (this.old.scrollTop > 200 && this.old.isScrollUp == true && this.tab0.mescroll.num > 1) {
						this.$emit('scorllway', true);
					}
				}
				if (this.curNow == 1) {
					this.old.scrollTop = this.tab1.mescroll.scrollTop;
					this.old.isScrollUp = this.tab1.mescroll.isScrollUp;
					if (this.old.scrollTop <= 50 && this.old.isScrollUp == false&& this.tab1.mescroll.num > 1) {
						this.tab1.mescroll.scrollTo(0, 0);
						this.old.scrollTop = 0;
						this.$emit('scorllway', false);
					}
					// 告知标识 -> 结束滚动
					if (this.old.scrollTop > 200 && this.old.isScrollUp == true && this.tab1.mescroll.num > 1) {
						this.$emit('scorllway', true);
					}
				}
			}, 30);
		},
		//触摸开始事件
		touchStart(e) {
			this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点
			this.touchDotY = e.touches[0].pageY; // 获取触摸时的y原点
			// 使用js计时器记录时间
			this.interval = setInterval(function() {
				this.time++;
			}, 100);
		},
		// 触摸移动事件
		touchMove(e) {
			this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点
			this.touchMoveY = e.touches[0].pageY; // 获取移动时的y原点
			// 向左滑动 (如果是左边的弹窗)
			if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10 && this.curMode == 'left') {
				this.close();
			}
			// 向下滑动 （如果是下边的弹窗）
			if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == 'bottom') {
				this.close();
			}
		},
		// 触摸结束事件
		touchEnd(e) {
			clearInterval(this.interval); // 清除setInterval
			this.time = 0;
		},
		//导航切换
		sectionChange(index) {
			if (this.isFlag) {
				return;
			}
			var curTab = this.getTabData(this.curNow); //当前tab
			var newTab = this.getTabData(index); //准备切换过去的tab
			this.curNow = index;
			this.subIndex = index;
			this.initFlag = true;
			uni.removeStorageSync('navlists');
			// 初始化列表数据
			if (!newTab.isListInit) {
				// 如果列表没有初始化过,则初始化
				this.searchName = '';
				newTab.mescroll.resetUpScroll();
			} else {
				this.clear();
			}
			newTab.mescroll.scrollTo(0, 0);
			this.old.scrollTop = 0;
			if (this.old.scrollTop != undefined) {
				this.$emit('scorllway', false);
			}
		},
		// 轮播切换
		swiperChange(e) {
			var curTab = this.getTabData(this.curNow); //当前tab
			var newTab = this.getTabData(e.detail.current); //准备切换过去的tab
			this.subIndex = e.detail.current;
			this.curNow = e.detail.current;
			this.initFlag = true;
			uni.removeStorageSync('navlists');
			// 初始化列表数据
			if (!newTab.isListInit) {
				// 如果列表没有初始化过,则初始化
				this.searchName = '';
				newTab.mescroll.resetUpScroll();
			} else {
				this.clear();
			}
			newTab.mescroll.scrollTo(0, 0);
			this.old.scrollTop = 0;
			if (this.old.scrollTop != undefined) {
				this.$emit('scorllway', false);
			}
		},
		getTabData(tabType) {
			if (tabType == 0) {
				return this.tab0;
			} else if (tabType == 1) {
				return this.tab1;
			}
		},
		mescrollInit0(mescroll) {
			mescroll.tabType = 0; // 加入标记,便于在回调中取到对应的list
			this.tab0.mescroll = mescroll;
		},
		mescrollInit1(mescroll) {
			mescroll.tabType = 1;
			this.tab1.mescroll = mescroll;
		},
		/*下拉刷新的回调 */
		downCallback(mescroll) {
			if (this.subIndex == 0) {
				this.old.scrollTop = 0;
				this.$emit('scorllway', false);
				this.tab0.mescroll.resetUpScroll();
			} else if (this.subIndex == 1) {
				this.old.scrollTop = 0;
				this.$emit('scorllway', false);
				this.tab1.mescroll.resetUpScroll();
			}
		},
		/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
		upCallback(mescroll) {
			if (this.curNow != mescroll.tabType) {
					mescroll.endSuccess(); // 只处理当前页的回调,避免tab切换过快,触发的回调和当前页不一致的问题
					return;
				}
				if (mescroll.tabType == 0) {
					if (this.initFlag) {
						this.initFlag = false;
						queryUserToCondition(uni.getStorageSync('USER_ID'), uni.getStorageSync('functionid'), this.curNow).then(res => {
							if (res[0].list.length == 0 || res[1].list.length == 0 || res == null) {
								this.tab0.collapseList = [];
								this.changing0 = false;
								// 隐藏下拉加载状态
								this.tab0.mescroll.endErr();
								return true;
							}
							const list = uni.getStorageSync('navlists');
							if (list) {
								this.navlist = list;
								this.isStatus = false;
							} else {
								this.navlist = res;
								uni.setStorageSync('reslist', this.navlist);
								this.isStatus = false;
							}
							this.tab0.isListInit = true; //标记列表已初始化,保证列表只初始化一次
							queryQuestionList(0, mescroll.num, mescroll.size, this.searchName, this.navlist).then(res => {
								if (res != null) {
									let totalPage = Number(res[0].total);
									this.tab0.mescroll.endBySize(res.length, totalPage); //必传参数(当前页的数据个数, 总数据量)
									//设置列表数据
									if (this.tab0.mescroll.num == 1) this.tab0.collapseList = []; //如果是第一页需手动制空列表
									this.tab0.collapseList = this.tab0.collapseList.concat(res); //追加新数据
									this.initFlag = false;
									//this.tab0.collapseList[0].isShow = true;
								} else {
									this.tab0.collapseList = [];
									this.changing0 = false;
									// 隐藏下拉加载状态
									this.tab0.mescroll.endErr();
								}
							});
						});
					} else {
						this.tab0.isListInit = true; //标记列表已初始化,保证列表只初始化一次
						queryQuestionList(0, mescroll.num, mescroll.size, this.searchName, this.navlist).then(res => {
							if (res != null) {
								let totalPage = Number(res[0].total);
								this.tab0.mescroll.endBySize(res.length, totalPage); //必传参数(当前页的数据个数, 总数据量)
								//设置列表数据
								if (this.tab0.mescroll.num == 1) this.tab0.collapseList = []; //如果是第一页需手动制空列表
								this.tab0.collapseList = this.tab0.collapseList.concat(res); //追加新数据
								this.initFlag = false;
								//this.tab0.collapseList[0].isShow = true;
							} else {
								this.tab0.collapseList = [];
								this.changing0 = false;
			
								this.initFlag = false;
								// 隐藏下拉加载状态
								this.tab0.mescroll.endErr();
							}
						});
					}
				} else if (mescroll.tabType == 1) {
					if (this.initFlag) {
						this.initFlag = false;
						queryUserToCondition(uni.getStorageSync('USER_ID'), uni.getStorageSync('functionid'), this.curNow).then(res => {
							if (this.functionId == 1) {
								if (res[0].list.length == 0 || res == null) {
									this.tab1.collapseList = [];
									this.changing1 = false;
									// 隐藏下拉加载状态
									this.tab1.mescroll.endErr();
									return true;
								}
							} else {
								if (res == null) {
									this.tab1.collapseList = [];
									this.changing1 = false;
									// 隐藏下拉加载状态
									this.tab1.mescroll.endErr();
									return true;
								}
							}
							const list = uni.getStorageSync('navlists');
							if (list) {
								this.navlist = list;
								this.isStatus = false;
							} else {
								this.navlist = res;
								uni.setStorageSync('reslist', this.navlist);
								this.isStatus = false;
							}
							this.tab1.isListInit = true; //标记列表已初始化,保证列表只初始化一次
							queryQuestionList(1, mescroll.num, mescroll.size, this.searchName, this.navlist).then(res => {
								if (res != null) {
									let totalPage = Number(res[0].total);
									this.tab1.mescroll.endByPage(res.length, totalPage); //必传参数(当前页的数据个数, 总数据量)
									//设置列表数据
									if (this.tab1.mescroll.num == 1) this.tab1.collapseList = []; //如果是第一页需手动制空列表
									this.tab1.collapseList = this.tab1.collapseList.concat(res); //追加新数据
									//this.tab1.collapseList[0].isShow = true;
								} else {
									this.tab1.collapseList = [];
									this.changing1 = false;
									// 隐藏下拉加载状态
									this.tab1.mescroll.endErr();
								}
							});
						});
					} else {
						this.initFlag = false;
						this.tab1.isListInit = true; //标记列表已初始化,保证列表只初始化一次
						queryQuestionList(1, mescroll.num, mescroll.size, this.searchName, this.navlist).then(res => {
							if (res != null) {
								let totalPage = Number(res[0].total);
								this.tab1.mescroll.endByPage(res.length, totalPage); //必传参数(当前页的数据个数, 总数据量)
								//设置列表数据
								if (this.tab1.mescroll.num == 1) this.tab1.collapseList = []; //如果是第一页需手动制空列表
								this.tab1.collapseList = this.tab1.collapseList.concat(res); //追加新数据
								//this.tab1.collapseList[0].isShow = true;
							} else {
								this.tab1.collapseList = [];
								this.changing1 = false;
								// 隐藏下拉加载状态
								this.tab1.mescroll.endErr();
							}
						});
					}
				}
			
		},
		upCallback1(mescroll) {
			if (this.curNow != mescroll.tabType) {
				mescroll.endSuccess(); // 只处理当前页的回调,避免tab切换过快,触发的回调和当前页不一致的问题
				return;
			}
			if (mescroll.tabType == 0) {
				this.tab0.isListInit = true; //标记列表已初始化,保证列表只初始化一次
				queryQuestionList(0, mescroll.num, mescroll.size, this.searchName,this.navlist).then(res => {
					if (res != null) {
						let totalPage = Number(res[0].total);
						this.tab0.mescroll.endByPage(res.length, totalPage); //必传参数(当前页的数据个数, 总数据量)
						//设置列表数据
						if (this.tab0.mescroll.num == 1) this.tab0.collapseList = []; //如果是第一页需手动制空列表
						this.tab0.collapseList = this.tab0.collapseList.concat(res); //追加新数据
						//this.tab0.collapseList[0].isShow = true;
					} else {
						this.tab0.collapseList = [];
						this.changing0 = false;
						// 隐藏下拉加载状态
						this.tab0.mescroll.endErr();
					}
				});
			} else if (mescroll.tabType == 1) {
				this.tab1.isListInit = true; //标记列表已初始化,保证列表只初始化一次
				queryQuestionList(1, mescroll.num, mescroll.size, this.searchName, this.navlist).then(res => {
					if (res != null) {
						let totalPage = Number(res[0].total);
						this.tab1.mescroll.endByPage(res.length, totalPage); //必传参数(当前页的数据个数, 总数据量)
						//设置列表数据
						if (this.tab1.mescroll.num == 1) this.tab1.collapseList = []; //如果是第一页需手动制空列表
						this.tab1.collapseList = this.tab1.collapseList.concat(res); //追加新数据
						//this.tab1.collapseList[0].isShow = true;
					} else {
						this.tab1.collapseList = [];
						this.changing1 = false;
						// 隐藏下拉加载状态
						this.tab1.mescroll.endErr();
					}
				});
			}
		},
		/**
		 * 搜索却定按钮的回调
		 * @param {Object} val
		 */
		result(val) {
			this.filter = val;
			if (this.subIndex == 0) {
				this.tab0.mescroll.resetUpScroll();
			} else if (this.subIndex == 1) {
				this.tab1.mescroll.resetUpScroll();
			}
			this.isFlag = false;
		},
		/**
		 * 查询当前的搜索条件
		 */
		queryUserToCondition(status) {},
		clickStatus() {
			this.isFlag = true;
		},
		closing() {
			this.isFlag = false;
		},
		//预览图片
		previewImage(fileList) {
			let list = [];
			fileList.map(i => {
				list.push(i.image);
			});
			let current = list[0];
			uni.previewImage({
				current: current, // 当前显示图片的http链接
				urls: list // 需要预览的图片http链接列表
			});
		},
		/**
		 * 导出数据
		 * @param {Object} id
		 */
		exportTaskIssue(name, id) {
			importUserToTask(name, id, 1, 2).then(res => {
				var w = plus.nativeUI.showWaiting('处理中，请等待...', {
					style: 'black',
					loading: {
						display: 'inline'
					}
				});
				if (res.constructor === String) {
					if (res == 'isFlag') {
						w.close();
						//以上成对，加载之前showLoading，加载之后hideToast
						plus.nativeUI.toast('暂无数据');
					} else {
						w.close();
						//以上成对，加载之前showLoading，加载之后hideToast
						plus.nativeUI.toast(res);
						this.cancelCheck();
					}
				} else {
					w.close();
					//以上成对，加载之前showLoading，加载之后hideToast
					plus.nativeUI.toast('导出数据失败了');
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
/deep/.u-content {
	border-radius: 10rpx 0 0 10rpx !important;
}

/deep/.u-subsection {
	padding: 0 10rpx !important;
	border-radius: 0 !important;
}

.problem {
	// background: #FFFFFF;
	// padding-bottom: 100rpx;

	.subtop {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background: #ffffff;
		margin-bottom: 2px;

		.subsearch {
			width: 100%;
			flex: 1;
		}

		.subnew {
			margin-left: 30rpx;

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
			}
		}
	}
}

.condition {
	white-space: nowrap;
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	z-index: 99;
	background: #ffffff;
	border-bottom: 2rpx solid #f6f6f6;

	.search-part {
		width: 30%;
		padding: 0 2%;
		display: inline-block;

		.limit {
			height: 70rpx;
			line-height: 70rpx;
			color: #303133;
			width: 100%;
			font-size: 30rpx;
		}
	}

	.ipadWfirst {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;

		.search-part {
			width: 19%;
			padding: 0;
			display: block;
		}
	}

	.ipadWsecond {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;

		.search-part {
			width: 24%;
			padding: 0;
			display: block;
		}
	}

	.ipadWthird {
		display: flex;
		justify-content: space-around;
		align-items: center;
		height: 100rpx;

		.search-part {
			width: 32%;
			padding: 0;
			display: block;
		}
	}
}

// 筛选弹窗
.roleModel {
	width: 100%;
	position: relative;
	padding-top: 90rpx;
	height: 100%;
	height: calc(100% - 90px);

	.roleTop {
		height: 90rpx;
		line-height: 90rpx;
		background: #4abdb4;
		color: #ffffff;
		font-size: 34rpx;
		text-align: center;
		position: fixed;
		top: 0rpx;
		width: 100%;
		z-index: 999;
	}

	.right {
		position: fixed;
		top: 0rpx;
		right: 0;
		width: 150rpx;
		height: 90rpx;
		color: #ffffff;
		line-height: 90rpx;
		font-size: 30rpx;
		z-index: 999;
	}

	.left {
		position: fixed;
		top: 0rpx;
		left: 0;
		width: 150rpx;
		height: 90rpx;
		color: #ffffff;
		line-height: 90rpx;
		font-size: 30rpx;
		text-align: right;
		z-index: 999;
	}

	.ipadPos {
		height: 50rpx;
		line-height: 50rpx;
		top: 40rpx;
	}

	.roleAction {
		position: fixed;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 32rpx;
		width: 100%;
		border-top: 2rpx solid #f6f6f6;
		background: #ffffff;
		z-index: 999;

		.cancel {
			width: 40%;
			border: 2rpx solid #dedede;
			color: #606266;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 80rpx;
		}

		.sure {
			width: 40%;
			color: #ffffff;
			background: #4abdb4;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border: 2rpx solid #4abdb4;
			border-radius: 80rpx;
		}
	}

	.all {
		padding: 0 30rpx;
		margin-bottom: 20rpx;
	}

	.part {
		margin-left: 50rpx;
		padding: 0 30rpx;
		.normalH {
			height: 55vh;
			width: 100%;
		}
		.ipadH {
			height: 75vh;
			width: 100%;
		}
	}

	.nav {
		display: flex;
		width: 100%;
		height: 100%;

		.navleft {
			width: 25%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			background: #f8f8f8;

			.navitem {
				width: 100%;
				height: 100%;
				line-height: 100%;
				text-align: center;
				color: #999999;
				border-bottom: 1px solid #eeeeee;
				border-right: 1px solid #eeeeee;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				font-size: 28rpx;
				letter-spacing: 6rpx;
			}

			.active {
				border-right: none;
				color: #4abdb4;
				font-size: 30rpx;
				background: #ffffff;
			}
		}

		.navright {
			width: 75%;

			.navpart {
				height: 100%;
			}

			.active {
				// background: #a5deda;
			}

			.gray {
				color: #999999;
				margin-left: 10rpx;
				font-size: 28rpx;
			}

			.navcontent {
				padding: 30rpx;
			}
		}
	}
}

.problemList {
	// margin-bottom: 20rpx;
	.u-collapse-item {
		border-bottom: 2rpx solid #f6f6f6;
	}
}

.problemTitle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx;
	background: #ffffff;

	.left {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 60%;
		max-width: 1200rpx;

		.line {
			width: 12rpx;
			min-width: 12rpx;
			height: 100rpx;
			background: #4abdb4;
			border-radius: 10rpx;
		}

		.left-part {
			margin-left: 10rpx;
			width: 100%;

			.name {
				color: #333333;
				font-size: 32rpx;
				margin-bottom: 10rpx;

				.nameleft {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					position: relative;
					width: 100%;

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
			}

			.detail {
				width: 70%;

				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #606266;
				font-size: 30rpx;
			}
		}
	}

	.right {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 40%;

		image {
			width: 80rpx;
			height: 80rpx;
			margin-left: 20rpx;
		}

		.u-arrow-down-icon {
			transition: all 0.3s;
			color: #999999;
		}

		.u-arrow-down-icon-active {
			transform: rotate(180deg);
			transform-origin: center center;
		}

		.state {
			color: #ffffff;
			background: #4abdb4;
			text-align: center;
			border-radius: 50rpx;
			line-height: 50rpx;
			height: 50rpx;
			font-size: 24rpx;
			padding: 0 20rpx;
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

	.wrap {
		display: flex;
		justify-content: space-around;
	}
}

.scorll-content {
	padding: 0;

	.scroll-view_H {
		.top {
			display: inline-flex;
		}

		.tableheight {
			height: auto;
			background: #ffffff;
			position: relative;
			display: inline-flex;
		}
		.empty-tips {
			color: #e6e6e6;
			padding: 20rpx 0;
			font-size: 28rpx;
		}

		.scorll-th {
			width: 200rpx;

			.srorll-title {
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				font-size: 28rpx;
				border: 1px solid #f6f6f6;
				background: #6ecac3;
				color: #ffffff;
			}

			.scorll-td {
				border: 1px solid #f6f6f6;
				font-size: 28rpx;
				color: #606266;
				text-align: center;
				background: #ffffff;
				padding: 0 10rpx;
				height: 100%;
				height: calc(100% - 2px);
				overflow: hidden;

				.content {
					line-height: 40rpx;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.tips {
						margin-bottom: 10rpx;
						font-size: 24rpx;
						color: #ffffff;
						background: #6ecac3;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						padding: 0 10rpx;
					}
				}
			}
		}

		.detail {
			width: 300rpx;
		}

		.pic {
			width: 500rpx;

			.imgpart {
				padding: 20rpx;

				/deep/uni-swiper {
					height: 260rpx !important;
				}
			}
		}
	}
}
</style>
