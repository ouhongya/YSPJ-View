let mask = document.querySelector(".mask");
let fileDom = document.querySelector(".file");
let tis = document.querySelector(".tis");
let progress = document.querySelector(".tis-progress");
let cancel = document.querySelector(".cancel-btn");

let createUpload = (file, url, key = 'file', header = {}, data = {}) => {
	if (!url) {
		return;
	}
	tis.style.display = 'flex';
	let formData = new FormData();
	formData.append(key, file);
	let uid = data.data.uid;
	let functionid = data.data.functionid;
	let flag = data.data.flag;
	let company_id = data.data.company_id
	progress.innerText = `努力上传中..`;
	//开始保存到数据库
	if (flag == 1) {
		saveData(file, uid, functionid).then(res => {
			if (res) {
				progress.innerText = `上传成功`;
				location.href = `callback?fileName=${escape(file.name)}&id=true}`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 500);
			} else {
				progress.innerText = `上传失败`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 1000);
			}
		})
	}
	if (flag == 2) {
		saveDataToUser(file, uid, functionid, company_id).then(res => {
			if (res) {
				progress.innerText = `上传成功`;
				location.href = `callback?fileName=${escape(file.name)}&id=true}`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 1000);
			} else {
				progress.innerText = `上传失败`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 1000);
			}
		})
	}
	if (flag == 3) {
		saveDataToUnit(file, uid, functionid, company_id).then(res => {
			if (res) {
				progress.innerText = `上传成功`;
				location.href = `callback?fileName=${escape(file.name)}&id=true}`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 1000);
			} else {
				progress.innerText = `上传失败`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 1000);
			}
		})
	}
	if (flag == 4) {
		saveExam(url,file, uid, functionid, company_id).then(res => {
			if (res!==true) {
				progress.innerText = `上传成功`;
				location.href = `callback?id=${escape(res)}`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 1000);
			} else {
				progress.innerText = `上传失败`;
				setTimeout(() => {
					tis.style.display = 'none';
					plus.webview.currentWebview().close();
				}, 1000);
			}
		})
	}
}
mask.addEventListener("click", () => {
	plus.webview.currentWebview().close();
});
document.addEventListener('UniAppJSBridgeReady', () => {
	let {
		url,
		key,
		header,
		formData
	} = plus.webview.currentWebview();
	fileDom.value = "";
	fileDom.addEventListener('change', (event) => {
		progress.innerText = '格式校验中...';
		let file = fileDom.files[0];
		if (file.size > (1024 * 1024 * 10)) {
			plus.nativeUI.toast('单个文件请勿超过10M,请重新上传');
			return;
		}
		let flag = JSON.stringify(formData.data.flag)
		let uid = formData.data.uid
		if (flag == 1) {
			//格式校验
			importf(file).then(res => {
				if (res.constructor == String) {
					plus.nativeUI.toast(res);
					plus.webview.currentWebview().close();
					return;
				} else {
					createUpload(file, url, key, header, formData);
				}
			})
		}
		if (flag == 2) {
			//格式校验
			checkDataToUser(file, uid).then(res => {
				if (res.constructor == String) {
					plus.nativeUI.toast(res);
					plus.webview.currentWebview().close();
					return;
				} else {
					createUpload(file, url, key, header, formData);
				}
			})
		}
		if (flag == 3) {
			//格式校验
			checkDataToUnit(file).then(res => {
				if (res.constructor == String) {
					plus.nativeUI.toast(res);
					plus.webview.currentWebview().close();
					return;
				} else {
					createUpload(file, url, key, header, formData);
				}
			})
		}
		if (flag == 4) {
			let exemList = formData.data.company_id
			ExamChecks(file,exemList).then(res=>{
				if (res.constructor == String) {
						plus.nativeUI.toast(res);
						plus.webview.currentWebview().close();
						return;
					} else {
						createUpload(file, url, key, header, formData);
					}
			})
		}
	}, false);
});


/**
 * 导入题库
 * @param {Object} url
 * @param {Object} file
 * @param {Object} id
 * @param {Object} funtionId
 * @param {Object} company_id
 */
function saveExam(url,file, id, funtionId,company_id) {
   return new Promise(resolve=>{
	    let reader = new FileReader();
	           reader.onload = function (e) {
				   let fileData = e.target.result;
				   let wb = XLSX.read(fileData, {
						type: 'binary'
				   });
	               let excelData = {}
	               excelData.id = uuid();
	               excelData.title = htmlEncodeByRegExp(file.name.substring(0, file.name.lastIndexOf('.')) == '' ? file.name : file.name.substring(0, file.name.lastIndexOf('.')));
	               excelData.radio = 0
	               excelData.checkbox = 0
	               excelData.judge = 0
	               excelData.user_id = id
	               excelData.status = 0
	               //解析数据
	               let data = []
	               wb.SheetNames.forEach((item) => {
	                   data.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
	                       header: ["index", "type", "major", "content", "option0", "answer", "basis"
	                       ]
	                   }))
	               })
	               let inArr = []

				   data.forEach((sheet) => {
					   let inArr1 = []
					   sheet.forEach((item, index) => {
						   if (index !== 0) {
							   if (item.hasOwnProperty("index")) {
								   inArr1.push(index)
							   }
						   }
					   })
					   inArr.push(inArr1)
				   })
				   //数组组装
				   data.forEach(sheet => {
					   inArr.forEach(val => {
						   let arr = {}
						   sheet.forEach((item, index) => {
							   if (index !== 0) {
								   val.forEach(num => {
									   if (num === index) {
										   switch (item.type) {
											   case "单选题":
												   item.type = 1
												   break;
											   case "多选题":
												   item.type = 2
												   break;
											   case "判断题":
												   item.type = 3
												   break;
										   }
										   //选择项组装
										   arr = sheetDialog(sheet, num + 1)
										   for (let key in arr) {
											   sheet[num][key] = arr[key]
										   }
										   let inde = 0;
										   for (let [key, value] of Object.entries(sheet[num])) {
											   if (key.indexOf("option") !== -1 || key === "option0") {
												   inde += 1
												   sheet[num][key] = value
											   }
										   }
										   if (item.type === 3) {
											   arr = sheetDialog3(sheet, num + 1)
											   if(arr.answer){
												   sheet[num].answer=arr.answer
											   }
										   }
										   //多选题答案组装
										   if (item.type === 2) {
											   arr = sheetDialog1(sheet, num + 1)
											   sheet[num].answer += arr
											   let strings = sheet[num].answer.split("※");
											   for (var i = strings.length - 1; i >= 0; i--) {
												   if (strings[i].indexOf("/") !== -1) {
													   strings = strings.concat(strings[i].split("/"))
													   strings.splice(i, 1)
												   } else if (/^[a-zA-Z]+$/.test(strings[i]) && strings[i].length !== 1 && strings[i] != "undefined") {
													   strings = (strings[i].split(""))
												   }
											   }
											   strings.forEach(val => {
												   if (/^[a-zA-Z]+$/.test(val)) {
													   var tonum = stringTonum(val) - 1;
													   for (let [key, value] of Object.entries(sheet[num])) {
														   if (key.indexOf("option") != -1 && key.substring(key.length - 1, key.length) == tonum) {
															   var number = strings.indexOf(val);
															   strings.splice(number, 1)
															   strings.splice(number, 0, value)
														   }
													   }
												   }
											   })
											   sheet[num].answer = strings.join("※")
											   //sheet[num].answer = sheet[num].answer.replaceAll("/", "※")
											   //sheet[num].answer = sheet[num].answer.replaceAll("undefined", "")
										   }
									   }
								   })
							   }
						   })
					   })
				   })
				   data.forEach(sheet => {
					   for (var i = sheet.length - 1; i >= 0; i--) {
						   if (!sheet[i].hasOwnProperty("index")) {
							   sheet.splice(i, 1)
						   }
					   }
				   })
				   let topicArr = []
	               let answerArr = []
				   let ids = []
	               data.forEach(sheet => {
	                   sheet.forEach((item, index) => {
	                       if (index !== 0) {
	                           switch (item.type) {
	                               case 1:
	                                   excelData.radio += 1
	                                   break;
	                               case 2:
	                                   excelData.checkbox += 1
	                                   break;
	                               case 3:
	                                   excelData.judge += 1
	                                   break;
	                           }
	                           let topic = {}
	                           topic.id = uuid();
							   company_id.forEach(items=>{
								   if(items.label== item.major){
										topic.exam_category_id =items.value
										ids.push(items.value)
								   }
							   })
							   topic.type = item.type
							   topic.stem = item.content
							   topic.exam_batch_id = excelData.id
							   topic.status = 0
							   topic.quote = item.basis
							   topic.user_id = id
							   for (let [key, value] of Object.entries(item)) {
							   	if (key.indexOf("option") !== -1) {
							   		let answer = {}
							   		answer.id =uuid();
							   		answer.exam_topic = topic.id
							   		answer.forder = changeLetter(parseInt(key.substring(key.length - 1, key.length)) + 1)
							   		switch (item.type) {
							   			case 1:
							   				if (!/^[a-zA-Z]+$/.test(item.answer)) {
							   					value === item.answer ? answer.type = 0 : answer.type = 1;
							   				} else {
							   					answer.forder === item.answer ? answer.type = 0 : answer.type = 1;
							   				}
							   				break;
							   			case 2:
							   				var split = item.answer.split("※");
							   				split.indexOf(value) != -1 ? answer.type = 0 : answer.type = 1;
							   				break;
							   			case 3:
							   				if (!/^[a-zA-Z]+$/.test(item.answer)) {
							   					value === item.answer ? answer.type = 0 : answer.type = 1;
							   				} else {
							   					answer.forder === item.answer ? answer.type = 0 : answer.type = 1;
							   				}
							   				break;
							   		}
							   		answer.content = value
							   		answerArr.push(answer)
							   	}
							   }
							   topicArr.push(topic)
	                       }
	                   })
	               })
				  let arr =  []
				  arr.push(excelData)
				  DataUpload(url,{topic:JSON.stringify(topicArr),topicByAnswer:JSON.stringify(answerArr),excel:JSON.stringify(arr)},id,callback=>{
					   if(callback){
						   resolve(ids)
					   }else{
						    resolve(false)
					   }
				   })
	           }
	    reader.readAsBinaryString(file);
   })
}

/**
 * 导入题库格式校验
 * @param {Object} file
 * @param {Object} ExcamList
 */
function ExamChecks(file,examList){
	 return new Promise(resolve => {
	            let reader = new FileReader();
	            reader.onload = function (e) {
	                let fileData = e.target.result;
	                let wb = XLSX.read(fileData, {
	                    type: 'binary'
	                });
	                //解析数据
	                let data = []
	                wb.SheetNames.forEach((item) => {
	                    data.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
	                        header: ["index", "type", "major", "content", "option0", "answer", "basis"
	                        ]
	                    }))
	                })
	                let excelData = {}
	                excelData.id=uuid()
	                excelData.title = htmlEncodeByRegExp(file.name.substring(0, file.name.lastIndexOf('.')) == '' ? file.name : file.name.substring(0, file.name.lastIndexOf('.')));
	                excelData.radio = 0
	                excelData.checkbox = 0
	                excelData.judge = 0
	                excelData.user_id = ""
	                excelData.status = 0
	                excelData.stemList = []
	                let inArr = []

					data.forEach((sheet) => {
						let inArr1 = []
						sheet.forEach((item, index) => {
							if (index !== 0) {
								if (item.hasOwnProperty("index")) {
									inArr1.push(index)
								}
							}
						})
						inArr.push(inArr1)
					})
					//数组组装
					data.forEach(sheet => {
						inArr.forEach(val => {
							let arr = {}
							sheet.forEach((item, index) => {
								if (index !== 0) {
									val.forEach(num => {
										if (num === index) {
											switch (item.type) {
												case "单选题":
													item.type = 1
													break;
												case "多选题":
													item.type = 2
													break;
												case "判断题":
													item.type = 3
													break;
											}
											//选择项组装
											arr = sheetDialog(sheet, num + 1)
											for (let key in arr) {
												sheet[num][key] = arr[key]
											}
											let inde = 0;
											for (let [key, value] of Object.entries(sheet[num])) {
												if (key.indexOf("option") !== -1 || key === "option0") {
													inde += 1
													sheet[num][key] = value
												}
											}
											if (item.type === 3) {
												arr = sheetDialog3(sheet, num + 1)
												if(arr.answer){
													sheet[num].answer=arr.answer
												}
											}
											//多选题答案组装
											if (item.type === 2) {
												arr = sheetDialog1(sheet, num + 1)
												sheet[num].answer += arr
												let strings = sheet[num].answer.split("※");
												for (var i = strings.length - 1; i >= 0; i--) {
													if (strings[i].indexOf("/") !== -1) {
														strings = strings.concat(strings[i].split("/"))
														strings.splice(i, 1)
													} else if (/^[a-zA-Z]+$/.test(strings[i]) && strings[i].length !== 1 && strings[i] != "undefined") {
														strings = (strings[i].split(""))
													}
												}
												strings.forEach(val => {
													if (/^[a-zA-Z]+$/.test(val)) {
														var tonum = stringTonum(val) - 1;
														for (let [key, value] of Object.entries(sheet[num])) {
															if (key.indexOf("option") != -1 && key.substring(key.length - 1, key.length) == tonum) {
																var number = strings.indexOf(val);
																strings.splice(number, 1)
																strings.splice(number, 0, value)
															}
														}
													}
												})
												sheet[num].answer = strings.join("※")
												//sheet[num].answer = sheet[num].answer.replaceAll("/", "※")
												//sheet[num].answer = sheet[num].answer.replaceAll("undefined", "")
											}
										}
									})
								}
							})
						})
					})
					data.forEach(sheet => {
						for (var i = sheet.length - 1; i >= 0; i--) {
							if (!sheet[i].hasOwnProperty("index")) {
								sheet.splice(i, 1)
							}
						}
					})


					let ids = []
	                data.forEach(sheet => {
	                    sheet.forEach((item, index) => {
	                        if (index !== 0) {
	                            switch (item.type) {
	                                case 1:
	                                    excelData.radio += 1
	                                    break;
	                                case 2:
	                                    excelData.checkbox += 1
	                                    break;
	                                case 3:
	                                    excelData.judge += 1
	                                    break;
	                            }
	                            let topic = {}
	                            topic.id = uuid();
	                            examList.forEach(items => {
	                                if (items.label == item.major) {
	                                    topic.exam_category_id = items.value
	                                    ids.push(items.value)
	                                }
	                            })
	                            topic.type = item.type
	                            topic.stem = item.content
	                            topic.exam_batch_id = excelData.id
	                            topic.status = 0
	                            topic.quote = item.basis
	                            topic.user_id = "1232132"
	                            topic.answerList = []
	                            for (let [key, value] of Object.entries(item)) {
	                                if (key.indexOf("option") !== -1) {
	                                    let answer = {}
	                                    answer.id = uuid();
	                                    answer.exam_topic = topic.id
	                                    answer.forder = changeLetter(parseInt(key.substring(key.length - 1, key.length)) + 1)
	                                    switch (item.type) {
	                                        case 1:
	                                            if (!/^[a-zA-Z]+$/.test(item.answer)) {
	                                                value === item.answer ? answer.type = 0 : answer.type = 1;
	                                            } else {
	                                                answer.forder === item.answer ? answer.type = 0 : answer.type = 1;
	                                            }
	                                            break;
	                                        case 2:
	                                            var split = item.answer.split("※");
	                                            split.indexOf(value) != -1 ? answer.type = 0 : answer.type = 1;
	                                            break;
	                                        case 3:
	                                            if (!/^[a-zA-Z]+$/.test(item.answer)) {
	                                                value === item.answer ? answer.type = 0 : answer.type = 1;
	                                            } else {
	                                                answer.forder === item.answer ? answer.type = 0 : answer.type = 1;
	                                            }
	                                            break;
	                                    }
	                                    answer.content = value
	                                    topic.answerList.push(answer)
	                                }
	                            }
	                            excelData.stemList.push(topic)
	                        }
	                    })
	                })
	                //格式校验
	                if (excelData.checkbox == 0 && excelData.judge == 0 && excelData.radio == 0) {
	                    resolve("请使用系统模板上传")
	                }
	                excelData.stemList.forEach(item => {
	                    if (item.exam_category_id==null || item.quote==null  || item.stem==null  || item.answerList.length === 0) {
	                        resolve("请使用系统模板上传")
	                    }
	                    let answerList = []
	                    let answerIndexList = []
	                    item.answerList.forEach(entry => {
	                        answerList.push(entry.content)
	                        if (!entry.content) {
	                            resolve("请使用系统模板上传")
	                        }
	                        answerIndexList.push(entry.forder)
	                    })
	                    if (CheckArrayElement(answerList) > 0) {
	                        resolve("请使用系统模板上传")
	                    }
	                    let sort = answerIndexList.sort();
	                    let numStr = ""
	                    sort.forEach(num => {
	                        numStr += num
	                        if (!/^[a-zA-Z]+$/.test(num)) {
	                            resolve("请使用系统模板上传")
	                        }
	                    })
	                    if (!coherent(numStr)) {
	                        resolve("请使用系统模板上传")
	                    }
	                })
	                resolve(true)
	            }
	            reader.readAsBinaryString(file);
	        })
}

function coherent(name) {
        var lcontinuity = 0; //用于连贯个数的计数
        for (var i = 1; i < name.length; i++) {
            if (((name[i].charCodeAt()) - (name[i - 1].charCodeAt()) == 1) || ((name[i].charCodeAt()) - (name[i - 1].charCodeAt()) == -1)) { //1正序连贯；-1倒序连贯
                lcontinuity += 1; //存在连贯：计数+1
            };
        }
        if (lcontinuity > (name.length - 2)) {//连贯总数=字符串长度-2；代表全部连贯
            return true;
        } else {
            return false;
        }
    }

    //返回数组元素是否出现重复项（等于0：没有，大于0：有）
    function CheckArrayElement(array) {
        array.sort();  //数组排序
        var reNum = 0;  //返回结果
        //遍历整个数组对象
        for (var i = 0; i < array.length; i++) {
            //跳过最后一个元素的比较
            if (i + 1 == array.length) {
                continue;
            }
            //判断相邻的元素是否相同
            if (array[i] == array[i + 1]) {
                reNum += 1;
            }
        }
        return reNum;
    }

function DataUpload(url,param,uid,callback){
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
		param.uid = uid;
		let xhr = new XMLHttpRequest();
		xhr.open("post",url,true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.onreadystatechange = (ev) => {
			if(xhr.readyState == 4) {
				if (xhr.status == 200) {
					let data = JSON.parse(xhr.responseText)
					if(data.data=="SUCCESS"){
						callback(true)
					}else{
						callback(false)
					}
				}else {
					if (xhr.status == 0) {
						callback(false)
					}
				}
			}
		};
		let data = new URLSearchParams({topic:param.topic,topicByAnswer:param.topicByAnswer,excel:param.excel})
		xhr.send(data);
}

function stringTonum(a) {
        var str = a.toLowerCase().split("");
        var al = str.length;
        var getCharNumber = function (charx) {
            return charx.charCodeAt() - 96;
        };
        var numout = 0;
        var charnum = 0;
        for (var i = 0; i < al; i++) {
            charnum = getCharNumber(str[i]);
            numout += charnum * Math.pow(26, al - i - 1);
        }
        ;
        return numout;
    }

function changeLetter(num) {
        var stringName = "";
        if (num > 0) {
            if (num >= 1 && num <= 26) {
                stringName = String.fromCharCode(64 + parseInt(num));
            } else {
                while (num > 26) {
                    var count = parseInt(num / 26);
                    var remainder = num % 26;
                    if (remainder == 0) {
                        remainder = 26;
                        count--;
                        stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
                    } else {
                        stringName = String.fromCharCode(64 + parseInt(remainder)) + stringName;
                    }
                    num = count;
                }
                stringName = String.fromCharCode(64 + parseInt(num)) + stringName;
            }
        }
        return stringName;
    }

function sheetDialog3(sheet, index) {
        let arr = {}
        for (var i = 0; i < sheet.length; i++) {
            if (index <= i) {
                if (!sheet[i].hasOwnProperty("index")&&sheet[i].hasOwnProperty("answer")) {
                    if(sheet[i].option0=="错误"||sheet[i].option0=="正确") {
                        arr.answer = sheet[i].answer;
                    }
                } else {
                    break;
                }
            }
        }
        return arr;
    }

    function sheetDialog(sheet, index) {
        let arr = {}
        let int = 0;
        for (var i = 0; i < sheet.length; i++) {
            if (index <= i) {
                if (!sheet[i].hasOwnProperty("index")) {
                    if(sheet[i].type==3){
                        int += 1;
                        arr["option" + int] = sheet[i].option0;
                    }else{
                        int += 1;
                        arr["option" + int] = sheet[i].option0;
                    }
                } else {
                    break;
                }
            }
        }
        return arr;
    }

    function sheetDialog1(sheet, index) {
        let arr = ""
        for (var i = 0; i < sheet.length; i++) {
            if (index <= i) {
                if (!sheet[i].hasOwnProperty("index")) {
                    if (sheet[i].answer !== undefined) {
                        if (/^[a-zA-Z]+$/.test(sheet[i].answer) && sheet[i].answer.length != 1) {
                            arr = arr + "※" + (sheet[i].answer.split("").join("※")).toString()
                        } else if (sheet[i].answer.indexOf("/") != -1) {
                            arr = arr + "※" + (sheet[i].answer.split("/").join("※")).toString()
                        } else {
                            arr = arr + "※" + sheet[i].answer;
                        }
                    }
                } else {
                    break;
                }
            }
        }

        return arr;
    }
/**
 * 数据保存
 * @param {Object} f
 * @param {Object} id
 */
function saveData(f, id, functionid) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = function(e) {
			let data = e.target.result;
			let wb = XLSX.read(data, {
				type: 'binary'
			});
			//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
			//wb.Sheets[Sheet名]获取第一个Sheet的数据
			let jsonMap = []
			wb.SheetNames.forEach((item) => {
				jsonMap.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
					header: ["serial", "item", "content", "total_score", "score",
						"untitled", "mode", "standard"
					]
				}))
			})
			//存储标题行的索引
			let indexMap = [];
			//excelId
			let excelId = uuid();
			//总检查项
			let totalChecked = 0;
			//记录sheet位置
			let sheetIndex = -1;
			let normList = []
			let normDetailList = [];
			let normDetailRowList = [];
			jsonMap.forEach((item, index1) => {
				sheetIndex += 1
				item.forEach((val, index2) => {
					if (val.serial === "序号") {
						indexMap.push({
							index1,
							index2
						})
					}
				})
				let dataIndex = indexMap[index1];
				//拿到索引值
				let indexNum = 0;
				for (let key in dataIndex) {
					indexNum = dataIndex[key]
				}
				let norm = [];
				let normId = uuid();
				//总检查项
				let normTotalChecked = 0;
				let normDetailList1 = [];
				item.forEach((val, index3) => {
					if (index3 > indexNum) {
						let obj = {};
						obj.id = uuid();
						obj.norm_id = normId;
						obj.serial = val.serial;
						obj.item = htmlEncodeByRegExp(val.item);
						obj.sortNum = index3;
						obj.total_score = val.total_score === undefined ? 0 : val.total_score;
						obj.untitled = val.untitled === undefined ? '' : val.untitled;
						obj.totlecheck = findCountNormDetailNum(item, val.serial, indexNum);
						obj.content = val.content === undefined ? '' : val.content;
						obj.score = val.score === undefined ? '' : val.score;
						obj.mode = val.mode === undefined ? '' : val.mode;
						obj.standard = val.standard === undefined ? '' : val.standard;
						obj.created_time = new Date().getTime();
						obj.updatetime = new Date().getTime();
						obj.type = /(^[1-9]\d*$)/.test(obj.serial) == true ? 0 : 1;
						if (obj.untitled !== '' && obj.untitled != '') {
							normTotalChecked += 1;
							totalChecked += 1;
						}
						//解析检查行的数据
						if (obj.untitled != null || obj.untitled != undefined) {
							let rowList = obj.untitled.split("\n");
							let ewq = 0
							rowList.forEach(item => {
								ewq += 1;
								normDetailRowList.push({
									id: uuid(),
									norm_detail_id: obj.id,
									row_id: typeof(item.substring(0, 1)) ==
										"number" ? item.substring(0, 1) :
										ewq,
									score: readNum(item),
									content: item,
									created_time: new Date().getTime(),
									direty: '1',
									isDelete: '0',
									updatetime: new Date().getTime(),
								})
							})
						}
						normDetailList1.push(obj)
					}
				})
				normDetailRowList = normDetailRowList.filter(item => item.content != '');
				let arr = queryParentId(normDetailList1)
				arr.forEach(entry => {
					normDetailList.push(entry)
				})
				let strArr = [];
				item.forEach((val, index3) => {
					if (index3 < indexNum) {
						for (let key in val) {
							strArr.push(val[key])
						}
					}
				})
				//let names = strArr[0].split("、")[1]
				let names = wb.SheetNames[sheetIndex].split("、")[1] == undefined ? wb.SheetNames :
					wb.SheetNames[sheetIndex].split("、")[1]
				normList.push({
					norm_id: normId,
					excel_id: excelId,
					name: htmlEncodeByRegExp(names + ""),
					unit: strArr[1] == undefined ? null : strArr[1],
					content: strArr[2] == undefined ? null : strArr[2],
					total_score: strArr[3] == undefined ? null : strArr[3],
					score_time: strArr[4] == undefined ? null : strArr[4],
					sortNum: index1, //排序值
					direty: "1",
					isDelete: "0",
					normTotalChecked: normTotalChecked,
					created_time: new Date().getTime(),
					updatetime: new Date().getTime()
				})
			})
			let excelSize = fileSize(f.size);
			//excel表
			let obj = {}
			obj.id = excelId;
			obj.url = null;
			obj.name = htmlEncodeByRegExp(f.name.substring(0, f.name.lastIndexOf('.')) == '' ? f.name : f.name.substring(0, f.name.lastIndexOf('.')));
			obj.user_id = id;
			obj.categort_id = '';
			obj.status = 0;
			if (functionid != 1) functionid = 2
			obj.type = functionid;
			obj.view = 1;
			obj.totlecheck = totalChecked;
			obj.size = excelSize;
			obj.created_time = new Date().getTime();
			obj.direty = "1";
			obj.updatetime = new Date().getTime();
			let sql1 =
				"INSERT INTO tb_excel (id,url,'name',user_id,categort_id,'status','type','view',totlecheck,size,created_time,direty,'delete',updatetime)VALUES('" +
				obj.id + "','" + obj.url + "','" + obj.name + "','" + obj.user_id + "','" + obj
				.categort_id + "','" + obj.status +
				"','" + obj.type + "','" + obj.view + "','" + obj.totlecheck + "','" + obj.size + "','" +
				obj.created_time +
				"','" + obj.direty + "','0','" + obj.updatetime + "')"
			//Excel存入数据库
			executeSQL('local', sql1, res1 => {
				executeSQL('local',
					"insert into tb_excel_user (excel_id,user_id,status,direty,'delete',updatetime) values ('" +
					obj.id + "','" + id + "','0','1','0','" + new Date().getTime() + "')",
					ress => {
						let sql2Top =
							"INSERT INTO tb_norm (norm_id,excel_id,'name',unit,content,total_score,score_time,totlecheck,created_time,direty,'delete','updatetime')"
						let sql2After = ""
						normList.forEach(item => {
							sql2After += "  select '" + item.norm_id + "','" + item
								.excel_id + "','" + item.name + "','" + item.unit +
								"','" + item.content + "','" + item.total_score +
								"','" + item.score_time + "','" + item
								.normTotalChecked +
								"','" + item.created_time + "','" + item.direty +
								"','" + item.isDelete + "' ,'" + item.updatetime + "'" +
								" UNION"
						})
						let sql2 = sql2Top + sql2After.substring(0, sql2After.length - 5);
						//Norm存入数据库
						executeSQL('local', sql2, res2 => {
							//分批次执行
							let normDetailLength = normDetailList.length
							//取模决定执行几次
							let num = Math.ceil(normDetailLength / 450)
							if (num == 1) {
								let sql3Top =
									"INSERT INTO tb_norm_detail (id,norm_id,'serial',item,untitled,content,total_score,score,'mode',standard,totlecheck,type,parent_id,created_time,direty,'delete',updatetime)"
								let sql3After = "";
								normDetailList.forEach(val => {
									sql3After += "  select '" + val.id + "','" +
										val
										.norm_id + "','" + val.serial + "','" +
										val
										.item + "','" +
										val.untitled + "','" + val.content +
										"','" +
										val.total_score + "','" + val.score +
										"','" +
										val.mode + "','" + val.standard +
										"','" +
										val.totlecheck + "','" + val.type +
										"','" +
										val.parent_id +
										"','" + val.created_time +
										"','1','0' ,'" +
										val.updatetime + "'" + " UNION"
								})
								let sql3 = sql3Top + sql3After.substring(0, sql3After
									.length - 5)
								//NormDetail存入数据库
								executeSQL('local', sql3, res3 => {
									//分批次插入
									let lenths = normDetailRowList.length
									let nums = Math.ceil(lenths / 450)
									if (nums == 1) {
										let sql4After = "";
										let sql4Top =
											"INSERT INTO tb_norm_detail_row (id,norm_detail_id,'row_id',score,content,created_time,direty,'delete','updatetime')"
										normDetailRowList.forEach(entry => {
											sql4After += "  select  '" +
												entry.id + "','" + entry
												.norm_detail_id +
												"','" +
												entry.row_id +
												"','" + entry.score +
												"','" + entry.content +
												"','" + entry
												.created_time +
												"','" + entry.direty +
												"','" + entry.isDelete +
												"','" + entry
												.updatetime +
												" 'UNION"
										})
										let sql4 = sql4Top + sql4After
											.substring(0, sql4After.length - 5)
										executeSQL('local', sql4, res4 => {
											resolve(true)
										})
									} else {
										saveNormDetailRow(normDetailRowList,
											nums, callback => {
												resolve(true)
											})
									}
								})
							} else {
								saveNormDetail(normDetailList, num, callback => {
									//分批次插入
									let lenths = normDetailRowList.length
									let nums = Math.ceil(lenths / 450)
									if (nums == 1) {
										let sql4After = "";
										let sql4Top =
											"INSERT INTO tb_norm_detail_row (id,norm_detail_id,'row_id',score,content,created_time,direty,'delete','updatetime')"
										normDetailRowList.forEach(entry => {
											sql4After += "  select  '" +
												entry.id + "','" + entry
												.norm_detail_id +
												"','" +
												entry.row_id +
												"','" + entry.score +
												"','" + entry.content +
												"','" + entry
												.created_time +
												"','" + entry.direty +
												"','" + entry.isDelete +
												"','" + entry
												.updatetime +
												" 'UNION"
										})
										let sql4 = sql4Top + sql4After
											.substring(0, sql4After.length - 5)
										executeSQL('local', sql4, res4 => {
											resolve(true)
										})
									} else {
										saveNormDetailRow(normDetailRowList,
											nums, callback => {
												resolve(true)
											})
									}
								})
							}
						})
					})
			})
		}
		reader.readAsBinaryString(f);
	})
};

//异步去执行保存准则详情的方法
async function saveNormDetail(normDetailList, num, callback) {
	let indexSize = 0;
	for (i = 0; i < num + 1; i++) {
		let sql3Top =
			"INSERT INTO tb_norm_detail (id,norm_id,'serial',item,untitled,content,total_score,score,'mode',standard,totlecheck,type,parent_id,created_time,direty,'delete',updatetime)"
		let sql3After = "";
		indexSize += 1
		let normDetailListSize = -1;
		normDetailList.forEach(val => {
			normDetailListSize += 1
			if (indexSize == 1) {
				if (indexSize * 450 > normDetailListSize) {
					sql3After += "  select '" + val.id + "','" + val
						.norm_id + "','" + val.serial + "','" + val
						.item + "','" +
						val.untitled + "','" + val.content + "','" +
						val.total_score + "','" + val.score +
						"','" +
						val.mode + "','" + val.standard + "','" +
						val.totlecheck + "','" + val.type + "','" +
						val.parent_id +
						"','" + val.created_time + "','1','0' ,'" +
						val.updatetime + "'" + " UNION"
				}
			} else {
				let strlength = ((indexSize - 1) * 450)
				if ((indexSize * 450) > normDetailListSize && normDetailListSize >= strlength) {
					sql3After += "  select '" + val.id + "','" + val
						.norm_id + "','" + val.serial + "','" + val
						.item + "','" +
						val.untitled + "','" + val.content + "','" +
						val.total_score + "','" + val.score +
						"','" +
						val.mode + "','" + val.standard + "','" +
						val.totlecheck + "','" + val.type + "','" +
						val.parent_id +
						"','" + val.created_time + "','1','0' ,'" +
						val.updatetime + "'" + " UNION"
				}
			}
		})
		let sql3 = sql3Top + sql3After.substring(0, sql3After.length - 5)
		//NormDetail存入数据库
		await normDetailSql(sql3).then(res => {
			if (indexSize == num) {
				callback(true)
			}
		})
	}
}

//异步去执行保存准则行的方法
async function saveNormDetailRow(normDetailList, num, callback) {
	let indexSize = 0;
	for (i = 0; i <= num + 1; i++) {
		let sql3Top =
			"INSERT INTO tb_norm_detail_row (id,norm_detail_id,'row_id',score,content,created_time,direty,'delete','updatetime')"
		let sql3After = "";
		indexSize += 1
		let normDetailListSize = -1;
		normDetailList.forEach(entry => {
			normDetailListSize += 1
			if (indexSize == 1) {
				if ((indexSize * 450) > normDetailListSize) {
					sql3After += "  select  '" +
						entry.id + "','" + entry
						.norm_detail_id +
						"','" +
						entry.row_id +
						"','" + entry.score +
						"','" + entry.content +
						"','" + entry
						.created_time +
						"','" + entry.direty +
						"','" + entry.isDelete +
						"','" + entry
						.updatetime +
						" 'UNION"
				}
			} else {
				let strlength = ((indexSize - 1) * 450)
				if ((indexSize * 450) > normDetailListSize && normDetailListSize >= strlength) {
					sql3After += "  select  '" +
						entry.id + "','" + entry
						.norm_detail_id +
						"','" +
						entry.row_id +
						"','" + entry.score +
						"','" + entry.content +
						"','" + entry
						.created_time +
						"','" + entry.direty +
						"','" + entry.isDelete +
						"','" + entry
						.updatetime +
						" 'UNION"
				}
			}
		})
		let sql3 = sql3Top + sql3After.substring(0, sql3After.length - 5)
		//NormDetail存入数据库
		await normDetailSql(sql3).then(res => {
			if (indexSize == num) {
				callback(true)
			}
		})
	}
}

function normDetailSql(sql3) {
	return new Promise(resolve => {
		executeSQL('local', sql3, res3 => {
			resolve(res3)
		})
	})
}

/**
 * 格式校验标准
 * @param {Object} f
 */
function queryParentId(str) {
	//拿到所有的第一个serial也就是序号
	let numArr = []
	str.forEach(item => {
		if (item.type === 0) {
			numArr.push(item.serial)
		}
	})
	numArr.forEach(entry => {
		str.forEach(item => {
			if (item.type === 1) {
				let string = item.serial.toString();
				if (string.split(".")[0] === entry.toString()) {
					//拿到子序号
					let serial = item.serial;
					if (item.untitled != null && item.untitled != '') {
						let res = this.queryNumSerial(str, serial)
						if (res == undefined || res == null) {
							item.parent_id = 0
						} else {
							item.parent_id = res
						}
					} else {
						item.parent_id = 0
					}
				}
			} else {
				item.parent_id = 0
			}
		})
	})
	return str;
}

//获取子序号
function queryNumSerial(item, serial) {
	let result = null;
	item.forEach(entry => {
		let afterSerial = serial.toString().split(".")[0];
		if (afterSerial.toString() === entry.serial.toString()) {
			result = entry.id;
		}
	})
	return result;
}

//模板校验
function importf(f) {
	return new Promise((resolve, reject) => {
		let checks = suffixChecks(f);
		if (checks.constructor === String) {
			resolve(checks);
		}
		let reader = new FileReader();
		reader.onload = function(e) {
			let data = e.target.result;
			let wb = XLSX.read(data, {
				type: 'binary'
			});
			//格式校验第一步
			let jsonMap1 = []
			//跳过sheet名称校验
			wb.SheetNames.forEach((item) => {
				jsonMap1.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
					header: 1
				}))
			})
			jsonMap1.forEach(item => {
				if (item[0].length !== 1) {
					resolve("请使用系统模板上传")
				}
			})
			jsonMap1.forEach(item => {
				let itemElement = 0;
				let flag = false;
				let flagNum = 0;
				item.forEach((entry, index) => {
					if (entry.length !== 0 && entry.indexOf("序号") > -1) {
						itemElement = index + 1;
					}
					if (itemElement !== 0) {
						if (index !== itemElement - 1) {
							let element = entry[5];
							if (element) {
								let split = element.split("\n");
								var splitElement = split[0];
								if (splitElement === null || splitElement ===
									"这里边儿每一条检查项为一行；enter换行；") {
									flag = true
								}
							} else {
								flagNum += 1;
							}
						}
					}
				})
				if (flag || flagNum === item.length - itemElement) {
					resolve("请使用系统模板上传")
				}
			})
			//内容是否为空
			//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
			//wb.Sheets[Sheet名]获取第一个Sheet的数据
			let jsonMap = []
			wb.SheetNames.forEach((item) => {
				jsonMap.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
					header: ["serial", "item", "content", "total_score", "score",
						"untitled", "mode", "standard"
					]
				}))
			})
			//存储标题行的索引
			let indexMap = [];
			jsonMap.forEach((item, index1) => {
				let valueArr = []
				item.forEach(val => {
					for (let key in val) {
						let value = val[key];
						valueArr.push(value)
					}
				})
				//序号校验
				let isFlag1 = findArr(valueArr, '序号')
				let isFlag2 = findArr(valueArr, '评价原则')
				if (!isFlag2) {
					if (valueArr.indexOf("评分原则") != -1) {
						isFlag2 = true
					}
				}
				//类容校验
				if (isFlag1 && isFlag2) {
					item.forEach((val, index2) => {
						index2 += 1;
						for (let key in val) {
							let value = val[key];
							if (value === "序号") {
								indexMap.push({
									index1,
									index2
								})
							}
						}
					})
					let dataIndex = indexMap[index1];
					//拿到索引值
					let indexNum = 0;
					for (let key in dataIndex) {
						indexNum = dataIndex[key]
					}
					//评分原则的索引
					let pointSystemIndex = 0;
					item.forEach((val, index3) => {
						//拿到当前标题的元素数量
						if (index3 === indexNum - 1) {
							let index4 = 0;
							for (let key in val) {
								index4++;
								let value = val[key];
								if (value === "评价原则") {
									pointSystemIndex = index4;
								}
							}
						}
						if (index3 > indexNum) {
							if (val.untitled != undefined) {
								if (val.untitled != undefined && val.content != undefined) {
									// let indexs = 0
									// let indexc = 0
									// let rowList = val.untitled.split("\n");
									// indexs = rowList.length
									// rowList.forEach(cc=>{
									// 	if(cc!=null&&cc!=''&&cc!='\r'){
									// 		if(cc.indexOf("分")==-1&&cc.indexOf("扣")==-1 ){
									// 			indexc+=1
									// 			if(indexc==indexs){
									// 				resolve("请使用系统模板上传")
									// 			}
									// 		}
									// 	}else{
									// 		indexc+=1
									// 	}
									// })
								} else {
									resolve("请使用系统模板上传")
								}
							}
						}
					})
					resolve(true);
				} else {
					let ind = index1 + 1
					resolve("请使用系统模板上传")
				}
			})
		}
		reader.readAsBinaryString(f);
	})
}

/**
 * 格式校验用户模板
 * @param {Object} f
 */
function checkDataToUser(f, uid) {
	return new Promise((resolve, reject) => {
		//格式校验
		let checks = suffixChecks(f);
		if (checks.constructor === String) {
			resolve(checks);
		}
		let reader = new FileReader();
		reader.onload = function(e) {
			let data = e.target.result;
			let wb = XLSX.read(data, {
				type: 'binary'
			});
			//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
			//wb.Sheets[Sheet名]获取第一个Sheet的数据
			//用户模板校验
			let jsonMap = []
			wb.SheetNames.forEach((item) => {
				jsonMap.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
					header: ["username", "phone", "role", "department", "position"]
				}))
			})
			//所有的数据
			let dataList = []
			let usernameList = []
			let phoneList = []
			let roleList = []
			jsonMap.forEach((item, index) => {
				item.forEach((entry, entryIndex) => {
					if (entryIndex !== 0) {
						usernameList.push(entry.username)
						phoneList.push(entry.phone)
						roleList.push(entry.role)
						dataList.push(entry)
					} else {
						if (!isTemplate(entry, 1)) {

							resolve("请使用系统模板上传")
						}
					}
				})
			})
			//校验是否有空值
			if (idArrayToNull(dataList)) {
				resolve("请使用系统模板上传")
			}
			//数据格式校验
			dataList.forEach(item => {
				if (item.username === null || item.username === undefined || item.username === "" ||
					item.role === null ||
					item.role === undefined || item.role === "" || item.phone === null || item
					.phone === undefined || item.phone ===
					"") {
					resolve("请使用系统模板上传")
				}
			})
			//姓名校验
			usernameList.forEach(item => {
				let check = checkName(item);
				if (checkName(item).constructor === String) {
					resolve(check);
				}
			})
			//手机号码校验是否重复
			checkPhone(phoneList, uid).then(res => {
				if (res.constructor === String) {
					resolve(res);
				} else {
					//角色校验
					checkRole(roleList, uid).then(res1 => {
						resolve(res1);
					});
				}
			});
			//公司用户数校验
			companyNumcheck(uid, dataList.length).then(res => {
				if (res.constructor === String) {
					resolve(res);
				}
			})
		};
		reader.readAsBinaryString(f);
	})
}

/**
 * 用户模板数据保存
 * @param {Object} f
 */
function saveDataToUser(f, uid, functionid, company_id) {
	return new Promise(resolve => {
		getRole(uid).then(res => {
			let reader = new FileReader();
			reader.onload = function(e) {
				let data = e.target.result;
				let wb = XLSX.read(data, {
					type: 'binary'
				});
				//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
				//wb.Sheets[Sheet名]获取第一个Sheet的数据
				//用户模板校验
				let jsonMap = []
				wb.SheetNames.forEach((item) => {
					jsonMap.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
						header: ["username", "phone", "role", "department",
							"position"
						]
					}))
				})
				//所有的数据
				let userList = []
				jsonMap.forEach((item, index) => {
					item.forEach((entry, entryIndex) => {
						if (entryIndex !== 0) {
							let role = res.filter(function(item) {
								return item.role_name == entry.role;
							})
							let c = entry.phone + ""
							userList.push({
								user_id: uuid(),
								password: parseInt(c.substring(c.length - 6,
									c.length)),
								name: entry.username,
								role_id: role[0].role_id,
								status: '0',
								phone: entry.phone,
								company_id: company_id,
								direty: 1,
								idDelete: 0,
								updatetime: new Date().getTime()
							})
						}
					})
				})
				//批量插入数据库
				let sql =
					"insert into sys_user (user_id,password,name,role_id,status,phone,company_id,direty,'delete',updatetime,isupdate)"
				let sqlAfter = ""
				userList.forEach(item => {
					sqlAfter += "  select '" + item.user_id + "','" + item.password +
						"','" + item.name + "','" + item.role_id +
						"','" + item.status + "','" + item.phone + "','" + item.company_id +
						"','" + item.direty +
						"','" + item.idDelete + "','" + item.updatetime + "','0' UNION"
				})
				let sql2 = sql + sqlAfter.substring(0, sqlAfter.length - 5);
				executeSQL('local', sql2, res1 => {
					resolve(true)
				})
			};
			reader.readAsBinaryString(f);
		})
	})
}

/**
 * 格式校验单位模板
 * @param {Object} f
 */
function checkDataToUnit(f) {
	return new Promise(resolve => {
		//格式校验
		let checks = suffixChecks(f);
		if (checks.constructor === String) {
			resolve(checks);
		}
		let reader = new FileReader();
		reader.onload = function(e) {
			let data = e.target.result;
			let wb = XLSX.read(data, {
				type: 'binary'
			});
			//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
			//wb.Sheets[Sheet名]获取第一个Sheet的数据
			//用户模板校验
			let jsonMap = []
			wb.SheetNames.forEach((item) => {
				jsonMap.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
					header: ["name", "person", "phone", "address", "childName",
						"childPerson", "childPhone", "childAddress"
					]
				}))
			})
			//所有的数据
			let dataList = []
			let dataTileList = []
			jsonMap.forEach((item, index) => {
				item.forEach((entry, entryIndex) => {
					if (entryIndex !== 0) {
						entry.indexName = wb.SheetNames[index]
						entry.index = entryIndex + 1
						dataList.push(entry)
						dataTileList.push(entry.name)
					} else {
						if (!isTemplate(entry)) {

							resolve("请使用系统模板上传")
						}
					}
				})
			})
			//校验是否有空值
			if (idArrayToNull(dataList)) {
				resolve("请使用系统模板上传")
			}
			let dataTileListAttribute = Array.from(new Set(dataTileList));
			let dataListAttribute = []
			dataTileListAttribute.forEach(item => {
				let dataObj = {}
				let dataListChildAttribute = []
				dataList.forEach(entry => {
					if (item === entry.name) {
						dataObj.index = entry.index,
							dataObj.indexName = entry.indexName,
							dataObj.unit_user = entry.person,
							dataObj.address = entry.address,
							dataObj.unit_userphone = entry.phone
						dataListChildAttribute.push({
							unit_name: entry.childName,
							index: entry.index,
							indexName: entry.indexName,
							unit_user: entry.childPerson,
							address: entry.childAddress,
							unit_userphone: entry.childPhone,
						})
					}
				})
				dataObj.unit_name = item
				dataObj.childList = dataListChildAttribute
				dataListAttribute.push(dataObj)
			})
			dataListAttribute.forEach(item => {
				let unitName = item.unit_name;
				item.childList.forEach(entry => {
					if (unitName === entry.unit_name) {

						resolve(entry.indexName + "里边的" + entry.index + "行的子单位名不能和主单位名称重名")
					}
				})
				let flag = isReName(item.childList);
				if (flag.constructor === String) {
					resolve(flag);
				}
			})
			resolve(true)
		};
		reader.readAsBinaryString(f);
	})
}

/**
 * 格式校验存到数据库
 * @param {Object} f
 * @param {Object} company_id
 */
function saveDataToUnit(f, uid, functionid, company_id) { //导入
	return new Promise(resolve => {
		let reader = new FileReader();
		reader.onload = function(e) {
			let data = e.target.result;
			let wb = XLSX.read(data, {
				type: 'binary'
			});
			//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
			//wb.Sheets[Sheet名]获取第一个Sheet的数据
			//用户模板校验
			let jsonMap = []
			wb.SheetNames.forEach((item) => {
				jsonMap.push(XLSX.utils.sheet_to_json(wb.Sheets[item], {
					header: ["name", "person", "phone", "address", "childName",
						"childPerson", "childPhone", "childAddress"
					]
				}))
			})
			//所有的数据
			let dataList = []
			let dataTileList = []
			jsonMap.forEach((item, index) => {
				item.forEach((entry, entryIndex) => {
					if (entryIndex !== 0) {
						dataList.push(entry)
						dataTileList.push(entry.name)
					}
				})
			})
			let dataTileListAttribute = Array.from(new Set(dataTileList));
			let dataListAttribute = []
			let w = 0;
			let w1 = 0;
			let w2 = 0;
			let w3 = 0;
			let w5 = 0;
			dataTileListAttribute.forEach(item => {
				let w4 = 0;
				w5 += 10
				let dataId = new Date().getTime() + w5;
				let dataObj = {}
				let dataListChildAttribute = []
				dataList.forEach(entry => {
					if (item === entry.name) {
						w1 += 1
						w2 += 2
						w3 += 3
						w4 += 1
						if (w4 == 1) {
							dataObj.unit_id = dataId,
								dataObj.unit_name = htmlEncodeByRegExp(entry.name),
								dataObj.unit_user = entry.person,
								dataObj.address = entry.address,
								dataObj.unit_userphone = entry.phone
							dataObj.parent_id = 0,
								dataObj.status = '0',
								dataObj.company_id = company_id,
								dataObj.direty = '1',
								dataObj.isDelete = "0",
								dataObj.updatetime = new Date().getTime() + w3
						}
						dataListChildAttribute.push({
							unit_id: new Date().getTime() + w1,
							unit_name: htmlEncodeByRegExp(entry.childName),
							unit_user: entry.childPerson,
							address: entry.childAddress,
							unit_userphone: entry.childPhone,
							parent_id: dataId,
							status: '0',
							company_id: company_id,
							direty: '1',
							isDelete: "0",
							updatetime: new Date().getTime() + w2
						})
					}
				})
				dataObj.unit_id = dataId,
					dataObj.unit_name = item
				dataObj.childList = dataListChildAttribute
				w += dataListChildAttribute.length
				dataListAttribute.push(dataObj)
			})
			let r = 0;
			dataListAttribute.forEach(item => {
				//查询是否存在此单位
				selectSQL("local", "select unit_id from sys_unit where unit_name = '" + item
					.unit_name + "' and parent_id = '0' and status = 0 and company_id='" +
					company_id + "'", res => {
						if (res == "") {
							let sql =
								"insert into sys_unit (unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id,direty,'delete',updatetime) values ('" +
								item.unit_id + "','" + item.unit_name + "','" + item.unit_user +
								"','" + item.unit_userphone + "','" +
								item.address + "','" + item.parent_id + "','" + item.status +
								"','" + item.company_id + "','" + item.direty +
								"','" + item.isDelete + "','" + item.updatetime + "')"
							executeSQL("local", sql, res1 => {
								item.childList.forEach(val => {
									selectSQL("local",
										"select unit_id from sys_unit where unit_name = '" +
										val.unit_name +
										"' and parent_id != '0' and status=0 and company_id='" +
										company_id + "'",
										res2 => {
											if (res2 == "") {
												let sql3 =
													"insert into sys_unit (unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id,direty,'delete',updatetime) values ('" +
													val.unit_id + "','" +
													val.unit_name + "','" +
													val.unit_user + "','" +
													val.unit_userphone +
													"','" + val.address +
													"','" + val.parent_id +
													"','" + val.status +
													"','" + val.company_id +
													"','" + val.direty +
													"','" + val.isDelete +
													"','" + val.updatetime +
													"')"
												executeSQL("local", sql3,
													res3 => {
														r += 1;
														if (r == w) {
															resolve(
																true)
														}
													})
											} else {
												let sql =
													"update sys_unit set  unit_name = '" +
													val.unit_name +
													"',unit_user='" + val
													.unit_user +
													"',unit_userphone='" +
													val.unit_userphone +
													"',address = '" + val
													.address +
													"' where unit_id = '" +
													res2[0].unit_id + "'"
												executeSQL("local", sql,
													res3 => {
														r += 1;
														if (r == w) {
															resolve(
																true)
														}
													})
											}
										})
								})
							})
						} else {
							let sql = "update sys_unit set  unit_name = '" + item.unit_name +
								"',unit_user='" + item.unit_user +
								"',unit_userphone='" + item.unit_userphone + "',address = '" +
								item.address +
								"' where unit_id = '" + res[0].unit_id + "'"
							executeSQL("local", sql, resUnit => {
								item.childList.forEach(val => {
									selectSQL("local",
										"select unit_id from sys_unit where unit_name = '" +
										val.unit_name +
										"' and parent_id == '" + res[0]
										.unit_id +
										"' and status =0 and company_id='" +
										company_id + "'",
										res2 => {
											if (res2 == "") {
												let sql3 =
													"insert into sys_unit (unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id,direty,'delete',updatetime) values ('" +
													val.unit_id + "','" +
													val.unit_name + "','" +
													val.unit_user + "','" +
													val.unit_userphone +
													"','" + val.address +
													"','" + res[0].unit_id +
													"','" + val.status +
													"','" + val.company_id +
													"','" + val.direty +
													"','" + val.isDelete +
													"','" + val.updatetime +
													"')"
												executeSQL("local", sql3,
													res3 => {
														r += 1;
														if (r == w) {
															resolve(
																true)
														}
													})
											} else {
												let sql =
													"update sys_unit set  unit_name = '" +
													val.unit_name +
													"',unit_user='" + val
													.unit_user +
													"',unit_userphone='" +
													val.unit_userphone +
													"',address = '" + val
													.address +
													"' where unit_id = '" +
													res2[0].unit_id + "'"
												executeSQL("local", sql,
													res3 => {
														r += 1;
														if (r == w) {
															resolve(
																true)
														}
													})
											}
										})
								})
							})
						}
					})
				if (r == w) {
					resolve(true)
				}
			})
		};
		reader.readAsBinaryString(f);
	})
}

//校验数组对象中是否包含空值
function idArrayToNull(arr) {
	//校验数据是否有空的
	let attributeNum = []
	arr.forEach(item => {
		attributeNum.push(attributeCount(item))
	})
	let count = Array.from(new Set(attributeNum));
	if (count.length !== 1) {
		return true
	}
	return false
}

function isReName(arr) {
	let result = true
	for (var i = 0; i < arr.length - 1; i++) {
		for (var j = i + 1; j < arr.length; j++) {
			if (arr[i].unit_name === arr[j].unit_name) {
				result = arr[i].indexName + "里边的" + arr[i].index + "行和" + arr[j].index + "行的子单位名称重复了"
			}
		}
	}
	return result;
}

function isTemplate(entry, flag) {
	if (flag === 1) {
		//"username", "phone", "role", "department", "position"
		let dataListTitle = [];
		let username = entry.username;
		if (username === null || username === undefined || username === "") {
			return false
		}
		let phone = entry.phone;
		if (phone === null || phone === undefined || phone === "") {
			return false
		}
		let role = entry.role;
		if (role === null || role === undefined || role === "") {
			return false
		}
		let department = entry.department;
		if (department === null || department === undefined || department === "") {
			return false
		}
		let position = entry.position;
		if (position === null || position === undefined || position === "") {
			return false
		}
		dataListTitle.push(username, phone, role, department, position)
		let dataListTiles = ["姓名", "手机号码", "角色", "部门", "职位"]
		if (dataListTitle.toString() === dataListTiles.toString()) {
			return true
		} else {
			return false
		}
	} else {
		let dataListTitle = [];
		let name = entry.name;
		if (name === null || name === undefined || name === "") {
			return false
		}
		let person = entry.person;
		if (person === null || person === undefined || person === "") {
			return false
		}
		let phone = entry.phone;
		if (phone === null || phone === undefined || phone === "") {
			return false
		}
		let address = entry.address;
		if (address === null || address === undefined || address === "") {
			return false
		}
		let childName = entry.childName;
		if (childName === null || childName === undefined || childName === "") {
			return false
		}
		let childPerson = entry.childPerson;
		if (childPerson === null || childPerson === undefined || childPerson === "") {
			return false
		}
		let childPhone = entry.childPhone;
		if (childPhone === null || childPhone === undefined || childPhone === "") {
			return false
		}
		let childAddress = entry.childAddress;
		if (childAddress === null || childAddress === undefined || childAddress === "") {
			return false
		}
		dataListTitle.push(name, person, phone, address, childName, childPerson, childPhone, childAddress)
		let dataListTiles = ["单位名称", "负责人", "负责人电话", "单位地址", "子单位名称", "子单位负责人", "子单位负责人电话", "子单位地址"]
		if (dataListTitle.toString() === dataListTiles.toString()) {
			return true
		} else {
			return false
		}
	}
}

function isRightName(name) {
	var reg = /^[a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D\u00B7\u2022\u0095\u0387]+$/;
	var strRe = /[\u4E00-\u9FA5]/g;
	var str = name.match(strRe);
	var strlength;
	if (str == null) {
		strlength = name.length;
	} else {
		strlength = name.length + str.length * 2; // 汉字按三个字节
	}
	if (strlength <= 3 || strlength > 48) {
		return false;
	}
	if (!name.match(reg)) {
		return false;
	} else {
		var headExp = /^[\u00B7\u2022\u0095\u0387]+/;
		var tailExp = /[\u00B7\u2022\u0095\u0387]+$/;
		var zhExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+[\s]+/;
		var zhcharExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+[u00B7\u2022\u0095\u0387]?[a-zA-Z]+/;
		var charzhExp = /[a-zA-Z]+[u00B7\u2022\u0095\u0387]?[\u4E00-\u9FA5\uF900-\uFA2D]+/;
		var emptyExp = /\s/g;
		if (headExp.test(name)) {
			return false;
		}
		if (tailExp.test(name)) {
			return false;
		}
		if (zhExp.test(name)) {
			return false;
		}
		if (zhcharExp.test(name)) {
			return false;
		}
		if (charzhExp.test(name)) {
			return false;
		}
		return true;
	}
}

// 姓名校验
function checkName(username) {
	username = JSON.stringify(username)
	let pattern = new RegExp(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/);
	if (pattern.test(username)) {
		console.log("账户姓名只能是汉字字母或数字")
		return false;
	}
	if (username === "") {
		console.log("请填写账户姓名")
		return "请使用系统模板上传";
	}
	if (username != undefined) {
		if (username.length > 10) {
			console.log("账户姓名过长，请您最多输入10个汉字。")
			return "请使用系统模板上传";
		}
	} else {
		return "请使用系统模板上传";
	}

	if (username.length < 2) {
		console.log("账户姓名必须大于2个汉字")
		return "请使用系统模板上传";
	}
	return true;
}

// 手机校验
function checkPhone(phone, uid) {
	return new Promise((resolve, reject) => {
		//校验是否是重复的值
		if (mm(phone)) {
			resolve("请使用系统模板上传")
		}
		//校验数据库是否存在重复的值
		//拿这些手机去数据库count一下
		let sql = ""
		phone.forEach(item => {
			sql += "'" + item + "',"
		})
		sql = sql.substring(0, sql.length - 1)
		selectSQL("local",
			"SELECT count(user_id) as num FROM sys_user WHERE company_id = ( SELECT company_id FROM sys_user WHERE user_id = '" +
			uid + "' ) AND status = '0' AND phone IN (" + sql + ")", res => {
				if (res[0].num !== 0) {
					resolve("手机号码重复")
				} else {
					resolve(true);
				}
			})
	})
}

//公司人数校验
function companyNumcheck(uid, num) {
	return new Promise(resolve => {
		//查询公司当前人数,以及人数标准
		selectSQL("local",
			"SELECT sys_role.function_id AS numUser, 1 AS type FROM sys_role WHERE role_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '" +
			uid +
			"' ) UNION SELECT COUNT(sys_user.user_id) AS numUser, 2 AS type FROM sys_user WHERE company_id = ( SELECT sys_user.company_id FROM sys_user WHERE user_id = '" +
			uid + "' ) AND status = 0", res => {
				//总限额人数
				let totalUser = 0
				//实际多少人
				let realUser = 0
				res.forEach(item => {
					if (item.type == 1) {
						totalUser = item.numUser
					} else {
						realUser += item.numUser
					}
				})
				if (totalUser >= (realUser + num)) {
					resolve(true)
				}
				if (totalUser < (realUser + num)) {
					resolve("公司账号已上限,上限账号是: " + totalUser + " ,当前已有账号: " + realUser + " 个")
				}
			})
	})
}

function mm(a) {
	return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + a.join("\x0f\x0f") + "\x0f");
}

//获取当前公司下的所有角色
function getRole(uid) {
	return new Promise(resolve => {
		selectSQL("local",
			" select sys_role.role_id,sys_role.role_name from sys_role where parent_id = (SELECT company_id from sys_user where user_id = '" +
			uid + "') and status = '0' ", res => {
				resolve(res)
			})
	})
}

//角色校验
function checkRole(roleList, uid) {
	return new Promise((resolve, reject) => {
		//查询数据库的角色
		selectSQL("local",
			"select sys_role.role_name from sys_role where parent_id = (SELECT company_id from sys_user where user_id = '" +
			uid + "') and status = '0'",
			res => {
				let roles = []
				res.forEach(item => {
					roles.push(item.role_name)
				})
				roleList.forEach(item => {
					//数据不存在
					if (roles.indexOf(item) === -1) {
						resolve("请使用系统模板上传")
					}
				})
				resolve(true);
			})
	})
}

function to_json(workbook) {
	let result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetName] = roa;
		}
	});
	return result;
}

function readNum(item) {
	if (!hasNumber(item)) {
		if (item.indexOf("分") == -1 && item.indexOf("扣") == -1) {
			return hasNumber1(item)
		} else {
			let i = 2;
			while (true) {
				i += 1;
				if (item.indexOf("扣") > 0) {
					if (!isRealNum(item.substring(item.indexOf("扣") + 1, item.indexOf("扣") + i))) {
						return item.substring(item.indexOf("扣") + 1, item.indexOf("扣") + i - 1);
					}
				} else if (item.indexOf("，扣") > 0) {
					if (!isRealNum(item.substring(item.indexOf("，扣") + 2, item.indexOf("，扣") + i))) {
						return item.substring(item.indexOf("，扣") + 2, item.indexOf("，扣") + i - 1);
					}
				} else {
					let num = item.substring(item.indexOf("分") - (i - 2), item.indexOf("分"));
					if (!isRealNum(num)) {
						return item.substring(item.indexOf("分") - (i - 2) + 1, item.indexOf("分"));
					}
				}
			}
		}
	} else {
		return 0;
	}
}

function hasNumber(str) {
	for (var i in str) {
		var asc = str.charCodeAt(i);
		if (asc >= 48 && asc <= 57) {
			return true;
		}
	}
	return false;
}

function hasNumber1(str) {
	let index = -1
	for (let i in str) {
		index += 1
		if (index > 1 && /(^[1-9]\d*$)/.test(str[i]) && str[i] != undefined) {
			return str[i]
		}
	}
}

function isRealNum(val) {
	// isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
	if (val === "" || val == null) {
		return false;
	}
	if (!isNaN(val)) {
		//对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
		//所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
		return true;
	} else {
		return false;
	}
}

//数组判断某个值是否存在
function findArr(arr, obj) {
	let result = false;
	for (let i = 0; i < arr.length - 1; i++) {
		if (arr[i] === obj) {
			result = true;
			break;
		}
	};
	return result;
}

//uuid生成
function uuid() {
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() +
		S4());
}

function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

//js 获取对象属性个数
function attributeCount(obj) {
	let count = 0;
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) { // 建议加上判断,如果没有扩展对象属性可以不加
			count++;
		}
	}
	return count;
}

//文件格式校验
function suffixChecks(file) {
	//再对文件名进行截取，以取得后缀名
	let namearr = file.name.split(".");
	//获取截取的最后一个字符串，即为后缀名
	let suffix = namearr[namearr.length - 1];
	//添加需要判断的后缀名类型
	let tp = "xlsx,xls";
	//返回符合条件的后缀名在字符串中的位置
	let rs = tp.indexOf(suffix);
	//如果返回的结果大于或等于0，说明包含允许上传的文件类型
	if (rs >= 0) {
		return true;
	} else {
		return "请上传xlsx或者xls格式的文件";
	}
}

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

//文件大小
function fileSize(fileByte) {
	let fileSizeByte = fileByte;
	let fileSizeMsg = "";
	if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
	else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
	else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(
			2) +
		"MB";
	else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
	else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 *
		1024)).toFixed(2) + "GB";
	else fileSizeMsg = "文件超过1TB";
	return fileSizeMsg;
}

//计算当前检查详情下有多少个检查项目
function findCountNormDetailNum(item, serial, index1) {
	let normDetailTotalChecked = 0;
	item.forEach((val, index2) => {
		if (index2 > index1) {
			if (!/[^\x00-\x80]/.test(val.serial)) {
				let serial1 = "";
				if (/(^[1-9]\d*$)/.test(val.serial)) {
					serial1 = val.serial
				} else {
					if (val.serial.toString().split(".").length > serial.toString().split(".").length && val
						.serial.toString().indexOf(serial.toString()) != -1 && val.serial.toString().split(".")[
							0] == serial.toString().split(".")[0]) {
						serial1 = serial
					}
					// if (serial.length != 1) {
					// 	serial1 = val.serial.toString().substring(0, 2)
					// } else {
					// 	serial1 = val.serial.toString().charAt(0)
					// }
				}
				if (serial == serial1) {
					if (val.untitled != null) {
						normDetailTotalChecked += 1;
					}
				}
			}
		}
	})
	return normDetailTotalChecked;
}

function htmlEncodeByRegExp(str) {
	var s = "";
	if (str.length == 0) return "";
	s = str.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/ /g, "");
	s = s.replace(/\'/g, "&#39;");
	s = s.replace(/\"/g, "&quot;");
	s = s.replace(/\n"/g, "");
	s = s.replace(/\r"/g, "");
	return s;
}
