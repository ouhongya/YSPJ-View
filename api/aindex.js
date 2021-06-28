import {
	openComDB,
	closeComDB,
	executeSQL,
	selectSQL,
	transaction
} from '@/common/local.js'

/**
 * 查询回收站列表
 * @param {Object} page
 * @param {Object} size
 * @param {Object} search
 * @param {Object} uid
 */
export function queryRecycleList(page, size, search, uid) {
	return new Promise(resolve => {
		let functionid = uni.getStorageSync("functionid")
		let currentPage = (page - 1) * size;
		let sql = ""
		if(functionid==2){
			sql = "SELECT s.*, tb_task_delete_status.status FROM ( SELECT t.*, sys_unit.unit_name AS unitName FROM ( SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task.star_time AS star_time, tb_task.end_time AS end_time, tb_task.unit_id ,tb_task.end_time as rend_time,tb_task.totlecheck AS totalItem, tb_task.totolequestion AS total_issue, tb_task.hascheck AS checkItem, tb_task.updatetime FROM tb_task WHERE status = '1' AND user_id = '"+uid+"' ) t LEFT JOIN sys_unit ON t.unit_id = sys_unit.unit_id ) s LEFT JOIN tb_task_delete_status ON s.task_id = tb_task_delete_status.task_id WHERE 1 = 1 AND tb_task_delete_status.status != 100 AND tb_task_delete_status.status != 200 AND taskName LIKE  '%"+search+"%' ORDER BY updatetime DESC LIMIT " + currentPage + "," + size
		}else{
			sql = "SELECT s.*, tb_task_delete_status.status FROM ( SELECT t.*, sys_unit.unit_name AS unitName FROM ( SELECT tb_task_detail.taskdetail_id,tb_task.task_id, tb_task.task_name AS taskName, tb_task.star_time AS star_time, tb_task.end_time AS end_time, tb_task.unit_id,tb_task.end_time as rend_time,tb_task_detail.taskdetail_id , tb_task_detail.totlecheck AS totalItem, tb_task_detail.totlequestion AS total_issue, tb_task_detail.hascheck AS checkItem, tb_task.updatetime FROM tb_task LEFT JOIN tb_task_detail on tb_task.task_id =  tb_task_detail.task_id WHERE tb_task.status = '1' AND  tb_task.user_id = '"+uid+"'  group by tb_task.task_id) t LEFT JOIN sys_unit ON t.unit_id = sys_unit.unit_id ) s LEFT JOIN tb_task_delete_status ON s.taskdetail_id = tb_task_delete_status.task_id WHERE 1 = 1 AND tb_task_delete_status.status != 100 AND tb_task_delete_status.status != 200 AND taskName LIKE  '%"+search+"%' ORDER BY updatetime DESC LIMIT " + currentPage + "," + size
		}
		let sqlCountNum = "SELECT count(s.task_id) as num FROM ( SELECT t.*, sys_unit.unit_name AS unitName FROM ( SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task.star_time AS star_time, tb_task.end_time AS end_time, tb_task.unit_id , tb_task.totlecheck AS totalItem, tb_task.totolequestion AS total_issue, tb_task.hascheck AS checkItem, tb_task.updatetime FROM tb_task WHERE status = '1' AND user_id = '"+uid+"' ) t LEFT JOIN sys_unit ON t.unit_id = sys_unit.unit_id ) s LEFT JOIN tb_task_delete_status ON s.task_id = tb_task_delete_status.task_id WHERE 1 = 1 AND tb_task_delete_status.status != 100 AND tb_task_delete_status.status != 200 AND taskName LIKE  '%"+search+"%'  "
		selectSQL('local',sql,res=>{
			selectSQL('local',sqlCountNum,ress=>{
				if(res.length==0){
					resolve(null);
				}else{
					res[0].total=ress[0].num
					let ind = 0;
					res.forEach(item=>{
						selectSQL('local',"select * from (SELECT tb_norm.name,tb_norm.norm_id, 2 AS isFlag FROM tb_task_detail LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id WHERE tb_task_detail.task_id = '"+item.task_id+"' AND tb_task_detail.user_id != '"+uid+"' group by tb_norm.norm_id union SELECT tb_norm.name,tb_norm.norm_id, 1 AS isFlag FROM tb_task_detail LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id WHERE tb_task_detail.task_id = '"+item.task_id+"' AND tb_task_detail.user_id = '"+uid+"'  group by tb_norm.norm_id)t order by isFlag ",resNorm=>{
							let normId = []
							resNorm.forEach(entry=>{
								normId.push(entry.norm_id)
							})
							let arr  = refrain(normId);
							let indexArr = []
							resNorm.forEach(VAL=>{
								if(arr.indexOf(VAL.norm_id) != -1 && VAL.isFlag==2){
									indexArr.push(resNorm.indexOf(VAL))
								}
							})
							let obj = []
							resNorm.forEach(VAL=>{
								if(indexArr.indexOf(resNorm.indexOf(VAL))== -1){
									obj.push(VAL)	
								}
							})
							ind+=1
							item.normName = obj
							item.abs = getDuration(parseFloat(item.updatetime))
							item.totalItem = parseInt(item.totalItem)
							item.checkItem = parseInt(item.checkItem)
							item.total_issue = parseInt(item.total_issue)
							item.result =GetPercent(item.checkItem,item.totalItem)
							if(ind==res.length){
								resolve(res);
							}
						})
					})
				}
			})
		})
	})
}

function refrain(arr) {
　　var tmp = [];
　　if(Array.isArray(arr)) {
　　　　arr.concat().sort().sort(function(a,b) {
　　　　　　if(a==b && tmp.indexOf(a) === -1) tmp.push(a);
　　　　});
　　}
　　return tmp;
}
/**
 * 恢复操作
 * @param {Object} page
 * @param {Object} size
 * @param {Object} search
 */
export function recoveryTask(taskId,status) {
	return new Promise(resolve=>{
		//改变主表以及子表
		let taskSql = "update tb_task set status = '"+status+"' ,direty ='1','delete'='0',updatetime='"+new Date().getTime()+"' where  task_id='"+taskId+"'"
		let taskDetailStatus = "select task_id,status from tb_task_delete_status where task_id in (select taskdetail_id from tb_task_detail where task_id = '"+taskId+"')"
		executeSQL("local",taskSql,taskRes=>{
			selectSQL("local",taskDetailStatus,res=>{
				let r = 0;
				res.forEach(item=>{
					let taskDetailSql = "update tb_task_detail set status = '"+item.status+"' ,direty ='1','delete'='0',updatetime='"+new Date().getTime()+"' where  taskdetail_id='"+item.task_id+"'"
					executeSQL("local",taskDetailSql,taskDetailRes=>{
						r+=1;
						if(r==res.length){
							resolve("操作成功")
						}
					})
				})
			})
		})
	})
}

/**
 * 删除操作
 * @param {Object} taskId
 */
export function removeTask(taskId) {
	return new Promise(resolve=>{
		selectSQL("local","select tb_task_delete_status.status from tb_task_delete_status where tb_task_delete_status.task_id ='"+taskId+"'",cc=>{
			console.log(cc[0].status==8)
			if(cc[0].status==8){
				let taskDetailStatus = "select task_id from tb_task_delete_status where task_id in (select taskdetail_id from tb_task_detail where task_id = '"+taskId+"')"
				//删除中间表
				executeSQL("local","update tb_task_delete_status set status =200,direty ='1','delete'='0',updatetime='"+new Date().getTime()+"' where tb_task_delete_status.task_id='"+taskId+"'",res=>{
					//查询发放表
					selectSQL("local",taskDetailStatus,res1=>{
						if(res1.length!=0){
							let r = 0;
							res1.forEach(item=>{
								let taskDetailSql = "update tb_task_delete_status set status =100,direty ='1','delete'='0',updatetime='"+new Date().getTime()+"' where tb_task_delete_status.task_id='"+item.task_id+"'"
								executeSQL("local",taskDetailSql,taskDetailRes=>{
									r+=1;
									if(r==res1.length){
										resolve(true)
									}
								})
							})
						}else{
							resolve(true)
						}
					})
				})
			}else{
				let taskDetailStatus = "select task_id from tb_task_delete_status where task_id in (select taskdetail_id from tb_task_detail where task_id = '"+taskId+"')"
				//删除中间表
				executeSQL("local","update tb_task_delete_status set status =100,direty ='1','delete'='0',updatetime='"+new Date().getTime()+"' where tb_task_delete_status.task_id='"+taskId+"'",res=>{
					//查询发放表
					selectSQL("local",taskDetailStatus,res1=>{
						if(res1.length!=0){
							let r = 0;
							res1.forEach(item=>{
								let taskDetailSql = "update tb_task_delete_status set status =100,direty ='1','delete'='0',updatetime='"+new Date().getTime()+"' where tb_task_delete_status.task_id='"+item.task_id+"'"
								executeSQL("local",taskDetailSql,taskDetailRes=>{
									r+=1;
									if(r==res1.length){
										resolve(true)
									}
								})
							})
						}else{
							resolve(true)
						}
					})
				})
			}
		})
	})
}

/**
 * 查询过期时间进行删除
 * @param {Object} taskId
 */
export function queryTaskRemove() {
	//查询删除的任务
	let day60 = 5184000000
	day60=day60*3
	selectSQL("local","select tb_task.task_id,tb_task.updatetime from tb_task left join tb_task_delete_status on tb_task.task_id = tb_task_delete_status.task_id where tb_task.status = '1' and tb_task_delete_status.status < '100'",res=>{
		res.forEach(item=>{
			let time = parseFloat(item.updatetime)+day60
			if(time>=new Date().getTime()){
				removeTask(item.task_id)
			}
		})
	})
}

/**
 * 计算剩余时间
 * @param {Object} deleteTime
 */
function getDuration(deleteTime) {
	//60天的毫秒值
	let day60 = 5184000000
	day60=day60*3
	let number = deleteTime + day60;
	//剩余天数(毫秒值)
	let day = number - new Date().getTime();
	var days = day / 1000 / 60 / 60 / 24;
	var daysRound = Math.floor(days);
	var hours = day / 1000 / 60 / 60 - (24 * daysRound);
	var hoursRound = Math.floor(hours);
	var minutes = day / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
	var minutesRound = Math.floor(minutes);
	var seconds = day / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
	var time = daysRound
	return time;
}

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
