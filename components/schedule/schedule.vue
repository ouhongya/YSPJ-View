<template>
	<view class="schedule">
		<u-sticky :offset-top="offset">
			<view>
				<u-tabs :list="sublist" :is-scroll="false" :current="curNow" @change="sectionChange" active-color="#6ecac3"
				 bg-color="#f6fff9" height="90"></u-tabs>
			</view>
		</u-sticky>


		<swiper :style="{height: subHeight+funH+'px'}" :current="subIndex" @change="swiperChange" class="swipe">
			<swiper-item>
				<view class="wrap" :style="{height: subHeight+'px'}">
					<mescroll-uni :down="downOption" @init="mescrollInit0" @down="downCallback" @up="upCallback" :up="upOption" :fixed="false"
					 @scroll="scrollfun">
						<view class="schedulepart">
							<view class="part" v-for="(item, index) in tab0.list" :key="index">
								<view>
									<view class="statu">
										<!--  #ff9900待审核，#2979ff待分配,#19be6b已完结 -->
										<view v-if="functionid == 1">
											<view class="left yellow">待处理</view>
										</view>
										<view v-if="functionid == 2 && item.solveask == ''">
											<!-- 状态：1已完成，2待审核、3审核通过、4审核驳回,5分配整改-->
											<view class="left yellow">待审核</view>
										</view>
										<view v-if="functionid == 2 && item.solveask != ''">
											<!-- 状态：1已完成，2待审核、3审核通过、4审核驳回,5分配整改-->
											<view class="left yellow">待检查</view>
										</view>
										<view v-if="functionid == 3">
											<!-- 状态：1已完成，2待审核、3审核通过、4审核驳回,5分配整改-->
											<view class="left yellow">待检查</view>
										</view>
										<view class="time">{{ $u.timeFormat(item.create_time, 'yyyy-mm-dd hh:MM') }}</view>
									</view>
									<view>
										<view class="main">
											<view class="line">
												<view class="title">任务名称：</view>
												<view class="detail">{{ item.task_name }}</view>
											</view>
											<view class="line">
												<view class="title">所属标准：</view>
												<view class="detail">{{ item.normname }}</view>
											</view>
											<view class="line">
												<view class="title">单位名称：</view>
												<view class="detail">{{ item.unit_name }}</view>
											</view>
											<view class="line">
												<view class="title">子单位：</view>
												<view class="detail">{{ item.site_name}}</view>
											</view>
											<view class="line">
												<view class="title">问题数量：</view>
												<view class="detail">{{ item.total_issue?item.total_issue:0}}</view>
											</view>
											<view class="line" v-if="item.tasktype == 1">
												<view class="title">加分数量：</view>
												<view class="detail">{{ item.solve?item.solve:0}}</view>
											</view>
											<view class="line" v-if="functionid == 1">
												<view class="title">上报人员：</view>
												<view class="detail">{{ item.groupuser}}</view>
											</view>
											<view class="line" v-if="functionid == 3">
												<view class="title">组长：</view>
												<view class="detail">{{ item.groupuser}}</view>
											</view>
											<view class="line" v-if="functionid == 2 || functionid == 3">
												<view class="title">检查人员：</view>
												<view class="detail">{{ item.jname}}</view>
											</view>
										</view>
									</view>
									<view class="action-part" :class="actionflag?'pos':''">
										<view class="see" @click="see(item)">明细</view>
										<view class="allot" v-if="item.tasktype == 1 && item.total_issue != 0 && functionid == 1" @click="allot(item)">分配</view>
										<view v-if="functionid == 1 && item.tasktype == 1">
											<view class="pass" @click="pass1(item)">通过</view>
										</view>
										<view v-if="functionid == 1 && item.tasktype == 2">
											<view class="pass" @click="pass2(item)">通过</view>
										</view>
										<view v-if="functionid == 1 && item.tasktype == 2">
											<view class="refuse" @click="refuse1(item)">驳回</view>
										</view>
										<view v-if="functionid == 2  && item.solveask == ''">
											<view class="pass" @click="pass3(item)">通过</view>
										</view>
										<view v-if="functionid == 2 && item.solveask == ''">
											<view class="refuse" @click="refuse2(item)">驳回</view>
										</view>
									</view>
									<view class="prograss" @click="jump(item)" v-if="functionid == 1">
										<u-section title="人员关联" :showLine="false"></u-section>
									</view>
									<view class="prograss" v-if="(functionid == 2||functionid == 3) && item.solveask != ''">
										<view class="namerefuse">
											<view class="nameicon">
												<u-icon name="info-circle" color="#fa3534" size="36"></u-icon>
												<view class="refuse">驳回</view>
											</view>
											<view class="detail">{{item.solveask}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</swiper-item>
			<swiper-item>

				<view class="wrap" :style="{height: subHeight+'px'}">
					<mescroll-uni :down="downOption" @init="mescrollInit1" @down="downCallback" @up="upCallback" :up="upOption" :fixed="false"
					 @scroll="scrollfun">
						<view class="schedulepart">
							<view class="part" v-for="(item, index) in tab1.list" :key="index">
								<view class="statu">
									<!--  #ff9900待审核，#2979ff待分配,#19be6b已完结 -->
									<view class="left green">已处理</view>
									<view class="time">
										{{ $u.timeFormat(item.updatetime, 'yyyy-mm-dd hh:MM') }}
									</view>
								</view>
								<view class="main">
									<view class="line">
										<view class="title">任务名称：</view>
										<view class="detail">{{ item.task_name }}</view>
									</view>
									<view class="line">
										<view class="title">所属标准：</view>
										<view class="detail">{{ item.normname }}</view>
									</view>
									<view class="line">
										<view class="title">单位名称：</view>
										<view class="detail">{{ item.unit_name}}</view>
									</view>
									<view class="line">
										<view class="title">子单位：</view>
										<view class="detail">{{ item.site_name }}</view>
									</view>
									<view class="line">
										<view class="title">问题数量：</view>
										<view class="detail">{{ item.total_issue}}</view>
									</view>
									<view class="line" v-if="item.tasktype == 1">
										<view class="title">加分数量：</view>
										<view class="detail">{{ item.solve}}</view>
									</view>
									<view class="line" v-if="functionid == 1">
										<view class="title">上报人员：</view>
										<view class="detail">{{ item.groupuser}}</view>
									</view>
									<view class="line" v-if="functionid == 3">
										<view class="title">组长：</view>
										<view class="detail">{{ item.groupuser}}</view>
									</view>
									<view class="line" v-if="functionid == 2 || functionid == 3">
										<view class="title">检查人员：</view>
										<view class="detail">{{ item.jname}}</view>
									</view>
								</view>
								<view class="action-part" :class="actionflag?'pos':''">
									<view class="see" @click="see(item)">明细</view>
								</view>
								<view class="prograss" @click="jump(item)" v-if="functionid == 1">
									<u-section title="人员关联" :showLine="false"></u-section>
								</view>
								<view class="prograss" v-if="(functionid == 2||functionid == 3) && item.solveask != ''">
									<view class="namerefuse">
										<view class="nameicon">
											<u-icon name="info-circle" color="#fa3534" size="36"></u-icon>
											<view class="refuse">驳回</view>
										</view>
										<view class="detail">{{item.solveask}}</view>
									</view>
								</view>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</swiper-item>
		</swiper>

		<!-- 驳回理由 -->
		<u-modal v-model="show" @confirm="confirm" ref="uModal" :async-close="true" :show-cancel-button="true" :confirm-style="{ color: '#fa3534' }"
		 title="驳回理由" z-index="999">
			<view class="slot-content">
				<view class="model">
					<u-input v-model="reason" type="textarea" :border="true" :height="200" :auto-height="true" placeholder="请输入驳回理由" @input="replaceInput()"/>
				</view>
			</view>
		</u-modal>
		<!-- 下发或批量下发 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showAllot" :mode="curMode" width="40%" height="80%" @close="close">
				<view class="roleModel">
					<view class="roleTop">任务分配</view>
					<view class="content" v-if="collapseList&&collapseList.length">
						<!-- 折叠面板 -->
						<view class="collapsePart">
							<view class="u-collapse-item" v-for="(item, index) in collapseList" :key="index">
								<view :hover-stay-time="200" class="u-collapse-head">
									<block>
										<view class="u-icon-wrap" @tap="headClick(index)">
											<u-icon v-if="arrow" :class="{ 'u-arrow-down-icon-active': item.isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon>
										</view>
										<view class="u-collapse-title u-line-1" @tap="headClick(index)">{{ item.detail }}<text  class="badge-msg">({{ item.question }})</text></view>
										<view class="action">
											<u-input v-model="item.person" type="select" :border="true" @click="openPerson(index)" height="70"
											 placeholder="指派给" />
										</view>
									</block>
								</view>

								<view class="u-collapse-body" v-if="item.isShow">
									<view class="u-collapse-content">
										<view class="" v-for="(i, index1) in item.child" :key="index1">
											<view class="childPart">
												<view class="left" @click="headClick2(index, index1)">
													<u-icon :class="{ 'u-arrow-down-icon-active': i.isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon>
													{{ i.detail }}<text  class="badge-msg">({{ i.question }})</text>
												</view>
												<view class="action">
													<u-input v-model="i.person" type="select" :border="true" @click="openchildPerson(index, index1)" height="70"
													 placeholder="指派给" />
												</view>
											</view>
											<view class="child" v-if="i.child && i.isShow">
												<view class="childPart" v-for="(j, index2) in i.child" :key="index2">
													<view class="left">{{ j.detail }}<text  class="badge-msg">({{ j.question }})</text></view>
													<view class="action">
														<u-input v-model="j.person" type="select" :border="true" @click="openchild2Person(index, index1, index2)"
														 height="70" placeholder="指派给" />
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>

						<view class="form">
							<view class="form-part border">
								<view class="form-title">整改期限</view>
								<view class="form-right" @click="showtime = true">
									<view class="time">
										<view v-if="choosetime">
											<text>{{ startDate }}</text>
											<text>至</text>
											<text>{{ endDate }}</text>
										</view>
										<view v-else class="gray">请选择时间</view>
										<u-icon name="arrow-right" size="28" color="#999999"></u-icon>
									</view>
								</view>
							</view>
							<view class="form-part">
								<view class="form-title">整改要求</view>
								<view class="form-right">
									<u-input v-model="demand" :border="true" type="textarea" height="200" :auto-height="true" placeholder="请输入整改要求(1-200字)" @input="replaceInput2()"/>
								</view>
							</view>
						</view>

					</view>
					<view class="empty" v-else>
						<a-empty :changing="false"></a-empty>
					</view>
					<view class="roleAction" v-if="collapseList&&collapseList.length">
						<view class="cancel" @click="cancel()">取消</view>
						<view class="sure" @click="sure()">确定</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 选择人员 -->
		<u-action-sheet :list="personSheetList" v-model="showPersonList" @click="personSheetCallback" border-radius="20" @close="personSheetClose"></u-action-sheet>
		<u-action-sheet :list="personSheetList" v-model="showPersonchildList" @click="personchildSheetCallback" border-radius="20" @close="personchildSheetClose"></u-action-sheet>
		<u-action-sheet :list="personSheetList" v-model="showPersonchild2List" @click="personchild2SheetCallback" @close="personchild2SheetClose"
		 border-radius="20"></u-action-sheet>
		<!-- 选择时间 -->
		<u-calendar v-model="showtime" :mode="mode" @change="changetime" max-date="2030-01-01" :min-date="istoday" ref="calendar">
			<view slot="tooltip">
				<view class="emptytips" @click="emptytime">
					清空日期
				</view>
			</view>
		</u-calendar>
		<u-toast ref="uToast" />
		<u-modal v-model="showPass" @confirm="passConfirm" :async-close="true" :show-cancel-button="true" :confirm-style="{'color':'#fa3534'}"
		 :show-title="false" content="您确认要通过吗？"></u-modal>
		<u-modal v-model="showPass2" @confirm="passConfirm2" :async-close="true" :show-cancel-button="true" :confirm-style="{'color':'#fa3534'}"
		 :show-title="false" content="您确认要通过吗？"></u-modal>
		<u-modal v-model="showPass3" @confirm="passConfirm3" :async-close="true" :show-cancel-button="true" :confirm-style="{'color':'#fa3534'}"
		 :show-title="false" content="您确认要通过吗？"></u-modal>
	</view>
</template>

<script>
	var timer; //判断页面滚动
	import helper from '@/common/helper.js';
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
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
				// 头部导航
				curNow: 0, //当前选中
				subIndex: 0, //当前选中内容
				sublist: [{
						name: '待处理'
					},
					{
						name: '已处理'
					}
				],
				showindex: false,
				list: [],
				list2: [],
				show: false,
				reason: '',
				allotName: '',
				showAllot: false,
				showtime: false,
				istoday: '1950-01-01',
				mode: 'range',
				choosetime: '',
				startDate: '',
				endDate: '',
				demand: '',
				arrow: true, //是否显示箭头
				showPersonList: false,
				showPersonchildList: false,
				showPersonchild2List: false,
				openindex: '',
				openchildindex: '',
				openchild2index: '',
				elIdclick: '',
				clickindex: '',
				clickindex1: '',
				personSheetList: [],
				collapseList: [],
				rejectindex: '',
				uid: null,
				id: null,
				doneLoading: false,
				changing: true,
				index: null,
				functionid: null,
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
				tab0: {
					mescroll: null,
					isListInit: false,
					scrollY: 0,
					list: [],
				},
				tab1: {
					mescroll: null,
					isListInit: false,
					scrollY: 0,
					list: [],
				},
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
				showPass: false,
				showPass2: false,
				showPass3: false,
				showPass4: false,
				showPass5: false,
				pass1item: null,
				pass2item: null,
				pass3item: null,
				pass4item: null,
				pass5item: null,
				allotitem: null,
				funH: 10,
				scrollflag: false,
				actionflag: false,
				lock: false,
				seelock: false,
				lockpass1: false,
				lockpass2: false,
				lockpass3: false,
				refuselock: false

			};
		},
		created() {
			//获取当前日期
			var date = new Date();
			this.istoday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

			this.functionid = uni.getStorageSync('functionid');
			if (this.curMode == 'left') {
				this.actionflag = true;
			} else {
				this.actionflag = false;
			}
		},
		methods: {
			//驳回理由
			replaceInput() {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.reason;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.reason = endvalue;
				},50)
			},
			//整改要求
			replaceInput2() {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.demand;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.demand = endvalue;
				},50)
			},
			scrollfun() {
				// 只要滚动就清除状态
				clearTimeout(timer);
				timer = setTimeout(() => {
					if (this.curNow == 0) {
						this.old.scrollTop = this.tab0.mescroll.scrollTop;
						this.old.isScrollUp = this.tab0.mescroll.isScrollUp;
						if (this.old.scrollTop <= 20 && this.old.isScrollUp == false && this.tab0.list.length > 5) {
							this.tab0.mescroll.scrollTo(0, 0)
							this.old.scrollTop = 0;
							this.$emit('scorllway', false);
						}
						// 告知标识 -> 结束滚动
						if (this.old.scrollTop > 150 && this.old.isScrollUp == true && this.tab0.list.length > 5) {
							this.$emit('scorllway', true);
						}
					}
					if (this.curNow == 1) {
						this.old.scrollTop = this.tab1.mescroll.scrollTop;
						this.old.isScrollUp = this.tab1.mescroll.isScrollUp;
						if (this.old.scrollTop <= 20 && this.old.isScrollUp == false && this.tab1.list.length > 5) {
							this.tab1.mescroll.scrollTo(0, 0)
							this.old.scrollTop = 0;
							this.$emit('scorllway', false);
						}
						// 告知标识 -> 结束滚动
						if (this.old.scrollTop > 150 && this.old.isScrollUp == true && this.tab1.list.length > 5) {
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
					this.showAllot = false
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == 'bottom') {
					this.showAllot = false
				}
			},
			// 触摸结束事件
			touchEnd(e) {
				clearInterval(this.interval); // 清除setInterval
				this.time = 0;
			},
			//导航切换
			sectionChange(index) {
				var curTab = this.getTabData(this.curNow); //当前tab
				var newTab = this.getTabData(index); //准备切换过去的tab
				this.curNow = index;
				this.subIndex = index;


				// 如果列表没有初始化过,则初始化
				if (!newTab.isListInit) {
					// 如果列表没有初始化过,则初始化
					newTab.mescroll.resetUpScroll();
				}
				newTab.mescroll.scrollTo(0, 0)
				this.old.scrollTop = 0;
				this.$emit('scorllway', false);
			},
			// 轮播切换
			swiperChange(e) {
				var curTab = this.getTabData(this.curNow); //当前tab
				var newTab = this.getTabData(e.detail.current); //准备切换过去的tab
				this.subIndex = e.detail.current;
				this.curNow = e.detail.current;

				if (!newTab.isListInit) {
					// 如果列表没有初始化过,则初始化
					newTab.mescroll.resetUpScroll();
				}
				newTab.mescroll.scrollTo(0, 0)
				this.old.scrollTop = 0;
				this.$emit('scorllway', false);
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
					this.tab0.isListInit = true; //标记列表已初始化,保证列表只初始化一次
					//联网加载数据
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData, totalResult) => {
						let that = this;
						if (curPageData.length > 0) {
							for (var i = 0; i < curPageData.length; i++) {



								(function(i) {
									let sql1 = 'select unit_name from sys_unit where unit_id = ' + "'" + curPageData[i].unit_id +
										"'";
									selectSQL('local', sql1, res => {
										if (res.length != 0) {
											curPageData[i].unit_name = res[0].unit_name
										} else {
											curPageData[i].unit_name = "暂无"
										}
										let sql2 = 'select unit_name from sys_unit where unit_id = ' + "'" + curPageData[i].site_id +
											"'";
										selectSQL('local', sql2, res2 => {

											if (res2.length != 0) {
												curPageData[i].site_name = res2[0].unit_name
											} else {
												curPageData[i].site_name = "暂无"
											}

											let sql3 = 'select norm_id  from tb_task_detail_norm where taskdetail_id = ' + "'" + curPageData[i].taskdetail_id +
												"'";
											selectSQL('local', sql3, res3 => {

												var ids = "";
												for (var value of res3) {
													ids = ids + "'" + value.norm_id + "'" + ",";
												}
												ids = ids.substring(0, ids.length - 1);
												let sqlexecelid = 'select distinct excel_id from tb_norm where norm_id in (' + ids + ')';
												selectSQL('local', sqlexecelid, resexecelids => {

													var exeids = "";
													for (var value of resexecelids) {
														exeids = exeids + "'" + value.excel_id + "'" + ",";
													}
													exeids = exeids.substring(0, exeids.length - 1);
													let sqluserids = null;
													if (that.functionid == 1) {
														sqluserids = 'select name from tb_excel where id in (' + exeids + ')' + ' and user_id = ' +
															"'" + curPageData[i].user_id + "'";
													} else {
														sqluserids = 'select name from tb_excel where id in (' + exeids + ')';;
													}

													selectSQL('local', sqluserids, resexename => {

														var exename = "";
														for (var value of resexename) {
															exename = exename + value.name + " ";
														}
														exename = exename.substring(0, exeids.length - 1);
														curPageData[i].normname = exename

														let sqluser = 'select name from sys_user where user_id = ' + "'" + curPageData[i].group_id +
															"'";
														selectSQL('local', sqluser, resuser => {
															curPageData[i].groupuser = resuser[0].name

															let sqltasktype = 'select type,task_name from tb_task where task_id = ' + "'" +
																curPageData[i].task_id +
																"'";

															selectSQL('local', sqltasktype, restasktype => {
																curPageData[i].tasktype = restasktype[0].type
																curPageData[i].task_name = restasktype[0].task_name
																if (i == curPageData.length - 1) {

																	//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
																	//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
																	mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
																	//设置列表数据
																	if (mescroll.num == 1) that.tab0.list = []; //如果是第一页需手动制空列表

																	that.tab0.list = that.tab0.list.concat(curPageData); //追加新数据


																}

															})

														})



													})

												})

											})

										})
									})
								})(i);
							}


						} else {
							//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
							//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
							mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
							//设置列表数据
							if (mescroll.num == 1) this.tab0.list = []; //如果是第一页需手动制空列表
							this.tab0.list = this.tab0.list.concat(curPageData); //追加新数据

						}



					}, () => {
						if (mescroll.num == 1) this.tab0.isListInit = false;
						mescroll.endErr(); //联网失败的回调,隐藏下拉刷新的状态
					})
				} else if (mescroll.tabType == 1) {
					this.tab1.isListInit = true; //标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData, totalResult) => {

						let that = this;
						if (curPageData.length > 0) {
							for (var i = 0; i < curPageData.length; i++) {
								(function(i) {
									let sql1 = 'select unit_name from sys_unit where unit_id = ' + "'" + curPageData[i].unit_id +
										"'";
									selectSQL('local', sql1, res => {

										if (res.length != 0) {
											curPageData[i].unit_name = res[0].unit_name
										} else {
											curPageData[i].unit_name = "暂无"
										}
										let sql2 = 'select unit_name from sys_unit where unit_id = ' + "'" + curPageData[i].site_id +
											"'";
										selectSQL('local', sql2, res2 => {

											if (res2.length != 0) {
												curPageData[i].site_name = res2[0].unit_name
											} else {
												curPageData[i].site_name = "暂无"
											}

											let sql3 = 'select norm_id  from tb_task_detail_norm where taskdetail_id = ' + "'" + curPageData[i].taskdetail_id +
												"'";
											selectSQL('local', sql3, res3 => {

												var ids = "";
												for (var value of res3) {
													ids = ids + "'" + value.norm_id + "'" + ",";
												}
												ids = ids.substring(0, ids.length - 1);
												let sqlexecelid = 'select distinct excel_id from tb_norm where norm_id in (' + ids + ')';
												selectSQL('local', sqlexecelid, resexecelids => {

													var exeids = "";
													for (var value of resexecelids) {
														exeids = exeids + "'" + value.excel_id + "'" + ",";
													}
													exeids = exeids.substring(0, exeids.length - 1);
													let sqluserids = null;
													if (that.functionid == 1) {
														sqluserids = 'select name from tb_excel where id in (' + exeids + ')' + ' and user_id = ' +
															"'" + curPageData[i].user_id + "'";
													} else {
														sqluserids = 'select name from tb_excel where id in (' + exeids + ')';;
													}

													selectSQL('local', sqluserids, resexename => {

														var exename = "";
														for (var value of resexename) {
															exename = exename + value.name + " ";
														}
														exename = exename.substring(0, exeids.length - 1);
														curPageData[i].normname = exename

														let sqluser = 'select name from sys_user where user_id = ' + "'" + curPageData[i].group_id +
															"'";
														selectSQL('local', sqluser, resuser => {
															curPageData[i].groupuser = resuser[0].name

															let sqltasktype = 'select type,task_name from tb_task where task_id = ' + "'" +
																curPageData[i].task_id +
																"'";
															selectSQL('local', sqltasktype, restasktype => {
																curPageData[i].tasktype = restasktype[0].type
																curPageData[i].task_name = restasktype[0].task_name
																if (i == curPageData.length - 1) {
																	mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
																	//设置列表数据
																	if (mescroll.num == 1) that.tab1.list = []; //如果是第一页需手动制空列表
																	that.tab1.list = that.tab1.list.concat(curPageData); //追加新数据


																}

															})

														})



													})


												})





											})



										})



									})
								})(i);
							}


						} else {
							mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
							//设置列表数据
							if (mescroll.num == 1) this.tab1.list = []; //如果是第一页需手动制空列表
							this.tab1.list = this.tab1.list.concat(curPageData); //追加新数据

						}

					}, () => {

						if (mescroll.num == 1) this.tab1.isListInit = false;
						mescroll.endErr(); //联网失败的回调,隐藏下拉刷新的状态
					})


				}
			},


			getListDataFromNet(tabcur, pageNum, pageSize, successCallback, errorCallback) {
				switch (tabcur) {
					case 0:
						let sql = 'select COUNT(id) as totalResult from tb_group_report where user_id = ' + "'" + uni.getStorageSync(
							"USER_ID") + "'" + ' and status = 0';
						selectSQL('local', sql, res => {

							if (res.length != 0) {
								var totalResult = res[0].totalResult;
								var pages = Math.floor(totalResult / pageSize);
								var surplus = totalResult - Math.floor(totalResult / pageSize) * pageSize
								if (surplus > 0) {
									pages = pages + 1;
								}
								var pagebegin = (pageNum - 1) * pageSize;
								pagebegin = "'" + pagebegin + "'";
								var size = "'" + pageSize + "'";
								var company_id = "'" + uni.getStorageSync("USER_ID") + "'";
								let selectuser =
									'select u.id,u.task_id,u.taskdetail_id,u.againtaskid,u.remarkUn,u.unit_id,u.site_id,u.total_issue,u.group_id,u.view_id,u.user_id,u.type,u.status,u.solve,u.create_time,u.updatetime,u.solveask,u.reconfire,c.name as jname from tb_group_report u left join tb_task_detail r on u.taskdetail_id = r.taskdetail_id left join sys_user c on r.user_id = c.user_id where u.user_id = ' +
									company_id + ' and u.status = 0' + ' order by u.create_time desc limit ' +
									size + ' offset ' + pagebegin;


								this.selectUser(selectuser, totalResult, successCallback);
							} else {
								console.log("查询用户总数量报错")
								return;
							}
						})
						break;
					case 1:

						let sql1 = 'select COUNT(id) as totalResult from tb_group_report where user_id = ' + "'" + uni.getStorageSync(
							"USER_ID") + "'" + ' and status = 1';
						selectSQL('local', sql1, res => {
							if (res.length != 0) {

								var totalResult = res[0].totalResult;
								var pages = Math.floor(totalResult / pageSize);
								var surplus = totalResult - Math.floor(totalResult / pageSize) * pageSize
								if (surplus > 0) {
									pages = pages + 1;
								}
								var pagebegin = (pageNum - 1) * pageSize;
								pagebegin = "'" + pagebegin + "'";
								var size = "'" + pageSize + "'";
								var company_id = "'" + uni.getStorageSync("USER_ID") + "'";

								let selectuser =
									'select  u.id, u.task_id, u.taskdetail_id, u.againtaskid, u.remarkUn, u.unit_id, u.site_id, u.total_issue, u.group_id, u.view_id, u.user_id, u.type, u.status, u.solve, u.create_time, u.updatetime, u.solveask,u.reconfire,c.name as jname from tb_group_report u left join tb_task_detail r on u.taskdetail_id = r.taskdetail_id left join sys_user c on r.user_id = c.user_id  where u.user_id = ' +
									company_id + ' and  u.status = 1' + ' order by  u.create_time desc limit ' +
									size + ' offset ' + pagebegin;




								this.selectRole(selectuser, totalResult, successCallback);
							} else {
								return;
							}
						})
						break;
				}
			},
			selectUser(url, pages, successCallback) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						successCallback && successCallback(res, pages);
					} else {
						successCallback && successCallback(res, pages);
						return;
					}
				})
			},
			selectRole(url, pages, successCallback) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						successCallback && successCallback(res, pages);
					} else {
						successCallback && successCallback(res, pages);
						return;
					}
				})
			},
			//分配
			allot(item) {
				this.choosetime = ''
				this.startDate = ''
				this.endDate = ''
				this.demand = ''
				this.collapseList = []
				let that = this;
				let sql = 'select id from tb_excel where user_id = ' + "'" + item.user_id + "'";
				selectSQL('local', sql, res => {
					var ids = "";
					for (var value of res) {
						ids = ids + "'" + value.id + "'" + ",";
					}
					ids = ids.substring(0, ids.length - 1);
					let sqlnormids =
						'select x.id as xid,x.item as xitem,r.norm_id as rnorm_id,r.name as rname,c.id as cid,c.name as cname,u.question as uquestion from tb_task_detail_norm u left join tb_norm r on u.norm_id=r.norm_id left join tb_excel c on r.excel_id = c.id left join tb_norm_detail x on u.norm_detail_id = x.id where u.taskdetail_id = ' +
						"'" + item.taskdetail_id + "'" + ' and u.question != 0 and r.excel_id in (' + ids + ')' + ' group by x.id';
					selectSQL('local', sqlnormids, resnormids => {
						console.log(resnormids)
						let sql2 =
							'select u.user_id as id,u.name as text from sys_user u left join sys_role r on u.role_id=r.role_id where 1=1 and u.status = 0 and r.status = 0 and r.function_id = 2 and u.company_id = ' +
							"'" + uni.getStorageSync('company_id') + "'";
						selectSQL('local', sql2, res2 => {
							console.log(res2)
								that.personSheetList = res2;
								var arr1 = []
								for (var i = 0; i < resnormids.length; i++) {
									(function(i) {
										if (arr1.map(a => a.id).indexOf(resnormids[i].cid) == -1) {
											var ar = {
												id: resnormids[i].cid,
												detail: resnormids[i].cname,
												person: '',
												personid: '',
												question:0,
												isShow: false
											}
											var child = [];
											resnormids.forEach(val => {
												if (child.map(b => b.id).indexOf(val.rnorm_id) == -1 && ar.id == val.cid) {
													var ar1 = {
														id: val.rnorm_id,
														detail: val.rname,
														person: '',
														personid: '',
														question:0,
														isShow: false
													}
													var child1 = [];
													resnormids.forEach(val1 => {
														if (child1.map(c => c.id).indexOf(val1.xid) == -1 && ar.id == val1.cid && ar1.id == val1.rnorm_id) {
															 ar.question = ar.question +  Number(val1.uquestion);
															 ar1.question = ar1.question + Number(val1.uquestion);
															var ar2 = {
																id: val1.xid,
																detail: val1.xitem,
																person: '',
																personid: '',
																question:val1.uquestion,
																isShow: false
															}
															child1.push(ar2)
														}
													})
													ar1.child = child1;
													child.push(ar1);
												}
											});
											ar.child = child;
											arr1.push(ar)
										}
									})(i);
								}
								this.collapseList = arr1
								console.log(this.collapseList)
								this.allotitem = item;
								this.showAllot = true;
							}


						)

					})
				})
			},
			changetime(e) {
				if (e.startDate == '0-00-00' || e.endDate == '0-00-00') {
					this.showtime = true;
					this.$refs.uToast.show({
						title: '请选择开始日期与结束日期',
						type: 'warning'
					})

				} else {
					this.startDate = e.startDate;
					this.endDate = e.endDate;
					this.choosetime = e.startDate + '-' + e.endDate;
					this.showtime = false;
				}
			},
			emptytime() {
				this.startDate = '';
				this.endDate = '';
				this.choosetime = '';
				this.$refs.calendar.init();
				this.showtime = false;
			},
			// 点击collapsehead头部
			headClick(index) {
				this.clickindex = index;
				this.collapseList[index].isShow = !this.collapseList[index].isShow;
				this.collapseList.map((e, index) => {
					if (index != this.clickindex) {
						e.isShow = false;
					}
				});
			},
			headClick2(index, index1) {
				this.clickindex = index;
				this.clickindex1 = index1;
				this.collapseList[index].child[index1].isShow = !this.collapseList[index].child[index1].isShow;
				this.collapseList[index].child.map((e, index) => {
					if (index != this.clickindex1) {
						e.isShow = false;
					}
				});
			},
			open(index) {
				this.collapseList[index].show = true;
				this.collapseList.map((val, idx) => {
					if (index != idx) this.collapseList[idx].show = false;
				});
			},
			openPerson(index) {
				this.openindex = index;
				this.showPersonList = true;
			},
			personSheetCallback(index) {
				let obj = this.collapseList[this.openindex];
				let name = this.personSheetList[index].text;
				let id = this.personSheetList[index].id;
				obj.person = name;
				obj.personid = id;
				obj.child.map(item => {
					item.person = name;
					item.personid = id;
					item.child.map(val => {
						val.person = name;
						val.personid = id;
					});
				});				
			},
			personSheetClose(){
				let obj = this.collapseList[this.openindex];
				obj.person = '';
				obj.personid = '';
				obj.child.map(item => {
					item.person = '';
					item.personid = '';
					item.child.map(val => {
						val.person = '';
						val.personid = '';
					});
				});
			},
			openchildPerson(index, index1) {
				this.openindex = index;
				this.openchildindex = index1;
				this.showPersonchildList = true;
			},
			//第二层的选中效果
			personchildSheetCallback(index) {
				let name = this.personSheetList[index].text;
				let id = this.personSheetList[index].id;
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].child[this.openchildindex]
				obj1.person = name;
				obj1.personid = id;
				obj1.child.map(item => {
					item.person = name;
					item.personid = id;
				})
				let nameArr = []
				obj.child.map(item=>{
					if(item.person!=""){
						nameArr.push({
							name:item.person,
							id:item.personid
						})
					}
				})
				let Arr=this.unique(nameArr)
				if (Arr.length == 1&&nameArr.length==obj.child.length) {
					obj.person =Arr[0].name
					obj.personid =Arr[0].id
				}else{
					obj.person ='......'
					obj.personid =''
				}
			},
			personchildSheetClose(){
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].child[this.openchildindex]
				obj1.person =''
				obj1.personid =''
				obj1.child.map(item => {
					item.person = "";
					item.personid = "";
				})
				let nameArr = []
				obj.child.map(item=>{
					if(item.person==""){
						nameArr.push({
							name:item.person,
							id:item.personid
						})
					}
				})
				if (nameArr.length==obj.child.length) {
					obj.person ='';
					obj.personid = '';
				}else{
					obj.person ='......';
					obj.personid = '';
				}
				
			},
			openchild2Person(index, index1, index2) {
				this.openindex = index;
				this.openchildindex = index1;
				this.openchild2index = index2;
				this.showPersonchild2List = true;
			},
			//第三层的选中效果
			personchild2SheetCallback(index) {
				let name = this.personSheetList[index].text;
				let id = this.personSheetList[index].id;
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].child[this.openchildindex]
				let obj2=this.collapseList[this.openindex].child[this.openchildindex].child[this.openchild2index]
				obj2.person = name;
				obj2.personid = id;
				let nameArr = []
				obj1.child.map(item=>{
					if(item.person!=""){
						nameArr.push({
							name:item.person,
							id:item.personid
						})
					}
				})
				let Arr=this.unique(nameArr)
				if (Arr.length == 1&&nameArr.length==obj1.child.length) {
					obj1.person =Arr[0].name
					obj1.personid =Arr[0].id
					if(obj.child.length==1){
						obj.person =Arr[0].name
						obj.personid =Arr[0].id
					}else{
						obj.person ='......'
						obj.personid =''
					}
				}else{
					obj1.person ='......'
					obj1.personid =''
					obj.person ='......'
					obj.personid =''
				}
				
			},
			personchild2SheetClose() {
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].child[this.openchildindex]
				let obj2=this.collapseList[this.openindex].child[this.openchildindex].child[this.openchild2index]
				obj2.person ='';
				obj2.personid = '';
				let nameArr = []
				obj1.child.map(item=>{
					if(item.person==""){
						nameArr.push({
							name:item.person,
							id:item.personid
						})
					}
				})
				if (nameArr.length==obj1.child.length) {
					obj.person ='';
					obj.personid = '';
					obj1.person =''
					obj1.personid =''
				}else{
					obj.person ='......';
					obj.personid = '';
					obj1.person ='......'
					obj1.personid ='';
				}
			},
			close() {
				this.showAllot = false;
			},
			cancel() {
				this.showAllot = false;
				this.demand = null;
				this.startDate = null;
				this.endDate = null;
				this.collapseList = [];
				this.personSheetList = []
			},

			unique1(arr) {
				if (!Array.isArray(arr)) {
					console.log('type error!')
					return
				}
				var array = [];
				for (var i = 0; i < arr.length; i++) {
					if (array.indexOf(arr[i]) === -1) {
						array.push(arr[i])
					}
				}
				return array;
			},

			//分配确定按钮
			sure() {
				if (this.lock) return;
				this.lock = true;
				var obj = JSON.parse(this.allotitem.reconfire.replace("\\", ""));
				var tole = 0;
				obj.forEach(val => {
					if (val.scoretype == 1 && val.questionscore != "0") {
						tole = tole + 1;
					}
				})
				
				var checknumber = [];
				obj.forEach(val => {
					if (val.scoretype == 1 && val.questionscore != "0") {
						checknumber.push(val.task_name + val.citem + val.ritem);
					}
				})
				var relcheck = this.unique1(checknumber);
				var reltotle = relcheck.length;
				var person = []
				this.collapseList.map(item => {
					item.child.map(val => {
						val.child.map(key => {
							if (person.map(c => c.userid).indexOf(key.personid) == -1) {
								var per = {
									"userid": key.personid,
									"norm": [{
										"normid": val.id,
										"detailids": [key.id]
									}]
								}
								person.push(per)
							} else {
								var dex = person.map(c => c.userid).indexOf(key.personid);
								if (person[dex].norm.map(x => x.normid).indexOf(val.id) == -1) {
									var ar = {
										"normid": val.id,
										"detailids": [key.id]
									}
									person[dex].norm.push(ar)
								} else {
									var adex = person[dex].norm.map(x => x.normid).indexOf(val.id);
									if (person[dex].norm[adex].normid == val.id) {
										person[dex].norm[adex].detailids.push(key.id)
									}
								}
							}
						});
					});
				});


				var k = 0;
				for (var i = 0; i < person.length; i++) {
					if (person[i].userid == '') {
						k = k + 1;
					}
				}

				if (k == person.length) {
					this.$refs.uToast.show({
						title: '请先指派人员',
						type: 'warning'
					});
					this.lock = false;
					return;
				}

				if (!this.choosetime) {
					this.$refs.uToast.show({
						title: '请选择整改期限',
						type: 'warning'
					});
					this.lock = false;
					return;
				}

				if (!this.demand) {
					this.$refs.uToast.show({
						title: '请输入整改要求',
						type: 'warning'
					});
					this.lock = false;
					return;
				}
				if (this.demand.length > 200) {
					this.$refs.uToast.show({
						title: '整改要求范围为1-200字',
						type: 'warning'
					});
					this.lock = false;
					return;
				}
				uni.showLoading({
					title: '请稍后...'
				})


				let sqlcountstatus = 'update tb_group_report set status = ' + "'" + "1" + "'" +
					"," + ' againtaskid = ' + "'" + "" + "'" + "," + ' solveask = ' + "'" + this.demand + "'" + "," +
					' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where id = ' + "'" + this.allotitem.id + "'";

				executeSQL("local", sqlcountstatus, rescountstatus => {})
				var againidss = "";
				let that = this;
				person.forEach(per => {
					if(per.userid != ''){					
					var taskid = helper.uuid();
					var taskdetailid = helper.uuid();
					if(againidss == ""){
						againidss = taskdetailid;
					}else{
						againidss = againidss + "," + taskdetailid;
					}
					let sqltask = 'select task_name,unit_id,site_id,location from tb_task where task_id = ' + "'" + that.allotitem
						.task_id + "'";
					selectSQL('local', sqltask, restask => {
						var detailids = [];
						per.norm.forEach(pernorm => {
							pernorm.detailids.forEach(pernormdetailids => {
								detailids.push(pernormdetailids)
							})
						})
						var ids = "";
						for (var value of detailids) {
							ids = ids + "'" + value + "'" + ",";
						}
						ids = ids.substring(0, ids.length - 1);	
						var times = that.choosetime.split("-");
						var starttime = times[0] + "/" + times[1] + "/" + times[2];
						var endtime = times[3] + "/" + times[4] + "/" + times[5];
						starttime = new Date(starttime).getTime();
						endtime = new Date(endtime).getTime();
						var taskname = restask[0].task_name + "(整改)";

						let inserttask = 'insert into tb_task values (' + "'" + taskid + "'" + "," + "'" + taskname +
							"'" + "," +
							"'" + restask[0].unit_id + "'" + "," + "'" + restask[0].site_id + "'" + "," + "'" + starttime + "'" +
							"," + "'" + endtime +
							"'" + "," + "'" + restask[0].location + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() +
							"'" + "," + "'" +
							"1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + "," + "'" + "0" +
							"'" + "," + "'" + "2" + "'" + "," + "'" + "0" + "'" + "," + "'" + per.userid + "'" + "," + "'" + "0" +
							"'" + "," + "'" + "2" + "'" +
							' ) ';
						executeSQL("local", inserttask, resintask => {
							let inserttaskdetail = 'insert into tb_task_detail values (' + "'" + taskdetailid + "'" + "," + "'" +
								taskid +
								"'" + "," +
								"'" + "0" + "'" + "," + "'" + "0" + "'" + "," + "'" + "0" + "'" + "," + "'" +
								new Date().getTime() + "'" + "," + "'" + "" + "'" + "," + "'" + per.userid + "'" + "," + "'" +
								"2" +
								"'" + "," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + "," +
								"'" + "2" + "'" + "," + "'" + "0" + "'" + ' ) ';
							executeSQL("local", inserttaskdetail, resintaskdetail => {

								per.norm.forEach(pernorm1 => {
									pernorm1.detailids.forEach(pernormdetailids1 => {
										let sqltbtaskdetailnorm =
											'select tasknormid,task_id,taskdetail_id,norm_id,norm_detail_id,totlecheck,status,question,losescroe,score,hascheck,user_id from tb_task_detail_norm where taskdetail_id = ' +
											"'" + that.allotitem
											.taskdetail_id + "'" + ' and norm_id = ' + "'" + pernorm1.normid + "'" +
											' and norm_detail_id = ' + "'" + pernormdetailids1 + "'";
										selectSQL('local', sqltbtaskdetailnorm, restbtaskdetailnorm => {

											let sqltolenumber =
												'select count(tasknormdetailid) as totle from tb_task_detail_norm_detail where tasknormid = ' +
												"'" + restbtaskdetailnorm[0].tasknormid + "'" + ' and isproblem = 1';
											selectSQL('local', sqltolenumber, restole => {
												
												
											let sql88 = 'update tb_task set totlecheck = totlecheck + ' + "'" + restole[0].totle +
												"'" + "," + ' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + taskid +
												"'";
											executeSQL("local", sql88, res88 => {})

											let sql99 = 'update tb_task_detail set totlecheck = totlecheck + ' + "'" + restole[0].totle +
												"'" + "," + ' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + taskdetailid +
												"'";
											executeSQL("local", sql99, res99 => {})
											
											
											
											let sql77 = 'update tb_task set totolequestion = totolequestion + ' + "'" + restbtaskdetailnorm[0].question +
												"'" + "," + ' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + taskid +
												"'";
											executeSQL("local", sql77, res77 => {})
											
											
											let sql66 = 'update tb_task_detail set totlequestion = totlequestion + ' + "'" + restbtaskdetailnorm[0].question +
												"'" + "," + ' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + taskdetailid +
												"'";
											executeSQL("local", sql66, res66 => {})
											

												var uuid11 = helper.uuid();
												let inserttaskdetailnorm = 'insert into tb_task_detail_norm values (' + "'" + uuid11 +
													"'" +
													"," + "'" + taskid +
													"'" + "," +
													"'" + taskdetailid + "'" + "," + "'" + pernorm1.normid + "'" + "," + "'" +
													pernormdetailids1 + "'" +
													"," + "'" +
													restole[0].totle + "'" + "," + "'" + "0" + "'" + "," + "'" + restbtaskdetailnorm[0].question +
													"'" +
													"," + "'" +
													restbtaskdetailnorm[0].losescroe +
													"'" + "," + "'" + restbtaskdetailnorm[0].score + "'" + "," + "'" + "0" + "'" + "," +
													"'" + per.userid + "'" +
													"," +
													"'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
													' ) ';
													
													
													
													
												executeSQL("local", inserttaskdetailnorm, resdetailnorm => {
													let sqltbtaskdetailnormdetail =
														'select tasknormdetailid,tasknormid,norm_detail_id,score,isproblem,status,user_id  from tb_task_detail_norm_detail where tasknormid = ' +
														"'" + restbtaskdetailnorm[0].tasknormid + "'" + ' and isproblem = 1';
													selectSQL('local', sqltbtaskdetailnormdetail, restbtaskdetailnormdetail => {

														restbtaskdetailnormdetail.forEach(value1 => {
															var uuid1 = helper.uuid();
															let inserttbtaskdetailnormdetail =
																'insert into tb_task_detail_norm_detail values (' +
																"'" + uuid1 + "'" + "," +
																"'" + uuid11 + "'" + "," +
																"'" + value1.norm_detail_id + "'" + "," + "'" + value1.score + "'" + "," + "'" +
																value1.isproblem +
																"'" + "," + "'" + "0" + "'" + "," + "'" + per.userid + "'" + "," + "'" +
																"1" +
																"'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																' ) ';
															executeSQL("local", inserttbtaskdetailnormdetail, res8 => {
																let sql8 =
																	'select tasknormdetailid,norm_row_id,score_type,score,status,problempicture,remark,correct,correctremark,correctpicture from tb_task_detail_checkrow where tasknormdetailid = ' +
																	"'" + value1.tasknormdetailid + "'" + ' and score_type = 1 and score != 0';
																selectSQL('local', sql8, res9 => {
																	res9.forEach(value2 => {
																		let inserttbtaskdetailcheckrow =
																			'insert into tb_task_detail_checkrow values (' + "'" + uuid1 + "'" +
																			"," +
																			"'" + value2.norm_row_id + "'" + "," +
																			"'" + value2.score_type + "'" + "," + "'" + value2.score + "'" + "," +
																			"'" +
																			value2.status +
																			"'" + "," + "'" + value2.problempicture + "'" + "," + "'" + value2.remark +
																			"'" + "," + "'" + that.demand + "'" + "," + "'" + value2.correctremark +
																			"'" + "," + "'" + value2.correctpicture + "'" + "," + "'" + "1" +
																			"'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																			' ) ';
																		executeSQL("local", inserttbtaskdetailcheckrow, res10 => {})
																	})
																})
															})

														})

													})
												})

											})

										})

									})
								})

							})
						})
					})
					}
				});
				let updateagaintaskid = 'update tb_group_report set againtaskid = ' + "'" + againidss + "'" +
					"," +' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where id = ' + "'" + that.allotitem.id + "'";
				executeSQL("local", updateagaintaskid, resagaintaskid => {})
				setTimeout(() => {
					this.lock = false;
					uni.hideLoading()
					this.showAllot = false;
					var curTab = this.getTabData(this.curNow); //当前tab
					curTab.mescroll.resetUpScroll();
				}, 1500)
			},
			//数组对象去重
			changeArr(arr, key) {
				var result = [];
				var obj = {};
				for (var i = 0; i < arr.length; i++) {
					if (!obj[arr[i].module]) {
						result.push(arr[i]);
						obj[arr[i].module] = true;
					}
				}
				return result;
			},
			//数组去重操作
			unique(arr) {
				// return Array.from(new Set(arr))
				let obj = {};				
				let peon = arr.reduce((cur,next) => {
				    obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
				    return cur;
				},[]) 
				return peon
			},
			see(item) {
				if (this.seelock) return;
				this.seelock = true;
				var obj = JSON.parse(item.reconfire.replace("\\", ""));
				uni.navigateTo({
					url: '../../pages/problem/list?param=' + JSON.stringify(obj)
				});
				setTimeout(() => {
					this.seelock = false;
				}, 500)
			},
			jump(item) {
				if (this.jumplock) return;
				this.jumplock = true;
				let that = this;
				var numList =  {"title": "检查人员",nameList:[]};
				var numList1 = {"title": "检查组长",nameList:[]};
				var numList3 = {"title": "整改人员",nameList:[]};
				var numList4 = {"title": "整改组长",nameList:[]};
				var numList2 = {"title": "审核人员",nameList:[]};
				var userids = item.view_id.split(",");
				let sqltask = 'select type from tb_task_detail where taskdetail_id = ' + "'" + item.taskdetail_id +
					"'";
				selectSQL('local', sqltask, restask => {
					if(restask[0].type == 1){
						var num1 = {"name": item.groupuser}
						numList1.nameList.push(num1);
						var nums = {"name": uni.getStorageSync('NAME')}
						numList2.nameList.push(nums);
						var ids = "";
						for (var value of userids) {
							ids = ids + "'" + value + "'" + ",";
						}
						ids = ids.substring(0, ids.length - 1);
						let sqluser = 'select name from sys_user where user_id in (' + ids + ')';
						selectSQL('local', sqluser, resuser => {
							numList.nameList = resuser;
							var agintask = item.againtaskid.split(",");
							var ids1 = "";
							for (var value of agintask) {
								if(value != "" && value !=null){
									ids1 = ids1 + "'" + value + "'" + ",";
								}
							}
							ids1 = ids1.substring(0, ids1.length - 1);
							
							let sqlagintask = 'select u.task_id as utask_id,r.taskdetail_id as rtaskdetail_id,r.user_id as ruser_id,t.user_id as tuser_id,c.name as cname,x.function_id as xfunction_id from tb_task_detail u left join tb_task_detail r on u.task_id = r.task_id left join tb_task t on r.task_id = t.task_id left join sys_user c on r.user_id = c.user_id left join sys_role x on c.role_id = x.role_id where u.taskdetail_id in (' + ids1 + ')';
							selectSQL('local', sqlagintask, resagintask => {
								
								for (var value of resagintask) {
									
									var x = {"name": value.cname};
									
									numList3.nameList.push(x);
									if(value.ruser_id == value.tuser_id){
										numList4.nameList.push(x)
									}  
								}	
                                
								var ar = [numList,numList1,numList3,numList4,numList2];
								
								uni.navigateTo({
									url: '../../pages/process/process?list=' + JSON.stringify(ar)
								});
								setTimeout(() => {
									that.jumplock = false;
								}, 500)	
									
							})				
						})	
					}else if(restask[0].type == 2){
						var num1 = {"name": item.groupuser}
						numList4.nameList.push(num1);
						var nums = {"name": uni.getStorageSync('NAME')}
						numList2.nameList.push(nums);
						
						var ids = "";
						for (var value of userids) {
							ids = ids + "'" + value + "'" + ",";
						}
						ids = ids.substring(0, ids.length - 1);
						let sqluser = 'select name from sys_user where user_id in (' + ids + ')';
						selectSQL('local', sqluser, resuser => {
							numList3.nameList = resuser;
							let sqlagin1 = 'select group_id,view_id from tb_group_report where againtaskid like "%' + item.taskdetail_id + '%"';
							selectSQL('local', sqlagin1, resagin1 => {
								   
									if(resagin1.length !=0){
									let sqlgroupname = 'select name from sys_user where user_id = ' + "'" + resagin1[0].group_id + "'";	  
									selectSQL('local', sqlgroupname, resgroupname => {
										var num11 = {"name": resgroupname[0].name}
										numList1.nameList.push(num11);
										var viewids = resagin1[0].view_id.split(",");
										var ids2 = "";
										for (var value of viewids) {
											ids2 = ids2 + "'" + value + "'" + ",";
										}
										ids2 = ids2.substring(0, ids2.length - 1);
										let sqlviewuser = 'select name from sys_user where user_id in (' + ids2 + ')';
										selectSQL('local', sqlviewuser, resviewuser => {
											numList.nameList = resviewuser;
											var ar = [numList,numList1,numList3,numList4,numList2];
											uni.navigateTo({
												url: '../../pages/process/process?list=' + JSON.stringify(ar)
											});
											setTimeout(() => {
												that.jumplock = false;
											}, 500)	
										})
									})
									}
							})			
						})	
	
					}	
				})
				
				
				
				
				
				
			},
			pass1(item) {

				this.pass1item = item;
				this.showPass = true;
			},
			pass2(item) {
				this.pass2item = item;
				this.showPass2 = true;
			},

			pass3(item) {
				this.pass3item = item;
				this.showPass3 = true;
			},
			passConfirm() {
				if (this.lockpass1) return;
				this.lockpass1 = true
				var item = this.pass1item
				let sqlcountstatus = 'update tb_group_report set status = ' + "'" + "1" + "'" +
					"," + ' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where id = ' + "'" + item.id + "'";
				executeSQL("local", sqlcountstatus, rescountstatus => {
					this.showPass = false;
					setTimeout(() => {
						this.lockpass1 = false;
					}, 500)
					this.tab0.mescroll.resetUpScroll();
					this.tab1.mescroll.resetUpScroll();
				})



			},

			passConfirm2() {
				if (this.lockpass2) return;
				this.lockpass2 = true
				var item = this.pass2item
				let sql1 = 'update tb_task set status = 8' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + item.task_id +
					"'";
				executeSQL("local", sql1, res1 => {
					let sql2 = 'update tb_task_detail set status = 8' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
						"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + item.taskdetail_id +
						"'";
					executeSQL("local", sql2, res2 => {})
				})
				let sqlcountstatus = 'update tb_group_report set status = ' + "'" + "1" + "'" +
					"," + ' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where id = ' + "'" + item.id + "'";
				executeSQL("local", sqlcountstatus, rescountstatus => {
					this.showPass2 = false;
					setTimeout(() => {
						this.lockpass2 = false;
					}, 500)

					this.tab0.mescroll.resetUpScroll();
					this.tab1.mescroll.resetUpScroll();

				})
			},

			passConfirm3() {
				if (this.lockpass3) return;
				this.lockpass3 = true;
				var item = this.pass3item

				let sql =
					'select taskdetail_id,task_id,totlequestion,totlecheck,hascheck,user_id from tb_task_detail where task_id = ' +
					"'" + item.task_id + "'" + ' and user_id = ' + "'" + item.group_id + "'";
				selectSQL('local', sql, res => {

					let sql1 =
						'select taskdetail_id,task_id,totlequestion,totlecheck,hascheck,user_id from tb_task_detail where taskdetail_id = ' +
						"'" + item.taskdetail_id + "'";
					selectSQL('local', sql1, res1 => {

						var totlequestion = Number(res[0].totlequestion) + Number(res1[0].totlequestion)
						var totlecheck = Number(res[0].totlecheck) + Number(res1[0].totlecheck)
						var hascheck = Number(res[0].hascheck) + Number(res1[0].hascheck)
						let status = totlecheck == hascheck ? 4 : 3;
						let sql2 = 'update tb_task_detail set status = ' + "'" + status + "', " + ' totlequestion = ' + "'" +
							totlequestion + "'" + "," + ' totlecheck = ' + "'" + totlecheck + "'" + "," + ' hascheck = ' + "'" +
							hascheck + "'" + "," + ' direty = 1 ' + "," + ' updatetime = ' + "'" + new Date().getTime() + "'" +
							'  where taskdetail_id = ' + "'" + res[0].taskdetail_id + "'";
						executeSQL("local", sql2, res2 => {

							let sql3 = 'select totolequestion,hascheck from tb_task where task_id = ' + "'" + item.task_id + "'";
							selectSQL('local', sql3, res3 => {

								var totleque = Number(res3[0].totolequestion) + Number(res1[0].totlequestion)
								var hasch = Number(res3[0].hascheck) + Number(res1[0].hascheck)
								let sql4 = 'update tb_task set totolequestion = ' + "'" + totleque + "'" + "," + ' hascheck = ' + "'" +
									hasch + "'" + "," + ' direty = 1 ' + "," + ' updatetime = ' +
									"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + item.task_id +
									"'";
								executeSQL("local", sql4, res4 => {

									let sql5 =
										'select tasknormid,task_id,norm_id,norm_detail_id,totlecheck,status,question,losescroe,score,hascheck,user_id from tb_task_detail_norm where taskdetail_id = ' +
										"'" + item.taskdetail_id + "'";
									selectSQL('local', sql5, res5 => {

										res5.forEach(value => {
											var uuid = helper.uuid();

											let inserttaskdetailnorm = 'insert into tb_task_detail_norm values (' + "'" + uuid + "'" +
												"," +
												"'" + value.task_id + "'" + "," +
												"'" + res[0].taskdetail_id + "'" + "," + "'" + value.norm_id + "'" + "," + "'" + value.norm_detail_id +
												"'" + "," + "'" + value.totlecheck + "'" + "," + "'" + value.status + "'" + "," + "'" + value
												.question + "'" + "," + "'" + value
												.losescroe +
												"'" + "," + "'" + value.score + "'" + "," + "'" + value.hascheck + "'" + "," + "'" + value.user_id +
												"'" + "," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() +
												"'" +
												' ) ';

											executeSQL("local", inserttaskdetailnorm, res6 => {
												let sql6 =
													'select tasknormdetailid,tasknormid,norm_detail_id,score,isproblem,status,user_id from tb_task_detail_norm_detail where tasknormid = ' +
													"'" + value.tasknormid + "'";
												selectSQL('local', sql6, res7 => {

													res7.forEach(value1 => {
														var uuid1 = helper.uuid();
														let inserttbtaskdetailnormdetail =
															'insert into tb_task_detail_norm_detail values (' +
															"'" + uuid1 + "'" + "," +
															"'" + uuid + "'" + "," +
															"'" + value1.norm_detail_id + "'" + "," + "'" + value1.score + "'" + "," + "'" +
															value1.isproblem +
															"'" + "," + "'" + value1.status + "'" + "," + "'" + value1.user_id + "'" + "," + "'" +
															"1" +
															"'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
															' ) ';
														executeSQL("local", inserttbtaskdetailnormdetail, res8 => {

															let sql8 =
																'select tasknormdetailid,norm_row_id,score_type,score,status,problempicture,remark,correct,correctremark,correctpicture from tb_task_detail_checkrow where tasknormdetailid = ' +
																"'" + value1.tasknormdetailid + "'";
															selectSQL('local', sql8, res9 => {

																res9.forEach(value2 => {
																	let inserttbtaskdetailcheckrow =
																		'insert into tb_task_detail_checkrow values (' + "'" + uuid1 + "'" + "," +
																		"'" + value2.norm_row_id + "'" + "," +
																		"'" + value2.score_type + "'" + "," + "'" + value2.score + "'" + "," +
																		"'" +
																		value2.status +
																		"'" + "," + "'" + value2.problempicture + "'" + "," + "'" + value2.remark +
																		"'" + "," + "'" + value2.correct + "'" + "," + "'" + value2.correctremark +
																		"'" + "," + "'" + value2.correctpicture + "'" + "," + "'" + "1" +
																		"'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																		' ) ';
																	executeSQL("local", inserttbtaskdetailcheckrow, res10 => {})
																})
															})
														})

													})
												})
											})
										})
									})
								})
							})

						})
					})
				})

				let sqlde = 'update tb_task_detail set status = 8' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + item.taskdetail_id +
					"'";
				executeSQL("local", sqlde, resde => {})


				let updatestatus = 'update tb_group_report set status = ' + "'" + "1" + "'" +
					"," + ' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where id = ' + "'" + item.id + "'";
				executeSQL("local", updatestatus, rescountstatus => {
					this.showPass3 = false;
					setTimeout(() => {
						this.lockpass3 = false;
					}, 500)
					this.tab0.mescroll.resetUpScroll();
					this.tab1.mescroll.resetUpScroll();
				})

			},
			//驳回
			refuse(id, index) {
				this.show = true;
				this.id = id;
				this.rejectindex = index;
			},
			refuse1(item) {
				this.pass5item = item;
				this.show = true;

			},

			refuse2(item) {
				this.pass5item = item;
				this.show = true;
			},
			//确认驳回
			confirm() {
				if (this.refuselock) return;
				this.refuselock = true;
				if (!this.reason) {
					uni.showToast({
						title: '驳回理由不能为空',
						icon: 'none'
					});
					this.$refs.uModal.clearLoading();
					this.reason = '';
					this.refuselock = false;
					return;
				} else {
					var item = this.pass5item
					item.reason = this.reason;
					let sqltask =
						'select u.user_id as uuser_id,r.user_id as ruser_id from tb_task_detail u left join tb_task r on u.task_id = r.task_id  where u.taskdetail_id = ' +
						"'" + item.taskdetail_id + "'";
					selectSQL('local', sqltask, restask => {

						if (restask[0].uuser_id == restask[0].ruser_id) {
							let sql1 = 'update tb_task set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
								"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + item.task_id +
								"'";
							executeSQL("local", sql1, res1 => {})

							let sql2 = 'update tb_task_detail set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
								"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + item.taskdetail_id +
								"'";
							executeSQL("local", sql2, res2 => {})

							let that = this;
							var arrquestion = [];
							let sql = 'select id from tb_excel where user_id = ' + "'" + item.user_id + "'";
							selectSQL('local', sql, res => {
								var ids = "";
								for (var value of res) {
									ids = ids + "'" + value.id + "'" + ",";
								}
								ids = ids.substring(0, ids.length - 1);
								let sqlnormids = null
								if (that.functionid == 1) {
									sqlnormids =
										'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm u left join tb_norm r on u.norm_id=r.norm_id  where u.taskdetail_id = ' +
										"'" + item.taskdetail_id + "'" + ' and r.excel_id in (' + ids + ')';
								} else {
									sqlnormids =
										'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm  u  where u.taskdetail_id = ' +
										"'" + item.taskdetail_id + "'";

								}

								selectSQL('local', sqlnormids, resnormids => {

									var tasknormids = "";
									for (var value of resnormids) {
										tasknormids = tasknormids + "'" + value.tasknormid + "'" + ",";
									}
									tasknormids = tasknormids.substring(0, tasknormids.length - 1);
									let sqltasknormids =
										'select u.tasknormdetailid,u.norm_detail_id,r.serial,r.item as ritem,c.item as citem from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id left join tb_norm_detail c on r.parent_id = c.id where u.tasknormid in (' +
										tasknormids + ')';
									selectSQL('local', sqltasknormids, restasknormdetailid => {

										for (var i = 0; i < restasknormdetailid.length; i++) {
											(function(i) {
												let sqlquestion =
													'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,u.updatetime,r.content from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
													"'" + restasknormdetailid[i].tasknormdetailid + "'";
												selectSQL('local', sqlquestion, resquestion => {
													for (var j = 0; j < resquestion.length; j++) {
														(function(j) {
															 if(!(resquestion[j].score == "0" && resquestion[j].problempicture == "" && resquestion[j].remark == "" && resquestion[j].correctpicture == "" && resquestion[j].correctremark == "")){
															
															if (item.tasktype == 1) {
																var qes = {
																	"task_name": item.task_name,
																	"serial": restasknormdetailid[i].serial,
																	"status": resquestion[j].status,
																	"unit_name": item.unit_name,
																	"ritem": restasknormdetailid[i].ritem,
																	"citem": restasknormdetailid[i].citem,
																	"tasktype": item.tasktype,
																	"grouper": item.groupuser,
																	"questioncontent": resquestion[j].content,
																	"questionscore": resquestion[j].score,
																	"questionpicture": resquestion[j].problempicture,
																	"questionremark": resquestion[j].remark,
																	"solveask": resquestion[j].correct,
																	"correctpicture": resquestion[j].correctpicture,
																	"correctremark": resquestion[j].correctremark,
																	"correcttime": "",
																	"scoretype": resquestion[j].score_type
																}
																arrquestion.push(qes)
															} else if (item.tasktype == 2) {
																var qes = {
																	"task_name": item.task_name,
																	"serial": restasknormdetailid[i].serial,
																	"status": resquestion[j].status,
																	"unit_name": item.unit_name,
																	"ritem": restasknormdetailid[i].ritem,

																	"citem": restasknormdetailid[i].citem,
																	"tasktype": item.tasktype,
																	"grouper": item.groupuser,
																	"questioncontent": resquestion[j].content,
																	"questionscore": resquestion[j].score,
																	"questionpicture": resquestion[j].problempicture,
																	"questionremark": resquestion[j].remark,
																	"solveask": resquestion[j].correct,
																	"correctpicture": resquestion[j].correctpicture,
																	"correctremark": resquestion[j].correctremark,
																	"correcttime": resquestion[j].updatetime,
																	"scoretype": resquestion[j].score_type
																}
																arrquestion.push(qes)
															} else if (item.tasktype == 3) {
																var qes = {
																	"task_name": item.task_name,
																	"serial": restasknormdetailid[i].serial,
																	"status": resquestion[j].status,
																	"unit_name": item.unit_name,
																	"ritem": restasknormdetailid[i].ritem,
																	"citem": restasknormdetailid[i].citem,
																	"tasktype": item.tasktype,
																	"grouper": item.groupuser,
																	"questioncontent": resquestion[j].content,
																	"questionscore": resquestion[j].score,
																	"questionpicture": resquestion[j].problempicture,
																	"questionremark": resquestion[j].remark,
																	"solveask": resquestion[j].correct,
																	"correctpicture": resquestion[j].correctpicture,
																	"correctremark": resquestion[j].correctremark,
																	"correcttime": "",
																	"scoretype": resquestion[j].score_type
																}
																arrquestion.push(qes)
															}
}
															if (i == restasknormdetailid.length - 1 && j == resquestion.length - 1) {
																var toles = 0;
																arrquestion.forEach(vals => {
																	if (vals.scoretype == "0" && vals.questionscore != "0") {
																		toles = toles + 1;
																	}
																})

																var uuid = helper.uuid();
																let insert = 'insert into tb_group_report values (' + "'" + uuid + "'" + "," +
																	"'" + item.task_id +
																	"'" + "," +
																	"'" + item.taskdetail_id + "'" + "," + "'" + "" + "'" + "," + "'" + "" +
																	"'" +
																	"," + "'" + item.unit_id + "'" + "," + "'" + item.site_id +
																	"'" + "," + "'" + item.total_issue + "'" + "," + "'" + item.group_id + "'" + "," + "'" +
																	item.view_id + "'" + "," + "'" + item.group_id + "'" + "," + "'" +
																	"0" + "'" + "," + "'" + "0" + "'" + "," + "'" + toles + "'" + "," + "'" + new Date().getTime() +
																	"'" +
																	"," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																	"," +
																	"'" +
																	item.reason + "'" + "," + "'" + JSON.stringify(arrquestion) + "'" + ' ) ';

																executeSQL("local", insert, resinsert => {});

																let sqlcountstatus = 'update tb_group_report set status = ' + "'" + "1" + "'" +
																	"," + ' direty = 1 ' + "," + ' updatetime = ' +
																	"'" + new Date().getTime() + "'" + ' where id = ' + "'" + item.id + "'";
																executeSQL("local", sqlcountstatus, rescountstatus => {

																	that.show = false;
																	that.reason = '';
																	setTimeout(() => {
																		that.refuselock = false;
																	}, 500)

																	that.tab0.mescroll.resetUpScroll();
																	that.tab1.mescroll.resetUpScroll();
																})
															}
														})(j);
													}
												})

											})(i);

										}

									})

								})
							})
						} else {
							let sql2 = 'update tb_task_detail set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
								"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + item.taskdetail_id +
								"'";
							executeSQL("local", sql2, res2 => {})


							let that = this;
							var arrquestion = [];
							let sql = 'select id from tb_excel where user_id = ' + "'" + item.user_id + "'";
							selectSQL('local', sql, res => {
								var ids = "";
								for (var value of res) {
									ids = ids + "'" + value.id + "'" + ",";
								}
								ids = ids.substring(0, ids.length - 1);
								let sqlnormids = null
								if (that.functionid == 1) {
									sqlnormids =
										'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm u left join tb_norm r on u.norm_id=r.norm_id  where u.taskdetail_id = ' +
										"'" + item.taskdetail_id + "'" + ' and r.excel_id in (' + ids + ')';
								} else {
									sqlnormids =
										'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm  u  where u.taskdetail_id = ' +
										"'" + item.taskdetail_id + "'";
								}

								selectSQL('local', sqlnormids, resnormids => {
									var tasknormids = "";
									for (var value of resnormids) {
										tasknormids = tasknormids + "'" + value.tasknormid + "'" + ",";
									}
									tasknormids = tasknormids.substring(0, tasknormids.length - 1);
									let sqltasknormids =
										'select u.tasknormdetailid,u.norm_detail_id,r.serial,r.item as ritem,c.item as citem from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id left join tb_norm_detail c on r.parent_id = c.id where u.tasknormid in (' +
										tasknormids + ')';
									selectSQL('local', sqltasknormids, restasknormdetailid => {
										for (var i = 0; i < restasknormdetailid.length; i++) {
											(function(i) {
												let sqlquestion =
													'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,u.updatetime,r.content from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
													"'" + restasknormdetailid[i].tasknormdetailid + "'";
												selectSQL('local', sqlquestion, resquestion => {
													for (var j = 0; j < resquestion.length; j++) {
														(function(j) {
															 if(!(resquestion[j].score == "0" && resquestion[j].problempicture == "" && resquestion[j].remark == "" && resquestion[j].correctpicture == "" && resquestion[j].correctremark == "")){
															if (item.tasktype == 1) {
																var qes = {
																	"task_name": item.task_name,
																	"serial": restasknormdetailid[i].serial,
																	"status": resquestion[j].status,
																	"unit_name": item.unit_name,
																	"ritem": restasknormdetailid[i].ritem,
																	"citem": restasknormdetailid[i].citem,
																	"tasktype": item.tasktype,
																	"grouper": item.jname,
																	"questioncontent": resquestion[j].content,
																	"questionscore": resquestion[j].score,
																	"questionpicture": resquestion[j].problempicture,
																	"questionremark": resquestion[j].remark,
																	"solveask": resquestion[j].correct,
																	"correctpicture": resquestion[j].correctpicture,
																	"correctremark": resquestion[j].correctremark,
																	"correcttime": "",
																	"scoretype": resquestion[j].score_type
																}
																arrquestion.push(qes)
															} else if (item.tasktype == 2) {
																var qes = {
																	"task_name": item.task_name,
																	"serial": restasknormdetailid[i].serial,
																	"status": resquestion[j].status,
																	"unit_name": item.unit_name,
																	"ritem": restasknormdetailid[i].ritem,

																	"citem": restasknormdetailid[i].citem,
																	"tasktype": item.tasktype,
																	"grouper": item.jname,
																	"questioncontent": resquestion[j].content,
																	"questionscore": resquestion[j].score,
																	"questionpicture": resquestion[j].problempicture,
																	"questionremark": resquestion[j].remark,
																	"solveask": resquestion[j].correct,
																	"correctpicture": resquestion[j].correctpicture,
																	"correctremark": resquestion[j].correctremark,
																	"correcttime": resquestion[j].updatetime,
																	"scoretype": resquestion[j].score_type
																}
																arrquestion.push(qes)
															} else if (item.tasktype == 3) {
																var qes = {
																	"task_name": item.task_name,
																	"serial": restasknormdetailid[i].serial,
																	"status": resquestion[j].status,
																	"unit_name": item.unit_name,
																	"ritem": restasknormdetailid[i].ritem,
																	"citem": restasknormdetailid[i].citem,
																	"tasktype": item.tasktype,
																	"grouper": item.jname,
																	"questioncontent": resquestion[j].content,
																	"questionscore": resquestion[j].score,
																	"questionpicture": resquestion[j].problempicture,
																	"questionremark": resquestion[j].remark,
																	"solveask": resquestion[j].correct,
																	"correctpicture": resquestion[j].correctpicture,
																	"correctremark": resquestion[j].correctremark,
																	"correcttime": "",
																	"scoretype": resquestion[j].score_type
																}
																arrquestion.push(qes)
															}
}
															if (i == restasknormdetailid.length - 1 && j == resquestion.length - 1) {

																var toles = 0;
																arrquestion.forEach(vals => {
																	if (vals.scoretype == "0" && vals.questionscore != "0") {
																		toles = toles + 1;
																	}
																})


																var uuid = helper.uuid();
																let insert = 'insert into tb_group_report values (' + "'" + uuid + "'" + "," +
																	"'" + item.task_id +
																	"'" + "," +
																	"'" + item.taskdetail_id + "'" + "," + "'" + "" + "'" + "," + "'" + "" +
																	"'" +
																	"," + "'" + item.unit_id + "'" + "," + "'" + item.site_id +
																	"'" + "," + "'" + item.total_issue + "'" + "," + "'" + item.group_id + "'" + "," + "'" +
																	item.view_id + "'" + "," + "'" + item.view_id + "'" + "," + "'" +
																	"0" + "'" + "," + "'" + "0" + "'" + "," + "'" + toles + "'" + "," + "'" + new Date().getTime() +
																	"'" +
																	"," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																	"," +
																	"'" +
																	item.reason + "'" + "," + "'" + JSON.stringify(arrquestion) + "'" + ' ) ';
																executeSQL("local", insert, resinsert => {});

																let sqlcountstatus = 'update tb_group_report set status = ' + "'" + "1" + "'" +
																	"," + ' direty = 1 ' + "," + ' updatetime = ' +
																	"'" + new Date().getTime() + "'" + ' where id = ' + "'" + item.id + "'";
																executeSQL("local", sqlcountstatus, rescountstatus => {
																	that.show = false;
																	that.reason = '';
																	setTimeout(() => {
																		that.refuselock = false;
																	}, 500)
																	that.tab0.mescroll.resetUpScroll();
																	that.tab1.mescroll.resetUpScroll();
																})

															}
														})(j);
													}
												})
											})(i);

										}

									})

								})
							})
						}
					})

				}
			}

		}
	};
</script>

<style lang="less" scoped>
	/deep/.u-subsection {
		padding: 0 10rpx !important;
		border-radius: 0 !important;
	}

	.model {
		padding: 30rpx;
	}

	.roleModel {
		width: 100%;
		position: relative;
		padding-top: 90rpx;
		padding-bottom: 120rpx;

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
			z-index: 99;
		}

		.content {
			padding: 30rpx;
			.title {
				color: #007aff;
				font-size: 32rpx;
				margin-bottom: 30rpx;
			}

			.collapsePart {
				margin-bottom: 60rpx;
				border: 2rpx solid #f6f6f6;

				.u-collapse-head {
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #333333;
					font-size: 28rpx;
					line-height: 1;
					padding: 10rpx 6rpx;
					text-align: left;
					border-bottom: 2rpx solid #f6f6f6;

					.action {
						display: flex;
						justify-content: space-between;
						margin-left: 20rpx;
						width: 50%;

						.right {
							font-size: 26rpx;
							color: #2979ff;
							margin: 4rpx;
						}

						.red {
							color: #fa3534;
						}
					}
				}

				.u-collapse-title {
					flex: 1;
					width: 100%;
					line-height: 60rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					.badge-msg {
						color: #999999;
						padding-left: 10rpx;
					}
				}

				.u-arrow-down-icon {
					transition: all 0.3s;
					margin-right: 20rpx;
					margin-left: 14rpx;
				}

				.u-arrow-down-icon-active {
					transform: rotate(180deg);
					transform-origin: center center;
				}

				.u-collapse-body {
					transition: all 0.3s;
				}

				.u-collapse-content {
					font-size: 26rpx;
					color: #666;
					text-align: left;
					padding: 10rpx 6rpx;

					.childPart {
						border-bottom: 2rpx solid #f6f6f6;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 10rpx 0;

						.left {
							flex: 1;
							width: 100%;
							line-height: 50rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							padding-left: 60rpx;
							position: relative;
							.badge-msg {
								color: #999999;
							}
						}

						.action {
							display: flex;
							justify-content: space-between;
							width: 40%;
							margin-left: 20rpx;

							.right {
								font-size: 24rpx;
								color: #2979ff;
								margin: 4rpx;
							}

							.red {
								color: #fa3534;
							}
						}
					}
				}
			}

			.form {
				width: 100%;

				.border {
					border-bottom: 2rpx solid #f6f6f6;
				}

				.form-part {
					margin: 20rpx 0;
					display: flex;
					justify-content: space-between;
					width: 100%;
					padding: 20rpx 0;

					.form-title {
						color: #333333;
						font-size: 30rpx;
						margin-right: 20rpx;
					}

					.form-right {
						width: 100%;
						flex: 1;

						.time {
							color: #606266;
							font-size: 28rpx;
							display: flex;
							justify-content: flex-end;

							.gray {
								color: #999999;
							}

							view {
								margin-right: 10rpx;

								text {
									margin: 0 10rpx;
								}
							}
						}
					}
				}
			}
		}

		.roleAction {
			position: fixed;
			bottom: 0;
			height: 100rpx;
			line-height: 100rpx;
			display: flex;
			justify-content: space-around;
			font-size: 32rpx;
			width: 100%;
			background: #ffffff;
			border-top: 2rpx solid #f6f6f6;
			align-items: center;

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
	}

	.swipe {
		// background: #FFFFFF;
		padding: 20rpx 30rpx;

		.wrap {
			position: relative;
		}
	}

	.schedulepart {
		.part {
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			border: 2rpx solid #f6f6f6;
			background: #ffffff;
			position: relative;

			.statu {
				display: flex;
				justify-content: space-between;
				height: 60rpx;
				line-height: 60rpx;
				align-items: center;

				.left {
					background: #19be6b;
					color: #ffffff;
					font-size: 30rpx;
					width: 160rpx;
					min-width: 160rpx;
					text-align: center;
					border-radius: 20rpx 0 20rpx 0;
				}

				.green {
					background: #19be6b;
				}

				.blue {
					background: #5794f9;
				}

				.yellow {
					background: #ff9900;
				}


				.time {
					color: #999999;
					font-size: 28rpx;
					margin-right: 20rpx;
				}
			}

			.main {
				padding: 20rpx;

				.line {
					height: 50rpx;
					line-height: 50rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
					font-size: 30rpx;

					.detail {
						width: 100%;
						flex: 1;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						color: #606266;
					}

					.title {
						color: #333333;
						margin-right: 20rpx;
						width: 150rpx;
					}
				}
			}

			.prograss {
				padding: 30rpx 20rpx;
				border-top: 2rpx solid #f6f6f6;

				.namerefuse {
					display: flex;
					justify-content: flex-start;
					align-items: center;

					.nameicon {
						display: flex;
						align-items: center;

						.refuse {
							color: #fa3534;
							font-size: 28rpx;
							padding-left: 6rpx;
						}
					}

					.detail {
						width: 80%;
						font-size: 28rpx;
						padding-left: 20rpx;
						color: #606266;
					}
				}

				.prograss-part {
					display: flex;
					justify-content: flex-start;

					.prograss-item {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 20%;

						.dots {
							width: 30rpx;
							height: 30rpx;
							border-radius: 40rpx;
							background: #18b566;
						}
					}
				}
			}

			.pos {
				position: absolute;
				top: 60%;
			}

			.action-part {
				display: flex;
				justify-content: flex-end;
				font-size: 28rpx;
				width: 100%;
				padding-bottom: 10rpx;

				.see {
					width: 100rpx;
					text-align: center;
					border: 2rpx solid #2979ff;
					color: #2979ff;
					margin-right: 20rpx;
					padding: 10rpx 20rpx;
					border-radius: 10rpx;
				}

				.allot {
					width: 100rpx;
					text-align: center;
					border: 2rpx solid #ff9900;
					color: #ff9900;
					margin-right: 20rpx;
					padding: 10rpx 20rpx;
					border-radius: 10rpx;
				}

				.pass {
					width: 100rpx;
					text-align: center;
					border: 2rpx solid #18b566;
					color: #18b566;
					margin-right: 20rpx;
					padding: 10rpx 20rpx;
					border-radius: 10rpx;
				}

				.refuse {
					width: 100rpx;
					text-align: center;
					border: 2rpx solid #dd6161;
					color: #dd6161;
					margin-right: 20rpx;
					padding: 10rpx 20rpx;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
