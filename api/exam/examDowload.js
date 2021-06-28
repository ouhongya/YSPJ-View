const REGEX_FILENAME = /^.*[/]/;
let SAVED_DIR =""

//保存文件到指定位置
export function saveExamXLSA(url, fileName) {
	return new Promise(resolve=>{
		let type = uni.getSystemInfoSync().platform
		if (type == 'android') {
			uni.downloadFile({
				url: url,
				success: (reas) => {
					var time = new Date().Format("yyyyMMdd hh:mm:ss");  
					SAVED_DIR = "/storage/emulated/0/验收评价/成绩导出/"+time+"/"
					saveFileAndroid(reas.tempFilePath,fileName).then(res => {
						uni.removeSavedFile({
							filePath: reas.tempFilePath,
							complete: function(resc) {
								resolve("根目录/验收评价/成绩导出/"+time+"/"+fileName)
							}
						});
					})
				}
			})
		} else {
			uni.downloadFile({
				url: url,
				success: (res) => {
					resolve(res.tempFilePath)
				}
			})
		}
	})
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "D+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
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

function saveFileAndroid(tempFilePath,fileName) {
	return new Promise(resolve => {
		if (fileName) {
			plus.io.resolveLocalFileSystemURL(getRealPath(tempFilePath), entry => {
				getSavedFileDir(dir => {
					entry.copyTo(dir, fileName, () => {
						resolve("true")
					}, err => {
						resolve(' 保存失败')
					});
				}, message => {
					resolve("fail" + message)
				});
			}, err => {
				resolve("读取失败")
			});
		} else {
			resolve({
				errMsg: 'saveFile:fail 文件名[' + tempFilePath + ']不存在'
			})
		}
	})
}

function head(array) {
	return array && array.length ? array[0] : undefined
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
//获取文件的相对路径
const _handleLocalPath = filePath => {
	let localUrl = plus.io.convertLocalFileSystemURL(filePath);
	return localUrl.replace(/^\/?apps\//, '/android_asset/apps/').replace(/\/$/, '')
};

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
