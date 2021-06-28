import helper from '@/common/helper.js';

/**
 * 图片同步
 */
export  function uploadImage() {
	let  uid = uni.getStorageSync("USER_ID")
	let  functionid = uni.getStorageSync("functionid")
	uni.getSavedFileList({
		success: function(res) {
			//获取本地最新的图片
			let names = filteringUrlName(res)
			if(res.fileList.length==0){
				uploadImageNull(names)
			}else{
				//数据过滤
				let imgs = uni.getStorageSync("imgs")
				if(imgs==''||imgs==null||imgs==[]){
					imgs=[]
				}
				for(let i=res.fileList.length-1;i>=0;i--){
					if(imgs.indexOf(res.fileList[i].filePath)!=-1){
						res.fileList.splice(i,1)
					}
				}
				if(res.fileList.length==0||res.fileList==[]){
					uploadImageNull(names)
					return
				}
				//发送请求
				res.fileList.forEach(item=>{
					uni.uploadFile({
						url: helper.websiteUrl+'v1/updateImage',
						filePath: item.filePath,
						formData: {
						                'uid': uid,
										'functionId':functionid
						 },
						name: 'image',
						success: (res) => {
							if(res.statusCode==200){
								imgs.push(item.filePath)
								uni.setStorageSync("imgs",Array.from(new Set(imgs)))
								let data =JSON.parse(res.data).data
								if(data.length==0){
									return
								}
								for(let i =0;i<=data.length-1;i++){
									if(names.indexOf(data[i].imageName)==-1){
										names.push(data[i].imageName)
										 uni.downloadFile({
										     url:helper.baseIp+data[i].imageUrl,
										     success: (res) => {
										         if (res.statusCode === 200) {
													 uni.getImageInfo({
													   src: res.tempFilePath, //仅做示例用，非真正的文件路径
													   success: function (resc) {
													     let strings = resc.path.split("/");
													         let url = "/"
													         for (let i = 0; i < strings.length; i++) {
													             if(i>=3&&i<=11){
													                 url+=strings[i]+"/"
													                 if(i==11){
													                     url+="uniapp_save/"
													                 }
													             }
													         }
															 SAVED_DIR = url
															saveFileAndroid(res.tempFilePath).then(ress=>{
																													 uni.removeSavedFile({
																													     filePath: res.tempFilePath,
																													     complete: function (res) {}
																													  });
															})
													   }
													 });
													
										         }
										     }
										 });
									}
								}
							}
						}
					});
				})
			}
		}
	});
}

function uploadImageNull(names){
	helper.requestUrl(helper.websiteUrl + "v1/updateImageNull",names, 'GET', (res) => {
		if(res.length!=0){
			let data =res
			if(data.length==0){
				return
			}
			for(let i =0;i<=data.length-1;i++){
				if(names.indexOf(data[i].imageName)==-1){
					names.push(data[i].imageName)
					 uni.downloadFile({
					     url:helper.baseIp+data[i].imageUrl,
					     success: (res) => {
					         if (res.statusCode === 200) {
								 uni.getImageInfo({
								   src: res.tempFilePath, //仅做示例用，非真正的文件路径
								   success: function (resc) {
									 let strings = resc.path.split("/");
									     let url = "/"
									     for (let i = 0; i < strings.length; i++) {
									         if(i>=3&&i<=11){
									             url+=strings[i]+"/"
									             if(i==11){
									                 url+="uniapp_save/"
									             }
									         }
									     }
										 SAVED_DIR = url
										 saveFileAndroid(res.tempFilePath).then(ress=>{
										 									 uni.removeSavedFile({
										 									     filePath: res.tempFilePath,
										 									     complete: function (res) {}
										 									  });
										 })
								   }
								 });
								
					         }
					     }
					 });
				}
			}
		}
	})
}


function filteringUrlName (list){
	let arr= []
	list.fileList.forEach(entry=>{
		arr.push(entry.filePath.split("/")[2])
	})
	return(arr)
}

const REGEX_FILENAME = /^.*[/]/;
let SAVED_DIR = '';

function saveFileAndroid(tempFilePath) {
	return new Promise(resolve=>{
		let fileName = tempFilePath.replace(REGEX_FILENAME, '');
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
