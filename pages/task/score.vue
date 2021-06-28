<template>
	<view class="problemList">
		<a-head :text="headTitle" bgColor="#4abdb4"></a-head>
		<view class="scorll-content">
			<scroll-view class="scroll-view_H" v-if="data.tasktype != '2'" scroll-x="true">
				<view class="top">
					<view class="scorll-th detail">
						<view class="srorll-title">评分项</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">评分类型</view>
					</view>
					<view class="scorll-th detailscore">
						<view class="srorll-title">分值</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">问题性质</view>
					</view>
					<view class="scorll-th pic">
						<view class="srorll-title">图片</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">备注</view>
					</view>
				</view>
				<view v-for="(item, index) in data.rowdata" :key="index" class="tableheight">
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">{{item.rcontent}}</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									<u-input v-model="item.problemtype" type="select" :border="true" @click="chooseType(index)" placeholder="点击选择" />
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detailscore">
						<view class="scorll-td">
							<view class="content">
								<view class="number">
									<view class="sub" @tap.stop="sub(index)">
										<u-icon color="#333" size="24" name="minus"></u-icon>
									</view>
									<view class="input"><input type="number" v-model="item.number" @input.stop="numberChange($event, index)" @blur="blur($event, index)" /></view>
									<view class="add" @tap.stop="add(index)">
										<u-icon color="#333" size="24" name="plus"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">

								<view class="input" v-if="item.natureflag">
									<u-input v-model="item.problemnature" type="select" :border="true" @click="chooseNature(index)" placeholder="点击选择" />
								</view>
								<view class="input" v-else>
									<u-input v-model="item.problemnature" type="text" :border="true" placeholder="点击选择" :disabled="true" class="gray" />
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th pic">
						<view class="scorll-td">

							<view class="content">
								<view class="tips" @click="managePic1(index)" v-if="item.showPic1">编辑照片</view>
								<view class="tips" @click="finishPic1(index)" v-if="!item.showPic1&&item.fileList.length>0">编辑完成</view>
								<view class="imgpart" v-if="item.showPic1">
									<u-swiper :list="item.fileList" @click="previewImage(item.fileList)"></u-swiper>
								</view>
								<view class="upload" v-else @click="getIndex(index)">
									<u-upload @on-success="uploadImg" :action="action" :file-list="item.fileList" name="image" @on-remove="onRemove"
									 ref="uUpload" :show-upload-list="true"></u-upload>
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									<u-input v-model="item.remark" type="textarea" height="100" :auto-height="true" placeholder="请输入备注" @input="replaceInput(index)"/>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>

			<u-action-sheet :list="typeList" v-model="showtype" @click="typeSheetCallback" @close="typeSheetClose"></u-action-sheet>
			<u-action-sheet :list="natureList" v-model="show" @click="natureSheetCallback" @close="natureSheetClose"></u-action-sheet>

			<scroll-view class="scroll-view_H" v-if="data.tasktype == '2'" scroll-x="true">
				<view class="top">
					<view class="scorll-th detail">
						<view class="srorll-title">评分项</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">评分类型</view>
					</view>
					<view class="scorll-th detailscore">
						<view class="srorll-title">分值</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">问题性质</view>
					</view>
					<view class="scorll-th pic">
						<view class="srorll-title">问题图片</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">问题备注</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">整改要求</view>
					</view>
					<view class="scorll-th pic">
						<view class="srorll-title">整改图片</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">整改备注</view>
					</view>
				</view>
				<view v-for="(item, index) in data.rowdata" :key="index" class="tableheight">
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">{{item.rcontent}}</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									 {{item.problemtype?item.problemtype:'暂无'}}
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detailscore">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									 {{item.number?item.number:'0'}}
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									 {{item.problemnature?item.problemnature:'暂无'}}
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th pic">
						<view class="scorll-td">
							<view class="content">
								<view class="imgpart" v-if="item.fileList.length>0">
									<u-swiper :list="item.fileList" @click="previewImage(item.fileList)"></u-swiper>
								</view>
								<view class="imgpart" v-else>
									<view class="empty-tips">暂无图片</view>
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">
								<view class="input" v-if="item.remark">
									 {{item.remark}}
								</view>
								<view class="input" v-else>
									<view class="empty-tips">暂无备注</view>
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									 {{item.correct?item.correct:'暂无'}}
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th pic">
						<view class="scorll-td">
							<view class="content">
								<view class="tips" @click="managePic11(index)" v-if="item.showPic11">编辑照片</view>
								<view class="tips" @click="finishPic11(index)" v-if="!item.showPic11&&item.fileList1.length>0">编辑完成</view>
								<view class="imgpart" v-if="item.showPic11">
									<u-swiper :list="item.fileList1" @click="previewImage(item.fileList1)"></u-swiper>
								</view>
								<view class="upload" v-else @click="getIndex(index)">
									<u-upload @on-success="uploadImg1" :action="action" :file-list="item.fileList1" name="image" @on-remove="onRemove11"
									 ref="uUpload" :show-upload-list="true"></u-upload>
								</view>
							</view>
						</view>
					</view>

					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									<u-input v-model="item.correctremark" type="textarea" height="100" :auto-height="true" placeholder="请输入整改备注" @input="replaceInput2(index)"/>
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="action">
			<view class="bottom">
				<view class="cancel" @click="cancel">取消</view>
				<view class="save" @click="save">保存</view>
			</view>
		</view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	export default {
		data() {
			return {
				headTitle: '',
				show: false,
				clickindex: '',
				showtype: false,
				clicktypeindex: '',
				showtime: false,
				timeIndex: '',
				action: null,
				tableList: [{
					id: '435345',
					showPic1: false,
					number: 0, //如果分值
					list1: [],
					natureflag: true, //是否需要选择问题性质
					problemtype: '扣分', //需要默认选中
					problemnature: '一般' //需要默认选中
				}],
				currentIndex: "",
				natureList: [{
						type: 1,
						text: '一般'
					},
					{
						type: 2,
						text: '严重'
					}
				],
				typeList: [{
						type: 2,
						text: '加分'
					},
					{
						type: 1,
						text: '扣分'
					}
				],
				//整改部分
				problemList: [

				],
				loading: false,
				status: true,
				score: null,
				detail_id: null,
				lock: true,
				data: {},
				action1: '',
				oldquestion: '',
				oldlostscore: '',
				ruserid:''
			}
		},
		onLoad(options) {
			if (options.obj) {
				var data = JSON.parse(options.obj)
				this.headTitle = data.ritem + "评分项"
				this.ruserid = data.ruserid;
				var oldquestion = 0;
				var oldlostscore = 0;
				data.rowdata.forEach(item => {
					if (item.score_type == 0) {
						item.problemtype = "加分"
						item.natureflag = false;
					} else if (item.score_type == 1) {
						item.problemtype = "扣分"
						item.natureflag = true;
						if (Number(item.score) > 0) {
							oldquestion = oldquestion + 1;
						}
						
						
						oldlostscore = helper.accAdd(oldlostscore,item.score)
						// oldlostscore = Number(oldlostscore) + Number(item.score)


					}
					if (item.status == 0) {
						item.problemnature = "一般"
					} else if (item.status == 1) {
						item.problemnature = "严重"
					}

					item.number = item.score;

					var list = item.problempicture.split(",").filter(it => it != "");
					item.fileList = [];

					list.forEach(ilist => {
						var img = {
							url: ilist,
							progress: 0,
							image: ilist,
							title: ilist.split("/")[2].split(".")[0],
							name: ilist.split("/")[2].split(".")[0],
							url: ilist,
							type: 1,
							id: ilist.split("/")[2].split(".")[0],
							error: false
						}

						item.fileList.push(img)
					})
					if (item.fileList.length > 0) {
						item.showPic1 = true;
					} else {
						item.showPic1 = false;
					}


					var list1 = item.correctpicture.split(",").filter(it => it != "");
					item.fileList1 = [];

					list1.forEach(ilist => {
						var img = {
							url: ilist,
							progress: 0,
							image: ilist,
							title: ilist.split("/")[2].split(".")[0],
							name: ilist.split("/")[2].split(".")[0],
							url: ilist,
							type: 1,
							id: ilist.split("/")[2].split(".")[0],
							error: false
						}

						item.fileList1.push(img)
					})
					if (item.fileList1.length > 0) {
						item.showPic11 = true;
					} else {
						item.showPic11 = false;
					}
				})
				this.oldquestion = oldquestion;
				this.oldlostscore = oldlostscore;
				this.data = data;
			}
		},
		onShow() {
			this.lock = true;
		},
		created() {
			let _this = this;
			_this.uid = uni.getStorageSync("USER_ID")
			this.loading = true;
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500)
		},
		methods: {
			// 检查备注
			replaceInput(index) {
				 // let patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g; 
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.data.rowdata[index].remark;
					if(patrn.test(value)){
						this.$refs.uToast.show({
							title: '请勿输入特殊字符',
							type: 'warning'
						})
					}
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.data.rowdata[index].remark = endvalue;
				},50)
			},
			//整改备注
			replaceInput2(index){
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
				setTimeout(()=>{
					let value = this.data.rowdata[index].correctremark;
					if(patrn.test(value)){
						this.$refs.uToast.show({
							title: '请勿输入特殊字符',
							type: 'warning'
						})
					}
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.data.rowdata[index].correctremark = endvalue;
				},50)
			},
			init() {
				if (this.data.type == "2") {
					this.action1 = helper.baseIp + "api/v1/uploadImageReport"
					let problemtips = null
					let problemtype = null
					let problemnature = null
					//数据解析
					let arr = []
					this.data.censorRowIssueList.forEach(item => {
						problemtips = item.remark
						if (parseInt(item.type) == 2) {
							problemtype = "加分"
						} else {
							problemtype = "扣分"
						}
						
						if (parseInt(item.status) == 1) {
							problemnature = "一般"
						} else {
							problemnature = "严重"
						}
						let img1 = []
						let img2 = []
						let img11 = []
						item.censorRowIssueImageList.forEach(val => {
							if (val.type == "1") {
								img11.push({
									id: val.id,
									image: helper.addBaseUrl(val.url),
									name: val.name
								})
							} else {
								img1.push({
									id: val.id,
									url: helper.addBaseUrl(val.url),
									name: val.name
								})
								img2.push({
									id: val.id,
									image: helper.addBaseUrl(val.url),
									name: val.name
								})
								this.status = false
							}
						})
						arr.push({
							row: this.data.id,
							id: item.id,
							problem: item.content,
							showPic: true,
							list1: img11,
							list2: img2,
							fileList: img1,
							number: item.score,
							problemtips: problemtips,
							problemnature: problemnature,
							problemtype: problemtype,
							rectifytips: item.rectify_remark,
							rectify: item.rectify_measures
						})
					})
					this.problemList = arr
					this.problemList.sort((a, b) => {
						return a.problem.trim().substring(0, 1) - b.problem.trim().substring(0, 1)
					})
					this.problemList.forEach(item => {
						if (item.list1.length != 0) {
							item.flag = true
						} else {
							item.flag = false
						}
					})
				} else {
					//记录现在的分数
					let score = 0
					let issueNum = 0
					this.action = helper.baseIp + "api/v1/uploadImage"
					if (this.data.censorRowIssueList.length != 0) {
						this.status = false;
						//数据组装
						let objArr = []
						this.data.censorRowIssueList.forEach((val) => {
							objArr.push(val.content)
						})
						this.data.scoreList.forEach((item) => {
							if (!this.ontains(objArr, item.scorename)) {
								this.data.censorRowIssueList.push({
									"content": item.scorename,
									"censorRowIssueImageList": []
								})
							}
						})
						//数据解析
						let arr = []
						this.data.censorRowIssueList.forEach(item => {
							if (item.censorRowIssueImageList.length != 0) {
								let problemtips = null
								let problemtype = null
								let problemnature = null
								problemtips = item.remark
								if (parseInt(item.type) == 2) {
									problemtype = "加分"
								} else {
									problemtype = "扣分"
								}
								if (parseInt(item.status) == 1) {
									problemnature = "一般"
								} else {
									problemnature = "严重"
								}
								let img1 = []
								let img2 = []
								item.censorRowIssueImageList.forEach(val => {
									img1.push({
										id: val.id,
										url: helper.addBaseUrl(val.url),
										name: val.name
									})
									img2.push({
										id: val.id,
										image: helper.addBaseUrl(val.url),
										name: val.name
									})
								})
								arr.push({
									id: item.id,
									problem: item.content,
									showPic1: true,
									list1: img2,
									fileList1: img1,
									number: item.score,
									problemtips: problemtips,
									problemnature: problemnature,
									problemtype: problemtype
								})
							} else {
								arr.push({
									problem: item.content,
									showPic1: true,
									list1: [],
									fileList1: [],
									number: 0,
									problemtips: '',
									problemnature: '',
									problemtype: ''
								})
							}
						})
						arr.sort((a, b) => {
							return a.problem.trim().substring(0, 1) - b.problem.trim().substring(0, 1)
						})
						this.tableList = arr
						this.data.censorRowIssueList.map(item => {

							if (item.type == 1) {
								if (item.score < 0) {
									score -= parseInt(item.score)
								} else {
									score -= Math.abs(parseInt(item.score))
								}
								issueNum += 1;
							}
							if (item.type == 2) {
								score += parseInt(item.score)
							}
						})
					} else {
						this.data.scoreList.forEach(key => {
							this.tableList.push({
								problem: key.scorename,
								showPic1: true,
								list1: [],
								fileList1: [],
								number: 0,
								problemtips: '',
								problemnature: '',
								problemtype: ''
							})
						})
						this.tableList.forEach(item => {
							item.flag = false
						})
					}
				}
			},
			managePic1(index) {
				this.index = index,
					this.data.rowdata[index].showPic1 = false;
			},
			managePic11(index) {
				this.index = index,
					this.data.rowdata[index].showPic11 = false;
			},
			finishPic1(index) {
				this.data.rowdata[index].showPic1 = true;
			},
			finishPic11(index) {
				this.data.rowdata[index].showPic11 = true;
			},
			//移除图片
			onRemove(index, lists, object) {
				this.data.rowdata.forEach(item => {
					this.removeArray(item.fileList, object)
				})
			},
			onRemove11(index, lists, object) {
				this.data.rowdata.forEach(item => {
					this.removeArray(item.fileList1, object)
				})
			},


			onRemove1(index, lists) {
				let obj = this.problemList[this.index].fileList[index]
				let data = {
					id: obj.id,
					uid: this.uid
				}
				helper.request(helper.websiteUrl + 'v1/deleteImage', data, 'POST', true, res => {
					this.problemList[this.index].fileList = this.removeArray(this.problemList[this.index].fileList, this.problemList[
						this.index].fileList[index])
					this.problemList[this.index].list2 = this.removeArray(this.problemList[this.index].list2, this.problemList[this.index]
						.list2[index])
				})
			},
			//删除元素
			removeArray(_arr, _obj) {
				var length = _arr.length;
				for (var i = 0; i < length; i++) {
					if (_arr[i].url == _obj.url) {
						_arr.splice(i, 1); //删除下标为i的元素
						return _arr;
					}
				}
			},
			//预览图片
			previewImage(fileList) {
				let list = [];
				fileList.map(i => {
					list.push(i.image)
				})
				let current = list[0];
				uni.previewImage({
					current: current, // 当前显示图片的http链接
					urls: list // 需要预览的图片http链接列表
				})
			},
			chooseNature(index) {
				this.show = true;
				this.clickindex = index;
			},
			natureSheetCallback(index) {
				this.data.rowdata[this.clickindex].problemnature = this.natureList[index].text;
			},
			natureSheetClose() {
				this.data.rowdata[this.clickindex].problemnature = '';
			},
			chooseType(index) {
				this.showtype = true;
				this.clicktypeindex = index;
			},
			typeSheetCallback(index) {
				this.data.rowdata[this.clicktypeindex].problemtype = this.typeList[index].text;
				if (this.typeList[index].text == '扣分') {
					this.data.rowdata[this.clicktypeindex].natureflag = true
				} else {
					this.data.rowdata[this.clicktypeindex].natureflag = false
				}
			},
			typeSheetClose() {
				this.data.rowdata[this.clicktypeindex].problemtype = '';
				this.data.rowdata[this.clicktypeindex].natureflag = false
			},
			//评分加减
			// 减少数量
			sub(index) {
				if (this.data.rowdata[index].number >= 1) {
					this.data.rowdata[index].number--;
				}else{
					this.data.rowdata[index].number=0;
				}
			},

			// 增加数量
			add(index) {
				this.data.rowdata[index].number++;
			},

			numberChange(event, index) {
				
				setTimeout(()=>{
					let value = event.detail.value;
					let patrn;
					let endvalue='';
					if(value.length==1){
						 patrn =/[^\d]/g;
						 endvalue=value.replace(patrn,'')
					}else{
						endvalue=this.ChangeNumValue(value)	
					}
					this.data.rowdata[index].number =endvalue;
				},50)
				
			},				
			ChangeNumValue(tmpVal) {		
				if (tmpVal) {
					let s=tmpVal.substring(0,1);
					let t=tmpVal.substring(1,2);
					if(s==0&&t!='.'){
						 return t;
					}
					var tmpVal = tmpVal.replace(/[^\d\.]/g, '');
					var reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/; //正则验证保留 最多允许后输入两位小数
					if (!reg.test(tmpVal)) {
						tmpVal = tmpVal + "";
						tmpVal = tmpVal.substring(0, tmpVal.indexOf(".") + 3);
						var n = (tmpVal.split('.')).length - 1;
						if (n > 1) {
							tmpVal = tmpVal.substring(0, tmpVal.indexOf("."));
						}
					}
					return tmpVal;
				} else {
					return "";
				}
			},
			
			blur(event, index) {
				if (event.detail.value == '') {
					this.data.rowdata[index].number = 0;
				}
			},
			//整改部分
			//选择时间
			opentime(index) {
				this.showtime = true;
				this.timeIndex = index;
			},
			changetime(e) {
				this.problemList[this.timeIndex].time = e.result
			},
			//整改管理图片
			managePic(index, list) {
				this.index = index,
					this.problemList[index].showPic = false;
			},
			//整改管理完成
			finishPic(index, fileList) {
				this.problemList[index].showPic = true;
			},
			cancel() {
				uni.removeStorageSync("backTaskDetail");
				uni.navigateBack({
					delta: 1
				})
			},
			//查询问题的列表数据
			queryTaskIssueList(id) {
				let data = {
					id: id
				}
				helper.request(helper.websiteUrl + 'v1/queryTaskIssueList', data, 'POST', true, res => {})
			},
			success(data) {
				this.data.rowdata[this.index].list.push({
					title: data.title,
					name: data.title,
					image: data.image,
					url: data.image,
					type: 1,
					id: data.title
				})
				this.data.rowdata[this.index].fileList.push({
					name: data.title,
					url: data.image,
					type: 1,
					id: data.title
				})
				this.$refs.uUpload.forEach(item => {
					item.lists.forEach((val, index) => {
						if (val.response != undefined) {
							item.lists.splice(index, 1)
						}
					})
				})
			},
			success1(data) {
				let url = helper.addBaseUrl(data.data.url);
				this.problemList[this.index].list2.push({
					title: data.data.name,
					name: data.data.name,
					image: helper.addBaseUrl(url),
					url: url,
					type: 2,
					id: data.data.id
				})
				this.problemList[this.index].fileList.push({
					name: data.data.name,
					url: url,
					type: 2,
					id: data.data.id
				})
				this.$refs.uUpload.forEach(item => {
					item.lists.forEach((val, index) => {
						if (val.response != undefined) {
							item.lists.splice(index, 1)
						}
					})
				})
			},
			save() {
				if(this.lock){
					this.lock=false
					uni.showLoading({
						title: '保存中...'
					})
					//问题校验
					var isproblem = 0;
					var ascroe = 0;
					var newquestion = 0;
					var newlostscore = 0;
					this.data.rowdata.forEach(val => {
						var problempicture = "";
						for (var value of val.fileList) {
							problempicture = problempicture + value.url + ",";
						}
						
						var correctpicture = "";
						for (var value of val.fileList1) {
							correctpicture = correctpicture + value.url + ",";
						}

						problempicture = problempicture.substring(0, problempicture.length - 1);
						correctpicture = correctpicture.substring(0, correctpicture.length - 1);
						val.problempicture = problempicture;
						val.correctpicture = correctpicture;
						if (val.problemtype == '加分') {
							val.score_type = 0;
							ascroe = helper.accAdd(ascroe,val.number)
							// ascroe = Number(ascroe) + Number(val.number);
						} else if (val.problemtype == '扣分') {
							
							
							ascroe = helper.accSub(ascroe,val.number)
							// ascroe = Number(ascroe) - Number(val.number);
							newlostscore = helper.accAdd(newlostscore,val.number)
							// newlostscore = Number(newlostscore) + Number(val.number);
							if (val.number > 0) {
								val.score_type = 1;
								newquestion = newquestion + 1;
							}

						}
						if (val.problemnature == '一般') {
							val.status = 0;
						} else if (val.problemnature == '严重') {
							val.status = 1;
						}
						val.score = val.number;
						if (val.score_type == 1 && val.number > 0) {
							isproblem = 1;
						}
						
						executeSQL("local", "update tb_task_detail_checkrow set score_type = " + "'" + val.score_type + "'" +
							",score = " + "'" + val.score + "'" + ",status = " + "'" + val.status + "'" + ",problempicture = " + "'" +
							val.problempicture + "'" + ",remark = " + "'" + val.remark + "'" + ",correctpicture = " + "'" +
							val.correctpicture + "'" + ",correctremark = " + "'" + val.correctremark + "'" + ",direty='1',updatetime='" + new Date().getTime() +
							"' where tasknormdetailid = " + "'" + val.tasknormdetailid + "'" + " and norm_row_id = " + "'" + val.norm_row_id +
							"'", res => {})
							
					})
					// var totle = Number(this.data.rtotal_score) + Number(ascroe);
					var	totle = helper.accAdd(this.data.rtotal_score,ascroe)
					
					
					let selectnorm =
						'select tasknormid,task_id,taskdetail_id,norm_id,norm_detail_id,totlecheck,status,question,losescroe,score,hascheck,user_id from tb_task_detail_norm where tasknormid = ' +
						"'" + this.data.tasknormid + "'";
					selectSQL('local', selectnorm, res => {
						
						let selectnormdetail =
							'select tasknormdetailid,status from tb_task_detail_norm_detail where tasknormdetailid = ' +
							"'" + this.data.tasknormdetailid + "'";
						selectSQL('local', selectnormdetail, res1 => {
							executeSQL("local", "update tb_task_detail_norm_detail set score = " + "'" + totle + "'" + ",isproblem = " +
								"'" +
								isproblem + "'" + ",status = " + "'" + 1 + "'" + ",direty='1',updatetime='" + new Date().getTime() +
								"' where tasknormdetailid = " + "'" + this.data.tasknormdetailid + "'", res5 => {})
								
								
							if (res1[0].status == 0) {
								res[0].hascheck = Number(res[0].hascheck) + 1;
								
								// res[0].hascheck = helper.accAdd(res[0].hascheck,1)
								
								
							}
							if (Number(res[0].hascheck) == 0) {
								res[0].status = 0
							} else if (Number(res[0].hascheck) > 0 && Number(res[0].hascheck) < Number(res[0].totlecheck)) {
								res[0].status = 1
							} else if (Number(res[0].hascheck) == Number(res[0].totlecheck)) {
								res[0].status = 2
							}
							

							res[0].question = Number(res[0].question) - Number(this.oldquestion) + Number(newquestion);
							
							// res[0].question = helper.accSub(res[0].question,this.oldquestion)
							// res[0].question = helper.accAdd(res[0].question,newquestion)
							
							
							// res[0].losescroe = Number(res[0].losescroe) - Number(this.oldlostscore) + Number(newlostscore);
							res[0].losescroe = helper.accSub(res[0].losescroe,this.oldlostscore);
							res[0].losescroe = helper.accAdd(res[0].losescroe,newlostscore)
							
							
							// res[0].score = Number(res[0].score) - Number(this.data.score) + Number(totle);
							
							res[0].score = helper.accSub(res[0].score,this.data.score);
							res[0].score = helper.accAdd(res[0].score,totle)
							
							
							let selecttaskdetail =
								'select taskdetail_id,task_id,totlequestion,totlecheck,hascheck,created_time,group_id,user_id,status,type,toperson from tb_task_detail where taskdetail_id = ' +
								"'" + res[0].taskdetail_id + "'";
							selectSQL('local', selecttaskdetail, restaskdetail => {
								
								
								
								restaskdetail[0].totlequestion = Number(restaskdetail[0].totlequestion) - Number(this.oldquestion) + Number(newquestion);
								
								// restaskdetail[0].totlequestion = helper.accSub(restaskdetail[0].totlequestion,this.oldquestion);
								// restaskdetail[0].totlequestion = helper.accAdd(restaskdetail[0].totlequestion,newquestion)
								
								if (res1[0].status == 0) {
									restaskdetail[0].hascheck = Number(restaskdetail[0].hascheck) + 1
									// restaskdetail[0].hascheck = helper.accAdd(restaskdetail[0].hascheck,1)
									
									
								}
								executeSQL("local", "update tb_task_detail_norm set status = " + "'" + res[0].status + "'" +
									",question = " + "'" + res[0].question + "'" + ",losescroe = " + "'" + res[0].losescroe + "'" +
									",score = " + "'" +
									res[0].score + "'" + ",hascheck = " + "'" + res[0].hascheck + "'" + ",direty='1',updatetime='" + new Date()
									.getTime() +
									"' where tasknormid = " + "'" + res[0].tasknormid + "'", resex1 => {})

								executeSQL("local", "update tb_task_detail set totlequestion = " + "'" + restaskdetail[0].totlequestion +
									"'" +
									",hascheck = " + "'" + restaskdetail[0].hascheck + "'" + ",direty='1',updatetime='" + new Date().getTime() +
									"' where taskdetail_id = " + "'" + restaskdetail[0].taskdetail_id + "'", resex2 => {})
									
								
								if (uni.getStorageSync("USER_ID") == this.ruserid) {
									let selecttask =
										'select task_id,task_name,totolequestion,hascheck from tb_task where task_id = ' +
										"'" + restaskdetail[0].task_id + "'";
									selectSQL('local', selecttask, restask1 => {
										restask1[0].totolequestion = Number(restask1[0].totolequestion) - Number(this.oldquestion) + Number(newquestion);
										
										// restask1[0].totolequestion = helper.accSub(restask1[0].totolequestion,this.oldquestion);
										// restask1[0].totolequestion = helper.accAdd(restask1[0].totolequestion,newquestion)
										
										
										if (res1[0].status == 0) {
											restask1[0].hascheck = Number(restask1[0].hascheck) + 1
											 // restask1[0].hascheck = helper.accAdd(restask1[0].hascheck,1)
										}
										executeSQL("local", "update tb_task set totolequestion = " + "'" + restask1[0].totolequestion +
											"'" +
											",hascheck = " + "'" + restask1[0].hascheck + "'" + ",direty='1',updatetime='" + new Date().getTime() +
											"' where task_id = " + "'" + restask1[0].task_id + "'", res9 => {})

									})
								}
							})
						})
					})

					setTimeout(() => {
						uni.setStorageSync("backTaskDetail", this.data.tasknormid)
						uni.hideLoading();
						uni.navigateBack({
							delta: 1
						})
						this.lock=true
					}, 500)
					

				}

			},
			//判断元素是否存在
			ontains(arr, obj) {
				var i = arr.length;
				while (i--) {
					if (arr[i] === obj) {
						return true;
					}
				}
				return false;
			},
			getIndex(index) {
				this.currentIndex = index
			},
			//本地数据组装
			assembly(arr) {
				let data = this.tableList;
				let list = []
				data.forEach(item => {
					if (item.list1.length != 0) {
						let type = 1
						if (item.problemtype == '加分') {
							type = 2
						}
						let status = 1
						if (item.problemnature == '严重') {
							status = 2
						}
						let arr = []
						item.list1.forEach(val => {
							arr.push({
								id: val.id,
								url: val.image.substring(val.image.indexOf("static"), val.image.length),
								type: null,
								name: val.name
							})
						})
						list.push({
							"id": item.id,
							"task_issue_id": null,
							"content": item.problem,
							"type": type,
							"score": item.number,
							"status": status,
							"remark": item.problemtips,
							"row_id": this.data.id,
							"name": null,
							"serial": null,
							"rectify_remark": null,
							"rectify_measures": null,
							"rectify_time": null,
							"censorRowIssueImageList": arr
						})
					}
				})
				let param = {
					index: this.data.index,
					index1: this.data.index1,
					data: list
				}
				uni.removeStorageSync('userModeulToScore')
				uni.setStorageSync("userModeulToScore", param)
			},
			//整改数据本地上传
			assembly2(arr) {
				let data = this.problemList;
				let list = []
				data.forEach(item => {
					if (item.list1.length != 0) {
						let type = 1
						if (item.problemtype == '加分') {
							type = 2
						}
						let status = 1
						if (item.problemnature == '严重') {
							status = 2
						}
						let arr = []
						item.list1.forEach(val => {
							arr.push({
								id: val.id,
								url: val.image.substring(val.image.indexOf("static"), val.image.length),
								type: 1,
								name: val.name
							})
						})
						item.list2.forEach(val => {
							arr.push({
								id: val.id,
								url: val.image.substring(val.image.indexOf("static"), val.image.length),
								type: 2,
								name: val.name
							})
						})
						list.push({
							"id": item.id,
							"task_issue_id": null,
							"content": item.problem,
							"type": type,
							"score": item.number,
							"status": status,
							"remark": item.problemtips,
							"row_id": this.data.id,
							"name": null,
							"serial": null,
							"rectify_remark": item.rectify,
							"rectify_measures": this.rectifytips,
							"rectify_time": null,
							"censorRowIssueImageList": arr
						})
					}
				})
				let param = {
					index: this.data.index,
					index1: this.data.index1,
					data: list
				}
				uni.removeStorageSync('userModeulToScore')
				uni.setStorageSync("userModeulToScore", param)
			},

			uploadImg(res) {
				this.data.rowdata[this.currentIndex].fileList.push(res);
			},
			uploadImg1(res) {
				this.data.rowdata[this.currentIndex].fileList1.push(res);
			}

		}

	}
</script>

<style lang="less" scoped>
	.scorll-content {
		padding-bottom: 120rpx;

		.scroll-view_H {
			.top {
				display: inline-flex;
				min-width: 100%;
			}

			.tableheight {
				height: auto;
				background: #FFFFFF;
				position: relative;
				display: inline-flex;
				min-width: 100%;

			}
			.empty-tips {
				color: #e6e6e6;
				padding: 20rpx 0;
				font-size: 28rpx;
			}

			.scorll-th {
				width: 200rpx;

				.srorll-title {
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					font-size: 28rpx;
					border: 1px solid #f6f6f6;
					background: #6ecac3;
					color: #ffffff;
				}

				.scorll-td {
					border: 1px solid #f6f6f6;
					font-size: 28rpx;
					color: #606266;
					text-align: center;
					background: #FFFFFF;
					padding: 0 10rpx;
					height: 100%;
					height: calc(100% - 2px);
					overflow: hidden;

					.content {

						line-height: 40rpx;
						height: 100%;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.input {
							padding: 0 20rpx;

							.gray {
								background: #f6f6f6;
							}
						}

						.number {
							display: flex;
							justify-content: center;
							align-items: flex-end;

							.input {
								width: 70rpx;
								height: 70rpx;
								margin: 0 10rpx;
								padding: 0;
								// background-color: #f3f3f3;
								border: 2rpx solid #dcdfe6;

								input {
									width: 70rpx;
									height: 70rpx;
									display: flex;
									justify-content: center;
									align-items: center;
									text-align: center;
									font-size: 26rpx;
								}
							}

							.sub,
							.add {
								width: 70rpx;
								height: 70rpx;
								line-height: 70rpx;
								// background-color: #f3f3f3;
								border: 2rpx solid #dcdfe6;
								border-radius: 5rpx;
								text-align: center;
							}
						}

						.tips {
							margin-top: 10rpx;
							font-size: 24rpx;
							color: #ffffff;
							background: #6ecac3;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							padding: 0 10rpx;
						}
					}
				}
			}

			.detail {
				width: 15%;
				min-width: 250rpx;


			}

			.detailscore {
				width: 20%;
				min-width: 300rpx;


				/deep/.u-list-item {
					background: none;
					border: 2rpx solid #dcdfe6;
				}

				.imgpart {
					padding: 10rpx 0;

					/deep/uni-swiper {
						height: 200rpx !important;
					}
				}

			}


			.pic {
				width: 20%;
				min-width: 400rpx;


				/deep/.u-list-item {
					background: none;
					border: 2rpx solid #dcdfe6;
				}

				.imgpart {
					padding: 10rpx 0;

					/deep/uni-swiper {
						height: 200rpx !important;
					}
				}
			}
		}
	}

	.action {
		position: fixed;
		width: 100%;
		background: #ffffff;
		bottom: 0;
		z-index: 99;

		.bottom {
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #ffffff;

			.cancel {
				width: 40%;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 40rpx;
				border: 2rpx solid #dedede;
				color: #606266;
			}

			.save {
				width: 40%;
				height: 80rpx;
				line-height: 80rpx;
				background: #1fac9c;
				border-radius: 40rpx;
			}
		}
	}
</style>
