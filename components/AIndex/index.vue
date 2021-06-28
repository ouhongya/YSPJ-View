<template>
	<view class="head_box">
		<view class='head' :style="'background:'+bgColor">
			<view class='head_title' :style="'margin-top:'+PhoneHeight+'px;'">
				<view v-if="showBack" class="head_back" @click="back">
					<u-icon name="arrow-left" :color="backColor" size="32"></u-icon>
				</view>
				<view class="drawer" @click="drawer()" v-if="showList">
					<u-icon name="list" color="#ffffff" size="50"></u-icon>
					<u-badge type="error" :count="msgdata" class="badge-msg"></u-badge>
				</view>
				<view class="title" :style="'color:'+textColor">{{text}}</view>
			</view>
		</view>
		<view v-if="station" :style="'min-height:'+(PhoneHeight+44)+'px;height:'+headHeight">
			<image v-if="bgImage" :style="bgStyle" :src="bgImage" mode="aspectFill"></image>
		</view>
		<!-- 左侧内容 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showDrawer" mode="left" width="600">
				<view>
					<view class="person">
						<view class="headpart">
							<view class="headperson">
								<view class="imgPart">
									<image :src="headpic"></image>
								</view>

								<view class="headright">
									<view class="rightpart">
										<view class="info">
											<view class="infouser">
												<view class="username">{{username}}</view><u-tag :text="role" shape="circleRight" size="mini"  mode="plain" border-color="#4abdb4" color="#4abdb4"/>
											</view>
											<view class="">
												<text>{{phone}}</text>
											</view>
										</view>
										<view class="change" @click="toLogin()">
											<view>切换账号</view>
											<image src="../../static/changing2.png" mode=""></image>
										</view>
									</view>
								</view>
							</view>
							<view class="company">
								{{companyname}}
							</view>
						</view>
						<view class="contentpart">
							<view class="list-part">
								<view class="list" @click="syncdate()">
									<image src="../../static/sync6.png" mode=""></image>
									<view class="listxt">同步数据</view>
								</view>
								<!-- <view class="list" @click="toExam()">
									<image src="../../static/examleft2.png" mode=""></image>
									<view class="listxt">考试中心</view>
								</view> -->
							</view>
							<view class="list-part">
								<view class="list" @click="templateUpload()">
									<image src="../../static/load1.png" mode=""></image>
									<view class="listxt">
										模板下载
									</view>
								</view>
								<view class="list" @click="onUpload()">
									<image src="../../static/checkin1.png" mode=""></image>
									<l-file ref="lFile" @up-success="onSuccess"></l-file>
									<view class="listxt">
										导入准则
									</view>
								</view>
								<view class="list" @click="checkOut()">
									<image src="../../static/checkout1.png" mode=""></image>
									<view class="listxt">导出全部</view>
								</view>
							</view>
							<view class="list-part">
								<view class="list" @click="toPublic()">
									<image src="../../static/public3.png" mode=""></image>
									<view class="listxt">公告</view>
									<u-badge type="error" :count="msgdata" class="badge-msg"></u-badge>
								</view>
								<view class="list" @click="explain()">
									<image src="../../static/asking2.png" mode=""></image>
									<view class="listxt">目录说明</view>
								</view>
								<view class="list" @click="toRecycle()" v-if="functionid!=1">
									<image src="../../static/del1.png" mode=""></image>
									<view class="listxt">回收站</view>
								</view>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="txt">
							Version 2.0.0
						</view>
					</view>
				</view>
			</u-popup>
		</view>

		<u-modal v-model="showExplain" :title-style="{color: '#fff',background:'#4abdb4'}" @confirm="confirmExplain()"
		 :confirm-style="{color:'#4abdb4'}" confirm-text="我知道了" :show-title="false">
			<view class="slot-content">
				<view class="contentModel">
					<u-form :model="form" ref="uForm" label-position="top" :label-style="labelStyle">
						<u-form-item label="导出文件存放地址">
							<view class="explain">
								根目录/验收评价/导出数据
							</view>
						</u-form-item>
						<u-form-item label="下载模板存放地址" :border-bottom="false">
							<view class="explain">
								根目录/验收评价/标准模板
							</view>
						</u-form-item>
					</u-form>
				</view>
			</view>
		</u-modal>
		<!-- 导出弹出框 -->
		<!-- 导出选择 -->
		<view @touchstart="touchStart1" @touchmove="touchMove1" @touchend="touchEnd1">
			<u-popup v-model="chooseModal" :mode="curMode" width="40%" height="80%" @close="cancelCheck()">
				<view class="roleModel">
					<view class="roleTop">
						导出全部
					</view>
					<view class="contentModel">
						<u-form :model="form" ref="uForm" :label-style="labelStyle" :label-width='labelWidth'>
							<u-form-item label="选择单位">
								<u-input v-model="checkcompany" type="select" :border="true" @click="openlistout1()" height="70" placeholder="点击选择单位" />								
							</u-form-item>
							<u-form-item label="选择人员" v-if="functionid != 3">
								<u-input v-model="checkperson" type="select" :border="true" @click="openlistout2()" height="70" placeholder="点击选择人员" />							
							</u-form-item>
							<u-form-item label="选择标准" v-if="functionid != 3">
								<u-input v-model="checkstandrd" type="select" :border="true" @click="openlistout3()" height="70" placeholder="点击选择标准" />
							</u-form-item>
							<u-form-item label="选择任务" v-if="functionid != 1">
								<u-input v-model="checktask" type="select" :border="true" @click="openlistout4()" height="70" placeholder="点击选择任务" />
							</u-form-item>
							<u-form-item label="时间范围">
								<u-input v-model="checktime" type="select" :border="true" @click="openlistout5()" height="70" placeholder="点击选择时间范围" />
							</u-form-item>
							<u-form-item label="导出图片">
								<view>
									<u-radio-group v-model="checkpic" icon-size="30" size="40">
										<u-radio v-for="(item, index) in checkpicList" :key="index" :name="item.name" active-color="#4abdb4">
											{{ item.name }}
										</u-radio>
									</u-radio-group>
								</view>
							</u-form-item>
							<u-form-item label="数据类型">
								<view>
									<u-radio-group v-model="checktype" icon-size="30" size="40">
										<u-radio v-for="(item, index) in checktypeList" :key="index" :name="item.name" active-color="#4abdb4">
											{{ item.name }}
										</u-radio>
									</u-radio-group>
								</view>
							</u-form-item>
						</u-form>
					</view>

					<view class="roleAction">
						<view class="cancel" @click="cancelCheck()">
							取消
						</view>
						<view class="sure" @click="confirmCheck()">
							导出
						</view>
					</view>
					<u-calendar v-model="showchecktime" mode="range" @change="dateoutconfirm" max-date="2030-01-01" ref="calendar"
					 v-if="curMode=='left'">
						<view slot="tooltip">
							<view class="emptytips" @click="emptytime">
								清空日期
							</view>
						</view>
					</u-calendar>
				</view>
			</u-popup>
		</view>
		<u-calendar v-model="showchecktime" mode="range" @change="dateoutconfirm" max-date="2030-01-01" ref="calendar" v-if="curMode=='bottom'">
			<view slot="tooltip">
				<view class="emptytips" @click="emptytime">
					清空日期
				</view>
			</view>
		</u-calendar>
		<!-- 选择单位 -->
		<view @touchstart="touchStart2" @touchmove="touchMove2" @touchend="touchEnd2">
			<u-popup v-model="showlistout1" :mode="curMode" width="40%" height="70%" @close="sureout1">
				<view class="Model">
					<view class="toptitle">
						单位筛选
					</view>
					<view class="top-part" v-if="listout1Flag">
						<view class="all">
							<u-checkbox-group @change="checkedAll" icon-size="40" size="44">
								<u-checkbox v-model="listout1choose" active-color="#4abdb4" label-size="30">全部单位
								</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y style="height:50vh;width: 100%;">
								<u-checkbox-group @change="checkboxGroupChange" :wrap="true" icon-size="36" size="40">
									<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in listout1" :key="index"
									 :name="item.name" active-color="#4abdb4">{{item.name}}</u-checkbox>
								</u-checkbox-group>
								<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="listout1.length>10" />
							</scroll-view>
						</view>
						<view class="roleAction">
							<view class="cancel" @click="closeout1()">取消</view>
							<view class="sure" @click="sureout1()">确定</view>
						</view>
					</view>
					<view class="empty" v-else>
						<a-empty :changing="false"></a-empty>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 选择人员 -->
		<view @touchstart="touchStart2" @touchmove="touchMove2" @touchend="touchEnd2">
			<u-popup v-model="showlistout2" :mode="curMode" width="40%" height="70%" @close="sureout2">
				<view class="Model">
					<view class="toptitle">
						人员筛选
					</view>
					<view class="top-part" v-if="listout2Flag">
						<view class="all">
							<u-checkbox-group @change="checkedAll2" icon-size="40" size="44">
								<u-checkbox v-model="listout2choose" active-color="#4abdb4" label-size="30">全部人员
								</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y style="height:50vh;width: 100%;">
								<u-checkbox-group @change="checkboxGroupChange2" :wrap="true" icon-size="36" size="40">
									<u-checkbox @change="checkboxChange2" v-model="item.checked" v-for="(item, index) in listout2" :key="index"
									 :name="item.name" active-color="#4abdb4">{{item.name}}</u-checkbox>
								</u-checkbox-group>
								<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="listout2.length>10" />
							</scroll-view>
						</view>
						<view class="roleAction">
							<view class="cancel" @click="closeout2()">取消</view>
							<view class="sure" @click="sureout2()">确定</view>
						</view>
					</view>
					<view class="empty" v-else>
						<a-empty :changing="false"></a-empty>
					</view>
				</view>
			</u-popup>
		</view>
		<!--选择标准弹框 -->
		<view @touchstart="touchStart2" @touchmove="touchMove2" @touchend="touchEnd2">
			<u-popup v-model="showlistout3" :mode="curMode" width="40%" height="70%" @close="sureout3">
				<view class="Model">
					<view class="toptitle">
						标准筛选
					</view>
					<view class="top-part" v-if="listout3Flag">
						<view class="all">
							<u-checkbox-group @change="checkedAll3" icon-size="40" size="44">
								<u-checkbox v-model="listout3choose" active-color="#4abdb4" label-size="30">全部标准
								</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y style="height:50vh;width: 100%;">
								<u-checkbox-group @change="checkboxGroupChange3" :wrap="true" icon-size="36" size="40">
									<u-checkbox @change="checkboxChange3" v-model="item.checked" v-for="(item, index) in listout3" :key="index"
									 :name="item.name" active-color="#4abdb4">{{item.name}}<text v-if="item.type==2 && functionid != 1" class="gray">(本地)</text></u-checkbox>
								</u-checkbox-group>
								<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="listout3.length>10" />
							</scroll-view>
						</view>
						<view class="roleAction">
							<view class="cancel" @click="closeout3()">取消</view>
							<view class="sure" @click="sureout3()">确定</view>
						</view>
					</view>
					<view class="empty" v-else>
						<a-empty :changing="false"></a-empty>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 选择任务弹框 -->
		<view @touchstart="touchStart2" @touchmove="touchMove2" @touchend="touchEnd2">
			<u-popup v-model="showlistout4" :mode="curMode" width="40%" height="70%" @close="sureout4">
				<view class="Model">
					<view class="toptitle">
						任务筛选
					</view>
					<view class="top-part" v-if="listout4Flag">
						<view class="all">
							<u-checkbox-group @change="checkedAll4" icon-size="40" size="44">
								<u-checkbox v-model="listout4choose" active-color="#4abdb4" label-size="30">全部任务
								</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y style="height:50vh;width: 100%;">
								<u-checkbox-group @change="checkboxGroupChange4" :wrap="true" icon-size="36" size="40">
									<u-checkbox @change="checkboxChange4" v-model="item.checked" v-for="(item, index) in listout4" :key="index"
									 :name="item.name" active-color="#4abdb4">{{item.name}}</u-checkbox>
								</u-checkbox-group>
								<u-loadmore bg-color="none" status="nomore" margin-top="30" v-if="listout4.length>10" />
							</scroll-view>
						</view>
						<view class="roleAction">
							<view class="cancel" @click="closeout4()">取消</view>
							<view class="sure" @click="sureout4()">确定</view>
						</view>
					</view>
					<view class="empty" v-else>
						<a-empty :changing="false"></a-empty>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 切换账号确认框 -->
		<u-modal v-model="showAccount" @confirm="accountChange" content="您确认要切换账号吗？" :show-title="false" :show-cancel-button="true"
		 :confirm-style="{'color':'#fa3534'}"></u-modal>
		<!-- 同步数据确认框 -->
		<u-modal v-model="showSync" @confirm="syncConfirm" content="您确认要同步数据吗？" :show-title="false" :show-cancel-button="true"
		 :confirm-style="{'color':'#fa3534'}"></u-modal>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!-- 蒙层 -->
		<view class="masklock" v-show="maskSync"></view>
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
	 * 
	 */
	import app from '@/App.vue'
	import helper from '@/common/helper.js'
	import {
		importUserToData,
		importUserToTask,
		queryFilter
	} from '@/api/importExcel.js'

	import {
		uploadImage
	} from '@/api/imageUpload.js';
	import {
		uploadExcelTemplate,
		queryCompanyGroup
	} from '@/api/standard.js';
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
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
			parameter: {
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
			msgdata: {
				type: String,
				default () {
					return '0';
				}
			},
			curMode: {
				type: String,
				default () {
					return 'bottom';
				}
			},
			username: {
				type: String,
				default () {
					return '暂无名称';
				}
			},
			phone: {
				type: String,
				default () {
					return '暂无手机号';
				}
			},
			role:{
				type: String,
				default () {
					return '暂无角色';
				}
			},
			headpic: {
				type: String,
				default () {
					return '';
				}
			},
			net: {
				type: Boolean,
				default () {
					return false;
				}
			}
		},
		watch: {
			net(newVal) {
				if (newVal) {
					uni.hideLoading()
				}
			}
		},
		data() {
			return {
				headHeight: '',
				PhoneHeight: 0,
				windowHeight: 0,
				//是否显示左侧抽屉
				showDrawer: false,
				chooseModal: false, // 导出弹框
				prograssModel: false,
				outModel: false,
				form: {},
				labelStyle: {
					color: '#333',
					fontSize: '32rpx'
				},
				labelWidth: '200',
				checkpic: '是',
				checktype: '全部数据',
				checkdata: '否',
				checkcompany: '全部单位',
				checkperson: '全部人员',
				checkstandrd: '全部标准',
				checktask: '全部任务',
				checktime: '',
				functionid: uni.getStorageSync("functionid"),
				companyname: uni.getStorageSync("companyname"),
				loginway:uni.getStorageSync("loginway"),
				companypicture: '',
				showchecktime: false,
				showlistout1: false,
				showlistout2: false,
				showlistout3: false,
				showlistout4: false,
				listout1choose: true,
				listout2choose: true,
				listout3choose: true,
				listout4choose: true,
				showAccount: false,
				checkpicList: [{
						name: '是',
					},
					{
						name: '否',
					}
				],
				checktypeList: [{
						name: '全部数据'
					},
					{
						name: '问题数据'
					},
				],
				checkdataList: [{
						name: '是'
					},
					{
						name: '否'
					}
				],
				listout1: [],
				listout2: [],
				listout3: [],
				listout4: [],
				listout1Flag: false,
				listout2Flag: false,
				listout3Flag: false,
				listout4Flag: false,
				percent: 0, //导出进度百分比
				showExplain: false,
				scorllheight: 0,
				touchDotX: 0,
				touchDotY: 0,
				touchMoveX: 0,
				touchMoveY: 0,
				time: 0,
				interval: 0,
				userIds: null,
				publiclock: false,
				recyclelock: false,
				checklock: false,
				explainlock: false,
				templatelock: false,
				uploadlock: false,
				examlock:false,
				showSync: false,
				maskSync:false,
				showSumbit: false
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
			this.queryCompanyGroup()
		},
		methods: {
			syncdate() {
				let _this = this;
				uni.getNetworkType({
					success: function(res) {
						if (res.networkType == 'none') {
							_this.$refs.uToast.show({
								title: '请先连接网络',
								type: 'warning'
							})
							_this.showSync = false;
						} else {
							_this.showSync = true;
						}
					}
				});
			},
			syncConfirm() {
				this.showSync = false;
				this.maskSync=true;
				uni.showLoading({
					title: "同步中..."
				})
				// #ifdef APP-PLUS
					plus.device.setWakelock(true);
				// #endif
				let _this=this;
				let sqlselecttables =
					'select count(*) as number,updatetime from sys_menu where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_menu where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from sys_menu_table where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_menu_table where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from sys_role where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_role where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from sys_unit where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_unit where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from sys_user where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_user where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from tb_excel where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_excel where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from tb_excel_category where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_excel_category where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_excel_user where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_excel_user where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_group_report where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_group_report where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_message where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_message where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_message_user where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_message_user where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_norm where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_norm where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_norm_detail where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_norm_detail where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_norm_detail_row where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_norm_detail_row where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_task where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_task where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_task_delete_status where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_task_delete_status where direty = 0 and `delete` = 0 )  union all select count(*) as number,updatetime  from tb_task_detail where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_task_detail where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_task_detail_checkrow where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_task_detail_checkrow where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_task_detail_norm where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_task_detail_norm where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from tb_task_detail_norm_detail where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_task_detail_norm_detail where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from tb_task_info where updatetime = ( select MAX(cast(updatetime as INTEGER)) from tb_task_info where direty = 0 and `delete` = 0 )';
				selectSQL('local', sqlselecttables, resselecttables => {
					var ob = {
						updatetime: "0",
						updatetime1: "0",
						updatetime2: "0",
						updatetime3: "0",
						updatetime4: "0",
						updatetime5: "0",
						updatetime6: "0",
						updatetime7: "0",
						updatetime8: "0",
						updatetime9: "0",
						updatetime10: "0",
						updatetime11: "0",
						updatetime12: "0",
						updatetime13: "0",
						updatetime14: "0",
						updatetime15: "0",
						updatetime16: "0",
						updatetime17: "0",
						updatetime18: "0",
						updatetime19: "0",
						updatetime20: "0"
					}
					
					resselecttables.forEach((item, index) => {
						if (index == 0) {
							if (item.updatetime != null) {
								ob.updatetime = item.updatetime;
							}
						} else if (index == 1) {
							if (item.updatetime != null) {
								ob.updatetime1 = item.updatetime;
							}
						} else if (index == 2) {
							if (item.updatetime != null) {
								ob.updatetime2 = item.updatetime;
							}
						} else if (index == 3) {
							if (item.updatetime != null) {
								ob.updatetime3 = item.updatetime;
							}
						} else if (index == 4) {
							if (item.updatetime != null) {
								ob.updatetime4 = item.updatetime;
							}
						} else if (index == 5) {
							if (item.updatetime != null) {
								ob.updatetime5 = item.updatetime;
							}
						} else if (index == 6) {
							if (item.updatetime != null) {
								ob.updatetime6 = item.updatetime;
							}
						} else if (index == 7) {
							if (item.updatetime != null) {
								ob.updatetime7 = item.updatetime;
							}
						} else if (index == 8) {
							if (item.updatetime != null) {
								ob.updatetime8 = item.updatetime;
							}
						} else if (index == 9) {
							if (item.updatetime != null) {
								ob.updatetime9 = item.updatetime;
							}
						} else if (index == 10) {
							if (item.updatetime != null) {
								ob.updatetime10 = item.updatetime;
							}
						} else if (index == 11) {
							if (item.updatetime != null) {
								ob.updatetime11 = item.updatetime;
							}
						} else if (index == 12) {
							if (item.updatetime != null) {
								ob.updatetime12 = item.updatetime;
							}
						} else if (index == 13) {
							if (item.updatetime != null) {
								ob.updatetime13 = item.updatetime;
							}
						} else if (index == 14) {
							if (item.updatetime != null) {
								ob.updatetime14 = item.updatetime;
							}
						} else if (index == 15) {
							if (item.updatetime != null) {
								ob.updatetime15 = item.updatetime;
							}
						} else if (index == 16) {
							if (item.updatetime != null) {
								ob.updatetime16 = item.updatetime;
							}
						} else if (index == 17) {
							if (item.updatetime != null) {
								ob.updatetime17 = item.updatetime;
							}
						} else if (index == 18) {
							if (item.updatetime != null) {
								ob.updatetime18 = item.updatetime;
							}
						} else if (index == 19) {
							if (item.updatetime != null) {
								ob.updatetime19 = item.updatetime;
							}
						} else if (index == 20) {
							if (item.updatetime != null) {
								ob.updatetime20 = item.updatetime;
							}
						}
					})
					helper.requestUrl(helper.websiteUrl + "v1/gettables", ob, 'POST', (data) => {
                              
							  data.sysmenu.forEach(val => {
							  	let url =
							  		'select menu_id,menu_name,menu_url,parent_id,menu_icon from sys_menu where menu_id = ' + "'" +
							  		val.menu_id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into sys_menu values (' + "'" + val.menu_id + "'" + "," + "'" +
							  				val.menu_name +
							  				"'" + "," +
							  				"'" + val.menu_url + "'" + "," + "'" + val.parent_id + "'" + "," + "'" + val.menu_icon + "'" +
							  				"," + "'" + val.direty + "'" + "," + "'" + val.delete + "'" + "," + "'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		}
							  	})
							  })
							  
							  data.sysmenutable.forEach(val => {
							  	let url =
							  		'select role_id,menu_id,status,direty,`delete`,updatetime from sys_menu_table where role_id = ' +
							  		"'" +
							  		val.role_id + "'" + ' and menu_id = ' + "'" + val.menu_id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into sys_menu_table values (' + "'" + val.role_id + "'" + "," +
							  				"'" +
							  				val.menu_id +
							  				"'" + "," +
							  				"'" + val.status + "'" + "," + "'" + val.direty + "'" + "," + "'" + val.delete + "'" +
							  				"," + "'" + val.updatetime + "'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			var sta = 0;
							  			resurl.forEach(valuel => {
							  				if (valuel.direty == 1 || valuel.delete == 1) {
							  					sta = 1;
							  				}
							  			})
							  			if (sta == 0) {
							  				let sqlupdate = 'update sys_menu_table set status = ' + "'" + "1" + "'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" + ' where role_id = ' + "'" + val.role_id +
							  					"'" + ' and menu_id = ' + "'" + val.menu_id + "'";
							  				executeSQL("local", sqlupdate, resupdate => {
							  					let insertsysmenu = 'insert into sys_menu_table values (' + "'" + val.role_id + "'" + "," +
							  						"'" +
							  						val.menu_id +
							  						"'" + "," +
							  						"'" + val.status + "'" + "," + "'" + val.direty + "'" + "," + "'" + val.delete + "'" +
							  						"," + "'" + val.updatetime + "'" +
							  						' ) ';
							  					executeSQL("local", insertsysmenu, ressysmenu => {})
							  		
							  				})
							  			}
							  		}
							  	})
							  })
							  
							  data.sysrole.forEach(val => {
							  	
							  	let url =
							  		'select role_id,role_name,parent_id,status,function_id,direty,`delete` from sys_role where role_id = ' +
							  		"'" +
							  		val.role_id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into sys_role values (' + "'" + val.role_id + "'" + "," + "'" +
							  				val.role_name +
							  				"'" + "," +
							  				"'" + val.parent_id + "'" + "," + "'" + val.status + "'" + "," + "'" + val.function_id + "'" +
							  				"," + "'" + val.direty + "'" + "," + "'" + val.delete + "'" + "," + "'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete == 0) {
							  				let sqlupdate = 'update sys_role set status = ' + "'" + val.status + "'" + "," +
							  					' role_name = ' + "'" + val.role_name + "'" + "," + ' parent_id = ' + "'" + val.parent_id +
							  					"'" + "," + ' function_id = ' + "'" + val.function_id + "'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" + ' where role_id = ' + "'" + val.role_id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  		}
							  	})
							  })
							  
							  data.sysunit.forEach(val => {
							  	
							  	let url =
							  		'select unit_id,unit_name,company_id,status,direty,`delete` from sys_unit where unit_id = ' +
							  		"'" +
							  		val.unit_id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into sys_unit values (' + "'" + val.unit_id + "'" + "," + "'" +
							  				val.unit_name +
							  				"'" + "," +
							  				"'" + val.unit_user + "'" + "," + "'" + val.unit_userphone + "'" + "," + "'" + val.address +
							  				"'" +
							  				"," + "'" + val.parent_id + "'" + "," + "'" + val.status + "'" + "," + "'" + val.company_id +
							  				"'" + "," + "'" + val.direty + "'" + "," + "'" + val.delete + "'" + "," + "'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete == 0) {
							  				let sqlupdate = 'update sys_unit set status = ' + "'" + val.status + "'" + "," +
							  					' unit_name = ' + "'" + val.unit_name + "'" + "," + ' unit_user = ' + "'" + val.unit_user +
							  					"'" + "," + ' unit_userphone = ' + "'" + val.unit_userphone + "'" + "," + ' address = ' +
							  					"'" + val.address + "'" + "," + ' parent_id = ' + "'" + val.parent_id + "'" + "," +
							  					' company_id = ' + "'" + val.company_id + "'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" + ' where unit_id = ' + "'" + val.unit_id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  		}
							  		
							  	})
							  })
							  
							  data.sysuser.forEach(val => {
							  	let url =
							  		'select user_id,name,role_id,status,company_id,direty,`delete` from sys_user where user_id = ' +
							  		"'" +
							  		val.user_id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into sys_user values (' + "'" + val.user_id + "'" + "," + "'" +
							  				val.password +
							  				"'" + "," +
							  				"'" + val.name + "'" + "," + "'" + val.role_id + "'" + "," + "'" + val.status +
							  				"'" +
							  				"," + "'" + val.phone + "'" + "," + "'" + val.company_id + "'" + "," + "'" + val.direty +
							  				"'" + "," + "'" + val.delete + "'" + "," + "'" + val.updatetime + "'" + "," + "'" + val.isupdate +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete == 0) {
							  				let sqlupdate = 'update sys_user set status = ' + "'" + val.status + "'" + "," +
							  					' password = ' + "'" + val.password + "'" + "," + ' name = ' + "'" + val.name + "'" + "," +
							  					' role_id = ' + "'" + val.role_id + "'" + "," + ' phone = ' + "'" + val.phone + "'" + "," +
							  					' company_id = ' + "'" + val.company_id + "'" + "," + ' isupdate = ' + "'" + val.isupdate +
							  					"'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" + ' where user_id = ' + "'" + val.user_id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  		}
							  	})
							  })
							  
							  
							  data.tbexecel.forEach(val => {
							  	let url =
							  		'select id,url,name,status,direty,`delete` from tb_excel where id = ' +
							  		"'" +
							  		val.id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into tb_excel values (' + "'" + val.id + "'" +
							  				"," + "'" +
							  				val.url +
							  				"'" + "," +
							  				"'" + val.name + "'" + "," + "'" + val.user_id + "'" + "," + "'" + val.iscategory +
							  				"'" +
							  				"," + "'" + val.categort_id + "'" + "," + "'" + val.status + "'" + "," +
							  				"'" + val.type + "'" +
							  				"," + "'" + val.view +
							  				"'" + "," + "'" + val.totlecheck + "'" + "," + "'" + val.size + "'" +
							  				"," + "'" + val.created_time +
							  				"'" + "," + "'" + val.direty + "'" + "," + "'" + val.delete + "'" + "," +
							  				"'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete == 0) {
							  				let sqlupdate = 'update tb_excel set url = ' + "'" + val.url + "'" +
							  					"," + ' name = ' + "'" +
							  					val.name + "'" + "," + ' user_id = ' + "'" + val.user_id + "'" + "," +
							  					' isCategory = ' +
							  					"'" + val.iscategory + "'" + "," + ' categort_id = ' + "'" + val.categort_id +
							  					"'" + "," +
							  					' status = ' + "'" + val.status + "'" + "," + ' type = ' + "'" + val.type +
							  					"'" + "," +
							  					' view = ' + "'" + val.view + "'" + "," + ' totlecheck = ' + "'" + val
							  					.totlecheck + "'" +
							  					"," + ' size = ' + "'" + val.size + "'" + "," + ' created_time = ' +
							  					"'" + val.created_time +
							  					"'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" + ' where id = ' + "'" +
							  					val.id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  		}
							  
							  	})
							  })
							  
							  data.tbexcelcategory.forEach(val => {
							  	let url =
							  		'select id,name,status,user_id,direty,`delete` from tb_excel_category where id = ' +
							  		"'" +
							  		val.id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into tb_excel_category values (' + "'" +
							  				val.id + "'" + "," + "'" +
							  				val.name +
							  				"'" + "," +
							  				"'" + val.status + "'" + "," + "'" + val.user_id + "'" + "," +
							  				"'" + val.created_time +
							  				"'" +
							  				"," + "'" + val.direty + "'" + "," + "'" + val.delete + "'" + "," +
							  				"'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete == 0) {
							  				let sqlupdate = 'update tb_excel_category set name = ' + "'" +
							  					val.name + "'" + "," +
							  					' status = ' + "'" +
							  					val.status + "'" + "," + ' user_id = ' + "'" + val.user_id + "'" +
							  					"," + ' created_time = ' +
							  					"'" + val.created_time + "'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" + ' where id = ' +
							  					"'" + val.id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  		}
							  
							  	})
							  })
							  
							  data.tbexceluser.forEach(val => {
							  	let url =
							  		'select excel_id,user_id,status,direty,`delete` from tb_excel_user where excel_id = ' +
							  		"'" +
							  		val.excel_id + "'" + ' and user_id = ' + "'" + val.user_id +
							  		"'";
							  
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu = 'insert into tb_excel_user values (' +
							  				"'" + val.excel_id + "'" + "," +
							  				"'" +
							  				val.user_id +
							  				"'" + "," +
							  				"'" + val.status + "'" + "," + "'" + val.direty + "'" + "," +
							  				"'" + val.delete + "'" + "," +
							  				"'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			var sta = 0;
							  			resurl.forEach(valuel => {
							  				if (valuel.direty == 1 || valuel.delete == 1) {
							  					sta = 1;
							  				}
							  			})
							  			if (sta == 0) {
							  				let sqlupdate = 'update tb_excel_user set status = ' + "'" +
							  					"1" + "'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" +
							  					' where excel_id = ' + "'" + val.excel_id +
							  					"'" + ' and user_id = ' + "'" + val.user_id + "'";
							  				executeSQL("local", sqlupdate, resupdate => {
							  					let insertsysmenu = 'insert into tb_excel_user values (' +
							  						"'" + val.excel_id + "'" + "," +
							  						"'" +
							  						val.user_id +
							  						"'" + "," +
							  						"'" + val.status + "'" + "," + "'" + val.direty + "'" +
							  						"," + "'" + val.delete + "'" +
							  						"," +
							  						"'" + val.updatetime +
							  						"'" +
							  						' ) ';
							  					executeSQL("local", insertsysmenu, ressysmenu => {})
							  				})
							  			}
							  
							  		}
							  
							  	})
							  })
							  
							  
							  data.tbgroupreport.forEach(val => {
							  	let url =
							  		'select id,task_id,taskdetail_id,direty,`delete` from tb_group_report where id = ' +
							  		"'" +
							  		val.id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu =
							  				'insert into tb_group_report values (' + "'" + val.id +
							  				"'" + "," + "'" +
							  				val.task_id +
							  				"'" + "," +
							  				"'" + val.taskdetail_id + "'" + "," + "'" + val.againtaskid +
							  				"'" + "," + "'" + val.remarkUn +
							  				"'" +
							  				"," + "'" + val.unit_id + "'" + "," + "'" + val.site_id +
							  				"'" + "," + "'" + val.total_issue +
							  				"'" +
							  				"," + "'" + val.group_id +
							  				"'" + "," + "'" + val.view_id + "'" + "," + "'" + val
							  				.user_id + "'" + "," + "'" + val.type +
							  				"'" + "," + "'" + val.status + "'" + "," + "'" + val.solve +
							  				"'" + "," + "'" + val.create_time +
							  				"'" + "," + "'" + val.direty + "'" + "," + "'" + val.delete +
							  				"'" + "," + "'" + val.updatetime +
							  				"'" + "," + "'" + val.solveask + "'" + "," + "'" +
							  				val.reconfire + "'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete == 0) {
							  				let sqlupdate =
							  					'update tb_group_report set task_id = ' + "'" + val.task_id +
							  					"'" + "," +
							  					' taskdetail_id = ' + "'" +
							  					val.taskdetail_id + "'" + "," + ' againtaskid = ' +
							  					"'" + val.againtaskid + "'" + "," +
							  					' remarkUn = ' +
							  					"'" + val.remarkUn + "'" + "," + ' unit_id = ' + "'" +
							  					val.unit_id + "'" + "," +
							  					' site_id = ' + "'" + val.site_id + "'" + "," +
							  					' total_issue = ' + "'" + val.total_issue +
							  					"'" + "," +
							  					' group_id = ' + "'" + val.group_id + "'" + "," +
							  					' view_id = ' + "'" + val.view_id + "'" +
							  					"," + ' user_id = ' + "'" + val.user_id + "'" + "," +
							  					' type = ' + "'" + val.type +
							  					"'" + "," + ' status = ' + "'" + val.status + "'" +
							  					"," + ' solve = ' + "'" + val.solve +
							  					"'" + "," + ' create_time = ' + "'" + val.create_time +
							  					"'" + "," + ' solveask = ' + "'" +
							  					val.solveask + "'" + "," + ' reconfire = ' + "'" +
							  					val.reconfire + "'" + ","
							  				' updatetime = ' + "'" + val.updatetime + "'" +
							  					' where id = ' + "'" + val.id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  		}
							  
							  	})
							  })
							  
							  data.tbmessage.forEach(val => {
							  
							  	let url =
							  		'select id,title,content,type,direty,`delete` from tb_message where id = ' +
							  		"'" +
							  		val.id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu =
							  				'insert into tb_message values (' + "'" + val.id +
							  				"'" + "," + "'" +
							  				val.title +
							  				"'" + "," +
							  				"'" + val.content + "'" + "," + "'" + val.type +
							  				"'" + "," + "'" + val.status +
							  				"'" +
							  				"," + "'" + val.user_id + "'" + "," + "'" + val
							  				.created_time + "'" + "," + "'" + val.direty +
							  				"'" +
							  				"," + "'" + val.delete +
							  				"'" + "," + "'" + val.updatetime + "'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu, ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete ==
							  				0) {
							  				let sqlupdate =
							  					'update tb_message set title = ' + "'" + val.title +
							  					"'" + "," +
							  					' content = ' + "'" +
							  					val.content + "'" + "," + ' type = ' + "'" +
							  					val.type + "'" + "," + ' status = ' +
							  					"'" + val.status + "'" + "," + ' user_id = ' +
							  					"'" + val.user_id + "'" + "," +
							  					' created_time = ' + "'" + val.created_time +
							  					"'" + "," +
							  					' updatetime = ' + "'" + val.updatetime + "'" +
							  					' where id = ' + "'" + val.id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  		}
							  
							  	})
							  })
							  
							  data.tbmessageuser.forEach(val => {
							  	let url =
							  		'select message_id,status,user_id,read_time,direty,`delete` from tb_message_user where message_id = ' +
							  		"'" +
							  		val.message_id + "'" + ' and user_id = ' +
							  		"'" + val.user_id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu =
							  				'insert into tb_message_user values (' +
							  				"'" + val.message_id + "'" + "," +
							  				"'" +
							  				val.status +
							  				"'" + "," +
							  				"'" + val.user_id + "'" + "," + "'" + val
							  				.read_time + "'" + "," + "'" + val.direty +
							  				"'" +
							  				"," + "'" + val.delete + "'" + "," + "'" +
							  				val.updatetime + "'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu,
							  				ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[0].delete == 0) {
							  				let sqlupdate =
							  					'update tb_message_user set status = ' +
							  					"'" + val.status + "'" + "," +
							  					' read_time = ' + "'" +
							  					val.read_time + "'" + "," +
							  					' updatetime = ' + "'" + val.updatetime +
							  					"'" +
							  					' where message_id = ' + "'" + val.message_id +
							  					"'" + ' and user_id = ' + "'" + val.user_id +
							  					"'";
							  				executeSQL("local", sqlupdate, resupdate => {})
							  			}
							  
							  		}
							  
							  	})
							  })
							  
							  data.tbnorm.forEach(val => {
							  	let url =
							  		'select norm_id,excel_id,direty,`delete` from tb_norm where norm_id = ' +
							  		"'" +
							  		val.norm_id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu =
							  				'insert into tb_norm values (' +
							  				"'" + val.norm_id + "'" + "," + "'" +
							  				val.excel_id +
							  				"'" + "," +
							  				"'" + val.name + "'" + "," + "'" +
							  				val.unit + "'" + "," + "'" + val.content +
							  				"'" +
							  				"," + "'" + val.total_score + "'" +
							  				"," + "'" + val.score_time + "'" +
							  				"," + "'" + val.totlecheck +
							  				"'" +
							  				"," + "'" + val.created_time +
							  				"'" + "," + "'" + val.direty + "'" +
							  				"," + "'" + val.delete + "'" + "," +
							  				"'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local", insertsysmenu,
							  				ressysmenu => {})
							  		} else {
							  			if (resurl[0].direty == 0 && resurl[
							  					0].delete == 0) {
							  				let sqlupdate =
							  					'update tb_norm set excel_id = ' +
							  					"'" + val.excel_id + "'" + "," +
							  					' name = ' + "'" +
							  					val.name + "'" + "," + ' unit = ' +
							  					"'" + val.unit + "'" + "," +
							  					' content = ' +
							  					"'" + val.content + "'" + "," +
							  					' total_score = ' + "'" + val.total_score +
							  					"'" + "," +
							  					' score_time = ' + "'" + val.score_time +
							  					"'" + "," +
							  					' totlecheck = ' + "'" + val.totlecheck +
							  					"'" + "," + ' created_time = ' +
							  					"'" + val.created_time +
							  					"'" + "," + ' updatetime = ' + "'" +
							  					val.updatetime + "'" +
							  					' where norm_id = ' + "'" + val.norm_id +
							  					"'";
							  				executeSQL("local", sqlupdate,
							  					resupdate => {})
							  			}
							  		}
							  
							  	})
							  })
							  data.tbnormdetail.forEach(val => {
							  	let url =
							  		'select id,norm_id,direty,`delete` from tb_norm_detail where id = ' +
							  		"'" +
							  		val.id + "'";
							  	selectSQL('local', url, resurl => {
							  		if (resurl.length == 0) {
							  			let insertsysmenu =
							  				'insert into tb_norm_detail values (' +
							  				"'" + val.id + "'" + "," +
							  				"'" +
							  				val.norm_id +
							  				"'" + "," +
							  				"'" + val.serial + "'" + "," +
							  				"'" + val.item + "'" + "," +
							  				"'" + val.untitled +
							  				"'" +
							  				"," + "'" + val.content + "'" +
							  				"," + "'" + val.total_score +
							  				"'" + "," + "'" + val.score +
							  				"'" +
							  				"," + "'" + val.mode +
							  				"'" + "," + "'" + val.standard +
							  				"'" + "," + "'" + val.totlecheck +
							  				"'" + "," + "'" + val.type +
							  				"'" + "," + "'" + val.parent_id +
							  				"'" + "," + "'" + val.created_time +
							  				"'" + "," + "'" + val.direty +
							  				"'" + "," + "'" + val.delete +
							  				"'" + "," + "'" + val.updatetime +
							  				"'" +
							  				' ) ';
							  			executeSQL("local",
							  				insertsysmenu, ressysmenu => {}
							  			)
							  		} else {
							  			if (resurl[0].direty == 0 &&
							  				resurl[0].delete == 0) {
							  				let sqlupdate =
							  					'update tb_norm_detail set norm_id = ' +
							  					"'" + val.norm_id + "'" +
							  					"," +
							  					' serial = ' + "'" +
							  					val.serial + "'" + "," +
							  					' item = ' + "'" + val.item +
							  					"'" + "," + ' untitled = ' +
							  					"'" + val.untitled + "'" +
							  					"," + ' content = ' + "'" +
							  					val.content + "'" + "," +
							  					' total_score = ' + "'" +
							  					val.total_score + "'" + "," +
							  					' score = ' + "'" + val.score +
							  					"'" + "," + ' mode = ' + "'" +
							  					val.mode + "'" + "," +
							  					' standard = ' + "'" + val.standard +
							  					"'" + "," + ' totlecheck = ' +
							  					"'" + val.totlecheck +
							  					"'" + "," + ' type = ' + "'" +
							  					val.type + "'" + "," +
							  					' parent_id = ' + "'" + val.parent_id +
							  					"'" + "," +
							  					' created_time = ' + "'" +
							  					val.created_time + "'" + "," +
							  					' updatetime = ' + "'" +
							  					val.updatetime + "'" +
							  					' where id = ' + "'" + val.id +
							  					"'";
							  				executeSQL("local", sqlupdate,
							  					resupdate => {})
							  			}
							  		}
							  
							  	})
							  })
							  data.tbnormdetailrow.forEach(val => {
							  	let url =
							  		'select id,norm_detail_id,direty,`delete` from tb_norm_detail_row where id = ' +
							  		"'" +
							  		val.id + "'";
							  	selectSQL('local', url,
							  		resurl => {
							  			if (resurl.length == 0) {
							  				let insertsysmenu =
							  					'insert into tb_norm_detail_row values (' +
							  					"'" + val.id + "'" +
							  					"," + "'" +
							  					val.norm_detail_id +
							  					"'" + "," +
							  					"'" + val.row_id + "'" +
							  					"," + "'" + val.score +
							  					"'" + "," + "'" + val.content +
							  					"'" +
							  					"," + "'" + val.created_time +
							  					"'" + "," + "'" + val.direty +
							  					"'" + "," + "'" + val.delete +
							  					"'" +
							  					"," + "'" + val.updatetime +
							  					"'" +
							  					' ) ';
							  				executeSQL("local",
							  					insertsysmenu,
							  					ressysmenu => {})
							  			} else {
							  				if (resurl[0].direty ==
							  					0 && resurl[0].delete ==
							  					0) {
							  					let sqlupdate =
							  						'update tb_norm_detail_row set norm_detail_id = ' +
							  						"'" + val.norm_detail_id +
							  						"'" + "," +
							  						' row_id = ' + "'" +
							  						val.row_id + "'" + "," +
							  						' score = ' + "'" +
							  						val.score + "'" + "," +
							  						' content = ' +
							  						"'" + val.content +
							  						"'" + "," +
							  						' created_time = ' +
							  						"'" + val.created_time +
							  						"'" + "," +
							  						' updatetime = ' + "'" +
							  						val.updatetime + "'" +
							  						' where id = ' + "'" +
							  						val.id +
							  						"'";
							  					executeSQL("local",
							  						sqlupdate, resupdate => {}
							  					)
							  				}
							  			}
							  
							  		})
							  })

							  data.tbtask.forEach(val => {
							  	let url =
							  		'select task_id,task_name,direty,`delete`,status from tb_task where task_id = ' +
							  		"'" +
							  		val.task_id + "'";
							  	selectSQL('local', url,
							  		resurl => {
							  			if (resurl.length ==
							  				0) {
							  				let insertsysmenu =
							  					'insert into tb_task values (' +
							  					"'" + val.task_id +
							  					"'" + "," + "'" +
							  					val.task_name +
							  					"'" + "," +
							  					"'" + val.unit_id +
							  					"'" + "," + "'" +
							  					val.site_id + "'" +
							  					"," + "'" + val.star_time +
							  					"'" +
							  					"," + "'" + val.end_time +
							  					"'" + "," + "'" +
							  					val.location +
							  					"'" + "," + "'" +
							  					val.frequency +
							  					"'" +
							  					"," + "'" + val.created_time +
							  					"'" + "," + "'" +
							  					val.direty + "'" +
							  					"," + "'" + val.delete +
							  					"'" + "," + "'" +
							  					val.updatetime +
							  					"'" + "," + "'" +
							  					val.totlecheck +
							  					"'" + "," + "'" +
							  					val.type + "'" +
							  					"," + "'" + val.totolequestion +
							  					"'" + "," + "'" +
							  					val.user_id + "'" +
							  					"," + "'" + val.hascheck +
							  					"'" + "," + "'" +
							  					val.status +
							  					"'" +
							  					' ) ';
							  				executeSQL("local",
							  					insertsysmenu,
							  					ressysmenu => {}
							  				)
							  			} else {
											if (resurl[0].direty == 0 && resurl[0].delete == 0) {
												let sqlupdate =
													'update tb_task set task_name = ' +
													"'" + val.task_name +
													"'" + "," +
													' unit_id = ' +
													"'" +
													val.unit_id +
													"'" + "," +
													' site_id = ' +
													"'" + val.site_id +
													"'" + "," +
													' star_time = ' +
													"'" + val.star_time +
													"'" + "," +
													' end_time = ' +
													"'" + val.end_time +
													"'" + "," +
													' location = ' +
													"'" + val.location +
													"'" + "," +
													' frequency = ' +
													"'" + val.frequency +
													"'" + "," +
													' created_time = ' +
													"'" + val.created_time +
													"'" + "," +
													' updatetime = ' +
													"'" + val.updatetime +
													"'" + "," +
													' totlecheck = ' +
													"'" + val.totlecheck +
													"'" + "," +
													' type = ' + "'" +
													val.type + "'" +
													"," +
													' totolequestion = ' +
													"'" + val.totolequestion +
													"'" + "," +
													' user_id = ' +
													"'" + val.user_id +
													"'" + "," +
													' hascheck = ' +
													"'" +
													val.hascheck +
													"'" + "," +
													' status = ' +
													"'" + val.status +
													"'" +
													' where task_id = ' +
													"'" +
													val.task_id +
													"'";
												executeSQL(
													"local",
													sqlupdate,
													resupdate => {}
												)
											}else{
												if(val.status == '8'){
													if(resurl[0].status == '1'){
														
													}else if(resurl[0].status == '100'){
														
													}else if(resurl[0].status == '200'){
														
													}else{
														let sqlupdate =
															'update tb_task set task_name = ' +
															"'" + val.task_name +
															"'" + "," +
															' unit_id = ' +
															"'" +
															val.unit_id +
															"'" + "," +
															' site_id = ' +
															"'" + val.site_id +
															"'" + "," +
															' star_time = ' +
															"'" + val.star_time +
															"'" + "," +
															' end_time = ' +
															"'" + val.end_time +
															"'" + "," +
															' location = ' +
															"'" + val.location +
															"'" + "," +
															' frequency = ' +
															"'" + val.frequency +
															"'" + "," +
															' created_time = ' +
															"'" + val.created_time +
															"'" + "," +
															' updatetime = ' +
															"'" + val.updatetime +
															"'" + "," +
															' totlecheck = ' +
															"'" + val.totlecheck +
															"'" + "," +
															' type = ' + "'" +
															val.type + "'" +
															"," +
															' totolequestion = ' +
															"'" + val.totolequestion +
															"'" + "," +
															' user_id = ' +
															"'" + val.user_id +
															"'" + "," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" + "," +
															' status = ' +
															"'" + val.status +
															"'" +
															' where task_id = ' +
															"'" +
															val.task_id +
															"'";
														executeSQL(
															"local",
															sqlupdate,
															resupdate => {}
														)
														
													}
												}else if(val.status == '1'){
													if(resurl[0].status == '8'){
														
													}else if(resurl[0].status == '100'){
														
													}else if(resurl[0].status == '200'){
														
													}else{
														let sqlupdate =
															'update tb_task set task_name = ' +
															"'" + val.task_name +
															"'" + "," +
															' unit_id = ' +
															"'" +
															val.unit_id +
															"'" + "," +
															' site_id = ' +
															"'" + val.site_id +
															"'" + "," +
															' star_time = ' +
															"'" + val.star_time +
															"'" + "," +
															' end_time = ' +
															"'" + val.end_time +
															"'" + "," +
															' location = ' +
															"'" + val.location +
															"'" + "," +
															' frequency = ' +
															"'" + val.frequency +
															"'" + "," +
															' created_time = ' +
															"'" + val.created_time +
															"'" + "," +
															' updatetime = ' +
															"'" + val.updatetime +
															"'" + "," +
															' totlecheck = ' +
															"'" + val.totlecheck +
															"'" + "," +
															' type = ' + "'" +
															val.type + "'" +
															"," +
															' totolequestion = ' +
															"'" + val.totolequestion +
															"'" + "," +
															' user_id = ' +
															"'" + val.user_id +
															"'" + "," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" + "," +
															' status = ' +
															"'" + val.status +
															"'" +
															' where task_id = ' +
															"'" +
															val.task_id +
															"'";
														executeSQL(
															"local",
															sqlupdate,
															resupdate => {}
														)
													}
													
													
												}else if(val.status == '100'){
													if(resurl[0].status == '8'){
														
													}else if(resurl[0].status == '1'){
														
													}else if(resurl[0].status == '200'){
														
													}else{
														let sqlupdate =
															'update tb_task set task_name = ' +
															"'" + val.task_name +
															"'" + "," +
															' unit_id = ' +
															"'" +
															val.unit_id +
															"'" + "," +
															' site_id = ' +
															"'" + val.site_id +
															"'" + "," +
															' star_time = ' +
															"'" + val.star_time +
															"'" + "," +
															' end_time = ' +
															"'" + val.end_time +
															"'" + "," +
															' location = ' +
															"'" + val.location +
															"'" + "," +
															' frequency = ' +
															"'" + val.frequency +
															"'" + "," +
															' created_time = ' +
															"'" + val.created_time +
															"'" + "," +
															' updatetime = ' +
															"'" + val.updatetime +
															"'" + "," +
															' totlecheck = ' +
															"'" + val.totlecheck +
															"'" + "," +
															' type = ' + "'" +
															val.type + "'" +
															"," +
															' totolequestion = ' +
															"'" + val.totolequestion +
															"'" + "," +
															' user_id = ' +
															"'" + val.user_id +
															"'" + "," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" + "," +
															' status = ' +
															"'" + val.status +
															"'" +
															' where task_id = ' +
															"'" +
															val.task_id +
															"'";
														executeSQL(
															"local",
															sqlupdate,
															resupdate => {}
														)
													}
													
												}else if(val.status == '200'){
													if(resurl[0].status == '8'){
														
													}else if(resurl[0].status == '1'){
														
													}else if(resurl[0].status == '100'){
														
													}else{
														let sqlupdate =
															'update tb_task set task_name = ' +
															"'" + val.task_name +
															"'" + "," +
															' unit_id = ' +
															"'" +
															val.unit_id +
															"'" + "," +
															' site_id = ' +
															"'" + val.site_id +
															"'" + "," +
															' star_time = ' +
															"'" + val.star_time +
															"'" + "," +
															' end_time = ' +
															"'" + val.end_time +
															"'" + "," +
															' location = ' +
															"'" + val.location +
															"'" + "," +
															' frequency = ' +
															"'" + val.frequency +
															"'" + "," +
															' created_time = ' +
															"'" + val.created_time +
															"'" + "," +
															' updatetime = ' +
															"'" + val.updatetime +
															"'" + "," +
															' totlecheck = ' +
															"'" + val.totlecheck +
															"'" + "," +
															' type = ' + "'" +
															val.type + "'" +
															"," +
															' totolequestion = ' +
															"'" + val.totolequestion +
															"'" + "," +
															' user_id = ' +
															"'" + val.user_id +
															"'" + "," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" + "," +
															' status = ' +
															"'" + val.status +
															"'" +
															' where task_id = ' +
															"'" +
															val.task_id +
															"'";
														executeSQL(
															"local",
															sqlupdate,
															resupdate => {}
														)
														
													}
													
												}
												
												
											}
							  			}
							  
							  		})
							  })
							  
							  data.tbtaskdeletestatus.forEach(val => {
							  	let url =
							  		'select task_id,status,direty,`delete` from tb_task_delete_status where task_id = ' +
							  		"'" +
							  		val.task_id +
							  		"'";
							  	selectSQL(
							  		'local', url,
							  		resurl => {
							  			if (resurl.length ==
							  				0) {
							  				let
							  					insertsysmenu =
							  					'insert into tb_task_delete_status values (' +
							  					"'" + val.task_id +
							  					"'" +
							  					"," + "'" +
							  					val.status +
							  					"'" + "," +
							  					"'" + val.direty +
							  					"'" + "," +
							  					"'" + val.delete +
							  					"'" + "," +
							  					"'" + val.updatetime +
							  					"'" + ' ) ';
							  				executeSQL(
							  					"local",
							  					insertsysmenu,
							  					ressysmenu => {}
							  				)
							  			} else {
							  				if (resurl[0]
							  					.direty ==
							  					0 && resurl[
							  						0].delete ==
							  					0) {
							  					let
							  						sqlupdate =
							  						'update tb_task_delete_status set status = ' +
							  						"'" + val.status +
							  						"'" + "," +
							  						' updatetime = ' +
							  						"'" +
							  						val.updatetime +
							  						"'" +
							  						' where task_id = ' +
							  						"'" +
							  						val.task_id +
							  						"'";
							  					executeSQL(
							  						"local",
							  						sqlupdate,
							  						resupdate => {}
							  					)
							  				}
							  			}
							  
							  		})
							  })
							  
							  
							  data.tbtaskdetail.forEach(
							  	val => {
							  
							  		let url =
							  			'select taskdetail_id,task_id,direty,`delete`,status from tb_task_detail where taskdetail_id = ' +
							  			"'" +
							  			val.taskdetail_id +
							  			"'";
							  		selectSQL(
							  			'local',
							  			url,
							  			resurl => {
							  				if (
							  					resurl
							  					.length ==
							  					0) {
							  					let
							  						insertsysmenu =
							  						'insert into tb_task_detail values (' +
							  						"'" +
							  						val.taskdetail_id +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.task_id +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.totlequestion +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.totlecheck +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.hascheck +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.created_time +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.group_id +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.user_id +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.status +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.direty +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.delete +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.updatetime +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.type +
							  						"'" +
							  						"," +
							  						"'" +
							  						val.toperson +
							  						"'" +
							  						' ) ';
							  					executeSQL
							  						(
							  							"local",
							  							insertsysmenu,
							  							ressysmenu => {}
							  						)
							  				} else {
												
												if (resurl[0].direty == 0 && resurl[0].delete == 0) {
													let
														sqlupdate =
														'update tb_task_detail set task_id = ' +
														"'" +
														val.task_id +
														"'" +
														"," +
														' totlequestion = ' +
														"'" +
														val.totlequestion +
														"'" +
														"," +
														' totlecheck = ' +
														"'" +
														val.totlecheck +
														"'" +
														"," +
														' hascheck = ' +
														"'" +
														val.hascheck +
														"'" +
														"," +
														' created_time = ' +
														"'" +
														val.created_time +
														"'" +
														"," +
														' group_id = ' +
														"'" +
														val.group_id +
														"'" +
														"," +
														' user_id = ' +
														"'" +
														val.user_id +
														"'" +
														"," +
														' status = ' +
														"'" +
														val.status +
														"'" +
														"," +
														' updatetime = ' +
														"'" +
														val.updatetime +
														"'" +
														"," +
														' type = ' +
														"'" +
														val.type +
														"'" +
														"," +
														' toperson = ' +
														"'" +
														val.toperson +
														"'" +
														' where taskdetail_id = ' +
														"'" +
														val.taskdetail_id +
														"'";
													executeSQL
														(
															"local",
															sqlupdate,
															resupdate => {}
														)
												}else{
													if(val.status == '8'){
														if(resurl[0].status == '1'){
															
														}else if(resurl[0].status == '100'){
															
														}else if(resurl[0].status == '200'){
															
														}else{
														let
															sqlupdate =
															'update tb_task_detail set task_id = ' +
															"'" +
															val.task_id +
															"'" +
															"," +
															' totlequestion = ' +
															"'" +
															val.totlequestion +
															"'" +
															"," +
															' totlecheck = ' +
															"'" +
															val.totlecheck +
															"'" +
															"," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" +
															"," +
															' created_time = ' +
															"'" +
															val.created_time +
															"'" +
															"," +
															' group_id = ' +
															"'" +
															val.group_id +
															"'" +
															"," +
															' user_id = ' +
															"'" +
															val.user_id +
															"'" +
															"," +
															' status = ' +
															"'" +
															val.status +
															"'" +
															"," +
															' updatetime = ' +
															"'" +
															val.updatetime +
															"'" +
															"," +
															' type = ' +
															"'" +
															val.type +
															"'" +
															"," +
															' toperson = ' +
															"'" +
															val.toperson +
															"'" +
															' where taskdetail_id = ' +
															"'" +
															val.taskdetail_id +
															"'";
														executeSQL
															(
																"local",
																sqlupdate,
																resupdate => {}
															)
															
														}
													}else if(val.status == '1'){
														if(resurl[0].status == '8'){
															
														}else if(resurl[0].status == '100'){
															
														}else if(resurl[0].status == '200'){
															
														}else{
														let
															sqlupdate =
															'update tb_task_detail set task_id = ' +
															"'" +
															val.task_id +
															"'" +
															"," +
															' totlequestion = ' +
															"'" +
															val.totlequestion +
															"'" +
															"," +
															' totlecheck = ' +
															"'" +
															val.totlecheck +
															"'" +
															"," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" +
															"," +
															' created_time = ' +
															"'" +
															val.created_time +
															"'" +
															"," +
															' group_id = ' +
															"'" +
															val.group_id +
															"'" +
															"," +
															' user_id = ' +
															"'" +
															val.user_id +
															"'" +
															"," +
															' status = ' +
															"'" +
															val.status +
															"'" +
															"," +
															' updatetime = ' +
															"'" +
															val.updatetime +
															"'" +
															"," +
															' type = ' +
															"'" +
															val.type +
															"'" +
															"," +
															' toperson = ' +
															"'" +
															val.toperson +
															"'" +
															' where taskdetail_id = ' +
															"'" +
															val.taskdetail_id +
															"'";
														executeSQL
															(
																"local",
																sqlupdate,
																resupdate => {}
															)
														}
														
														
													}else if(val.status == '100'){
														if(resurl[0].status == '8'){
															
														}else if(resurl[0].status == '1'){
															
														}else if(resurl[0].status == '200'){
															
														}else{
														let
															sqlupdate =
															'update tb_task_detail set task_id = ' +
															"'" +
															val.task_id +
															"'" +
															"," +
															' totlequestion = ' +
															"'" +
															val.totlequestion +
															"'" +
															"," +
															' totlecheck = ' +
															"'" +
															val.totlecheck +
															"'" +
															"," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" +
															"," +
															' created_time = ' +
															"'" +
															val.created_time +
															"'" +
															"," +
															' group_id = ' +
															"'" +
															val.group_id +
															"'" +
															"," +
															' user_id = ' +
															"'" +
															val.user_id +
															"'" +
															"," +
															' status = ' +
															"'" +
															val.status +
															"'" +
															"," +
															' updatetime = ' +
															"'" +
															val.updatetime +
															"'" +
															"," +
															' type = ' +
															"'" +
															val.type +
															"'" +
															"," +
															' toperson = ' +
															"'" +
															val.toperson +
															"'" +
															' where taskdetail_id = ' +
															"'" +
															val.taskdetail_id +
															"'";
														executeSQL
															(
																"local",
																sqlupdate,
																resupdate => {}
															)
														}
														
													}else if(val.status == '200'){
														if(resurl[0].status == '8'){
															
														}else if(resurl[0].status == '1'){
															
														}else if(resurl[0].status == '100'){
															
														}else{
														let
															sqlupdate =
															'update tb_task_detail set task_id = ' +
															"'" +
															val.task_id +
															"'" +
															"," +
															' totlequestion = ' +
															"'" +
															val.totlequestion +
															"'" +
															"," +
															' totlecheck = ' +
															"'" +
															val.totlecheck +
															"'" +
															"," +
															' hascheck = ' +
															"'" +
															val.hascheck +
															"'" +
															"," +
															' created_time = ' +
															"'" +
															val.created_time +
															"'" +
															"," +
															' group_id = ' +
															"'" +
															val.group_id +
															"'" +
															"," +
															' user_id = ' +
															"'" +
															val.user_id +
															"'" +
															"," +
															' status = ' +
															"'" +
															val.status +
															"'" +
															"," +
															' updatetime = ' +
															"'" +
															val.updatetime +
															"'" +
															"," +
															' type = ' +
															"'" +
															val.type +
															"'" +
															"," +
															' toperson = ' +
															"'" +
															val.toperson +
															"'" +
															' where taskdetail_id = ' +
															"'" +
															val.taskdetail_id +
															"'";
														executeSQL
															(
																"local",
																sqlupdate,
																resupdate => {}
															)
															
														}
														
													}
													
													
												}	
							  				}
							  
							  			})
							  	})
								data.tbtaskdetailcheckrow.forEach(
									val => {
								
										let
											url =
											'select tasknormdetailid,norm_row_id,direty,`delete` from tb_task_detail_checkrow where tasknormdetailid = ' +
											"'" +
											val
											.tasknormdetailid +
											"'" +
											' and norm_row_id = ' +
											"'" +
											val
											.norm_row_id +
											"'";
										selectSQL
											(
												'local',
												url,
												resurl => {
													if (
														resurl
														.length ==
														0
													) {
														let
															insertsysmenu =
															'insert into tb_task_detail_checkrow values (' +
															"'" +
															val
															.tasknormdetailid +
															"'" +
															"," +
															"'" +
															val
															.norm_row_id +
															"'" +
															"," +
															"'" +
															val
															.score_type +
															"'" +
															"," +
															"'" +
															val
															.score +
															"'" +
															"," +
															"'" +
															val
															.status +
															"'" +
															"," +
															"'" +
															val
															.problempicture +
															"'" +
															"," +
															"'" +
															val
															.remark +
															"'" +
															"," +
															"'" +
															val
															.correct +
															"'" +
															"," +
															"'" +
															val
															.correctremark +
															"'" +
															"," +
															"'" +
															val
															.correctpicture +
															"'" +
															"," +
															"'" +
															val
															.direty +
															"'" +
															"," +
															"'" +
															val
															.delete +
															"'" +
															"," +
															"'" +
															val
															.updatetime +
															"'" +
															' ) ';
														executeSQL
															(
																"local",
																insertsysmenu,
																ressysmenu => {}
															)
													} else {
														if (
															resurl[
																0
															]
															.direty ==
															0 &&
															resurl[
																0
															]
															.delete ==
															0
														) {
															let
																sqlupdate =
																'update tb_task_detail_checkrow set score_type = ' +
																"'" +
																val
																.score_type +
																"'" +
																"," +
																' score = ' +
																"'" +
																val
																.score +
																"'" +
																"," +
																' status = ' +
																"'" +
																val
																.status +
																"'" +
																"," +
																' problempicture = ' +
																"'" +
																val
																.problempicture +
																"'" +
																"," +
																' remark = ' +
																"'" +
																val
																.remark +
																"'" +
																"," +
																' correct = ' +
																"'" +
																val
																.correct +
																"'" +
																"," +
																' correctremark = ' +
																"'" +
																val
																.correctremark +
																"'" +
																"," +
																' correctpicture = ' +
																"'" +
																val
																.correctpicture +
																"'" +
																"," +
																' updatetime = ' +
																"'" +
																val
																.updatetime +
																"'" +
																' where tasknormdetailid = ' +
																"'" +
																val
																.tasknormdetailid +
																"'" +
																' and norm_row_id = ' +
																"'" +
																val
																.norm_row_id +
																"'";
															executeSQL
																(
																	"local",
																	sqlupdate,
																	resupdate => {}
																)
														}
													}
								
												})
									})
									data.tbtaskdetailnorm.forEach(
											val => {
									
												let
													url =
													'select tasknormid,task_id,direty,`delete` from tb_task_detail_norm where tasknormid = ' +
													"'" +
													val
													.tasknormid +
													"'";
												selectSQL
													(
														'local',
														url,
														resurl => {
															if (
																resurl
																.length ==
																0
															) {
																let
																	insertsysmenu =
																	'insert into tb_task_detail_norm values (' +
																	"'" +
																	val
																	.tasknormid +
																	"'" +
																	"," +
																	"'" +
																	val
																	.task_id +
																	"'" +
																	"," +
																	"'" +
																	val
																	.taskdetail_id +
																	"'" +
																	"," +
																	"'" +
																	val
																	.norm_id +
																	"'" +
																	"," +
																	"'" +
																	val
																	.norm_detail_id +
																	"'" +
																	"," +
																	"'" +
																	val
																	.totlecheck +
																	"'" +
																	"," +
																	"'" +
																	val
																	.status +
																	"'" +
																	"," +
																	"'" +
																	val
																	.question +
																	"'" +
																	"," +
																	"'" +
																	val
																	.losescroe +
																	"'" +
																	"," +
																	"'" +
																	val
																	.score +
																	"'" +
																	"," +
																	"'" +
																	val
																	.hascheck +
																	"'" +
																	"," +
																	"'" +
																	val
																	.user_id +
																	"'" +
																	"," +
																	"'" +
																	val
																	.direty +
																	"'" +
																	"," +
																	"'" +
																	val
																	.delete +
																	"'" +
																	"," +
																	"'" +
																	val
																	.updatetime +
																	"'" +
																	' ) ';
																executeSQL
																	(
																		"local",
																		insertsysmenu,
																		ressysmenu => {}
																	)
															} else {
																if (
																	resurl[
																		0
																	]
																	.direty ==
																	0 &&
																	resurl[
																		0
																	]
																	.delete ==
																	0
																) {
																	let
																		sqlupdate =
																		'update tb_task_detail_norm set task_id = ' +
																		"'" +
																		val
																		.task_id +
																		"'" +
																		"," +
																		' taskdetail_id = ' +
																		"'" +
																		val
																		.taskdetail_id +
																		"'" +
																		"," +
																		' norm_id = ' +
																		"'" +
																		val
																		.norm_id +
																		"'" +
																		"," +
																		' norm_detail_id = ' +
																		"'" +
																		val
																		.norm_detail_id +
																		"'" +
																		"," +
																		' totlecheck = ' +
																		"'" +
																		val
																		.totlecheck +
																		"'" +
																		"," +
																		' status = ' +
																		"'" +
																		val
																		.status +
																		"'" +
																		"," +
																		' question = ' +
																		"'" +
																		val
																		.question +
																		"'" +
																		"," +
																		' losescroe = ' +
																		"'" +
																		val
																		.losescroe +
																		"'" +
																		"," +
																		' score = ' +
																		"'" +
																		val
																		.score +
																		"'" +
																		"," +
																		' hascheck = ' +
																		"'" +
																		val
																		.hascheck +
																		"'" +
																		"," +
																		' user_id = ' +
																		"'" +
																		val
																		.user_id +
																		"'" +
																		"," +
																		' updatetime = ' +
																		"'" +
																		val
																		.updatetime +
																		"'" +
																		' where tasknormid = ' +
																		"'" +
																		val
																		.tasknormid +
																		"'";
																	executeSQL
																		(
																			"local",
																			sqlupdate,
																			resupdate => {}
																		)
																}
															}
									
														}
													)
											}
										)
										data.tbtaskdetailnormdetail.forEach(
												val => {
													let
														url =
														'select tasknormdetailid,tasknormid,direty,`delete` from tb_task_detail_norm_detail where tasknormdetailid = ' +
														"'" +
														val
														.tasknormdetailid +
														"'";
													selectSQL
														(
															'local',
															url,
															resurl => {
																if (
																	resurl
																	.length ==
																	0
																) {
																	let
																		insertsysmenu =
																		'insert into tb_task_detail_norm_detail values (' +
																		"'" +
																		val
																		.tasknormdetailid +
																		"'" +
																		"," +
																		"'" +
																		val
																		.tasknormid +
																		"'" +
																		"," +
																		"'" +
																		val
																		.norm_detail_id +
																		"'" +
																		"," +
																		"'" +
																		val
																		.score +
																		"'" +
																		"," +
																		"'" +
																		val
																		.isproblem +
																		"'" +
																		"," +
																		"'" +
																		val
																		.status +
																		"'" +
																		"," +
																		"'" +
																		val
																		.user_id +
																		"'" +
																		"," +
																		"'" +
																		val
																		.direty +
																		"'" +
																		"," +
																		"'" +
																		val
																		.delete +
																		"'" +
																		"," +
																		"'" +
																		val
																		.updatetime +
																		"'" +
																		' ) ';
																	executeSQL
																		(
																			"local",
																			insertsysmenu,
																			ressysmenu => {}
																		)
																} else {
																	if (
																		resurl[
																			0
																		]
																		.direty ==
																		0 &&
																		resurl[
																			0
																		]
																		.delete ==
																		0
																	) {
																		let
																			sqlupdate =
																			'update tb_task_detail_norm_detail set tasknormid = ' +
																			"'" +
																			val
																			.tasknormid +
																			"'" +
																			"," +
																			' norm_detail_id = ' +
																			"'" +
																			val
																			.norm_detail_id +
																			"'" +
																			"," +
																			' score = ' +
																			"'" +
																			val
																			.score +
																			"'" +
																			"," +
																			' isproblem = ' +
																			"'" +
																			val
																			.isproblem +
																			"'" +
																			"," +
																			' status = ' +
																			"'" +
																			val
																			.status +
																			"'" +
																			"," +
																			' user_id = ' +
																			"'" +
																			val
																			.user_id +
																			"'" +
																			"," +
																			' updatetime = ' +
																			"'" +
																			val
																			.updatetime +
																			"'" +
																			' where tasknormdetailid = ' +
																			"'" +
																			val
																			.tasknormdetailid +
																			"'";
																		executeSQL
																			(
																				"local",
																				sqlupdate,
																				resupdate => {}
																			)
																	}
																}
															}
														)
												}
											)
											data.tbtaskinfo.forEach(
													val => {
											
														let
															url =
															'select task_id,direty,`delete` from tb_task_info where task_id = ' +
															"'" +
															val
															.task_id +
															"'";
														selectSQL
															(
																'local',
																url,
																resurl => {
																	if (
																		resurl
																		.length ==
																		0
																	) {
																		let
																			insertsysmenu =
																			'insert into tb_task_info values (' +
																			"'" +
																			val
																			.task_id +
																			"'" +
																			"," +
																			"'" +
																			val
																			.usernormrel +
																			"'" +
																			"," +
																			"'" +
																			val
																			.normtext +
																			"'" +
																			"," +
																			"'" +
																			val
																			.collapseList +
																			"'" +
																			"," +
																			"'" +
																			val
																			.normdetailids +
																			"'" +
																			"," +
																			"'" +
																			val
																			.type +
																			"'" +
																			"," +
																			"'" +
																			val
																			.flag +
																			"'" +
																			"," +
																			"'" +
																			val
																			.direty +
																			"'" +
																			"," +
																			"'" +
																			val
																			.delete +
																			"'" +
																			"," +
																			"'" +
																			val
																			.updatetime +
																			"'" +
																			' ) ';
																		executeSQL
																			(
																				"local",
																				insertsysmenu,
																				ressysmenu => {}
																			)
																	} else {
																		if (
																			resurl[
																				0
																			]
																			.direty ==
																			0 &&
																			resurl[
																				0
																			]
																			.delete ==
																			0
																		) {
																			let
																				sqlupdate =
																				'update tb_task_info set usernormrel = ' +
																				"'" +
																				val
																				.usernormrel +
																				"'" +
																				"," +
																				' normtext = ' +
																				"'" +
																				val
																				.normtext +
																				"'" +
																				"," +
																				' collapseList = ' +
																				"'" +
																				val
																				.collapseList +
																				"'" +
																				"," +
																				' normdetailids = ' +
																				"'" +
																				val
																				.normdetailids +
																				"'" +
																				"," +
																				' type = ' +
																				"'" +
																				val
																				.type +
																				"'" +
																				"," +
																				' flag = ' +
																				"'" +
																				val
																				.flag +
																				"'" +
																				"," +
																				' updatetime = ' +
																				"'" +
																				val
																				.updatetime +
																				"'" +
																				' where task_id = ' +
																				"'" +
																				val
																				.task_id +
																				"'";
																			executeSQL
																				(
																					"local",
																					sqlupdate,
																					resupdate => {}
																				)
																		}
																	}
											
																}
															)
													}
												)
					
					
					let sql21 = 'select * from sys_menu where direty = 1 or `delete` = 1';
						selectSQL('local',sql21,resmenus21 => {
							let sql22 = 'select * from sys_menu_table where direty = 1 or `delete` = 1 order by updatetime ASC';
						selectSQL('local',sql22,resmenus22 => {  
							let sql23 ='select * from sys_role where direty = 1 or `delete` = 1';	
							selectSQL('local',sql23,resmenus23 => {
								let sql24 ='select * from sys_unit where direty = 1 or `delete` = 1';
							    selectSQL('local',sql24,resmenus24 => {
									let sql25 ='select * from sys_user where direty = 1 or `delete` = 1';
								    selectSQL('local',sql25,resmenus25 => {	
										let sql26 = 'select * from tb_excel where direty = 1 or `delete` = 1';
										  selectSQL('local',sql26,resmenus26 => {	
											  let sql27 ='select * from tb_excel_category where direty = 1 or `delete` = 1';
											   selectSQL('local',sql27,resmenus27 => {	
												   let sql28 ='select * from tb_excel_user where direty = 1 or `delete` = 1 order by updatetime ASC';
												  selectSQL('local',sql28,resmenus28 => {
													  let sql29 ='select * from tb_group_report where direty = 1 or `delete` = 1'; 
														selectSQL('local',sql29,resmenus29 => {
															let sql30 ='select * from tb_message where direty = 1 or `delete` = 1';
														selectSQL('local',sql30,resmenus30 => {
															let sql31 = 'select * from tb_message_user where direty = 1 or `delete` = 1 order by updatetime ASC';
							                               selectSQL('local',sql31,resmenus31 => {
					                                           let sql32 = 'select * from tb_norm where direty = 1 or `delete` = 1';
															   selectSQL('local',sql32,resmenus32 => {
																  let sql33 = 'select * from tb_norm_detail where direty = 1 or `delete` = 1';
																  selectSQL('local',sql33,resmenus33 => {
																	let sql34 = 'select * from tb_norm_detail_row where direty = 1 or `delete` = 1';
																	selectSQL('local',sql34,resmenus34 => {
																		let sql35 = 'select * from tb_task where direty = 1 or `delete` = 1';
																		selectSQL('local',sql35,resmenus35 => {
																			let sql36 ='select * from tb_task_delete_status where direty = 1 or `delete` = 1';
																			selectSQL('local',sql36,resmenus36 => {
																				let sql37 = 'select * from tb_task_detail where direty = 1 or `delete` = 1';
																				selectSQL('local',sql37,resmenus37 => {
																					
																					
																					let sql38 ='select * from tb_task_detail_checkrow where direty = 1 or `delete` = 1 order by updatetime ASC';
																					selectSQL('local',sql38,resmenus38 => {
																						let sql39 ='select * from tb_task_detail_norm where direty = 1 or `delete` = 1';
																						selectSQL('local',sql39,resmenus39 => {
																							let  sql40 ='select * from tb_task_detail_norm_detail where direty = 1 or `delete` = 1';
																							selectSQL('local',sql40,resmenus40 => {
																								let sql41 ='select * from tb_task_info where direty = 1 or `delete` = 1';
																								selectSQL('local',sql41,resmenus41 => {
																								var obj = {"resmenus21": JSON.stringify(resmenus21),"resmenus22": JSON.stringify(resmenus22),"resmenus23": JSON.stringify(resmenus23),"resmenus24": JSON.stringify(resmenus24),"resmenus25": JSON.stringify(resmenus25),"resmenus26": JSON.stringify(resmenus26),"resmenus27": JSON.stringify(resmenus27),"resmenus28": JSON.stringify(resmenus28),"resmenus29": JSON.stringify(resmenus29),"resmenus30": JSON.stringify(resmenus30),"resmenus31": JSON.stringify(resmenus31),"resmenus32": JSON.stringify(resmenus32),"resmenus33": JSON.stringify(resmenus33),"resmenus34": JSON.stringify(resmenus34),"resmenus35": JSON.stringify(resmenus35),"resmenus36": JSON.stringify(resmenus36),"resmenus37": JSON.stringify(resmenus37),"resmenus38": JSON.stringify(resmenus38),"resmenus39": JSON.stringify(resmenus39),"resmenus40": JSON.stringify(resmenus40),"resmenus41": JSON.stringify(resmenus41)}
																								
																								helper.requestUrl(helper.websiteUrl + "v1/inserttables", obj, 'POST', (data) => {
																								
																									
																									var ids ="";
																									for (var value of data.accountsresmenus21) {
																										ids = ids + "'" + value.menu_id + "'" + ",";
																									}
																									
																									ids = ids.substring(0,ids.length -1);
																									let update21 =
																										'update sys_menu set direty = 0 ' + "," +' `delete` = 0 ' + ' where menu_id in (' + ids + ')';
																									executeSQL("local",update21,resup21 => {})
																									for (var value of data.accountsresmenus22) {
																										let update22 ='update sys_menu_table set direty = 0 ' + "," + ' `delete` = 0 ' + ' where role_id = ' +
																											"'" + value.role_id + "'" + ' and menu_id = ' + "'" + value.menu_id + "'" + ' and updatetime = ' + "'" + value.updatetime + "'";
																										executeSQL("local",update22,resup22 => {})
																									}
																									
																									
																									var  ids1 = "";
																									for (var value of data.accountsresmenus23 ) {
																										ids1 = ids1 + "'" + value.role_id + "'" + ",";
																									}
																									ids1 = ids1.substring(0,ids1.length - 1);
																									let update23 ='update sys_role set direty = 0 ' + "," + ' `delete` = 0 ' + ' where role_id in (' + ids1 + ')';
																									executeSQL("local",update23,resup23 => {})
																									
																									
																									var ids2 = "";
																									for (var value of  data.accountsresmenus24) {
																										ids2 = ids2 + "'" + value.unit_id + "'" + ",";
																									}
																									ids2 = ids2.substring(0,ids2.length - 1);
																									let update24 ='update sys_unit set direty = 0 ' + "," + ' `delete` = 0 ' + ' where unit_id in (' + ids2 + ')';
																									executeSQL("local",update24,resup24 => {});
																									
																									var ids3 = "";
																									for (var value of data.accountsresmenus25) {
																										ids3 = ids3 + "'" + value.user_id + "'" + ",";
																									}
																									ids3 = ids3.substring(0,ids3.length - 1);
																									let update25 ='update sys_user set direty = 0 ' + "," + ' `delete` = 0 ' + ' where user_id in (' + ids3 + ')';
																									executeSQL("local",update25,resup25 => {})
																									
																									var ids4 = "";
																									for (var value of data.accountsresmenus26) {
																										ids4 = ids4 + "'" + value.id + "'" + ",";
																									}
																									ids4 = ids4.substring(0,ids4.length - 1);
																									let update26 = 'update tb_excel set direty = 0 ' + "," + ' `delete` = 0 ' + ' where id in (' + ids4 + ')';
																									executeSQL("local",update26,resup26 => {})
																									
																									var ids5 = "";
																									for (var value of data.accountsresmenus27) {
																										ids5 = ids5 + "'" + value.id + "'" + ",";
																									}
																									ids5 = ids5.substring(0,ids5.length - 1);
																									let update27 ='update tb_excel_category set direty = 0 ' + "," + ' `delete` = 0 ' + ' where id in (' + ids5 + ')';
																									executeSQL("local",update27,resup27 => {})
																									
																									
																									for (var value of data.accountsresmenus28) {
																										let update28 =
																											'update tb_excel_user set direty = 0 ' + "," + ' `delete` = 0 ' + ' where excel_id = ' +
																											"'" + value.excel_id + "'" + ' and user_id = ' + "'" + value.user_id + "'" + ' and updatetime = ' +
																											"'" + value.updatetime + "'";
																										executeSQL("local",update28,resup28 => {})
																									}
																									
																									
																									var ids6 = "";
																									for (var value of data.accountsresmenus29) {
																										ids6 = ids6 + "'" + value.id + "'" + ",";
																									}	
																					                ids6 = ids6.substring(0,ids6.length - 1);
																									let update29 = 'update tb_group_report set direty = 0 ' + "," + ' `delete` = 0 ' + ' where id in (' + ids6 + ')';
																									executeSQL("local",update29,resup29 => {})																																																																																																																																
																																																																																																																																																										
																									var ids7 = "";
																									for (var value of data.accountsresmenus30){
																									ids7 = ids7 + "'" + value.id + "'" + ",";
																									}
																									ids7 =ids7.substring(0,ids7.length - 1);
																									let update30 = 'update tb_message set direty = 0 ' + "," +
																									' `delete` = 0 ' + ' where id in (' + ids7 + ')';
																									executeSQL("local",update30,resup30 => {})
																									
																									for (var value of data.accountsresmenus31) {
																									let update31 = 'update tb_message_user set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where message_id = ' + "'" +
																									value.message_id + "'" + ' and user_id = ' + "'" +
																									value.user_id + "'" + ' and updatetime = ' + "'" +
																									value.updatetime + "'";
																									executeSQL("local",update31,resup31 => {})
																									}
																									
																									var ids8 = "";
																									for (var value of data.accountsresmenus32) {
																									ids8 = ids8 + "'" + value.norm_id + "'" + ",";
																									}
																									ids8 = ids8.substring(0,ids8.length - 1);
																									let update32 = 'update tb_norm set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where norm_id in (' +
																									ids8 + ')';
																									executeSQL("local",update32,resup32 => {})
																									
																									var ids9 = "";
																									for (var value of data.accountsresmenus33) {
																									ids9 = ids9 + "'" + value.id + "'" + ",";
																									}
																									ids9 = ids9.substring(0,ids9.length - 1);
																									let update33 =
																									'update tb_norm_detail set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where id in (' +
																									ids9 + ')';
																									executeSQL("local",update33,resup33 => {})
																																																																																																																																																														
																									
																									var ids10 = "";
																									for (var value of data.accountsresmenus34) {
																									ids10 = ids10 + "'" + value.id + "'" + ",";
																									}
																									ids10 = ids10.substring(0,ids10.length - 1);
																									let update34 =
																									'update tb_norm_detail_row set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where id in (' +
																									ids10 + ')';
																									executeSQL("local",update34,resup34 => {})																																																																																																																																					
																																																																																																																																																															
																									var ids11 = "";
																									for (var value of data.accountsresmenus35) {
																									ids11 = ids11 + "'" + value.task_id + "'" + ",";
																									}
																									ids11 = ids11.substring(0,ids11.length - 1);
																									let update35 =
																									'update tb_task set direty = 0 ' +
																									"," + ' `delete` = 0 ' +
																									' where task_id in (' + ids11 + ')';
																									executeSQL("local",update35,resup35 => {})	
																									
																									
																									var ids12 = "";
																									for (var value of data.accountsresmenus36) {
																									ids12 = ids12 + "'" + value.task_id + "'" + ",";
																									}
																									ids12 = ids12.substring(0,ids12.length - 1);
																									let update36 =
																									'update tb_task_delete_status set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where task_id in (' +
																									ids12 + ')';
																									executeSQL("local",update36,resup36 => {})
																																																																																																																																																												
																									var ids13 = "";
																									for (var value of data.accountsresmenus37) {
																									ids13 = ids13 + "'" + value.taskdetail_id + "'" + ",";
																									}
																									ids13 = ids13.substring(0,ids13.length - 1);
																									let update37 =
																									'update tb_task_detail set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where taskdetail_id in (' +
																									ids13 + ')';
																									executeSQL("local",update37,resup37 => {})																																																																																																																																			
																									
																									for (var value of data.accountsresmenus38) {
																									let update38 =
																									'update tb_task_detail_checkrow set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where tasknormdetailid = ' +
																									"'" + value.tasknormdetailid + "'" + ' and norm_row_id = ' +
																									"'" + value.norm_row_id + "'" + ' and updatetime = ' + "'" +
																									value.updatetime + "'";
																									executeSQL("local",update38,resup38 => {})
																									}
																																																																																																																																																												
																									var ids14 = "";
																									for (var value of data.accountsresmenus39) {
																									ids14 = ids14 + "'" + value.tasknormid + "'" + ",";
																									}
																									ids14 =ids14.substring(0,ids14.length - 1);
																									let update39 =
																									'update tb_task_detail_norm set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where tasknormid in (' +
																									ids14 + ')';
																									executeSQL("local",update39,resup39 => {})																																																																																																																																			
																																																																																																																																																															
																									var ids15 = "";
																									for (var value of data.accountsresmenus40) {
																									ids15 = ids15 + "'" + value.tasknormdetailid + "'" + ",";
																									}
																									ids15 = ids15.substring(0,ids15.length - 1);
																									let update40 = 'update tb_task_detail_norm_detail set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where tasknormdetailid in (' +
																									ids15 + ')';
																									executeSQL("local",update40,resup40 => {})
																																																																																																																																																																
																									var ids16 = "";
																									for (var value of data.accountsresmenus41) {
																									ids16 = ids16 + "'" + value.task_id + "'" + ",";
																									}
																									ids16 = ids16.substring(0,ids16.length - 1);
																									let update41 =
																									'update tb_task_info set direty = 0 ' +
																									"," + ' `delete` = 0 ' + ' where task_id in (' +
																									ids16 + ')';
																									executeSQL("local",update41,resup41 => {
																										uploadImage();
																										uni.hideLoading();
																										_this.maskSync=false;
																										uni.showToast({
																										title: '同步成功',
																										icon: 'none'
																										})
																										// #ifdef APP-PLUS
																											plus.device.setWakelock(false);
																										// #endif
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
				

			},




			// 左侧菜单滑动关闭
			// 触摸开始事件
			touchStart(e) {
				this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点 
				// 使用js计时器记录时间  
				this.interval = setInterval(function() {
					this.time++;
				}, 100);
			},
			// 触摸移动事件 
			touchMove(e) {
				this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点 
				// 向左滑动 (如果是左边的弹窗) 
				if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10) {
					this.showDrawer = false
				}
			},
			// 触摸结束事件 
			touchEnd(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},
			//导出全部滑动关闭
			touchStart1(e) {
				this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点
				this.touchDotY = e.touches[0].pageY; // 获取触摸时的y原点 
				// 使用js计时器记录时间  
				this.interval = setInterval(function() {
					this.time++;
				}, 100);
			},
			// 触摸移动事件 
			touchMove1(e) {
				this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点
				this.touchMoveY = e.touches[0].pageY; // 获取移动时的y原点 
				// 向左滑动 (如果是左边的弹窗) 
				if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10 && this.curMode == "left") {
					this.cancelCheck()
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == "bottom") {
					this.cancelCheck()
				}
			},
			// 触摸结束事件 
			touchEnd1(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},
			//筛选条件滑动关闭
			touchStart2(e) {
				this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点
				this.touchDotY = e.touches[0].pageY; // 获取触摸时的y原点 
				// 使用js计时器记录时间  
				this.interval = setInterval(function() {
					this.time++;
				}, 100);
			},
			// 触摸移动事件 
			touchMove2(e) {
				this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点
				this.touchMoveY = e.touches[0].pageY; // 获取移动时的y原点 
				// 向左滑动 (如果是左边的弹窗) 
				if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10 && this.curMode == "left") {
					this.showlistout1 = false
					this.showlistout2 = false
					this.showlistout3 = false
					this.showlistout4 = false
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == "bottom") {
					this.showlistout1 = false
					this.showlistout2 = false
					this.showlistout3 = false
					this.showlistout4 = false
				}
			},
			// 触摸结束事件 
			touchEnd2(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},
			//选择单位
			checkboxChange(e) {},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.checkcompany = '';
				e.map(val => {
					this.checkcompany += val + ',';
				})
				this.checkcompany = this.checkcompany.slice(0, this.checkcompany.length - 1)
				if (e.length == this.listout1.length) {
					this.listout1choose = true;
					this.checkcompany = '全部单位';
				} else {
					this.listout1choose = false;
				}
			},
			// 全选
			checkedAll() {
				if (this.listout1choose == true) {
					this.listout1.map(val => {
						val.checked = true;
						this.checkcompany = '全部单位';
					})
				} else {
					this.listout1.map(val => {
						val.checked = false;
						this.checkcompany = '';
					})
				}

			},
			openlistout1() {
				uni.setStorageSync('valueoutlist1', this.checkcompany)
				uni.setStorageSync('listout1', this.listout1)
				uni.setStorageSync('listout1choose', this.listout1choose)
				this.showlistout1 = true;
			},
			closeout1() {
				const list = uni.getStorageSync('listout1');
				const value = uni.getStorageSync('valueoutlist1');
				const checked = uni.getStorageSync('listout1choose');
				if (list) {
					this.listout1 = list
				}
				if (value) {
					this.checkcompany = value
				}
				if (checked == false || checked) {
					this.listout1choose = checked;
				}
				this.showlistout1 = false;
			},
			sureout1() {
				this.showlistout1 = false;
			},
			//选择人员
			checkboxChange2(e) {},
			checkboxGroupChange2(e) {
				this.checkperson = '';
				e.map(val => {
					this.checkperson += val + ',';
				})
				this.checkperson = this.checkperson.slice(0, this.checkperson.length - 1)
				if (e.length == this.listout2.length) {
					this.listout2choose = true;
					this.checkperson = '全部人员';
				} else {
					this.listout2choose = false;
				}
			},
			// 全选
			checkedAll2() {
				if (this.listout2choose == true) {
					this.listout2.map(val => {
						val.checked = true;
						this.checkperson = '全部人员';
					})
				} else {
					this.listout2.map(val => {
						val.checked = false;
						this.checkperson = '';
					})
				}
			},
			openlistout2() {
				uni.setStorageSync('valueoutlist2', this.checkperson)
				uni.setStorageSync('listout2', this.listout2)
				uni.setStorageSync('listout2choose', this.listout2choose)
				this.showlistout2 = true;
			},
			closeout2() {
				const list = uni.getStorageSync('listout2');
				const value = uni.getStorageSync('valueoutlist2');
				const checked = uni.getStorageSync('listout1choose');
				if (list) {
					this.listout2 = list
				}
				if (value) {
					this.checkperson = value
				}
				if (checked == false || checked) {
					this.listout2choose = checked;
				}
				this.showlistout2 = false;
			},
			sureout2() {
				this.showlistout2 = false;
			},
			//选择标准
			checkboxChange3(e) {},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange3(e) {
				this.checkstandrd = '';
				e.map(val => {
					this.checkstandrd += val + ',';
				})
				this.checkstandrd = this.checkstandrd.slice(0, this.checkstandrd.length - 1)
				if (e.length == this.listout3.length) {
					this.listout3choose = true;
					this.checkstandrd = '全部标准';
				} else {
					this.listout3choose = false;
				}
			},
			// 全选
			checkedAll3() {
				if (this.listout3choose == true) {
					this.listout3.map(val => {
						val.checked = true;
						this.checkstandrd = '全部标准';
					})
				} else {
					this.listout3.map(val => {
						val.checked = false;
						this.checkstandrd = '';
					})
				}
			},
			openlistout3() {
				uni.setStorageSync('valueoutlist3', this.checkstandrd)
				uni.setStorageSync('listout3', this.listout3)
				uni.setStorageSync('listout3choose', this.listout3choose)
				this.showlistout3 = true;
			},
			closeout3() {
				const list = uni.getStorageSync('listout3');
				const value = uni.getStorageSync('valueoutlist3');
				const checked = uni.getStorageSync('listout3choose');
				if (list) {
					this.listout3 = list
				}
				if (value) {
					this.checkstandrd = value
				}
				if (checked == false || checked) {
					this.listout3choose = checked;
				}
				this.showlistout3 = false;
			},
			sureout3() {
				this.showlistout3 = false;
			},
			//选择任务
			checkboxChange4(e) {},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange4(e) {
				this.checktask = '';
				e.map(val => {
					this.checktask += val + ',';
				})
				this.checktask = this.checktask.slice(0, this.checktask.length - 1)
				if (e.length == this.listout4.length) {
					this.listout4choose = true;
					this.checktask = '全部任务';
				} else {
					this.listout4choose = false;
				}
			},
			// 全选
			checkedAll4() {
				if (this.listout4choose == true) {
					this.listout4.map(val => {
						val.checked = true;
						this.checktask = '全部任务';
					})
				} else {
					this.listout4.map(val => {
						val.checked = false;
						this.checktask = '';
					})
				}
			},
			openlistout4() {
				uni.setStorageSync('valueoutlist4', this.checktask)
				uni.setStorageSync('listout4', this.listout4)
				uni.setStorageSync('listout4choose', this.listout4choose)
				this.showlistout4 = true;
			},
			closeout4() {
				const list = uni.getStorageSync('listout4');
				const value = uni.getStorageSync('valueoutlist4');
				const checked = uni.getStorageSync('listout4choose');
				if (list) {
					this.listout4 = list
				}
				if (value) {
					this.checktask = value
				}
				if (checked == false || checked) {
					this.listout4choose = checked;
				}
				this.showlistout4 = false;
			},
			sureout4() {
				this.showlistout4 = false;
			},
			//选择时间
			openlistout5() {
				this.showchecktime = true;
			},
			dateoutconfirm(e) {
				if (e.startDate == '0-00-00' || e.endDate == '0-00-00') {
					this.showchecktime = true;
					this.$refs.uToast.show({
						title: '请选择开始日期与结束日期',
						type: 'warning'
					})

				} else {
					this.checktime = e.startDate + '至' + e.endDate;
					this.showchecktime = false;
				}
			},
			emptytime() {
				this.checktime = '';
				this.$refs.calendar.init();
				this.showchecktime = false;
			},
			//目录说明
			explain() {
				if (this.explainlock) return;
				this.explainlock = true;
				this.showExplain = true;
				setTimeout(() => {
					this.explainlock = false;
				}, 500)
			},
			confirmExplain() {
				this.showExplain = false;
			},
			// 考试
			toExam() {
				if (this.examlock) return;
				this.examlock = true;
				if (this.net) {
					uni.showToast({
						title: '考试需先连接网络',
						icon: 'none'
					});
				} else {
					uni.navigateTo({
						url: '../../pages/exam/exam'
					})
				}
				setTimeout(() => {
					this.examlock = false;
				}, 500)
			},
			//公告
			toPublic() {
				if (this.publiclock) return;
				this.publiclock = true;
				uni.setStorageSync("publicMsg", true);
				uni.navigateTo({
					url: '../../pages/public/publicList'
				})
				setTimeout(() => {
					this.publiclock = false;
				}, 500)
			},
			//回收站
			toRecycle() {
				if (this.recyclelock) return;
				this.recyclelock = true;
				uni.navigateTo({
					url: '../../pages/recycle/recycle'
				})
				setTimeout(() => {
					this.recyclelock = false;
				}, 500)
			},
			//切换账号
			toLogin() {
				this.showAccount = true;
			},
			//确认切换账号
			accountChange() {
				uni.clearStorage();
				uni.clearStorageSync();
				uni.setStorageSync('NAME', this.username);
				uni.setStorageSync('PHONE', this.phone);
				uni.setStorageSync('loginway',this.loginway);
				uni.reLaunch({
					url: '/pages/login/login'
				});
			},
			// 导出弹框
			checkOut() {
				this.queryFilters();
				this.chooseModal = true;
			},
			cancelCheck() {
				this.emptytime();
				this.chooseModal = false;
				//清空所有选中的数据
				this.checkpic = '是'
				this.checktype = '全部数据'
				this.checkdata = '否'
				this.checkcompany = '全部单位'
				this.checkperson = '全部人员'
				this.checkstandrd = '全部标准'
				this.checktask = '全部任务'
				this.listout1choose = true
				this.listout2choose = true
				this.listout3choose = true
				this.listout4choose = true
				this.listout1.forEach(item => {
					item.checked = false
				})
				this.listout2.forEach(item => {
					item.checked = false
				})
				this.listout3.forEach(item => {
					item.checked = false
				})
				this.listout4.forEach(item => {
					item.checked = false
				})
				this.checktime = ''
				this.checkpic = '是'
				this.checktype = '全部数据'
			},
			//导出数据
			confirmCheck() {
				if (this.checklock) return;
				this.checklock = true;
				let functionid = uni.getStorageSync("functionid")
				let obj = {}
				if (functionid == 1) {
					let unit = []
					this.listout1.forEach(item => {
						if (item.checked) {
							unit.push(item.id)
						}
					})
					let user = []
					this.listout2.map(item => {
						if (item.checked) {
							user.push(item.id)
						}
					})
					let excel = []
					this.listout3.map(item => {
						if (item.checked && item.type == 3) {
							excel.push(item.id)
						}
					})
					this.listout3.map(item => {
						if (item.checked && item.type == 4) {
							item.child.forEach(entry => {
								excel.push(entry)
							})
						}
					})
					if (excel.length == 0) {
						this.listout3.map(item => {
							if (item.type == 4) {
								item.child.forEach(entry => {
									excel.push(entry)
								})
							}
						})
						this.listout3.map(item => {
							if (item.type == 3) {
								excel.push(item.id)
							}
						})
					}
					obj.unit = unit
					obj.user = user
					obj.excel = excel
					obj.checktime = this.checktime
					obj.checkpic = this.checkpic
					obj.checktype = this.checktype
				}
				if (functionid == 2) {
					let unit = []
					this.listout1.map(item => {
						if (item.checked) {
							unit.push(item.id)
						}
					})
					let user = []
					this.listout2.map(item => {
						if (item.checked) {
							user.push(item.id)
						}
					})
					if (user.length == 0) {
						this.listout2.map(item => {
							user.push(item.id)
						})
					}
					if (user.length == this.listout2.length) {
						user.push(uni.getStorageSync("USER_ID"))
					}
					let excel = []
					this.listout3.map(item => {
						if (item.checked) {
							excel.push(item.id)
						}
					})
					let task = []
					this.listout4.map(item => {
						if (item.checked) {
							task.push(item.id)
						}
					})
					obj.unit = unit
					obj.user = user
					obj.excel = excel
					obj.task = task
					obj.checktime = this.checktime
					obj.checkpic = this.checkpic
					obj.checktype = this.checktype
				}
				if (functionid == 3) {
					let unit = []
					this.listout1.map(item => {
						if (item.checked) {
							unit.push(item.id)
						}
					})
					let task = []
					this.listout4.map(item => {
						if (item.checked) {
							task.push(item.id)
						}
					})
					obj.unit = unit
					obj.task = task
					obj.checktime = this.checktime
					obj.checkpic = this.checkpic
					obj.checktype = this.checktype
				}
				var w = plus.nativeUI.showWaiting("处理中，请等待...", {
					style: "black",
					loading: {
						display: "inline"
					}
				});
				importUserToData(obj, functionid, uni.getStorageSync("USER_ID"), this.userIds).then(res => {
					if (res.constructor === String) {
						if (res == "isFlag") {
							w.close();
							//以上成对，加载之前showLoading，加载之后hideToast
							plus.nativeUI.toast('暂无数据');
						} else {
							w.close();
							//以上成对，加载之前showLoading，加载之后hideToast
							plus.nativeUI.toast(res);
							this.cancelCheck()
						}
					} else {
						w.close();
						//以上成对，加载之前showLoading，加载之后hideToast
						plus.nativeUI.toast("导出数据失败了");
					}
				})
				setTimeout(() => {
					this.checklock = false
				}, 500)
			},

			//抽屉是否显示
			drawer() {
				this.showDrawer = true;
			},
			// 返回
			back() {
				if (this.backUrl) {
					uni.navigateTo({
						url: this.backUrl
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			onUpload() {
				if (this.uploadlock) return;
				this.uploadlock = true;
				let uid = uni.getStorageSync('USER_ID');
				let functionid = uni.getStorageSync('functionid');
				let company_id = uni.getStorageSync('company_id');
				let _this = this;
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					// nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: _this.$mp.page.$getAppWebview(),
					// #endif
					//非真实地址，记得更换,调试时ios有跨域，需要后端开启跨域并且接口地址不要使用http://localhost/
					url: 'v1/uploadExcel',
					//默认file,上传文件的key
					name: 'file',
					header: {},
					data: {
						uid: uid,
						functionid: functionid,
						flag: 1,
						company_id: company_id
					}
				});
				setTimeout(() => {
					this.uploadlock = false;
				}, 500)
			},
			onSuccess(res) {
				let data = JSON.stringify(res);
				uni.showToast({
					title: data.data,
					icon: 'none'
				});
			},
			templateUpload() {
				if (this.templatelock) return;
				this.templatelock = true;
				var w = plus.nativeUI.showWaiting("处理中，请等待...", {
					style: "black",
					loading: {
						display: "inline"
					}
				});
				uploadExcelTemplate().then(res => {
					w.close();
					//以上成对，加载之前showLoading，加载之后hideToast
					plus.nativeUI.toast(res);
					this.cancelCheck()
				})
				setTimeout(() => {
					this.templatelock = false;
				}, 500)
			},
			queryFilters() {
				queryFilter(uni.getStorageSync("USER_ID"), uni.getStorageSync("functionid")).then(res => {
					if (res.unitList) {
						if (res.unitList.length > 0) {
							this.listout1Flag = true
						} else {
							this.listout1Flag = false
						}
						this.listout1 = res.unitList
					}
					if (res.userList) {
						if (res.userList.length > 0) {
							this.listout2Flag = true
						} else {
							this.listout2Flag = false
						}
						this.listout2 = res.userList
					}
					if (res.excelList) {
						if (res.excelList.length > 0) {
							this.listout3Flag = true
						} else {
							this.listout3Flag = false
						}
						this.listout3 = res.excelList
					}
					if (res.taskList) {
						if (res.taskList.length > 0) {
							this.listout4Flag = true
						} else {
							this.listout4Flag = false
						}
						this.listout4 = res.taskList
					}
				})
			},
			queryCompanyGroup() {
				let arr = []
				queryCompanyGroup(uni.getStorageSync("USER_ID")).then(res => {
					res.group.forEach(item => {
						arr.push(item.id)
					})
				})
				this.userIds = arr
			}
		},
	}
</script>

<style scoped lang="scss">
	//弹出框样式
	/deep/.u-model__title {
		padding: 24rpx 0;
	}
	.masklock {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 10076;
		background: rgba(255, 255, 255, 0.01);
	}

	.contentModel {
		padding: 30rpx;

		.succcess {
			font-size: 30rpx;
		}

		.explain {
			line-height: 50rpx;
			color: #999999;
			font-size: 28rpx;
		}
	}

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

				.head_back,
				.drawer {
					display: flex;
					align-items: center;
					width: 88rpx;
					height: 88rpx;
					position: absolute;
				}

			}




		}
	}

	// 左侧弹出 
	.person {

		.headpart {
			background: #6ecac3;
			padding: 60rpx 30rpx 30rpx 30rpx;

			.headperson {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 30rpx 0;

				.imgPart {
					text-align: center;
					border-radius: 50%;

					image {
						width: 120rpx;
						height: 120rpx;
						border-radius: 50%;
					}
				}

				.headright {
					width: 100%;
					flex: 1;
					padding-left: 20rpx;

					.rightpart {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.info {
							line-height: 60rpx;
							font-size: 30rpx;
							color: #FFFFFF;
							
							.infouser{
								display: flex;
								align-items: center;
								.username{
									padding-right: 10rpx;
								}
							}
						}

						.change {
							// border: 1px solid #ebeef5;
							border: 1px solid #FFFFFF;
							display: flex;
							align-items: center;
							color: #FFFFFF;
							font-size: 24rpx;
							padding: 10rpx 20rpx;
							border-radius: 30rpx;

							image {
								width: 24rpx;
								height: 24rpx;
								margin-left: 10rpx;
							}
						}
					}
				}


			}

			.company {
				width: 100%;
				color: #FFFFFF;
				line-height: 30rpx;
				font-size: 28rpx;
				text-align: center;

			}
		}

		.contentpart {
			margin-top: 20px;
		}

		.list-part {
			margin: 10px 0;
			padding: 30rpx;

			.list {
				width: 50%;
				margin: 0 auto 30rpx;
				font-size: 30rpx;
				color: #8a8a8a;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 2;

				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 20rpx;
				}

				.listxt {
					min-width: 130rpx;
				}

				.badge-msg {
					position: absolute;
					top: 0 !important;
					left: 170rpx;
					right: auto !important;

				}

			}
		}

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
			color: #FFFFFF;
			font-size: 34rpx;
			text-align: center;
			position: fixed;
			top: 0rpx;
			width: 100%;
			z-index: 99;
		}

		.contentModel {

			padding: 30rpx;

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
			background: #FFFFFF;
			border-top: 1px solid #EEEEEE;

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
				color: #FFFFFF;
				background: #4abdb4;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;
				border: 2rpx solid #4abdb4;
				border-radius: 80rpx;
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 30rpx;
		width: 100%;
		font-size: 28rpx;
		text-align: center;
		color: #999999;
		width: 100%;

	}

	.Model {


		.toptitle {
			height: 90rpx;
			line-height: 90rpx;
			background: #4abdb4;
			color: #FFFFFF;
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
	}

	.gray {
		color: #999999;
		margin-left: 10rpx;
		font-size: 28rpx;
	}
</style>

