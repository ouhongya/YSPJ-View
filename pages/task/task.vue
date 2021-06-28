<template>
	<view class="task">
		<a-head bgColor='#4abdb4' :text="taskhead"></a-head>
		<view class="contain">
			<view class="content">
				<u-cell-group v-if="taskFlag">
					<u-cell-item title="任务名称" :title-style="titleStyle" arrow-direction="right" :value="taskname" @click="taskchange"
					 :required='true'></u-cell-item>
					<u-cell-item title="检查标准" :title-style="titleStyle" arrow-direction="right" :value="standard" @click="standardchange('new')"
					 :required='true'></u-cell-item>
				</u-cell-group>
				<u-cell-group v-else>
					<u-cell-item title="任务名称" :title-style="titleStyle" :value="taskname" :arrow="false" :required='true'></u-cell-item>
					<u-cell-item title="检查标准" :title-style="titleStyle" :value="standard" @click="standardchange('edit')" :required='true'></u-cell-item>
				</u-cell-group>
			</view>
			<view class="content">
				<view class="title">任务信息</view>
				<u-cell-group>
					<u-cell-item title="单位名称" :title-style="titleStyle" arrow-direction="right" :value="company" @click="companychange"
					 :required='true' v-if="taskFlag"></u-cell-item>
					<u-cell-item title="单位名称" :title-style="titleStyle" arrow-direction="right" :value="company" :arrow="false"
					 :required='true' v-else></u-cell-item>
					<!-- <view  v-if="taskFlag">
						 <u-cell-item title="子单位" :title-style="titleStyle" arrow-direction="right" :value="child" @click="childchange"
						  v-if="selectchild&&selectchild.length"></u-cell-item>
					</view>
					<view  v-else>
					 	<u-cell-item title="子单位" :title-style="titleStyle" arrow-direction="right" :value="child" :arrow="false"  ></u-cell-item>					 
					</view> -->
					<u-cell-item title="子单位" :title-style="titleStyle" arrow-direction="right" :value="child" @click="childchange"
					 v-if="selectchild&&selectchild.length&&taskFlag"></u-cell-item>
					<u-cell-item title="子单位" :title-style="titleStyle" arrow-direction="right" :value="child" :arrow="false" v-if="!taskFlag&&child!=''&&child!='暂无'"></u-cell-item>
					<u-cell-item title="任务期限" :title-style="titleStyle" arrow-direction="right" :value="date" @click="datechange"
					 :required='true'></u-cell-item>
				<!-- 	<view class="flag" v-if="flag" >
						<u-cell-item title="下发频次" :title-style="titleStyle" arrow-direction="right" :value="frequency" @click="frechange"></u-cell-item>
						<view class="right" @click="flagChange(2)">
							自定义频次
						</view>
					</view>
					<view class="flag" v-else >
						<u-cell-item title="自定义下发频次" :title-style="titleStyle" arrow-direction="right" :value="selfrequency" @click="selfrechange"></u-cell-item>
						<view class="right" @click="flagChange(1)">
							快捷选择频次
						</view>
					</view> -->
					<u-cell-item title="组长" :title-style="titleStyle" arrow-direction="right" :value="leader" @click="leadchange"
					 v-if="selectlead&&selectlead.length"></u-cell-item>
					 <view v-if="address">
					 	<u-cell-item title="检查地址" :title-style="titleStyle" arrow-direction="right" :value="address" @click="addresschange"
					 	 v-if="taskFlag"></u-cell-item>
					 	<u-cell-item title="检查地址" :title-style="titleStyle" arrow-direction="right" :value="address" :arrow="false" v-else></u-cell-item>
					 </view>
					 
					<view v-else>
						<u-cell-item title="检查地址" :title-style="titleStyle" arrow-direction="right" :value="address" @click="addresschange"
						 v-if="taskFlag"></u-cell-item>
					</view>
				</u-cell-group>
			</view>
			<!-- 修改任务名称 -->
			<u-modal v-model="showtask" title="任务名称" cancel-text="取消" confirm-text="确定" confirm-color="#1fac9c"
			 :show-cancel-button="true" @confirm="taskconfirm">
				<view class="slot-content">
					<view class="model">
						<u-input v-model="taskpart" placeholder="请输入你的任务名称" type="textarea" :autoHeight="true" @input="replaceInput()"/>
					</view>
				</view>
			</u-modal>
			<!-- 修改单位名称-->
			<u-select v-model="showcompany" mode="single-column" :default-value="showcompanyIndex" :list="selectcompany"
			 @confirm="companyconfirm" confirm-color="#1fac9c"></u-select>
			<!-- 修改子单位 -->
			<u-select v-model="showchild" mode="single-column" :default-value="selectchildIndex" :list="selectchild" @confirm="childconfirm"
			 confirm-color="#1fac9c" @cancel="cancelChild" cancel-text="清空"></u-select>
			<!-- 修改日期 新建-->
			<u-calendar v-model="showdate" mode="range" @change="dateconfirm" max-date="2030-01-01" :min-date="istoday" ref="calendar">
				<view slot="tooltip">
					<view class="emptytips" @click="emptytime">
						清空日期
					</view>
				</view>
			</u-calendar>
			<!-- 修改日期 编辑-->
			<u-calendar v-model="showdatedit" mode="range" @change="dateconfirm" max-date="2030-01-01" :min-date="eaitday" ref="calendar">
				<view slot="tooltip">
					<view class="emptytips" @click="emptytime">
						清空日期
					</view>
				</view>
			</u-calendar>
			
			<!-- 修改下发频次-->
			<u-select v-model="showfre" mode="single-column" :default-value="showfreIndex" :list="selectfre" @confirm="freconfirm"
			 confirm-color="#1fac9c" cancel-text="清空" @cancel="cancelfre"></u-select>
			<!-- 自定义频次 -->
			<u-modal v-model="showselfre" title="自定义下发频次" cancel-text="清空" confirm-text="确定" confirm-color="#1fac9c"
			 :show-cancel-button="true" @confirm="selfreconfirm" ref="freModal" @cancel="cancelselfre">
				<view class="slot-content">
					<view class="model">
						<view class="number">
							<text>每</text>
							<u-input v-model="selfrepart" placeholder="请输入正整数" type="number" :border="true" /><text>天一次</text>
						</view>
					</view>
				</view>
			</u-modal>
			<!-- 修改地点 -->
			<!-- <u-picker mode="region" v-model="showcity" :params="params1" confirm-color="#1fac9c" @confirm="cityconfirm"></u-picker>
			 -->
			<!-- 修改详细地址 -->
			<u-modal v-model="showaddress" title="检查地址" cancel-text="清空" confirm-text="确定" confirm-color="#1fac9c"
			 :show-cancel-button="true" @confirm="addressconfirm" @cancel="canceladdress">
				<view class="slot-content">
					<view class="model">
						<u-input v-model="addresspart" placeholder="请输入检查地址" type="textarea" :auto-height="true" />
					</view>
				</view>
			</u-modal>
			<!-- 修改组长 -->
			<u-select v-model="selectleadFlag" mode="single-column" :default-value="selectleadIndex" :list="selectlead" @confirm="leadconfirm"
			 confirm-color="#1fac9c" cancel-text="清空" @cancel="cancelead"></u-select>
		</view>
		<view class="action">
			<view class="bottom">
				<view class="cancel" @click="cancel">取消</view>
				<view class="save" @click="save">保存</view>
			</view>
		</view>
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'
	import timeFormat from '@/uview-ui/libs/function/timeFormat.js';
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	export default {
		name: 'attention',
		data() {
			return {
				taskhead: '新建任务',
				flag: true,
				id: '',
				taskname: '',
				standard: '',
				company: '',
				companyid: '',
				child: '',
				chilid: '',
				leaderid: '',
				date: '',
				frequency: '',
				selfrequency: '',
				selfrequencynum: '',
				city: '',
				tasktype: '',
				address: '',
				leader: '',
				showtask: false,
				showcompany: false,
				showfre: false,
				showselfre: false,
				showdate: false,
				showdatedit:false,
				istoday: '1950-01-01',
				eaitday:'1950-01-01',
				showcity: false,
				showaddress: false,
				showlead: false,
				showchild: false,
				selectleadFlag: false,
				taskpart: '',
				addresspart: '',
				selfrepart: '',
				titleStyle: {
					color: '#333333',
					fontSize: '30rpx',
				},
				normdetailids: '',
				selectcompany: [],
				selectchild: [],
				selectfre: [{
						value: '1',
						label: '每天一次'
					},
					{
						value: '7',
						label: '每周一次'
					},
					{
						value: '30',
						label: '每月一次'
					}
				],
				selectlead: [],
				// params1: {
				// 	year: true,
				// 	month: true,
				// 	day: true
				// },
				// params2: {
				// 	province: true,
				// 	city: true,
				// 	area: true
				// },
				selectchildIndex: [0],
				showstandardIndex: [0],
				showfreIndex: [0],
				selectleadIndex: [0],
				showcompanyIndex: [0],
				moduleList: null,
				moduleids: [],
				loading: false,
				taskFlag: true,
				functionid: uni.getStorageSync('functionid'),
				isFlag: true,
				lock: true,
				tassid: '0',
				saveoredit: '',
				standardlock:false,
				companylock:false,
				datelock:false
			}
		},
		created() {
			let _this = this;
			//获取当前日期
			let datetoday = new Date();
			this.istoday = datetoday.getFullYear() + '-' + (datetoday.getMonth() + 1) + '-' + datetoday.getDate();
			_this.uid = uni.getStorageSync("USER_ID")
			_this.functionid = uni.getStorageSync("functionid")
			this.loading = true;
			_this.queryUnitAll();
			_this.queryUserBySpecialty();
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500)
		},
		onLoad(options) {
			if (options.id) {
				uni.removeStorageSync("collapseList");
				uni.removeStorageSync("normtext");
				uni.removeStorageSync("usernormrel");
				uni.removeStorageSync("normdetailids");
				uni.removeStorageSync("type");
				this.tassid = options.id
				let that = this;
				let selecttask =
					'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
					"'" + options.id + "'";
				selectSQL('local', selecttask, res => {
					that.taskname = res[0].rtask_name;
					that.companyid = res[0].runit_id;
					that.querySiteAll(that.companyid)
					that.chilid = res[0].rsite_id;
					that.leaderid = res[0].ugroup_id;
					that.address = res[0].rlocation;
					that.date = timeFormat(res[0].rstar_time, 'yyyy-mm-dd') + '至' + timeFormat(res[0].rend_time, 'yyyy-mm-dd');					
					let used=Number(res[0].rstar_time)
					let now=new Date().getTime();
					if(now>used){
						that.eaitday=timeFormat(res[0].rstar_time, 'yyyy-mm-dd');
					}else{
						that.eaitday=that.istoday;
					}
					let selectunitname =
						'select unit_name from sys_unit where unit_id = ' +
						"'" + res[0].runit_id + "'";
					selectSQL('local', selectunitname, res2 => {
						that.company = res2[0].unit_name;
					})
					let selectchildname =
						'select unit_name from sys_unit where unit_id = ' +
						"'" + res[0].rsite_id + "'";
					selectSQL('local', selectchildname, res3 => {
						if(res3.length > 0){
							that.child = res3[0].unit_name;
						}else{
							that.child = "暂无";
						}
					})

					let selectusername =
						'select name from sys_user where user_id = ' +
						"'" + res[0].ugroup_id + "'";
					selectSQL('local', selectusername, res5 => {
						that.leader = res5[0].name;
					})

					let selecttaskinfo =
						'select task_id,usernormrel,normtext,collapseList,normdetailids,type,flag from tb_task_info where task_id = ' +
						"'" + res[0].utask_id + "'";
					selectSQL('local', selecttaskinfo, res1 => {
						that.standard = res1[0].normtext;
						if (res1[0].flag == 0) {
							that.flag = true;
							if (res[0].rfrequency == 1) {
								_this.frequency = '每天一次';
							} else if (res[0].rfrequency == 7) {
								that.frequency = '每周一次';
							} else if (res[0].rfrequency == 30) {
								that.frequency = '每月一次';
							}
						} else if (res1[0].flag == 1) {
							that.flag = false;
							that.selfrequency = '每' + res[0].rfrequency + '天一次';
							that.selfrequencynum = res[0].rfrequency;
							that.selfrepart = res[0].rfrequency;
						}

					})

				})
				this.saveoredit = "1";
				this.taskhead = '编辑任务';
				this.taskFlag = false
			} else {
				uni.removeStorageSync("collapseList");
				uni.removeStorageSync("normtext");
				uni.removeStorageSync("usernormrel");
				uni.removeStorageSync("normdetailids");
				uni.removeStorageSync("type");
				this.saveoredit = "0";
				this.taskhead = '新建任务';
				this.taskFlag = true
			}
		},
		onShow() {
			if (uni.getStorageSync("normtext")) {
				this.standard = uni.getStorageSync("normtext");
			}

			if (uni.getStorageSync("type")) {
				this.tasktype = uni.getStorageSync("type");
			}

			if (uni.getStorageSync("normdetailids")) {
				var normdetailids = uni.getStorageSync("normdetailids");
				let that = this;
				var totlechecked = 0;
				for (var i = 0; i < normdetailids.length; i++) {
					(function(i) {
						let sql1 = 'select COUNT(id) as totalResult from tb_norm_detail where parent_id = ' + "'" + normdetailids[i] +
							"'";
						selectSQL('local', sql1, res => {
							totlechecked = totlechecked + res[0].totalResult;
							if (i == normdetailids.length - 1) {
								that.normdetailids = totlechecked;
							}
						})
					})(i);
				}
			}
			this.lock = true;
			this.datelock=false;
			// //获取当前日期
			// let date = new Date();
			// this.istoday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		},
		methods: {
			replaceInput() {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.taskpart;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.taskpart = endvalue;
				},50)
			},
			taskchange() {
				this.showtask = true;
			},
			taskconfirm() {
				this.taskname = this.taskpart;
				this.showtask = false;
			},
			standardchange(type) {
				if(this.standardlock) return;
				this.standardlock=true;
				if (type == 'new') {
					uni.navigateTo({
						url: '/pages/task/standard?type=0'
					})
				}
				if (type == 'edit') {
					uni.navigateTo({
						url: '/pages/task/standard?type=' + this.tassid
					})
				}
				setTimeout(()=>{
					this.standardlock=false;
				},500)
			},
			companychange() {
				if(this.companylock) return;
				this.companylock=true;
				if(this.selectcompany.length>0){										
					this.showcompany = true;
					this.companylock=false;
				}else{
					this.$refs.uToast.show({
						title: '系统中暂无单位，无法创建任务',
						type: 'warning'
					})
					this.showcompany = false;
					this.companylock=false;
				}				
			},
			companyconfirm(e) {
				this.company = e[0].label;
				this.companyid = e[0].value;
				this.querySiteAll(e[0].value)
				this.showcompany = false;
				this.child = "";
				this.companylock=false;
			},
			childchange() {
				if (!this.company) {
					this.$refs.uToast.show({
						title: '请先选择单位名称',
						type: 'warning'
					})
					this.lock = true;
					return;
				}
				this.showchild = true;
			},
			childconfirm(e) {
				this.child = e[0].label;
				this.chilid = e[0].value;
				this.showchild = false;
			},
			cancelChild(e) {
				this.child = "";
				this.showchild = false;
			},
			datechange() {
				if(this.datelock) return;
				this.datelock=true;
				if(this.taskFlag){
					this.showdate = true;
				}else{
					this.showdatedit = true;
				}
				setTimeout(()=>{
					this.datelock=false;
				},500)
			},
			dateconfirm(e) {
				if (e.startDate == '0-00-00' || e.endDate == '0-00-00') {
					if(this.taskFlag){
						this.showdate = true;
					}else{
						this.showdatedit = true;
					}
					this.$refs.uToast.show({
						title: '请选择开始日期与结束日期',
						type: 'warning'
					})

				} else {
					this.date = e.startDate + '至' + e.endDate;
					if(this.taskFlag){
						this.showdate = false;
					}else{
						this.showdatedit = false;
					}

				}
			},
			emptytime() {
				this.date = '';
				this.$refs.calendar.init();
				if(this.taskFlag){
					this.showdate = false;
				}else{
					this.showdatedit = false;
				}
			},
			frechange() {
				this.showfre = true;
			},
			freconfirm(e) {
				this.frequency = e[0].label;
				this.showfre = false;
			},
			cancelfre(e) {
				this.frequency = '';
				this.showfre = false;
			},
			selfrechange() {
				this.showselfre = true;
			},
			selfreconfirm() {
				if (!/^\+?[1-9][0-9]*$/.test(this.selfrepart)) {
					this.$refs.uToast.show({
						title: '请输入非0开头的正整数',
						type: 'warning'
					})
					this.lock = true;
					this.showselfre = true;
					this.$refs.freModal.clearLoading();
				} else {
					this.selfrequency = '每' + this.selfrepart + '天一次';
					this.selfrequencynum = this.selfrepart;
					this.showselfre = false;
				}
			},
			cancelselfre() {
				this.selfrequency = '';
				this.selfrequencynum = '';
				this.showselfre = false;
			},
			flagChange(type) {
				if (type == 1) {
					this.flag = true
				}
				if (type == 2) {
					this.flag = false
				}
			},
			citychange() {
				this.showcity = true;
			},
			cityconfirm(e) {
				this.city = e.province.label + '-' + e.city.label + '-' + e.area.label;
				this.showcity = true;
			},
			addresschange() {
				this.showaddress = true;
			},
			addressconfirm() {
				this.address = this.addresspart;
				this.showaddress = false;
			},
			canceladdress() {
				this.addresspart = '';
				this.address = '';
				this.showaddress = false;
			},
			leadchange() {
				this.selectleadFlag = true;
			},
			leadconfirm(e) {
				this.leader = e[0].label
				this.leaderid = e[0].value;
				this.selectleadFlag = false;
			},
			cancelead() {
				this.leader = ""
				this.leaderid = "";
				this.selectleadFlag = false;
			},
			cancel() {
				this.lock = true;
				this.taskname = '',
					this.company = '',
					this.child = '',
					this.date = '',
					this.address = '',
					this.frequency = '',
					this.selfrequency = '',
					this.selfrequencynum = '',
					this.leader = '',
					this.id = '',
					this.selectchildIndex = [0],
					this.showstandardIndex = [0],
					this.showfreIndex = [0],
					this.selectleadIndex = [0],
					this.showcompanyIndex = [0],
					this.moduleList = null
				uni.navigateBack()
			},
			save() {
				if (this.lock) {
					this.lock = false
					if (!this.taskname) {
						this.$refs.uToast.show({
							title: '请输入任务名称',
							type: 'warning'
						})
						this.lock = true;
						return;
					}
					if (!this.company) {
						this.$refs.uToast.show({
							title: '请选择单位名称',
							type: 'warning'
						})
						this.lock = true;
						return;
					}
					if (!this.date) {
						this.$refs.uToast.show({
							title: '请选择任务期限',
							type: 'warning'
						})
						this.lock = true;
						return;
					}
					if (!this.standard) {
						this.$refs.uToast.show({
							title: '请选择检查标准',
							type: 'warning'
						})
						this.lock = true;
						return;
					}
				if (this.saveoredit == 0) {
					uni.showLoading({
						title: '任务创建中...'
					})
					let that = this;

					var fre = "0";
					if (this.flag) {
						var frequency = this.selectfre.find((v) => {
							return v.label == this.frequency
						});
						if (frequency) {
							fre = frequency.value;
						}
					} else {
						fre = this.selfrepart
					}
					var stedtime = this.date.split("至");
					var starttime = null;
					var endtime = null;
					if (stedtime.length == 2) {
						starttime = new Date(stedtime[0].replace("-", "/")).getTime();
						endtime = new Date(stedtime[1].replace("-", "/")).getTime();
					}
					var uuid = helper.uuid();
					var direty = "1";
					var deleted = "0";
					var status = "2";
					var totolequestion = "0";
					var hascheck = "0";
					var time = new Date().getTime();
					let inserttask = 'insert into tb_task values (' + "'" + uuid + "'" + "," + "'" + this.taskname +
						"'" + "," +
						"'" + this.companyid + "'" + "," + "'" + this.chilid + "'" + "," + "'" + starttime + "'" + "," + "'" + endtime +
						"'" + "," + "'" + this.address + "'" + "," + "'" + fre + "'" + "," + "'" + new Date().getTime() + "'" + "," + "'" +
						direty + "'" + "," + "'" + deleted + "'" + "," + "'" + new Date().getTime() + "'" + "," + "'" + this.normdetailids +
						"'" + "," + "'" + this.tasktype + "'" + "," + "'" + totolequestion + "'" + "," + "'" + uni.getStorageSync(
							'USER_ID') + "'" + "," + "'" + hascheck + "'" + "," + "'" + status + "'" +
						' ) ';
					executeSQL("local", inserttask, res => {
						var usernormrel = uni.getStorageSync("usernormrel");
						var insert2task = 0;
						usernormrel.forEach(item => {
							var uuid1 = helper.uuid();
							if (item.userid == uni.getStorageSync('USER_ID')) {
								insert2task = 1;
							}
							let leaderUser = item.userid==uni.getStorageSync('USER_ID')?that.leaderid:' '
							let inserttaskdetail = 'insert into tb_task_detail values (' + "'" + uuid1 + "'" + "," + "'" + uuid +
								"'" + "," +
								"'" + totolequestion + "'" + "," + "'" + item.checked + "'" + "," + "'" + "0" + "'" + "," + "'" +
								new Date().getTime() + "'" + "," + "'" +leaderUser + "'" + "," + "'" + item.userid + "'" + "," + "'" +
								"2" +
								"'" + "," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + "," +
								"'" + that.tasktype + "'" + "," + "'" + "0" + "'" + ' ) ';
							executeSQL("local", inserttaskdetail, restaskdetail => {
								item.norm.forEach(itemdetailnorm => {
									itemdetailnorm.norm_detailid.forEach(itemdetailid => {
										let sqlcount = 'select COUNT(id) as totalResult from tb_norm_detail where parent_id = ' + "'" +
											itemdetailid +
											"'";
										selectSQL('local', sqlcount, rescount => {
											var tasknormid = helper.uuid();
											let inserttaskdetailnorm = 'insert into tb_task_detail_norm values (' + "'" + tasknormid + "'" +
												"," + "'" + uuid +
												"'" + "," +
												"'" + uuid1 + "'" + "," + "'" + itemdetailnorm.norm_id + "'" + "," + "'" + itemdetailid + "'" +
												"," + "'" +
												rescount[0].totalResult + "'" + "," + "'" + "0" + "'" + "," + "'" + "0" + "'" + "," + "'" +
												"0" +
												"'" + "," + "'" + "0" + "'" + "," + "'" + "0" + "'" + "," + "'" + item.userid + "'" + "," +
												"'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + ' ) ';
											executeSQL("local", inserttaskdetailnorm, resdetailnorm => {
												let sqlnormdetailid = 'select id  from tb_norm_detail where parent_id = ' + "'" +
													itemdetailid +
													"'";
												selectSQL('local', sqlnormdetailid, res2 => {
													res2.forEach(res2normdetail => {
														var tasknormdetailid = helper.uuid();
														let tbtaskdetailnormdetail = 'insert into tb_task_detail_norm_detail values (' + "'" +
															tasknormdetailid + "'" +
															"," + "'" + tasknormid +
															"'" + "," +
															"'" + res2normdetail.id + "'" + "," + "'" + "0" + "'" + "," + "'" + "0" + "'" +
															"," + "'" +
															"0" + "'" + "," + "'" + item.userid + "'" + "," + "'" + "1" + "'" + "," + "'" +
															"0" + "'" + "," + "'" + new Date().getTime() + "'" + ' ) ';
														executeSQL("local", tbtaskdetailnormdetail, res3 => {
															let selectnormrow = 'select id  from tb_norm_detail_row where norm_detail_id = ' +
																"'" + res2normdetail.id + "'";
															selectSQL('local', selectnormrow, res5 => {

																res5.forEach(res5row => {
																	let tbtaskdetailcheckrow = 'insert into tb_task_detail_checkrow values (' +
																		"'" +
																		tasknormdetailid + "'" +
																		"," + "'" + res5row.id +
																		"'" + "," +
																		"'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + "0" + "'" +
																		"," + "'" +
																		"" + "'" + "," + "'" + "" + "'" + "," + "'" + "" + "'" + "," + "'" +
																		"" + "'" + "," + "'" + "" + "'" + "," + "'" + "1" + "'" + "," + "'" + "0" +
																		"'" + "," + "'" + new Date().getTime() + "'" + ' ) ';
																	executeSQL("local", tbtaskdetailcheckrow, res8 => {})
																})
															})
														})
													})
												})
											})
										})
									})
								})
							});
						});
						if (insert2task == 0) {
							let inserttaskdetail = 'insert into tb_task_detail values (' + "'" + helper.uuid() + "'" + "," + "'" + uuid +
								"'" + "," +
								"'" + totolequestion + "'" + "," + "'" + "0" + "'" + "," + "'" + "0" + "'" + "," + "'" +
								new Date().getTime() + "'" + "," + "'" + this.leaderid + "'" + "," + "'" + uni.getStorageSync('USER_ID') +
								"'" +
								"," + "'" +
								"2" +
								"'" + "," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + "," +
								"'" + this.tasktype + "'" + "," + "'" + "0" + "'" + ' ) ';
							executeSQL("local", inserttaskdetail, restaskdetail => {});

						}
					})
					var flagg = "0";
					if (this.flag) {
						flagg = "0"
					} else {
						flagg = "1"
					}

					let inserttbtaskinfo = 'insert into tb_task_info values (' + "'" + uuid + "'" + "," + "'" + JSON.stringify(uni.getStorageSync(
							'usernormrel')) +
						"'" + "," +
						"'" + uni.getStorageSync('normtext') + "'" + "," + "'" + JSON.stringify(uni.getStorageSync('collapseList')) + "'" +
						"," + "'" + uni.getStorageSync('normdetailids') + "'" + "," + "'" +
						uni.getStorageSync('type') + "'" + "," + "'" + flagg + "'" + "," + "'" + "1" + "'" + "," + "'" + "0" + "'" +
						"," + "'" +
						new Date().getTime() + "'" + ' ) ';
					executeSQL("local", inserttbtaskinfo, taskinfo => {});
					setTimeout(() => {
						uni.setStorageSync("flagtask", true)
						this.lock = true;
						uni.hideLoading();
						uni.navigateBack();
					}, 500)


				} else if (this.saveoredit == 1) {
					uni.showLoading({
						title: '任务编辑中...'
					})
					let that = this;
					var stedtime = this.date.split("至");
					var starttime = null;
					var endtime = null;
					if (stedtime.length == 2) {
						starttime = new Date(stedtime[0].replace("-", "/")).getTime();
						endtime = new Date(stedtime[1].replace("-", "/")).getTime();
					}
					var fre = "0";
					if (this.flag) {
						var frequency = this.selectfre.find((v) => {
							return v.label == this.frequency
						});
						if (frequency) {
							fre = frequency.value;
						}
					} else {
						fre = this.selfrepart
					}
					let selecttask =
						'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
						"'" + this.tassid + "'";
					selectSQL('local', selecttask, res => {

						let sql = 'update tb_task set site_id = ' + "'" + this.chilid + "'" + "," + ' direty = 1 ' + "," +
							' updatetime = ' +
							"'" + new Date().getTime() + "'" + "," + ' star_time = ' + "'" + starttime + "'" + "," + ' end_time = ' + "'" +
							endtime + "'" + "," + ' frequency = ' + "'" + fre + "'" + ' where task_id = ' + "'" + res[0].utask_id + "'";
						executeSQL("local", sql, res1 => {})

						let sql1 = 'update tb_task_detail set group_id = ' + "'" + this.leaderid + "'" + "," + ' direty = 1 ' + "," +
							' updatetime = ' +
							"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + res[0].utask_id + "'";
						executeSQL("local", sql1, res2 => {})

						var flagg = "0";
						if (that.flag) {
							flagg = "0"
						} else {
							flagg = "1"
						}

						let sql2 = 'update tb_task_info set flag = ' + "'" + flagg + "'" + "," + ' direty = 1 ' + "," +
							' updatetime = ' +
							"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + res[0].utask_id + "'";
						executeSQL("local", sql2, res3 => {})
						uni.setStorageSync("flagtask", true)
						this.lock = true;
						uni.hideLoading();
						uni.navigateBack();

					})
				}
				}
			},
			//获取用户选择的模块值
			async userModule() {
				await uni.getStorage({
					key: 'USER_MODULE',
					success: function(res) {
						return JSON.parse(res.data)
					}
				});
			},
			//拉去单位列表
			queryUnitAll() {
				let selectunit =
					'select unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id from sys_unit where parent_id = 0 and company_id = ' +
					"'" + uni.getStorageSync('company_id') + "'" + 'and status != 1';
				selectSQL('local', selectunit, res => {
					res.forEach(item => {
						this.selectcompany.push({
							value: item.unit_id,
							label: item.unit_name
						})
					})

				})
			},
			//拉去站点列表
			querySiteAll(id) {
				let selectunit =
					'select unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id from sys_unit where parent_id = ' +
					"'" + id + "'" + ' and company_id = ' +
					"'" + uni.getStorageSync('company_id') + "'" + 'and status != 1';
				selectSQL('local', selectunit, res => {
					this.selectchild = []
					res.forEach(item => {
						this.selectchild.push({
							value: item.unit_id,
							label: item.unit_name
						})
					})
				})
			},
			//拉去组长列表
			queryUserBySpecialty() {
				let selectuser =
					'select u.user_id,u.password,u.name,u.role_id,u.status,u.phone,u.company_id,r.role_name,r.function_id from sys_user u left join sys_role r on u.role_id=r.role_id where u.company_id = ' +
					"'" + uni.getStorageSync('company_id') + "'" + ' and u.status != 1 and r.function_id = 2 and u.user_id != ' + "'" +
					uni.getStorageSync('USER_ID') + "'";
				selectSQL('local', selectuser, res => {
					res.forEach(item => {
						this.selectlead.push({
							value: item.user_id,
							label: item.name
						})
					})
				})

			},

			//编辑任务回显数据
			queryTaskToOne(task_id) {

			},
			dateFtt(fmt, date) { //author: meizz
				var o = {
					"M+": date.getMonth() + 1, //月份   
					"d+": date.getDate(), //日   
					"h+": date.getHours(), //小时   
					"m+": date.getMinutes(), //分   
					"s+": date.getSeconds(), //秒   
					"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
					"S": date.getMilliseconds() //毫秒   
				};
				if (/(y+)/.test(fmt))
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				for (var k in o)
					if (new RegExp("(" + k + ")").test(fmt))
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				return fmt;
			}
		}
	};
</script>

<style lang="less" scoped>
	/deep/.u-cell__value {
		line-height: 48rpx;
	}

	.model {
		padding: 30rpx;

		.number {
			display: flex;
			align-items: center;
			margin: 0 auto;

			text {
				margin: 0 10rpx;
				color: #606266;
			}
		}
	}
	

	.contain {
		
	}
	.task{
		min-height: 100vh;
		background-color: #fafafa;
	}

	.head {
		display: flex;
		justify-content: space-between;
		height: 160rpx;
		line-height: 160rpx;
		padding: 0 30rpx;
		background: #ffffff;
		margin-bottom: 30rpx;

		.title {
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 160rpx;
			color: #333333;
			opacity: 1;
			// background: #ffffff;
		}

		.img {
			display: flex;
		}
	}

	image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin: 30rpx 10rpx;
	}

	.content {
		background: #ffffff;
		margin-bottom: 30rpx;

		.flag {
			.right {
				font-size: 24rpx;
				color: #999999;
				padding: 0 30rpx 0 36rpx;

			}
		}

		.title {
			height: 90rpx;
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 90rpx;
			color: #333333;
			opacity: 1;
			padding: 0 30rpx;

			text {
				height: 33rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				line-height: 33rpx;
				color: #999999;
				opacity: 1;
				margin-left: 30rpx;
			}
		}
	}

	.action {
		position: fixed;
		width: 100%;
		background: #FFFFFF;
		bottom: 0;
		z-index: 99;

		.bottom {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #FFFFFF;

			.cancel {
				width: 40%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				border: 2rpx solid #dedede;
				color: #606266;
			}

			.save {
				width: 40%;
				height: 80rpx;
				line-height: 80rpx;
				background: #4abdb4;
				border-radius: 40rpx;

			}
		}

	}
</style>
