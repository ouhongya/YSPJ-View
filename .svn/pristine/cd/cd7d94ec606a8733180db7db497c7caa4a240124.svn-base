<template>
	<view class="standardChange">
		<a-head bgColor='#4abdb4' text="任务标准"></a-head>
		<view class="standard">
			<view class="title" v-if="typeflag">
				<view class="left">
					<!-- 选择标准 -->
				</view>
				<view class="right">
					<view class="action" v-show="isupdate">
						<u-icon name="arrow-downward" color="#FFFFFF" size="28"></u-icon>
						<l-file ref="lFile" @up-success="onSuccess"></l-file>
						<view class="txt" @click="onUpload()">
							导入标准
						</view>
					</view>
					<view class="action" v-if="isupdate&&collapseList.length>0&&bacthlen">
						<u-icon name="pushpin" color="#FFFFFF" size="28"></u-icon>
						<view class="txt" @click="batch()">
							<text>批量管理</text>
						</view>
					</view>
				</view>
			</view>
			<view class="content" :class="isupdate?'partH':'normal'">
				<!-- 折叠面板 -->
				<scroll-view class="collapsePart" v-if="collapseList.length>0" scroll-y="true">
					<uni-swipe-action>
						<uni-swipe-action-item class="swipe" v-for="(item,index) in collapseList" :right-options="item.options" :key="index"
						 @change="open($event, index)" @click="click($event, index)" :disabled="!isupdate">
							<view class="u-collapse-item" v-if="item.editFlag">
								<view :hover-stay-time="200" class="u-collapse-head">
									<block>
										<view class="check" v-if="item.flag&&typeflag&&showdel&&isupdate">
											<checkbox :checked="item.checked" @click="check(index)" color="#4abdb4" />
										</view>
										<view class="u-icon-wrap" @tap="headClick(index,item)">
											<u-icon v-if="arrow" :class="{ 'u-arrow-down-icon-active': item.isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon>
										</view>
										<view class="u-collapse-title u-line-1" @tap="headClick(index,item)">
											{{item.name}}
										</view>
										<view class="action" v-if="isupdate">
											<u-input v-model="item.person" type="select" :border="true" @click="openPerson(index)" height="70"
											 placeholder="指派给" />
										</view>
										<view class="action" v-else>
											<u-input v-model="item.person" type="text" :border="true" :disabled="true" height="70" class="gray"
											 placeholder="指派给" />
										</view>
									</block>
								</view>
								<view class="u-collapse-body" v-if="item.isShow">
									<view class="u-collapse-content">
										<view v-for="(i,index1) in item.detailList">
											<view class="childPart" >
												<view class="left" @click="headClick2(index,index1)">
													<u-icon :class="{ 'u-arrow-down-icon-active': i.isShow }" class="u-arrow-down-icon" name="arrow-down" ></u-icon>
													{{i.name}}
												</view>

												<view class="action" v-if="isupdate">
													<u-input v-model="i.person" type="select" :border="true" @click="openchildPerson(index,index1)" height="70"
													 placeholder="指派给" />
												</view>
												<view class="action" v-else>
													<u-input v-model="i.person" type="text" :border="true" height="70" placeholder="指派给" disabled="disabled"
													 class="gray" />
												</view>
											</view>
											<view class="child" v-if="(i.child&&i.isShow) ">
												<view class="childPart" v-for="(j,index2) in i.child">
													<view class="left">
														{{j.item}}
													</view>
													<view class="action" v-if="isupdate">
														<u-input v-model="j.person" type="select" :border="true" @click="openchild2Person(index,index1,index2)"
														 height="70" placeholder="指派给" />
													</view>
													<view class="action" v-else>
														<u-input v-model="j.person" type="text" :border="true" height="70" placeholder="指派给" disabled="disabled"
														 class="gray" />
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</scroll-view>
				<view class="empty" v-else>
					<a-empty :changing="false"></a-empty>
				</view>
			</view>
			<u-action-sheet :list="personSheetList" v-model="showPersonList" @click="personSheetCallback" @close="personSheetClose"
			 border-radius="20"></u-action-sheet>
			<u-action-sheet :list="personSheetList" v-model="showPersonchildList" @click="personchildSheetCallback" @close="personchildSheetClose"
			 border-radius="20"></u-action-sheet>
			<u-action-sheet :list="personSheetList" v-model="showPersonchild2List" @click="personchild2SheetCallback" @close="personchild2SheetClose"
			 border-radius="20"></u-action-sheet>
			<view class="bottom-action" v-if="collapseList.length>0&&isupdate">
				<view class="bottom" v-if="showdel">
					<view class="cancel" @click="batchCancel()">取消</view>
					<view class="save del" @click="batchDel()">删除</view>
				</view>
				<view class="bottom" v-else>
					<view class="cancel" @click="canceleee">取消</view>
					<view class="save" @click="save">保存</view>
				</view>
			</view>
			<!-- 批量删除 -->
			<u-modal v-model="delAllshow" @confirm="delAllconfirm" :async-close="true" :show-cancel-button="true" :confirm-style="{'color':'#fa3534'}"
			 :show-title="false">
				<view class="slot-content">
					<view class="model">
						<view class="stop">
							您确定要删除已选中的标准吗?
						</view>
					</view>
				</view>
			</u-modal>
			<!-- 删除确认框 -->
			<u-modal v-model="showrightdel" @confirm="rightdelConfirm" content="您确认要删除该标准吗？" :show-title="false"
			 :show-cancel-button="true" :confirm-style="{'color':'#fa3534'}"></u-modal>
		</view>
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import lFile from '@/components/l-file/l-file.vue'
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
				typeflag: true, //true:可编辑状态；false:不可编辑状态
				selfLen: 0,
				collapseList: [],
				checkLength: 0,
				personSheetList: [],
				openindex: '',
				openchildindex: '',
				openchild2index: '',
				arrow: true, //是否显示箭头
				showPersonList: false,
				showPersonchildList: false,
				showPersonchild2List: false,
				delAllshow: false,
				loading: false,
				isupdate: true,
				showdel: false,
				rightdelIndex: 0,
				showrightdel: false,
				lock:true,
				bacthlen:false
			}
		},

		onLoad(options) {
			let len=0
			this.loading = true;
			if (options.type != 0) {
				this.isupdate = false;
				uni.removeStorageSync("collapseList");
				uni.removeStorageSync("normtext");
				uni.removeStorageSync("usernormrel");
				uni.removeStorageSync("normdetailids");
				uni.removeStorageSync("type");
				let selecttask =
					'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
					"'" + options.type + "'";
				selectSQL('local', selecttask, res => {
					let selecttaskinfo =
						'select task_id,usernormrel,normtext,collapseList,normdetailids,type,flag from tb_task_info where task_id = ' +
						"'" + res[0].utask_id + "'";
					selectSQL('local', selecttaskinfo, res1 => {
						var obj = JSON.parse(res1[0].collapseList.replace("\\", ""));
						obj.map((item, index) => {							
							let url =
								'select name from tb_excel where id = ' + "'" + item.id + "'";
							selectSQL('local', url, resurl => {
								item.name = resurl[0].name;
								let count = 0;
								if(item.person!=''){
									count++
								}
								
								item.detailList.map(i => {
									if (i.person != '') {
										count++
									}
									if (i.child) {
										i.child.map(j => {
											if (j.person != '') {
												count++
											}
										})
									}
								})
								
								if (count > 0) {
									item.editFlag=true
								}else{
									item.editFlag=false
								}
							})	
						})
						this.collapseList = obj
						this.collapseList.map(item=>{
							if(item.flag){
								len++
							}
						})
						if(len>0){
							this.bacthlen=true;
						}else{
							this.bacthlen=false;				
						}
					})

				})
			} else if (options.type == 0) {
				this.isupdate = true;
				var collapseList = uni.getStorageSync("collapseList");
				if (collapseList) {
					this.collapseList = collapseList;
					this.collapseList.map(item=>{
						if(item.flag){
							len++
						}
					})
					if(len>0){
						this.bacthlen=true;
					}else{
						this.bacthlen=false;				
					}
				} else {
					this.init();
				}
				this.getPerson();

			}
		},
		onShow() {
			this.lock=true
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500)
		},
		methods: {
			//打开上传页面
			onUpload() {
				let uid = uni.getStorageSync('USER_ID')
				let functionid = uni.getStorageSync('functionid');
				let company_id = uni.getStorageSync('company_id');
				let _this = this;
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					// nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: _this.$mp.page.$getAppWebview(),
					// #endif
					//非真实地址，记得更换,调试时ios有跨域，需要后端开启跨域并且接口地址不要使用http://localhost/
					url: helper.websiteUrl + 'v1/uploadExcel',
					//默认file,上传文件的key
					name: 'file',
					header: {},
					data: {
						uid: uid,
						functionid: functionid,
						flag: 1,
						company_id: company_id
					}
				});
			},

			//上传成功的回调地址
			onSuccess(res) {
				this.init();
			},
			// 批量管理
			batch() {
				this.showdel=true;		
			},
			batchDel() {
				if (this.checkLength == 0) {
					this.$refs.uToast.show({
						title: '请至少选择一项标准进行删除',
						type: 'warning'
					})
					return;
				}
				this.delAllshow = true
			},
			batchCancel(){
				this.checkLength = 0
				this.collapseList.map(item => {
					item.checked = false
				})
				this.showdel = false;
			},
			open(e, index) {
				this.collapseList[index].show = true;
				this.collapseList.map((val, idx) => {
					if (index != idx) this.collapseList[idx].show = false;
				})
			},
			click(e, index) {
				this.rightdelIndex = index;
				this.showrightdel = true;
			},
			rightdelConfirm() {
				var tim = new Date().getTime();
				let id = this.collapseList[this.rightdelIndex].id;
				let deleteexecel = 'update tb_excel set status = 1' + "," + ' `delete` = 1 ' + "," +
					' updatetime = ' + "'" + tim + "'" + ' where id = ' + "'" + id + "'";
				executeSQL("local", deleteexecel, res => {
					this.collapseList[this.rightdelIndex].show = false;
					this.collapseList.splice(this.rightdelIndex, 1);
					this.showrightdel = false;
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					})
				});
			},
			check(index) {
				let checkLength = 0;
				this.collapseList.map((item, idx) => {
					if (index == idx) {
						item.checked = !item.checked

					}
				})
				this.collapseList.map(item => {
					if (item.checked) {
						checkLength++;
					}
				})
				this.checkLength = checkLength;
			},
			// 点击collapsehead头部
			headClick(index, item) {
				this.collapseList[index].isShow = !this.collapseList[index].isShow;
				this.collapseList.map((e, idx) => {
					if (idx != index) {
						e.isShow = false;
					}
				})
			},

			openPerson(index) {
				this.openindex = index;
				this.showPersonList = true;
			},
			headClick2(index, index1) {
				this.collapseList[index].detailList[index1].isShow = !this.collapseList[index].detailList[index1].isShow;
				this.collapseList[index].detailList.map((e, idx) => {
					if (idx != index1) {
						e.isShow = false;
					}
				})
			},
			openchildPerson(index, index1) {				
				this.openindex = index;
				this.openchildindex = index1;
				this.showPersonchildList = true;
			},
			openchild2Person(index, index1, index2) {
				this.openindex = index;
				this.openchildindex = index1;
				this.openchild2index = index2;
				this.showPersonchild2List = true;
			},
			//第一层的选中效果
			personSheetCallback(index) {
				let name = this.personSheetList[index].text;
				let value = this.personSheetList[index].value;
				let obj = this.collapseList[this.openindex];
				obj.person =name
				obj.personid =value
				obj.detailList.map(item => {
					item.person = name;
					item.personid = value;
					item.child.map(val => {
						val.person = name;
						val.personid = value;
					})
				})
				this.showPersonList = false;
			},
			personSheetClose() {
				let obj = this.collapseList[this.openindex];
				obj.person =''
				obj.personid =''
				obj.detailList.map(item => {
					item.person = "";
					item.personid = "";
					item.child.map(val => {
						val.person = "";
						val.personid = "";
					})
				})
				this.showPersonList = false;
			},

			//第二层的选中效果
			personchildSheetCallback(index) {				
				let name = this.personSheetList[index].text;
				let value = this.personSheetList[index].value;
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].detailList[this.openchildindex]
				obj1.person = name;
				obj1.personid = value;
				obj1.child.map(item => {
					item.person = name;
					item.personid = value;
				})
				let nameArr = []
				obj.detailList.map(item=>{
					if(item.person!=""){
						nameArr.push({
							name:item.person,
							value:item.personid
						})
					}
				})
				let Arr=this.unique(nameArr)
				if (Arr.length == 1&&nameArr.length==obj.detailList.length) {
					obj.person =Arr[0].name
					obj.personid =Arr[0].value
				}else{
					obj.person ='......'
					obj.personid =''
				}
				this.showPersonchildList = false;
			},
			personchildSheetClose() {
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].detailList[this.openchildindex]			
				let nameArr = []
				obj1.person =''
				obj1.personid =''
				obj1.child.map(item => {
					item.person = "";
					item.personid = "";
				})
				obj.detailList.map(item=>{
					if(item.person==""){
						nameArr.push({
							name:item.person,
							value:item.personid
						})
					}
				})
				if (nameArr.length==obj.detailList.length) {
					obj.person ='';
					obj.personid = '';
				}else{
					obj.person ='......';
					obj.personid = '';
				}
				this.showPersonchildList = false;
			},
			//第三层的选中效果
			personchild2SheetCallback(index) {
				let name = this.personSheetList[index].text;
				let value = this.personSheetList[index].value;
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].detailList[this.openchildindex]
				let obj2=this.collapseList[this.openindex].detailList[this.openchildindex].child[this.openchild2index]
				obj2.person = name;
				obj2.personid = value;
				let nameArr = []
				obj1.child.map(item=>{
					if(item.person!=""){
						nameArr.push({
							name:item.person,
							value:item.personid
						})
					}
				})
				let Arr=this.unique(nameArr)
				if (Arr.length == 1&&nameArr.length==obj1.child.length) {
					obj1.person =Arr[0].name
					obj1.personid =Arr[0].value
					if(obj.detailList.length==1){
						obj.person =Arr[0].name
						obj.personid =Arr[0].value
					}else{
						obj.person ='......'
						obj.personid =''
					}
				}else{
					obj1.person ='......'
					obj1.personid =''
					obj.person ='......'
					obj.personid =''
				}
				this.showPersonchild2List = false
			},

			personchild2SheetClose() {
				let obj=this.collapseList[this.openindex]
				let obj1=this.collapseList[this.openindex].detailList[this.openchildindex]
				let obj2=this.collapseList[this.openindex].detailList[this.openchildindex].child[this.openchild2index]
				obj2.person =''
				obj2.personid =''
				let nameArr = []
				obj1.child.map(item=>{
					if(item.person==""){
						nameArr.push({
							name:item.person,
							value:item.personid
						})
					}
				})
				if (nameArr.length==obj1.child.length) {
					obj.person ='';
					obj.personid = '';
					obj1.person =''
					obj1.personid =''
				}else{
					obj.person ='......';
					obj.personid = '';
					obj1.person ='......'
					obj1.personid ='';
				}
				this.showPersonchild2List = false
			},
			//取消
			canceleee() {
				uni.navigateBack({
					delta: 1
				})
			},

			//保存
			save() {
				if(this.lock){
					this.lock=false
				
				let that = this;
				uni.showLoading({
					title: "创建中..."
				});
				var norm = [];
				var usernorm = [];
				var normtext = [];
				var normdetailids = [];
				var type = 1;
				this.collapseList.forEach(item => {
					item.detailList.forEach(val => {
						val.child.forEach(key => {
							if (key.person != null && key.person != '') {
								if (item.flag) {
									type = 3;
								}
								normdetailids.push(key.id);
								var indexs = this.findall(normtext.map(a => a.id), val.norm_id)
								if (indexs.length == 0) {
									normtext.push({
										"id": val.norm_id,
										"name": val.name
									});
								}
								var normcontent = {};
								normcontent.userid = key.personid;
								normcontent.norm_id = key.norm_id;
								normcontent.norm_detailid = key.id;
								norm.push(normcontent)
								if (usernorm.indexOf(key.personid) == -1) {
									usernorm.push(key.personid)
								}

							}
						})
					})
				})

				if (norm.length == 0) {
					helper.showToast("请至少选择一项检查项！")
					this.lock=true
					return;
				}
				var usernormrel = [];
				var usernormdetailrel = [];
				usernorm.forEach(it => {
					var item = {
						"userid": it,
						"norm": []
					};
					var item1 = {
						"userid": it,
						"normdetailid": []
					};
					usernormrel.push(item)
					usernormdetailrel.push(item1)
				})

				usernormrel.forEach(item => {
					norm.forEach(it => {
						if (item.userid == it.userid) {
							var indexs = this.findall(item.norm.map(a => a.norm_id), it.norm_id)
							if (indexs.length == 0) {
								item.norm.push({
									"norm_id": it.norm_id,
									"norm_detailid": [it.norm_detailid]
								})
							} else {
								item.norm[indexs].norm_detailid.push(it.norm_detailid)
							}

						}
					})
				})

				usernormdetailrel.forEach(itemnormdetail => {
					norm.forEach(itemnorm => {
						if (itemnormdetail.userid == itemnorm.userid) {
							itemnormdetail.normdetailid.push(itemnorm.norm_detailid)
						}
					})
				})

				for (var j = 0; j < usernormdetailrel.length; j++) {
					(function(j) {
						var totletaskdetailchecked = 0;
						for (var i = 0; i < usernormdetailrel[j].normdetailid.length; i++) {
							(function(i) {
								let sql1 = 'select COUNT(id) as totalResult from tb_norm_detail where parent_id = ' + "'" + usernormdetailrel[
										j].normdetailid[i] +
									"'";
								selectSQL('local', sql1, res => {
									totletaskdetailchecked = totletaskdetailchecked + res[0].totalResult;
									if (i == usernormdetailrel[j].normdetailid.length - 1) {
										var indexs = that.findall(usernormrel.map(a => a.userid), usernormdetailrel[j].userid);
										usernormrel[indexs].checked = totletaskdetailchecked;
									}
									if (j == usernormdetailrel.length - 1 && i == usernormdetailrel[j].normdetailid.length - 1) {

										uni.setStorageSync("usernormrel", usernormrel);

									}
								})
							})(i);
						}
					})(j);
				}


				var text = "";
				for (var value of normtext) {
					text = text + value.name + ",";
				}
				text = text.substring(0, text.length - 1);
				uni.setStorageSync("normtext", text);
				var collapseListar = this.collapseList;
				collapseListar.map((e, idx) => {
					e.isShow = false;
					e.detailList.map((ed, idxd) => {
						ed.isShow = false;
					})
				})
				uni.setStorageSync("collapseList", collapseListar);
				uni.setStorageSync("normdetailids", normdetailids);
				uni.setStorageSync("type", type);
				this.lock=true;
				uni.hideLoading();
				uni.navigateBack({
					delta: 1
				})
				}
			},

			findall(a, x) {
				var results = [],
					len = a.length,
					pos = 0;
				while (pos < len) {
					pos = a.indexOf(x, pos);
					if (pos === -1) { //未找到就退出循环完成搜索
						break;
					}
					results.push(pos); //找到就存储索引
					pos += 1; //并从下个位置开始搜索
				}
				return results;
			},

			//批量删除
			delAllconfirm() {
				let len=0;
				let arr = [];
				this.collapseList.map((item, index) => {
					if (item.checked) {
						arr.push(item.id);
					}
				})
				var ids = "";
				for (var value of arr) {
					ids = ids + "'" + value + "'" + ",";
				}
				ids = ids.substring(0, ids.length - 1);
				let sql = 'select menu_id,menu_name,menu_url,parent_id,menu_icon from sys_menu where menu_id in (' + ids + ')';
				executeSQL("local", "update tb_excel set status='1','delete'='1',updatetime='" + new Date().getTime() +
					"' where id in (" + ids + ")", res => {
						for (let i = 0; i < this.collapseList.length; i++) {
							//删除不连续多项时
							if (this.collapseList[i].checked) {
								this.collapseList.splice(i, 1)
								i--;
							}
						}
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						this.delAllshow = false
						this.showdel = false
						this.collapseList.map(item=>{
							if(item.flag){
								len++
							}
						})
						if(len>0){
							this.bacthlen=true;
						}else{
							this.bacthlen=false;				
						}
						
					})
			},
			init() {
				let len=0
				let that = this;
				let url =
					'select excel_id from tb_excel_user where status = 0 and user_id = ' + "'" + uni.getStorageSync('USER_ID') + "'" + 'order by updatetime desc';
				selectSQL('local', url, res => {

					let urlsql =
						'select id as excel_id from tb_excel where status = 0 and type = 2 and user_id = ' + "'" + uni.getStorageSync(
							'USER_ID') + "'" + ' order by created_time desc';
					selectSQL('local', urlsql, ressql => {
						res.push(ressql)
						var ids = "";
						for (var value of res) {
							ids = ids + "'" + value.excel_id + "'" + ",";
						}
						
						ids = ids.substring(0, ids.length - 1);
						let sql =
							'select id,url,name,user_id,isCategory,categort_id,status,type,view,totlecheck,size,created_time from tb_excel where status = 0 and id in (' +
							ids + ')' + ' order by created_time desc';
						selectSQL('local', sql, res1 => {
							for (var i = 0; i < res1.length; i++) {
								(function(i) {
									let sqlnorm =
										'select norm_id,excel_id,name,unit,content,total_score,score_time,totlecheck,created_time from tb_norm where excel_id = ' +
										"'" + res1[i].id + "'";
									selectSQL('local', sqlnorm, resnorm => {
										resnorm.forEach(itnorm => {
											itnorm.isShow = false;
											itnorm.person = "";
											itnorm.personid = "";
										})
										res1[i].detailList = resnorm;
										res1[i].isShow = false;
										res1[i].show = false;
										res1[i].checked = false;
										res1[i].person = "";
										res1[i].personid = "";
										res1[i].editFlag = true;
										if (res1[i].type == '2') {
											res1[i].options = [{
												text: '删除',
												style: {
													backgroundColor: '#fa3534'
												}
											}]
											res1[i].flag = true;
											len++;
										} else if (res1[i].type == '1') {
											res1[i].options = []
											res1[i].flag = false;
										}
										if (i == res1.length - 1) {
											for (var j = 0; j < res1.length; j++) {
												(function(j) {
													for (var k = 0; k < res1[j].detailList.length; k++) {
														(function(k) {
															let sqlrow =
																'select id,norm_id,serial,item,untitled,content,total_score,score,mode,standard,totlecheck,created_time from tb_norm_detail where type = 0 and norm_id = ' +
																"'" + res1[j].detailList[k].norm_id + "'" + 'order by serial asc';
															selectSQL('local', sqlrow, resrow => {
																resrow.forEach(itrow => {
																	itrow.person = "";
																	itrow.personid = "";
																})
																res1[j].detailList[k].child = resrow;
																if (j == res1.length - 1 && k == res1[j].detailList.length - 1) {
																	that.collapseList = res1;
																	if(len>0){
																		that.bacthlen=true;
																	}else{
																		that.bacthlen=false;				
																	}
																	return;
																}
															})
														})(k);
													}
												})(j);
											}
										}
									})
								})(i);
							}
						})
					})
				})
				
			},
			getPerson() {
				if (uni.getStorageSync("functionid") == '2') {
					let selectuser =
						'select u.user_id,u.password,u.name,u.role_id,u.status,u.phone,u.company_id,r.role_name,r.function_id from sys_user u left join sys_role r on u.role_id=r.role_id where 1=1 and u.status = 0 and r.function_id = 3 and u.company_id = ' +
						"'" + uni.getStorageSync('company_id') + "'";
					selectSQL('local', selectuser, res => {
						var users = [];
						var us = {
							"text": uni.getStorageSync("NAME"),
							"value": uni.getStorageSync("USER_ID")
						}
						users.push(us);
						res.forEach(item => {
							var user = {
								"text": item.name,
								"value": item.user_id
							}
							users.push(user);
						})
						this.personSheetList = users;
					})
				} else if (uni.getStorageSync("functionid") == '3') {
					var users = [];
					var us = {
						"text": uni.getStorageSync("NAME"),
						"value": uni.getStorageSync("USER_ID")
					}
					users.push(us);
					this.personSheetList = users;
				}
			},
			//数组去重操作
			unique(arr) {
				// return Array.from(new Set(arr))
				let obj = {};				
				let peon = arr.reduce((cur,next) => {
				    obj[next.value] ? "" : obj[next.value] = true && cur.push(next);
				    return cur;
				},[]) 
				return peon
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/.uni-checkbox-input:hover {
		border-color: #4abdb4 !important;
	}

	.standardChange {
		.model {
			padding: 30rpx;

			.stop {
				font-size: #333333;
				line-height: 50rpx;
				font-size: 32rpx;
				margin: 20rpx 0;
			}
		}

		.standard {

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10rpx 10rpx 10rpx 30rpx;
				background: #4abdb4;

				.left {
					color: #FFFFFF;
					font-size: 32rpx;
				}

				.right {
					display: flex;
					justify-content: flex-end;

					.action {
						margin: 0 10rpx;
						width: 180rpx;
						border-radius: 10rpx;
						border: 2rpx solid #FFFFFF;
						line-height: 50rpx;
						height: 50rpx;
						display: flex;
						justify-content: center;


						.txt {
							color: #FFFFFF;
							margin-left: 10rpx;
							font-size: 28rpx;
						}
					}
				}

			}
		}

		.partH {
			height: 70vh;
			height: calc(100vh - 360rpx);
		}

		.normal {
			height: 80vh;			
			height: calc(100vh - 200rpx);
		}

		.content {
			width: 100%;
			overflow-x: hidden;

			.collapsePart {
				background: #FFFFFF;
				height: 100%;

				.u-collapse-item {
					width: 100%;
				}

				.u-collapse-head {
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #333333;
					font-size: 28rpx;
					line-height: 1;
					padding: 10rpx 20rpx 10rpx 6rpx;
					text-align: left;
					border-bottom: 2rpx solid #f6f6f6;

					.check {
						width: 30px;
						padding-left: 10rpx;
					}

					.action {
						display: flex;
						justify-content: space-between;
						margin-left: 20rpx;
						width: 50%;

						.gray {
							background: #f6f6f6;
						}

						.right {
							font-size: 26rpx;
							color: #2979ff;
							margin: 4rpx;
						}

						.red {
							color: #fa3534;
						}
					}
				}

				.u-collapse-title {
					flex: 1;
					width: 100%;
					line-height: 60rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.u-arrow-down-icon {
					transition: all 0.3s;
					margin-right: 20rpx;
					margin-left: 14rpx;

				}

				.u-arrow-down-icon-active {
					transform: rotate(180deg);
					transform-origin: center center;

				}

				.u-collapse-body {
					overflow: scroll;
					transition: all 0.3s;

				}

				.u-collapse-content {
					overflow: hidden;
					font-size: 26rpx;
					color: #666;
					text-align: left;
					padding: 10rpx 20rpx 10rpx 6rpx;

					.childPart {
						border-bottom: 2rpx solid #f6f6f6;
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 10rpx 0;

						.left {
							flex: 1;
							width: 100%;
							line-height: 50rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							padding-left: 60rpx;
						}

						.action {
							display: flex;
							justify-content: space-between;
							width: 40%;
							margin-left: 20rpx;

							.gray {
								background: #f6f6f6;
							}

							.right {
								font-size: 24rpx;
								color: #2979ff;
								margin: 4rpx;
							}

							.red {
								color: #fa3534;
							}
						}
					}
				}

			}
		}

		.bottom-action {
			position: fixed;
			width: 100%;
			background: #FFFFFF;
			bottom: 0;
			z-index: 99;

			.bottom {
				display: flex;
				justify-content: space-around;
				align-items: center;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				color: #FFFFFF;

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
				.del{
					background: #fa3534;
				}
			}

		}
	}
</style>
