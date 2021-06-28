//打开数据库
function openComDB(name, path, callback) {
	plus.sqlite.openDatabase({
		name: name,
		path: path,
		success: function(e) {
			callback(e)
		},
		fail: function(e) {
			callback(e);
		}
	})
}
//关闭数据库
function closeComDB(name, path, callback) {
	plus.sqlite.closeDatabase({
		name: name,
		success: function(e) {
			callback(e)
		},
		fail: function(e) {
			callback(e)
		}
	})
}
//增删改
function executeSQL(name, sql, callback) {
	plus.sqlite.executeSql({
		name: name,
		sql: sql,
		success: function(e) {
			callback(e);
		},
		fail: function(e) {
			callback(e);
		}
	})
}
//查询
function selectSQL(name, sql, callback) {
	plus.sqlite.selectSql({
		name: name,
		sql: sql,
		success: function(e) {
			callback(e);
		},
		fail: function(e) {
			callback(e);
		}
	})
}
//执行事务(operation可选参数：begin-开始事务处理；commit-保存更改；rollback-撤销上次保存)
function transaction(name, operation, callback) {
	plus.sqlite.transaction({
		name: name,
		operation: operation,
		success: function(e) {
			callback(e);
		},
		fail: function(e) {
			callback(e);
		}
	});
}


export {
	openComDB,
	closeComDB,
	executeSQL,
	selectSQL,
	transaction
}
