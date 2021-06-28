const REGEX_FILENAME = /^.*[/]/;
let SAVED_DIR = '/storage/emulated/0/验收评价/图表统计/';

export async function saveImage(file) {
	await saveFileAndroid(file).then(res=>{
		if (res == "true") {
			if (index === size) {
				return("返回的是一个文件的位置")
			}
		} else {
			//读取失败
			if (index === size) {
				return("返回的是一个文件的位置")
			}
		}
	})
}

function saveFileAndroid(tempFilePath) {
	return new Promise(resolve=>{
		let fileName = tempFilePath.replace(REGEX_FILENAME, '');
		if (fileName) {
			plus.io.resolveLocalFileSystemURL(getRealPath(tempFilePath), entry => { // 读取临时文件 FileEntry
				getSavedFileDir(dir => {
					entry.copyTo(dir, fileName, () => { // 复制临时文件 FileEntry，为了避免把相册里的文件删除，使用 copy，微信中是要删除临时文件的
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
			resolve ({
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
