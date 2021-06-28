import {
	openComDB,
	closeComDB,
	executeSQL,
	selectSQL,
	transaction
} from '@/common/local.js'

import {
	importData
} from '@/api/importExcel.js'


/**
 * 查询当前问题列表数据
 * @param {Object} isFlag 0检查 1整改
 * @param {Object} page
 * @param {Object} size
 * @param {Object} search
 * @param {Object} filters 筛选结果
 */
export function queryQuestionList(isFlag, page, size, search, filters) {
	return new Promise(resolve => {
		let functionid = uni.getStorageSync("functionid")
		let userId = uni.getStorageSync("USER_ID")
		let currentPage = (page - 1) * size;
		let type = ""
		let queryValue = ""
		if (isFlag == 0) {
			queryValue ="tb_task.totolequestion"
			type = "tb_task.type != 2"
		} else {
			queryValue ="tb_task.totlecheck"
			type = "tb_task.type = 2"
		}
		let excel = '';
		let unit = '';
		let task = '';
		let user = '';
		let status = '';
		if (filters != null) {
			let excelList = []
			let unitList = [];
			let taskList = [];
			let userList = [];
			let statusList = [];
			filters.forEach(item => {
				if (item.alias == "excel" && item.list.length !== 0) {
					item.list.forEach(entry => {
						if (functionid == 1) {
							if (entry.checked) {
								if (entry.child.length != 0) {
									entry.child.forEach(R => {
										excelList.push(R)
									})
								} else {
									excelList.push(entry.value)
								}
							}
						} else if (functionid == 2) {
							if (entry.checked) {
								if (entry.type == 1) {
									entry.child.forEach(R => {
										excelList.push(R)
									})
								} else {
									excelList.push(entry.value)
								}
							}
						}else{
							//这里的问题
							if (entry.checked) {
								excelList.push(entry.value)
							}
						}
					})
				}
				if (item.alias == "unit" && item.list.length !== 0) {
					item.list.forEach(entry => {
						if (entry.checked) {
							unitList.push(entry.id)
						}
					})
				}
				if (item.alias == "task" && item.list.length !== 0) {
					item.list.forEach(entry => {
						if (entry.checked) {
							taskList.push(entry.id)
						}
					})
				}
				if (item.alias == "user" && item.list.length !== 0) {
					item.list.forEach(entry => {
						if (entry.checked) {
							userList.push(entry.id)
						}
					})
				}
				if (item.alias == "status" && item.list.length !== 0) {
					item.list.forEach(entry => {
						if (entry.checked) {
							statusList.push(entry.value)
						}
					})
				}
			})
			if (excelList.length != 0) {
				if (functionid == 1) {
					excelList.forEach(item => {
						excel += "'" + item + "',"
					})
					excel = excel.substring(0, excel.length - 1)
					excel =
						"tb_task_detail_norm.norm_id IN (select tb_norm.norm_id from tb_excel left join tb_norm on tb_excel.id = tb_norm.excel_id where tb_excel.id in (" +
						excel + ") )"
				} else {
					excelList.forEach(item => {
						excel += "'" + item + "',"
					})
					excel = excel.substring(0, excel.length - 1)
					excel = "tb_task_detail_norm.norm_id IN ( " + excel + " ) "
				}
			} else {
				if (functionid == 1) {
					filters.forEach(item => {
						if (item.alias == "excel" && item.list.length !== 0) {
							item.list.forEach(entry => {
								if (!entry.checked) {
									if (entry.child.length != 0) {
										entry.child.forEach(R => {
											excelList.push(R)
										})
									} else {
										excelList.push(entry.value)
									}
								}
							})
						}
					})
					excelList.forEach(item => {
						excel += "'" + item + "',"
					})
					excel = excel.substring(0, excel.length - 1)
					excel =
						"tb_task_detail_norm.norm_id IN (select tb_norm.norm_id from tb_excel left join tb_norm on tb_excel.id = tb_norm.excel_id where tb_excel.id in (" +
						excel + ") )"

				} else {
					excel = "1=1"
				}
			}
			if (unitList.length != 0) {
				unitList.forEach(item => {
					unit += "'" + item + "',"
				})
				unit = unit.substring(0, unit.length - 1)
				unit = "tb_task.unit_id IN ( " + unit + ")"
			} else {
				if (functionid == 1) {
					filters.forEach(item => {
						if (item.alias == "unit" && item.list.length !== 0) {
							item.list.forEach(entry => {
								if (!entry.checked) {
									unitList.push(entry.id)
								}
							})
						}
					})
					unitList.forEach(item => {
						unit += "'" + item + "',"
					})
					unit = unit.substring(0, unit.length - 1)
					unit = "tb_task.unit_id IN ( " + unit + ")"
				} else {
					unit = "1=1"
				}
			}
			if (taskList.length != 0) {
				taskList.forEach(item => {
					task += "'" + item + "',"
				})
				task = task.substring(0, task.length - 1)
				task = "tb_task.task_id IN ( " + task + " ) "
			} else {
				task = "1=1"
			}
			if (userList.length != 0) {
				userList.forEach(item => {
					user += "'" + item + "',"
				})
				user = user.substring(0, user.length - 1)
				user = "tb_task.user_id in(" + user + ") OR tb_task_detail.group_id in(" + user + ")"
			} else {
				if (functionid == 3) {
					user = "tb_task.user_id in('" + userId + "') OR tb_task_detail.user_id in('" + userId + "')"
				}
				if (functionid == 2) {
					user = "  tb_task_detail.user_id in('" + userId + "') OR tb_task_detail.group_id in('" +
						userId + "')"
				}
				if (functionid == 1) {
					user = "1=1"
				}
			}
			if (statusList.length != 0) {
				statusList.forEach(item => {
					status += "'" + item + "',"
				})
				status = status.substring(0, status.length - 1)
				if (functionid != 1) {
					status = " tb_task_detail.STATUS IN (" + status + ") "
				} else {
					status = " tb_task.status IN (" + status + ") "

				}
			} else {
				status = "1=1"
			}
		}
		let sql = ""
		if (functionid == 1) {
			if (isFlag == 0) {
				type = "tb_task.type = 1"
			} else {
				type = "tb_task.type = 2"
			}
			sql ="SELECT * FROM( SELECT * FROM ( SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task_detail_norm.norm_id, tb_task.unit_id, tb_task.totolequestion AS count, tb_task.status, tb_task_detail.group_id, tb_task.user_id, tb_task.created_time FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status = 8 AND tb_task.totolequestion != 0 AND " +type +" AND "+excel+" INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE (" +user + ") AND " + unit + " AND " + status + " AND " + task + ") t UNION ALL SELECT * FROM ( SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task_detail_norm.norm_id, tb_task.unit_id, tb_task.totolequestion AS count, 8 as status, tb_task_detail.group_id, tb_task.user_id, tb_task.created_time FROM tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id and tb_task_delete_status.STATUS in(8,200) INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status IN ( 1, 100 ) AND tb_task.totolequestion != 0 AND " +type +" AND "+excel+" INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE (" +user + ") AND " + unit + " AND " + status + " AND " + task + " ) y ) p WHERE p.taskName LIKE '%" +search + "%' GROUP BY p.task_id ORDER BY p.created_time DESC LIMIT " + currentPage +"," + size
			selectSQL("local", sql, res => {
				if (res.length == 0) {
					resolve(null)
				} else {
					//查询总数量
					selectSQL("local","SELECT count(p.task_id) as num  FROM( SELECT * FROM ( SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task_detail_norm.norm_id, tb_task.unit_id, tb_task.totolequestion AS count, tb_task.status, tb_task_detail.group_id, tb_task.user_id, tb_task.created_time FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status = 8 AND tb_task.totolequestion != 0 AND " +type +" AND "+excel+" INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE (" +user + ") AND " + unit + " AND " + status + " AND " + task + ") t UNION ALL SELECT * FROM ( SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task_detail_norm.norm_id, tb_task.unit_id, tb_task.totolequestion AS count, 8 as status, tb_task_detail.group_id, tb_task.user_id, tb_task.created_time FROM tb_task INNER JOIN tb_task_delete_status ON tb_task.task_id = tb_task_delete_status.task_id and tb_task_delete_status.STATUS in(8,200) INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status IN ( 1, 100 ) AND tb_task.totolequestion != 0 AND " +type +" AND "+excel+" INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id WHERE (" +user + ") AND " + unit + " AND " + status + " AND " + task + " ) y ) p WHERE p.taskName LIKE '%" +search + "%' GROUP BY p.task_id ",
						ress => {
							res[0].total = ress[0].num
							//记录索引
							let index = 0;
							res.forEach(item => {
								//查询模板
								selectSQL("local",
									"SELECT tb_norm.name FROM tb_task_detail_norm INNER JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id AND tb_task_detail_norm.task_id = '" +
									item.task_id + "' GROUP BY tb_norm.norm_id",
									resss => {
										let str = ''
										resss.forEach(val => {
											str += val.name + ","
										})
										index += 1;
										item.unitName = str.substring(0, str.length - 1)
										item.isShow = false,
											item.type = 2
										item.count = parseInt(item.count)
										if (index == res.length) {
											resolve(res)
										}
									})
							})
						})
				}
			})
		} else if (functionid == 2) {
			sql =
				"SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task_detail_norm.norm_id, tb_task.unit_id, "+queryValue+" AS count , tb_task_detail.status,tb_task_detail.group_id , tb_task.user_id FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != 1 AND tb_task.status != 100 and  tb_task_detail.totlequestion !=0 and " +
				type + " AND " + excel +
				"  INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != 1 WHERE (" +
				user + ")  AND " + unit + " AND " + status + " AND " + task + " AND tb_task.task_name LIKE '%" +
				search + "%' GROUP BY tb_task.task_id ORDER BY tb_task.created_time DESC LIMIT " + currentPage +
				"," + size
			selectSQL("local", sql, res => {
				if (res.length == 0) {
					resolve(null)
				} else {
					//查询总数量
					selectSQL("local",
						"select sum(t.num) as num from (SELECT count(tb_task.task_id) as num FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != 1 AND tb_task.status != 100 and tb_task.totolequestion !=0 and " +
						type +
						"  INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != 1 WHERE (" +
						user + ") AND " + excel + " AND " + unit + " AND " + status + " AND " +
						task +
						" AND tb_task.task_name LIKE '%" + search +
						"%' GROUP BY tb_task.task_id ORDER BY tb_task.created_time DESC)t",
						ress => {
							res[0].total = ress[0].num
							//记录索引
							let index = 0
							res.forEach(item => {
								//查询模板
								selectSQL("local",
									"SELECT tb_norm.name FROM tb_task_detail_norm INNER JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id AND tb_task_detail_norm.task_id = '" +
									item.task_id + "' GROUP BY tb_norm.norm_id",
									resss => {
										index += 1
										let str = ''
										resss.forEach(val => {
											str += val.name + ","
										})
										item.unitName = str.substring(0, str.length - 1)
										item.isShow = false,
											item.type = 2
										item.count = parseInt(item.count)
										if (index == res.length) {
											resolve(res)
										}
									})
							})
						})
				}
			})
		} else {
			sql ="select * from (SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task_detail_norm.norm_id, tb_task.unit_id, tb_task_detail.totlequestion AS count , tb_task_detail.status,tb_task.created_time FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != 1 AND tb_task.status != 100 AND " +excel + "  and tb_task_detail.totlequestion !=0 and " + type +"  INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != 1 WHERE (" +user + ")  AND " + unit + " AND " + status + " AND " + task + " AND tb_task.task_name LIKE '%" +search + "%' GROUP BY tb_task.task_id )t ORDER BY created_time DESC   LIMIT " + currentPage +"," + size
			selectSQL("local", sql, res => {
				if (res.length == 0) {
					resolve(null)
				} else {
					//查询总数量
					selectSQL("local",
						"select sum(t.num) as num from (select  COUNT( task_id )  as num from (SELECT tb_task.task_id, tb_task.task_name AS taskName, tb_task_detail_norm.norm_id, tb_task.unit_id, tb_task_detail.totlequestion AS count , tb_task.status FROM tb_task INNER JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id AND tb_task.status != 1 AND tb_task.status != 100 and  tb_task_detail.totlequestion !=0 and " +
						type +
						"   INNER JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id AND tb_task_detail.status != 1 WHERE (" +
						user + ") AND " + excel + " AND " + unit + " AND " + status + " AND " +
						task + " AND tb_task.task_name LIKE '%" + search +
						"%' GROUP BY tb_task.task_id )t)t", ress => {
							res[0].total = ress[0].num
							//记录索引
							let index = 0;
							res.forEach(item => {
								//查询模板
								selectSQL("local",
									"SELECT tb_norm.name FROM tb_task_detail_norm INNER JOIN tb_norm ON tb_task_detail_norm.norm_id = tb_norm.norm_id AND tb_task_detail_norm.task_id = '" +
									item.task_id + "' GROUP BY tb_norm.norm_id",
									resss => {
										index += 1;
										let str = ''
										resss.forEach(val => {
											str += val.name + ","
										})
										item.unitName = str.substring(0, str.length - 1)
										item.isShow = false,
										item.type = 2
										item.count = parseInt(item.count)
										if (index == res.length) {
											resolve(res)
										}
									})
							})
						})
				}
			})
		}
	})
}

/**
 * 查询当前用户的搜索条件
 * @param {Object} uid
 */
export function queryUserToCondition(uid, functionid, status) {
	return new Promise(resolve => {
		let menuList = [{
				name: '标准',
				active: true,
				alias: 'excel',
				listchoose: true,
				listname: '全部标准',
				list: []
			},
			{
				name: '单位',
				active: false,
				alias: 'unit',
				listchoose: true,
				listname: '全部单位',
				list: []
			},
			{
				name: '状态',
				active: false,
				alias: 'status',
				listchoose: true,
				listname: '全部状态',
				list: []
			},
			{
				name: '人员',
				active: false,
				alias: 'user',
				listchoose: true,
				listname: '全部人员',
				list: []
			}
		]
		//查询当前用户的标准
		let statusList = []
		//标准
		let excelSql = ""
		//分类
		let catrgorySql = ""
		//单位
		let unitSql = ""
		//用户
		let userSql = ""
		//任务
		let taskSql = ""
		if (functionid == 1) {
			// statusList.push({
			// 	name: `已归档`,
			// 	checked: false,
			// 	value: "11"
			// }, {
			// 	name: `已完成`,
			// 	checked: false,
			// 	value: "8"
			// }, {
			// 	name: `待整改`,
			// 	checked: false,
			// 	value: "2"
			// }, {
			// 	name: `待审核`,
			// 	checked: false,
			// 	value: "7"
			// })
			// 状态:1 删除 2 未开始   3 进行中  4 已完成  5 已延期  6 延期完成 7 待审核  8 已完结 9 复检  10 整改中 11已归档
			statusList.push({
				name: `未开始`,
				checked: true,
				value: "2"
			}, {
				name: `进行中`,
				checked: true,
				value: "3"
			}, {
				name: `已完成`,
				checked: true,
				value: "4"
			}, {
				name: `已延期`,
				checked: true,
				value: "5"
			}, {
				name: `延期完成`,
				checked: true,
				value: "6"
			}, {
				name: `待审核`,
				checked: true,
				value: "7"
			}, {
				name: `已完结`,
				checked: true,
				value: "8"
			}, {
				name: `复检`,
				checked: true,
				value: "9"
			}, {
				name: `整改中`,
				checked: true,
				value: "10"
			}, {
				name: `已归档`,
				checked: true,
				value: "11"
			})
			let type = ''
			if (status == 0) {
				statusList.splice(2, 1)
			} else {

			}
			excelSql =
				"select * from (SELECT id AS value, name AS title, 1 AS type FROM tb_excel_category WHERE id IN ( SELECT ifnull(category_id,0) FROM ( SELECT id, name,tb_excel.status,tb_excel_user.status as statusa, categort_id AS category_id FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel.user_id = '" +
				uid + "' OR tb_excel_user.user_id = '" + uid +
				"' ) t WHERE category_id != '' and (status='0'  or status='2' ) and statusa='0'  GROUP BY category_id ) UNION ALL SELECT id AS value, name AS title, 2 AS type FROM ( SELECT id, name, categort_id AS category_id ,tb_excel.status,tb_excel_user.status as statusa FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel.user_id = '" +
				uid + "' OR tb_excel_user.user_id = '" + uid +
				"' ) t WHERE category_id = '' and (status='0'  or status='2' ) and statusa='0' ) r group by  r.value  order by r.type asc "
			catrgorySql =
				"SELECT id AS value, name AS title ,category_id FROM ( SELECT id, name, categort_id AS category_id ,tb_excel.status,tb_excel_user.status as statusa FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE  tb_excel.user_id = '" +
				uid + "' OR tb_excel_user.user_id = '" + uid +
				"' ) t WHERE category_id != '' and status='0' and statusa='0' group by value "
			unitSql =
				"SELECT sys_unit.unit_id AS value, sys_unit.unit_name AS title FROM sys_unit WHERE sys_unit.company_id IN ( SELECT sys_user.`company_id` FROM sys_user WHERE sys_user.`user_id` = '" +
				uid + "' ) AND sys_unit.status = 0 AND sys_unit.parent_id = 0 GROUP BY sys_unit.unit_name"
			userSql =
				"SELECT sys_user.`user_id` AS value, sys_user.`name`  as title,'false' as checked FROM sys_user WHERE sys_user.`role_id` IN (SELECT sys_role.`role_id` FROM sys_role WHERE sys_role.`parent_id` = (SELECT sys_user.`company_id` FROM sys_user WHERE sys_user.`user_id` = '" +
				uid + "') AND sys_role.`function_id` = '2') and status = '0' group by user_id"
			selectSQL("local", excelSql, excelRes => {
				let excelList = excelRes
				selectSQL("local", catrgorySql, catrgoryRes => {
					if (excelList[0] !== null || excelList !== [] || excelList !== '') {
						if (catrgoryRes[0] !== null || catrgoryRes !== [] || catrgoryRes !==
							'') {
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
							excelList = arr
						}
					}
					selectSQL("local", unitSql, unitRes => {
						let unitList = unitRes;
						selectSQL("local", userSql, userRes => {
							let userId = userRes
							if (excelList[0] == null || excelList == [] ||
								excelList == '') {
								excelList = []
							} else {
								excelList.forEach(item => {
									if (item.type == 2) {
										item.checked = true
										item.name = item.title + "(未归类)"
									} else {
										item.checked = true
										item.name = item.title
									}
								})
							}
							if (unitList[0] == null || unitList == [] ||
								unitList == '') {
								unitList = []
							} else {
								unitList.forEach(item => {
									item.checked = true
									item.name = item.title
									item.id = item.value
								})
							}
							if (userId[0] == null || userId == [] || userId ==
								'') {
								userId = []
							} else {
								userId.forEach(item => {
									item.checked = true
									item.name = item.title
									item.id = item.value
								})
							}
							excelList.forEach(item => {
								item.type = 3
							})
							menuList[0].list = excelList
							menuList[1].list = unitList
							//menuList[2].list = statusList
							menuList[3].list = userId
							menuList.forEach((item, index) => {
								if (item.list == [] || item.list
									.length == 0) {
									menuList.splice(index, 1)
								}
							})
							menuList[0].active = true
							resolve(menuList)
						})
					})
				})
			})
		}
		if (functionid == 2) {
			// statusList.push({
			// 	name: `待审核`,
			// 	checked: false,
			// 	value: "7"
			// }, {
			// 	name: `审核通过`,
			// 	checked: false,
			// 	value: "8"
			// }, {
			// 	name: `复检`,
			// 	checked: false,
			// 	value: "3"
			// }, {
			// 	name: `待整改`,
			// 	checked: false,
			// 	value: "2"
			// }, {
			// 	name: `已整改`,
			// 	checked: false,
			// 	value: "11"
			// })
			statusList.push({
				name: `未开始`,
				checked: true,
				value: "2"
			}, {
				name: `进行中`,
				checked: true,
				value: "3"
			}, {
				name: `已完成`,
				checked: true,
				value: "4"
			}, {
				name: `已延期`,
				checked: true,
				value: "5"
			}, {
				name: `延期完成`,
				checked: true,
				value: "6"
			}, {
				name: `待审核`,
				checked: true,
				value: "7"
			}, {
				name: `已完结`,
				checked: true,
				value: "8"
			}, {
				name: `复检`,
				checked: true,
				value: "9"
			}, {
				name: `整改中`,
				checked: true,
				value: "10"
			}, {
				name: `已归档`,
				checked: true,
				value: "11"
			})
			let type = ''
			if (status == 0) {
				type = "tb_task.type !=2"
				statusList.splice(3, 1)
				statusList.splice(3, 1)
			} else {
				type = "tb_task.type =2"
			}
			taskSql =
				"SELECT tb_task.task_name, tb_task.task_id, tb_task.unit_id FROM tb_task inner JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id  AND tb_task_detail.totlequestion != 0 WHERE (tb_task_detail.group_id = '" +
				uid + "' or tb_task_detail.user_id = '" + uid +
				"' ) and  tb_task.status != '1' AND tb_task_detail.status != 1  AND " + type +
				" group by tb_task.task_id"
			selectSQL("local", taskSql, taskRes => {
				if (taskRes.length == 0) {
					resolve(null)
				} else {
					//查询当前任务下的所有标准
					let normSql = ''
					//单位SQL
					let sql = ''
					taskRes.forEach(item => {
						sql += "'" + item.unit_id + "',"
						normSql += "'" + item.task_id + "',"
						item.checked = true
						item.id = item.task_id
						item.name = item.task_name
					})
					unitSql =
						"SELECT sys_unit.unit_id AS id, sys_unit.unit_name AS name FROM sys_unit WHERE sys_unit.unit_id in ( " +
						sql.substring(
							0, sql.length - 1) + ") group by unit_id"
					selectSQL("local",
						"	select tb_task_detail_norm.norm_id from tb_task_detail_norm where tb_task_detail_norm.task_id in(" +
						normSql.substring(0, normSql.length - 1) + ") group by norm_id",
						excelRess => {
							let excelSqlAfter = ""
							excelRess.forEach(item => {
								excelSqlAfter += "'" + item.norm_id + "',"
							})
							let str = excelSqlAfter.substring(0, excelSqlAfter.length - 1)
							excelSql =
								"select * from (SELECT *FROM ( SELECT tb_norm.norm_id as value, tb_norm.name as title,3 AS type FROM tb_excel LEFT JOIN tb_norm on id = excel_id where 1=1 AND norm_id IN (" +
								excelSqlAfter.substring(0, excelSqlAfter.length - 1) +
								") AND tb_excel.type = '1' ) t UNION ALL SELECT * FROM ( SELECT tb_norm.norm_id as value, tb_norm.name as title, 2 AS type FROM tb_excel LEFT JOIN tb_norm on id = excel_id where 1=1 AND norm_id IN (" +
								excelSqlAfter.substring(0, excelSqlAfter.length - 1) +
								") AND tb_excel.type = '2' ) t) order by type desc"
							selectSQL("local", excelSql, excelRes => {
								let excelList = excelRes
								selectSQL("local", unitSql, unitRes => {
									let unitList = unitRes;
									if (excelList[0] == null || excelList == [] ||
										excelList == '') {
										excelList = []
									} else {
										excelList.forEach(item => {
											if (item.type == 1) {
												item.checked = true
												item.name = item.title
											} else {
												item.checked = true
												item.name = item.title
											}
										})
									}
									if (unitList[0] == null || unitList == [] ||
										unitList == '') {
										unitList = []
									} else {
										unitList.forEach(item => {
											item.checked = true
										})
									}
									menuList[0].list = excelList
									menuList[1].list = unitList
									menuList[2].list = statusList
									menuList[3].list = taskRes
									menuList[3].name = "任务"
									menuList[3].alias = "task"
									menuList[3].listname = "全部任务"
									menuList.forEach((item, index) => {
										if (item.list == [] || item.list
											.length == 0) {
											menuList.splice(index, 1)
										}
									})
									menuList[0].active = true
									resolve(menuList)
								})
							})
						})
				}
			})
		}
		if (functionid == 3) {
			// statusList.push({
			// 	name: `待上报`,
			// 	checked: false,
			// 	value: "4,5"
			// }, {
			// 	name: `待整改`,
			// 	checked: false,
			// 	value: "2"
			// }, {
			// 	name: `已整改`,
			// 	checked: false,
			// 	value: "4,5"
			// }, {
			// 	name: `待审核`,
			// 	checked: false,
			// 	value: "7"
			// }, {
			// 	name: `已归档`,
			// 	checked: false,
			// 	value: "11"
			// })
			statusList.push({
				name: `未开始`,
				checked: true,
				value: "2"
			}, {
				name: `进行中`,
				checked: true,
				value: "3"
			}, {
				name: `已完成`,
				checked: true,
				value: "4"
			}, {
				name: `已延期`,
				checked: true,
				value: "5"
			}, {
				name: `延期完成`,
				checked: true,
				value: "6"
			}, {
				name: `待审核`,
				checked: true,
				value: "7"
			}, {
				name: `已完结`,
				checked: true,
				value: "8"
			}, {
				name: `复检`,
				checked: true,
				value: "9"
			}, {
				name: `整改中`,
				checked: true,
				value: "10"
			}, {
				name: `已归档`,
				checked: true,
				value: "11"
			})
			let type = ''
			if (status == 0) {
				type = "tb_task.type!=2"
				// statusList.splice(1, 1)
				// statusList.splice(1, 1)
			} else {
				type = "tb_task.type=2"
			}
			taskSql =
				"SELECT tb_task.task_name, tb_task.task_id, tb_task.unit_id FROM tb_task LEFT JOIN tb_task_detail ON tb_task.task_id = tb_task_detail.task_id WHERE (tb_task.user_id = '" +
				uid + "' OR tb_task_detail.user_id = '" + uid +
				"') and  tb_task.status != '1' AND tb_task_detail.status != '1' and tb_task_detail.totlequestion != 0 and " +
				type + "  group by tb_task.task_id order by tb_task.created_time DESC"
			selectSQL("local", taskSql, taskRes => {
				if (taskRes.length == 0) {
					resolve(null)
				} else {
					//查询当前任务下的所有标准
					let normSql = ''
					//单位SQL
					let sql = ''
					taskRes.forEach(item => {
						sql += "'" + item.unit_id + "',"
						normSql += "'" + item.task_id + "',"
						item.checked = true
						item.id = item.task_id
						item.name = item.task_name
					})
					unitSql =
						"SELECT sys_unit.unit_id AS id, sys_unit.unit_name AS name FROM sys_unit WHERE sys_unit.unit_id in ( " +
						sql.substring(
							0, sql.length - 1) + ") group by unit_id"
					selectSQL("local",
						"	select tb_task_detail_norm.norm_id from tb_task_detail_norm where tb_task_detail_norm.task_id in(" +
						normSql.substring(0, normSql.length - 1) + ") group by norm_id",
						excelRess => {
							let excelSqlAfter = ""
							excelRess.forEach(item => {
								excelSqlAfter += "'" + item.norm_id + "',"
							})
							let str = excelSqlAfter.substring(0, excelSqlAfter.length - 1)
							excelSql =
								"SELECT * FROM ( SELECT tb_norm.norm_id as value, tb_norm.name as title, 1 AS type FROM tb_excel LEFT JOIN tb_norm on id = excel_id where 1=1  AND norm_id IN (" +
								str +
								") AND tb_excel.type = '1' ) t UNION ALL SELECT * FROM ( SELECT tb_norm.norm_id as value, tb_norm.name as title, 2 AS type FROM tb_excel LEFT JOIN tb_norm on id = excel_id where 1=1 AND norm_id IN (" +
								str +
								") AND tb_excel.type = '2' ) group by value order by type desc"
							selectSQL("local", excelSql, excelRes => {
								let excelList = excelRes
								selectSQL("local", unitSql, unitRes => {
									let unitList = unitRes;
									if (excelList[0] == null || excelList == [] ||
										excelList == '') {
										excelList = []
									} else {
										excelList.forEach(item => {
											if (item.type == 1) {
												item.checked = true
												item.name = item.title
											} else {
												item.checked = true
												item.name = item.title
											}
										})
									}
									if (unitList[0] == null || unitList == [] ||
										unitList == '') {
										unitList = []
									} else {
										unitList.forEach(item => {
											item.checked = true
										})
									}
									menuList[0].list = excelList
									menuList[1].list = unitList
									menuList[2].list = statusList
									menuList[3].list = taskRes
									menuList[3].name = "任务"
									menuList[3].alias = "task"
									menuList[3].listname = "全部任务"
									menuList.forEach((item, index) => {
										if (item.list == [] || item.list
											.length == 0) {
											menuList.splice(index, 1)
										}
									})
									menuList[0].active = true
									resolve(menuList)
								})
							})
						})
				}
			})
		}
	})
}

/**
 * 查询问题下面的问题项
 * @param {Object} task_id
 * @param {Object} functionid
 */
export function quertTaskIssueList(isFlag, task_id, functionid, userId) {
	return new Promise(resolve => {
		if (functionid == 1) {
			//查询问题详情
			// let sql2 ="SELECT tb_task_detail_norm_detail.serial, tb_task_detail_checkrow.status, t.*, tb_task_detail.name AS username, tb_task_detail_norm_detail.item , tb_task_detail_checkrow.score, tb_task_detail_checkrow.content, tb_task_detail_checkrow.problempicture, tb_task_detail_checkrow.remark, tb_task_detail_checkrow.updatetime as checkTime,tb_task_detail_norm.name AS normName,tb_task_detail_checkrow.correct as rectifyMes,tb_task_detail_checkrow.correctremark as rectifyRemark,tb_task_detail_checkrow.correctpicture,tb_task_detail_checkrow.norm_row_id FROM ( SELECT sys_unit.unit_name AS unitName, tb_task.task_id FROM tb_task INNER JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id AND tb_task.task_id = '" +task_id +"' ) t INNER JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON t.task_id = tb_task_detail.task_id AND tb_task_detail.user_id IN ('" +userId +"') LEFT JOIN ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item, tb_norm_detail.serial FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_norm_detail_row LEFT JOIN tb_task_detail_checkrow ON tb_norm_detail_row.id = tb_task_detail_checkrow.norm_row_id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND score_type = 1 AND tb_task_detail_checkrow.score > 0"
			let sql2 = "SELECT t.*, e.Asname,e.updatetime FROM ( SELECT tb_task_detail_norm_detail.serial, tb_task_detail_checkrow.status, t.*, tb_task_detail.name AS username, tb_task_detail_norm_detail.item , tb_task_detail_checkrow.score, tb_task_detail_checkrow.content, tb_task_detail_checkrow.problempicture, tb_task_detail_checkrow.remark, tb_task_detail_checkrow.updatetime AS checkTime , tb_task_detail_norm.name AS normName, tb_task_detail_checkrow.correct AS rectifyMes, tb_task_detail_checkrow.correctremark AS rectifyRemark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.norm_row_id FROM ( SELECT sys_unit.unit_name AS unitName, tb_task.task_id FROM tb_task INNER JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id AND tb_task.task_id = '" +task_id +"'  ) t INNER JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON t.task_id = tb_task_detail.task_id AND tb_task_detail.user_id IN ('" +userId +"') LEFT JOIN ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item, tb_norm_detail.serial FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_norm_detail_row LEFT JOIN tb_task_detail_checkrow ON tb_norm_detail_row.id = tb_task_detail_checkrow.norm_row_id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND score_type = 1 AND tb_task_detail_checkrow.score > 0 ) t LEFT JOIN ( SELECT tb_task_detail.name AS Asname, tb_task_detail_checkrow.norm_row_id,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND tb_task.task_id = '" +task_id +"'  ) e ON t.norm_row_id = e.norm_row_id where 1=1  order by serial asc,content asc"
			selectSQL("local", sql2, resssss => {
				resssss.forEach(item=>{
					if(item.Asname!=null){
						item.username=item.Asname
						item.checkTime=item.updatetime
					}
				})
				if (isFlag == 0) {
					resssss.forEach(val => {
						let img = []
						if (val.problempicture.length != 0) {
							let url = val.problempicture.split(",")
							url.forEach(entry => {
								img.push({
									image: entry,
									title: entry
								})
							})
						}
						val.issueImage = img
					})
					resolve(resssss)
				} else {
					let i = 0;
					resssss.forEach(val => {
						val.rectifyTime = val.checkTime
						let img1 = []
						if (val.problempicture.length != 0) {
							let url1 = val.problempicture.split(",")
							url1.forEach(entry => {
								img1.push({
									image: entry,
									title: entry
								})
							})
						}
						val.issueImage = img1
						let img = []
						if (val.correctpicture.length != 0) {
							let url = val.correctpicture.split(",")
							url.forEach(entry => {
								img.push({
									image: entry,
									title: entry
								})
							})
						}
						val.rectifyImage = img
							resolve(resssss)
					})
				}
			})
		}

		if (functionid == 2) {
			let sql2 ="SELECT t.*, e.Asname,e.updatetime FROM ( SELECT tb_task_detail_norm_detail.serial, tb_task_detail_checkrow.status, 	tb_task_detail_norm_detail.status as astatus, t.*, tb_task_detail.name AS username, tb_task_detail_norm_detail.item , tb_task_detail_checkrow.score, tb_task_detail_checkrow.content, tb_task_detail_checkrow.problempicture, tb_task_detail_checkrow.remark, tb_task_detail_checkrow.updatetime AS checkTime , tb_task_detail_norm.name AS normName, tb_task_detail_checkrow.correct AS rectifyMes, tb_task_detail_checkrow.correctremark AS rectifyRemark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.norm_row_id FROM ( SELECT sys_unit.unit_name AS unitName, tb_task.task_id FROM tb_task INNER JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id AND tb_task.task_id =  '" +task_id +"' ) t INNER JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON t.task_id = tb_task_detail.task_id AND tb_task_detail.user_id IN ('" +userId +"') LEFT JOIN ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item, tb_norm_detail.serial FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_norm_detail_row LEFT JOIN tb_task_detail_checkrow ON tb_norm_detail_row.id = tb_task_detail_checkrow.norm_row_id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND score_type = 1 AND tb_task_detail_checkrow.score > 0 ) t LEFT JOIN ( SELECT tb_task_detail.name AS Asname, tb_task_detail_checkrow.norm_row_id,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND tb_task.task_id =  '" +task_id +"' ) e ON t.norm_row_id = e.norm_row_id order by serial asc,content asc"
			selectSQL("local", sql2, resssss => {
				resssss.forEach(item=>{
					if(item.Asname!=null){
						item.username=item.Asname
						item.checkTime=item.updatetime
					}
				})
				if (isFlag == 0) {
					resssss.forEach(val => {
						let img = []
						if (val.problempicture.length != 0) {
							let url = val.problempicture.split(",")
							url.forEach(entry => {
								img.push({
									image: entry,
									title: entry
								})
							})
						}
						val.issueImage = img
					})
					resolve(resssss)
				} else {
					//把别的任务也弄进来
					selectSQL("local", "SELECT t.*, e.Asname,e.updatetime FROM ( SELECT tb_task_detail_norm_detail.serial, tb_task_detail_checkrow.status, 	tb_task_detail_norm_detail.status as astatus, t.*, tb_task_detail.name AS username, tb_task_detail_norm_detail.item , tb_task_detail_checkrow.score, tb_task_detail_checkrow.content, tb_task_detail_checkrow.problempicture, tb_task_detail_checkrow.remark, tb_task_detail_checkrow.updatetime AS checkTime , tb_task_detail_norm.name AS normName, tb_task_detail_checkrow.correct AS rectifyMes, tb_task_detail_checkrow.correctremark AS rectifyRemark, tb_task_detail_checkrow.correctpicture, tb_task_detail_checkrow.norm_row_id FROM ( SELECT sys_unit.unit_name AS unitName, tb_task.task_id FROM tb_task INNER JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id AND tb_task.task_id =  '" +task_id +"' ) t INNER JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON t.task_id = tb_task_detail.task_id AND tb_task_detail.user_id not  IN ('" +userId +"') and  tb_task_detail.status not  in (7, 8, 9, 10, 11) LEFT JOIN ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item, tb_norm_detail.serial FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_norm_detail_row LEFT JOIN tb_task_detail_checkrow ON tb_norm_detail_row.id = tb_task_detail_checkrow.norm_row_id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND score_type = 1 AND tb_task_detail_checkrow.score > 0 ) t LEFT JOIN ( SELECT tb_task_detail.name AS Asname, tb_task_detail_checkrow.norm_row_id,tb_task_detail_checkrow.updatetime FROM tb_task LEFT JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON tb_task.task_id = tb_task_detail.task_id LEFT JOIN tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid LEFT JOIN tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid WHERE tb_task_detail.user_id != tb_task.user_id AND tb_task.task_id =  '" +task_id +"' ) e ON t.norm_row_id = e.norm_row_id order by serial asc,content asc", ressssscc => {
						ressssscc.forEach(item=>{
							item.astatus='0'
							item.correctpicture=[]
							item.rectifyRemark=null
						})
						resssss = resssss.concat(ressssscc)
						let i = 0;
						resssss.forEach(val => {
							if(val.astatus==0){
								val.rectifyTime = null
							}else{
								val.rectifyTime = val.checkTime
							}
							let img1 = []
							if (val.problempicture.length != 0) {
								let url1 = val.problempicture.split(",")
								url1.forEach(entry => {
									img1.push({
										image: entry,
										title: entry
									})
								})
							}
							val.issueImage = img1
							let img = []
							if (val.correctpicture.length != 0) {
								let url = val.correctpicture.split(",")
								url.forEach(entry => {
									img.push({
										image: entry,
										title: entry
									})
								})
							}
							val.rectifyImage = img
						})
						resolve(resssss)
					})
				}
			})
		}

		if (functionid == 3) {
			//查询问题详情
			let sql2 =
				"SELECT tb_task_detail_norm_detail.serial, tb_task_detail_checkrow.status, tb_task_detail_norm_detail.status as astatus,t.*, tb_task_detail.name AS username, tb_task_detail_norm_detail.item , tb_task_detail_checkrow.score, tb_task_detail_checkrow.content, tb_task_detail_checkrow.problempicture, tb_task_detail_checkrow.remark, tb_task_detail_checkrow.updatetime as checkTime,tb_task_detail_norm.name AS normName,tb_task_detail_checkrow.correct as rectifyMes,tb_task_detail_checkrow.correctremark as rectifyRemark,tb_task_detail_checkrow.correctpicture,tb_task_detail_checkrow.norm_row_id FROM ( SELECT sys_unit.unit_name AS unitName, tb_task.task_id FROM tb_task INNER JOIN sys_unit ON tb_task.unit_id = sys_unit.unit_id AND tb_task.task_id = '" +
				task_id +
				"' ) t INNER JOIN ( SELECT tb_task_detail.*, sys_user.name FROM sys_user LEFT JOIN tb_task_detail ON sys_user.user_id = tb_task_detail.user_id ) tb_task_detail ON t.task_id = tb_task_detail.task_id AND tb_task_detail.user_id = '" +
				uni.getStorageSync("USER_ID") +
				"' LEFT JOIN ( SELECT tb_task_detail_norm.*, tb_norm.name FROM tb_norm LEFT JOIN tb_task_detail_norm ON tb_norm.norm_id = tb_task_detail_norm.norm_id ) tb_task_detail_norm ON tb_task_detail.taskdetail_id = tb_task_detail_norm.taskdetail_id LEFT JOIN ( SELECT tb_task_detail_norm_detail.*, tb_norm_detail.item, tb_norm_detail.serial FROM tb_norm_detail LEFT JOIN tb_task_detail_norm_detail ON tb_norm_detail.id = tb_task_detail_norm_detail.norm_detail_id ) tb_task_detail_norm_detail ON tb_task_detail_norm.tasknormid = tb_task_detail_norm_detail.tasknormid INNER JOIN ( SELECT tb_task_detail_checkrow.*, tb_norm_detail_row.content FROM tb_norm_detail_row LEFT JOIN tb_task_detail_checkrow ON tb_norm_detail_row.id = tb_task_detail_checkrow.norm_row_id ) tb_task_detail_checkrow ON tb_task_detail_norm_detail.tasknormdetailid = tb_task_detail_checkrow.tasknormdetailid AND score_type = 1 AND tb_task_detail_checkrow.score > 0 where 1=1 order by serial asc,content asc"
			selectSQL("local", sql2, resssss => {
				if (isFlag == 0) {
					resssss.forEach(val => {
						let img = []
						if (val.problempicture.length != 0) {
							let url = val.problempicture.split(",")
							url.forEach(entry => {
								img.push({
									image: entry,
									title: entry
								})
							})
						}
						val.issueImage = img
					})
					resolve(resssss)
				} else {
					let i = 0;
					resssss.forEach(val => {
						if(val.astatus=="0"){
							val.rectifyTime = null
						}else{
							val.rectifyTime = val.checkTime
						}
						let img1 = []
						if (val.problempicture.length != 0) {
							let url1 = val.problempicture.split(",")
							url1.forEach(entry => {
								img1.push({
									image: entry,
									title: entry
								})
							})
						}
						val.issueImage = img1
						let img = []
						if (val.correctpicture.length != 0) {
							let url = val.correctpicture.split(",")
							url.forEach(entry => {
								img.push({
									image: entry,
									title: entry
								})
							})
						}
						val.rectifyImage = img
						resolve(resssss)
					})
				}
			})
		}
	})
}

/**
 * 导出问题数据
 * @param {Object} list
 */
export function exportProblem(taskName, id) {
	//数据组装
	let jsonData = [{
			"id": 1,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "专项工作",
			"content": "查阅资料：参评站上报以三年为周期：第一年选取变电站总量的1/3作为参评站,第二年选取变电站总量的2/3（包含第一年）作为参评站，第三年选取变电站总量的全部作为参评站上报。",
			"majorCategory": "精益化检查评价",
			"smallCategory": "参评站",
			"questionItem": "1.上报变电站总量未达要求的，扣50分。",
			"serial": 1.1,
			"score": "-5",
			"questionNotes": "扣5",
			"questionNature": "一般",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:22:35",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1

		},
		{
			"id": 2,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "专项工作",
			"content": "查阅资料：未按要求完成省调发布的全年自动化专业重点工作和安全生产会等会议和文件安排的重点工作，每项扣10-50 分。",
			"majorCategory": "重点工作评价",
			"smallCategory": "重点工作",
			"questionItem": "1.未按要求完成省调发布的全年自动化专业重点工作和安全生产会等会议和文件安排的重点工作，扣50分/项。",
			"serial": 3.1,
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:23:13",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 3,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "专项工作",
			"content": "查阅资料：未按要求报送系统、设备问题信息或上级安排的数据资料报表，瞒报、漏报一条问题信息扣10分，未按时报送数据资料一次扣5分，报送质量不符合要求一次扣5分。",
			"majorCategory": "重点工作评价",
			"smallCategory": "信息上报",
			"questionItem": "1.瞒报、漏报问题信息扣10分/条",
			"serial": 3.2,
			"score": "-10",
			"questionNotes": "扣10",
			"questionNature": "一般",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:23:23",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1
		},
		{
			"id": 4,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "专项工作",
			"content": "查阅资料：入选公司典型经验，每项加10分",
			"majorCategory": "专业贡献评价",
			"smallCategory": "典型经验贡献",
			"questionItem": "1.入选公司典型经验，加10分/项，加分不超过20分。",
			"serial": 4.2,
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:23:28",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 5,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "专项工作",
			"content": "查阅资料：派遣专家参与自动化专业精益化管理评价，发现问题质量和数量排名前10名的专家，所属单位省公司精益化管理得分加3-30分（每名级差为3分），最高加30分。",
			"majorCategory": "专业贡献评价",
			"smallCategory": "专家贡献",
			"questionItem": "1.按照排名情况进行加分。",
			"serial": 4.3,
			"score": 10,
			"questionNotes": "加10",
			"questionNature": "一般",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:23:48",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 3,
			"Flag": 1
		},
		{
			"id": 6,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：调度技术支持系统硬件配置应遵循冗余化的原则，系统采用双重化网络结构，承担主要任务的服务器应采用双机或多机集群方式互为热备用。1.检查系统是否采用双重化网络结构；2.承担主要任务的服务器是否采用双机或多机集群方式互为热备用。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "硬件基础性能",
			"questionItem": "2.核心服务器未采用双机或多机集群方式互为热备用，扣2分。",
			"serial": "1.1.2.1",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:24:02",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 7,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：调度技术支持系统具备分布式系统管理功能，实现对整个系统中设备、应用功能及权限等的分布式管理。1.通过管理工具,检查系统是否能对所有进程进行分级分类管理；是否能定义、增改、启停、转移实时任务作业；2.是否能监视网络状况；3.能否通过管理工具，配置系统各节点的运行方式（包括各服务模块运行何处、热/冷备用配置、自启动协调和监视、故障时的切换策略）；4.是否能监视和记录系统中计算、存储和内部通信资源的关键性能参数及使用情况。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "系统管理功能",
			"questionItem": "1.系统不能对所有进程进行分级分类管理，扣3分",
			"serial": "1.1.2.2",
			"score": "-3",
			"questionNotes": "扣3，严重",
			"questionNature": "严重",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:24:17",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1
		},
		{
			"id": 8,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：调度自动化主站系统应能显示实时与历史数据。1.通过人机界面，抽检SCADA/EMS系统的画面显示、历史数据调用功能是否正常；2.计划曲线、地区、各县总加及负荷曲线是否正确；3.地区负荷数据是否刷新。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "实时与历史数据",
			"questionItem": "3.地区负荷数据未刷新，扣2分/处。",
			"serial": "1.1.2.3",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:24:18",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 9,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：检查系统关键进程是否正常(包括SCADA、FES、PUBLIC、PAS、AVC应用，是否发生过切换。查阅资料：检查运行巡视记录，主备机定期切换试验记录（每年不低于2次）。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "系统关键进程及应用",
			"questionItem": "1.系统关键进程异常，扣5分/处",
			"serial": "1.1.2.4",
			"score": "-5",
			"questionNotes": "关键进程异常",
			"questionNature": "严重",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:24:35",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1
		},
		{
			"id": 10,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：调度自动化主站应安装防病毒软件且病毒库应定期离线更新。1.检查主站各系统防病毒软件是否运行正常；2.病毒库是否正常更新。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "防病毒软件",
			"questionItem": "1.windows操作系统计算机未安装杀毒软件，扣2分/台",
			"serial": "1.1.2.6",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:24:36",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 11,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：调度自动化主站应安装防病毒软件且病毒库应定期离线更新。1.检查主站各系统防病毒软件是否运行正常；2.病毒库是否正常更新。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "防病毒软件",
			"questionItem": "2.病毒库未定期离线更新，扣1分/台。",
			"serial": "1.1.2.6",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:24:36",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 12,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：监视与告警全网运行工况监视，系统厂站主接线画面应与实际电气接线一致（抽查厂站数不低于总厂站数的10%）。1.现场检查调度自动化系统中厂站主接线图；2.检查是否具备有、无功功率量值，方向是否正确,相应母线及线路运行状态是否正确，是否具备电网频率、电压、时钟实时信息；3.总加类数据是否有跳变。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "全网运行工况监视",
			"questionItem": "3.总加类数据有跳变，扣1分/处。",
			"serial": "1.1.4.1",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:25:15",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 13,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：抽取调度自动化系统中电网概况相关画面，应可从画面中直接调取调度自动化系统中重要数据的曲线，显示其日曲线、月曲线或年曲线及相应极大极小值，可方便地以表格形式显示曲线数据；不同数据曲线进行叠加比较时应清晰直观。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "曲线管理",
			"questionItem": "1.曲线调阅异常,扣1分/处。",
			"serial": "1.1.4.2",
			"score": "-1",
			"questionNotes": "扣1",
			"questionNature": "一般",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:25:24",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1
		},
		{
			"id": 14,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：监视与告警实现面向电力系统网络的功能，具备一定的智能分析和处理能力，至少实现网络拓扑着色等功能。随机抽取调度自动化系统中重要厂站电气接线图检查，画面应体现网络拓扑着色功能。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "系统网络功能",
			"questionItem": "1.拓扑着色异常,扣2分。",
			"serial": "1.1.4.3",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:25:25",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 15,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：监视与告警实现重要线路及断面潮流越稳定限额和频率越限告警，可根据开关变位等异常工况自动推出相应的事故画面。1.系统可通过与预设的潮流断面限值进行比较断面越稳定限额，或通过计算与已维护的电气参数比较判断越稳定限额，并在系统告警区域中弹出报警信息；2.在厂站现场检查时通过远动系统模拟事故情况，检查主站是否具备事故推画面功能。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "工况异常报警",
			"questionItem": "1.遥测数据越限,未告警,扣2分",
			"serial": "1.1.4.4",
			"score": "-2",
			"questionNotes": "扣2",
			"questionNature": "一般",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:25:33",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1
		},
		{
			"id": 16,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：检查接收省调转发数据、计划负荷数据是否正常，是否存在跳变、不刷新、归零现象。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "数据状况管理",
			"questionItem": "1.接收省调转发数据、计划负荷数据异常(包括跳变、不刷新、归零），扣2分/处。",
			"serial": "1.1.4.5",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:25:34",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 17,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：查询系统存储的SOE记录，并按时间进行排序和分析，确保SOE记录正确有效。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "事件顺序记录管理",
			"questionItem": "1.SOE自带时标与实际时间不一致（多少时间算不一致）,扣1分/处。",
			"serial": "1.1.4.6",
			"score": "-1",
			"questionNotes": "扣1",
			"questionNature": "一般",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:25:42",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1
		},
		{
			"id": 18,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：状态估计启动方式应包括周期启动、人工启动和事件启动，各种控制参数可以修改。检查状态估计是否具备周期启动、人工启动和事件启动，各种控制参数是否可以修改。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "启动方式",
			"questionItem": "2.控制参数无法修改，扣2分。",
			"serial": "1.1.5.3",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:25:50",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		},
		{
			"id": 19,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：检查对所有节点数≥5的活电气岛均可进行状态估计计算，并根据计算结果进行量测误差统计，在界面上进行分类显示。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "量测误差统计",
			"questionItem": "1.不具备该功能，扣2分。",
			"serial": "1.1.5.4",
			"score": "-2",
			"questionNotes": "不具备该功能，扣2",
			"questionNature": "一般",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:26:06",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 2,
			"Flag": 1
		},
		{
			"id": 20,
			"taskName": "测试任务新",
			"taskType": "",
			"unitName": "绵阳公司",
			"unitChildName": "",
			"standard": "主站",
			"content": "现场检查：核实6个月指标的完成情况，包括状态估计月可用率、遥测估计合格率、电压残差平均值、单次状态估计计算时间。",
			"majorCategory": "电网调度控制系统（500分）",
			"smallCategory": "指标核查",
			"questionItem": "1.状态估计月可用率＜95％，每低1%扣1分",
			"serial": "1.1.5.5",
			"score": 0,
			"questionNotes": "",
			"questionNature": "",
			"inspectors": "王德发/18109078512",
			"group": "",
			"startTime": "2020-08-14 00:00:00",
			"endTime": "2020-10-14 00:00:00",
			"address": "",
			"inspectionTime": "2020-08-14 10:26:06",
			"rectifyReform": "",
			"rectifyTime": "",
			"rectifyInspectors": "",
			"rectifyPerson": "",
			"rectifyAction": "",
			"rectifyRemarks": "",
			"isFlag": 1,
			"Flag": 1
		}
	]
	let worksheet = taskName + "问题数据";
	let fileName = taskName + ":问题数据+" + dateFormat("mm-dd HH:MM:SS", new Date()) + "." + "xlsx"
	//status
	let status = 1
	return new Promise(resolve => {
		//下载模板
		importData(jsonData, status, worksheet, fileName, res => {
			resolve(res)
		})
	})
}

/**
 * 时间格式化
 * @param {Object} fmt
 * @param {Object} date
 */
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
