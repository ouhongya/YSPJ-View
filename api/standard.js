import {
	openComDB,
	closeComDB,
	executeSQL,
	selectSQL,
	transaction
} from '@/common/local.js'

const REGEX_FILENAME = /^.*[/]/;
const SAVED_DIR = '/storage/emulated/0/验收评价/标准模板/';

/**
 * 查询excel列表
 * @param {Object} page
 * @param {Object} saerch
 * @param {Object} size
 * @param {Object} id
 */
export function queryExcelList(page, size, categort_id, saerch, id) {
	return new Promise((resolve, reject) => {
		let currentPage = (page - 1) * size;
		let searchSql = "";
		if (saerch != null && saerch != '') {
			searchSql = " and t.name  LIKE '%" + saerch + "%'"
		}
		let categortSql = "";
		if (categort_id != null && categort_id != '') {
			categortSql = " and  tb_excel_category.id = '" + categort_id + "'"
		}
		//领导还是下属上传的东西
		
		let type =""
		let user =uni.getStorageSync("USER_ID")
		let sql = ""
		let sql2 = ""
		if(uni.getStorageSync("functionid")==1){
			type = "(type = 1)"
			user=" user_id IN (SELECT sys_user.user_id FROM sys_user WHERE company_id IN (SELECT company_id FROM sys_user WHERE user_id = '" +id +"'))"
			sql ="SELECT t.id, t.name, t.status, t.view, t.totlecheck as size, t.user_id, t.categort_id, t.created_time, tb_excel_category.name AS categoryName FROM (SELECT id,user_id, name, status, view, totlecheck, categort_id, created_time FROM tb_excel WHERE  "+user+" AND STATUS !='1'  AND "+type+") t LEFT JOIN tb_excel_category ON categort_id = tb_excel_category.id WHERE 1=1 " +categortSql + "" + searchSql + " ORDER BY t.created_time DESC   LIMIT " + currentPage + "," + size
			sql2 ="SELECT count(t.id) as num FROM (SELECT id,user_id, name, status, view, size, categort_id, created_time FROM tb_excel WHERE   "+user+"  AND STATUS !='1' AND "+type+") t LEFT JOIN tb_excel_category ON categort_id = tb_excel_category.id WHERE 1=1 " +categortSql + "" + searchSql + " ORDER BY t.created_time DESC"
		}else if (uni.getStorageSync("functionid")==3){
			type = "(type = 2)"
			user = "(user_id = '"+id+"')"
			sql ="SELECT t.id, t.name, t.status, t.view, t.totlecheck as size, t.user_id, t.categort_id, t.created_time, tb_excel_category.name AS categoryName FROM (SELECT id,user_id, name, status, view, totlecheck, categort_id, created_time FROM tb_excel WHERE  "+user+" AND STATUS !='1'  AND "+type+") t LEFT JOIN tb_excel_category ON categort_id = tb_excel_category.id WHERE 1=1 " +categortSql + "" + searchSql + " ORDER BY t.created_time DESC   LIMIT " + currentPage + "," + size
			sql2 ="SELECT count(t.id) as num FROM (SELECT id,user_id, name, status, view, size, categort_id, created_time FROM tb_excel WHERE   "+user+"  AND STATUS !='1' AND "+type+") t LEFT JOIN tb_excel_category ON categort_id = tb_excel_category.id WHERE 1=1 " +categortSql + "" + searchSql + " ORDER BY t.created_time DESC"
		}else{
			sql ="SELECT t.id, t.name, t.status, t.view, t.totlecheck as size, t.user_id, t.categort_id, t.created_time, tb_excel_category.name AS categoryName FROM (SELECT 1 as num, id, user_id, name, status, view , totlecheck, categort_id, created_time FROM tb_excel WHERE user_id = '"+user+"' AND STATUS != '1' AND type = 2 UNION SELECT 2 as num,  id, tb_excel.user_id, name, tb_excel.status, view , totlecheck, categort_id, created_time FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel_user.user_id = '"+user+"' AND tb_excel.STATUS != '1' AND tb_excel.type = 1 and tb_excel_user.status = 0) t LEFT JOIN tb_excel_category ON categort_id = tb_excel_category.id WHERE 1=1 " +categortSql + "" + searchSql + " ORDER BY num ASC , t.created_time DESC   LIMIT " + currentPage + "," + size
			sql2 ="SELECT count(t.id) as num FROM (SELECT id, user_id, name, status, view , totlecheck, categort_id, created_time FROM tb_excel WHERE user_id = '"+user+"' AND STATUS != '1' AND type = 2 UNION SELECT id, tb_excel.user_id, name, tb_excel.status, view , totlecheck, categort_id, created_time FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel_user.user_id = '"+user+"' AND tb_excel.STATUS != '1' AND tb_excel.type = 1 and tb_excel_user.status = 0) t LEFT JOIN tb_excel_category ON categort_id = tb_excel_category.id WHERE 1=1 " +categortSql + "" + searchSql + " ORDER BY t.created_time DESC"
		}
		selectSQL("local", sql, res => {
			if (res.length != 0 && res) {
				selectSQL('local', sql2, res2 => {
					if (res2.length != 0 && res2) {
						let totalCount = res2[0].num;
						let pageNum = totalCount / size;
						let surplus = totalCount % size;
						if (surplus > 0) {
							pageNum = pageNum + 1;
						}
						let list = res
						let index = 0
						let indexs =list.length
						list[0].total = Math.floor(pageNum)
						for(let i=0;i<list.length;i++){
							if (list[i].user_id == id) {
								list[i].isFlag = true
							} else {
								list[i].isFlag = false
							}
							personnelEcho(list[i].id).then(resc=>{
								index+=1
								if(resc.length==1&&resc[0]==""){
									list[i].view='1'
								}
								if(index ==indexs){
									resolve(list);
								}
							})
						}
					}
				})
			} else {
				resolve(null);
			}
		})
	})
}

/**
 * 编辑excel数据回显功能
 * @param {Object} id
 */
export function editExcal(id) {
	return new Promise((resolve, reject) => {
		selectSQL("local",
			"SELECT  tb_excel.`id`,tb_excel.`categort_id`,tb_excel.`name`,tb_excel.`isCategory`  FROM tb_excel  WHERE tb_excel.`id` = '" +
			id + "'", res1 => {
				selectSQL("local",
					"SELECT sys_user.user_id, sys_user.role_id, sys_role.function_id FROM sys_user LEFT JOIN sys_role ON sys_user.role_id = sys_role.role_id WHERE user_id in ( SELECT user_id FROM tb_excel_user WHERE excel_id = '" +
					id + "' AND status = '0' ) AND function_id = '1' group by user_id", res2 => {
						if (res2.length != 0) {
							resolve(res1[0])
						}
						let arr = res2.map(item => {
							return item.user_id
						}).join(",").split(",")
						res1[0].user_id = arr
						resolve(res1[0])
					})
			})
	})
}

/**
 * 编辑excel
 * @param {Object} obj
 */
export function renameExcel(obj, flag) {
	return new Promise((resolve, reject) => {
		//页面传的值
		let userIds = obj.user_id
		//查询是否重名了
		selectSQL("local", "select  count(id) as num  from tb_excel where name = '" + obj.name +
			"' and status != '1' and id != '" + obj.id + "'",
			response => {
				if (obj.categort_id === [] || obj.categort_id == null || obj.categort_id === '') {
					obj.type = 1
				} else {
					obj.type = 0
				}
				if (response[0].num == 0) {
					let sql = "update  tb_excel set  name='" + obj.name + "',isCategory='" + obj.type + "',categort_id='" + obj.categort_id +
						"',direty='1','delete'='0',updatetime = '" + new Date().getTime() + "' where id = '" + obj.id + "'"
					executeSQL("local", sql, res => {
						//查询之前下发的专责列表
						selectSQL("local",
							"SELECT sys_user.user_id, sys_user.role_id, sys_role.function_id FROM sys_user LEFT JOIN sys_role ON sys_user.role_id = sys_role.role_id WHERE user_id in ( SELECT user_id FROM tb_excel_user WHERE excel_id = '" +
							obj.id + "' AND status = '0' ) AND function_id = '1' group by user_id", res1 => {
								//数据库的值
								let arr = res1.map((obj11, index) => {
									return obj11.user_id;
								}).join(",").split(',')
								let arrEqual = getArrEqual(userIds, arr);
								//数据库不同的值
								let arrDifference = getArrDifference(arr, arrEqual);
								//页面不同的值
								let difference = getArrDifference(arrEqual, userIds);
								if (arrDifference.length === 0 && difference.length === 0) {
									resolve(true)
								}
								let r = 0;
								if (arrDifference.length !== 0) {
									let str = ""
									arrDifference.forEach(val => {
										str += "'" + val + "',"

									})
									let instr = str.substring(0, str.length - 1)
									let excel_user_sql = "update tb_excel_user set status='1' , 'delete'='1',updatetime = '" +
										new Date().getTime() + "' where excel_id='" + obj.id + "' and user_id in (" + instr + ")"
									executeSQL("local", excel_user_sql, res6 => {
										r += arrDifference.length;
										if (r === (difference.length + arrDifference.length)) {
											resolve(true)
										}
									})
								}
								if (difference.length !== 0) {
									difference.forEach(item => {
										executeSQL("local","insert into tb_excel_user (excel_id,user_id,status,direty,'delete',updatetime) values ('" + obj.id +"','" + item + "','0','1','0','" + new Date().getTime() + "')", res7 => {
												r += 1;
												if (r === (difference.length + arrDifference.length)) {
													resolve(true)
												}
											})
									})
								}
							})
					})
				} else {
					resolve(false)
				}
			})
	})
}

/**
 * 启用/停用excel
 * @param {Object} id
 */
export function enableExcel(id, falg) {
	return new Promise((resolve, reject) => {
		let status = 0
		if (falg === 1) status = 2
		if (falg === 2) status = 0
		let sql = "update tb_excel set status='" + status + "' , direty = '1' ,'delete'='0',updatetime='" + new Date().getTime() +
			"' where id = '" + id + "'"
		executeSQL("local", sql, res => {
			resolve(true)
		})
	})
}

/**
 * 删除/批量删除excel
 * @param {Object} ids
 */
export function deleteExcel(ids) {
	return new Promise((resolve, reject) => {
		let r = 0;
		ids.forEach(item => {
			executeSQL("local", "update tb_excel set status='1','delete'='1',updatetime='" + new Date().getTime() +"' where id = '" + item + "'", res => {
					executeSQL("local", "update tb_excel_user set status='1', 'delete'='1',updatetime='" + new Date().getTime() +"' where excel_id = '" + item + "'", res1=> {
							r += 1;
							if (r === ids.length) {
								resolve("操作成功")
							}
						})
					
				})
		})
	})
}

/**
 * 查询公司下的专责和组员列表
 * @param {Object} id
 */
export function queryCompanyGroup(id) {
	let userList = {}
	return new Promise((resolve, reject) => {
		//专责
		selectSQL("local","SELECT sys_user.`user_id` AS id, sys_user.`name` as text FROM sys_user WHERE sys_user.`role_id` IN (SELECT sys_role.`role_id` FROM sys_role WHERE sys_role.`parent_id` = (SELECT sys_user.`company_id` FROM sys_user WHERE sys_user.`user_id` = '" +id + "') AND sys_role.`function_id` = '1') and status = '0' and sys_user.company_id='"+uni.getStorageSync("company_id")+"'  group by user_id", res1 => {
				userList.leader = res1
				//组员
				selectSQL("local",
					"SELECT sys_user.`user_id` AS id, sys_user.`name` ,'组长' as job,'false' as checked FROM sys_user WHERE sys_user.`role_id` IN (SELECT sys_role.`role_id` FROM sys_role WHERE sys_role.`parent_id` = (SELECT sys_user.`company_id` FROM sys_user WHERE sys_user.`user_id` = '" +id + "') AND sys_role.`function_id` = '2') and status = '0' and sys_user.company_id='"+uni.getStorageSync("company_id")+"' group by user_id", res2 => {
						userList.group = res2
						resolve(userList)
					})
			})
	})
}

/**
 * 下发数据回显
 * @param {Object} id
 */
export function personnelEcho(id) {
	return new Promise((resolve, reject) => {
		selectSQL("local",
			"SELECT sys_user.user_id,sys_user.status, sys_user.role_id, sys_role.function_id FROM sys_user LEFT JOIN sys_role ON sys_user.role_id = sys_role.role_id WHERE user_id in ( SELECT user_id FROM tb_excel_user WHERE excel_id = '" +id + "' AND status = '0' ) and function_id = '2' and sys_user.status = '0'  group by sys_user.user_id ", res => {
				let arr = res.map(item => {
					return item.user_id
				}).join(",").split(",")
				resolve(arr)
			})
	})
}

/**
 * 批量发下发或下发
 * @param {Object} obj
 */
export function personnel(obj, isFlag) {
	return new Promise((resolve, reject) => {
		let excelIds = obj.excelIds
		let userIds = obj.userIds
		let userIds1 = 0
		let r = 0;
		excelIds.forEach(item => {
			//下发
			if (isFlag) {
				if (userIds.length === 0) {
					r += 1;
					userIds1 += 1;
				} else {
					executeSQL("local", "update tb_excel set view='0',direty='1','delete'='0',updatetime='" + new Date().getTime() +
						"' where id = '" + item + "'", res1 => {
							userIds.forEach(val => {
								executeSQL("local",
									"INSERT INTO tb_excel_user (excel_id,user_id,status,direty,'delete',updatetime) values('" + item +
									"','" + val + "','0','1','0','" + new Date().getTime() + "')", res2 => {
										r += 1;
									})
							})
						})
				}
			} else {
				//编辑
				if (userIds.length === 0) {
					//清空数据
					executeSQL("local", "update tb_excel set view='1' ,direty='1','delete'='0',updatetime='" + new Date().getTime() +
						"' where id = '" + item + "'", res1 => {
							//查询之前下发的专责列表
							selectSQL("local",
								"SELECT sys_user.user_id, sys_user.role_id, sys_role.function_id FROM sys_user LEFT JOIN sys_role ON sys_user.role_id = sys_role.role_id WHERE user_id in ( SELECT user_id FROM tb_excel_user WHERE excel_id = '" +
								item + "' AND status = '0' ) AND function_id = '2' group by user_id", res11 => {
									//数据库的值
									let arr = res11.map((ob11j, index) => {
										return ob11j.user_id;
									}).join(",").split(',')
									userIds.push(arr)
									let str = ""
									arr.forEach(val => {
										str += "'" + val + "',"

									})
									let instr = str.substring(0, str.length - 1)
									executeSQL("local", "update tb_excel_user set status ='1' , 'delete'='1' , updatetime='" +
										new Date().getTime() + "' where excel_id = '" + item + "' and user_id in (" + instr + ")", res2 => {
											r += arr.length;
										})
								})
						})
				} else {
					executeSQL("local", "update tb_excel set view='0' ,direty='1','delete'='0',updatetime='" + new Date().getTime() +
						"' where id = '" + item + "'", res33 => {
							//查询之前下发的专责列表
							selectSQL("local",
								"SELECT sys_user.user_id, sys_user.role_id, sys_role.function_id FROM sys_user LEFT JOIN sys_role ON sys_user.role_id = sys_role.role_id WHERE user_id in ( SELECT user_id FROM tb_excel_user WHERE excel_id = '" +
								item + "' AND status = '0' ) AND function_id = '2'", res1 => {
									//数据库的值
									let arr = res1.map((obj11, index) => {
										return obj11.user_id;
									}).join(",").split(',')
									//他们相同的值
									let arrEqual = getArrEqual(userIds, arr);
									//数据库不相同的值
									let arrDifference = getArrDifference(arrEqual, arr);
									//页面不同的值
									let difference = getArrDifference(arrEqual, userIds);
									//没改这个直接返回
									if (arrDifference.length === 0 && difference.length === 0) {
										r += 1;
										userIds1 += 1;
									}
									//改变状态位删除
									if (arrDifference.length !== 0) {
										arrDifference.forEach(val => {
											let excel_user_sql =
												"update tb_excel_user set status='1' , 'delete'='1',updatetime = '" + new Date().getTime() +
												"' where excel_id='" + item + "' and user_id = '" + val + "'"
											executeSQL("local", excel_user_sql, res6 => {
												r += 1;
												if (r === (difference.length + arrDifference.length)) {
													userIds1 += 1;
												}
											})
										})
									}
									if (difference.length !== 0) {
										difference.forEach(val => {
											executeSQL("local",
												"insert into tb_excel_user (excel_id,user_id,status,direty,'delete',updatetime) values ('" + item +
												"','" + val + "','0','1','0','" + new Date().getTime() + "')", res7 => {
													r += 1;
													if (r === (difference.length + arrDifference.length)) {
														userIds1 += 1;
													}
												})
										})
									}
								})
						})
				}
			}
			if (r === userIds.length || r === userIds1) {
				resolve(true)
			}
		})
	})
}

/**
 * 查询分类列表
 * @param {Object} id
 */
export function categoryList(id) {
	return new Promise((resolve, reject) => {
		//根据权限来拉去当前用户有哪些分类
		let functionId = uni.getStorageSync("functionid")
		let sql = ""
		if(functionId==1){
			sql ="SELECT * FROM tb_excel_category where tb_excel_category.user_id IN( select user_id from sys_user where role_id in ( SELECT sys_role.role_id FROM sys_role WHERE sys_role.parent_id IN ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '" +id + "' ) and function_id=1 ) group by user_id ) and status = 0"
		}else if(functionId == 2){
			sql ="SELECT * FROM tb_excel_category where tb_excel_category.id IN( SELECT tb_excel.categort_id FROM tb_excel WHERE user_id = '" +id + "' AND STATUS != '1' AND type = 2 UNION SELECT tb_excel.categort_id FROM tb_excel LEFT JOIN tb_excel_user ON tb_excel.id = tb_excel_user.excel_id WHERE tb_excel_user.user_id = '" +id + "' AND tb_excel.STATUS != '1' AND tb_excel.type = 1 and tb_excel_user.status = 0 ) and status = 0"
		}
		selectSQL("local", sql, res => {
			resolve(res)
		})
	})
}

/**
 * 添加分类
 * @param {Object} obj
 */
export function addCategory(obj) {
	return new Promise((resolve, reject) => {
		//查询是否重复
		selectSQL("local", "select count(id) as num from tb_excel_category where name = '" + obj.name +
			"' and status = '0'", res => {
				if (res[0].num == 0) {
					let id = uuid()
					let sql =
						"INSERT INTO tb_excel_category (id,'name','status','user_id','created_time','direty','delete','updatetime') VALUES('" +
						id + "','" + obj.name + "','0','" + obj.user_id + "','" + new Date().getTime() + "','1','0','" + new Date().getTime() +
						"')"
					executeSQL("local", sql, res => {
						resolve(id)
					})
				} else {
					resolve(false)
				}
			})
	})
}

/**
 * 编辑分类
 * @param {Object} obj
 */
export function editCategory(obj) {
	return new Promise((resolve, reject) => {
		let sql = "update tb_excel_category set name='" + obj.name + "',direty='1' ,updatetime = '" + new Date().getTime() +
			"' where id = '" + obj.id + "'"
		executeSQL("local", sql, res => {
			resolve(true)
		})
	})
}

/**
 * 删除分类
 * @param {Object} obj
 */
export function deleteCategory(id) {
	return new Promise((resolve, reject) => {
		//查询当前分类下是否有绑定标准
		selectSQL("local", "select count(id) as num from tb_excel where categort_id = '" + id + "' and status='0'", res => {
			if (res[0].num == 0) {
				let sql = "update tb_excel_category set status = '1','delete'='1' ,updatetime = '" + new Date().getTime() +
					"' where id = '" + id + "'"
				executeSQL("local", sql, res2 => {
					resolve(true)
				})
			} else {
				resolve(false)
			}
		})
	})
}

/**
 * 下载excel模板
 * @param {Object} id
 */
export function uploadExcelTemplate() {
	// if (uni.getSystemInfoSync().platform == 'ios') {
	// 	return new Promise((resolve, reject) => {
	// 		saveFileIoS("static/app-plus/template/标准模板.xlsx", res => {
	// 			resolve(res)
	// 		})
	// 	})
	// }
	// if (uni.getSystemInfoSync().platform === 'android') {
	// 	return new Promise((resolve, reject) => {
	// 		saveFileAndroid("_doc/template/标准模板.xlsx", res => {
	// 			resolve(res)
	// 		})
	// 	})
	// }
	let template =
		`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882"><DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Administrator</Author><LastAuthor>Administrator</LastAuthor><Created>2020-12-02T02:34:00Z</Created><LastSaved>2021-01-11T08:52:18Z</LastSaved></DocumentProperties><CustomDocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><KSOProductBuildVer dt:dt="string">2052-11.8.2.9067</KSOProductBuildVer></CustomDocumentProperties><ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><WindowWidth>28800</WindowWidth><WindowHeight>12465</WindowHeight><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook><Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Borders/><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000"/><Interior/><NumberFormat/><Protection/></Style><Style ss:ID="s49"/><Style ss:ID="s50"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style><Style ss:ID="s51"><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style><Style ss:ID="s52"><Alignment ss:Vertical="Center" ss:WrapText="1"/><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#FF0000" ss:Bold="1"/></Style><Style ss:ID="s53"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style><Style ss:ID="s54"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style><Style ss:ID="s55"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style><Style ss:ID="s56"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style><Style ss:ID="s57"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style></Styles><Worksheet ss:Name="一、标准的模板"><Table ss:ExpandedColumnCount="8" ss:ExpandedRowCount="12" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="54" ss:DefaultRowHeight="13.5"><Column ss:Index="1" ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="150.75"/><Column ss:Index="2" ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="243"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="219.8"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="137.25"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="93"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="207.35"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="174"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="174.75"/><Row><Cell ss:StyleID="s53" ss:MergeAcross="7" ss:MergeDown="4"><Data ss:Type="String">标准模板</Data></Cell></Row><Row/><Row/><Row/><Row/><Row><Cell ss:StyleID="s54" ss:MergeAcross="1" ss:MergeDown="4"><Data ss:Type="String">单位:xxx</Data></Cell><Cell ss:StyleID="s55" ss:MergeAcross="1" ss:MergeDown="4"><Data ss:Type="String">检查内容:xxxxx</Data></Cell><Cell ss:StyleID="s56" ss:MergeAcross="1" ss:MergeDown="4"><Data ss:Type="String">总分:xxx</Data></Cell><Cell ss:StyleID="s57" ss:MergeAcross="1" ss:MergeDown="4"><Data ss:Type="String">评分日期:xxxxxx</Data></Cell></Row><Row/><Row/><Row/><Row/><Row ss:Height="26"><Cell ss:StyleID="s50"><Data ss:Type="String">序号</Data></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">评判项目</Data></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">评价内容</Data></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">总分</Data></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">得分</Data></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">评价原则</Data></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">检查方式</Data></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">引用规范和标准</Data></Cell></Row><Row ss:Height="110"><Cell ss:StyleID="s52"><Data ss:Type="String">序号填写规则： &#10;1,2,3,4,5,6....&#10;或者 1.1, 1.2, 1.3...&#10;或者 1.1.1, 1.1.2, 1.1.3....</Data></Cell><Cell ss:StyleID="s52"><Data ss:Type="String">当出现序号里边儿有多个层级关系的时候；&#10;父行则只填写评判项目，以及总分&#10;当填写父检查下面的检查项的时候，&#10;该行需要填写完以便程序判断是否是检查项，而不是父title（得分可以不用填）</Data></Cell><Cell ss:Index="6" ss:StyleID="s52"><Data ss:Type="String">这里边儿每一条检查项为一行；enter换行；&#10;并且每一行必须指定分值：如（扣1分/处；扣2分；扣0.5分/台.....）</Data></Cell></Row></Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><PageSetup><Header/><Footer/></PageSetup><Zoom>85</Zoom><Selected/><TopRowVisible>0</TopRowVisible><LeftColumnVisible>0</LeftColumnVisible><PageBreakZoom>100</PageBreakZoom><Panes><Pane><Number>3</Number><ActiveRow>11</ActiveRow><ActiveCol>2</ActiveCol><RangeSelection>R12C3</RangeSelection></Pane></Panes><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions></Worksheet></Workbook>`;
	let fileName = "标准模板" + "+" + dateFormat("mm-dd HH:MM:SS", new Date()) + "." + "xlsx"
	return new Promise((resolve, reject) => {
		exportFile(template, fileName, res => {
			resolve(res)
		})
	})
}


/**
 * 下载用户模板
 * @param {Object} id
 */
export function uploadUserTemplate() {
	return new Promise((resolve, reject) => {
	//查询当前用户所属的公司
	selectSQL("local",
		"select role_name,role_id from sys_role where role_id = (select company_id from sys_user where user_id = '" + uni.getStorageSync(
			"USER_ID") + "')", res => {
			//查询当前公司下的所有的角色
			selectSQL("local", "select role_name from sys_role where parent_id = '" + res[0].role_id + "' and status = '0'",
				resRole => {
					let str = ""
					resRole.forEach(item => {
						str += item.role_name + ","
					})
					let role = str.substring(0, str.length - 1)
					let template =`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882"><DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>xianlihong</Author><LastAuthor>Administrator</LastAuthor><Created>2015-06-05T18:19:00Z</Created><LastSaved>2021-01-11T09:20:26Z</LastSaved></DocumentProperties><CustomDocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><KSOProductBuildVer dt:dt="string">2052-11.8.2.9067</KSOProductBuildVer></CustomDocumentProperties><ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><WindowWidth>28800</WindowWidth><WindowHeight>12465</WindowHeight><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook><Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Bottom"/><Borders/><Font ss:FontName="等线" x:CharSet="134" ss:Size="11" ss:Color="#000000"/><Interior/><NumberFormat/><Protection/></Style><Style ss:ID="s49"/><Style ss:ID="s50"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="微软雅黑" x:CharSet="134" ss:Size="11" ss:Color="#FF0000" ss:Bold="1"/></Style><Style ss:ID="s51"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="微软雅黑" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style></Styles><Worksheet ss:Name="Sheet1"><Table ss:ExpandedColumnCount="5" ss:ExpandedRowCount="1" x:FullColumns="1" x:FullRows="1"
               ss:DefaultColumnWidth="54" ss:DefaultRowHeight="14.25"><Column ss:Index="1" ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="81.5"/><Column ss:Index="2" ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="89"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="119.5"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="114.5"/><Column ss:StyleID="Default" ss:AutoFitWidth="0" ss:Width="95.25"/><Row ss:Height="27"><Cell ss:StyleID="s50"><Data ss:Type="String">姓名</Data><Comment ss:Author="xianlihong"><ss:Data xmlns="http://www.w3.org/TR/REC-html40"><Font html:Color="#000000"></Font><B><Font html:Face="宋体" x:CharSet="134" html:Size="9">必填项</Font></B></ss:Data></Comment></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">手机号码</Data><Comment ss:Author="xianlihong"><ss:Data xmlns="http://www.w3.org/TR/REC-html40"><Font html:Color="#000000"></Font><B><Font html:Face="宋体" x:CharSet="134" html:Size="9">必填</Font></B></ss:Data></Comment></Cell><Cell ss:StyleID="s50"><Data ss:Type="String">角色</Data><Comment ss:Author="xianlihong"><ss:Data xmlns="http://www.w3.org/TR/REC-html40"><Font html:Color="#000000"></Font><Font html:Face="宋体" x:CharSet="134" html:Size="9">必填</Font></ss:Data></Comment></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">部门</Data></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">职位</Data></Cell></Row></Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><PageSetup><Header x:Margin="0.3"/><Footer x:Margin="0.3"/><PageMargins x:Left="0.7" x:Right="0.7" x:Top="0.75" x:Bottom="0.75"/></PageSetup><Selected/><TopRowVisible>0</TopRowVisible><LeftColumnVisible>0</LeftColumnVisible><PageBreakZoom>100</PageBreakZoom><Panes><Pane><Number>3</Number><ActiveRow>2</ActiveRow><ActiveCol>3</ActiveCol><RangeSelection>R3C4</RangeSelection></Pane></Panes><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions><DataValidation xmlns="urn:schemas-microsoft-com:office:excel"><Range>C1</Range><InputMessage>请输入员工姓名</InputMessage><ErrorStyle>Stop</ErrorStyle></DataValidation><DataValidation xmlns="urn:schemas-microsoft-com:office:excel"><Range>C2</Range><InputMessage>请输入11位手机号码</InputMessage><ErrorStyle>Stop</ErrorStyle></DataValidation><DataValidation xmlns="urn:schemas-microsoft-com:office:excel"><Range>C3</Range><Type>List</Type><CellRangeList/><Value>&quot;${role}&quot;</Value><InputMessage>请选择员工角色</InputMessage><ErrorStyle>Stop</ErrorStyle></DataValidation></Worksheet></Workbook>`;
					let fileName = "用户模板" + "+" + dateFormat("mm-dd HH:MM:SS", new Date()) + "." + "xlsx"
						exportFile(template, fileName, res => {
							resolve(res)
						})
					})
				})
		})
}


/**
 * 下载单位模板
 * @param {Object} id
 */
export function uploadUnitTemplate() {
	return new Promise((resolve, reject) => {
	let template =
		`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882"><DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>xianlihong</Author><LastAuthor>Administrator</LastAuthor><Created>2015-06-05T18:19:00Z</Created><LastSaved>2021-01-11T09:10:23Z</LastSaved></DocumentProperties><CustomDocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><KSOProductBuildVer dt:dt="string">2052-11.8.2.9067</KSOProductBuildVer></CustomDocumentProperties><ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><WindowWidth>28800</WindowWidth><WindowHeight>12465</WindowHeight><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook><Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Bottom"/><Borders/><Font ss:FontName="等线" x:CharSet="134" ss:Size="11" ss:Color="#000000"/><Interior/><NumberFormat/><Protection/></Style><Style ss:ID="s49"><Alignment ss:Vertical="Bottom"/><Borders/><Font ss:FontName="等线" x:CharSet="134" ss:Size="11" ss:Color="#000000"/><Interior/><NumberFormat/><Protection/></Style><Style ss:ID="s50"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="微软雅黑" x:CharSet="134" ss:Size="11" ss:Color="#FF0000" ss:Bold="1"/></Style><Style ss:ID="s51"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="微软雅黑" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style><Style ss:ID="s52"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:FontName="微软雅黑" x:CharSet="134" ss:Size="11" ss:Bold="1"/></Style></Styles><Worksheet ss:Name="Sheet1"><Table ss:ExpandedColumnCount="8" ss:ExpandedRowCount="1" x:FullColumns="1" x:FullRows="1" ss:DefaultColumnWidth="54" ss:DefaultRowHeight="14.25"><Column ss:Index="1" ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="87"/><Column ss:Index="2" ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="78.75"/><Column ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="88.5"/><Column ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="186.75"/><Column ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="86.25"/><Column ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="88.5"/><Column ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="108.75"/><Column ss:StyleID="s49" ss:AutoFitWidth="0" ss:Width="207.75"/><Row ss:Height="27"><Cell ss:StyleID="s50"><Data ss:Type="String">单位名称</Data><Comment ss:Author="xianlihong"><ss:Data xmlns="http://www.w3.org/TR/REC-html40"><Font html:Color="#000000"></Font><Font html:Face="宋体" x:CharSet="134" html:Size="9">必填</Font></ss:Data></Comment></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">负责人</Data></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">负责人电话</Data></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">单位地址</Data></Cell><Cell ss:StyleID="s52"><Data ss:Type="String">子单位名称</Data></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">子单位负责人</Data></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">子单位负责人电话</Data></Cell><Cell ss:StyleID="s51"><Data ss:Type="String">子单位地址</Data></Cell></Row></Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><PageSetup><Header x:Margin="0.3"/><Footer x:Margin="0.3"/><PageMargins x:Left="0.7" x:Right="0.7" x:Top="0.75" x:Bottom="0.75"/></PageSetup><Selected/><TopRowVisible>0</TopRowVisible><LeftColumnVisible>0</LeftColumnVisible><PageBreakZoom>100</PageBreakZoom><Panes><Pane><Number>3</Number><ActiveRow>5</ActiveRow><ActiveCol>6</ActiveCol><RangeSelection>R6C7</RangeSelection></Pane></Panes><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions><DataValidation xmlns="urn:schemas-microsoft-com:office:excel"><Range>C3,C7</Range><InputMessage>请输入11位有效电话号码</InputMessage><ErrorStyle>Stop</ErrorStyle></DataValidation></Worksheet></Workbook>`;
	let fileName = "单位模板" + "+" + dateFormat("mm-dd HH:MM:SS", new Date()) + "." + "xlsx"
		exportFile(template, fileName, res => {
			resolve(res)
		})
	})
}

/**
 * 数据导出成Excel
 * @param {Object} obj
 */
export function importDataToExcel(str, worksheet, fileName) {
	//下载的表格模板数据
	let template =
		`<html xmlns:o="urn:schemas-microsoft-com:office:office" 
	    xmlns:x="urn:schemas-microsoft-com:office:excel" 
	    xmlns="http://www.w3.org/TR/REC-html40">
	    <head><!--[if gte mso 9]><xml encoding="UTF-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
	    <x:Name>${worksheet}</x:Name>
	    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
	    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
	    </head><body><table>${str}</table></body></html>`;
	//下载模板
	exportFile(template, fileName)
}

/**
 * 导出Excel数据到本地文件
 * @param {Object} fileData
 * @param {Object} fileName
 */
function exportFile(fileData, fileName, callbackId) {
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
				//获取当前的年月继续创建文件夹
				let date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				dirEntry.getDirectory(`标准模板`, {
					create: true
				}, function(dirEntry2) {
					dirEntry2.getFile(fileName, {
						create: true
					}, function(fileEntry) {
						fileEntry.createWriter(function(writer) {
							// writer.onwritestart = (e) => {
							// 	uni.showLoading({
							// 		title: "正在导出",
							// 		mask: true
							// 	})
							// }
							// 写入内容;
							writer.write(fileData);
							writer.onwrite = (e) => {
								// 成功导出数据;
								uni.hideLoading();
								setTimeout(() => {
									callbackId("根目录/验收评价/标准模板/" + fileName)
								}, 500)
							};
						}, function(e) {
							callbackId("导出失败")
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


/**
 * 保存文件Android
 */
function saveFileAndroid(tempFilePath, callbackId) {
	let fileName = tempFilePath.replace(REGEX_FILENAME, '');
	if (fileName) {
		let SAVED_DIR_NAME = "根目录/验收评价/标准模板/"
		fileName = head(fileName.split(".")) + "_" + dateFormat("mm-dd_HH:MM:SS", new Date()) + "." + fileName.split(".").pop()
		SAVED_DIR_NAME += fileName
		plus.io.resolveLocalFileSystemURL(getRealPath(tempFilePath), entry => { // 读取临时文件 FileEntry
			getSavedFileDir(dir => {
				entry.copyTo(dir, fileName, () => { // 复制临时文件 FileEntry，为了避免把相册里的文件删除，使用 copy，微信中是要删除临时文件的
					callbackId(SAVED_DIR_NAME)
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

/**
 * 保存文件IOS
 */
function saveFileIoS(tempFilePath, callbackId) {
	return new Promise((resolve, reject) => {
		uni.saveFile({
			tempFilePath: tempFilePath,
			success: function(res) {
				var savedFilePath = res.savedFilePath;
				resolve(savedFilePath)
			}
		});
	})
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

//获取文件的相对路径
const _handleLocalPath = filePath => {
	let localUrl = plus.io.convertLocalFileSystemURL(filePath);
	return localUrl.replace(/^\/?apps\//, '/android_asset/apps/').replace(/\/$/, '')
};

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

/**
 * 删除文件夹里边的每一个文件
 * @param {Object} filePath
 * @param {Object} callbackId
 */
function removeSavedFile(filePath, callbackId) {
	let remveNum = 0
	getSavedFileList(res => {
		if (res.length > 0) {
			res.forEach(item => {
				plus.io.resolveLocalFileSystemURL(filePath, entry => {
					entry.name = "已废弃"
					entry.remove(() => {
						remveNum += 1
						if (remveNum == res.length) {
							callbackId("删除成功")
						}
					}, error => {})
				}, error => {})
			})
		} else {
			callbackId("没有文件")
		}
	});
}

/**
 * 读取手机文件夹里的数据
 * @param {Object} callbackId
 */
function getSavedFileList(callbackId) {
	getSavedFileDir(entry => {
		var reader = entry.createReader();
		var fileList = [];
		reader.readEntries(entries => {
			if (entries && entries.length) {
				entries.forEach(entry => {
					entry.getMetadata(meta => {

						fileList.push({
							filePath: plus.io.convertAbsoluteFileSystem(entry.fullPath),
							createTime: meta.modificationTime.getTime(),
							size: meta.size
						});
						if (fileList.length === entries.length) {
							callbackId(fileList)
						}
					}, error => {
						callbackId("读取失败")
					}, false);
				});
			}
		});
	});
}

//uuid生成
function uuid() {
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() +
		S4());
}

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function head(array) {
	return array && array.length ? array[0] : undefined
}

//相同的值
function getArrEqual(arr1, arr2) {
	let newArr = [];
	for (let i = 0; i < arr2.length; i++) {
		for (let j = 0; j < arr1.length; j++) {
			if (arr1[j] === arr2[i]) {
				newArr.push(arr1[j]);
			}
		}
	}
	return newArr;
}

//不相同的值
function getArrDifference(arr1, arr2) {
	return arr1.concat(arr2).filter(function(v, i, arr) {
		return arr.indexOf(v) === arr.lastIndexOf(v);
	});
}
