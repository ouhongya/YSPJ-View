import {
	openComDB,
	closeComDB,
	executeSQL,
	selectSQL,
	transaction
} from '@/common/local.js'

//查询过滤条件
export function queryStatisticsFilter() {
	//标准
	//人员
	//单位
	return new Promise(resolve => {
		let uid = uni.getStorageSync("USER_ID")
		let functionId = uni.getStorageSync("functionid")
		let result = {
			excelList:[],
			userList:[],
			unitList:[]
		}
		//专责
		if (functionId == 1) {
			let excelSql ="select * from (SELECT id AS value, name AS title, 1 AS type FROM tb_excel_category WHERE id IN ( SELECT ifnull(category_id,0) FROM ( SELECT id, name,tb_excel.status,tb_excel_user.status as statusa, categort_id AS category_id FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel.user_id =  '" +uid + "' OR tb_excel_user.user_id = '" + uid +"' ) t WHERE category_id != ''  and statusa='0'  GROUP BY category_id ) UNION ALL SELECT id AS value, name AS title, 2 AS type FROM ( SELECT id, name, categort_id AS category_id ,tb_excel.status,tb_excel_user.status as statusa FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel.user_id = '" +uid + "' OR tb_excel_user.user_id = '" + uid +"' ) t WHERE category_id = '' and statusa='0' ) r group by  r.value  order by r.type asc "
			let catrgorySql = "SELECT id AS value, name AS title ,category_id FROM ( SELECT id, name, categort_id AS category_id ,tb_excel.status,tb_excel_user.status as statusa FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE  tb_excel.user_id = '" +uid + "' OR tb_excel_user.user_id = '" + uid +"' ) t WHERE category_id != ''  and statusa='0' group by value "
			selectSQL("local", excelSql, excelRes => {
				let excelList = excelRes
				selectSQL("local", catrgorySql, catrgoryRes => {
					if (excelList != null || catrgoryRes != null) {
						let arr = []
						excelList.forEach(item => {
							let obj = {
								value: item.value,
								title: item.title,
								type: item.type,
								child: []
							}
							catrgoryRes.forEach(key => {
								if (item.value == key.category_id) {
									obj.child.push(key.value)
								}
							})
							arr.push(obj)
						})
						arr.forEach(val=>{
							if(val.type==1){
								val.name=val.title,
								val.checked=true,
								val.id=val.value
							}else{
								val.name=val.title+"(未归类)",
								val.checked=true,
								val.id=val.value
							}
							
						})
						excelList = arr
						//Excel集合
						result.excelList = excelList
						//组装查询数据
						let excelIds = []
						excelList.forEach(item=>{
							if(item.type==2){
								excelIds.push(item.value)
							}else{
								item.child.forEach(entry=>{
									excelIds.push(entry)
								})
							}
						})
						let inSQL =  ""
						excelIds.forEach(item=>{
							inSQL+="'"+item+"',"
						})
						let unitByUserSql = "SELECT tb_task.unit_id, tb_task.unit_name, tb_task.user_id, tb_task.NAME FROM( SELECT tb_task.*, sys_unit.unit_name FROM ( SELECT tb_task.*, sys_user.NAME FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id) tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id WHERE tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND ( tb_task.STATUS >= 7 OR tb_task.STATUS <= 11 ) ) tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE tb_excel.id IN ( "+inSQL.substring(0,inSQL.length-1)+" ) ) GROUP BY tb_task.task_id UNION SELECT tb_task.unit_id, tb_task.unit_name, tb_task.user_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name FROM ( SELECT tb_task.*, sys_user.NAME FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id WHERE tb_task.STATUS IN ( 1, 100 ) ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE tb_excel.id IN ( "+inSQL.substring(0,inSQL.length-1)+" ) ) GROUP BY tb_task.task_id"
						selectSQL("local",unitByUserSql,ress=>{
							ress.forEach(item=>{
								result.userList.push({
									name:item.name,
									checked:true,
									id:item.user_id
								})
								result.unitList.push({
									name:item.unit_name,
									checked:true,
									id:item.unit_id
								})
							})
							resolve(result)
						})
					}else{
						resolve(null)
					}
				})
			})
		}
			//组员
		if (functionId == 2) {
			//查询任务	
			let taskSql = "SELECT tb_task.unit_id, tb_task.task_id, tb_task.unit_name, tb_task_detail.NAME, tb_task_detail.user_id, tb_task_detail.group_id FROM( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.NAME FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.STATUS != '1' AND tb_task.STATUS != '100' AND tb_task.STATUS != '200' AND tb_task_detail.STATUS != 1 UNION SELECT tb_task.unit_id, tb_task.task_id, tb_task.unit_name, tb_task_detail.NAME, tb_task_detail.user_id, tb_task_detail.group_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.NAME FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.user_id = '"+uid+"' AND tb_task.STATUS != '1' AND tb_task.STATUS != '100' AND tb_task.STATUS != '200' AND tb_task_detail.STATUS != 1 UNION SELECT tb_task.unit_id, tb_task.task_id, tb_task.unit_name, tb_task_detail.NAME, tb_task_detail.user_id, tb_task_detail.group_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.NAME FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task_detail.group_id = '"+uid+"' AND tb_task.STATUS != '1' AND tb_task.STATUS != '100' AND tb_task.STATUS != '200' AND tb_task_detail.STATUS != 1"
			selectSQL("local", taskSql, taskRes => {
				let taskIds = []
				taskRes.forEach(item=>{
					taskIds.push(item.task_id)
				})
				taskIds = Array.from(new Set(taskIds));
				let taskSQL = "" 
				taskIds.forEach(entry=>{
					taskSQL+="'"+entry+"',"
				})
				taskSQL=taskSQL.substring(0,taskSQL.length-1)
				//查询所有的组长列表
				selectSQL("local", "SELECT sys_user.`user_id` AS id, sys_user.`name` ,'组长' as job,'false' as checked FROM sys_user WHERE sys_user.`role_id` IN (SELECT sys_role.`role_id` FROM sys_role WHERE sys_role.`parent_id` = (SELECT sys_user.`company_id` FROM sys_user WHERE sys_user.`user_id` = '" +uid + "') AND sys_role.`function_id` = '2') and status = '0' group by user_id", userRes => {
					let ids = []
					userRes.forEach(item=>{
						ids.push(item.id)
					})
					taskRes.forEach(item=>{
						result.userList.push({
							name:item.name,
							checked:true,
							id:item.user_id
						})
						result.unitList.push({
							name:item.unit_name,
							checked:true,
							id:item.unit_id
						})
					})
					result.userList = Array.from(new Set(result.userList))
					result.unitList = Array.from(new Set(result.unitList))
					for(var i=result.userList.length-1;i>=0;i--){
							if(ids.indexOf(result.userList[i].id)!=-1){
								result.userList.splice(i,1)
							}
					}
					//查询标准
					let excelSQL = "SELECT * FROM ( SELECT tb_norm.name, tb_norm.norm_id AS id, 2 AS type, tb_excel.id AS eid, tb_excel.user_id FROM tb_excel INNER JOIN ( SELECT tb_norm.norm_id, tb_norm.name, tb_norm.excel_id FROM tb_norm WHERE tb_norm.norm_id IN ( SELECT tb_task_detail_norm.norm_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE tb_task.task_id IN ("+taskSQL+") GROUP BY tb_task_detail_norm.norm_id ) ) tb_norm ON id = excel_id WHERE 1 = 1 AND tb_excel.user_id ='"+uid+"' UNION SELECT tb_norm.name, tb_norm.norm_id AS id, 3 AS type, tb_excel.id AS eid, tb_excel.user_id FROM tb_excel INNER JOIN ( SELECT tb_norm.norm_id, tb_norm.name, tb_norm.excel_id FROM tb_norm WHERE tb_norm.norm_id IN ( SELECT tb_task_detail_norm.norm_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE tb_task.task_id IN ("+taskSQL+") GROUP BY tb_task_detail_norm.norm_id ) ) tb_norm ON id = excel_id WHERE 1 = 1 AND tb_excel.user_id !='"+uid+"' ) t GROUP BY t.id ORDER BY type DESC"	
					selectSQL("local", excelSQL, excelRes => {
							excelRes.forEach(item=>{
								item.checked=true
							})
							result.excelList = excelRes
							resolve(result)
					})
				})
			})		 
		}
	})
}

//查询统计数据
/**
 * @param {Object} alias 0:全部;1单位;2;标准;3工作量
 * @param {Object} unitList
 * @param {Object} userList
 * @param {Object} excelList
 * @param {Object} num 最低问题数量:默认没有值
 */
export function queryStatisticsData(alias,unitList,userList,excelList,num){
	let uid = uni.getStorageSync("USER_ID")
	let functionId = uni.getStorageSync("functionid")
	return new Promise(resolve=>{
		let resultData = {}
		if(functionId==1){
			if(num==""||num==0){
				num = "1=1"	
			}else{
				num="value>="+num
			}
			let excelIn = ""
			excelList.forEach(item=>{
				excelIn+="'"+item+"',"
			})	
			let userIn = ""
			userList.forEach(item=>{
				userIn+="'"+item+"',"
			})
			let unitIn = ""
			unitList.forEach(item=>{
				unitIn+="'"+item+"',"
			})
			excelIn = excelIn.substring(0,excelIn.length-1)
			userIn = userIn.substring(0,userIn.length-1)
			unitIn = unitIn.substring(0,unitIn.length-1)
			//总体完成情况
			selectSQL("local","SELECT * FROM( SELECT COUNT( task_id) AS num FROM ( SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 3 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) WHERE 1 = 1 GROUP BY tb_task.task_id UNION ALL SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.type != 3 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) WHERE 1 = 1 GROUP BY tb_task.task_id ) t UNION ALL SELECT COUNT( task_id ) AS num FROM ( SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS = 8 AND tb_task.type != 3 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) WHERE 1 = 1 GROUP BY tb_task.task_id UNION ALL SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.type != 3 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) WHERE 1 = 1 GROUP BY tb_task.task_id ) t ) c",res=>{
				let percentage = {}
				if(res[1].num!=0||res[0].num!=0){
					let total = res[0].num
					let hascheck = res[1].num
					let remain = total - hascheck
					percentage = {
						total:total,
						hascheck:hascheck,
						remain:remain,
					}
				}else{
					percentage = null
				}
				resultData.percentage =percentage
				//总体完成明细查询
				selectSQL("local","SELECT SUM( t.total_censor) AS total_censor, SUM( t.censor ) AS censor, SUM( t.total_issue ) AS total_issue, t.unitName, t.unit_id FROM( SELECT tb_task.totlecheck AS total_censor, ( CASE tb_task.STATUS WHEN '1' THEN '0' WHEN '2' THEN '0' WHEN '3' THEN '0' WHEN '4' THEN '0' WHEN '5' THEN '0' WHEN '6' THEN '0' ELSE tb_task.hascheck END ) AS censor, tb_task.STATUS, count(tb_task_detail_checkrow.tasknormdetailid) AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type = 1 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id UNION SELECT tb_task.totlecheck AS total_censor, tb_task.hascheck AS censor, tb_task.STATUS,  count(tb_task_detail_checkrow.tasknormdetailid)  AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.type = 1 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id ) t GROUP BY t.unit_id ",ress1=>{
					selectSQL("local","SELECT t.STATUS AS status, t.unit_id FROM( SELECT tb_task.totlecheck AS total_censor, tb_task.hascheck AS censor, tb_task.STATUS,  count(tb_task_detail_checkrow.tasknormdetailid)  AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type = 1 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id UNION ALL SELECT tb_task.totlecheck AS total_censor, tb_task.hascheck AS censor, 8 AS STATUS,  count(tb_task_detail_checkrow.tasknormdetailid)  AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.type = 1 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id ) t",ress2=>{
						if(ress1.length!=0){
							let entryNum = [0,2,3,4]
							ress1.forEach(item=>{
								let arr = []
								ress2.forEach(val=>{
									if(item.unit_id == val.unit_id){
										arr.push(val.status)
									}
								})
								let status = Math.min.apply(null,arr)
								if(entryNum.indexOf(status) != -1){
									item.status = 3
								}else{
									item.status = 4
								}
							})
							resultData.TaskOverDetail = ress1
						}else{
							resultData.TaskOverDetail =[]
						}
						//整改进度明细表
						selectSQL("local","SELECT SUM( t.total_censor) AS total_censor, SUM( t.censor ) AS censor, SUM( t.total_issue ) AS total_issue, t.unitName AS name, t.unit_id FROM( SELECT tb_task.totlecheck AS total_censor,( CASE tb_task.STATUS WHEN '1' THEN '0' WHEN '2' THEN '0' WHEN '3' THEN '0' WHEN '4' THEN '0' WHEN '5' THEN '0' WHEN '6' THEN '0' ELSE tb_task.hascheck END ) AS censor, tb_task.STATUS, count(tb_task_detail_checkrow.tasknormdetailid) AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type = 2 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id UNION ALL SELECT tb_task.totlecheck AS total_censor, tb_task.hascheck AS censor, tb_task.STATUS, count(tb_task_detail_checkrow.tasknormdetailid) AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.type = 2 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id ) t GROUP BY t.unit_id ",resss1=>{
							selectSQL("local","SELECT t.STATUS status, t.unit_id FROM( SELECT tb_task.totlecheck AS total_censor, tb_task.hascheck AS censor, tb_task.STATUS, count(tb_task_detail_checkrow.tasknormdetailid) AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type = 2 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id UNION ALL SELECT tb_task.totlecheck AS total_censor, tb_task.hascheck AS censor, tb_task.STATUS, count(tb_task_detail_checkrow.tasknormdetailid) AS total_issue, tb_task.unit_name AS unitName, tb_task.unit_id, tb_task.NAME FROM ( SELECT tb_task.*, sys_user.NAME FROM ( SELECT tb_task.*, sys_unit.unit_name, sys_unit.unit_id FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.type = 2 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.task_id ) t",resss2=>{
								if(resss1.length!=0){
									let entryNum = [0,2,3,4]
									resss1.forEach(item=>{
										let arr = []
										resss2.forEach(val=>{
											if(item.unit_id == val.unit_id){
												arr.push(val.status)
											}
										})
										let status = Math.min.apply(null,arr)
										if(entryNum.indexOf(status) != -1){
											item.status = 3
										}else{
											item.status = 4
										}
									})
									
									resultData.TaskOverDetail1 = resss1
								}else{
									resultData.TaskOverDetail1 =[]
								}
								//检查单位问题柱状图&饼状图
								selectSQL("local","SELECT sum( score) AS score, unit_id, NAME AS name, sum( VALUE ) AS value FROM( SELECT * FROM ( SELECT sum( tb_task_detail_checkrow.score ) AS score, count( tb_task.unit_id ) AS VALUE , tb_task.unit_name AS NAME, tb_task.unit_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS = 8 AND tb_task.unit_Id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" )) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.unit_id ORDER BY VALUE DESC ) t UNION SELECT * FROM ( SELECT sum( tb_task_detail_checkrow.score ) AS score, count( tb_task.unit_id ) AS VALUE , tb_task.unit_name AS NAME, tb_task.unit_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.unit_Id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" )) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task.unit_id ORDER BY VALUE DESC ) y ) tt GROUP BY unit_id ORDER BY VALUE DESC, score DESC",ressss=>{
									if(ressss.length!=0){
										let arr = []
										ressss.forEach(item=>{
											arr.push(item.name)
										})
										resultData.Unit = {
											"categories":arr,
											"series": [{
												"name": "问题总量",
												"data":ressss
											}]
										}
									}else{
										resultData.Unit = null
									}
									//检查模块统计图
									selectSQL("local","SELECT belong, item, parent_id, sum( VALUE) AS value FROM( SELECT * FROM ( SELECT tb_task_detail_norm.NAME AS belong, tb_task_detail_norm_detail.item, tb_task_detail_norm_detail.parent_id, count( tb_task_detail_norm_detail.parent_id ) AS VALUE FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN ( SELECT tb_task_detail_norm.*, tb_excel.NAME FROM tb_task_detail_norm LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id LEFT JOIN tb_excel ON tb_norm.excel_id = tb_excel.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.parent_id FROM tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.parent_id = tb_norm_detail.id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail_norm_detail.parent_id ORDER BY VALUE DESC ) t UNION ALL SELECT * FROM ( SELECT tb_task_detail_norm.NAME AS belong, tb_task_detail_norm_detail.item, tb_task_detail_norm_detail.parent_id, count( tb_task_detail_norm_detail.parent_id ) AS VALUE FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN ( SELECT tb_task_detail_norm.*, tb_excel.NAME FROM tb_task_detail_norm LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id LEFT JOIN tb_excel ON tb_norm.excel_id = tb_excel.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.parent_id FROM tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.parent_id = tb_norm_detail.id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail_norm_detail.parent_id ORDER BY VALUE DESC ) yy ) c GROUP BY parent_id ORDER BY VALUE DESC",resssss=>{
										if(resssss.length!=0){
											let lists = []
											resssss.forEach(value=>{
												lists.push(value.item)
											})
											resssss.forEach(value=>{
												delete value.parent_id //true
												delete value.item //true
											})
											resultData.Check={
												"categories": lists,
												"series": [
													{
														"name": "问题总量",
														"data":resssss
													}
												]
											}
										}else{
											resultData.Check=null
										}
										//相同问题数
										selectSQL("local","SELECT * FROM( SELECT belong, item, itemS1, SUM( VALUE) AS value , content, norm_row_id FROM ( SELECT * FROM ( SELECT * FROM ( SELECT tb_task_detail_norm.NAME AS belong, tb_task_detail_norm_detail.item, tb_task_detail_norm_detail.itemS1, count( tb_task_detail_checkrow.tasknormdetailid ) AS VALUE , tb_task_detail_checkrow.content, tb_task_detail_checkrow.norm_row_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN ( SELECT tb_task_detail_norm.*, tb_excel.NAME FROM tb_task_detail_norm LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id LEFT JOIN tb_excel ON tb_norm.excel_id = tb_excel.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.parent_id, tb_norm_detail.item AS itemS1 FROM tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.parent_id = tb_norm_detail.id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_task_detail_checkrow LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail_checkrow.norm_row_id ORDER BY VALUE DESC ) c ) t UNION ALL SELECT * FROM ( SELECT * FROM ( SELECT tb_task_detail_norm.NAME AS belong, tb_task_detail_norm_detail.item, tb_task_detail_norm_detail.itemS1, count( tb_task_detail_checkrow.tasknormdetailid ) AS VALUE , tb_task_detail_checkrow.content, tb_task_detail_checkrow.norm_row_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN (8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN ( SELECT tb_task_detail_norm.*, tb_excel.NAME FROM tb_task_detail_norm LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id LEFT JOIN tb_excel ON tb_norm.excel_id = tb_excel.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.parent_id, tb_norm_detail.item AS itemS1 FROM tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.parent_id = tb_norm_detail.id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_task_detail_checkrow LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail_checkrow.norm_row_id ORDER BY VALUE DESC ) c ) y ) r GROUP BY r.norm_row_id ORDER BY VALUE DESC ) f WHERE VALUE != 1 AND  "+num,ressssss=>{
											if(ressssss.length!=0){
												let litss = []
												ressssss.forEach(entry=>{
													litss.push(entry.itemS1)
												})
												ressssss.forEach(value=>{
													delete value.item 
													delete value.itemS1
												})
												resultData.Similar = {
													"categories": litss,
													"series":[
														{
															"name": "所属小类",
															"data": ressssss
														}
													]
												}
											}else{
												resultData.Similar =null 
											}
											//工作量表统计
											selectSQL("local","SELECT NAME AS name , user_id, sum( total_issue) AS total_issue, sum( checked ) AS checked, sum( solved_issue ) AS solved_issue FROM( SELECT * FROM ( SELECT t.NAME, t.user_id, t.totlequestion AS total_issue, y.num AS checked, IFNULL( u.hascheck, 0 ) AS solved_issue FROM ( SELECT tb_task.NAME, tb_task.user_id, sum( tb_task.totlequestion ) AS totlequestion FROM ( SELECT tb_task.NAME, tb_task.user_id, count(tb_task_detail_checkrow.tasknormdetailid) AS totlequestion FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task LEFT JOIN ( SELECT * FROM tb_task_detail WHERE tb_task_detail.user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE sys_user.user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) )LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0  WHERE 1 = 1 GROUP BY tb_task_detail.taskdetail_id ) tb_task GROUP BY tb_task.user_id ) t          LEFT JOIN ( SELECT tb_task.NAME, tb_task.user_id, tb_task.user_id, count( tb_task.task_id ) AS num FROM ( SELECT * FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type != 3 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task.task_id ) tb_task WHERE 1 = 1 GROUP BY tb_task.user_id ) y         ON t.user_id = y.user_id LEFT JOIN ( SELECT c.NAME, c.user_id, sum( c.totlequestion ) AS hascheck FROM ( SELECT * FROM ( SELECT tb_task.NAME, tb_task.user_id, count(tb_task_detail_norm_detail.tasknormdetailid) as totlequestion FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 2 AND tb_task_detail.type = 2 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail.taskdetail_id ) t ) c WHERE 1 = 1 GROUP BY c.user_id )   u ON y.user_id = u.user_id WHERE 1 = 1 GROUP BY t.user_id ORDER BY checked DESC, totlequestion DESC ) t               UNION ALL SELECT * FROM ( SELECT t.NAME, t.user_id, t.totlequestion AS total_issue, y.num AS checked, IFNULL( u.hascheck, 0 ) AS solved_issue FROM ( SELECT tb_task.NAME, tb_task.user_id, sum( tb_task.totlequestion ) AS totlequestion FROM ( SELECT tb_task.NAME, tb_task.user_id, tb_task_detail.totlequestion FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE tb_task_detail.user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE sys_user.user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail.taskdetail_id ) tb_task GROUP BY tb_task.user_id ) t LEFT JOIN ( SELECT tb_task.NAME, tb_task.user_id, tb_task.user_id, count( tb_task.task_id ) AS num FROM ( SELECT * FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type != 3 AND tb_task.STATUS IN ( 1, 2 ) AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task.task_id ) tb_task WHERE 1 = 1 GROUP BY tb_task.user_id ) y ON t.user_id = y.user_id LEFT JOIN ( SELECT c.NAME, c.user_id, sum( c.totlequestion ) AS hascheck FROM ( SELECT * FROM ( SELECT tb_task.NAME, tb_task.user_id, count(tb_task_detail_norm_detail.tasknormdetailid) as totlequestion FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 2 AND tb_task_detail.type = 2 AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0  WHERE 1 = 1 GROUP BY tb_task_detail.taskdetail_id ) t  union all  SELECT c.NAME, c.user_id, sum( c.totlequestion ) AS hascheck FROM ( SELECT * FROM ( SELECT tb_task.NAME, tb_task.user_id,  count(tb_task_detail_norm_detail.tasknormdetailid) as totlequestion FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 2 AND tb_task_detail.type = 2 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail.taskdetail_id ) t ) c WHERE 1 = 1 GROUP BY c.user_id ) c   WHERE 1 = 1 GROUP BY c.user_id ) u ON y.user_id = u.user_id WHERE 1 = 1 GROUP BY t.user_id ORDER BY checked DESC, totlequestion DESC ) y ) f GROUP BY user_id",resssssss=>{
												//整改首次通过率计算
												selectSQL("local","SELECT * FROM( SELECT tb_task.user_id, tb_task.task_id FROM ( SELECT tb_task.*, sys_user.NAME as name, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 2 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) WHERE 1 = 1 GROUP BY tb_task.task_id ) t UNION ALL SELECT * FROM ( SELECT tb_task.user_id, tb_task.task_id FROM ( SELECT tb_task.*, sys_user.NAME, sys_user.user_id FROM tb_task LEFT JOIN sys_user ON tb_task.user_id = sys_user.user_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS IN(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 2 AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) WHERE 1 = 1 GROUP BY tb_task.task_id )y",resssssss1=>{
													if(resssssss.length!=0){
														let userIds = []
														resssssss.forEach(item=>{
															userIds.push(item.user_id)
														})
														//用户id集合
														let arr = []
														userIds.forEach(entry=>{
															let ids = []
															resssssss1.forEach(item=>{
																if(entry == item.user_id){
																	ids.push(item.task_id)
																}
															})
															arr.push({
																user:entry,
																taskId:ids
															})
														})
														//去算百分比
														queryUserToTask(arr,data=>{
																resssssss.forEach(item=>{
																	data.forEach(val=>{
																		if(item.user_id == val.user_id){
																			item.result = val.result
																		}
																	})
																})
																resultData.workload = resssssss
																resolve(resultData)
														})
													}else{
														resultData.workload =[]
														resolve(resultData)
													}
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
		
		if(functionId ==2){
			if(num==""||num==1){
				num = "1=1"
			}else{
				num = "value >= "+num
			}
			let excelIn = ""
			excelList.forEach(item=>{
				excelIn+="'"+item+"',"
			})	
			let userIn = ""
			userList.forEach(item=>{
				userIn+="'"+item+"',"
			})
			let unitIn = ""
			unitList.forEach(item=>{
				unitIn+="'"+item+"',"
			})
			excelIn = excelIn.substring(0,excelIn.length-1)
			userIn = userIn.substring(0,userIn.length-1)
			unitIn = unitIn.substring(0,unitIn.length-1)
			//总体完成情况
			/**
			 * SELECT hascheck,total FROM( SELECT SUM( t.hascheck) AS hascheck, SUM( t.totlecheck ) AS total FROM ( SELECT tb_task_detail.hascheck, tb_task.totlecheck FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) and tb_task.unit_id in("+unitIn+") and tb_task.status != 1 and tb_task.status != 100 and tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id in ("+excelIn+") INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid where 1=1 group by tb_task_detail.taskdetail_id ) t UNION SELECT IFNULL(SUM( t.hascheck ),0) AS hascheck, 0 AS total FROM ( SELECT tb_task_detail.hascheck, tb_task_detail.totlecheck FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task_detail.user_id = '0caed136-3b22-405c-ab89-fe8819e09acc' AND tb_task_detail.status = 8 and tb_task.unit_id in("+unitIn+") and tb_task.status != 1 and tb_task.status != 100 and tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id in ("+excelIn+") INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid where 1=1 group by tb_task_detail.taskdetail_id ) t ) t 
					let hascheck = res[1].hascheck - res[0].hascheck 
					let total = res[1].total 
					let remain = total - hascheck
			 */
			selectSQL("local","SELECT IFNULL( hascheck, 0) hascheck, IFNULL( total, 0 ) total FROM( SELECT IFNULL( COUNT( ww.task_id ), 0 ) AS hascheck, 1 AS num FROM ( SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS >= 4 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.STATUS != 5 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id UNION SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.user_id = '"+uid+"' AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS >= 4 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.STATUS != 5 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id UNION SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS >= 4 AND tb_task.STATUS != 100 AND tb_task.STATUS != 5 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id ) ww ) e,( SELECT IFNULL( COUNT( ww.task_id ), 0 ) AS total, 1 AS num FROM ( SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id UNION SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.user_id = '"+uid+"' AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id UNION SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task_detail.group_id = '"+uid+"' AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id ) ww ) w WHERE e.num = w.num",res=>{
				/**
				 * 
				 * "SELECT hascheck,total FROM( SELECT ifnull(SUM( t.hascheck),0) AS hascheck,ifnull( SUM( t.totlecheck ),0) AS total FROM ( SELECT tb_task_detail.hascheck, tb_task.totlecheck FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) and tb_task.unit_id in("+unitIn+") and tb_task.status != 1 and tb_task.status != 100  INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id in ("+excelIn+") INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid where 1=1 group by tb_task_detail.taskdetail_id ) t ) t"
				 */
				let total = res[0].total 
				let percentage ={}
				if(total !=0){
					let hascheck =  res[0].hascheck 
					let remain = total - hascheck
					percentage = {
						total:total,
						hascheck:hascheck,
						remain:remain,
					}
				}else{
					percentage = null
				}
				resultData.percentage =percentage
				//总体完成明细表
				selectSQL("local"," SELECT * FROM( SELECT tb_task.task_name AS name, tb_task.task_id, tb_task.created_time, tb_task.totlecheck AS total_censor, tb_task_detail.hascheck AS censor, tb_task.STATUS as status, tb_task_detail.totlequestion AS total_issue FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task_detail.user_id = '"+uid+"' AND tb_task.unit_id IN ( "+unitIn+") AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) GROUP BY tb_task.task_id UNION SELECT tb_task.task_name AS NAME, tb_task.task_id, tb_task.created_time, tb_task.totlecheck AS total_censor, tb_task_detail.hascheck AS censor, tb_task.STATUS, tb_task_detail.totlequestion AS total_issue FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task_detail.group_id = '"+uid+"' AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) GROUP BY tb_task.task_id UNION SELECT tb_task.task_name AS NAME, tb_task.task_id, tb_task.created_time, tb_task.totlecheck AS total_censor, tb_task_detail.hascheck AS censor, tb_task.STATUS, tb_task_detail.totlequestion AS total_issue FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task_detail.group_id = '"+uid+"' AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) GROUP BY tb_task.task_id ) tb_task WHERE 1 = 1 GROUP BY tb_task.task_id ORDER BY tb_task.created_time DESC",ress=>{
					if(ress.length!=0){
						resultData.TaskOverDetail = ress
					}else{
						resultData.TaskOverDetail =[]
					}
					//单位问题数
					selectSQL("local","SELECT * FROM( SELECT tb_task.task_name AS name, tb_task_detail.totlequestion AS value , SUM( tb_task_detail_norm.losescroe) AS score FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ( "+unitIn+" ) AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) WHERE tb_task_detail_norm.losescroe > 0 GROUP BY tb_task.task_id ) ORDER BY VALUE ASC",resss=>{
						let units = resss
						if(units.length!=0){
							resss.sort((a,b)=>{ return b.value - a.value})
							let unitName = []
							let num = 0 
							units.forEach(item=>{
								item.score = parseFloat(item.score)
								item.value =parseInt( item.value)
								num+=item.value
								item.data = item.value
								unitName.push(item.name)
							})
							units.forEach(item=>{
								item.percentage = GetPercent(item.value,num)
							})
							resultData.Unit = {
								"categories": unitName,
								"series": [{
									"name": "问题总量",
									"data": units
								}],
							}
						}else{
							resultData.Unit = null
						}
						//检查模块问题数
						selectSQL("local","SELECT t.item, t.num AS value , tb_norm.NAME AS belong FROM tb_norm INNER JOIN( SELECT tb_norm_detail.id, tb_norm_detail.item, SUM( t.num) AS num, tb_norm_detail.norm_id FROM tb_norm_detail INNER JOIN ( SELECT tb_norm_detail.item, t.num, tb_norm_detail.parent_id FROM tb_norm_detail INNER JOIN ( SELECT COUNT( tb_task_detail_norm_detail.norm_detail_id ) AS num, tb_task_detail_norm_detail.norm_detail_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task_detail_norm_detail.norm_detail_id ) t ON tb_norm_detail.id = t.norm_detail_id ) t ON tb_norm_detail.id = t.parent_id WHERE 1 = 1 GROUP BY tb_norm_detail.id ) t ON tb_norm.norm_id = t.norm_id WHERE 1 = 1 ORDER BY num DESC",resssss=>{
							if(resssss.length!=0){
								let lists = []
								resssss.forEach(value=>{
									lists.push(value.item)
									delete value.item
								})
								resultData.Check={
									"categories": lists,
									"series": [
										{
											"name": "问题总量",
											"data":resssss
										}
									]
								}
							}else{
								resultData.Check = null
							}
							//相同问题数
							selectSQL("local","SELECT t.num AS value , t.content, tb_norm.NAME AS belong, tb_norm_detail.item FROM tb_norm INNER JOIN tb_norm_detail ON tb_norm.norm_id = tb_norm_detail.norm_id INNER JOIN( SELECT tb_norm_detail_row.content, tb_norm_detail_row.norm_detail_id, t.num FROM tb_norm_detail_row INNER JOIN ( SELECT COUNT( tb_task_detail_norm_detail.norm_detail_id) AS num, tb_task_detail_checkrow.norm_row_id FROM tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 GROUP BY tb_task_detail_checkrow.norm_row_id ) t ON tb_norm_detail_row.id = t.norm_row_id AND num > 1 ) t ON tb_norm_detail.id = t.norm_detail_id AND "+num+" ORDER BY VALUE DESC",ressssss=>{
								if(ressssss.length!=0){
									let litss = []
									ressssss.forEach(entry=>{
										litss.push(entry.item)
									})
									resultData.Similar = {
										"categories": litss,
										"series":[
											{
												"name": "所属小类",
												"data": ressssss
											}
										]
									}
								}else{
									resultData.Similar =null
								}
								//整改进度
								selectSQL("local","SELECT * FROM( SELECT tb_task.task_name AS name, tb_task.task_id, tb_task.created_time, tb_task.totlecheck AS total_censor, tb_task_detail.hascheck AS censor, tb_task.STATUS as status, tb_task.totolequestion AS total_issue FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"') AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type = 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) GROUP BY tb_task.task_id UNION SELECT tb_task.task_name AS NAME, tb_task.task_id, tb_task.created_time, tb_task.totlecheck AS total_censor, tb_task_detail.hascheck AS censor, tb_task.STATUS, totolequestion AS total_issue FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.user_id = '"+uid+"' AND tb_task.unit_id IN ( "+unitIn+" ) AND tb_task.STATUS != 1 AND tb_task.STATUS != 200 AND tb_task.type = 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( "+excelIn+" ) GROUP BY tb_task.task_id ) tb_task WHERE 1 = 1 GROUP BY tb_task.task_id ORDER BY tb_task.created_time DESC",resssssss=>{
									if(resssssss.length!=0){
										resssssss.forEach(item=>{
											if(item.status==2){
												item.censor=0
												item.total_issue=item.total_censor
											}
										})
										resultData.TaskOverDetail1 = resssssss
									}else{
										resultData.TaskOverDetail1 = []
									}
									resolve(resultData)
								})
							})
						})
					})
				})
			})
		}
		
		if(functionId ==3){
			if(num==""||num==1||num ==undefined){
					num = "1=1"
				}else{
					num = "value >= "+num
				}
				//总体完成情况
				selectSQL("local","SELECT IFNULL( hascheck, 0) hascheck, IFNULL( total, 0 ) total FROM( SELECT IFNULL( COUNT( ww.task_id ), 0 ) AS hascheck, 1 AS num FROM ( SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task_detail.user_id = '"+uid+"' AND tb_task.STATUS != 1 AND tb_task_detail.STATUS >= 4 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.STATUS != 5 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id ) ww ) e,( SELECT IFNULL( COUNT( ww.task_id ), 0 ) AS total, 1 AS num FROM ( SELECT tb_task.task_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task_detail.user_id = '"+uid+"' AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id INNER JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid WHERE 1 = 1 GROUP BY tb_task.task_id ) ww ) w WHERE e.num = w.num",res=>{
					
					let total = res[0].total 
					let percentage ={}
					if(total !=0){
						let hascheck =  res[0].hascheck 
						let remain = total - hascheck
						percentage = {
							total:total,
							hascheck:hascheck,
							remain:remain,
						}
					}else{
						percentage = null
					}
					resultData.percentage =percentage
					//总体完成明细表
					selectSQL("local","SELECT tb_task.task_name AS name, tb_task_detail.totlecheck AS total_censor, tb_task_detail.hascheck AS censor, tb_task_detail.STATUS as status, tb_task_detail.totlequestion AS total_issue FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND( tb_task_detail.user_id = '"+uid+"') AND tb_task.STATUS != 1 AND tb_task.STATUS != 100 AND tb_task.STATUS != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE 1 = 1 GROUP BY tb_task.task_id ORDER BY tb_task.created_time DESC",ress=>{
						if(ress.length!=0){
							resultData.TaskOverDetail = ress
						}else{
							resultData.TaskOverDetail =[]
						}
						//单位问题数
						selectSQL("local"," select * from (SELECT tb_task.task_name as name, tb_task_detail.totlequestion as value, sum(tb_task_detail_norm.losescroe) as score FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id ='"+uid+"') AND  tb_task.status != 1 AND tb_task.status != 100 AND tb_task.status != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id where tb_task_detail_norm.losescroe>0 group by tb_task.task_id) order by value asc",resss=>{
							let units = resss
							if(units.length!=0){
								resss.sort((a,b)=>{ return b.value - a.value})
								let unitName = []
								let num = 0 
								units.forEach(item=>{
									item.score = parseFloat(item.score)
									item.value =parseInt( item.value)
									num+=item.value
									item.data = item.value
									unitName.push(item.name)
								})
								units.forEach(item=>{
									item.percentage = GetPercent(item.value,num)
								})
								resultData.Unit = {
									"categories": unitName,
									"series": [{
										"name": "问题总量",
										"data": units
									}],
								}
							}else{
								resultData.Unit = null
							}
							//检查模块问题数
							selectSQL("local","SELECT t.item,t.num as value,tb_norm.name as belong from tb_norm INNER join(SELECT tb_norm_detail.id, tb_norm_detail.item, SUM(t.num) as num, tb_norm_detail.norm_id FROM tb_norm_detail INNER JOIN ( SELECT tb_norm_detail.item, t.num, tb_norm_detail.parent_id FROM tb_norm_detail INNER JOIN ( SELECT COUNT( tb_task_detail_norm_detail.norm_detail_id) AS num, tb_task_detail_norm_detail.norm_detail_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id ='"+uid+"' )  AND tb_task.status != 1  AND tb_task.status != 200 AND tb_task.status != 100 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id  LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0  GROUP BY tb_task_detail_norm_detail.norm_detail_id ) t ON tb_norm_detail.id = t.norm_detail_id ) t ON tb_norm_detail.id = t.parent_id where 1=1 group by tb_norm_detail.id)t on tb_norm.norm_id = t.norm_id where 1=1 order by num desc",resssss=>{
								if(resssss.length!=0){
									let lists = []
									resssss.forEach(value=>{
										lists.push(value.item)
										delete value.item
									})
									resultData.Check={
										"categories": lists,
										"series": [
											{
												"name": "问题总量",
												"data":resssss
											}
										]
									}
								}else{
									resultData.Check = null
								}
								//相同问题数
								selectSQL("local","SELECT t.num as value, t.content, tb_norm.name as belong, tb_norm_detail.item FROM tb_norm INNER JOIN tb_norm_detail ON tb_norm.norm_id = tb_norm_detail.norm_id INNER JOIN( SELECT tb_norm_detail_row.content, tb_norm_detail_row.norm_detail_id, t.num FROM tb_norm_detail_row INNER JOIN ( SELECT COUNT( tb_task_detail_norm_detail.norm_detail_id) AS num, tb_task_detail_checkrow.norm_row_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND  tb_task_detail.user_id = '"+uid+"'  AND tb_task.status != 1 AND tb_task.status != 100 AND tb_task.status != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id  LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0  GROUP BY tb_task_detail_checkrow.norm_row_id ) t ON tb_norm_detail_row.id = t.norm_row_id and num>1 ) t ON tb_norm_detail.id = t.norm_detail_id and "+num+"  order by value desc",ressssss=>{
									if(ressssss.length!=0){
										let litss = []
										ressssss.forEach(entry=>{
											litss.push(entry.item)
										})
										resultData.Similar = {
											"categories": litss,
											"series":[
												{
													"name": "所属小类",
													"data": ressssss
												}
											]
										}
									}else{
										resultData.Similar =null
									}
									//整改进度
									selectSQL("local","SELECT tb_task.task_name AS name, tb_task_detail.totlecheck AS total_censor, tb_task_detail.hascheck AS censor, tb_task_detail.status, tb_task_detail.totlecheck - tb_task_detail.hascheck AS total_issue  FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND( tb_task_detail.user_id = '"+uid+"' )  AND tb_task.status != 1 AND tb_task.status != 100  AND tb_task.status != 200 AND tb_task.type = 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id  WHERE 1 = 1 GROUP BY tb_task.task_id ORDER BY tb_task.created_time DESC",resssssss=>{
										if(resssssss.length!=0){
											resultData.TaskOverDetail1 = resssssss
										}else{
											resultData.TaskOverDetail1 = []
										}
										resolve(resultData)
									})
								})
							})
						})
					})
				})
		}
	})
}

//查询问题数量
export function queryStatisticsQuestions(alias,unitList,userList,excelList,num){
	let uid = uni.getStorageSync("USER_ID")
	let functionId = uni.getStorageSync("functionid")
	
	return new Promise(resolve=>{
		let resultData = {}
		if(functionId==1){
			let excelIn = ""
			excelList.forEach(item=>{
				excelIn+="'"+item+"',"
			})	
			let userIn = ""
			userList.forEach(item=>{
				userIn+="'"+item+"',"
			})
			let unitIn = ""
			unitList.forEach(item=>{
				unitIn+="'"+item+"',"
			})
			if(num==""||num==0){
				num = "1=1"	
			}else{
				num="value>="+num
			}
			excelIn = excelIn.substring(0,excelIn.length-1)
			userIn = userIn.substring(0,userIn.length-1)
			unitIn = unitIn.substring(0,unitIn.length-1)
			
			selectSQL("local","SELECT * FROM( SELECT belong, item, itemS1, SUM( VALUE) AS value , content, norm_row_id FROM ( SELECT * FROM ( SELECT * FROM ( SELECT tb_task_detail_norm.NAME AS belong, tb_task_detail_norm_detail.item, tb_task_detail_norm_detail.itemS1, count( tb_task_detail_checkrow.tasknormdetailid ) AS VALUE , tb_task_detail_checkrow.content, tb_task_detail_checkrow.norm_row_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS = 8 AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN ( SELECT tb_task_detail_norm.*, tb_excel.NAME FROM tb_task_detail_norm LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id LEFT JOIN tb_excel ON tb_norm.excel_id = tb_excel.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.parent_id, tb_norm_detail.item AS itemS1 FROM tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.parent_id = tb_norm_detail.id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_task_detail_checkrow LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail_checkrow.norm_row_id ORDER BY VALUE DESC ) c ) t UNION ALL SELECT * FROM ( SELECT * FROM ( SELECT tb_task_detail_norm.NAME AS belong, tb_task_detail_norm_detail.item, tb_task_detail_norm_detail.itemS1, count( tb_task_detail_checkrow.tasknormdetailid ) AS VALUE , tb_task_detail_checkrow.content, tb_task_detail_checkrow.norm_row_id FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id AND tb_task_delete_status.STATUS in(8,200) INNER JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 )) ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type = 1 AND tb_task.STATUS IN ( 1, 100 ) AND tb_task.unit_id IN ( "+unitIn+" ) INNER JOIN ( SELECT tb_task_detail_norm.*, tb_excel.NAME FROM tb_task_detail_norm LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id LEFT JOIN tb_excel ON tb_norm.excel_id = tb_excel.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE id IN ( "+excelIn+" ) ) LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.parent_id, tb_norm_detail.item AS itemS1 FROM tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm_detail LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.parent_id = tb_norm_detail.id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_task_detail_checkrow LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0 WHERE 1 = 1 GROUP BY tb_task_detail_checkrow.norm_row_id ORDER BY VALUE DESC ) c ) y ) r GROUP BY r.norm_row_id ORDER BY VALUE DESC ) f WHERE VALUE != 1 AND  "+num,ressssss=>{
				if(ressssss.length!=0){
					let litss = []
					ressssss.forEach(entry=>{
						litss.push(entry.itemS1)
					})
					ressssss.forEach(value=>{
						delete value.item 
						delete value.itemS1
					})
					resultData.Similar = {
						"categories": litss,
						"series":[
							{
								"name": "所属小类",
								"data": ressssss
							}
						]
					}
				}else{
					resultData.Similar =null 
				}
				resolve(resultData)
			})
			}
		
		if(functionId ==2){
			let excelIn = ""
			excelList.forEach(item=>{
				excelIn+="'"+item+"',"
			})	
			let userIn = ""
			userList.forEach(item=>{
				userIn+="'"+item+"',"
			})
			let unitIn = ""
			unitList.forEach(item=>{
				unitIn+="'"+item+"',"
			})
			excelIn = excelIn.substring(0,excelIn.length-1)
			userIn = userIn.substring(0,userIn.length-1)
			unitIn = unitIn.substring(0,unitIn.length-1)
			if(num==""||num==1){
				num = "1=1"
			}else{
				num = "value >= "+num
			}
			selectSQL("local","SELECT t.num as value, t.content, tb_norm.name as belong, tb_norm_detail.item FROM tb_norm INNER JOIN tb_norm_detail ON tb_norm.norm_id = tb_norm_detail.norm_id INNER JOIN( SELECT tb_norm_detail_row.content, tb_norm_detail_row.norm_detail_id, t.num FROM tb_norm_detail_row INNER JOIN ( SELECT COUNT( tb_task_detail_norm_detail.norm_detail_id) AS num, tb_task_detail_checkrow.norm_row_id FROM tb_task INNER JOIN (SELECT * FROM tb_task_detail WHERE user_id IN( SELECT sys_user.user_id from sys_user where role_id in(SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"') and function_id = 2)) )tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id = '"+uid+"' OR tb_task_detail.group_id = '"+uid+"' ) AND tb_task.unit_id IN ("+unitIn+") AND tb_task.status != 1 AND tb_task.status != 100  AND tb_task.status != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail_norm.norm_id IN ("+excelIn+") LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0  GROUP BY tb_task_detail_checkrow.norm_row_id ) t ON tb_norm_detail_row.id = t.norm_row_id and num>1 ) t ON tb_norm_detail.id = t.norm_detail_id and "+num+"  order by value desc",ressssss=>{
				if(ressssss.length!=0){
					let litss = []
					ressssss.forEach(entry=>{
						litss.push(entry.item)
					})
					resultData.Similar = {
						"categories": litss,
						"series":[
							{
								"name": "所属小类",
								"data": ressssss
							}
						]
					}
				}else{
					resultData.Similar =null
				}
				resolve(resultData)
			})
		}
		
		if(functionId ==3){
			if(num==""||num==1){
				num = "1=1"
			}else{
				num = "value >= "+num
			}
			selectSQL("local","SELECT t.num as value, t.content, tb_norm.name as belong, tb_norm_detail.item FROM tb_norm INNER JOIN tb_norm_detail ON tb_norm.norm_id = tb_norm_detail.norm_id INNER JOIN( SELECT tb_norm_detail_row.content, tb_norm_detail_row.norm_detail_id, t.num FROM tb_norm_detail_row INNER JOIN ( SELECT COUNT( tb_task_detail_norm_detail.norm_detail_id) AS num, tb_task_detail_checkrow.norm_row_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND ( tb_task_detail.user_id = '"+uid+"' ) AND tb_task.status != 1 AND tb_task.status != 100  AND tb_task.status != 200 AND tb_task.type != 2 INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id  LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score_type = 1 AND tb_task_detail_checkrow.score > 0  GROUP BY tb_task_detail_checkrow.norm_row_id ) t ON tb_norm_detail_row.id = t.norm_row_id and num>1 ) t ON tb_norm_detail.id = t.norm_detail_id and "+num+"  order by value desc",ressssss=>{
				if(ressssss.length!=0){
					let litss = []
					ressssss.forEach(entry=>{
						litss.push(entry.item)
					})
					resultData.Similar = {
						"categories": litss,
						"series":[
							{
								"name": "所属小类",
								"data": ressssss
							}
						]
					}
				}else{
					resultData.Similar =null
				}
				resolve(resultData)
			})
		}
	})
}

//百分比运算
 function queryUserToTask(arr,callback) {
	let obj = []
	let indexs = 0;
	let indexss = 0;
	arr.forEach(val=>{
		if(val.taskId.length==0){
			
		}else{
			val.taskId.forEach(item=>{
				indexss+=1
			})
		}
	})
	for (let i = 0; i < arr.length; i++) {
		let index = 0;
		let index1 = 0;
		let num1 = 0
		index=arr[i].taskId.length
		if(arr[i].taskId.length==0){
			if(index==index1){
				obj.push({
					user_id:arr[i].user,
					result:GetPercent(num1,arr[i].taskId.length)+"%"
				})
			}
			if(indexs==indexss){
				callback(obj)
			}
		}else{
			for (let j = 0; j < arr[i].taskId.length; j++) {
				 selectSQL("local","SELECT COUNT(tb_group_report.task_id) as num from tb_group_report where task_id = '"+arr[i].taskId[j]+"' and user_id in (select user_id from sys_user left join sys_role on sys_user.role_id = sys_role.role_id where sys_role.function_id = 1)",res=>{
					index1+=1
					indexs+=1
					if(res[0].num==1){
						num1+=1
					}
					if(index==index1){
						obj.push({
							user_id:arr[i].user,
							result:GetPercent(num1,arr[i].taskId.length)+"%"
						})
					}
					if(indexs==indexss){
						callback(obj)
					}
				})
			}
		}
		
	}
}

//百分比
function GetPercent(num, total) {
    /// <summary>
    /// 求百分比
    /// </summary>
    /// <param name="num">当前数</param>
    /// <param name="total">总数</param>
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return "-";
    }
    return total <= 0 ? 0 : (Math.round(num / total * 10000) / 100);
}

