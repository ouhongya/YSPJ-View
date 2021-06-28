import {
	openComDB,
	closeComDB,
	executeSQL,
	selectSQL,
	transaction
} from '@/common/local.js'

import {
	saveImage
} from '@/api/util/saveFile.js'


import {
	saveImages
} from '@/api/util/saveImage.js'

let SAVED_DIR = "/storage/emulated/0/验收评价/标准模板/"


/**
 * 导出全部数据/数据组装
 * @param {Object} obj
 */
export function importUserToData(obj, functionid, uid, userIdss) {
	return new Promise(resolve => {
		let u = uni.getStorageSync("USER_ID")
		let checktype = obj.checktype
		let checkpic = obj.checkpic
		//检查员按照开始检查的时间来搜索
		//组长按照建立任务的时间来搜索
		//组长按照标准下发的时间来搜索
		let time = ""
		//查询SQL
		let sql = ''
		let cc = ''
		//组装数据
		if (obj.checktime != '') {
			let date = obj.checktime.split("至");
			let startTime = new Date(date[0] + " 00:00:00").getTime();
			let endTime = new Date(date[1] + " 23:59:59").getTime();
			time = "tb_task.created_time BETWEEN '" + startTime + "' AND '" + endTime + "'"
		} else {
			time = "'" + "1=1" + "'"
		}
		if (functionid == 1) {
			let unitIn = ''
			if (obj.unit.length != 0) {
				obj.unit.forEach(item => {
					unitIn += "'" + item + "',"
				})
			unitIn = "tb_task.unit_id IN ( " + unitIn.substring(0, unitIn.length - 1) + ")"
			} else {
				unitIn = "1=1"
			}
			let userIn = ""
			let userIn1 = ''
			let userIn2 = ''
			if (obj.user.length != 0) {
					obj.user.forEach(item => {
						userIn += "'" + item + "',"
					})
					userIn1 = "tb_task_detail.user_id IN (" + userIn.substring(0, userIn.length - 1) + ")"
					userIn2 = "tb_task_detail.group_id IN (" + userIn.substring(0, userIn.length - 1) + ")"
				} else {
					userIn1 = "1=1"
					userIn2 = "1=1"
				}
			let excelIn = ''
			if (obj.excel.length != 0) {
				obj.excel.forEach(item => {
					excelIn += "'" + item + "',"
				})
				excelIn =
					"tb_task_detail_norm.norm_id IN (SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE tb_excel.id IN (" +
					excelIn.substring(0, excelIn.length - 1) + "))"
			} else {
				excelIn = "1=1"
			}
			let taskIn = "1=1"
			if (checktype == "全部数据") {
				sql ="select * from ( select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature,tb_task_detail_checkrow.tasknormdetailid , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture,  tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM ( SELECT * FROM tb_task_detail WHERE user_id IN( SELECT sys_user.user_id from sys_user where role_id in(SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"') and function_id = 2))  )tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND (tb_task.status>=7 or tb_task.status<=11) and tb_task.status !=1 and tb_task.status !=100  and tb_task.type!=3  and tb_task.status !=1 and tb_task.status !=100  LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' AND tb_task.status = '8' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" )  where smallCategory is not null order by  majorCategory ASC,serial ASC ,questionItem ASC )t  union all select * from (  SELECT * FROM( SELECT tb_task.task_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes, CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature, tb_task_detail_checkrow.tasknormdetailid, CASE tb_task_detail_checkrow.score_type WHEN 0 THEN CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid, tb_task_detail_checkrow.norm_row_id, tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id and tb_task_delete_status.STATUS IN(8,200) LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.type != 3 AND tb_task.status in(1,100) LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE ( " +userIn1 + " OR " + userIn2 + " ) AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" ) WHERE smallCategory IS NOT NULL ORDER BY majorCategory ASC, serial ASC, questionItem ASC  )y"
			} else {
				sql ="select * from ( select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture,  tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM ( SELECT * FROM tb_task_detail WHERE user_id IN( SELECT sys_user.user_id from sys_user where role_id in(SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"') and function_id = 2))  )tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND (tb_task.status>=7 or tb_task.status<=11) and tb_task.status !=1 and tb_task.status !=100  and tb_task.type!=3 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid and tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" union  SELECT tb_task.task_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' as status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' as correct, '' as correctremark, '' as correctpicture, tb_task_detail_norm_detail.updatetime as inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid,'' as norm_row_id,tb_task_detail_norm.name FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM ( SELECT * FROM tb_task_detail WHERE user_id IN( SELECT sys_user.user_id from sys_user where role_id in(SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id =( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"') and function_id = 2))  )tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND (tb_task.status>=7 or tb_task.status<=11) and tb_task.status !=1 and tb_task.status !=100  and tb_task.type!=3 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +")  where smallCategory is not null and type = '3' )t union all select * from ( SELECT * FROM( SELECT tb_task.task_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes, CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature, CASE tb_task_detail_checkrow.score_type WHEN 0 THEN CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid, tb_task_detail_checkrow.norm_row_id, tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id and tb_task_delete_status.STATUS IN(8,200) LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status IN(1,100) AND tb_task.type != 3 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE ( " +userIn1 + " OR " + userIn2 + " ) AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" UNION SELECT tb_task.task_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' AS status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' AS correct, '' AS correctremark, '' AS correctpicture, tb_task_detail_norm_detail.updatetime AS inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid, '' AS norm_row_id, tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id and tb_task_delete_status.STATUS IN(8,200) LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uid+"' ) AND function_id = 2 ) ) ) tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status in (1,100) AND tb_task.type != 3 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE ( " +userIn1 + " OR " + userIn2 + " ) AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" ) WHERE smallCategory IS NOT NULL AND type = '3' )y order by  majorCategory ASC,serial ASC ,questionItem ASC"
			}
			selectSQL("local", sql, res => {
				let taskList = res
				if (taskList.length == 0) {
					resolve("isFlag")
					return
				}
				let countTaskNum =
					"select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName,tb_task.type  FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND (tb_task.status>=7 or tb_task.status<=11) and tb_task.status !=1 and tb_task.status !=100  and tb_task.type!=3  LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " +unitIn + " AND " + time +" group by tb_task.task_id) t union all select * from ( SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task.type FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id and tb_task_delete_status.STATUS IN(8,200) LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status in(1,100) AND tb_task.type != 3 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE ( " +userIn1 + " OR " + userIn2 + " ) AND " + excelIn + " AND " + taskIn + " AND " +unitIn + " AND " + time +" GROUP BY tb_task.task_id )y"
				//查询任务数
				let data = []
				selectSQL("local", countTaskNum, resName => {
						//更换检查人
						  selectTaskUserSync(taskList,resName).then(ccc=>{
							res=ccc
									//问题图片路径
													let issueImage = []
													let issueImage1 = []
													let taskName = ""
													let taskArr = []
													taskList = taskList.filter(item => item.type !== "");
													taskList.forEach((item) => {
														taskArr.push(item.tasknormdetailid)
													})
													let countedNames = taskArr.reduce(function(obj, name) {
														obj[name] = obj[name] ? ++obj[name] : 1;
														return obj;
													}, {});
													for (let ket in countedNames) {
														let count = countedNames[ket]
														if (count != 1) {
															for (let index = taskList.length - 1; index >= 0; index--) {
																if (taskList[index].tasknormdetailid == ket && taskList[index]
																	.questionItem == "") {
																	taskList.splice(index, 1);
																}
															}
														}
													}
													resName.forEach(item => {
														let worksheetData = []
														taskList.forEach(entry => {
															if (item.task_id == entry.task_id) {
																if (entry.type == "1") {
																	//entry.questionItem = ''
																} else {
																	if (entry.questionItem != null) {
																		entry.questionItem = entry.questionItem
																			.replace("<", '小于')
																	}
																}
																entry.startTime = dateFormat("YYYY-mm-dd",
																	new Date(parseFloat(entry.startTime)))
																entry.endTime = dateFormat("YYYY-mm-dd",
																	new Date(parseFloat(entry.endTime)))
																entry.inspectors = entry.username + "/" + entry
																	.userphone
																if (entry.groupname != null) {
																	entry.group = entry.groupname + "/" + entry
																		.groupPhone
																} else {
																	entry.group = ''
																}
																entry.inspectionTime = dateFormat(
																	"YYYY-mm-dd HH:MM", new Date(parseFloat(
																		entry.inspectionTime)))
																worksheetData.push(entry)
															}
														})
														if (item.type == 3) item.type = 1
														taskName += item.taskName + ","
														data.push({
															worksheet: item.taskName,
															isFlag: item.type,
															worksheetData: worksheetData
														})
													})
													let fileName = "全部任务 " + dateFormat("mmdd HH-MM-SS", new Date()) + " " +checktype + ".xlsx"
													data.forEach(item => {
														if(item.isFlag==2){
															item.worksheetData.forEach(entry => {
																entry.id = item.worksheetData.indexOf(entry) + 1
																if (entry.unitChildName == null) {
																	entry.unitChildName = ""
																}
																if (entry.correctpicture != "" && checkpic == "是") {
																	let imgprefex = ""
																	let imgprefex1 = ""
																	if (item.serial == "") {
																		if (isNumber(entry.questionItem.substring(0,1))) {
																			imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
																			imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
																		} else {
																			imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
																			imgprefex1 = entry.id + "_" + entry.id
																		}
																	} else {
																		if (isNumber(entry.questionItem.substring(0,1))) {
																			imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
																			imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
																		} else {
																			imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
																			imgprefex1 = entry.serial + "_" + entry.id
																		}
																	}
																	let varr = ""
																	entry.correctpicture.split(",").forEach(val=>{
																		varr+=val+"/"+entry.name+","
																	})
																	entry.correctpicture = varr.substring(0,varr.length-1)
																	issueImage1.push(imgprefex + "/" + entry.task_id + "/" + entry.correctpicture)
																	let arr = entry.correctpicture.split(",")
																	let img = ""
																	let inde = 0
																	arr.forEach(val => {
																		inde += 1
																		img += entry.name+": "+imgprefex1 + "_图片" + inde +"_整改.png" + ","
																	})
																	entry.rectifyImage = img.substring(0, img.length -1)
																} else {
																	entry.rectifyImage = ''
																}
																if (entry.issueImage != "" && checkpic == "是") {
																	let imgprefex = ""
																	let imgprefex1 = ""
																	if (item.serial == "") {
																		if (isNumber(entry.questionItem.substring(0,1))) {
																			imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
																			imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
																		} else {
																			imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
																			imgprefex1 = entry.id + "_" + entry.id
																		}
																	} else {
																		if (isNumber(entry.questionItem.substring(0,1))) {
																			imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
																			imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
																		} else {
																			imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
																			imgprefex1 = entry.serial + "_" + entry.id
																		}
																	}
																	let varr = ""
																	entry.issueImage.split(",").forEach(val=>{
																		varr+=val+"/"+entry.name+","
																	})
																	entry.issueImage = varr.substring(0,varr.length-1)
																	issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
																	let arr = entry.issueImage.split(",")
																	let img = ""
																	let inde = 0
																	arr.forEach(val => {
																		inde += 1
																		img += entry.name+": "+imgprefex1 + "_图片" + inde +".png" + ","
																	})
																	entry.issueImage = img.substring(0, img.length -1)
																} else {
																	entry.issueImage = ''
																}
															})
														}else{
															item.worksheetData.forEach(entry => {
																entry.id = item.worksheetData.indexOf(entry) + 1
																if (entry.unitChildName == null) {
																	entry.unitChildName = ""
																}
																if (entry.issueImage != "" && checkpic == "是") {
																	let imgprefex = ""
																	let imgprefex1 = ""
																	if (item.serial == "") {
																		if (isNumber(entry.questionItem.substring(0,1))) {
																			imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
																			imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
																		} else {
																			imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
																			imgprefex1 = entry.id + "_" + entry.id
																		}
																	} else {
																		if (isNumber(entry.questionItem.substring(0,1))) {
																			imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
																			imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
																		} else {
																			imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
																			imgprefex1 = entry.serial + "_" + entry.id
																		}
																	}
																	let varr = ""
																	entry.issueImage.split(",").forEach(val=>{
																		varr+=val+"/"+entry.name+","
																	})
																	entry.issueImage = varr.substring(0,varr.length-1)
																	issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
																	let arr = entry.issueImage.split(",")
																	let img = ""
																	let inde = 0
																	arr.forEach(val => {
																		inde += 1
																		img += entry.name+": "+ imgprefex1 + "_图片" + inde +".png" + ","
																	})
																	entry.issueImage = img.substring(0, img.length -1)
																} else {
																	entry.issueImage = ''
																}
															})
														}
													})
													data.forEach(val => {
														val.isFlag = val.isFlag + ""
													})
													for (let i = data.length - 1; i >= 0; i--) {
														if (data[i].worksheetData.length == 0) {
															data.splice(i, 1)
														}
													}
													//保存数据
													let file = "导出数据/" + uni.getStorageSync('NAME') + " 导出全部 " + dateFormat("YYYYmmdd HH-MM-SS", new Date())
													//保存数据
													let arr = []
													data.forEach(val => {
														val.isFlag = val.isFlag + ""
														val.worksheetData.forEach(item => {
															if(item.score=='0'){
																item.type='1'
															}
															if(item.norm_row_id!=''&&val.isFlag==2){
																arr.push(item.norm_row_id)
															}
														})
													})
													let indes = 0;
													let inde = 0;
													//查询是否存在整改数据
													data.forEach(item => {
														inde += item.worksheetData.length;
														selectSQL("local"," SELECT tb_task_detail.taskdetail_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id where tb_task_detail.task_id = '"+item.worksheetData[0].task_id+"' and tb_task_detail.user_id = tb_task.user_id",task_detailId=>{
															let row = ""
															arr.forEach(entry => {
																row += "'" + entry +"',"
															})
															row = "in (" + row.substring(0, row.length - 1) + ")"
															selectSQL("local","select * from (SELECT * from( SELECT tb_task.star_time, tb_task.end_time, tb_task_detail.name, tb_task_detail.phone, tb_task_detail.phone1, tb_task_detail.username, tb_task_detail_checkrow.norm_row_id, tb_task_detail_checkrow.updatetime, ''as name2,'' as phone2 FROM tb_group_report INNER JOIN tb_task ON tb_group_report.task_id = tb_task.task_id AND againtaskid LIKE '%"+task_detailId[0].taskdetail_id+"%' LEFT JOIN ( SELECT t1.*, t2.username, t2.phone FROM ( SELECT tb_task_detail.*, sys_user.name, sys_user.phone AS phone1 FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id) t1, ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t2 WHERE t1.taskdetail_id = t2.taskdetail_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail_checkrow.norm_row_id "+row+" ) t UNION SELECT '' as star_time, '' asend_time, '' asname, '' asphone, '' asphone1, '' asusername, '' asnorm_row_id, '' asupdatetime, sys_user.name as name2,sys_user.phone as phone2 from tb_task LEFT JOIN sys_user on tb_task.user_id = sys_user.user_id WHERE task_id ='"+item.worksheetData[0].task_id+"' )cc where 1=1", taskData => {
																let rectifyInspectors = ""
																let group = ""
																let normIdData = []
																taskData.forEach(item=>{
																	normIdData.push(item.norm_row_id)
																})
																let normIdDatas =  refrain(normIdData)
																for (var i = taskData.length - 1; i >= 0; i--) {
																       if(taskData[i].phone1!=null&&normIdDatas.indexOf(taskData[i].norm_row_id)!=-1){
																       	taskData.splice(i,1)
																       }
																    }
																	taskData.forEach(key=>{
																		if(key.star_time==''&&key.end_time==''){
																			rectifyInspectors = key.name2 +"/" +key.phone2
																		}
																		if(key.name!=''&&key.phone1!=''){
																			group = key.name +"/" +key.phone1
																		}
																	})
																	item.worksheetData.forEach(val => {
																			if(item.isFlag==2){
																				indes += 1
																				//整改备注
																				val.rectifyRemarks =val.correctremark
																				//整改措施
																				val.rectifyAction =""
																				//整改人员
																				val.rectifyPerson =val.inspectors
																				//整改负责人
																				val.rectifyInspectors =rectifyInspectors
																				//整改期限
																				val.rectifyTime =val.startTime +" " +val.endTime
																				//整改要求
																				val.rectifyReform =val.correct
																				//组长/检察员/开始结束时间/检查时间
																				val.group =group
																				if(val.group == ("null/null")){
																					val.group = ""
																				}
																				//组长/检察员/开始结束时间/检查时间
																				taskData.forEach(entry => {
																						if (val.norm_row_id == entry.norm_row_id) {
																								val.startTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.star_time)))
																								val.endTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.end_time)))
																								val.inspectors =entry.username +"/" +entry.phone
																								val.inspectionTime =dateFormat("YYYY-mm-dd HH:MM",new Date(parseFloat(entry.updatetime)))
																						}
																				})
																				if (inde ==indes) {
																					//判断是否是需要整改的数据
																					importData(data, file, fileName, res => {
																						//是否保存图片
																						if (checkpic == "是") {
																							if (issueImage1.length != 0||issueImage.length != 0) {
																								//复制正常图片开始
																								saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																											//复制整改图片开始
																											saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																														resolve(	res)
																											})
																									})
																							} else {
																								resolve(res)
																							}
																						} else {
																							resolve(res)
																						}
																					})
																				}
																			}else{
																				indes += 1
																				if (inde ==indes) {
																					//判断是否是需要整改的数据
																					importData(data, file, fileName, res => {
																						//是否保存图片
																						if (checkpic == "是") {
																							if (issueImage1.length != 0||issueImage.length != 0) {
																								//复制正常图片开始
																								saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																											//复制整改图片开始
																											saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																														resolve(	res)
																											})
																									})
																							} else {
																								resolve(res)
																							}
																						} else {
																							resolve(res)
																						}
																					})
																				}
																			}
																		})
																})
														})
													})
						})
					})
			})
		} else if (functionid == 2) {
			let unitIn = ''
			if (obj.unit.length != 0) {
				obj.unit.forEach(item => {
					unitIn += "'" + item + "',"
				})
				unitIn = "tb_task.unit_id IN ( " + unitIn.substring(0, unitIn.length - 1) + ")"
			} else {
				unitIn = "1=1"
			}
			let userIn = ""
			let userIn1 = ''
			let userIn2 = ''
			let userIn11 = ''
			let userIn22 = ''
			if (obj.user.indexOf(u) != -1) {
				obj.user.splice(obj.user.indexOf(u), 1)
			}
			obj.user.forEach(item => {
				userIn += "'" + item + "',"
			})
			userIn1 = "tb_task_detail.user_id IN (" + userIn.substring(0, userIn.length - 1) + ")"
			userIn2 = "tb_task_detail.group_id IN (" + userIn.substring(0, userIn.length - 1) + ")"
			userIn11 = "tb_task_detail.user_id IN ('" + u + "')"
			userIn22 = "tb_task_detail.group_id IN ('" + u + "')"
			let excelIn = ''
			if (obj.excel.length != 0) {
				obj.excel.forEach(item => {
					excelIn += "'" + item + "',"
				})
				excelIn = "tb_task_detail_norm.norm_id IN (" + excelIn.substring(0, excelIn.length - 1) + ")"
			} else {
				excelIn = "1=1"
			}
			let taskIn = ''
			if (obj.task.length != 0) {
				obj.task.forEach(item => {
					taskIn += "'" + item + "',"
				})
				taskIn = "tb_task.task_id IN (" + taskIn.substring(0, taskIn.length - 1) + ")"
			} else {
				taskIn = "1=1"
			}
			if (checktype == "全部数据") {
			 sql ="select * from (SELECT tb_task.task_id, tb_task_detail.status as isStatus,tb_task_detail.group_id as groupId,tb_task_detail.user_id as userId,tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture,  tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' and  tb_task_detail.status = 8 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" union SELECT tb_task.task_id,tb_task_detail.status as isStatus,tb_task_detail.group_id as groupId,tb_task_detail.user_id as userId, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture,  tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1'  LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid  LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn11 + " OR " + userIn22 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" )  where smallCategory is not null GROUP BY task_id, norm_row_id order by  majorCategory ASC,serial ASC ,questionItem ASC"
			} else {
				sql ="select * from (SELECT tb_task.task_id,  tb_task_detail.status as isStatus,tb_task_detail.group_id as groupId,tb_task_detail.user_id as userId,tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture,  tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' and  tb_task_detail.status = 8 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid and tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" union  SELECT tb_task.task_id,  tb_task_detail.status as isStatus,tb_task_detail.group_id as groupId,tb_task_detail.user_id as userId,tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' as status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' as correct, '' as correctremark, '' as correctpicture, tb_task_detail_norm_detail.updatetime as inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid,'' as norm_row_id,tb_task_detail_norm.name FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task inner JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' and  tb_task_detail.status = 8 LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" union SELECT tb_task.task_id, tb_task_detail.status as isStatus,tb_task_detail.group_id as groupId,tb_task_detail.user_id as userId, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture,  tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid ,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task INNER JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1'  LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid and tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn11 + " OR " + userIn22 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +" union  SELECT tb_task.task_id,  tb_task_detail.status as isStatus,tb_task_detail.group_id as groupId,tb_task_detail.user_id as userId,tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' as status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' as correct, '' as correctremark, '' as correctpicture, tb_task_detail_norm_detail.updatetime as inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid, '' as norm_row_id,tb_task_detail_norm.name FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task inner JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1'  LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE (" +userIn11 + " OR " + userIn22 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +")  where smallCategory is not null and type = '3' GROUP BY task_id, norm_row_id order by  majorCategory ASC,serial ASC ,questionItem ASC"
			}
			selectSQL("local", sql, res => {
				//删除组长不需要导出的数据
				for (var i = res.length - 1; i >= 0; i--) {
					if (userIdss.indexOf(res[i].userId) == -1 && res[i].groupId == u && res[i]
						.isStatus != '8') {
						res.splice(i, 1)
					}
				}
				let taskList = res
				if (taskList.length == 0) {
					resolve("isFlag")
					return
				}
				let countTaskNum =
					"SELECT tb_task.task_id, tb_task.task_name AS taskName,tb_task.type  FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +
					userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " +
					unitIn + " AND " + time +
					" group by tb_task.task_id union SELECT tb_task.task_id, tb_task.task_name AS taskName,tb_task.type  FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +
					userIn11 + " OR " + userIn22 + ") AND " + excelIn + " AND " + taskIn + " AND " +
					unitIn + " AND " + time +
					" group by tb_task.task_id"
				//查询任务数
				let data = []
				selectSQL("local", countTaskNum, resName => {
					selectTaskUserSync(res,resName).then(ccc=>{
							res = ccc
						//问题图片路径
							let issueImage = []
							let issueImage1 = []
							let taskName = ""
							let taskArr = []
							taskList = taskList.filter(item => item.type !== "");
							taskList.forEach((item) => {
								taskArr.push(item.tasknormdetailid)
							})
							let countedNames = taskArr.reduce(function(obj, name) {
								obj[name] = obj[name] ? ++obj[name] : 1;
								return obj;
							}, {});
							for (let ket in countedNames) {
								let count = countedNames[ket]
								if (count != 1) {
									for (let index = taskList.length - 1; index >= 0; index--) {
										if (taskList[index].tasknormdetailid == ket && taskList[index]
											.questionItem == "") {
											taskList.splice(index, 1);
										}
									}
								}
							}
							resName.forEach(item => {
								let worksheetData = []
								let statusc = false
								taskList.forEach(entry => {
									if (item.task_id == entry.task_id) {
										if (entry.type == "1") {
											//entry.questionItem = ''
										} else {
											if (entry.questionItem != null) {
												entry.questionItem = entry.questionItem
													.replace("<", '小于')
											}
										}
										entry.startTime = dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.startTime)))
										entry.endTime = dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.endTime)))
										entry.inspectors = entry.username + "/" + entry.userphone
										if (entry.groupname != null) {
											entry.group = entry.groupname + "/" + entry.groupPhone
											statusc=true
										} else {
											entry.group = ''
										}
										entry.inspectionTime = dateFormat("YYYY-mm-dd HH:MM", new Date(parseFloat(entry.inspectionTime)))
										worksheetData.push(entry)
									}
								})
								if (item.type == 3) item.type = 1
								taskName += item.taskName + ","
								if(statusc){
									//处理任务组长数据断片儿问题
									for (var i = worksheetData.length - 1;i >= 0;i--){
											if(worksheetData[i].group==''){
												worksheetData.splice(i,1)
											}
									}
								}
								data.push({
									worksheet: item.taskName,
									isFlag: item.type,
									worksheetData: worksheetData
								})
							})
							let fileName = "全部任务 " + dateFormat("mmdd HH-MM-SS", new Date()) + " " +checktype + ".xlsx"
							data.forEach(item => {
								if(item.isFlag==2){
									item.worksheetData.forEach(entry => {
										entry.id = item.worksheetData.indexOf(entry) + 1
										if (entry.unitChildName == null) {
											entry.unitChildName = ""
										}
										if (entry.correctpicture != "" && checkpic == "是") {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.correctpicture.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											
											entry.correctpicture = varr.substring(0,varr.length-1)
											issueImage1.push(imgprefex + "/" + entry.task_id + "/" + entry.correctpicture)
											let arr = entry.correctpicture.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+imgprefex1 + "_图片" + inde +"_整改.png" + ","
											})
											entry.rectifyImage = img.substring(0, img.length -1)
										} else {
											entry.rectifyImage = ''
										}
										if (entry.issueImage != "" && checkpic == "是") {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.issueImage.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.issueImage = varr.substring(0,varr.length-1)
											issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
											let arr = entry.issueImage.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+imgprefex1 + "_图片" + inde +".png" + ","
											})
											entry.issueImage = img.substring(0, img.length -1)
										} else {
											entry.issueImage = ''
										}
									})
								}else{
									item.worksheetData.forEach(entry => {
										entry.id = item.worksheetData.indexOf(entry) + 1
										if (entry.unitChildName == null) {
											entry.unitChildName = ""
										}
										if (entry.issueImage != "" && checkpic == "是") {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.issueImage.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.issueImage = varr.substring(0,varr.length-1)
											issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
											let arr = entry.issueImage.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+ imgprefex1 + "_图片" + inde +".png" + ","
											})
											entry.issueImage = img.substring(0, img.length -1)
										} else {
											entry.issueImage = ''
										}
									})
								}
							})
							data.forEach(val => {
								val.isFlag = val.isFlag + ""
							})
							for (let i = data.length - 1; i >= 0; i--) {
								if (data[i].worksheetData.length == 0) {
									data.splice(i, 1)
								}
							}
							//保存数据
							let file = "导出数据/" + uni.getStorageSync('NAME') + " 导出全部 " + dateFormat("YYYYmmdd HH-MM-SS", new Date())
							//保存数据
							let arr = []
							data.forEach(val => {
								val.isFlag = val.isFlag + ""
								val.worksheetData.forEach(item => {
									if(item.score=='0'){
										item.type='1'
									}
									if(item.norm_row_id!=''&&val.isFlag==2){
										arr.push(item.norm_row_id)
									}
								})
							})
							let indes = 0;
							let inde = 0;
							//查询是否存在整改数据
							data.forEach(item => {
								inde += item.worksheetData.length;
								selectSQL("local"," SELECT tb_task_detail.taskdetail_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id where tb_task_detail.task_id = '"+item.worksheetData[0].task_id+"' and tb_task_detail.user_id = tb_task.user_id",task_detailId=>{
									let row = ""
									arr.forEach(entry => {
										row += "'" + entry +"',"
									})
									row = "in (" + row.substring(0, row.length - 1) + ")"
									selectSQL("local","select * from (SELECT * from( SELECT tb_task.star_time, tb_task.end_time, tb_task_detail.name, tb_task_detail.phone, tb_task_detail.phone1, tb_task_detail.username, tb_task_detail_checkrow.norm_row_id, tb_task_detail_checkrow.updatetime, ''as name2,'' as phone2 FROM tb_group_report INNER JOIN tb_task ON tb_group_report.task_id = tb_task.task_id AND againtaskid LIKE '%"+task_detailId[0].taskdetail_id+"%' LEFT JOIN ( SELECT t1.*, t2.username, t2.phone FROM ( SELECT tb_task_detail.*, sys_user.name, sys_user.phone AS phone1 FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id) t1, ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t2 WHERE t1.taskdetail_id = t2.taskdetail_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail_checkrow.norm_row_id "+row+" ) t UNION SELECT '' as star_time, '' asend_time, '' asname, '' asphone, '' asphone1, '' asusername, '' asnorm_row_id, '' asupdatetime, sys_user.name as name2,sys_user.phone as phone2 from tb_task LEFT JOIN sys_user on tb_task.user_id = sys_user.user_id WHERE task_id ='"+item.worksheetData[0].task_id+"' )cc where 1=1", taskData => {
										let rectifyInspectors = ""
										let group = ""
										let normIdData = []
										taskData.forEach(item=>{
											normIdData.push(item.norm_row_id)
										})
										let normIdDatas =  refrain(normIdData)
										for (var i = taskData.length - 1; i >= 0; i--) {
										       if(taskData[i].phone1!=null&&normIdDatas.indexOf(taskData[i].norm_row_id)!=-1){
										       	taskData.splice(i,1)
										       }
										    }
											taskData.forEach(key=>{
												if(key.star_time==''&&key.end_time==''){
													rectifyInspectors = key.name2 +"/" +key.phone2
												}
												if(key.name!=''&&key.phone1!=''){
													group = key.name +"/" +key.phone1
												}
											})
											item.worksheetData.forEach(val => {
													if(item.isFlag==2){
														indes += 1
														//整改备注
														val.rectifyRemarks =val.correctremark
														//整改措施
														val.rectifyAction =""
														//整改人员
														val.rectifyPerson =val.inspectors
														//整改负责人
														val.rectifyInspectors =rectifyInspectors
														//整改期限
														val.rectifyTime =val.startTime +" " +val.endTime
														//整改要求
														val.rectifyReform =val.correct
														//组长/检察员/开始结束时间/检查时间
														val.group =group
														if(val.group == ("null/null")){
															val.group = ""
														}
														//组长/检察员/开始结束时间/检查时间
														taskData.forEach(entry => {
																if (val.norm_row_id == entry.norm_row_id) {
																		val.startTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.star_time)))
																		val.endTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.end_time)))
																		val.inspectors =entry.username +"/" +entry.phone
																		val.inspectionTime =dateFormat("YYYY-mm-dd HH:MM",new Date(parseFloat(entry.updatetime)))
																}
														})
														if (inde ==indes) {
															//判断是否是需要整改的数据
															importData(data, file, fileName, res => {
																//是否保存图片
																if (checkpic == "是") {
																	if (issueImage1.length != 0||issueImage.length != 0) {
																		//复制正常图片开始
																		saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																					//复制整改图片开始
																					saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																								resolve(res)
																					})
																			})
																	} else {
																		resolve(res)
																	}
																} else {
																	resolve(res)
																}
															})
														}
													}else{
														indes += 1
														if (inde ==indes) {
															//判断是否是需要整改的数据
															importData(data, file, fileName, res => {
																//是否保存图片
																if (checkpic == "是") {
																	if (issueImage1.length != 0||issueImage.length != 0) {
																		//复制正常图片开始
																		saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																					//复制整改图片开始
																					saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																								resolve(	res)
																					})
																			})
																	} else {
																		resolve(res)
																	}
																} else {
																	resolve(res)
																}
															})
														}
													}
												})
										})
								})
							})
					})
				})
			})
		} else {
			let unitIn = ''
			if (obj.unit.length != 0) {
				obj.unit.forEach(item => {
					unitIn += "'" + item + "',"
				})
				unitIn = "tb_task.unit_id IN ( " + unitIn.substring(0, unitIn.length - 1) + ")"
			} else {
				unitIn = "1=1"
			}
			let userIn = ""
			let userIn1 = ''
			let userIn2 = ''
			userIn1 = "tb_task_detail.user_id IN ('" + uid + "')"
			userIn2 = "tb_task_detail.group_id IN ('" + uid + "')"
			let excelIn = ''
			excelIn = "1=1"
			let taskIn = ''
			if (obj.task.length != 0) {
				obj.task.forEach(item => {
					taskIn += "'" + item + "',"
				})
				taskIn = "tb_task.task_id IN (" + taskIn.substring(0, taskIn.length - 1) + ")"
			} else {
				taskIn = "1=1"
			}
			if (checktype == "全部数据") {
				sql ="select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture,  tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid  LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +" AND " + time +"  )  where smallCategory is not null   order by  majorCategory ASC,serial ASC ,questionItem ASC"
			} else {
				sql ="select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid and tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +
					userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +
					" AND " + time +
					" union  SELECT tb_task.task_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' as status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' as correct, '' as correctremark, '' as correctpicture, tb_task_detail_norm_detail.updatetime as inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid, '' as norm_row_id,tb_task_detail_norm.name FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE (" +
					userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " + unitIn +
					" AND " + time +
					")  where smallCategory is not null and type = '3' order by  majorCategory ASC,serial ASC ,questionItem ASC"
			}
			selectSQL("local", sql, res => {
				let taskID =[]
				res.forEach(entry=>{
					taskID.push(entry.task_id)
				})
				taskID=   Array.from(new Set(taskID))
				let mm = ''
				taskID.forEach(entry=>{
					mm+="'"+entry+"',"
				})
				mm = mm.substring(0,mm.length-1)
				selectSQL("local","SELECT tb_task_detail.task_id, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id WHERE groupPhone != '' AND tb_task_detail.task_id IN ("+mm+") GROUP BY tb_task_detail.task_id",ct=>{ 
					let taskList = res
						if (taskList.length == 0) {
							resolve("isFlag")
							return
						}
						let countTaskNum =
							"SELECT tb_task.task_id, tb_task.task_name AS taskName,tb_task.type  FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + excelIn + " AND " + taskIn + " AND " +unitIn + " AND " + time +" group by tb_task.task_id"
						//查询任务数
						let data = []
						selectSQL("local", countTaskNum, resName => {
								//问题图片路径
								let issueImage = []
								let issueImage1 = []
								let taskName = ""
								let taskArr = []
								taskList = taskList.filter(item => item.type !== "");
								taskList.forEach((item) => {
									taskArr.push(item.tasknormdetailid)
								})
								let countedNames = taskArr.reduce(function(obj, name) {
									obj[name] = obj[name] ? ++obj[name] : 1;
									return obj;
								}, {});
								for (let ket in countedNames) {
									let count = countedNames[ket]
									if (count != 1) {
										for (let index = taskList.length - 1; index >= 0; index--) {
											if (taskList[index].tasknormdetailid == ket && taskList[index]
												.questionItem == "") {
												taskList.splice(index, 1);
											}
										}
									}
								}
								resName.forEach(item => {
									let worksheetData = []
									taskList.forEach(entry => {
										if (item.task_id == entry.task_id) {
											if (entry.type == "1") {
												//entry.questionItem = ''
											} else {
												if (entry.questionItem != null) {
													entry.questionItem = entry.questionItem
														.replace("<", '小于')
												}
											}
											entry.startTime = dateFormat("YYYY-mm-dd",
												new Date(parseFloat(entry.startTime)))
											entry.endTime = dateFormat("YYYY-mm-dd",
												new Date(parseFloat(entry.endTime)))
											entry.inspectors = entry.username + "/" + entry
												.userphone
											if (entry.groupname != null) {
												entry.group = entry.groupname + "/" + entry
													.groupPhone
											} else {
												entry.group = ''
											}
											entry.inspectionTime = dateFormat(
												"YYYY-mm-dd HH:MM", new Date(parseFloat(
													entry.inspectionTime)))
											worksheetData.push(entry)
										}
									})
									if (item.type == 3) item.type = 1
									taskName += item.taskName + ","
									data.push({
										worksheet: item.taskName,
										isFlag: item.type,
										worksheetData: worksheetData
									})
								})
								let fileName = "全部任务 " + dateFormat("mmdd HH-MM-SS", new Date()) + " " +checktype + ".xlsx"
								data.forEach(item => {
									if(item.isFlag==2){
										item.worksheetData.forEach(entry => {
											entry.id = item.worksheetData.indexOf(entry) + 1
											if (entry.unitChildName == null) {
												entry.unitChildName = ""
											}
											if (entry.correctpicture != "" && checkpic == "是") {
												let imgprefex = ""
												let imgprefex1 = ""
												if (item.serial == "") {
													if (isNumber(entry.questionItem.substring(0,1))) {
														imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
														imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
													} else {
														imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
														imgprefex1 = entry.id + "_" + entry.id
													}
												} else {
													if (isNumber(entry.questionItem.substring(0,1))) {
														imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
														imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
													} else {
														imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
														imgprefex1 = entry.serial + "_" + entry.id
													}
												}
												let varr = ""
												entry.correctpicture.split(",").forEach(val=>{
													varr+=val+"/"+entry.name+","
												})
												entry.correctpicture = varr.substring(0,varr.length-1)
												issueImage1.push(imgprefex + "/" + entry.task_id + "/" + entry.correctpicture)
												let arr = entry.correctpicture.split(",")
												let img = ""
												let inde = 0
												arr.forEach(val => {
													inde += 1
													img += entry.name+": "+imgprefex1 + "_图片" + inde +"_整改.png" + ","
												})
												entry.rectifyImage = img.substring(0, img.length -1)
											} else {
												entry.rectifyImage = ''
											}
											if (entry.issueImage != "" && checkpic == "是") {
												let imgprefex = ""
												let imgprefex1 = ""
												if (item.serial == "") {
													if (isNumber(entry.questionItem.substring(0,1))) {
														imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
														imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
													} else {
														imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
														imgprefex1 = entry.id + "_" + entry.id
													}
												} else {
													if (isNumber(entry.questionItem.substring(0,1))) {
														imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
														imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
													} else {
														imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
														imgprefex1 = entry.serial + "_" + entry.id
													}
												}
												let varr = ""
												entry.issueImage.split(",").forEach(val=>{
													varr+=val+"/"+entry.name+","
												})
												entry.issueImage = varr.substring(0,varr.length-1)
												issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
												let arr = entry.issueImage.split(",")
												let img = ""
												let inde = 0
												arr.forEach(val => {
													inde += 1
													img += entry.name+": "+imgprefex1 + "_图片" + inde +".png" + ","
												})
												entry.issueImage = img.substring(0, img.length -1)
											} else {
												entry.issueImage = ''
											}
										})
									}else{
										item.worksheetData.forEach(entry => {
											entry.id = item.worksheetData.indexOf(entry) + 1
											if (entry.unitChildName == null) {
												entry.unitChildName = ""
											}
											if (entry.issueImage != "" && checkpic == "是") {
												let imgprefex = ""
												let imgprefex1 = ""
												if (item.serial == "") {
													if (isNumber(entry.questionItem.substring(0,1))) {
														imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
														imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
													} else {
														imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
														imgprefex1 = entry.id + "_" + entry.id
													}
												} else {
													if (isNumber(entry.questionItem.substring(0,1))) {
														imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
														imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
													} else {
														imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
														imgprefex1 = entry.serial + "_" + entry.id
													}
												}
												let varr = ""
												entry.issueImage.split(",").forEach(val=>{
													varr+=val+"/"+entry.name+","
												})
												entry.issueImage = varr.substring(0,varr.length-1)
												issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
												let arr = entry.issueImage.split(",")
												let img = ""
												let inde = 0
												arr.forEach(val => {
													inde += 1
													img += entry.name+": "+ imgprefex1 + "_图片" + inde +".png" + ","
												})
												entry.issueImage = img.substring(0, img.length -1)
											} else {
												entry.issueImage = ''
											}
										})
									}
								})
								data.forEach(val => {
									val.isFlag = val.isFlag + ""
								})
								for (let i = data.length - 1; i >= 0; i--) {
									if (data[i].worksheetData.length == 0) {
										data.splice(i, 1)
									}
								}
								//保存数据
								let file = "导出数据/" + uni.getStorageSync('NAME') + " 导出全部 " + dateFormat("YYYYmmdd HH-MM-SS", new Date())
								//保存数据
								let arr = []
								data.forEach(val => {
									val.isFlag = val.isFlag + ""
									val.worksheetData.forEach(item => {
										if(item.score=='0'){
											item.type='1'
										}
										if(item.norm_row_id!=''&&val.isFlag==2){
											arr.push(item.norm_row_id)
										}
									})
								})
								let indes = 0;
								let inde = 0;
								ct.forEach(val=>{
									let groupName = val.groupname+"/"+val.groupPhone
									data.forEach(entry=>{
										entry.worksheetData.forEach(valw=>{
											if(val.task_id== valw.task_id&&valw.type == '1'){
												entry.worksheetData.forEach(c=>{
													c.group = groupName
												})
											}
										})
									})
								})
								//查询是否存在整改数据
								data.forEach(item => {
									inde += item.worksheetData.length;
									selectSQL("local"," SELECT tb_task_detail.taskdetail_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id where tb_task_detail.task_id = '"+item.worksheetData[0].task_id+"' and tb_task_detail.user_id = tb_task.user_id",task_detailId=>{
										let row = ""
										arr.forEach(entry => {
											row += "'" + entry +"',"
										})
										row = "in (" + row.substring(0, row.length - 1) + ")"
										selectSQL("local","select * from (SELECT * from( SELECT tb_task.star_time, tb_task.end_time, tb_task_detail.name, tb_task_detail.phone, tb_task_detail.phone1, tb_task_detail.username, tb_task_detail_checkrow.norm_row_id, tb_task_detail_checkrow.updatetime, ''as name2,'' as phone2 FROM tb_group_report INNER JOIN tb_task ON tb_group_report.task_id = tb_task.task_id AND againtaskid LIKE '%"+task_detailId[0].taskdetail_id+"%' LEFT JOIN ( SELECT t1.*, t2.username, t2.phone FROM ( SELECT tb_task_detail.*, sys_user.name, sys_user.phone AS phone1 FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id) t1, ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t2 WHERE t1.taskdetail_id = t2.taskdetail_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail_checkrow.norm_row_id "+row+" ) t UNION SELECT '' as star_time, '' asend_time, '' asname, '' asphone, '' asphone1, '' asusername, '' asnorm_row_id, '' asupdatetime, sys_user.name as name2,sys_user.phone as phone2 from tb_task LEFT JOIN sys_user on tb_task.user_id = sys_user.user_id WHERE task_id ='"+item.worksheetData[0].task_id+"' )cc where 1=1", taskData => {
											let rectifyInspectors = ""
											let group = ""
											let normIdData = []
											taskData.forEach(item=>{
												normIdData.push(item.norm_row_id)
											})
											let normIdDatas =  refrain(normIdData)
											for (var i = taskData.length - 1; i >= 0; i--) {
											       if(taskData[i].phone1!=null&&normIdDatas.indexOf(taskData[i].norm_row_id)!=-1){
											       	taskData.splice(i,1)
											       }
											    }
												taskData.forEach(key=>{
													if(key.star_time==''&&key.end_time==''){
														rectifyInspectors = key.name2 +"/" +key.phone2
													}
													if(key.name!=''&&key.phone1!=''){
														group = key.name +"/" +key.phone1
													}
												})
												item.worksheetData.forEach(val => {
														if(item.isFlag==2){
															indes += 1
															//整改备注
															val.rectifyRemarks =val.correctremark
															//整改措施
															val.rectifyAction =""
															//整改人员
															val.rectifyPerson =val.inspectors
															//整改负责人
															val.rectifyInspectors =rectifyInspectors
															//整改期限
															val.rectifyTime =val.startTime +" " +val.endTime
															//整改要求
															val.rectifyReform =val.correct
															//组长/检察员/开始结束时间/检查时间
															val.group =group
															if(val.group == ("null/null")){
																val.group = ""
															}
															//组长/检察员/开始结束时间/检查时间
															taskData.forEach(entry => {
																	if (val.norm_row_id == entry.norm_row_id) {
																			val.startTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.star_time)))
																			val.endTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.end_time)))
																			val.inspectors =entry.username +"/" +entry.phone
																			val.inspectionTime =dateFormat("YYYY-mm-dd HH:MM",new Date(parseFloat(entry.updatetime)))
																	}
															})
															if (inde ==indes) {
																//判断是否是需要整改的数据
																importData(data, file, fileName, res => {
																	//是否保存图片
																	if (checkpic == "是") {
																		if (issueImage1.length != 0||issueImage.length != 0) {
																			//复制正常图片开始
																			saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																						//复制整改图片开始
																						saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																									resolve(	res)
																						})
																				})
																		} else {
																			resolve(res)
																		}
																	} else {
																		resolve(res)
																	}
																})
															}
														}else{
															indes += 1
															if (inde ==indes) {
																//判断是否是需要整改的数据
																importData(data, file, fileName, res => {
																	//是否保存图片
																	if (checkpic == "是") {
																		if (issueImage1.length != 0||issueImage.length != 0) {
																			//复制正常图片开始
																			saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																						//复制整改图片开始
																						saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																									resolve(	res)
																						})
																				})
																		} else {
																			resolve(res)
																		}
																	} else {
																		resolve(res)
																	}
																})
															}
														}
													})
											})
									})
								})
							})
					
				})
			})
		}
	})
}

function selectTaskUserSync(data,taskData){
	return new Promise(resolve=>{
		selectTaskUser(data,taskData,callback=>{
			resolve(callback)
		})
	})
}

 async function selectTaskUser(data,taskData,callback){
	 let index = 0;
	 for (let i = 0; i < taskData.length; i++) {
	        await selectSQLSync(taskData[i].task_id,res=>{
				index+=1
					if(res!=null){
						res.forEach(val=>{
							data.forEach(entry=>{
							if(entry.task_id == val.task_id && entry.norm_row_id==val.norm_row_id){
								entry.username = val.user
								entry.userphone = val.phone
								entry.inspectionTime = val.updatetime
							}
						})
					})
				}
				if(index==taskData.length){
					callback(data)
				}
			})
	    }
}

/**
 * 异步读取数据
 * @param {Object} taskId
 */
function selectSQLSync(taskId,cllback){
	selectSQL("local","SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id,tb_task_detail.task_id,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN( SELECT tb_task_detail.*, sys_user.name, sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND tb_task.task_id = '"+taskId+"'",res=>{
		cllback(res);
	})
}


/**
 * 导出单个任务的数据
 * 是否导出图片:isFlag:1导出图片,2不导出图片
 * 全部数据/问题数据(分权限)status:1全部数据,2问题数据
 * @param {Object} taskId
 */
export function importUserToTask(taskNames, taskId, isFlag, status) {
	let userId = uni.getStorageSync('USER_ID')
	let functionid = uni.getStorageSync('functionid')
	let checktype = ""
	if (status == 1) {
		checktype = "全部数据"
	} else {
		checktype = "问题数据"
	}
	let sql = ""
	return new Promise(resolve => {
		if (functionid == 1) {
			//查询当前上报的过数据的人员
			selectSQL("local",
				"SELECT tb_task_detail.user_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE tb_task.task_id = '" +
				taskId + "' ", userRes => {
					let userIn1 = "1=1"
					let userIn2 = "1=1"
					let taskIn = "tb_task.task_id = ('" + taskId + "')"
					if (status == 1) {
						sql ="select * from (select * from ( select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid ,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid  LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn +"   order by  majorCategory ASC,serial ASC ,questionItem ASC)  where smallCategory is not null  )e LEFT JOIN( SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id as norm_row_idr,tb_task_detail_checkrow.updatetime  FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name,sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND " + taskIn +" ) r on e.norm_row_id = r.norm_row_idr )t union all select * from (select * from ( select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid ,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid  LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn +"   order by  majorCategory ASC,serial ASC ,questionItem ASC)  where smallCategory is not null  )e LEFT JOIN( SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id as norm_row_idr,tb_task_detail_checkrow.updatetime  FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name,sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND " + taskIn +" ) r on e.norm_row_id = r.norm_row_idr )y order by  majorCategory ASC,serial ASC ,questionItem ASC" 
					} else {
												sql ="select * from ( select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id  LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id  LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid and tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn +" union  SELECT tb_task.task_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' as status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' as correct, '' as correctremark, '' as correctpicture, tb_task_detail_norm_detail.updatetime as inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid , '' as norm_row_id,tb_task_detail_norm.name  FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id  LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id  LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + taskIn +"  ORDER BY serial ASC ,questionItem ASC )  where smallCategory is not null and type = '3' group by norm_row_id ) e LEFT JOIN( SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id as norm_row_idr,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name,sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND " + taskIn +" ) r on e.norm_row_id = r.norm_row_idr where 1=1 order by  majorCategory ASC,serial ASC ,questionItem ASC"
					}
					selectSQL("local", sql, res => {
						let taskList = res
						if (taskList.length == 0) {
							resolve("isFlag")
							return
						}
						let countTaskNum =
							"SELECT tb_task.task_id, tb_task.task_name AS taskName,tb_task.type  FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +
							userIn1 + " OR " + userIn2 + ") AND  " + taskIn +
							"   group by tb_task.task_id"
						//查询任务数
						let data = []
						selectSQL("local", countTaskNum, resName => {
							res.forEach(item=>{
								if(item.user!=null){
									item.username=item.user
									item.userphone=item.phone
									item.inspectionTime=item.updatetime
								}
							})
							//问题图片路径
							let issueImage = []
							let issueImage1 = []
							let taskName = ""
							let taskArr = []
							taskList = taskList.filter(item => item.type !== "");
							taskList.forEach((item) => {
								taskArr.push(item.tasknormdetailid)
							})
							let countedNames = taskArr.reduce(function(obj, name) {
								obj[name] = obj[name] ? ++obj[name] : 1;
								return obj;
							}, {});
							for (let ket in countedNames) {
								let count = countedNames[ket]
								if (count != 1) {
									for (let index = taskList.length - 1; index >=
										0; index--) {
										if (taskList[index].tasknormdetailid == ket &&
											taskList[index]
											.questionItem == "") {
											taskList.splice(index, 1);
										}
									}
								}
							}
							resName.forEach(item => {
								let worksheetData = []
								taskList.forEach(entry => {
									if (item.task_id == entry.task_id) {
										if (entry.type == "1") {
											//entry.questionItem = ''
										} else {
											if (entry.questionItem !=
												null) {
												entry.questionItem = entry
													.questionItem
													.replace("<", '小于')
											}
										}
										entry.startTime = dateFormat(
											"YYYY-mm-dd",
											new Date(parseFloat(entry
												.startTime)))
										entry.endTime = dateFormat(
											"YYYY-mm-dd",
											new Date(parseFloat(entry
												.endTime)))
										entry.inspectors = entry.username +
											"/" + entry
											.userphone
										if (entry.groupname != null) {
											entry.group = entry.groupname +"/" + entry.groupPhone
										} else {
											entry.group = ''
										}
										entry.inspectionTime = dateFormat(
											"YYYY-mm-dd HH:MM",
											new Date(parseFloat(
												entry.inspectionTime
											)))
										worksheetData.push(entry)
									}
								})
								if (item.type == 3) item.type = 1
								taskName += item.taskName + ","
								data.push({
									worksheet: item.taskName,
									isFlag: item.type,
									worksheetData: worksheetData
								})
							})
							let fileName = taskNames + "-" + checktype + "." + "xlsx"
							data.forEach(item => {
								if(item.isFlag==2){
									item.worksheetData.forEach(entry => {
										entry.id = item.worksheetData.indexOf(entry) + 1
										if (entry.unitChildName == null) {
											entry.unitChildName = ""
										}
										if (entry.correctpicture != "") {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.correctpicture.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.correctpicture = varr.substring(0,varr.length-1)
											issueImage1.push(imgprefex + "/" + entry.task_id + "/" + entry.correctpicture)
											let arr = entry.correctpicture.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+imgprefex1 + "_图片" + inde +"_整改.png" + ","
											})
											entry.rectifyImage = img.substring(0, img.length -1)
										} else {
											entry.rectifyImage = ''
										}
										if (entry.issueImage != "") {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.issueImage.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.issueImage = varr.substring(0,varr.length-1)
											issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
											let arr = entry.issueImage.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+imgprefex1 + "_图片" + inde +".png" + ","
											})
											entry.issueImage = img.substring(0, img.length -1)
										} else {
											entry.issueImage = ''
										}
									})
								}else{
									item.worksheetData.forEach(entry => {
										entry.id = item.worksheetData.indexOf(entry) + 1
										if (entry.unitChildName == null) {
											entry.unitChildName = ""
										}
										if (entry.issueImage != "") {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.issueImage.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.issueImage = varr.substring(0,varr.length-1)
											issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
											let arr = entry.issueImage.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+ imgprefex1 + "_图片" + inde +".png" + ","
											})
											entry.issueImage = img.substring(0, img.length -1)
										} else {
											entry.issueImage = ''
										}
									})
								}
							})
							//保存数据
							let arr = []
							let groupcc = '';
							data.forEach(val => {
								val.isFlag = val.isFlag + ""
								val.worksheetData.forEach(item => {
									if(item.group=="null/null"){
										item.group=''
									}else if (item.group == ""){
										item.group = groupcc
									}else{
										groupcc = item.group 
									}
									if(item.score=='0'){
										item.type='1'
									}
									arr.push(item.norm_row_id)
								})
							})
							data.forEach(val => {
								let names =""
								val.worksheetData.forEach(item => {
									if(item.group!=''){
										names=item.group
									}
								})
								val.worksheetData.forEach(item => {
									item.group = names
								})
							})
							let indes = 0;
							let inde = 0;
							//查询是否存在整改数据
							data.forEach(item => {
								let inde = item.worksheetData.length;
								if (item.isFlag == 2) {
									selectSQL("local"," SELECT tb_task_detail.taskdetail_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id where tb_task_detail.task_id = '"+item.worksheetData[0].task_id+"' and tb_task_detail.user_id = tb_task.user_id",task_detailId=>{
										let row = ""
										arr.forEach(entry => {
											row += "'" + entry + "',"
										})
										row = "in (" + row.substring(0, row.length -1) + ")"
										selectSQL("local","select * from (SELECT * from( SELECT tb_task.star_time, tb_task.end_time, tb_task_detail.name, tb_task_detail.phone, tb_task_detail.phone1, tb_task_detail.username, tb_task_detail_checkrow.norm_row_id, tb_task_detail_checkrow.updatetime, ''as name2,'' as phone2 FROM tb_group_report INNER JOIN tb_task ON tb_group_report.task_id = tb_task.task_id AND againtaskid LIKE '%"+task_detailId[0].taskdetail_id+"%' LEFT JOIN ( SELECT t1.*, t2.username, t2.phone FROM ( SELECT tb_task_detail.*, sys_user.name, sys_user.phone AS phone1 FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id) t1, ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t2 WHERE t1.taskdetail_id = t2.taskdetail_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail_checkrow.norm_row_id "+row+" ) t UNION SELECT '' as star_time, '' asend_time, '' asname, '' asphone, '' asphone1, '' asusername, '' asnorm_row_id, '' asupdatetime, sys_user.name as name2,sys_user.phone as phone2 from tb_task LEFT JOIN sys_user on tb_task.user_id = sys_user.user_id WHERE task_id ='"+item.worksheetData[0].task_id+"' )cc where 1=1 ", taskData => {
											let rectifyInspectors = ""
											let group = ""
											let normIdData = []
											taskData.forEach(item=>{
												normIdData.push(item.norm_row_id)
											})
											let normIdDatas =  refrain(normIdData)
											for (var i = taskData.length - 1; i >= 0; i--) {
											       if(taskData[i].phone1!=null&&normIdDatas.indexOf(taskData[i].norm_row_id)!=-1){
											       	taskData.splice(i,1)
											       }
											    }
												taskData.forEach(key=>{
													if(key.star_time==''&&key.end_time==''){
														rectifyInspectors = key.name2 +"/" +key.phone2
													}
													if(key.name!=''&&key.phone1!=''){
														group = key.name +"/" +key.phone1
													}
												})
												item.worksheetData.forEach(val => {
													indes += 1
													//整改备注
													val.rectifyRemarks =val.correctremark
													//整改措施
													val.rectifyAction =""
													//整改人员
													val.rectifyPerson =val.inspectors
													//整改负责人
													val.rectifyInspectors =rectifyInspectors
													//整改期限
													val.rectifyTime =val.startTime +" " +val.endTime
													//整改要求
													val.rectifyReform =val.correct
													//组长/检察员/开始结束时间/检查时间
													val.group =group
													if(val.group == ("null/null")){
														val.group = ""
													}
													//组长/检察员/开始结束时间/检查时间
													taskData.forEach(entry => {
															if (val.norm_row_id == entry.norm_row_id) {
																	val.startTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.star_time)))
																	val.endTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.end_time)))
																	val.inspectors =entry.username +"/" +entry.phone
																	val.inspectionTime =dateFormat("YYYY-mm-dd HH:MM",new Date(parseFloat(entry.updatetime)))
															}
													})
													if (inde == indes) {
														let file = "导出数据/" +
															taskNames +
															" " +
															dateFormat(
																"YYYYmmdd HH:MM:SS",
																new Date())
														importData(data,
															file,
															fileName,
															res => {
																//是否保存图片
																if (isFlag ==
																	1) {
																	if (issueImage
																		.length !=
																		0 ||
																		issueImage1
																		.length !=
																		0
																	) {
																		//复制正常图片开始
																		saveImage
																			(
																				fileName
																				.substring(
																					0,
																					fileName
																					.length -
																					5
																				),
																				file,
																				issueImage,
																				callback => {
																					//复制整改图片开始
																					saveImages
																						(fileName
																							.substring(
																								0,
																								fileName
																								.length -
																								5
																							),
																							file,
																							issueImage1,
																							callback => {
																								resolve
																									(
																										res
																									)
																							}
																						)
																				}
																			)
																	} else {
																		resolve
																			(
																				res
																				)
																	}
																} else {
																	resolve
																		(
																			res
																			)
																}
															})
													}
												})
											})
									})
								} else {
									item.worksheetData.forEach(val => {
										indes += 1
										if (inde == indes) {
											let file = "导出数据/" + taskNames +
												" " +
												dateFormat(
													"YYYYmmdd HH:MM:SS",
													new Date())
											importData(data, file, fileName,
												res => {
													//是否保存图片
													if (isFlag == 1) {
														if (issueImage
															.length !=
															0) {
															//复制图片开始
															saveImage(
																fileName
																.substring(
																	0,
																	fileName
																	.length -
																	5
																),
																file,
																issueImage,
																callback => {
																	//复制整改图片开始
																	saveImages
																		(
																			fileName
																			.substring(
																				0,
																				fileName
																				.length -
																				5
																			),
																			file,
																			issueImage1,
																			callback => {
																				resolve
																					(
																						res
																					)
																			}
																		)
																})
														} else {
															resolve(res)
														}
													} else {
														resolve(res)
													}
												})
										}
									})
								}
							})
						})
					})
				})
		} else if (functionid == 2) {
			//组长数据替换
			selectSQL("local",
				"select tb_task.user_id,tb_task_detail.group_id  from tb_task left join  tb_task_detail  on tb_task.task_id =  tb_task_detail.task_id where tb_task_detail.task_id = '" +
				taskId + "' group by tb_task_detail.task_id", taskuser => {
					if (taskuser[0].group_id == userId) {
						userId = taskuser[0].user_id
					}
					//查询当前上报的过数据的人员
					selectSQL("local",
						"SELECT tb_task_detail.user_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE tb_task.task_id = '" +
						taskId + "' AND tb_task_detail.status = 8", userRes => {
							let userIn11 = []
							userIn11.push(userId)
							let userIn = ""
							userIn11.forEach(item => {
								userIn += "'" + item + "',"
							})
							let userIn1 = "tb_task_detail.user_id IN (" + userIn.substring(0, userIn
								.length - 1) + ")"
							let userIn2 = "tb_task_detail.group_id IN (" + userIn.substring(0, userIn
								.length - 1) + ")"
							let taskIn = "tb_task.task_id = ('" + taskId + "')"
							if (status == 1) {
									 sql ="select * from ( select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture , tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid  LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn +"   order by  majorCategory ASC,serial ASC ,questionItem ASC)  where smallCategory is not null )e LEFT JOIN( SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id as norm_row_idr,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name,sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND " + taskIn +" ) r on e.norm_row_id = r.norm_row_idr where 1=1 order by  majorCategory ASC,serial ASC ,questionItem ASC "
							} else {
								sql ="select * from (select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid and tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn +" union  SELECT tb_task.task_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' as status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' as correct, '' as correctremark, '' as correctpicture, tb_task_detail_norm_detail.updatetime as inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid,'' as orm_row_id,tb_task_detail_norm.name FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + taskIn +" order by  majorCategory ASC,serial ASC ,questionItem ASC )  where smallCategory is not null and type = '3')e LEFT JOIN( SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id as norm_row_idr,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name,sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND " + taskIn +" ) r on e.norm_row_id = r.norm_row_idr where 1=1 order by  majorCategory ASC,serial ASC ,questionItem ASC"
							}
							selectSQL("local", sql, res => {
								let taskList = res
								if (taskList.length == 0) {
									resolve("isFlag")
									return
								}
								let countTaskNum =
									"SELECT tb_task.task_id, tb_task.task_name AS taskName,tb_task.type  FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn +"   group by tb_task.task_id"
								//查询任务数
								let data = []
								selectSQL("local", countTaskNum, resName => {
									res.forEach(item=>{
										if(item.user!=null){
											item.username=item.user
											item.userphone=item.phone
											item.inspectionTime=item.updatetime
										}
									})
									//问题图片路径
									let issueImage = []
									let issueImage1 = []
									let taskName = ""
									let taskArr = []
									taskList = taskList.filter(item => item.type !==
										"");
									taskList.forEach((item) => {
										taskArr.push(item.tasknormdetailid)
									})
									let countedNames = taskArr.reduce(function(obj,
										name) {
										obj[name] = obj[name] ? ++obj[name] : 1;
										return obj;
									}, {});
									for (let ket in countedNames) {
										let count = countedNames[ket]
										if (count != 1) {
											for (let index = taskList.length -
													1; index >= 0; index--) {
												if (taskList[index].tasknormdetailid ==
													ket && taskList[index]
													.questionItem == "") {
													taskList.splice(index, 1);
												}
											}
										}
									}
									resName.forEach(item => {
										let worksheetData = []
										taskList.forEach(entry => {
											if (item.task_id == entry
												.task_id) {
												if (entry.type == "1") {
													//entry.questionItem =''
												} else {
													if (entry
														.questionItem !=
														null) {
														entry
															.questionItem =
															entry
															.questionItem
															.replace(
																"<",
																'小于')
													}
												}
												entry.startTime =
													dateFormat(
														"YYYY-mm-dd",
														new Date(
															parseFloat(
																entry
																.startTime
															)))
												entry.endTime =
													dateFormat(
														"YYYY-mm-dd",
														new Date(
															parseFloat(
																entry
																.endTime
															)))
												entry.inspectors = entry
													.username + "/" +
													entry.userphone
												if (entry.groupname !=
													null) {
													entry.group = entry
														.groupname +
														"/" + entry
														.groupPhone
												} else {
													entry.group = ''
												}
												entry.inspectionTime =
													dateFormat(
														"YYYY-mm-dd HH:MM",
														new Date(
															parseFloat(
																entry
																.inspectionTime
															)))
												worksheetData.push(
													entry)
											}
										})
										if (item.type == 3) item.type = 1
										taskName += item.taskName + ","
										data.push({
											worksheet: item.taskName,
											isFlag: item.type,
											worksheetData: worksheetData
										})
									})
									let fileName = taskNames + "-" + checktype + "." + "xlsx"
									//图片处理
									data.forEach(item => {
										if(item.isFlag==2){
											item.worksheetData.forEach(entry => {
												entry.id = item.worksheetData.indexOf(entry) + 1
												if (entry.unitChildName == null) {
													entry.unitChildName = ""
												}
												if (entry.correctpicture != "" && isFlag==1) {
													let imgprefex = ""
													let imgprefex1 = ""
													if (item.serial == "") {
														if (isNumber(entry.questionItem.substring(0,1))) {
															imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
															imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
														} else {
															imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
															imgprefex1 = entry.id + "_" + entry.id
														}
													} else {
														if (isNumber(entry.questionItem.substring(0,1))) {
															imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
															imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
														} else {
															imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
															imgprefex1 = entry.serial + "_" + entry.id
														}
													}
													let varr = ""
													entry.correctpicture.split(",").forEach(val=>{
														varr+=val+"/"+entry.name+","
													})
													entry.correctpicture = varr.substring(0,varr.length-1)
													issueImage1.push(imgprefex + "/" + entry.task_id + "/" + entry.correctpicture)
													let arr = entry.correctpicture.split(",")
													let img = ""
													let inde = 0
													arr.forEach(val => {
														inde += 1
														img += entry.name+": "+imgprefex1 + "_图片" + inde +"_整改.png" + ","
													})
													entry.rectifyImage = img.substring(0, img.length -1)
												} else {
													entry.rectifyImage = ''
												}
												if (entry.issueImage != "" && isFlag==1) {
													let imgprefex = ""
													let imgprefex1 = ""
													if (item.serial == "") {
														if (isNumber(entry.questionItem.substring(0,1))) {
															imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
															imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
														} else {
															imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
															imgprefex1 = entry.id + "_" + entry.id
														}
													} else {
														if (isNumber(entry.questionItem.substring(0,1))) {
															imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
															imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
														} else {
															imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
															imgprefex1 = entry.serial + "_" + entry.id
														}
													}
													let varr = ""
													entry.issueImage.split(",").forEach(val=>{
														varr+=val+"/"+entry.name+","
													})
													entry.issueImage = varr.substring(0,varr.length-1)
													issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
													let arr = entry.issueImage.split(",")
													let img = ""
													let inde = 0
													arr.forEach(val => {
														inde += 1
														img += entry.name+": "+imgprefex1 + "_图片" + inde +".png" + ","
													})
													entry.issueImage = img.substring(0, img.length -1)
												} else {
													entry.issueImage = ''
												}
											})
										}else{
											item.worksheetData.forEach(entry => {
												entry.id = item.worksheetData.indexOf(entry) + 1
												if (entry.unitChildName == null) {
													entry.unitChildName = ""
												}
												if (entry.issueImage != "" && isFlag==1) {
													let imgprefex = ""
													let imgprefex1 = ""
													if (item.serial == "") {
														if (isNumber(entry.questionItem.substring(0,1))) {
															imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
															imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
														} else {
															imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
															imgprefex1 = entry.id + "_" + entry.id
														}
													} else {
														if (isNumber(entry.questionItem.substring(0,1))) {
															imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
															imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
														} else {
															imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
															imgprefex1 = entry.serial + "_" + entry.id
														}
													}
													let varr = ""
													entry.issueImage.split(",").forEach(val=>{
														varr+=val+"/"+entry.name+","
													})
													entry.issueImage = varr.substring(0,varr.length-1)
													issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
													let arr = entry.issueImage.split(",")
													let img = ""
													let inde = 0
													arr.forEach(val => {
														inde += 1
														img += entry.name+": "+ imgprefex1 + "_图片" + inde +".png" + ","
													})
													entry.issueImage = img.substring(0, img.length -1)
												} else {
													entry.issueImage = ''
												}
											})
										}
									})
									//保存数据
									let arr = []
									data.forEach(val => {
										val.isFlag = val.isFlag + ""
										val.worksheetData.forEach(item => {
											if(item.score=='0'){
												item.type='1'
											}
											if(val.isFlag=='2'&&item.norm_row_id!=null){
												arr.push(item.norm_row_id)
											}
										})
									})
									let indes = 0;
									let inde = 0;
									//查询是否存在整改数据
									data.forEach(item => {
										let inde = item.worksheetData.length;
										if (item.isFlag == 2) {
											selectSQL("local"," SELECT tb_task_detail.taskdetail_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id where tb_task_detail.task_id = '"+item.worksheetData[0].task_id+"' and tb_task_detail.user_id = tb_task.user_id",task_detailId=>{
												let row = ""
												arr.forEach(entry => {
													row += "'" + entry +"',"
												})
												row = "in (" + row.substring(0, row.length - 1) + ")"
												selectSQL("local","select * from (SELECT * from( SELECT tb_task.star_time, tb_task.end_time, tb_task_detail.name, tb_task_detail.phone, tb_task_detail.phone1, tb_task_detail.username, tb_task_detail_checkrow.norm_row_id, tb_task_detail_checkrow.updatetime, ''as name2,'' as phone2 FROM tb_group_report INNER JOIN tb_task ON tb_group_report.task_id = tb_task.task_id AND againtaskid LIKE '%"+task_detailId[0].taskdetail_id+"%' LEFT JOIN ( SELECT t1.*, t2.username, t2.phone FROM ( SELECT tb_task_detail.*, sys_user.name, sys_user.phone AS phone1 FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id) t1, ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t2 WHERE t1.taskdetail_id = t2.taskdetail_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail_checkrow.norm_row_id "+row+" ) t UNION SELECT '' as star_time, '' asend_time, '' asname, '' asphone, '' asphone1, '' asusername, '' asnorm_row_id, '' asupdatetime, sys_user.name as name2,sys_user.phone as phone2 from tb_task LEFT JOIN sys_user on tb_task.user_id = sys_user.user_id WHERE task_id ='"+item.worksheetData[0].task_id+"' )cc where 1=1", taskData => {
													let rectifyInspectors = ""
													let group = ""
													let normIdData = []
													taskData.forEach(item=>{
														normIdData.push(item.norm_row_id)
													})
													let normIdDatas =  refrain(normIdData)
													for (var i = taskData.length - 1; i >= 0; i--) {
													       if(taskData[i].phone1!=null&&normIdDatas.indexOf(taskData[i].norm_row_id)!=-1){
													       	taskData.splice(i,1)
													       }
													    }
														taskData.forEach(key=>{
															if(key.star_time==''&&key.end_time==''){
																rectifyInspectors = key.name2 +"/" +key.phone2
															}
															if(key.name!=''&&key.phone1!=''){
																group = key.name +"/" +key.phone1
															}
														})
														item.worksheetData.forEach(val => {
																indes += 1
																//整改备注
																val.rectifyRemarks =val.correctremark
																//整改措施
																val.rectifyAction =""
																//整改人员
																val.rectifyPerson =val.inspectors
																//整改负责人
																val.rectifyInspectors =rectifyInspectors
																//整改期限
																val.rectifyTime =val.startTime +" " +val.endTime
																//整改要求
																val.rectifyReform =val.correct
																//组长/检察员/开始结束时间/检查时间
																val.group =group
																if(val.group == ("null/null")){
																	val.group = ""
																}
																//组长/检察员/开始结束时间/检查时间
																taskData.forEach(entry => {
																		if (val.norm_row_id == entry.norm_row_id) {
																				val.startTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.star_time)))
																				val.endTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.end_time)))
																				val.inspectors =entry.username +"/" +entry.phone
																				val.inspectionTime =dateFormat("YYYY-mm-dd HH:MM",new Date(parseFloat(entry.updatetime)))
																		}
																})
																if (inde ==indes) {
																	let file ="导出数据/" +taskNames +" " +dateFormat("YYYYmmdd HH:MM:SS",new Date())
																	importData(data,file,fileName,res => {
																				//是否保存图片
																				if (isFlag ==1) {
																					if (issueImage.length !=0 ||issueImage1.length !=0) {
																						//复制正常图片开始
																						saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																									//复制整改图片开始
																									saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																												resolve(	res)
																									})
																						})
																					} else {
																						resolve(res)
																					}
																				} else {
																					resolve(res)
																				}
																			}
																		)
																}
															})
													})
											})
										} else {
											item.worksheetData.forEach(val => {
												indes += 1
												if (inde == indes) {
													let file = "导出数据/" +
														taskNames +
														" " +
														dateFormat(
															"YYYYmmdd HH:MM:SS",
															new Date())
													importData(data,
														file,
														fileName,
														res => {
															//是否保存图片
															if (isFlag ==
																1) {
																if (issueImage
																	.length !=
																	0
																) {
																	//复制图片开始
																	saveImage
																		(fileName
																			.substring(
																				0,
																				fileName
																				.length -
																				5
																			),
																			file,
																			issueImage,
																			callback => {
																				//复制整改图片开始
																				saveImages
																					(fileName
																						.substring(
																							0,
																							fileName
																							.length -
																							5
																						),
																						file,
																						issueImage1,
																						callback => {
																							resolve
																								(
																									res
																								)
																						}
																					)
																			}
																		)
																} else {
																	resolve
																		(
																			res
																		)
																}
															} else {
																resolve
																	(
																		res
																	)
															}
														})
												}
											})
										}
									})
								})
							})
						})
				})
		} else {
			let userIn11 = []
			userIn11.push(userId)
			let userIn = ""
			userIn11.forEach(item => {
				userIn += "'" + item + "',"
			})
			let userIn1 = "tb_task_detail.user_id IN (" + userIn.substring(0, userIn.length - 1) + ")"
			let userIn2 = "tb_task_detail.group_id IN (" + userIn.substring(0, userIn.length - 1) + ")"
			let taskIn = "tb_task.task_id = ('" + taskId + "')"
			if (status == 1) {
				sql ="select * from ( select * from (SELECT tb_task.task_id,tb_task_detail.taskdetail_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid ,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid  LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn +" ORDER BY majorCategory ASC,serial ASC ,questionItem ASC)  where smallCategory is not null ) e LEFT JOIN( SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id as norm_row_idr,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name,sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND " + taskIn +" ) r on e.norm_row_id = r.norm_row_idr where 1=1 order by  majorCategory ASC,serial ASC ,questionItem ASC"
			} else {
				sql ="select * from (select * from (SELECT tb_task.task_id,tb_task_detail.taskdetail_id, tb_task.task_name AS taskName , CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime , tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory , tb_norm_detail_row.content AS questionItem, tb_norm_detail.serial, tb_task_detail_checkrow.problempicture AS issueImage, tb_task_detail_checkrow.score, tb_task_detail_checkrow.remark AS questionNotes , CASE tb_task_detail_checkrow.score WHEN 0 THEN '' ELSE  CASE tb_task_detail_checkrow.status WHEN 0 THEN '一般' WHEN 1 THEN '严重' END END AS questionNature , CASE tb_task_detail_checkrow.score_type WHEN 0 THEN  CASE tb_task_detail_checkrow.score WHEN 0 THEN '1' ELSE '2' END WHEN 1 THEN '3' ELSE '' END AS type, tb_task_detail_checkrow.status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname , tb_task_detail.groupPhone, tb_task_detail_checkrow.correct, tb_task_detail_checkrow.correctremark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.updatetime AS inspectionTime ,tb_task_detail_norm_detail.status as checkstatus,tb_task_detail_norm_detail.tasknormdetailid,tb_task_detail_checkrow.norm_row_id,tb_task_detail_norm.name FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid and tb_task_detail_norm_detail.status!=0 LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid and tb_task_detail_checkrow.score != 0 LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND  " + taskIn + "  union  SELECT tb_task.task_id,tb_task_detail.taskdetail_id, tb_task.task_name AS taskName, CASE tb_task.type WHEN 1 THEN '检查任务' WHEN 2 THEN '整改任务' ELSE '个人任务' END AS taskType, tb_task.unit_name AS unitName, tb_task.site_name AS unitChildName, tb_task.star_time AS startTime, tb_task.end_time AS endTime, tb_task.location AS address, tb_norm_detail.content, tb_task_detail_norm.name AS standard, tb_task_detail_norm.item AS majorCategory, tb_task_detail_norm_detail.item_small AS smallCategory, '' AS questionItem, tb_norm_detail.serial, '' AS issueImage, tb_task_detail_norm_detail.score, '' AS questionNotes, '' AS questionNature, '1' AS type, '' as status, tb_task_detail.username, tb_task_detail.userphone, tb_task_detail.groupname, tb_task_detail.groupPhone, '' as correct, '' as correctremark, '' as correctpicture, tb_task_detail_norm_detail.updatetime as inspectionTime, tb_task_detail_norm_detail.status AS checkstatus, tb_task_detail_norm_detail.tasknormdetailid,'' as norm_row_id,tb_task_detail_norm.name FROM( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid AND tb_task_detail_norm_detail.status != 0 LEFT JOIN tb_norm_detail ON tb_task_detail_norm_detail.norm_detail_id = tb_norm_detail.id WHERE (" +userIn1 + " OR " + userIn2 + ") AND " + taskIn +"  ORDER BY   majorCategory ASC, serial ASC ,questionItem ASC )  where smallCategory is not null and type = '3') e LEFT JOIN( SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id as norm_row_idr,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name,sys_user.phone FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND " + taskIn +" ) r on e.norm_row_id = r.norm_row_idr where 1=1 order by  majorCategory ASC,serial ASC ,questionItem ASC"
			}
			selectSQL("local", sql, res => {
				let taskID =[]
				res.forEach(entry=>{
					taskID.push(entry.task_id)
				})
				taskID=   Array.from(new Set(taskID))
				let mm = ''
				taskID.forEach(entry=>{
					mm+="'"+entry+"',"
				})
				mm = mm.substring(0,mm.length-1)
				let taskList = res
				if (taskList.length == 0) {
					resolve("isFlag")
					return
				}
				let countTaskNum =
					"SELECT tb_task.task_id, tb_task.task_name AS taskName,tb_task.type  FROM ( SELECT t.*, sys_unit.unit_name AS site_name FROM ( SELECT tb_task.*, sys_unit.unit_name FROM tb_task LEFT JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id ) t LEFT JOIN sys_unit ON t.site_id = sys_unit.unit_id ) tb_task LEFT JOIN ( SELECT t.*, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone AS userphone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t LEFT JOIN sys_user ON t.group_id = sys_user.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != '1' LEFT JOIN ( SELECT t.*, tb_norm_detail.item FROM ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) t LEFT JOIN tb_norm_detail ON t.norm_detail_id = tb_norm_detail.id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != '1' LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item AS item_small FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid LEFT JOIN tb_norm_detail_row ON tb_task_detail_checkrow.norm_row_id = tb_norm_detail_row.id LEFT JOIN tb_norm_detail ON tb_norm_detail_row.norm_detail_id = tb_norm_detail.id WHERE (" +
					userIn1 + " OR " + userIn2 + ") AND  " + taskIn + "   group by tb_task.task_id"
				//查询任务数
				let data = []
				selectSQL("local", countTaskNum, resName => {
					selectSQL("local","SELECT tb_task_detail.task_id, sys_user.name AS groupname, sys_user.phone AS groupPhone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id WHERE groupPhone != '' AND tb_task_detail.task_id IN ("+mm+") GROUP BY tb_task_detail.task_id",ct=>{
						//问题图片路径
							let issueImage = []
							let issueImage1 = []
							let taskName = ""
							let taskArr = []
							taskList = taskList.filter(item => item.type !== "");
							taskList.forEach((item) => {
								taskArr.push(item.tasknormdetailid)
							})
							let countedNames = taskArr.reduce(function(obj, name) {
								obj[name] = obj[name] ? ++obj[name] : 1;
								return obj;
							}, {});
							for (let ket in countedNames) {
								let count = countedNames[ket]
								if (count != 1) {
									for (let index = taskList.length - 1; index >= 0; index--) {
										if (taskList[index].tasknormdetailid == ket && taskList[index].questionItem == "") {
											taskList.splice(index, 1);
										}
									}
								}
							}
							resName.forEach(item => {
								let worksheetData = []
								taskList.forEach(entry => {
									if (item.task_id == entry.task_id) {
										if (entry.type == "1") {
											//entry.questionItem = ''
										} else {
											if (entry.questionItem != null) {
												entry.questionItem = entry.questionItem
													.replace("<", '小于')
											}
										}
										entry.startTime = dateFormat("YYYY-mm-dd",
											new Date(parseFloat(entry.startTime)))
										entry.endTime = dateFormat("YYYY-mm-dd",
											new Date(parseFloat(entry.endTime)))
										entry.inspectors = entry.username + "/" + entry
											.userphone
										if (entry.groupname != null) {
											entry.group = entry.groupname + "/" + entry
												.groupPhone
										} else {
											entry.group = ''
										}
										entry.inspectionTime = dateFormat(
											"YYYY-mm-dd HH:MM", new Date(parseFloat(
												entry.inspectionTime)))
										worksheetData.push(entry)
									}
								})
								if (item.type == 3) item.type = 1
								taskName += item.taskName + ","
								data.push({
									worksheet: item.taskName,
									isFlag: item.type,
									worksheetData: worksheetData
								})
							})
							let fileName = taskNames + "-" + checktype + "." + "xlsx"
							//图片处理
							data.forEach(item => {
								if(item.isFlag==2){
									item.worksheetData.forEach(entry => {
										entry.id = item.worksheetData.indexOf(entry) + 1
										if (entry.unitChildName == null) {
											entry.unitChildName = ""
										}
										if (entry.correctpicture != "" && isFlag==1) {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.correctpicture.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.correctpicture = varr.substring(0,varr.length-1)
											issueImage1.push(imgprefex + "/" + entry.task_id + "/" + entry.correctpicture)
											let arr = entry.correctpicture.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+imgprefex1 + "_图片" + inde +"_整改.png" + ","
											})
											entry.rectifyImage = img.substring(0, img.length -1)
										} else {
											entry.rectifyImage = ''
										}
										if (entry.issueImage != "" && isFlag==1) {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.issueImage.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.issueImage = varr.substring(0,varr.length-1)
											issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
											let arr = entry.issueImage.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+imgprefex1 + "_图片" + inde +".png" + ","
											})
											entry.issueImage = img.substring(0, img.length -1)
										} else {
											entry.issueImage = ''
										}
									})
								}else{
									item.worksheetData.forEach(entry => {
										entry.id = item.worksheetData.indexOf(entry) + 1
										if (entry.unitChildName == null) {
											entry.unitChildName = ""
										}
										if (entry.issueImage != "") {
											let imgprefex = ""
											let imgprefex1 = ""
											if (item.serial == "") {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.id + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.id + "_" + entry.id
													imgprefex1 = entry.id + "_" + entry.id
												}
											} else {
												if (isNumber(entry.questionItem.substring(0,1))) {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.questionItem.substring(0, 1)
													imgprefex1 = entry.serial + "_" + entry.questionItem.substring(0, 1)
												} else {
													imgprefex = entry.taskName + "/" + entry.serial + "_" + entry.id
													imgprefex1 = entry.serial + "_" + entry.id
												}
											}
											let varr = ""
											entry.issueImage.split(",").forEach(val=>{
												varr+=val+"/"+entry.name+","
											})
											entry.issueImage = varr.substring(0,varr.length-1)
											issueImage.push(imgprefex + "/" + entry.task_id + "/" + entry.issueImage)
											let arr = entry.issueImage.split(",")
											let img = ""
											let inde = 0
											arr.forEach(val => {
												inde += 1
												img += entry.name+": "+ imgprefex1 + "_图片" + inde +".png" + ","
											})
											entry.issueImage = img.substring(0, img.length -1)
										} else {
											entry.issueImage = ''
										}
									})
								}
							})
							//保存数据
							let arr = []
							data.forEach(val => {
								val.isFlag = val.isFlag + ""
								val.worksheetData.forEach(item => {
									if(item.score=='0'){
										item.type='1'
									}
									if(val.isFlag==2){
										arr.push(item.norm_row_id)
									}
								})
							})
							let indes = 0;
							let inde = 0;
							ct.forEach(val=>{
								let groupName = val.groupname+"/"+val.groupPhone
								data.forEach(entry=>{
									entry.worksheetData.forEach(valw=>{
										if(val.task_id== valw.task_id&&valw.type == '1'){
											entry.worksheetData.forEach(c=>{
												c.group = groupName
											})
										}
									})
								})
							})
							//查询是否存在整改数据
							data.forEach(item => {
								let inde = item.worksheetData.length;
								if (item.isFlag == 2) {
									selectSQL("local"," SELECT tb_task_detail.taskdetail_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id where tb_task_detail.task_id = '"+item.worksheetData[0].task_id+"' and tb_task_detail.user_id = tb_task.user_id",task_detailId=>{
										let row = ""
										arr.forEach(entry => {
											row += "'" + entry + "',"
										})
										row = "in (" + row.substring(0, row.length - 1) + ")"
										selectSQL("local","select * from (SELECT * from( SELECT tb_task.star_time, tb_task.end_time, tb_task_detail.name, tb_task_detail.phone, tb_task_detail.phone1, tb_task_detail.username, tb_task_detail_checkrow.norm_row_id, tb_task_detail_checkrow.updatetime, ''as name2,'' as phone2 FROM tb_group_report INNER JOIN tb_task ON tb_group_report.task_id = tb_task.task_id AND againtaskid LIKE '%"+task_detailId[0].taskdetail_id+"%' LEFT JOIN ( SELECT t1.*, t2.username, t2.phone FROM ( SELECT tb_task_detail.*, sys_user.name, sys_user.phone AS phone1 FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.group_id = sys_user.user_id) t1, ( SELECT tb_task_detail.*, sys_user.name AS username, sys_user.phone FROM tb_task_detail LEFT JOIN sys_user ON tb_task_detail.user_id = sys_user.user_id ) t2 WHERE t1.taskdetail_id = t2.taskdetail_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail_checkrow.norm_row_id "+row+" ) t UNION SELECT '' as star_time, '' asend_time, '' asname, '' asphone, '' asphone1, '' asusername, '' asnorm_row_id, '' asupdatetime, sys_user.name as name2,sys_user.phone as phone2 from tb_task LEFT JOIN sys_user on tb_task.user_id = sys_user.user_id WHERE task_id ='"+item.worksheetData[0].task_id+"' )cc where 1=1", taskData => {
											let rectifyInspectors = ""
											let group = ""
											let normIdData = []
											taskData.forEach(item=>{
												normIdData.push(item.norm_row_id)
											})
											let normIdDatas =  refrain(normIdData)
											for (var i = taskData.length - 1; i >= 0; i--) {
											       if(taskData[i].phone1!=null&&normIdDatas.indexOf(taskData[i].norm_row_id)!=-1){
											       	taskData.splice(i,1)
											       }
											    }
												taskData.forEach(key=>{
													if(key.star_time==''&&key.end_time==''){
														rectifyInspectors = key.name2 +"/" +key.phone2
													}
													if(key.name!=''&&key.phone1!=''){
														group = key.name +"/" +key.phone1
													}
												})
													item.worksheetData.forEach(val => {
															indes += 1
															//整改备注
															val.rectifyRemarks =val.correctremark
															//整改措施
															val.rectifyAction =""
															//整改人员
															val.rectifyPerson =val.inspectors
															//整改负责人
															val.rectifyInspectors =rectifyInspectors
															//整改期限
															val.rectifyTime =val.startTime +" " +val.endTime
															//整改要求
															val.rectifyReform =val.correct
															//组长/检察员/开始结束时间/检查时间
															val.group =group
															if(val.group == ("null/null")){
																val.group = ""
															}
															//组长/检察员/开始结束时间/检查时间
															taskData.forEach(entry => {
																	if (val.norm_row_id == entry.norm_row_id) {
																			val.startTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.star_time)))
																			val.endTime =dateFormat("YYYY-mm-dd",new Date(parseFloat(entry.end_time)))
																			val.inspectors =entry.username +"/" +entry.phone
																			val.inspectionTime =dateFormat("YYYY-mm-dd HH:MM",new Date(parseFloat(entry.updatetime)))
																	}
															})
															if (inde ==indes) {
																let file ="导出数据/" +taskNames +" " +dateFormat("YYYYmmdd HH:MM:SS",new Date())
																importData(data,file,fileName,res => {
																			//是否保存图片
																			if (isFlag ==1) {
																				if (issueImage.length !=0 ||issueImage1.length !=0) {
																					//复制正常图片开始
																					saveImage(fileName.substring(0,fileName.length -5),file,issueImage,callback => {
																								//复制整改图片开始
																								saveImages(fileName.substring(0,fileName.length -5),file,issueImage1,callback => {
																											resolve(	res)
																								})
																					})
																				} else {
																					resolve(res)
																				}
																			} else {
																				resolve(res)
																			}
																		}
																	)
															}
														})
											
											// queryTaskUserById(taskData,item.worksheetData[0].task_id,row,callback=>{
											// 	taskData = callback
											// 	})
										})
									})
								} else {
									item.worksheetData.forEach(val => {
										indes += 1
										if (inde == indes) {
											let file = "导出数据/" + taskNames + " " +
												dateFormat("YYYYmmdd HH:MM:SS",
													new Date())
											importData(data, file, fileName, res => {
												//是否保存图片
												if (isFlag == 1) {
													if (issueImage.length !=
														0) {
														//复制图片开始
														saveImage(fileName
															.substring(0,
																fileName
																.length - 5
															), file,
															issueImage,
															callback => {
																//复制整改图片开始
																saveImages(
																	fileName
																	.substring(
																		0,
																		fileName
																		.length -
																		5
																	),
																	file,
																	issueImage1,
																	callback => {
																		resolve
																			(
																				res
																			)
																	})
															})
													} else {
														resolve(res)
													}
												} else {
													resolve(res)
												}
											})
										}
									})
								}
							})
						
					})
					})
			})
		}
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

 async function queryTaskUserById(taskData,task_id,row,callback){
	await selectSQLSynccc(task_id,row).then(res=>{
		
		taskData.forEach(entry=>{
			res.forEach(val=>{
				if(entry.norm_row_id==val.norm_row_id){
					entry.username= val.user
					entry.phone= val.phone
				}
			})
		})
		callback(taskData)
	})
}
 
 function selectSQLSynccc(task_id,row){
	 return new Promise(resolve=>{
		 selectSQL("local","SELECT tb_task_detail.name AS user, tb_task_detail.phone AS phone, tb_task_detail_checkrow.norm_row_id, tb_task_detail.task_id, tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN( SELECT tb_task_detail.*, sys_user.name, sys_user.phone FROM sys_user LEFT JOIN ( SELECT * FROM tb_task_detail WHERE user_id IN ( SELECT sys_user.user_id FROM sys_user WHERE role_id IN ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '"+uni.getStorageSync("USER_ID")+"') AND function_id = 3 ) ) ) tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND tb_task.task_id = '"+task_id+"' and tb_task_detail_checkrow.norm_row_id "+row,resSSS=>{

		})
	})
}

/**
 * 查询当前导出的筛选条件
 * @param {Object} uid
 */
export function queryFilter(uid, functionid) {
	return new Promise(resolve => {
		//单位
		let unitSql = ""
		//用户
		let userSql = ""
		//标准
		let exelSql = ""
		let exelCategorySql = ""
		//任务 
		let taskSql = ""
		if (functionid == 1) {
			exelSql =
				"select * from (SELECT id AS value, name AS title, 1 AS type FROM tb_excel_category WHERE id IN ( SELECT ifnull(category_id,0) FROM ( SELECT id, name,tb_excel.status,tb_excel_user.status as statusa, categort_id AS category_id FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel.user_id = '" +
				uid + "' OR tb_excel_user.user_id = '" + uid +
				"' ) t WHERE category_id != ''  and statusa='0'  GROUP BY category_id ) UNION ALL SELECT id AS value, name AS title, 2 AS type FROM ( SELECT id, name, categort_id AS category_id ,tb_excel.status,tb_excel_user.status as statusa FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel.user_id = '" +
				uid + "' OR tb_excel_user.user_id = '" + uid +
				"' ) t WHERE category_id = ''  and statusa='0' ) r group by  r.value  order by r.type asc ";
			exelCategorySql =
				"SELECT id AS value, name AS title ,category_id FROM ( SELECT id, name, categort_id AS category_id ,tb_excel.status,tb_excel_user.status as statusa FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE  tb_excel.user_id = '" +
				uid + "' OR tb_excel_user.user_id = '" + uid +
				"' ) t WHERE category_id != '' and statusa='0' group by value ";
			//标准 
			selectSQL("local", exelSql, excelRes => {
				let excelList = excelRes
				if (excelList[0] == null || excelList == [] || excelList == '') {
					excelList = []
				} else {
					excelList.forEach(item => {
						if (item.type == 2) {
							item.title = item.title + "(未归类)"
						} else {
							item.title = item.title
						}
					})
				}
				//分类
				selectSQL("local", exelCategorySql, exelCategoryRes => {
					if (excelList[0] !== null || excelList !== [] || excelList !== '') {
						if (exelCategoryRes[0] !== null || exelCategoryRes !== [] ||
							exelCategoryRes !== '') {
							let arr = []
							excelList.forEach(item => {
								let obj = {
									id: item.value,
									name: item.title,
									checked: true,
									type: item.type,
									child: []
								}
								exelCategoryRes.forEach(key => {
									if (item.value == key.category_id) {
										obj.child.push(key.value)
									}
								})
								arr.push(obj)
							})
							excelList = arr
						}
					}
					let obj = {}
					let excelIds = []
					excelList.forEach(item => {
						if (item.type == 1) {
							item.child.forEach(val => {
								excelIds.push(val)
							})
						} else {
							excelIds.push(item.id)
						}
					})
					let sqlExcel = ''
					excelIds.forEach(item => {
						sqlExcel += "'" + item + "',"
					})
					sqlExcel = sqlExcel.substring(0, sqlExcel.length - 1)
					//获取所有的
					excelList.forEach(item => {
						if (item.type == 2) {
							item.type = 3
						} else {
							item.type = 4
						}
					})
					unitSql ="SELECT sys_unit.unit_id AS id, sys_unit.unit_name AS name FROM sys_unit WHERE unit_id IN ( SELECT tb_task.unit_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE tb_excel.id IN (" +sqlExcel + ") ) GROUP BY unit_id )";
					selectSQL("local", unitSql, unitRes => {
						let unitList = unitRes;
						unitList.forEach(item => {
							item.checked = true
						})
						//组员
						userSql =
							"SELECT sys_user.`user_id` AS id, sys_user.`name` AS name, 'false' AS checked FROM sys_user WHERE user_id IN ( SELECT tb_task_detail.group_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE tb_excel.id IN (" +
							sqlExcel +
							") )  UNION SELECT tb_task_detail.user_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE tb_task_detail_norm.norm_id IN ( SELECT tb_norm.norm_id FROM tb_excel LEFT JOIN tb_norm ON tb_excel.id = tb_norm.excel_id WHERE tb_excel.id IN (" +
							sqlExcel + ") )  )";
						selectSQL("local", userSql, userRes => {
							let userList = userRes
							userList.forEach(item => {
								item.checked = true
							})
							obj.unitList = unitList,
								obj.userList = userList,
								obj.excelList = excelList,
								resolve(obj)
						})
					})
				})
			})
		}
		if (functionid == 2) {
			taskSql =
				"select * from (SELECT tb_task.task_name, tb_task.task_id,tb_task.status, tb_task.unit_id,tb_task_detail.user_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE (tb_task.user_id = '" +
				uid + "' OR tb_task_detail.user_id = '" + uid + "' OR tb_task_detail.group_id='" + uid +
				"' ) and tb_task.status != '1'  group by tb_task.task_id)t where t.status != '1'"
			//任务
			selectSQL("local", taskSql, taskRes => {
				if (taskRes == null) {
					resolve(null)
				} else {
					let sql = ''
					let taskId = ""
					taskRes.forEach(item => {
						sql += "'" + item.unit_id + "',"
						item.checked = true
						item.id = item.task_id
						item.name = item.task_name
						taskId += "'" + item.task_id + "',"
					})
					unitSql =
						"SELECT sys_unit.unit_id AS id, sys_unit.unit_name AS name FROM sys_unit WHERE sys_unit.unit_id in ( " +
						sql.substring(
							0, sql.length - 1) + ") group by unit_id"
					selectSQL("local", unitSql, unitRes => {
						let unitList = unitRes;
						unitList.forEach(item => {
							item.checked = true
						})
						selectSQL("local",
							"select tb_task_detail.user_id from tb_task_detail where task_id in (" +
							taskId.substring(
								0, taskId.length - 1) +
							") GROUP BY tb_task_detail.user_id ", taskuser => {
								let userId = ''
								taskuser.forEach(it => {
									userId += "'" + it.user_id + "',"
								})
								userSql =
									"SELECT sys_user.`user_id` AS id, sys_user.`name`  as name,'false' as checked FROM sys_user WHERE sys_user.`role_id` IN (SELECT sys_role.`role_id` FROM sys_role WHERE sys_role.`parent_id` = (SELECT sys_user.`company_id` FROM sys_user WHERE sys_user.`user_id` =('" +
									uid +
									"')) AND sys_role.`function_id` = '3') and status = '0' and id in( " +
									userId.substring(0, userId
										.length - 1) + ") group by user_id"
								//组员
								selectSQL("local", userSql, userRes => {
									let userList = userRes
									userList.forEach(item => {
										item.checked = true
									})
									//查询当前任务下的所有标准
									let normSql = ''
									taskRes.forEach(item => {
										normSql += "'" + item.task_id + "',"
									})
									selectSQL("local",
										"select tb_task_detail_norm.norm_id from tb_task_detail_norm where tb_task_detail_norm.task_id in(" +
										normSql.substring(0, normSql.length -
											1) + ") group by norm_id",
										excelRess => {
											let excelSqlAfter = ''
											excelRess.forEach(item => {
												excelSqlAfter += "'" +
													item.norm_id + "',"
											})
											exelSql =
												"select * from (SELECT *FROM ( SELECT tb_norm.norm_id as value, tb_excel.name as title,3 AS type FROM tb_excel LEFT JOIN tb_norm WHERE id = excel_id AND norm_id IN (" +
												excelSqlAfter.substring(0,
													excelSqlAfter.length - 1) +
												") AND tb_excel.type = '1' ) t UNION ALL SELECT * FROM ( SELECT tb_norm.norm_id as value, tb_excel.name as title, 2 AS type FROM tb_excel LEFT JOIN tb_norm WHERE id = excel_id AND norm_id IN (" +
												excelSqlAfter.substring(0,
													excelSqlAfter.length - 1) +
												") AND tb_excel.type = '2' ) t) order by type asc "
											//标准
											selectSQL("local", exelSql,
												excelRes => {
													let excelList = excelRes
													if (excelList[0] ==
														null || excelList ==
														[] || excelList ==
														'') {
														excelList = []
													} else {
														excelList.forEach(
															item => {
																if (item
																	.type ==
																	1) {
																	item.checked =
																		true
																	item.id =
																		item
																		.value
																	item.name =
																		item
																		.title
																} else {
																	item.checked =
																		true
																	item.id =
																		item
																		.value
																	item.name =
																		item
																		.title
																}
															})
													}
													if (excelList.length !=
														0) {
														let ind = 0
														selectSQL("local",
															" select tb_norm.name as name1,tb_excel.name as name2,tb_norm.norm_id,tb_norm.excel_id from tb_excel left join tb_norm on id =excel_id group by tb_norm.norm_id ",
															excelRess => {
																excelList
																	.forEach(
																		val => {
																			excelRess
																				.forEach(
																					item => {
																						if (item
																							.norm_id ==
																							val
																							.id
																						) {
																							let arr =
																								0
																							excelRess
																								.forEach(
																									entry => {
																										if (entry
																											.excel_id ==
																											item
																											.excel_id
																										) {
																											arr +=
																												1
																										}
																									}
																								)
																							if (arr !=
																								0
																							) {
																								val.name =
																									item
																									.name1
																							}
																						}
																					}
																				)
																			ind +=
																				1
																			if (ind ==
																				excelList
																				.length
																			) {
																				let obj = {}
																				obj.unitList =
																					unitList,
																					obj
																					.userList =
																					userList,
																					obj
																					.excelList =
																					excelList,
																					obj
																					.taskList =
																					taskRes,
																					resolve(
																						obj
																					)
																			}
																		}
																	)
															})
													} else {
														let obj = {}
														obj.unitList =
															unitList,
															obj.userList =
															userList,
															obj.excelList =
															excelList,
															obj.taskList =
															taskRes,
															resolve(obj)
													}
												})
										})
								})
							})
					})
				}
			})
		}
		if (functionid == 3) {
			taskSql =
				"SELECT tb_task.task_name, tb_task.task_id, tb_task.unit_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE ( tb_task.user_id = '" +
				uid + "' OR tb_task_detail.user_id = '" + uid +
				"' ) and tb_task.status != '1' AND tb_task_detail.status != '1' group by tb_task.task_id"
			//任务
			selectSQL("local", taskSql, taskRes => {
				if (taskRes[0].task_id == null) {
					resolve(null)
				} else {
					let sql = ''
					taskRes.forEach(item => {
						sql += "'" + item.unit_id + "',"
						item.checked = true
						item.id = item.task_id
						item.name = item.task_name
					})
					unitSql =
						"SELECT sys_unit.unit_id AS id, sys_unit.unit_name AS name FROM sys_unit WHERE sys_unit.unit_id in ( " +
						sql.substring(
							0, sql.length - 1) + ") group by unit_id"
					//单位
					selectSQL("local", unitSql, unitRes => {
						let unitList = unitRes;
						unitList.forEach(item => {
							item.checked = true
						})
						let obj = {}
						obj.unitList = unitList,
							obj.taskList = taskRes,
							resolve(obj)
					})
				}
			})
		}
	})
}

/**
 * 导出数据
 */
export function importData(jsonData, file, fileName, callback) {
	//获取表格模板
	let template = witer(jsonData);
	//下载数据
	exportFile(template, file, fileName, res => {
		callback(res)
	})
}


/**
 * @param {Object} 数据
 * @param {Object} status 1正常，2整改
 * @param {Object} worksheet sheet名字
 */
function witer(jsonData) {
	let header =
		`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  	<?mso-application progid="Excel.Sheet"?>
  	<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office"
  	          xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  	          xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
  	    <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  	        <Title>任务数据</Title>
  	        <Subject>凭条数据导出</Subject>
  	        <Author>程序汪</Author>
  	        <Description>除验收评价注明之服务条款外，其它因使用验收评价而引致之任何意外、疏忽、合约毁坏、诽谤、版权或知识
  	            产权侵犯及其所造成的各种损失（包括因下载而感染电脑病毒），验收评价概不负责，亦不承担任何法律责任。
  	        </Description>
  	        <LastAuthor>Administrator</LastAuthor>
  	        <Created>2021-01-13T02:34:00Z</Created>
  	        <LastSaved>2021-01-26T01:46:57Z</LastSaved>
  	        <Category>文档</Category>
  	        <Manager>伍总</Manager>
  	        <Company>成都积盛电子科技有限公司</Company>
  	    </DocumentProperties>
  	    <CustomDocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  	        <KSOProductBuildVer dt:dt="string">2052-11.8.2.9067</KSOProductBuildVer>
  	    </CustomDocumentProperties>
  	    <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
  	        <WindowWidth>28245</WindowWidth>
  	        <WindowHeight>12465</WindowHeight>
  	        <ProtectStructure>False</ProtectStructure>
  	        <ProtectWindows>False</ProtectWindows>
  	    </ExcelWorkbook>
  	    <Styles>
  	        <Style ss:ID="Default" ss:Name="Normal"/>
  	        <Style ss:ID="s49"/>
  	        <Style ss:ID="s50">
  	            <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  	            <Borders/>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="12"/>
  	            <Interior/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s51">
  	            <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  	            <Borders/>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10"/>
  	            <Interior/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s52">
  	            <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  	            <Borders/>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10" ss:Color="#FF0000" ss:Bold="1"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s53">
  	            <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  	            <Borders/>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10" ss:Color="#19be6b" ss:Bold="1"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s54">
  	            <Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
  	            <Borders/>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10"/>
  	            <Interior/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s55">
  	            <Alignment ss:Vertical="Bottom"/>
  	            <Borders/>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10"/>
  	            <Interior/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s56">
  	            <Alignment ss:Horizontal="Left" ss:Vertical="Bottom"/>
  	            <Borders/>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10"/>
  	            <Interior/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s57">
  	            <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="12" ss:Bold="1"/>
  	            <Interior ss:Color="#D6DCE4" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s58">
  	            <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s59">
  	            <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s60">
  	            <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10" ss:Color="#FF0000" ss:Bold="1"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s61">
  	            <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10" ss:Color="#FF0000" ss:Bold="1"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s62">
  	            <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10" ss:Color="#19be6b" ss:Bold="1"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s63">
  	            <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="微软雅黑 Light" x:CharSet="134" ss:Size="10" ss:Color="#19be6b" ss:Bold="1"/>
  	            <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  	            <NumberFormat/>
  	        </Style>
  	        <Style ss:ID="s64">
  	            <Borders>
  	                <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
  	                <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
  	            </Borders>
  	            <Font ss:FontName="宋体" x:CharSet="134" ss:Size="10"/>
  	        </Style>
  	        <Style ss:ID="s65">
  	            <Font ss:FontName="宋体" x:CharSet="134" ss:Size="12"/>
  	        </Style>
  	        <Style ss:ID="s66">
  	            <Font ss:FontName="宋体" x:CharSet="134" ss:Size="12" ss:Color="#19be6b"/>
  	        </Style>
  	    </Styles>`
	let str = ""
	let tail = "</Workbook>"
	jsonData.forEach(item => {
		switch (item.isFlag) {
			case "1":
				let row = "";
				item.worksheetData.forEach(entry => {
					switch (entry.type) {
						case "1":
							row = row +
								`<Row ss:StyleID="s51" ss:Height="24">
  	                                <Cell ss:StyleID="s58">
  	                                    <Data ss:Type="Number">${entry.id}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.taskName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.taskType}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.unitName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.unitChildName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.standard}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.majorCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.smallCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.content}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.questionItem}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.serial}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.issueImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="Number">${entry.score}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.questionNotes}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.questionNature}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.inspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.group}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.startTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.endTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.address}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.inspectionTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                                <Cell ss:StyleID="s65"/>
  	                            </Row>`
							break;
						case "3":
							row = row +
								`<Row ss:StyleID="s52" ss:Height="24">
  	                                <Cell ss:StyleID="s60">
  	                                    <Data ss:Type="Number">${entry.id}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.taskName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.taskType}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.unitName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.unitChildName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.standard}</Data>
  	                                </Cell>
  	                               <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.majorCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.smallCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.content}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.questionItem}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.serial}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.issueImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="Number">${entry.score}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.questionNotes}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.questionNature}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.inspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.group}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.startTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.endTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.address}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.inspectionTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                <Cell ss:StyleID="Default"/>
  	                            </Row>`
							break;
						case "2":
							row = row +
								`<Row ss:StyleID="s53" ss:Height="24">
  	                                <Cell ss:StyleID="s62">
  	                                    <Data ss:Type="Number">${entry.id}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.taskName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.taskType}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.unitName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.unitChildName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.standard}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.majorCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.smallCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.content}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.questionItem}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.serial}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.issueImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="Number">${entry.score}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.questionNotes}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.questionNature}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.inspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.group}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.startTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.endTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.address}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.inspectionTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                                <Cell ss:StyleID="s66"/>
  	                            </Row>`
							break;
						default:
							break;
					}
				})
				str = str +
					`<Worksheet ss:Name="${item.worksheet}">
  	                        <Names>
  	                            <NamedRange ss:Name="_FilterDatabase" ss:RefersTo="=${item.worksheet}!R1C7:R4C7" ss:Hidden="1"/>
  	                        </Names>
  	                        <Table ss:ExpandedColumnCount="30" ss:ExpandedRowCount="4" x:FullColumns="1" x:FullRows="1"
  	                                   ss:DefaultColumnWidth="48" ss:DefaultRowHeight="16.5">
  	                            <Column ss:Index="1" ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="45.75"/>
  	                            <Column ss:Index="2" ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="105.75" ss:Span="1"/>
  	                            <Column ss:Index="4" ss:StyleID="s56" ss:AutoFitWidth="0" ss:Width="105.75"/>
  	                            <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="105.75" ss:Span="1"/>
  	                            <Column ss:Index="7" ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="159.75" ss:Span="2"/>
  	                            <Column ss:Index="10" ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="363.75"/>
  	                            <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="63.75"/>
  	                            <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="183.75"/>
  	                            <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="63.75"/>
  	                            <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="147.75"/>
  	                            <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="63.75"/>
  	                            <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                            <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                            <Column ss:StyleID="s56" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                            <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                            <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="147.75"/>
  	                            <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                            <Row ss:StyleID="s50" ss:Height="27">
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">编号</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">任务名称</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">任务类型</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">单位名称</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">子单位名称</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">标准</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">所属大类</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">所属小类</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">评价内容</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">问题项</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">评价序号</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">问题图片</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">评分</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">问题备注</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">问题性质</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">检查人员</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">组长</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">任务开始时间</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">任务结束时间</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">检查地点</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s57">
  	                                    <Data ss:Type="String">检查时间</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                            </Row>
  	                           ${row}
  	                        </Table>
  	                        <WorksheetOptions
  	                            xmlns="urn:schemas-microsoft-com:office:excel">
  	                            <PageSetup>
  	                                <Header/>
  	                                <Footer/>
  	                            </PageSetup>
  	                            <Print>
  	                                <ValidPrinterInfo/>
  	                                <FitWidth>0</FitWidth>
  	                                <FitHeight>0</FitHeight>
  	                                <LeftToRight/>
  	                                <PaperSizeIndex>9</PaperSizeIndex>
  	                                <HorizontalResolution>300</HorizontalResolution>
  	                                <VerticalResolution>300</VerticalResolution>
  	                            </Print>
  	                            <Selected/>
  	                            <TopRowVisible>0</TopRowVisible>
  	                            <LeftColumnVisible>0</LeftColumnVisible>
  	                            <Panes>
  	                                <Pane>
  	                                    <Number>3</Number>
  	                                    <ActiveRow>18</ActiveRow>
  	                                    <ActiveCol>6</ActiveCol>
  	                                    <RangeSelection>R19C7</RangeSelection>
  	                                </Pane>
  	                            </Panes>
  	                            <ProtectObjects>False</ProtectObjects>
  	                            <ProtectScenarios>False</ProtectScenarios>
  	                        </WorksheetOptions>
  	                    </Worksheet>`
				break;
			case "2":
				let row1 = "";
				item.worksheetData.forEach(entry => {
					switch (entry.type) {
						case "1":
							row1 = row1 +
								`<Row ss:StyleID="s51" ss:Height="24">
  	                                <Cell ss:StyleID="s58">
  	                                    <Data ss:Type="Number">${entry.id}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.taskName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.taskType}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.unitName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.unitChildName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.standard}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.majorCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.smallCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.content}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.questionItem}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.serial}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.issueImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="Number">${entry.score}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.questionNotes}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.questionNature}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.inspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.group}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.startTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.endTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.address}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.inspectionTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.rectifyReform}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.rectifyTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.rectifyInspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.rectifyPerson}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.rectifyImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s59">
  	                                    <Data ss:Type="String">${entry.rectifyRemarks}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                            </Row>`
							break;
						case "2":
							row1 = row1 +
								`<Row ss:StyleID="s52" ss:Height="24">
  	                                <Cell ss:StyleID="s62">
  	                                    <Data ss:Type="Number">${entry.id}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.taskName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.taskType}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.unitName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.unitChildName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.standard}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.majorCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.smallCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.content}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.questionItem}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.serial}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.issueImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="Number">${entry.score}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.questionNotes}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.questionNature}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.inspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.group}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.startTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.endTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.address}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.inspectionTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.rectifyReform}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.rectifyTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.rectifyInspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.rectifyPerson}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.rectifyImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s63">
  	                                    <Data ss:Type="String">${entry.rectifyRemarks}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                            </Row>`
							break;
						case "3":
							row1 = row1 +
								`<Row ss:StyleID="s53" ss:Height="24">
  	                                <Cell ss:StyleID="s60">
  	                                    <Data ss:Type="Number">${entry.id}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.taskName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.taskType}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.unitName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.unitChildName}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.standard}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.majorCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.smallCategory}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.content}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.questionItem}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.serial}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.issueImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="Number">${entry.score}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.questionNotes}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.questionNature}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.inspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.group}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.startTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.endTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.address}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.inspectionTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.rectifyReform}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.rectifyTime}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.rectifyInspectors}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.rectifyPerson}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.rectifyImage}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="s61">
  	                                    <Data ss:Type="String">${entry.rectifyRemarks}</Data>
  	                                </Cell>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                                <Cell ss:StyleID="Default"/>
  	                            </Row>`
							break;
						default:
							break;
					}
				})
				str = str +
					`<Worksheet ss:Name="${item.worksheet}">
  	                            <Table ss:ExpandedColumnCount="39" ss:ExpandedRowCount="4" x:FullColumns="1" x:FullRows="1"
  	                                   ss:DefaultColumnWidth="48" ss:DefaultRowHeight="16.5">
  	                                <Column ss:Index="1" ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="45.75"/>
  	                                <Column ss:Index="2" ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="105.75" ss:Span="1"/>
  	                                <Column ss:Index="4" ss:StyleID="s56" ss:AutoFitWidth="0" ss:Width="105.75"/>
  	                                <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="105.75" ss:Span="1"/>
  	                                <Column ss:Index="7" ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="159.75" ss:Span="2"/>
  	                                <Column ss:Index="10" ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="363.75"/>
  	                                <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="63.75"/>
  	                                <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="183.75"/>
  	                                <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="63.75"/>
  	                                <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="147.75"/>
  	                                <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="63.75"/>
  	                                <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                                <Column ss:StyleID="s54" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                                <Column ss:StyleID="s56" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                                <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                                <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="147.75"/>
  	                                <Column ss:StyleID="s55" ss:AutoFitWidth="0" ss:Width="123.75"/>
  	                                <Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="219.75"/>
  	                                <Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="183.75"/>
  	                                <Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="123.75" ss:Span="1"/>
  	                                <Column ss:Index="26" ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="219.75"/>
  	                                <Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="183.75"/>
  	                                <Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="147.75"/>
  	                                <Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="51.75" ss:Span="1"/>
  	                                <Column ss:Index="39" ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="42"/>
  	                                <Row ss:StyleID="s50" ss:Height="27">
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">编号</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">任务名称</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">任务类型</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">单位名称</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">子单位名称</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">标准</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">所属大类</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">所属小类</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">评价内容</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">问题项</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">评价序号</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">问题图片</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">评分</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">问题备注</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">问题性质</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">检查人员</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">组长</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">任务开始时间</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">任务结束时间</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">检查地点</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">检查时间</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">整改要求</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">整改期限</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">整改负责人</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">整改人员</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">整改图片</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="s57">
  	                                        <Data ss:Type="String">整改备注</Data>
  	                                    </Cell>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                    <Cell ss:StyleID="Default"/>
  	                                </Row>
  	                             ${row1}
  	                            </Table>
  	                            <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
  	                                <PageSetup>
  	                                    <Header/>
  	                                    <Footer/>
  	                                </PageSetup>
  	                                <TopRowVisible>0</TopRowVisible>
  	                                <LeftColumnVisible>0</LeftColumnVisible>
  	                                <PageBreakZoom>100</PageBreakZoom>
  	                                <Panes>
  	                                    <Pane>
  	                                        <Number>3</Number>
  	                                        <ActiveRow>15</ActiveRow>
  	                                        <ActiveCol>21</ActiveCol>
  	                                        <RangeSelection>R16C22</RangeSelection>
  	                                    </Pane>
  	                                </Panes>
  	                                <ProtectObjects>False</ProtectObjects>
  	                                <ProtectScenarios>False</ProtectScenarios>
  	                            </WorksheetOptions>
  	                        </Worksheet>`
				break;
			default:
				break;
		}
	})
	let xml = header + str + tail
	return xml;
}


/**
 * 导出Excel数据到本地文件
 * @param {Object} fileData
 * @param {Object} file
 * @param {Object} fileName
 * @param {Object} callback
 */
function exportFile(fileData, file, fileName, callback) {
	if (uni.getSystemInfoSync().platform == 'ios') {
		// const arrayBuffer = new Uint8Array(fileData)
		// const base64 = uni.arrayBufferToBase64(arrayBuffer)
		//将Josn对象换为Base64
		let encode = encode64(utf16to8(fileData));
		//将Base64转换为Blob
		let blob = dataURLtoBlob(encode);
		var windowURL = window.URL || window.webkitURL;
		//将blob转换为零时URL
		var downloadUrl = windowURL.createObjectURL(blob);
		//调用uniAPP的下载方法进行下载
		uni.downloadFile({
			url: downloadUrl,
			success: (data) => {
				if (data.statusCode === 200) {
					uni.saveFile({
						tempFilePath: data.tempFilePath,
						success: function(res) {
							var savedFilePath = res.savedFilePath;
						}
					});
				}
			}
		});
	}
	if (uni.getSystemInfoSync().platform === 'android') {
		plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
			let rootObj = fs.root;
			let fullPath = "/storage/emulated/0"
			rootObj.fullPath = fullPath
			// 创建文件夹
			rootObj.getDirectory("验收评价", {
				create: true
			}, function(dirEntry) {
				dirEntry.getDirectory(file, {
					create: true
				}, function(dirEntry2) {
					dirEntry2.getFile(fileName, {
						create: true
					}, function(fileEntry) {

						fileEntry.createWriter(function(writer) {
							writer.onwritestart = (e) => {
								// uni.showLoading({
								// 	title: "正在导出",
								// 	mask: true
								// })
							}
							writer.onwrite = (e) => {
								callback("根目录/验收评价/导出数据/" + fileName)
							};
							// 写入内容;
							writer.write(fileData);
						}, function(e) {
							callback(false)
						});
					});
				})
			});
		});
	}
}

function dateFormat(fmt, date) {
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


let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

//将Ansi编码的字符串进行Base64编码
function encode64(input) {
	let output = "";
	let chr1, chr2, chr3 = "";
	let enc1, enc2, enc3, enc4 = "";
	let i = 0;
	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}
		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
			keyStr.charAt(enc3) + keyStr.charAt(enc4);
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < input.length);
	return output;
}

function utf16to8(str) {
	let out, i, len, c;

	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

function dataURLtoBlob(base64Str) {
	let bstr = atob(base64Str),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {
		type: "application/vnd.ms-excel"
	});
}

function getSavedFileDir(success, fail) {
	fail = fail || function() {};
	plus.io.requestFileSystem(plus.io.PRIVATE_DOC, fs => { // 请求_doc fs
		fs.root.getDirectory(SAVED_DIR, { // 获取文件保存目录对象
			create: true
		}, dir => {
			success(dir);
		}, err => {
			fail('目录[' + SAVED_DIR + ']创建失败' + err.message);
		});
	}, err => {
		fail('目录[_doc]读取失败' + err.message);
	});
}

//获取文件路径
function getRealPath(filePath) {
	const SCHEME_RE = /^([a-z-]+:)?\/\//i;
	const DATA_RE = /^data:.*,.*/;
	// 无协议的情况补全 https
	if (filePath.indexOf('//') === 0) {
		filePath = 'https:' + filePath;
	}
	// 网络资源或base64
	if (SCHEME_RE.test(filePath) || DATA_RE.test(filePath)) {
		return filePath
	}
	if (filePath.indexOf('_www') === 0 || filePath.indexOf('_doc') === 0 || filePath.indexOf('_documents') === 0 ||
		filePath.indexOf('_downloads') === 0) {
		return 'file://' + _handleLocalPath(filePath)
	}
}

function isNumber(val) {
	// isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
	if (val === "" || val == null) {
		return false;
	}
	if (!isNaN(val)) {
		return true;
	} else {
		return false;
	}
}

function saveFileAndroid(tempFilePath, callbackId) {
	let fileName = tempFilePath.replace(REGEX_FILENAME, '');
	if (fileName) {
		fileName = head(fileName.split(".")) + "_" + dateFormat("mm-dd_HH:MM:SS", new Date()) + "." + fileName.split(
			".").pop()
		plus.io.resolveLocalFileSystemURL(getRealPath(tempFilePath), entry => { // 读取临时文件 FileEntry
			getSavedFileDir(dir => {
				entry.copyTo(dir, fileName,
					() => { // 复制临时文件 FileEntry，为了避免把相册里的文件删除，使用 copy，微信中是要删除临时文件的
						callbackId(true)
					}, err => {
						callbackId(' 保存失败')
					});
			}, message => {
				callbackId("fail" + message)
			});
		}, err => {
			callbackId("读取失败")
		});
	} else {
		return {
			errMsg: 'saveFile:fail 文件名[' + tempFilePath + ']不存在'
		}
	}
}
