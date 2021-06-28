const REGEX_FILENAME = /^.*[/]/;
let SAVED_DIR = '/storage/emulated/0/验收评价/导出数据/';

export function saveImages(file, files,str, callback) {
	SAVED_DIR = '/storage/emulated/0/验收评价/'+files
	let taskNames = []
	str.forEach(item => {
		//取到任务名
		let taskName = item.split("/")[0] + "/" + item.split("/")[1] + "/" + item.split("/")[2];
		taskNames.push(taskName)
	})
	//任务图片前缀
	let taskImgPrefix = Array.from(new Set(taskNames));
	//图片进行分类
	let taskImage = []
	//图片总数
	let size = 0;
	taskImgPrefix.forEach(entry => {
		let images = []
		str.forEach(item => {
			let taskName = item.split("/")[0] + "/" + item.split("/")[1] + "/" + item.split("/")[2];
			if (taskName == entry) {
				//拿到图片的路径集
				let imageList = item.split(",");
				imageList.forEach(key => {
					//真实路径
					let url = key.replace(taskName + "/", "");
					images.push(url)
					size += 1
				})
			}
		})
		taskImage.push({
			taskName: entry.split("/")[0] + "/" + entry.split("/")[1],
			imageList: images
		})
	})
	let index = 0;
	//循环保存图片
	let mes = main(file,taskImage,size,files)
	callback(mes)
}
async function main(file,taskImage,size,files) {
	let arr =""
	taskImage.forEach(item=>{
		item.imageList.forEach(val=>{
			arr+=val+","
		})
	})
	for (let i = 0; i < taskImage.length; i++) {
		let index = 0;
		let indexName = "";
		for (let j = 0; j < taskImage[i].imageList.length; j++) {
			//图片名称num值重复
			let name = taskImage[i].imageList[j].split("/").pop()
			let num=(arr.split(name)).length-1
			if(num==1){
				index=1
			}else{
				if(indexName==name){
					index += 1;
				}else{
					indexName=name
					index = 1;
				}
			}
			SAVED_DIR = '/storage/emulated/0/验收评价/'
			//图片保存路径
			SAVED_DIR = SAVED_DIR + files +"/"+file+ "/" + taskImage[i].taskName.split("/")[0] + "/"
			let url = taskImage[i].imageList[j].split("/")[0]+"/"+taskImage[i].imageList[j].split("/")[1]+"/"+taskImage[i].imageList[j].split("/")[2]
			await saveFileAndroid(name,taskImage[i].taskName.split("/")[1], index, url).then(res=>{
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
	}
}

// async function main(file,taskImage,size,files) {
// 	for (let i = 0; i < taskImage.length; i++) {
// 		let index = 0;
// 		for (let j = 0; j < taskImage[i].imageList.length; j++) {
// 			index += 1;
// 			SAVED_DIR = '/storage/emulated/0/验收评价/'
// 			//图片保存路径
// 			SAVED_DIR = SAVED_DIR + files +"/"+file+ "/" + taskImage[i].taskName.split("/")[0] + "/"
// 			await saveFileAndroid(taskImage[i].taskName.split("/")[1], index, taskImage[i].imageList[j]).then(res=>{
// 				if (res == "true") {
// 					if (index === size) {
// 						return("返回的是一个文件的位置")
// 					}
// 				} else {
// 					//读取失败
// 					if (index === size) {
// 						return("返回的是一个文件的位置")
// 					}
// 				}
// 			})
// 		}
// 	}
// }

function isNumber(val){
 // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
      if(val === "" || val ==null){
          return false;
      }
      if(!isNaN(val)){
          return true;
      }else{
          return false;
      }
}

function saveFileAndroid(name,taskName, index, tempFilePath) {
	return new Promise(resolve=>{
		let fileName = tempFilePath.replace(REGEX_FILENAME, '');
		if (fileName) {
			fileName = name+": "+ taskName + "_" + "图片" + index + "_整改.png"
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
