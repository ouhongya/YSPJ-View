<template>
	<view class="startPage">
		<view class="top">
			<view class="title">
				<view class="txt">
					<view>验</view>
					<view>收</view>
				</view>
				<view class="txt">
					<view>评</view>
					<view>价</view>
				</view>
			</view>
		</view>
		<view class="circle1"></view>
		<view class="circle2"></view>
		<view class="bottom">
			<view class="bottom-text">
				<image src="../../static/copyright.png" mode="" class="copyright"></image>
				<text>成都积盛电子科技有限公司</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	import helper from '@/common/helper.js';
	import {
		uploadImage
	} from '@/api/imageUpload.js';
	export default {
		data() {
			return {
				startFlag:false
			}
		},
		created() {
			this.startTable();
			this.startUpdate();
		},
		mounted() {
			this.tologin()				
		},
		methods: {
			tologin() {
				const {
					windowWidth,
					windowHeight,
					brand,
					model
				} = uni.getSystemInfoSync();
				let ratio = windowHeight / windowWidth;
				let deadtime = 0;
				if (windowWidth > 600 && ratio < 1.7||brand=="HUAWEI"&&model=="BAH3-W59") {
					//平板端30天过期
					deadtime = 60 * 60 * 24 * 30
				} else {
					//手机端15天过期
					deadtime = 60 * 60 * 24 * 15
				}
				if (uni.getStorageSync('hasLogin')) {
					let timeObj = uni.getStorageSync('timeObj');
					if (timeObj) {
						let Time = new Date().getTime()
						let curTime = JSON.stringify(Time)
						if ((curTime - timeObj) > deadtime) {
							uni.showToast({
								title: '登录已过期，请重新登录！',
								icon: 'none',
								duration: 1000
							})
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/login/login'
								})
							}, 1000)
						}
					} else {
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/index/index'
							})
						}, 1000)
					}
				} else {
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}, 1000)
				}
			},
			startTable(){
				let sysmenusql =
								`CREATE TABLE if not exists "sys_menu" (
							  "menu_id" text  NOT NULL,
							  "menu_name" text,
							  "menu_url" text,
							  "parent_id" text,
							  "menu_icon" text,
							  "direty" text,
							  "delete" text,
							  "updatetime" text,
							  PRIMARY KEY ("menu_id")
							)`
							executeSQL("local", sysmenusql, sysmenures => {
								
							})
				
							let sysmenutablesql =
								`CREATE TABLE if not exists "sys_menu_table" (
				                 "role_id" text,
				                 "menu_id" text,
				                 "status" text,
				                 "direty" text,
				                 "delete" text,
				                 "updatetime" text
				                  )`
							executeSQL("local", sysmenutablesql, sysmenutableres => {})
				
							let sysrolesql =
								`CREATE TABLE if not exists "sys_role" (
				  "role_id" text NOT NULL,
				  "role_name" text,
				  "parent_id" text,
				  "status" text,
				  "function_id" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				   PRIMARY KEY ("role_id")
				)`
				executeSQL("local", sysrolesql, sysroleres => {})
				
				
						let sysunitsql =
								`CREATE TABLE if not exists "sys_unit" (
				  "unit_id" text NOT NULL,
				  "unit_name" text,
				  "unit_user" text,
				  "unit_userphone" text,
				  "address" text,
				  "parent_id" text,
				  "status" text,
				  "company_id" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				    PRIMARY KEY ("unit_id")
				)`
				
				executeSQL("local", sysunitsql, sysunitres => {})
				
				
				
				
				let sysusersql =
								`CREATE TABLE if not exists "sys_user" (
				  "user_id" text NOT NULL,
				  "password" text,
				  "name" text,
				  "role_id" text,
				  "status" text,
				  "phone" text,
				  "company_id" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				  "isupdate" text,
				   PRIMARY KEY ("user_id")
				)`
				executeSQL("local", sysusersql, sysuserres => {})
				
				
				
				let tbexcelsql =
								`CREATE TABLE if not exists "tb_excel" (
				  "id" TEXT NOT NULL,
				  "url" TEXT,
				  "name" TEXT,
				  "user_id" TEXT,
				  "isCategory" TEXT,
				  "categort_id" text,
				  "status" TEXT,
				  "type" TEXT,
				  "view" TEXT,
				  "totlecheck" TEXT,
				  "size" text,
				  "created_time" TEXT,
				  "direty" TEXT,
				  "delete" TEXT,
				  "updatetime" TEXT,
				    PRIMARY KEY ("id")
				)`
				
				executeSQL("local", tbexcelsql, tbexcelres => {})
				
				
				
				
				let tbexcelcategorysql =
								`CREATE TABLE if not exists "tb_excel_category" (
				  "id" TEXT NOT NULL,
				  "name" TEXT,
				  "status" TEXT,
				  "user_id" TEXT,
				  "created_time" TEXT,
				  "direty" TEXT,
				  "delete" TEXT,
				  "updatetime" TEXT,
				   PRIMARY KEY ("id")
				)`
				
				executeSQL("local", tbexcelcategorysql, tbexcelcategoryres => {})
				
				
				let tbexcelusersql =
								`CREATE TABLE if not exists "tb_excel_user" (
				  "excel_id" text,
				  "user_id" text,
				  "status" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text
				)`
				
				executeSQL("local", tbexcelusersql, tbexceluserres => {})
				
				
				
				
				
				let tbgroupreportsql =
								`CREATE TABLE if not exists "tb_group_report" (
				  "id" text NOT NULL,
				  "task_id" text,
				  "taskdetail_id" text,
				  "againtaskid" text,
				  "remarkUn" text,
				  "unit_id" text,
				  "site_id" text,
				  "total_issue" text,
				  "group_id" text,
				  "view_id" text,
				  "user_id" text,
				  "type" text,
				  "status" text,
				  "solve" text,
				  "create_time" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				  "solveask" text,
				  "reconfire" text,
				   PRIMARY KEY ("id")
				)`
				executeSQL("local", tbgroupreportsql, tbgroupreportres => {})
				
				let tbmessagesql =
								`CREATE TABLE if not exists "tb_message" (
				  "id" text NOT NULL,
				  "title" text,
				  "content" text,
				  "type" text,
				  "status" text,
				  "user_id" text,
				  "created_time" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				  PRIMARY KEY ("id")
				)`
				
				executeSQL("local", tbmessagesql, tbmessageres => {})
				
				let tbmessageusersql =
								`CREATE TABLE if not exists "tb_message_user" (
				  "message_id" text,
				  "status" text,
				  "user_id" text,
				  "read_time" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text
				)`
				
				executeSQL("local", tbmessageusersql, tbmessageuserres => {})
				
				
				let tbnormsql =
								`CREATE TABLE if not exists "tb_norm" (
				  "norm_id" text NOT NULL,
				  "excel_id" text,
				  "name" text,
				  "unit" text,
				  "content" text,
				  "total_score" text,
				  "score_time" text,
				  "totlecheck" TEXT,
				  "created_time" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				    PRIMARY KEY ("norm_id")
				)`
				
				executeSQL("local", tbnormsql, tbnormres => {})
				
				
				
				let tbnormdetailsql =
								`CREATE TABLE if not exists "tb_norm_detail" (
				  "id" text  NOT NULL,
				  "norm_id" text,
				  "serial" text,
				  "item" text,
				  "untitled" text,
				  "content" text,
				  "total_score" text,
				  "score" text,
				  "mode" text,
				  "standard" text,
				  "totlecheck" text,
				  "type" text,
				  "parent_id" text,
				  "created_time" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				    PRIMARY KEY ("id")
				)`
				
				executeSQL("local", tbnormdetailsql, tbnormdetailres => {})
				
				let tbnormdetailrowsql =
								`CREATE TABLE if not exists "tb_norm_detail_row" (
				  "id" text NOT NULL,
				  "norm_detail_id" text,
				  "row_id" text,
				  "score" text,
				  "content" text,
				  "created_time" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				     PRIMARY KEY ("id")
				)`
				
				executeSQL("local", tbnormdetailrowsql, tbnormdetailrowres => {})
				
				let tbtasksql =
								`CREATE TABLE if not exists "tb_task" (
				  "task_id" text NOT NULL,
				  "task_name" text,
				  "unit_id" text,
				  "site_id" text,
				  "star_time" text,
				  "end_time" text,
				  "location" text,
				  "frequency" text,
				  "created_time" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				  "totlecheck" text,
				  "type" text,
				  "totolequestion" text,
				  "user_id" text,
				  "hascheck" text,
				  "status" text,
				    PRIMARY KEY ("task_id")
				)`
				
				executeSQL("local", tbtasksql,tbtaskres => {})
				
				
				let tbtaskdeletestatussql =
								`CREATE TABLE if not exists "tb_task_delete_status" (
				  "task_id" text  NOT NULL,
				  "status" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				  PRIMARY KEY ("task_id")
				)`
				
				executeSQL("local", tbtaskdeletestatussql,tbtaskdeletestatusres => {})
				
				
				let tbtaskdetailsql =
								`CREATE TABLE if not exists "tb_task_detail" (
				  "taskdetail_id" text NOT NULL,
				  "task_id" text,
				  "totlequestion" text,
				  "totlecheck" text,
				  "hascheck" text,
				  "created_time" text,
				  "group_id" text,
				  "user_id" text,
				  "status" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				  "type" text,
				  "toperson" text,
				   PRIMARY KEY ("taskdetail_id")
				)`
				
				executeSQL("local", tbtaskdetailsql,tbtaskdetailres => {})
				
				
				
				let tbtaskdetailcheckrowsql =
								`CREATE TABLE if not exists "tb_task_detail_checkrow" (
				  "tasknormdetailid" text,
				  "norm_row_id" text,
				  "score_type" text,
				  "score" text,
				  "status" text,
				  "problempicture" text,
				  "remark" text,
				  "correct" text,
				  "correctremark" text,
				  "correctpicture" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text
				)`
				executeSQL("local", tbtaskdetailcheckrowsql,tbtaskdetailcheckrowres => {})
				
				let tbtaskdetailnormsql =
								`CREATE TABLE if not exists "tb_task_detail_norm" (
				  "tasknormid" text  NOT NULL,
				  "task_id" text,
				  "taskdetail_id" text,
				  "norm_id" text,
				  "norm_detail_id" text,
				  "totlecheck" text,
				  "status" text,
				  "question" text,
				  "losescroe" text,
				  "score" text,
				  "hascheck" text,
				  "user_id" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				    PRIMARY KEY ("tasknormid")
				)`
				
				executeSQL("local", tbtaskdetailnormsql,tbtaskdetailnormres => {})
				
				let tbtaskdetailnormdetailsql =
								`CREATE TABLE if not exists "tb_task_detail_norm_detail" (
				  "tasknormdetailid" text NOT NULL,
				  "tasknormid" text,
				  "norm_detail_id" text,
				  "score" text,
				  "isproblem" text,
				  "status" text,
				  "user_id" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				   PRIMARY KEY ("tasknormdetailid")
				)`
				executeSQL("local", tbtaskdetailnormdetailsql,tbtaskdetailnormdetailres => {})
				
				
				let tbtaskinfosql =
								`CREATE TABLE if not exists "tb_task_info" (
				  "task_id" text  NOT NULL,
				  "usernormrel" text,
				  "normtext" text,
				  "collapseList" text,
				  "normdetailids" text,
				  "type" text,
				  "flag" text,
				  "direty" text,
				  "delete" text,
				  "updatetime" text,
				    PRIMARY KEY ("task_id")
				)`
				executeSQL("local", tbtaskinfosql,tbtaskinfores => {})
			},
			startUpdate(){
				let sqlselecttables =
					'select count(*) as number,updatetime from sys_menu where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_menu where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from sys_menu_table where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_menu_table where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime  from sys_role where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_role where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from sys_unit where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_unit where direty = 0 and `delete` = 0 ) union all select count(*) as number,updatetime from sys_user where updatetime = ( select MAX(cast(updatetime as INTEGER)) from sys_user where direty = 0 and `delete` = 0 )';
				selectSQL('local', sqlselecttables, resselecttables => {
					var ob = {
						updatetime: "0",
						updatetime1: "0",
						updatetime2: "0",
						updatetime3: "0",
						updatetime4: "0"
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
						}
					})
					
					helper.requestUrl(helper.websiteUrl + "v1/getinformation", ob, 'POST', (data) => {
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
					})
				})	
             this.startFlag=true;	
			}
		}
	}
</script>

<style lang="less" scoped>
	.startPage {
		background: linear-gradient(180deg, #00b2a4 0%, #8cdcd6 90%);
		height: 100vh;
		width: 100%;

		.circle1 {
			width: 400rpx;
			max-width: 200px;
			height: 400rpx;
			max-height: 200px;
			background: linear-gradient(180deg, #FFFFFF 0%, #8cdcd6 100%);
			border-radius: 50%;
			opacity: 1;
			position: absolute;
			top: 50px;
			left: -60rpx;
			box-shadow: 0 0 2px #fff;
		}

		.circle2 {
			width: 160rpx;
			max-width: 80px;
			height: 160rpx;
			max-height: 80px;
			background: linear-gradient(180deg, #FFFFFF 0%, #8cdcd6 100%);
			border-radius: 50%;
			opacity: 1;
			position: absolute;
			top: 230px;
			left: 50%;
			box-shadow: 0 0 2px #fff;
		}

		.top {
			padding-top: 100px;
			width: 100%;
			position: relative;
			z-index: 99;

			.title {
				width: 180rpx;
				max-width: 90px;
				height: 180rpx;
				max-height: 90px;
				font-size: 30px;
				font-weight: bold;
				padding: 10px;
				text-align: center;
				border-radius: 10px;
				color: #FFFFFF;
				border: 2px solid #FFFFFF;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				margin: 0 auto;
				box-shadow: 0 0 6px #fff;

				.txt {
					margin: 5px 0;
					display: flex;
					align-items: center;
					justify-content: space-around;
					text-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
				}
			}

		}


		.bottom {
			position: fixed;
			bottom: 20rpx;
			color: #FFFFFF;
			width: 100%;
			text-align: center;
			z-index: 99;

			.bottom-text {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 30px;
				line-height: 30px;

				text {
					font-size: 15px;
				}

				.copyright {
					width: 14px;
					height: 14px;
					margin-right: 2px;
				}
			}
		}
	}
</style>
