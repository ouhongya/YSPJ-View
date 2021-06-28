const baseIp = 'http://192.168.31.103:8080/';
const websiteUrl = baseIp + 'api/';

import md5 from '@/common/md5.js';
//图片路径
const addBaseUrl = function(url) {
	if (url == undefined)
		return "";
	if (url.startsWith("http"))
		return url;
	if (url.length > 4) {
		let prefix = url.substring(0, 4);
		if (prefix == 'http') {
			return url;
		}
	}
	return baseIp + url;
}
// 消息提示
const showToast = function(msg) {
	uni.showToast({
		title: msg,
		icon: "none",
		duration: 2000
	});
};
const cache = function(key, value, seconds) {
	let curTime = Date.parse(new Date()) / 1000;
	if (key && value) {
		if (value != 'cacheNum') {
			uni.setStorageSync("codeTime", curTime);
			uni.setStorageSync("codeNum", value);
		}
		let codeTime = uni.getStorageSync("codeTime");
		if (codeTime) {
			if ((curTime - codeTime) > seconds) {
				uni.removeStorageSync("codeTime")
				uni.removeStorageSync("codeNum")
				console.log('验证码已过期')
				return '';
			} else if (value == 'cacheNum') {
				let num = uni.getStorageSync("codeNum");
				return num;
			}
		}
	} else {
		console.log("key或value不能为空")
	}
}



const accAdd = function(arg1, arg2) {
		    var r1, r2, m, c;
		    try {
		        r1 = arg1.toString().split(".")[1].length;
		    }
		    catch (e) {
		        r1 = 0;
		    }
		    try {
		        r2 = arg2.toString().split(".")[1].length;
		    }
		    catch (e) {
		        r2 = 0;
		    }
		    c = Math.abs(r1 - r2);
		    m = Math.pow(10, Math.max(r1, r2));
		    if (c > 0) {
		        var cm = Math.pow(10, c);
		        if (r1 > r2) {
		            arg1 = Number(arg1.toString().replace(".", ""));
		            arg2 = Number(arg2.toString().replace(".", "")) * cm;
		        } else {
		            arg1 = Number(arg1.toString().replace(".", "")) * cm;
		            arg2 = Number(arg2.toString().replace(".", ""));
		        }
		    } else {
		        arg1 = Number(arg1.toString().replace(".", ""));
		        arg2 = Number(arg2.toString().replace(".", ""));
		    }
		    return (arg1 + arg2) / m;
		}
		
		
		
		
		const accSub = function(arg1, arg2) {
				    var r1, r2, m, n;
				    try {
				        r1 = arg1.toString().split(".")[1].length;
				    }
				    catch (e) {
				        r1 = 0;
				    }
				    try {
				        r2 = arg2.toString().split(".")[1].length;
				    }
				    catch (e) {
				        r2 = 0;
				    }
				    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
				    n = (r1 >= r2) ? r1 : r2;
				    return ((arg1 * m - arg2 * m) / m).toFixed(n);
				}



const uuid = function() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}


//文件导出
const downloadTask = function(url) {
	uni.downloadFile({
		url: url, //url
		success: function(data) {
			if (data.statusCode == 200) {
				uni.saveFile({
					tempFilePath: data.tempFilePath, //临时路径
					success: function(res) {
						uni.showToast({
							icon: 'none',
							mask: true,
							title: '文件已保存：' + res.savedFilePath, //保存路径
							duration: 3000,
						});
						// setTimeout(() => {
						// 	//打开文档查看
						// 	uni.openDocument({
						// 		filePath: res.savedFilePath,
						// 		success: function(res) {
						// 			// console.log('打开文档成功');
						// 		}
						// 	});
						// }, 3000)
					},
					fail: function(err) {
						uni.showToast({
							icon: 'none',
							mask: true,
							title: err.errMsg,
							duration: 3000
						});
					}

				});
			} else {
				uni.showToast({
					icon: 'none',
					mask: true,
					title: '导出失败',
					duration: 3000
				});
			}

		},
		fail: function(err) {
			uni.showToast({
				icon: 'none',
				mask: true,
				title: err.errMsg,
				title: '导出失败',
				duration: 3000
			});
		}
	});

}

/**
 * 通用请求方法
 */
const requestUrl = function(url, param, m, callbak, error) {
	var name = "fh";
	for (var d in param) {
		var d; // 属性名name 
		name = name + d;
	}
	//创建日期对象
	var date = new Date;
	//获取年份
	var yy = date.getFullYear();
	//获取月份 
	var mm = date.getMonth() + 1;
	//如果月份小于10 前面加0
	mm = (mm < 10 ? "0" + mm : mm);
	//返回日期 
	var dd = date.getDate();
	dd = (dd < 10 ? "0" + dd : dd);
	var tdr = yy.toString() + mm.toString() + dd.toString()
	var result1 = md5(name + tdr + ',fh,');
	param.FKEY = result1
	param.FKEYNAME = name
	param.uid = uni.getStorageSync("USER_ID");
	uni.request({
		url: url,
		method: m,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: param,
		fail: (e) => {
			// showToast('服务器异常请稍后再试');
			error && error();
		},
		success: (res) => {
			if (res.statusCode == 200) {
				if (res.data.result == 0) {
					callbak(res.data.data)
				} else if (res.data.result == 2) {
					error && error();
					// showToast('登录失效，请重新登录');
					uni.removeStorageSync("token");
					uni.redirectTo({
						url: '/pages/login/login'
					});
				} else {
					if (res.data.message)
	
						// showToast(res.data.message);
	
					error && error();
				}
			} else if (res.statusCode == 404) {
				// showToast('访问的资源不存在');
				error && error();
			} else if (res.statusCode == 500) {
				// showToast('服务器异常请稍后再试');
				error && error();
			} else if (res.statusCode == 405) {
				// showToast('不允许的请求方法');
				error && error();
			} else {
				// showToast('未知错误请稍后重试');
				error && error();
			}
		}
	});
}

/**
 * 通用请求方法
 */
const request = function(url, param, m, showLoad, callbak, error) {
	var name = "fh";
	for (var d in param) {
		var d; // 属性名name 
		name = name + d;
	}
	//创建日期对象
	var date = new Date;
	//获取年份
	var yy = date.getFullYear();
	//获取月份 
	var mm = date.getMonth() + 1;
	//如果月份小于10 前面加0
	mm = (mm < 10 ? "0" + mm : mm);
	//返回日期 
	var dd = date.getDate();
	dd = (dd < 10 ? "0" + dd : dd);
	var tdr = yy.toString() + mm.toString() + dd.toString()

	var result1 = md5(name + tdr + ',fh,');
	param.FKEY = result1
	param.FKEYNAME = name
	param.uid = uni.getStorageSync("USER_ID");
	//      if (showLoad) {
	// 	uni.showLoading({
	// 		mask: true,
	// 		title: '加载中...'
	// 	})
	// }

	uni.request({
		url: url,
		method: m,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: param,
		fail: (e) => {
			// if (showLoad) {
			// 	uni.hideLoading();
			// }
			// showToast('服务器异常请稍后再试');
			error && error();
		},
		success: (res) => {
			// if (showLoad) {
			// 	uni.hideLoading();
			// }

			if (res.statusCode == 200) {
				if (res.data.result == 0) {
					callbak(res.data.data)
				} else if (res.data.result == 2) {
					error && error();
					showToast('登录失效，请重新登录');
					uni.removeStorageSync("token");
					uni.redirectTo({
						url: '/pages/login/login'
					});
				} else {
					if (res.data.message)

						// showToast(res.data.message);

					error && error();
				}
			} else if (res.statusCode == 404) {
				// showToast('访问的资源不存在');
				error && error();
			} else if (res.statusCode == 500) {
				// showToast('服务器异常请稍后再试');
				error && error();
			} else if (res.statusCode == 405) {
				// showToast('不允许的请求方法');
				error && error();
			} else {
				// showToast('未知错误请稍后重试');
				error && error();
			}
		}
	});
}


export default {
	showToast,
	requestUrl,
	addBaseUrl,
	downloadTask,
	request,
	websiteUrl,
	cache,
	accAdd,
	accSub,
	uuid,
	baseIp
}
