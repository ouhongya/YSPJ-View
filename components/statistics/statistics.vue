<template>
	<view class="statistics">
		<u-sticky :offset-top="offset">
			<view>
				<u-tabs :list="sublist" :is-scroll="false" :current="curNow" @change="sectionChange"
					active-color="#6ecac3" bg-color="#f6fff9" height="90"></u-tabs>
				<view class="condition">
					<view class="search-part" v-if="functionid != 3" v-show="curNow == 0 || curNow == 1">
						<view class="limit">
							<u-input v-model="fromlist.list1" type="select" :border="true" @click="openlist1()"
								height="70" placeholder="选择单位" />
						</view>
					</view>
					<view class="search-part" v-if="functionid != 3" v-show="curNow == 0 || curNow == 2">
						<view class="limit">
							<u-input v-model="fromlist.list3" type="select" :border="true" @click="openlist3()"
								height="70" placeholder="选择标准" />
						</view>
					</view>
					<view class="table-button" @click="my_js.onClick">
						导出
					</view>
				</view>
			</view>
		</u-sticky>

		<view class="table-part">
			<scroll-view :scroll-top="scrollTop" :style="{ height: subHeight - funHeight + 'px' }" @scroll="scroller"
				scroll-y="true">
				<view id="mini_poster">
					<view class="part" v-show="curNow == 0">
						<view class="table-title">
							<view class="left">
								<view class="line"></view>
								<view class="txt">总体完成情况</view>
							</view>
						</view>
						<view class="empty" v-if="table1Flag">
							<a-empty :changing="false"></a-empty>
						</view>
						<view class="table-content1" v-else><canvas canvas-id="table1" id="table1" class="charts1"
								@touchstart="touchRing"></canvas></view>
					</view>
					<view class="part" v-if="curNow == 0||curNow == 1">
						<view class="table-title">
							<view class="left">
								<view class="line"></view>
								<view class="txt" v-if="functionid == 1">总体完成明细表</view>
								<view class="txt" v-else>检查进度明细表</view>
							</view>
						</view>
						<view class="table-content2">
							<u-table>
								<u-tr v-if="functionid == 1">
									<u-th>单位</u-th>
									<u-th>检查进度</u-th>
									<u-th>问题数量</u-th>
									<u-th>状态</u-th>
								</u-tr>
								<u-tr v-else>
									<u-th>任务名称</u-th>
									<u-th>检查进度</u-th>
									<u-th>问题数量</u-th>
									<u-th>状态</u-th>
								</u-tr>
							</u-table>
							<view class="empty" v-if="TaskOverDetail.length == 0">
								<a-empty :changing="false"></a-empty>
							</view>
							<scroll-view scroll-y class="scrollTable" v-else>
								<u-table v-if="functionid == 1">
									<u-tr v-for="(item,index) in TaskOverDetail" :key="index">
										<u-td width="25%">{{ item.unitName==''?'暂无':item.unitName}}</u-td>
										<u-td width="25%">{{ item.censor}}/{{ item.total_censor}}</u-td>
										<u-td width="25%">{{ item.total_issue}}</u-td>
										<u-td width="25%">
											<view v-if="item.status == 1">已删除</view>
											<view v-if="item.status == 2">未开始</view>
											<view v-if="item.status == 3">进行中</view>
											<view v-if="item.status == 4">已完成</view>
											<view v-if="item.status == 5">已延期</view>
											<view v-if="item.status == 6">延期完成</view>
											<view v-if="item.status == 7">待审核</view>
											<view v-if="item.status == 8">已完结</view>
											<view v-if="item.status == 9">复检</view>
											<view v-if="item.status == 10">整改中</view>
											<view v-if="item.status == 10">已归档</view>
										</u-td>
									</u-tr>
								</u-table>
								<u-table v-if="functionid == 2||functionid == 3">
									<u-tr v-for="(item,index) in TaskOverDetail" :key="index">
										<u-td width="25%">{{ item.name==''?'暂无':item.name}}</u-td>
										<u-td width="25%">{{ item.censor}}/{{ item.total_censor}}</u-td>
										<u-td width="25%">{{ item.total_issue}}</u-td>
										<u-td width="25%">
											<view v-if="item.status == 1">已删除</view>
											<view v-if="item.status == 2">未开始</view>
											<view v-if="item.status == 3">进行中</view>
											<view v-if="item.status == 4">已完成</view>
											<view v-if="item.status == 5">已延期</view>
											<view v-if="item.status == 6">延期完成</view>
											<view v-if="item.status == 7">待审核</view>
											<view v-if="item.status == 8">已完结</view>
											<view v-if="item.status == 9">复检</view>
											<view v-if="item.status == 10">整改中</view>
											<view v-if="item.status == 10">已归档</view>
										</u-td>
									</u-tr>
								</u-table>
								<u-loadmore bg-color="none" status="nomore" margin-top="30"
									v-if="TaskOverDetail.length>10" />
							</scroll-view>
						</view>
					</view>

					<view class="part" v-if="curNow == 0||curNow == 1">
						<view class="table-title">
							<view class="left">
								<view class="line"></view>
								<view class="txt" v-if="functionid == 1">整改进度明细表</view>
								<view class="txt" v-else>整改进度明细表</view>
							</view>
						</view>
						<view class="table-content2">
							<u-table>
								<u-tr v-if="functionid == 1">
									<u-th>单位</u-th>
									<u-th>整改进度</u-th>
									<u-th>整改问题总量</u-th>
									<u-th>状态</u-th>
								</u-tr>
								<u-tr v-else>
									<u-th>任务名称</u-th>
									<u-th>整改进度</u-th>
									<u-th v-if="functionid == 2">整改问题总量</u-th>
									<u-th v-if="functionid == 3">待整改问题总量</u-th>
									<u-th>状态</u-th>
								</u-tr>
							</u-table>
							<view class="empty" v-if="TaskOverDetail1.length == 0">
								<a-empty :changing="false"></a-empty>
							</view>
							<scroll-view scroll-y class="scrollTable" v-else>
								<u-table>
									<u-tr v-for="(item,index) in TaskOverDetail1" :key="index">
										<u-td width="25%">{{item.name}}</u-td>
										<u-td width="25%">{{ item.censor}}/{{ item.total_censor}}</u-td>
										<u-td width="25%">{{ item.total_issue}}</u-td>
										<u-td width="25%">
											<view v-if="item.status == 1">已删除</view>
											<view v-if="item.status == 2">未开始</view>
											<view v-if="item.status == 3">进行中</view>
											<view v-if="item.status == 4">已完成</view>
											<view v-if="item.status == 5">已延期</view>
											<view v-if="item.status == 6">延期完成</view>
											<view v-if="item.status == 7">待审核</view>
											<view v-if="item.status == 8">已完结</view>
											<view v-if="item.status == 9">复检</view>
											<view v-if="item.status == 10">整改中</view>
											<view v-if="item.status == 10">已归档</view>
										</u-td>

									</u-tr>
								</u-table>
								<u-loadmore bg-color="none" status="nomore" margin-top="30"
									v-if="TaskOverDetail1.length>10" />
							</scroll-view>
						</view>
					</view>
					<view class="part" v-if="curNow == 0 || curNow == 1">
						<view class="table-title">
							<view class="left">
								<view class="line"></view>
								<view class="txt" v-if="functionid==1">检查单位问题统计图</view>
								<view class="txt" v-else>检查任务问题统计图</view>
							</view>
						</view>
						<view class="empty" v-if="table2Flag">
							<a-empty :changing="false"></a-empty>
						</view>
						<view class="table-content" v-else>
							<canvas canvas-id="table2" id="table2" class="charts" @touchstart="touchTable2"
								@touchmove="moveTable2" @touchend="touchEndTable2"></canvas>
						</view>
					</view>
					<!-- <view class="part" v-if="curNow == 0 || curNow == 1">
					 		<view class="table-title">
					 			<view class="left">
					 				<view class="line"></view>
					 				<view class="txt" v-if="functionid==1">检查任务问题占比图</view>
					 				<view class="txt" v-else>检查任务问题占比图</view>
					 			</view>
					 		</view>
					 		<view class="empty" v-if="table3Flag"><a-empty :changing="tablechanging"></a-empty></view>
					 		<view class="table-content2" v-else><canvas canvas-id="table3" id="table3" class="charts2" @touchstart="touchTable3"></canvas></view>
					 	</view> -->
					<!-- <view class="part" v-if="curNow == 0 || curNow == 2">
					 		<view class="table-title">
					 			<view class="left">
					 				<view class="line"></view>
					 				<view class="txt">标准统计占比图</view>
					 			</view>
					 		</view>
					 		<view class="empty" v-if="table6Flag"><a-empty :changing="tablechanging"></a-empty></view>
					 		<view class="table-content2" v-else><canvas canvas-id="table6" id="table6" class="charts2" @touchstart="touchTable6"></canvas></view>
					 	</view> -->
					<view class="part" v-if="curNow == 0 || curNow == 2">
						<view class="table-title">
							<view class="left">
								<view class="line"></view>
								<view class="txt">检查模块问题统计图</view>
							</view>
						</view>
						<view class="empty" v-if="table4Flag">
							<a-empty :changing="false"></a-empty>
						</view>
						<view class="table-content" v-else>
							<canvas canvas-id="table4" id="table4" class="charts" @touchstart="touchTable4"
								@touchmove="moveTable4" @touchend="touchEndTable4"></canvas>
						</view>
					</view>
					<view class="part" v-if="curNow == 0 || curNow == 2">
						<view class="table-title">
							<view class="left">
								<view class="line"></view>
								<view class="txt">相同问题统计图</view>
							</view>

							<view class="searchright">
								<u-input v-model="questionCount" type="number" :border="true" placeholder="最低数量"
									height="50" @blur="questionSearch" @input="replaceInput()"/>
							</view>
						</view>
						<view class="empty" v-if="table5Flag">
							<a-empty :changing="false"></a-empty>
						</view>
						<view class="table-content" v-else>
							<canvas canvas-id="table5" id="table5" class="charts" @touchstart="touchTable5"
								@touchmove="moveTable5" @touchend="touchEndTable5"></canvas>
						</view>
					</view>
					<view class="part" v-if="curNow == 0&&functionid == 1 || curNow == 3&&functionid == 1">
						<view class="table-title">
							<view class="left">
								<view class="line"></view>
								<view class="txt">工作量统计表</view>
							</view>
						</view>
						<view class="table-content2">
							<u-table>
								<u-tr>
									<u-th>姓名</u-th>
									<u-th>完成任务数</u-th>
									<u-th>发现问题数</u-th>
									<u-th>整改问题数</u-th>
									<u-th>整改首次通过率</u-th>
								</u-tr>
							</u-table>
							<view class="empty" v-if="workload.length == 0">
								<a-empty :changing="false"></a-empty>
							</view>
							<scroll-view scroll-y class="scrollTable" v-else>
								<u-table>
									<u-tr v-for="(item,index) in workload" :key="index">
										<u-td width="20%">{{ item.name}}</u-td>
										<u-td width="20%">{{ item.checked}}</u-td>
										<u-td width="20%">{{ item.total_issue}}</u-td>
										<u-td width="20%">{{ item.solved_issue}}</u-td>
										<u-td width="20%">{{ item.result}}</u-td>
									</u-tr>
								</u-table>
								<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="workload.length>10" />
							</scroll-view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--选择单位弹框 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showlist1" :mode="curMode" width="40%" height="80%" @close="close1Model">
				<view class="Model">
					<view class="toptitle">单位筛选</view>
					<view class="top-part" v-if="list1.length > 0">
						<view class="all">
							<u-checkbox-group @change="checkedAll" icon-size="40" size="44">
								<u-checkbox v-model="list1choose" active-color="#4abdb4">全部单位</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y :class="ipadFlag?'ipadH':'normalH'">
								<u-checkbox-group @change="checkboxGroupChange" :wrap="true" icon-size="36" size="40">
									<u-checkbox @change="checkboxChange" v-model="item.checked"
										v-for="(item, index) in list1" :key="index" :name="item.name"
										active-color="#4abdb4">
										{{ item.name }}
									</u-checkbox>
								</u-checkbox-group>
								<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="list1.length>10" />
							</scroll-view>
						</view>
						<view class="roleAction">
							<view class="cancel" @click="close1()">取消</view>
							<view class="sure" @click="sure1()">确定</view>
						</view>
					</view>
					<view class="empty" v-else>
						<a-empty :changing="changing"></a-empty>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 选择人员弹框 -->
		<!-- <view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showlist2" :mode="curMode" width="40%" height="80%" @close="close2Model">
				<view class="Model">
					<view class="toptitle">人员筛选</view>
					<view class="top-part" v-if="list2.length > 0">
						<view class="all">
							<u-checkbox-group @change="checkedAll2" icon-size="40" size="44">
								<u-checkbox v-model="list2choose" active-color="#4abdb4">全部人员</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y style="height:60vh;width: 100%;">
								<u-checkbox-group @change="checkboxGroupChange2" :wrap="true" icon-size="36" size="40">
									<u-checkbox
										@change="checkboxChange2"
										v-model="item.checked"
										v-for="(item, index) in list2"
										:key="index"
										:name="item.name"
										active-color="#4abdb4"
									>
										{{ item.name }}
									</u-checkbox>
								</u-checkbox-group>
							</scroll-view>
						</view>
						<view class="roleAction">
							<view class="cancel" @click="close2()">取消</view>
							<view class="sure" @click="sure2()">确定</view>
						</view>
					</view>
					<view class="empty" v-else><a-empty :changing="changing"></a-empty></view>
				</view>
			</u-popup>
		</view> -->
		<!--选择准则弹框 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showlist3" :mode="curMode" width="40%" height="80%" @close="close3Model">
				<view class="Model">
					<view class="toptitle">标准筛选</view>
					<view class="top-part" v-if="list3.length > 0">
						<view class="all">
							<u-checkbox-group @change="checkedAll3" icon-size="40" size="44">
								<u-checkbox v-model="list3choose" active-color="#4abdb4">全部标准</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y :class="ipadFlag?'ipadH':'normalH'">
								<u-checkbox-group @change="checkboxGroupChange3" :wrap="true" icon-size="36" size="40">
									<u-checkbox @change="checkboxChange3" v-model="item.checked"
										v-for="(item, index) in list3" :key="index" :name="item.name"
										active-color="#4abdb4">
										{{ item.name }}
										<text v-if="item.type == 2&&functionid!=1" class="gray">(本地)</text>
									</u-checkbox>
								</u-checkbox-group>
								<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="list3.length>10" />
							</scroll-view>
						</view>
						<view class="roleAction">
							<view class="cancel" @click="close3()">取消</view>
							<view class="sure" @click="sure3()">确定</view>
						</view>
					</view>
					<view class="empty" v-else>
						<a-empty :changing="changing"></a-empty>
					</view>
				</view>
			</u-popup>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	var timer; //判断页面滚动
	var n;//字符分割数
	import uCharts from '@/components/u-charts/u-charts.js';
	import helper from '@/common/helper.js';
	import {
		queryStatisticsFilter,
		queryStatisticsData,
		queryStatisticsQuestions
	} from '@/api/statistics.js';
	import {
		saveImage
	} from '@/api/util/saveImg.js';
	var _self;
	var table1 = null;
	var table2 = null;
	var table3 = null;
	var table4 = null;
	var table5 = null;
	var table6 = null;
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
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				// 头部导航
				curNow: 0, //当前选中
				sublist: [{
						name: '全部'
					},
					{
						name: '单位统计'
					},
					{
						name: '标准统计'
					},
					{
						name: '工作量统计'
					}
				],
				//搜索部分
				list1: [],
				showlist1: false,
				list1choose: true,
				list2: [],
				showlist2: false,
				list2choose: true,
				list3: [],
				showlist3: false,
				list3choose: true,
				fromlist: {
					list1: '全部单位',
					list2: '全部人员',
					list3: '全部标准'
				},
				pixelRatio: 1,
				//圆弧进度图
				cWidth1: '',
				cHeight1: '',
				arcbarWidth: '15',
				Ring: {
					series: []
				},
				totalRing: 0, //总数量
				//统计图(单位问题)
				cWidth2: '',
				cHeight2: '',
				arraycolor2: [],
				Unit: {
					categories: [],
					series: [{
						name: '问题总量',
						data: []
					}]
				},
				//饼图(单位问题)
				cWidth3: '',
				cHeight3: '',
				Pie: {
					series: []
				},
				// 饼图(标准统计)
				cWidth6: '',
				cHeight6: '',
				Standard: {
					series: []
				},
				//统计图(检查模块问题)
				cWidth4: '',
				cHeight4: '',
				arraycolor4: [],
				Check: {
					categories: [],
					series: [{
						name: '问题总量',
						data: []
					}]
				},
				//统计图(相同问题)
				cWidth5: '',
				cHeight5: '',
				arraycolor5: [],
				Similar: {
					categories: [],
					series: [{
						name: '所属小类',
						data: []
					}]
				},
				uid: null,
				TaskOverDetail: [],
				functionid: 1,
				workload: [],
				table1Flag: true,
				table2Flag: true,
				table3Flag: true,
				table4Flag: true,
				table5Flag: true,
				table6Flag: true,
				questionCount: 2,
				changing: false,
				tablechanging: false,
				tablechanging1: false,
				//滚动条是否显示(判断依据横轴个数大于5，true显示；否则，false不显示;)
				scorlltable2: false,
				scorlltable4: false,
				scorlltable5: false,
				//自定义柱体颜色库
				colorlist: [
					'#a0cfff',
					'#8abeb2',
					'#fab6b6',
					'#899dc0',
					'#fae371',
					'#3ebcca',
					'#c6ede8',
					'#aed7ed',
					'#94e1ff',
					'#b9e3d9',
					'#71d5a1',
					'#fc9d9a',
					'#f9cdad',
					'#ECF0F1',
					'#c8c8a9',
					'#83af9b',
					'#b6c29a',
					'#8a977b',
					'#c9ba83',
					'#ddd38c',
					'#a0bf7c',
					'#65934a',
					'#e0a09e',
					'#e1e9dc',
					'#269d81',
					'#adc3c0',
					'#608f9f',
					'#dacfcb',
					'#a6887d'
				],
				//触摸弹窗坐标及状态
				touchDotX: 0,
				touchDotY: 0,
				touchMoveX: 0,
				touchMoveY: 0,
				time: 0,
				interval: 0,
				funHeight: 30,
				TaskOverDetail1: [],
				sectionflag: true,
				ipadFlag:false,
				locksure1:false,
				locksure3:false,
				gotop:false
			};
		},
		created() {
			if (this.curMode == 'left') {
				this.ipadFlag = true;
			} else {
				this.ipadFlag = false;
			}
			if (uni.getStorageSync('functionid')) {
				this.functionid = uni.getStorageSync('functionid');
				if (this.functionid == 1) {
					this.sublist = [{
							name: '全部'
						},
						{
							name: '单位统计'
						},
						{
							name: '标准统计'
						},
						{
							name: '工作量统计'
						}
					];
				} else {
					this.sublist = [{
							name: '全部'
						},
						{
							name: '任务统计'
						},
						{
							name: '标准统计'
						}
					];
				}
			}
		},
		onLoad() {
			_self = this;
			const {
				pixelRatio
			} = uni.getSystemInfoSync();
			if (pixelRatio > 1) {
				_self.pixelRatio = 2;
			} else {
				_self.pixelRatio = 1;
			}
		},
		mounted() {
			this.uid = uni.getStorageSync('USER_ID');
			//圆弧进度图
			this.cWidth1 = uni.upx2px(690);
			this.cHeight1 = uni.upx2px(400);
			//统计图(单位问题)
			this.cWidth2 = uni.upx2px(690);
			this.cHeight2 = uni.upx2px(600);
			//饼图(单位问题)
			this.cWidth3 = uni.upx2px(690);
			this.cHeight3 = uni.upx2px(500);
			//统计图(检查模块问题)
			this.cWidth4 = uni.upx2px(690);
			this.cHeight4 = uni.upx2px(600);
			//统计图(相同问题)
			this.cWidth5 = uni.upx2px(690);
			this.cHeight5 = uni.upx2px(600);
			//饼图(标准统计)
			this.cWidth6 = uni.upx2px(690);
			this.cHeight6 = uni.upx2px(500);
			if (this.functionid != 3) {
				this.queryStatisticsFilterList();
			} else {
				this.queryStatisticsData();
			}
			const {
				windowWidth
			} = uni.getSystemInfoSync();
			n=parseInt(windowWidth/30)
		},
		methods: {
			//导航切换
			sectionChange(index) {
				if (this.sectionflag) {
					this.sectionflag = false
					this.scrollTop = this.old.scrollTop
					this.curNow = index;
					this.table1Flag = false;
					this.table2Flag = false;
					this.table3Flag = false;
					this.table4Flag = false;
					this.table5Flag = false;
					this.table6Flag = false;
					this.$nextTick(function() {						
						this.scrollTop = 0
						this.old.scrollTop = 0
						this.$emit('scorllway', false);						
						this.queryStatisticsData();
					});
				}
			},
			scroller(e) {
				// 只要滚动就清除状态
				this.old.scrollTop = e.detail.scrollTop;
				clearTimeout(timer);
				timer = setTimeout(() => {
					// 告知标识 -> 结束滚动
					if (this.old.scrollTop > 300) {
						this.$emit('scorllway', true);
					}else{
						if(this.gotop&&this.old.scrollTop<100){
							this.$emit('scorllway', false);
							this.old.scrollTop = 0;	
							this.gotop=false;
							this.$nextTick(function() {
								this.scrollTop = 0;	
								this.old.scrollTop = 0;
							});
						}
					}
					if (this.old.scrollTop <= 50) {
						this.$emit('scorllway', false);	
						this.old.scrollTop = 0;
						this.gotop=true;											
						this.$nextTick(function() {
							this.scrollTop = 0;
							this.old.scrollTop = 0;														
						});	
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
					this.showlist1 = false;
					this.showlist2 = false;
					this.showlist3 = false;
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == 'bottom') {
					this.showlist1 = false;
					this.showlist2 = false;
					this.showlist3 = false;
				}
			},
			// 触摸结束事件
			touchEnd(e) {
				clearInterval(this.interval); // 清除setInterval
				this.time = 0;
			},

			//相同问题统计图数量限制
			replaceInput(){
				let patrn = /\D|^0/g;
				setTimeout(()=>{
					let value = this.questionCount;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.questionCount = endvalue;
					
				},50)
			},
			
			questionSearch() {
				if(this.questionCount<2&&this.questionCount.length==1){
					this.$refs.uToast.show({
						title: '最低数量为2',
						type: 'warning'
					})
				    this.questionCount = 2;
				}
				this.queryStatisticsQuestions();
			},
			queryStatisticsQuestions() {
				let functionId = uni.getStorageSync('functionid');
				let list1 = [];
				let list2 = [];
				let list3 = [];
				if (functionId != 3) {
					this.list1.forEach(item => {
						if (item.checked) {
							list1.push(item.id);
						}
					});
					if (list1.length == 0) {
						this.list1.forEach(item => {
							list1.push(item.id);
						});
					}

					this.list2.forEach(item => {
						if (item.checked) {
							list2.push(item.id);
						}
					});
					if (list2.length == 0) {
						this.list2.forEach(item => {
							list2.push(item.id);
						});
					}
					if (functionId == 1) {
						this.list3.forEach(item => {
							if (item.checked) {
								if (item.type == 1) {
									item.child.forEach(val => {
										list3.push(val);
									});
								} else {
									list3.push(item.id);
								}
							}
						});
						if (list3.length == 0) {
							this.list3.forEach(item => {
								if (item.type == 1) {
									item.child.forEach(val => {
										list3.push(val);
									});
								} else {
									list3.push(item.id);
								}
							});
						}
					} else {
						this.list3.forEach(item => {
							if (item.checked) {
								list3.push(item.id);
							}
						});
						if (list3.length == 0) {
							this.list3.forEach(item => {
								list3.push(item.id);
							});
						}
					}
				} else {
					list1 = [];
					list2 = [];
					list3 = [];
				}
				queryStatisticsQuestions(this.curNow, list1, list2, list3, this.questionCount).then(res => {
					if (res.Similar == null) {
						this.table5Flag = true
					} else {
						this.table5Flag = false
						this.Similar = res.Similar;
						this.getSimilarData();
					}
				});
			},

			queryStatisticsFilterList() {
				queryStatisticsFilter().then(res => {
					this.list1 = res.unitList;
					this.list1 = this.arrayReduce(this.list1);
					this.list2 = res.userList;
					this.list2 = this.arrayReduce(this.list2);
					this.list3 = res.excelList;
					this.list3 = this.arrayReduce(this.list3);
					this.queryStatisticsData();
				});
			},
			arrayReduce(arr) {
				var obj = {};
				arr = arr.reduce(function(item, next) {
					obj[next.id] ? '' : (obj[next.id] = true && item.push(next));
					return item;
				}, []);
				return arr;
			},
			queryStatisticsData() {
				let functionId = uni.getStorageSync('functionid');
				let list1 = [];
				let list2 = [];
				let list3 = [];
				if (functionId != 3) {
					this.list1.forEach(item => {
						if (item.checked) {
							list1.push(item.id);
						}
					});
					if (list1.length == 0) {
						this.list1.forEach(item => {
							list1.push(item.id);
						});
					}

					this.list2.forEach(item => {
						if (item.checked) {
							list2.push(item.id);
						}
					});
					if (list2.length == 0) {
						this.list2.forEach(item => {
							list2.push(item.id);
						});
					}
					if (functionId == 1) {
						this.list3.forEach(item => {
							if (item.checked) {
								if (item.type == 1) {
									item.child.forEach(val => {
										list3.push(val);
									});
								} else {
									list3.push(item.id);
								}
							}
						});
						if (list3.length == 0) {
							this.list3.forEach(item => {
								if (item.type == 1) {
									item.child.forEach(val => {
										list3.push(val);
									});
								} else {
									list3.push(item.id);
								}
							});
						}

					} else {
						this.list3.forEach(item => {
							if (item.checked) {
								list3.push(item.id);
							}
						});
						if (list3.length == 0) {
							this.list3.forEach(item => {
								list3.push(item.id);
							});
						}
					}
				} else {
					list1 = [];
					list2 = [];
					list3 = [];
				}
				queryStatisticsData(this.curNow, list1, list2, list3, this.questionCount).then(res => {
					if (res.percentage == null) {
						this.table1Flag = true
					} else {
						let arrRing = [];
						arrRing.push({
							name: '已完成',
							data: res.percentage.hascheck,
							color: '#19be6b'
						})
						arrRing.push({
							name: '未完成',
							data: res.percentage.remain,
							color: '#eeeeee'
						})
						this.Ring.series = arrRing
						this.table1Flag = false
						this.getRingData();
					}
					if (res.Unit == null) {
						this.table2Flag = true
					} else {
						this.table2Flag = false
						this.Unit = res.Unit;
						this.getUnitData();
					}
					if (res.Check == null) {
						this.table4Flag = true
					} else {
						this.table4Flag = false
						this.Check = res.Check;
						this.getCheckData()
					}
					if (res.Similar == null) {
						this.table5Flag = true
					} else {
						this.table5Flag = false
						this.Similar = res.Similar;
						this.getSimilarData();
					}
					this.TaskOverDetail = res.TaskOverDetail;
					this.TaskOverDetail1 = res.TaskOverDetail1;
					if (this.functionid == 1) {
						this.workload = res.workload
					}
					setTimeout(() => {
						this.sectionflag = true
					}, 500)
				});
			},

			//圆弧进度图
			getRingData() {
				let checkRate = 0;
				let total = 0;
				this.Ring.series.map(item => {
					total += item.data;
				});
				this.totalRing = total;
				this.Ring.series.map(item => {
					if (item.name == '已完成') {
						checkRate = Math.round((item.data / total) * 100) + '%';
					}
				});
				table1 = new uCharts({
					$this: this,
					canvasId: 'table1', //这里是ID
					type: 'ring',
					fontSize: 11,
					legend: {
						show: false
					},
					extra: {
						pie: {
							offsetAngle: 0,
							ringWidth: 25 * this.pixelRatio,
							lableWidth: 15
						}
					},
					title: {
						name: checkRate,
						color: '#19be6b',
						fontSize: 20 * this.pixelRatio
					},
					subtitle: {
						name: '已完成',
						color: '#999999',
						fontSize: 12 * this.pixelRatio
					},

					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					series: this.Ring.series, //这里是数据
					animation: true,
					width: this.cWidth1 * this.pixelRatio,
					height: this.cHeight1 * this.pixelRatio,
					disablePieStroke: true,
					dataLabel: false
				});
			},
			touchRing(e) {
				let total = this.totalRing;
				table1.showToolTip(e, {
					format: function(item) {
						if (item.name == '未完成') {
							this.textList = [{
									text: '未完成 : ' + item.data,
									color: '#eeeeee'
								},
								{
									text: '总数量 : ' + total,
									color: '#ccebe9'
								}
							];
						} else {
							this.textList = [{
								text: '已完成 : ' + item.data,
								color: '#19be6b'
							}];
						}
					}
				});
			},
			//统计图(单位问题)
			getUnitData() {
				//y轴坐标展示
				let yAxisMax = 5;
				let arr = [];
				let len = 0
				this.Unit.series[0].data.map(item => {
					arr.push(item.value);
					len++
				});
				if (len > 5) {
					this.scorlltable2 = true
				} else {
					this.scorlltable2 = false
				}
				if (Math.max(...arr) >= 5) {
					yAxisMax = Math.max(...arr) + 2;
				} else {
					yAxisMax = 5;
				}
				//获取随机颜色
				// let color = "#";
				// for (var i = 0; i < 6; i++) color+=parseInt(Math.random() * 16).toString(16);
				if (table2 == null || this.arraycolor2.length == 0) {
					if (this.Unit.series[0].data > this.colorlist.length) {
						this.Unit.series[0].data.map(item => {
							let index = Math.floor(Math.random() * this.colorlist.length);
							let color = this.colorlist[index];
							this.arraycolor2.push(color);
							item.color = color;
						});
					} else {
						this.Unit.series[0].data.map((item, index) => {
							let color = this.colorlist[index];
							this.arraycolor2.push(color);
							item.color = color;
						});
					}
				} else {
					//更新数据时的颜色与第一次的数据颜色保持一致
					this.Unit.series[0].data.map((item, index) => {
						item.color = this.arraycolor2[index];
					});
				}
				//渲染图表
				table2 = new uCharts({
					$this: this,
					canvasId: 'table2',
					type: 'column',
					legend: {
						show: false
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					animation: true,
					categories: this.Unit.categories,
					series: this.Unit.series,
					enableScroll: true,
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						rotateLabel: true,
						disableGrid: true,
						itemCount: 5, //x轴单屏显示数据的数量，默认为5个
						scrollShow: this.scorlltable2, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7' //默认为 #A6A6A6
					},
					yAxis: {
						min: 0,
						max: yAxisMax,
						format: val => {
							return val.toFixed();
						}
					},
					dataLabel: true,
					width: this.cWidth2 * this.pixelRatio,
					height: this.cHeight2 * this.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: 20
						}
					}
				});
			},
			touchTable2(e) {
				if (table2 != null) {
					table2.scrollStart(e);
				}
			},
			moveTable2(e) {
				if (table2 != null) {
					table2.scroll(e);
				}
			},
			touchEndTable2(e) {
				if (table2 != null) {
					table2.scrollEnd(e);
					table2.touchLegend(e);
					table2.showToolTip(e, {
						format: function(item, category) {
							let str =category
							let	str1 ='问题总量: ' + item.data.value
							let	str2 ='总扣分: ' + item.data.score
							let strArr = [];
							for (let i = 0, l = str.length; i < l/n; i++) {
							let a = str.slice(n*i, n*(i+1));								
								if(i==0){
									strArr.push({
										text:a,
										color:'#19be6b'
									});
								}else{
									strArr.push({
										text:a,
										color:null
									});
								}
							}
							for (let j= 0, len1 = str1.length; j < len1/n; j++) {
							let b = str1.slice(n*j, n*(j+1));								
								if(j==0){
									strArr.push({
										text:b,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:b,
										color:null
									});
								}
							}
							for (let k = 0, len2 = str2.length; k < len2/n; k++) {
							let c= str2.slice(n*k, n*(k+1));								
								if(k==0){
									strArr.push({
										text:c,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:c,
										color:null
									});
								}
							}
							this.textList=strArr
							// this.textList = [{
							// 		text: category,
							// 		color: '#19be6b'
							// 	},
							// 	{
							// 		text: '问题总量 : ' + item.data.value,
							// 		color: '#fa3534'
							// 	},
							// 	{
							// 		text: '总扣分 : ' + item.data.score,
							// 		color: '#fa3534'
							// 	}
							// ];
						}
					});
				}
			},
			//饼图(单位问题)
			getPieData() {
				table3 = new uCharts({
					$this: _self,
					canvasId: 'table3',
					type: 'pie',
					fontSize: 11,
					legend: {
						show: false
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: this.Pie.series,
					animation: true,
					width: _self.cWidth3 * _self.pixelRatio,
					height: _self.cHeight3 * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					}
				});
			},
			touchTable3(e) {
				if (table3 != null) {
					table3.showToolTip(e, {
						format: function(item) {
							let str =item.name
							let	str1 ='问题总量: ' + item.data
							let	str2 ='总扣分: ' + item.score
							let strArr = [];
							for (let i = 0, l = str.length; i < l/n; i++) {
							let a = str.slice(n*i, n*(i+1));								
								if(i==0){
									strArr.push({
										text:a,
										color:'#19be6b'
									});
								}else{
									strArr.push({
										text:a,
										color:null
									});
								}
							}
							for (let j= 0, len1 = str1.length; j < len1/n; j++) {
							let b = str1.slice(n*j, n*(j+1));								
								if(j==0){
									strArr.push({
										text:b,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:b,
										color:null
									});
								}
							}
							for (let k = 0, len2 = str2.length; k < len2/n; k++) {
							let c= str2.slice(n*k, n*(k+1));								
								if(k==0){
									strArr.push({
										text:c,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:c,
										color:null
									});
								}
							}
							this.textList=strArr
							// this.textList = [{
							// 		text: item.name,
							// 		color: '#19be6b'
							// 	},
							// 	{
							// 		text: '问题总量 : ' + item.data,
							// 		color: '#fa3534'
							// 	},
							// 	{
							// 		text: '总扣分 : ' + item.score,
							// 		color: '#fa3534'
							// 	}
							// ];
						}
					});
				}
			},
			//饼图(标准统计)
			getStandardData() {
				table6 = new uCharts({
					$this: _self,
					canvasId: 'table6',
					type: 'pie',
					fontSize: 11,
					legend: {
						show: false
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: this.Standard.series,
					animation: true,
					width: _self.cWidth6 * _self.pixelRatio,
					height: _self.cHeight6 * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							lableWidth: 15
						}
					}
				});
			},
			touchTable6(e) {
				if (table6 != null) {
					table6.showToolTip(e, {
						format: function(item) {
							let str = '标准: ' + item.name
							let	str1 ='问题总量: ' + item.data
							let	str2 ='总扣分: ' + item.score
							let strArr = [];
							for (let i = 0, l = str.length; i < l/n; i++) {
							let a = str.slice(n*i, n*(i+1));								
								if(i==0){
									strArr.push({
										text:a,
										color:'#19be6b'
									});
								}else{
									strArr.push({
										text:a,
										color:null
									});
								}
							}
							for (let j= 0, len1 = str1.length; j < len1/n; j++) {
							let b = str1.slice(n*j, n*(j+1));								
								if(j==0){
									strArr.push({
										text:b,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:b,
										color:null
									});
								}
							}
							for (let k = 0, len2 = str2.length; k < len2/n; k++) {
							let c= str2.slice(n*k, n*(k+1));								
								if(k==0){
									strArr.push({
										text:c,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:c,
										color:null
									});
								}
							}
							this.textList=strArr
							// this.textList = [{
							// 		text: '标准 : ' + item.name,
							// 		color: '#19be6b'
							// 	},
							// 	{
							// 		text: '问题总量 : ' + item.data,
							// 		color: '#fa3534'
							// 	},
							// 	{
							// 		text: '总扣分 : ' + item.score,
							// 		color: '#fa3534'
							// 	}
							// ];
						}
					});
				}
			},
			//统计图(检查模块问题)
			getCheckData() {
				//y轴坐标展示
				let yAxisMax = 5;
				let arr = [];
				let len = 0
				this.Check.series[0].data.map(item => {
					arr.push(item.value);
					len++
				});
				if (len > 5) {
					this.scorlltable4 = true
				} else {
					this.scorlltable4 = false
				}
				if (Math.max(...arr) >= 5) {
					yAxisMax = Math.max(...arr) + 2;
				} else {
					yAxisMax = 5;
				}
				//获取随机颜色
				// let color = "#";
				// for (var i = 0; i < 6; i++) color+=parseInt(Math.random() * 16).toString(16);
				if (table4 == null || this.arraycolor4.length == 0) {
					if (this.Check.series[0].data > this.colorlist.length) {
						this.Check.series[0].data.map(item => {
							let index = Math.floor(Math.random() * this.colorlist.length);
							let color = this.colorlist[index];
							this.arraycolor4.push(color);
							item.color = color;
						});
					} else {
						this.Check.series[0].data.map((item, index) => {
							let color = this.colorlist[index];
							this.arraycolor4.push(color);
							item.color = color;
						});
					}
				} else {
					//更新数据时的颜色与第一次的数据颜色保持一致
					this.arraycolor4.map((i, index) => {
						if (this.Check.series[0].data[index] != null) {
							this.Check.series[0].data[index].color = i;
						}
					});
				}
				//渲染图表
				table4 = new uCharts({
					$this: this,
					canvasId: 'table4',
					type: 'column',
					legend: {
						show: false
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: 1,
					animation: true,
					categories: this.Check.categories,
					series: this.Check.series,
					enableScroll: true,
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						rotateLabel: true,
						disableGrid: true,
						itemCount: 5, //x轴单屏显示数据的数量，默认为5个
						scrollShow: this.scorlltable4, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7' //默认为 #A6A6A6
					},
					yAxis: {
						min: 0,
						max: yAxisMax,
						format: val => {
							return val.toFixed();
						}
					},
					dataLabel: true,
					width: this.cWidth4 * this.pixelRatio,
					height: this.cHeight4 * this.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: 20
						}
					}
				});
			},
			touchTable4(e) {
				if (table4 != null) {
					table4.scrollStart(e);
				}
			},
			moveTable4(e) {
				if (table4 != null) {
					table4.scroll(e);
				}
			},
			touchEndTable4(e) {
				if (table4 != null) {
					table4.scrollEnd(e);
					table4.touchLegend(e);
					table4.showToolTip(e, {
						format: function(item, category) {
							let str = '所属标准: '+ item.data.belong
							let	str1 ='模块名称: '+ category
							let	str2 ='问题总量: '+ item.data.value
							let strArr = [];
							for (let i = 0, l = str.length; i < l/n; i++) {
							let a = str.slice(n*i, n*(i+1));								
								if(i==0){
									strArr.push({
										text:a,
										color:'#19be6b'
									});
								}else{
									strArr.push({
										text:a,
										color:null
									});
								}
							}
							for (let j= 0, len1 = str1.length; j < len1/n; j++) {
							let b = str1.slice(n*j, n*(j+1));								
								if(j==0){
									strArr.push({
										text:b,
										color:'#19be6b'
									});
								}else{
									strArr.push({
										text:b,
										color:null
									});
								}
							}
							for (let k = 0, len2 = str2.length; k < len2/n; k++) {
							let c= str2.slice(n*k, n*(k+1));								
								if(k==0){
									strArr.push({
										text:c,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:c,
										color:null
									});
								}
							}
							this.textList=strArr
							// this.textList = [{
							// 		text: '所属标准 : ' + item.data.belong,
							// 		color: '#19be6b'
							// 	},
							// 	{
							// 		text: '模块名称 : ' + category,
							// 		color: '#19be6b'
							// 	},
							// 	{
							// 		text: '问题总量 : ' + item.data.value,
							// 		color: '#fa3534'
							// 	}
							// ];
						}
					});
				}
			},
			//统计图(相同问题)
			getSimilarData() {
				//y轴坐标展示
				let yAxisMax = 5;
				let arr = [];
				let len = 0
				this.Similar.series[0].data.map(item => {
					arr.push(item.value);
					len++
				});
				if (len > 5) {
					this.scorlltable5 = true
				} else {
					this.scorlltable5 = false
				}
				if (Math.max(...arr) >= 5) {
					yAxisMax = Math.max(...arr) + 2;
				} else {
					yAxisMax = 5;
				}
				//获取随机颜色
				// let color = "#";
				// for (var i = 0; i < 6; i++) color+=parseInt(Math.random() * 16).toString(16);
				if (table5 == null || this.arraycolor5.length == 0) {
					if (this.Similar.series[0].data.length > this.colorlist.length) {
						this.Similar.series[0].data.map(item => {
							let index = Math.floor(Math.random() * this.colorlist.length);
							let color = this.colorlist[index];
							this.arraycolor5.push(color);
							item.color = color;
						});
					} else {
						this.Similar.series[0].data.map((item, index) => {
							let color = this.colorlist[index];
							this.arraycolor5.push(color);
							item.color = color;
						});
					}
				} else {
					//更新数据时的颜色与第一次的数据颜色保持一致
					this.arraycolor5.map((i, index) => {
						if (this.Similar.series[0].data[index] != null) {
							this.Similar.series[0].data[index].color = i;
						}
					});
				}
				//渲染图表
				table5 = new uCharts({
					$this: this,
					canvasId: 'table5',
					type: 'column',
					legend: {
						show: false
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					animation: true,
					categories: this.Similar.categories,
					series: this.Similar.series,
					enableScroll: true, //开启图表拖拽功能
					xAxis: {
						type: 'grid',
						gridType: 'dash',
						rotateLabel: true,
						disableGrid: true,
						itemCount: 5, //x轴单屏显示数据的数量，默认为5个
						scrollShow: this.scorlltable5, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#DEE7F7' //默认为 #A6A6A6
					},
					yAxis: {
						min: 0,
						max: yAxisMax,
						format: val => {
							return val.toFixed();
						}
					},
					dataLabel: true,
					width: this.cWidth5 * this.pixelRatio,
					height: this.cHeight5 * this.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: 20
						}
					}
				});
			},
			touchTable5(e) {
				if (table5 != null) {
					table5.scrollStart(e);
				}
			},
			moveTable5(e) {
				if (table5 != null) {
					table5.scroll(e);
				}
			},
			touchEndTable5(e) {
				if (table5 != null) {
					table5.scrollEnd(e);
					table5.touchLegend(e);
					table5.showToolTip(e, {
						format: function(item, category) {
							let str = '所属标准: '+ item.data.belong
							let	str1 ='模块小类: '+ category
							let	str2 ='问题内容: '+ item.data.content
							let	str3 ='问题总量: '+ item.data.value
							let strArr = [];
							for (let i = 0, l = str.length; i < l/n; i++) {
							let a = str.slice(n*i, n*(i+1));								
								if(i==0){
									strArr.push({
										text:a,
										color:'#19be6b'
									});
								}else{
									strArr.push({
										text:a,
										color:null
									});
								}
							}
							for (let j= 0, len1 = str1.length; j < len1/n; j++) {
							let b = str1.slice(n*j, n*(j+1));								
								if(j==0){
									strArr.push({
										text:b,
										color:'#19be6b'
									});
								}else{
									strArr.push({
										text:b,
										color:null
									});
								}
							}
							for (let k = 0, len2 = str2.length; k < len2/n; k++) {
							let c= str2.slice(n*k, n*(k+1));								
								if(k==0){
									strArr.push({
										text:c,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:c,
										color:null
									});
								}
							}
							for (let z = 0, len3 = str3.length; z < len3/n; z++) {
							let d= str3.slice(n*z, n*(z+1));								
								if(z==0){
									strArr.push({
										text:d,
										color:'#fa3534'
									});
								}else{
									strArr.push({
										text:d,
										color:null
									});
								}
							}
							this.textList=strArr
							// this.textList = [{
							// 		text: '所属标准 : ' + item.data.belong,
							// 		color: '#19be6b'
							// 	},
							// 	{
							// 		text: '模块小类 : ' + category,
							// 		color: '#19be6b'
							// 	},
							// 	{
							// 		text: '问题内容 : ' + item.data.content,
							// 		color: '#fa3534'
							// 	},
							// 	{
							// 		text: '问题总量 : ' + item.data.value,
							// 		color: '#fa3534'
							// 	}
							// ];
						}
					});
				}
			},
			// 这里是筛选部分 (请求接口时调用sure1,sure2,sure3方法)
			//选择单位
			checkboxChange(e) {},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.fromlist.list1 = '';
				e.map(val => {
					this.fromlist.list1 += val + ',';
				});
				this.fromlist.list1 = this.fromlist.list1.slice(0, this.fromlist.list1.length - 1);
				if (e.length == this.list1.length) {
					this.list1choose = true;
					this.fromlist.list1 = '全部单位';
				} else {
					this.list1choose = false;
				}
			},
			// 全选
			checkedAll() {
				if (this.list1choose == true) {
					this.list1.map(val => {
						val.checked = true;
						this.fromlist.list1 = '全部单位';
					});
				} else {
					this.list1.map(val => {
						val.checked = false;
						this.fromlist.list1 = '';
					});
				}
			},
			openlist1() {
				uni.setStorageSync('valuelist1', this.fromlist.list1)
				uni.setStorageSync('list1', this.list1)
				uni.setStorageSync('list1choose', this.list1choose)
				this.showlist1 = true;
			},
			close1() {
				const list = uni.getStorageSync('list1');
				const value = uni.getStorageSync('valuelist1');
				const checked = uni.getStorageSync('list1choose');
				if (list) {
					this.list1 = list
				}
				if (value) {
					this.fromlist.list1 = value
				}
				if (checked == false || checked) {
					this.list1choose = checked;
				}
				this.showlist1 = false;
			},
			close1Model() {
				this.close1()
			},
			sure1() {
				if(this.locksure1) return;
				this.locksure1=true
				//这里关闭弹窗后请求页面数据
				uni.setStorageSync('valuelist1', this.fromlist.list1)
				uni.setStorageSync('list1', this.list1)
				uni.setStorageSync('list1choose', this.list1choose)
				this.showlist1 = false;
				setTimeout(()=>{
					this.locksure1=false
				},500)
				this.queryStatisticsData();
			},
			//选择人员
			checkboxChange2(e) {},
			checkboxGroupChange2(e) {
				this.fromlist.list2 = '';
				e.map(val => {
					this.fromlist.list2 += val + ',';
				});
				this.fromlist.list2 = this.fromlist.list2.slice(0, this.fromlist.list2.length - 1);
				if (e.length == this.list2.length) {
					this.list2choose = true;
					this.fromlist.list2 = '全部人员';
				} else {
					this.list2choose = false;
				}
			},
			// 全选
			checkedAll2() {
				if (this.list2choose == true) {
					this.list2.map(val => {
						val.checked = true;
						this.fromlist.list2 = '全部人员';
					});
				} else {
					this.list2.map(val => {
						val.checked = false;
						this.fromlist.list2 = '';
					});
				}
			},
			openlist2() {
				uni.setStorageSync('valuelist2', this.fromlist.list2)
				uni.setStorageSync('list2', this.list2)
				uni.setStorageSync('list2choose', this.list2choose)
				this.showlist2 = true;
			},

			close2() {
				const list = uni.getStorageSync('list2');
				const value = uni.getStorageSync('valuelist2');
				const checked = uni.getStorageSync('list2choose');
				if (list) {
					this.list2 = list
				}
				if (value) {
					this.fromlist.list2 = value
				}
				if (checked == false || checked) {
					this.list2choose = checked;
				}
				this.showlist2 = false;
			},
			close2Model() {
				this.close2()
			},
			sure2() {
				//这里关闭弹窗后请求页面数据
				uni.setStorageSync('valuelist2', this.fromlist.list2)
				uni.setStorageSync('list2', this.list2)
				uni.setStorageSync('list2choose', this.list2choose)
				this.showlist2 = false;
				this.queryStatisticsData();
			},
			//选择单位
			checkboxChange3(e) {},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange3(e) {
				this.fromlist.list3 = '';
				e.map(val => {
					this.fromlist.list3 += val + ',';
				});
				this.fromlist.list3 = this.fromlist.list3.slice(0, this.fromlist.list3.length - 1);
				if (e.length == this.list3.length) {
					this.list3choose = true;
					this.fromlist.list3 = '全部标准';
				} else {
					this.list3choose = false;
				}
			},
			// 全选
			checkedAll3() {
				if (this.list3choose == true) {
					this.list3.map(val => {
						val.checked = true;
						this.fromlist.list3 = '全部标准';
					});
				} else {
					this.list3.map(val => {
						val.checked = false;
						this.fromlist.list3 = '';
					});
				}
			},
			openlist3() {
				uni.setStorageSync('valuelist3', this.fromlist.list3)
				uni.setStorageSync('list3', this.list3)
				uni.setStorageSync('list3choose', this.list3choose)
				this.showlist3 = true;
			},
			close3() {
				const list = uni.getStorageSync('list3');
				const value = uni.getStorageSync('valuelist3');
				const checked = uni.getStorageSync('list3choose');
				if (list) {
					this.list3 = list
				}
				if (value) {
					this.fromlist.list3 = value
				}
				if (checked == false || checked) {
					this.list3choose = checked;
				}
				this.showlist3 = false;
			},
			close3Model() {
				this.close3()
			},
			sure3() {
				if(this.locksure3) return;
				this.locksure3=true;
				//这里关闭弹窗后请求页面数据
				uni.setStorageSync('valuelist3', this.fromlist.list3)
				uni.setStorageSync('list3', this.list3)
				uni.setStorageSync('list3choose', this.list3choose)
				this.showlist3 = false;
				setTimeout(()=>{
					this.locksure3=false
				},500)
				this.queryStatisticsData();
			},
			//保存一张图片
			saveBase64(params) {
				let _this = this
				let name = uni.getStorageSync("NAME")
				let imageStr = params.imgUrl
				let loading = params.loading
				let bitmap = new plus.nativeObj.Bitmap();
				bitmap.loadBase64Data(
					imageStr,
					function() {
						let fileName = '验收评价 图表统计 (' + name + " " + _this.dateFormat("YYYYmmdd HH:MM:SS", new Date()) +
							').png'
						bitmap.save('_img/' + fileName, {
								quality: 100
							}, function(i) {
								uni.saveImageToPhotosAlbum({
									filePath: i.target,
									success: function() {
										//复制到文件夹
										let result = saveImage(i.target)
										plus.nativeUI.closeWaiting(loading)
										plus.nativeUI.toast("导出成功");
									},
									fail() {
										//TODO
									},
									complete: function() {
										plus.nativeUI.closeWaiting(loading)
										bitmap.clear();
									}
								});
								plus.nativeUI.closeWaiting(loading)
							},
							function(e) {
								plus.nativeUI.closeWaiting(loading)
								plus.nativeUI.toast("导出失败");
								bitmap.clear();
							}
						);
					},
					function() {
						uni.hideLoading();
						console.log('加载Base64图片数据失败了');
						bitmap.clear();
					}
				);
			},
			dateFormat(fmt, date) {
				let ret;
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			}
		}
	};
</script>
<script module="my_js" lang="renderjs">
	export default {
		mounted() {
			if (typeof window.my_js === 'function') {

			} else {
				// 动态引入较大类库避免影响页面展示
				const script = document.createElement('script')
				// view 层的页面运行在 www 根目录，其相对路径相对于 www 计算
				script.src = 'static/html2canvas.min.js'
				document.head.appendChild(script)
			}
		},
		methods: {
			onClick(event, ownerInstance) {
				let loading = plus.nativeUI.showWaiting("导出中，请等待...", {
					style: "black",
					loading: {
						display: "inline"
					}
				});
				let rect = ""
				let realHtml = document.getElementById("mini_poster"); //需要截图的包裹的（原生的）DOM 对象
				rect = realHtml.getBoundingClientRect()
				let ops = {
					imageTimeout: 500, //超时时间
					useCORS: true,
					scrollY: rect.x, // 开始位置
					height: rect.height + 20 // 结束位置
				}
				html2canvas(realHtml, ops).then(canvas => {
					let imgUrl = canvas.toDataURL("image/png", 1);
					ownerInstance.callMethod('saveBase64', {
						imgUrl: imgUrl,
						loading: loading
					})
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	/deep/.u-th {
		font-size: 24rpx !important;
		padding: 20rpx 0 !important;
	}
	/deep/.u-td {
		padding: 20rpx 10rpx !important;
	}

	// 筛选弹窗
	.Model {
		.toptitle {
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

		.all {
			padding: 100rpx 30rpx 0 30rpx;
		}

		.part {
			padding: 0 30rpx 0 80rpx;
			.normalH{
				height: 60vh;
				width: 100%;
			}
			.ipadH{
				height: 75vh;
				width: 100%;
			}
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

		.gray {
			color: #999999;
			margin-left: 10rpx;
			font-size: 28rpx;
		}
	}

	.table-content1 {
		margin: 20upx 0;
		display: flex;
		justify-content: center;
		touch-action: pan-y;
	}

	.table-content {
		margin: 20upx 0;
		touch-action: pan-y;
	}

	.table-content2 {
		margin: 20upx 0;
	}

	.scrollTable {
		padding-bottom: 60rpx;
		max-height: 500rpx;
	}

	.charts2 {
		width: 100%;
		height: 500upx;
		background-color: #ffffff;
	}

	.charts {
		width: 100%;
		height: 600upx;
		background-color: #ffffff;
	}

	.charts1 {
		width: 100%;
		height: 400upx;
		background-color: #ffffff;
	}

	.statistics {
		background: #ffffff;

		.tab {
			padding: 0 30rpx;
		}

		.condition {
			height: 100rpx;
			line-height: 100rpx;
			// background: #f6fff9;
			background: #ffffff;
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			border-bottom: 2rpx solid #f6f6f6;

			.table-button {
				color: #4abdb4;
				border: 1px solid #6ecac3;
				background: #f6fff9;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 10rpx;
				text-align: center;
				font-size: 30rpx;
				width: 22%;
				margin: 0 2%;
			}

			.search-part {
				width: 35%;
				margin: 0 2%;

				.limit {
					height: 70rpx;
					line-height: 70rpx;
					color: #303133;
					width: 100%;
					font-size: 30rpx;
				}
			}
		}

		.table-bottom {
			text-align: center;
			color: #999999;
			font-size: 28rpx;
			margin: 20rpx;
		}

		.table-part {
			padding: 0 30rpx;
		}

		.table-title {
			margin: 20rpx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				display: flex;
				align-items: center;

				.line {
					width: 12rpx;
					height: 40rpx;
					line-height: 40rpx;
					border-radius: 10rpx;
					background: #909399;
					margin-right: 10rpx;
				}

				.txt {
					font-size: 30rpx;
					color: #666666;
					height: 50rpx;
					line-height: 50rpx;
				}
			}

			.searchright {
				width: 160rpx;
			}
		}
	}
</style>
