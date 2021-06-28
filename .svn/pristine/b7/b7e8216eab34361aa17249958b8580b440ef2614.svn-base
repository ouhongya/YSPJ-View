/**
 * 公告页面
 */
import {
    openComDB,
    closeComDB,
    executeSQL,
    selectSQL,
    transaction
} from '@/common/local.js'

/**
 * 查询公告列表
 * @param {Object} uid
 * @param {Object} page
 * @param {Object} size
 */
export function queryPublicList(id, page, size, search) {
    let cruentPage = (page - 1) * size
    let sql =
        "SELECT * FROM (SELECT tb_message.id, tb_message.title, tb_message.content, tb_message.TYPE, tb_message.STATUS, sys_user.`name`, tb_message.created_time, 1 AS isFlag FROM tb_message LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message.`user_id` IN (SELECT sys_user.`user_id` FROM sys_user WHERE company_id IN (SELECT sys_role.`role_id` FROM sys_user LEFT JOIN sys_role ON sys_user.`company_id` = sys_role.`role_id` WHERE sys_user.user_id = '" +
        id + "')) AND tb_message.`user_id` != '" + id +
        "' AND tb_message.`status` = 0 UNION SELECT tb_message.id, tb_message.title, tb_message.content, tb_message.TYPE, tb_message.STATUS, sys_user.`name`, tb_message.created_time, 2 AS isFlag FROM tb_message LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message.user_id = '" +
        id + "' AND tb_message.`status` = 0)  t where title like '%" + search + "%' ORDER BY t.created_time DESC limit " +
        cruentPage + " , " + size

    let sql2 =
        "SELECT count(id) as num FROM (SELECT tb_message.id, tb_message.title, tb_message.content, tb_message.TYPE, tb_message.STATUS, sys_user.`name`, tb_message.created_time, 1 AS isFlag FROM tb_message LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message.`user_id` IN (SELECT sys_user.`user_id` FROM sys_user WHERE company_id IN (SELECT sys_role.`role_id` FROM sys_user LEFT JOIN sys_role ON sys_user.`company_id` = sys_role.`role_id` WHERE sys_user.user_id = '" +
        id + "')) AND tb_message.`user_id` != '" + id +
        "' AND tb_message.`status` = 0 UNION SELECT tb_message.id, tb_message.title, tb_message.content, tb_message.TYPE, tb_message.STATUS, sys_user.`name`, tb_message.created_time, 2 AS isFlag FROM tb_message LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message.user_id = '" +
        id + "' AND tb_message.`status` = 0) t where title like '%" + search + "%' ORDER BY t.created_time DESC"
    return new Promise((resolve, reject) => {
        selectSQL('local', sql, res => {
            if (res.length != 0 && res) {
                let totalCount = 0
                selectSQL('local', sql2, res2 => {
                    if (res2.length != 0 && res2) {
                        totalCount = res2[0].num;
                        let pageNum = totalCount / size;
                        let surplus = totalCount % size;
                        if (surplus > 0) {
                            pageNum = pageNum + 1;
                        }
                        let list = res
                        list[0].total = Math.floor(pageNum)
                        resolve(list);
                    }
                })
            } else {
                resolve(null);
            }
        })
    })
}

/**
 * 查询公告通知范围
 * @param {Object} uid
 */
export function queryPublicRange(uid) {
    //查询当前公司下的所有角色
    let sql = "SELECT sys_role.role_id,sys_role.`role_name` FROM sys_role WHERE parent_id = '" + uni.getStorageSync("company_id") + "'  and status = '0'"
    return new Promise((resolve, reject) => {
        selectSQL('local', sql, res => {
            //拿到当前公司下的所有角色
            if (res.length != 0 && res) {
                //查询当前角色下面的所有用户
                res.forEach(item => {
                    let sql2 = "SELECT sys_user.`user_id`,sys_user.`name` FROM sys_user WHERE role_id = '" + item.role_id + "' and status= '0'"
                    selectSQL('local', sql2, res => {
                        item.child = res
                    })
                })
                setTimeout(() => {
                    resolve(res)
                }, 100)
            }
        })

    })
}

/**
 * 创建公告
 * @param {Object} obj
 */
export function savePublic(obj) {
    return new Promise((resolve, reject) => {
		if(obj.child.length==0){
			 resolve(false)
		}
        let id = guid();
        let time = Date.parse(new Date());
        let sql = "INSERT INTO tb_message (id,title,content,TYPE,STATUS,user_id,created_time,direty,`delete`,updatetime) values('" + id + "','" + obj.title + "','" + obj.content + "','" + obj.type + "','0','" + obj.user_id + "','" + time + "','1','0','" + time + "')"
        //1.保存公告主表tb_message
        executeSQL("local", sql, res => {
            //2.保存公告用户表tb_message_user
            obj.child.forEach(item => {
                let sql2 = "INSERT INTO tb_message_user (message_id,STATUS,user_id,read_time,direty,`delete`,updatetime) values('" + id + "','1','" + item + "','null','1','0','" + time + "')"
                executeSQL("local", sql2, res => {
                    resolve(true)
                })
            })
        })
    })
}

/**
 * 编辑公告回显值
 * @param {Object} id
 */
export function queryPublicOne(id) {
    return new Promise((resolve, reject) => {
        //查询公告主表
        let sql = "select * from tb_message where id  = '" + id + "'";
        let publicOne = null;
        selectSQL("local", sql, res => {
            publicOne = res
            let publicRole = publicOne[0].type;
            let role = publicRole.split(",")
            //查询公告下面的用户
            let sql2 = "select * from tb_message_user where message_id  = '" + id + "'";
            let publicToUser = null;
            selectSQL("local", sql2, res1 => {
                publicToUser = res1
            })
            let rangs = [];
            //数组组装
            role.forEach(item => {
                let userList = [];
                publicToUser.forEach(val => {
                    let sql3 = "select user_id.id,user_id.name,user_id.role_id from sys_user where user_id  = '" + val.user_id +
                        "'";
                    selectSQL("local", sql2, res2 => {
                        if (res2[0].role_id == item) {
                            userList.push({
                                user_id: res2[0].id,
                                name: res2[0].name
                            })
                        }
                    })
                })
                let child = [{
                    role_id: item,
                    child: userList
                }]
                rangs.push(child)
            })
            publicOne.rangs = rangs
            resolve(publicOne)
        })
    })
}

/**
 * 编辑公告
 * @param {Object} obj
 */
export function editPublic(obj) {
    let isFlag = true;
    return new Promise((resolve, reject) => {
        let sql = "select tb_message.direty from tb_message where id = '" + obj.id + "'"
        let direty = null;
        selectSQL("local", sql, res => {
            direty = res[0].direty
            //查询之前的数据是不是状态位是不是2,也就是本地新增
            if (direty == 2) {
                //删除之前的数据公告主表
                let sql = "delete from tb_message where id = '" + obj.id + "'"
                executeSQL("local", sql, res => {
                    isFlag = false;
                })
                //删除之前的公告
                let sql2 = "delete from tb_message_user where message_id = '" + obj.id + "'"
                executeSQL("local", sql2, res => {
                    isFlag = false;
                })
                //加入新的数据
                this.savePublic(obj)
            } else {
                //不是2那么就是从服务端更新下来的数据,
                //修改之前的数据公告主表
                let sql = "update  tb_message set title='" + obj.title + "',content='" + obj.content + "',type='" + type +
                    "',direty='1' where id = '" + obj.id + "'"
                executeSQL("local", sql, res => {
                    isFlag = false;
                })
                //添加或者改变之前公告用户表的状态
                //查询之前公告用户表的用户判断编辑用户存不存在
                let sql2 = "select *  from tb_message_user where message_id = '" + obj.id + "'"
                let userList = null;
                executeSQL("local", sql2, res => {
                    userList = res
                })
                //循环判断并改变状态
                userList.forEach(item => {
                    obj.child.find(function (value, index, arr) {
                        //不存在的情况
                        if (value != item.user_id) {
                            //保存新输入的值
                            let sql3 =
                                "INSERT INTO tb_message_user (message_id,STATUS,user_id,read_time,direty,delete) values('" + id +
                                "','2','" + value + "','null','2','0')"
                            executeSQL("local", sql3, res => {
                                isFlag = false;
                            })
                            //改变之前的值得状态
                            let sql4 = "update tb_message_user set status='2',  delete= '1' where message_id='" + obj.id +
                                "' and user_id = '" + item.user_id + "' "
                            executeSQL("local", sql4, res => {
                                isFlag = false;
                            })
                        }
                        ;
                    })
                })
            }
            resolve(isFlag)
        })
    })
}

/**
 * 删除公告
 * @param {Object} id
 */
export function deletePublic(id) {
    return new Promise((resolve, reject) => {
        let sql2 = "update  tb_message set status='1', 'delete'='1',updatetime='" + new Date().getTime() + "'  where id = '" + id + "'"
        executeSQL("local", sql2, res => {
            let sql3 = "update  tb_message_user set status='2', 'delete'='1',updatetime='" + new Date().getTime() + "' where message_id = '" + id + "'"
            executeSQL("local", sql3, res3 => {
                resolve(true)
            })
        })
    })
}

/**
 * 查询当前用户有几个未读的公告
 * @param {Object} id
 */
export function queryToUserPublicCount(id) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT COUNT(message_id) AS num FROM tb_message left join tb_message_user on tb_message.id = tb_message_user.message_id WHERE tb_message_user.user_id = '" + id + "' AND tb_message_user.status =1 and tb_message.status=0"
        selectSQL("local", sql, res => {
            resolve(res[0].num)
        })
    })
}

/**
 * 公告已读操作
 * @param {Object} uid
 * @param {Object} id
 */
export function publicRead(id, uid) {
    return new Promise((resolve, reject) => {
        let time = Date.parse(new Date())
        let sql = "update tb_message_user set status ='0',read_time='" + time + "',direty='1',updatetime='" + new Date().getTime() + "' where message_id = '" + id + "' and user_id = '" + uid + "'"
        executeSQL("local", sql, res => {
            resolve(true)
        })
    })
}

/**
 * 查询用户名
 * @param {Object} id
 */
export function queryUserToName(id) {
    return new Promise((resolve, reject) => {
        let sql = "select name from sys_user where user_id = '" + id + "'"
        selectSQL("local", sql, res => {
            resolve(res[0].name)
        })
    })
}

/**
 * 查询用户收到的公告列表
 * @param {Object} id
 */
export function publicList(id, page, size, search) {
    let currentPage = (page - 1) * size
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM ( SELECT * FROM (SELECT tb_message.id, tb_message.title, tb_message.content, sys_user.`name`, tb_message.type, tb_message.`user_id`, tb_message_user.status, tb_message.created_time, tb_message.created_time as created_time1,1 AS isFlag FROM tb_message LEFT JOIN tb_message_user ON tb_message.`id` = tb_message_user.`message_id` LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message_user.`user_id` = '" +id +"' AND tb_message_user.`status` = 1 AND tb_message.`status` = 0 ORDER BY created_time asc )t UNION SELECT tb_message.id, tb_message.title, tb_message.content, sys_user.`name`, tb_message.type, tb_message.`user_id`, tb_message.status, tb_message_user.read_time AS created_time  , tb_message.created_time as created_time1,  2 AS isFlag FROM tb_message LEFT JOIN tb_message_user ON tb_message.`id` = tb_message_user.`message_id` LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message_user.`user_id` = '" +
            id + "' AND tb_message_user.`status` = 0 AND tb_message.`status` = 0 ORDER BY created_time desc )t where title like '%" + search + "%'   limit " + currentPage + "," + size
        let sql2 ="SELECT count(id) as num FROM ( SELECT * FROM (SELECT tb_message.id, tb_message.title, tb_message.content, sys_user.`name`, tb_message.type, tb_message.`user_id`, tb_message.status, tb_message.created_time FROM tb_message LEFT JOIN tb_message_user ON tb_message.`id` = tb_message_user.`message_id` LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message_user.`user_id` = '" + id +"' AND tb_message_user.`status` = 1 AND tb_message.`status` = 0 ORDER BY created_time DESC )t UNION SELECT tb_message.id, tb_message.title, tb_message.content, sys_user.`name`, tb_message.type, tb_message.`user_id`, tb_message.status, tb_message_user.read_time AS created_time FROM tb_message LEFT JOIN tb_message_user ON tb_message.`id` = tb_message_user.`message_id` LEFT JOIN sys_user ON tb_message.`user_id` = sys_user.`user_id` WHERE tb_message_user.`user_id` = '" +
            id +"' AND tb_message_user.`status` = 0 AND tb_message.`status` = 0 ORDER BY created_time DESC )t where title like '%" +search + "%' "
        selectSQL("local", sql, res => {
            if (res.length != 0 && res) {
                selectSQL("local", sql2, res2 => {
                    if (res2.length != 0 && res2) {
                        let totalCount = res2[0].num;
						res.forEach(item=>{
							if(item.isFlag==2){
								item.created_time = item.created_time1
							}
						})
                        res[0].totalSize = totalCount
                        resolve(res);
                    }
                })
            } else {
                resolve(null);
            }
        })
    })
}

/**
 * 生成UUID
 */
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() +
        S4());
}
