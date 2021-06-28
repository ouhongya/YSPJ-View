<template>
	<view class="taskdetail">
		<a-head bgColor='#4abdb4' :text="taskhead" @headHeight='getHeight'></a-head>
		<u-sticky :offset-top="scollheight">
			<view class="table-top">
				<u-table bg-color="#f5f6f8">
					<u-tr>
						<u-td width="10%">序号</u-td>
						<u-td width="25%">状态</u-td>
						<u-td width="18%">子准则</u-td>
						<u-td width="30%">检查模块</u-td>
						<u-td width="17%">标准总分</u-td>
					</u-tr>
				</u-table>
			</view>
		</u-sticky>
		<view class="empty" v-if="list.length==0">
			<a-empty :changing="false"></a-empty>
		</view>
		<view class="table-part" v-else>
			<u-table v-for="(item,index) in list" :key="index">
				<u-tr>
					<u-td width="10%">
						<view @click="open(index)">{{index+1}}</view>
					</u-td>
					<u-td width="25%" class="statetop">
						<view @click="open(index)">
							<view class="state grey" v-if="item.status==0">
								未开始
							</view>
							<view class="state yellow" v-if="item.status==1">
								检查中
							</view>
							<view class="state green" v-if="item.status==2">
								已完成
							</view>
							<view class="detail" v-if="item.status!=0">
								<view class="title">
									进度:<text class="txt">
										{{item.rpercent}}%
									</text>
								</view>

								<view class="title" v-if="utype == 1 || utype == 3">
									扣分:<text class="red">
										{{item.losescroe}}
									</text>
								</view>
								<view class="title" v-if="utype == 1 || utype == 3">
									得分:<text class="txt">
										{{item.score}}
									</text>
								</view>
								<view class="title" v-if="utype == 1 || utype == 3">
									问题数:<text class="red">
										{{item.question}}
									</text>
								</view>
								<view class="title" v-if="utype == 1 || utype == 3">
									操作人:<text class="txt">
										{{item.dname}}
									</text>
								</view>
								<view class="title" v-if="utype == 2">
									整改人:<text class="txt">
										{{item.dname}}
									</text>
								</view>
							</view>
						</view>
					</u-td>
					<u-td width="18%">
						<view @click="open(index)">{{item.cname}}</view>
					</u-td>
					<u-td width="30%">
						<view @click="open(index)">{{item.item}}</view>
					</u-td>
					<u-td width="17%">
						<view @click="open(index)">{{item.total_score}}</view>
					</u-td>
				</u-tr>
				<view class="scorll-content" v-if="item.show&&item.detailnorm.length>0">
					<scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll">
						<view class="top">
							<view class="scorll-th">
								<view class="srorll-title">
									评判项目
								</view>
							</view>
							<view class="scorll-th detail" :class="utype==2?'rectify':''">
								<view class="srorll-title">
									评判内容
								</view>
							</view>
							<view class="scorll-th detail" :class="utype==2?'rectify':''" >
								<view class="srorll-title">
									检查方式
								</view>
							</view>
							<view class="scorll-th detail">
								<view class="srorll-title">
									评分项
								</view>
							</view>

							<view class="scorll-th">
								<view class="srorll-title">
									总分
								</view>
							</view>
							<view class="scorll-th" v-if="utype != 2">
								<view class="srorll-title">
									得分
								</view>
							</view>
							<view class="scorll-th">
								<view class="srorll-title">
									完成检查
								</view>
							</view>
						</view>
						<view v-for="(i,index1) in  item.detailnorm" :key="index1" class="tableheight" :class="i.isproblem==1?'colored':(i.isproblem==0&&i.score>i.rtotal_score)?'colorgreen':''">
							<view class="scorll-th">
								<view class="scorll-td">
									<view class="content">
										{{i.ritem}}
									</view>
								</view>
							</view>
							<view class="scorll-th detail" :class="utype==2?'rectify':''">
								<view class="scorll-td">
									<view class="content">
										{{i.rcontent}}
									</view>
								</view>
							</view>
							<view class="scorll-th detail" :class="utype==2?'rectify':''" >
								<view class="scorll-td">
									<view class="content">
										<view class="way-part">
											<view class="wayname" :class="i.rmode?'':'checkway'">
												{{i.rmode?i.rmode:'暂无'}}
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="scorll-th detail">
								<view class="scorll-td">
									<view class="content" @click="todetail(index,index1)">
										<view class="score-part" v-for="(j,index2) in i.rowdata" :key="index2">
											<view class="scorename" :class="(j.score_type==1&&j.score>0)?'red':(j.score_type==0&&j.score>0)?'green':'normal'">
												{{j.rcontent}}
											</view>
											<view class="score red" v-if="j.score_type==1&&j.score>0">
												-{{j.score}}
											</view>
											<view class="score green" v-if="j.score_type==0&&j.score>0">
												{{j.score}}
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="scorll-th">
								<view class="scorll-td">
									<view class="content">
										{{i.rtotal_score}}
									</view>
								</view>
							</view>
							<view class="scorll-th" v-if="utype != 2">
								<view class="scorll-td">
									<view class="content">
										<view class="gotscore">{{i.score}}</view>
									</view>
								</view>
							</view>
							<view class="scorll-th">
								<view class="scorll-td">
									<view class="content">
										<view class="checkicon" v-if="stautsFlag">
											<u-checkbox-group>
												<u-checkbox @change="checkboxChange(i,index,index1)" v-model="i.checked" shape="circle" :name="item.name"
												 size="60" icon-size='32' active-color="#19be6b"></u-checkbox>
											</u-checkbox-group>
										</view>
										<view class="checkicon" v-else>
											<text class="checking" v-if="i.checked">{{stautsText}}</text>
											<text class="checking" v-if="!i.checked">待检查</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-table>
		</view>

		<!-- 蒙层 -->
		<view class="masklock" v-show="lock"></view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
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
	export default {
		name: 'taskdetail',
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				taskhead: '',
				list: [],
				colorflag: 1, //1:扣分；2:加分；3:正常
				task_id: null,
				uid: null,
				loading: false,
				type: null,
				changing: true,
				stautsFlag: true,
				functionid: '',
				stautsText: '',
				stauts: '',
				lock: false,
				utype: '',
				option: {},
				ntaskdetail_id: '',
				nutask_id: '',
				scollheight: 0,
				lockdetail: false,
				ruserid:''
				
			}
		},
		onLoad(option) {
			this.option = option;
			let that = this;
			var data = JSON.parse(option.data.replace("\\", ""))
			this.utype = data.utype;
			this.ruserid = data.ruserid;
			this.ntaskdetail_id = data.taskdetail_id;
			this.nutask_id = data.utask_id;
			this.taskhead = data.rtask_name;
			this.stauts = data.ustatus;
			if (this.stauts == 7 || this.stauts == 8) {
				this.stautsFlag = false
			} else {
				this.stautsFlag = true
			}
			if (this.stauts == 7) {
				this.stautsText = "待审核..."
			};
			if (this.stauts == 8) {
				this.stautsText = "已完成"
			};
			let selectnormparent =
				'select u.tasknormid,u.task_id,u.taskdetail_id,u.norm_id,u.norm_detail_id,u.totlecheck,u.status,u.question,u.losescroe,u.score,u.hascheck,u.user_id,r.id,r.serial,r.item,r.untitled,r.content,r.total_score,r.mode,r.standard,r.totlecheck as rtotlecheck,r.type,r.parent_id,r.created_time,c.excel_id,c.name as cname,c.unit as cunit,c.content as ccontent,c.total_score as ctotal_score,c.score_time as cscore_time,c.totlecheck as ctotlecheck,c.created_time as ccreated_time,d.name as dname from tb_task_detail_norm u left join tb_norm_detail r on u.norm_detail_id=r.id left join  tb_norm c on u.norm_id = c.norm_id  left join sys_user d on u.user_id = d.user_id  where 1=1 and u.taskdetail_id = ' +
				"'" + data.taskdetail_id + "'";
			selectSQL('local', selectnormparent, res => {
				for (var i = 0; i < res.length; i++) {
					(function(i) {
						var num = res[i].hascheck / res[i].totlecheck;
						num = (num * 100).toFixed(2)
						res[i].rpercent = num;
						res[i].show = false;
						let sql1 =
							'select u.tasknormdetailid,u.tasknormid,u.norm_detail_id,u.score,u.isproblem,u.status,u.user_id,r.id,r.norm_id as rnorm_id,r.serial as rserial,r.item as ritem,r.untitled as runtitled,r.content as rcontent,r.total_score as rtotal_score,r.score as rscore,r.mode as rmode,r.standard as rstandard,r.totlecheck as rtotlecheck,r.type as rtype,r.parent_id as rparent_id,r.created_time as rcreated_time from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id where u.tasknormid = ' +
							"'" + res[i].tasknormid + "'";
						selectSQL('local', sql1, res1 => {
							res[i].detailnorm = res1;
							for (var j = 0; j < res[i].detailnorm.length; j++) {
								(function(j) {
									if (res[i].detailnorm[j].status == 1) {
										res[i].detailnorm[j].checked = true;
									} else if (res[i].detailnorm[j].status == 0) {
										res[i].detailnorm[j].checked = false;
									}
									let sql2 =
										'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,r.id,r.norm_detail_id,r.row_id,r.score as rscore,r.content as rcontent,r.created_time as rcreated_time from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
										"'" + res[i].detailnorm[j].tasknormdetailid + "'" + ' order by r.row_id asc';
									selectSQL('local', sql2, res2 => {
										res[i].detailnorm[j].rowdata = res2;
										if (i == res.length - 1 && j == res[i].detailnorm.length - 1) {
											that.list = res;
											that.list[0].show = true;
											
										}
									})
								})(j);
							}

						})
					})(i);
				}
			})
		},
		created() {
			this.loading = true;
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500)
		},
		onShow() {
			this.lock = false;
			this.lockdetail = false;
			if (uni.getStorageSync("backTaskDetail")) {
				this.getinformation();
			}
			uni.setStorageSync("flagtask", true);
		},
		methods: {
			getHeight(res) {
				const {
					windowWidth,
					windowHeight,
					brand,
					model
				} = uni.getSystemInfoSync();
				this.scollheight = (res + 3) * 2;
				if (windowWidth > 500 && windowHeight > 700 && windowWidth < 600) {
					this.scollheight = (res + 3) * 2 - 46;
				}
				let ratio = windowHeight / windowWidth;
				if (windowWidth > 600 && ratio < 1.7 && windowHeight > 600||brand=="HUAWEI"&&model=="BAH3-W59") {
					this.scollheight = res * 2;
				}
			},

			getinformation() {
				var option = this.option;
				let that = this;
				var data = JSON.parse(option.data.replace("\\", ""))
				this.utype = data.utype;
				this.taskhead = data.rtask_name;
				let selectnormparent =
					'select u.tasknormid,u.task_id,u.taskdetail_id,u.norm_id,u.norm_detail_id,u.totlecheck,u.status,u.question,u.losescroe,u.score,u.hascheck,u.user_id,r.id,r.serial,r.item,r.untitled,r.content,r.total_score,r.mode,r.standard,r.totlecheck as rtotlecheck,r.type,r.parent_id,r.created_time,c.excel_id,c.name as cname,c.unit as cunit,c.content as ccontent,c.total_score as ctotal_score,c.score_time as cscore_time,c.totlecheck as ctotlecheck,c.created_time as ccreated_time,d.name as dname from tb_task_detail_norm u left join tb_norm_detail r on u.norm_detail_id=r.id left join  tb_norm c on u.norm_id = c.norm_id  left join sys_user d on u.user_id = d.user_id  where 1=1 and u.taskdetail_id = ' +
					"'" + data.taskdetail_id + "'";

				selectSQL('local', selectnormparent, res => {
					for (var i = 0; i < res.length; i++) {
						(function(i) {
							var num = res[i].hascheck / res[i].totlecheck;
							num = (num * 100).toFixed(2)
							res[i].rpercent = num;
							if (res[i].tasknormid == uni.getStorageSync("backTaskDetail")) {
								res[i].show = true;
							} else {
								res[i].show = false;
							}
							let sql1 =
								'select u.tasknormdetailid,u.tasknormid,u.norm_detail_id,u.score,u.isproblem,u.status,u.user_id,r.id,r.norm_id as rnorm_id,r.serial as rserial,r.item as ritem,r.untitled as runtitled,r.content as rcontent,r.total_score as rtotal_score,r.score as rscore,r.mode as rmode,r.standard as rstandard,r.totlecheck as rtotlecheck,r.type as rtype,r.parent_id as rparent_id,r.created_time as rcreated_time from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id where u.tasknormid = ' +
								"'" + res[i].tasknormid + "'";
							selectSQL('local', sql1, res1 => {
								res[i].detailnorm = res1;
								for (var j = 0; j < res[i].detailnorm.length; j++) {
									(function(j) {
										if (res[i].detailnorm[j].status == 1) {
											res[i].detailnorm[j].checked = true;
										} else if (res[i].detailnorm[j].status == 0) {
											res[i].detailnorm[j].checked = false;
										}
										let sql2 =
											'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,r.id,r.norm_detail_id,r.row_id,r.score as rscore,r.content as rcontent,r.created_time as rcreated_time from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
											"'" + res[i].detailnorm[j].tasknormdetailid + "'" + ' order by r.row_id asc';
										selectSQL('local', sql2, res2 => {
											res[i].detailnorm[j].rowdata = res2;
											if (i == res.length - 1 && j == res[i].detailnorm.length - 1) {
												that.list = res;
												
												that.lock = false;
												uni.hideLoading()
												uni.removeStorageSync("backTaskDetail");
											}
										})
									})(j);
								}
							})
						})(i);
					}
				})

			},
			// 点击检查完成按钮
			checkboxChange(e, index, index1) {
				if (this.lock) return;
				this.lock = true;
				uni.showLoading({
					title: '请稍后...'
				})
				if (e.checked) {
					if (e.score == "0" && e.isproblem == "0") {
						executeSQL("local", "update tb_task_detail_norm_detail set score = " + "'" + e.rtotal_score + "'" +
							",isproblem = " +
							"'" +
							0 + "'" + ",status = " + "'" + 1 + "'" + ",direty='1',updatetime='" + new Date().getTime() +
							"' where tasknormdetailid = " + "'" + e.tasknormdetailid + "'", res => {})
					} else {
						executeSQL("local", "update tb_task_detail_norm_detail set status = " + "'" + 1 + "'" +
							",direty='1',updatetime='" + new Date().getTime() +
							"' where tasknormdetailid = " + "'" + e.tasknormdetailid + "'", res => {})
					}
					let selectnorm =
						'select tasknormid,task_id,taskdetail_id,norm_id,norm_detail_id,totlecheck,status,question,losescroe,score,hascheck,user_id from tb_task_detail_norm where tasknormid = ' +
						"'" + e.tasknormid + "'";
					selectSQL('local', selectnorm, res2 => {						
						res2[0].hascheck = Number(res2[0].hascheck) + 1;
						if (Number(res2[0].hascheck) == 0) {
							res2[0].status = 0
						} else if (Number(res2[0].hascheck) > 0 && Number(res2[0].hascheck) < Number(res2[0].totlecheck)) {
							res2[0].status = 1
						} else if (Number(res2[0].hascheck) == Number(res2[0].totlecheck)) {
							res2[0].status = 2
						}
						if (e.score == "0" && e.isproblem == "0") {
							
							// res2[0].score = Number(res2[0].score) + Number(e.rtotal_score);
							res2[0].score =  helper.accAdd(res2[0].score,e.rtotal_score)
							
							// res[0].score = helper.accSub(res[0].score,this.data.score);
							// res[0].score = helper.accAdd(res[0].score,totle)
							
						}
						executeSQL("local", "update tb_task_detail_norm set status = " + "'" + res2[0].status + "'" +
							      
							",score = " + "'" +
							res2[0].score + "'" + ",hascheck = " + "'" + res2[0].hascheck + "'" + ",direty='1',updatetime='" + new Date()
							.getTime() +
							"' where tasknormid = " + "'" + res2[0].tasknormid + "'", resex1 => {})
							

						let selecttaskdetail =
							'select taskdetail_id,task_id,totlequestion,totlecheck,hascheck,created_time,group_id,user_id,status,type,toperson from tb_task_detail where taskdetail_id = ' +
							"'" + this.ntaskdetail_id + "'";
						selectSQL('local', selecttaskdetail, restaskdetail => {
							
							restaskdetail[0].hascheck = Number(restaskdetail[0].hascheck) + 1
							executeSQL("local", "update tb_task_detail set hascheck = " + "'" + restaskdetail[0].hascheck +
								"'" +
								 ",direty='1',updatetime='" + new Date().getTime() +
								"' where taskdetail_id = " + "'" + restaskdetail[0].taskdetail_id + "'", resex2 => {})

							if (uni.getStorageSync("USER_ID") == this.ruserid) {
								let selecttask =
									'select task_id,task_name,totolequestion,hascheck from tb_task where task_id = ' +
									"'" + restaskdetail[0].task_id + "'";
								selectSQL('local', selecttask, restask1 => {
									restask1[0].hascheck = Number(restask1[0].hascheck) + 1

									executeSQL("local", "update tb_task set hascheck = " + "'" + restask1[0].hascheck +
										"'" +
										 ",direty='1',updatetime='" + new Date().getTime() +
										"' where task_id = " + "'" + restask1[0].task_id + "'", res9 => {
										})
								})
							}
							
							
							
							uni.setStorageSync("backTaskDetail", e.tasknormid);
							this.getinformation();

						})
					})
				} else {
					executeSQL("local", "update tb_task_detail_norm_detail set status = " + "'" + 0 + "'" + ",direty='1',updatetime='" + new Date().getTime() +
						"' where tasknormdetailid = " + "'" + e.tasknormdetailid + "'", res => {})
					let selectnorm =
						'select tasknormid,task_id,taskdetail_id,norm_id,norm_detail_id,totlecheck,status,question,losescroe,score,hascheck,user_id from tb_task_detail_norm where tasknormid = ' +
						"'" + e.tasknormid + "'";
					selectSQL('local', selectnorm, res2 => {
                        
						res2[0].hascheck = Number(res2[0].hascheck) - 1;
						if (Number(res2[0].hascheck) == 0) {
							res2[0].status = 0
						} else if (Number(res2[0].hascheck) > 0 && Number(res2[0].hascheck) < Number(res2[0].totlecheck)) {
							res2[0].status = 1
						} else if (Number(res2[0].hascheck) == Number(res2[0].totlecheck)) {
							res2[0].status = 2
						}
						console
						executeSQL("local", "update tb_task_detail_norm set status = " + "'" + res2[0].status + "'" 
						
                          + ",hascheck = " + "'" + res2[0].hascheck + "'" + ",direty='1',updatetime='" + new Date()
							.getTime() +
							"' where tasknormid = " + "'" + res2[0].tasknormid + "'", resex1 => {})

						let selecttaskdetail =
							'select taskdetail_id,task_id,totlequestion,totlecheck,hascheck,created_time,group_id,user_id,status,type,toperson from tb_task_detail where taskdetail_id = ' +
							"'" + this.ntaskdetail_id + "'";
						selectSQL('local', selecttaskdetail, restaskdetail => {

						
							restaskdetail[0].hascheck = Number(restaskdetail[0].hascheck) - 1
							executeSQL("local", "update tb_task_detail set hascheck = " + "'" + restaskdetail[0].hascheck +
								"'" +
								  ",direty='1',updatetime='" + new Date().getTime() +
								"' where taskdetail_id = " + "'" + restaskdetail[0].taskdetail_id + "'", resex2 => {})

							if (uni.getStorageSync("USER_ID") == this.ruserid) {
								let selecttask =
									'select task_id,task_name,totolequestion,hascheck from tb_task where task_id = ' +
									"'" + restaskdetail[0].task_id + "'";
								selectSQL('local', selecttask, restask1 => {

									
									restask1[0].hascheck = Number(restask1[0].hascheck) - 1

									executeSQL("local", "update tb_task set hascheck = " + "'" + restask1[0].hascheck +
										"'" +
										 ",direty='1',updatetime='" + new Date().getTime() +
										"' where task_id = " + "'" + restask1[0].task_id + "'", res9 => {
										})
								})
							}
							uni.setStorageSync("backTaskDetail", e.tasknormid);
							this.getinformation();

						})
					})
				}

			},
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			open(index) {
				this.list[index].show = !this.list[index].show;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			todetail(index, index1) {
				if (this.lockdetail) return;
				this.lockdetail = true;
				if (this.stautsFlag) {
					let obj = this.list[index].detailnorm[index1];
					obj.tasktype = this.utype;
					obj.ruserid = this.ruserid;
					uni.navigateTo({
						url: '/pages/task/score?obj=' + JSON.stringify(obj)
					})
					setTimeout(() => {
						this.lockdetail = false;
					}, 500)

				} else {
					this.$refs.uToast.show({
						title: '该任务暂时不能进行评分',
						type: 'warning'
					})
					this.lockdetail = false;
					return
				}

			},
		}
	}
</script>

<style lang="scss" scoped>
	.masklock {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 99;
		background: rgba(255, 255, 255, 0.01);
	}

	.scorll-content {
		background: #F8F8F8;



		.scroll-view_H {
			.top {
				display: inline-flex;
				width: 100%;
			}

			.tableheight {
				height: auto;
				background: #FFFFFF;
				position: relative;
				display: inline-flex;
				color: #606266;
				width: 100%;
				min-height: 200rpx;
			}

			.colored {
				color: #fa3534 !important;

				.wayname {
					color: #fa3534 !important;

					.name {
						color: #fa3534 !important;
					}
				}
			}

			.colorgreen {
				color: #19be6b;

				.wayname {
					color: #19be6b !important;

					.name {
						color: #19be6b !important;
					}
				}
			}

			.scorll-th {
				display: inline-block;
				min-width: 200rpx;
				width: 10%;

				.srorll-title {
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 28rpx;
					border: 1px solid #f6f6f6;
					background: #A0CFFF;
					color: #FFFFFF;
				}

				.scorll-td {
					border: 1px solid #f6f6f6;
					font-size: 28rpx;
					text-align: center;
					background: #FFFFFF;
					padding: 0 10rpx;
					height: 100%;
					height: calc(100% - 2px);
					overflow: hidden;

					/deep/.u-checkbox {
						display: block;
					}

					.content {
						line-height: 40rpx;
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.checking {
							color: #ff9900;
							font-size: 28rpx;
							text-align: center;
						}

						.way-part {
							// text-align: left;

							.wayname {
								color: #606266;
								line-height: 40rpx;

								.name {
									color: #606266;
								}
							}
							.checkway{
								color: #999999 ;
								
							}
						}

						.gotscore {
							font-size: 28rpx;
							font-weight: bold;
						}

						.score-part {
							display: flex;
							justify-content: space-between;
							font-size: 28rpx;
							margin-bottom: 10rpx;
							text-align: left;

							.scorename {
								width: 90%;
								// width: 100%;
								line-height: 40rpx;
							}

							.score {
								font-size: 28rpx;
								text-align: right;

							}

							.green {
								color: #19be6b;
							}

							.red {
								color: #fa3534;
							}

							.normal {
								color: #606266;
							}


						}

						.tips {
							margin-bottom: 10rpx;
							font-size: 24rpx;
							color: #FFFFFF;
							background: #ccebe9;
							height: 60rpx;
							line-height: 60rpx;
							border-radius: 0 0 10rpx 10rpx;
							text-align: center;
							padding: 0 10rpx;
						}
					}
				}
			}

			.detail {
				min-width: 300rpx;
				width: 20%;
			}
			
			
			.rectify{
				min-width: 300rpx;
				width: 25%;
			}
		}
	}

	.taskdetail {
		.table-top {
			.small {
				width: 10%;
			}

			.normal {
				width: 20%;
			}

			.large {
				width: 30%;
			}
		}

		.table-part {
			.small {
				width: 10%;
			}

			.normal {
				width: 20%;
			}

			.large {
				width: 30%;
			}

			.statetop {
				min-height: 120rpx;
			}

			.grey {
				color: #909399;

			}

			.yellow {
				color: #ff9900;
			}

			.green {
				color: #19be6b;
			}

			.detail {
				.title {
					color: #606266;
					font-size: 26rpx;
					text-align: left;
					padding: 4rpx 10rpx;

					.txt {
						color: #999999;
						margin-left: 10rpx;
					}

					.red {
						color: #fa3534;
						margin-left: 10rpx;
					}
				}


			}
		}
	}
</style>
