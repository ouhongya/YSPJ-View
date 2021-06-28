<template>
	<view class="standard">
		<u-sticky :offset-top="offset">
			<view class="standard-top">
				<l-file ref="lFile" @up-success="onSuccess"></l-file>
				<view class="action" @click="onUpload()">新增标准</view>
				<view class="action" @click="upload()">模板下载</view>
				<view class="action" @click="batch()" v-show="list.length > 0">{{ batchtitle }}</view>
				<view class="action gray" v-show="list.length == 0">批量管理</view>
			</view>
			<view class="subpart">
				<view class="subtop">
					<view class="subnew" v-if="typeValuelist&&typeValuelist.length">
						<!-- 标准分类 -->
						<u-input v-model="typeSearchValue" type="select" :border="true" @click="typeSearch()" height="64" placeholder="选择分类"
						 border-color="#4abdb4" placeholderStyle="color:#909399;fontSize:26rpx"/>
					</view>
					<view class="subsearch">
						<u-search placeholder="请输入标准名称" v-model="standardName" shape="square" :action-style="actionStyle" border-color="#4abdb4"
						 bg-color="#ffffff" @search="searchStandard()" @custom="searchStandard()" @clear="clear()" @change="searchInput"></u-search>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="wrap" :style="{height: subHeight-subH+'px'}" >	
		<mescroll-uni  @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scrollfun"
		 :fixed="false">
			<view class="standard-content">
				<view class="part" v-for="(item, index) in list" :key="index">
					<view class="top-part">
						<view class="left">
							<view class="check" v-if="showCheck&&item.flag&&item.status==0&&item.view==1">
								<checkbox :checked="item.checked" @click="check(index)" color="#4abdb4"/>
								<!-- <u-checkbox @change="check(index)" v-model="item.checked"  active-color="#4abdb4"></u-checkbox> -->
							</view>
							<image src="../../static/excel.png" mode=""></image>
						</view>
						<view class="right">
							<view class="name">{{ item.name }}</view>
							<view class="detail">
								<view class="size">{{ item.size }}项</view>
								<view class="time">{{ $u.timeFormat(item.created_time, 'yyyy-mm-dd hh:MM:ss') }}</view>
							</view>
						</view>
					</view>
					<!-- 自己的 -->
					<view class="action">
						<view class="actiontype">
							{{item.categoryName}}
						</view>
						<view class="action-part" v-if="item.isFlag">
							<view v-if="functionid==1" class="action-part">
								<view v-if="item.view == 1">
									<view class="allot" v-if="item.status == 0" @click="allot('single', item.id, false)">未下发</view>
									<view class="allot gray" v-else>未下发</view>
								</view>
								<view v-else>
									<view class="allot " v-if="item.status == 0" @click="allot('edit', item.id, true)">已下发</view>
									<view class="allot gray " v-else>已下发</view>
								</view>
								<view class="see" v-if="item.status == 0" @click="reviewname(index)">编辑</view>
								<view class="see gray" v-if="item.status == 2">编辑</view>
								<view class="use" v-if="item.status == 2" @click="startUse(index)">已停用</view>
								<view class="use" v-if="item.status == 0" @click="stopUse(index, item.name)">已启用</view>
								<view class="del" @click="del(index, item.name)">删除</view>
							</view>
							<view v-else class="action-part">
								<view class="allot gray">未下发</view>
								<view class="see gray">编辑</view>
								<view class="use gray">已启用</view>
								<view class="del" @click="del(index, item.name)">删除</view>
							</view>
						</view>
						<view class="action-part" v-else>
							<view v-if="item.view == 1">
								<view class="allot gray">未下发</view>
							</view>
							<view v-else>
								<view class="allot gray">已下发</view>
							</view>
							<view class="see gray">编辑</view>
							<view class="use gray" v-if="item.status == 2">已停用</view>
							<view class="use gray" v-if="item.status == 0">已启用</view>
							<view class="del gray">删除</view>
						</view>
					</view>
				</view>
			</view>
			<view class="standard-content" v-if="list.length==0">
				<a-empty :changing="false"></a-empty>
			</view>
		</mescroll-uni>
</view>
		<view class="bottom" v-if="showCheck && list.length >= 1">
			<view class="check-bottom">
				<view class="left">
					<checkbox value="all" :checked="all" @click="checkAll()" color="#4abdb4"/>
					<view>全选</view>
				</view>
				<view class="right">
					<view class="batch" v-if="functionid ==1" @click="allot('batch', null, false)">批量下发</view>
					<!-- <view class="batch gray" v-else >批量下发</view> -->
					<view class="batch del" @click="batchDel()">批量删除</view>
				</view>
			</view>
		</view>
		<!-- 下发或批量下发 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showAllot" :mode="curMode" width="40%" height="80%" @close="close()">
				<view class="roleModel">
					<view class="roleTop">{{ allotitle }}</view>
					<view class="content">
						<view class="range">
							<view class="title">下发范围</view>
							<view class="part">
								<view class="left">
									<view class="top">
										<view class="">待选列表</view>
										<u-checkbox-group @change="checkedAllList">
											<u-checkbox v-model="listchoose" active-color="#4abdb4" icon-size="30">全选</u-checkbox>
										</u-checkbox-group>
									</view>
									<view class="list">
										<scroll-view scroll-y :class="ipadFlag?'ipadHs':'normalHs'">
											<u-checkbox-group @change="checkboxGroupChange" :wrap="true" icon-size="30">
												<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in checkList" :key="index"
												 :name="item.id" active-color="#4abdb4">
													<text class="job">{{ item.job }}</text>
													<text>{{ item.name }}</text>
												</u-checkbox>
											</u-checkbox-group>
										</scroll-view>
									</view>
								</view>
								<view class="right">
									<view class="top">已选列表</view>
									<view class="list">
										<scroll-view scroll-y :class="ipadFlag?'ipadHs':'normalHs'" v-if="hasList.length > 0">
											<view class="has" v-for="(item, index) in hasList" :key="index">
												<view class="name">{{ item.name }}</view>
												<view class="icon" @click="delChecklist(index)">
													<u-icon name="close" color="#cccccc" size="28"></u-icon>
												</view>
											</view>
										</scroll-view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="cancel()">取消</view>
						<view class="sure" @click="sure()">确定</view>
					</view>
				</view>
				<!-- 选择人员 -->
				<u-action-sheet :list="personSheetList" v-model="showPersonList" @click="personSheetCallback" border-radius="20"></u-action-sheet>
				<!-- 关联标准 -->
				<u-action-sheet :list="relevanceSheetList" v-model="showRelevanceList" @click="relevanceSheetCallback"
				 border-radius="20"></u-action-sheet>
			</u-popup>
		</view>
		<!-- 停用 -->
		<u-modal v-model="stopshow" @confirm="stopconfirm" :async-close="true" :show-cancel-button="true" :confirm-style="{ color: '#fa3534' }"
		 :show-title="false">
			<view class="slot-content">
				<view class="model">
					<view class="stop">您确定要停用【{{ Title }}】吗?</view>
					<view class="tips">停用后标准将被冻结，无法继续</view>
				</view>
			</view>
		</u-modal>
		<!-- 删除 -->
		<u-modal v-model="delshow" @confirm="delconfirm" :async-close="true" :show-cancel-button="true" :confirm-style="{ color: '#fa3534' }"
		 :show-title="false">
			<view class="slot-content">
				<view class="model">
					<view class="stop">您确定要删除【{{ Title }}】吗?</view>
					<view class="tips">已下发的标准将同时删除</view>
				</view>
			</view>
		</u-modal>
		<!-- 批量删除 -->
		<u-modal v-model="delAllshow" @confirm="delAllconfirm" :async-close="true" :show-cancel-button="true" :confirm-style="{ color: '#fa3534' }"
		 :show-title="false">
			<view class="slot-content">
				<view class="model">
					<view class="stop">您确定要删除已选中的标准吗?</view>
					<view class="tips">已下发的标准将同时删除</view>
				</view>
			</view>
		</u-modal>
		<!--编辑-->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="uploadshow" :mode="curMode" width="40%" height="80%" @close="editingCancel">
				<view class="Model">
					<view class="toptitle">编辑</view>
					<view class="top-part">
						<u-form :model="uploadform" ref="uForm" label-align="center">
							<u-form-item label="重命名" prop="uploadname" label-width="200" :border-bottom="false">
								<u-input v-model="uploadform.name" type="textarea" :clearable="false" :border="true" placeholder="请输入名称" height="70" :autoHeight="true"/>
							</u-form-item>
							<view class="tips">名称长度范围为2-40个字符，请勿输入特殊符号</view>
							<u-form-item label="数据汇总范围" prop="uploadrange" label-width="200">
								<u-input v-model="uploadform.range" type="select" :border="true" @click="openrange()" placeholder="点击选择" />
							</u-form-item>
							<u-form-item label="是否归类" prop="intro" label-width="200">
								<u-switch slot="right" v-model="uploadform.switchVal" active-color="#4abdb4"></u-switch>
							</u-form-item>
							<u-form-item label="标准分类" prop="uploadtype" v-if="uploadform.switchVal" label-width="200">
								<u-input v-model="uploadform.type" type="select" :border="true" @click="opentype()" placeholder="点击选择" />
							</u-form-item>
						</u-form>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="editingCancel()">取消</view>
						<view class="sure" @click="editing()">确定</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 选择标准 -->
		<view @touchstart="touchStart1" @touchmove="touchMove1" @touchend="touchEnd1">
			<u-popup v-model="showtype" :mode="curMode" width="40%" height="80%" @close="closetype">
				<view class="Model">
					<view class="toptitle">标准分类</view>
					<view class="leftop" @click="emptytype" :class="ipadFlag?'ipadPos':''">
						清空选中
					</view>
					<view class="right" @click="newtype" :class="ipadFlag?'ipadPos':''">
						新增分类
					</view>
					<view class="top-part" v-if="typelist&&typelist.length">
						<scroll-view scroll-y :class="ipadFlag?'ipadH':'normalH'">
							<uni-swipe-action>
								<uni-swipe-action-item class="swipe" v-for="(item, index) in typelist" :key="index" :right-options="options"
								 @change="open($event, index)" @click="delType($event, index)">
									<view class="type-part">
										<view class="leftype">
											<u-radio-group v-model="uploadform.type" size="50" icon-size="32">
												<u-radio :name="item.name" active-color="#4abdb4" label-size="32">
													{{item.name}}
												</u-radio>
											</u-radio-group>
										</view>
										<view class="rightype">
											<view class="arrow">
												<u-icon name="arrow-left-double" color="#999999" size="32"></u-icon>
											</view>
										</view>
									</view>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</scroll-view>
					</view>
					<view class="top-part" v-else>
						<a-empty :changing="false"></a-empty>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="closetype()">取消</view>
						<view class="sure" @click="suretype()">确定</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 数据汇总范围 -->
		<view @touchstart="touchStart1" @touchmove="touchMove1" @touchend="touchEnd1">
			<u-popup v-model="showrange" :mode="curMode" width="40%" height="80%" @close="closerange">
				<view class="Model">
					<view class="toptitle">数据汇总范围</view>
					<view class="top-part" v-if="rangelist&&rangelist.length">
						<view class="all">
							<u-checkbox-group @change="rangecheckedAll" icon-size="32" size="40">
								<u-checkbox v-model="rangechoose" active-color="#4abdb4">全部专责</u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="part">
							<scroll-view scroll-y :class="ipadFlag?'ipadH':'normalH'">
								<u-checkbox-group @change="rangecheckboxGroupChange" :wrap="true" icon-size="30" size="36">
									<u-checkbox @change="rangecheckboxChange" :disabled="item.disable" v-model="item.checked" v-for="(item, index) in rangelist"
									 :key="index" :name="item.name" active-color="#4abdb4">
										{{ item.name }}
									</u-checkbox>
								</u-checkbox-group>
							</scroll-view>
						</view>

					</view>
					<view class="top-part" v-else>
						<a-empty :changing="false"></a-empty>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="closerange()">取消</view>
						<view class="sure" @click="surerange()">确定</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 新增标准名称 -->
		<!-- 重命名 -->
		<u-modal v-model="renameshow" @confirm="renameconfirm" ref="uModal" :async-close="true" :show-cancel-button="true"
		 :confirm-style="{ color: '#4abdb4' }" :show-title="false">
			<view class="slot-content">
				<view class="model">
					<view class="rename">
						<u-input v-model="renamevalue" type="text" :border="true" placeholder="请输入标准分类名称" @input="replaceInput2()"/>
					</view>
					<view class="tips">名称长度范围为2-10个字符，请勿输入特殊符号</view>
				</view>
			</view>
		</u-modal>
		<!-- 单个删除标准分类 -->
		<u-modal v-model="showdelType" @confirm="confirmtypedel" ref="uModal1" :async-close="true" :show-cancel-button="true"
		 :confirm-style="{ color: '#fa3534' }" :show-title="false">
			<view class="slot-content">
				<view class="model">
					<view class="stop">您确定要删除该分类吗?</view>
				</view>
			</view>
		</u-modal>
		<!-- 搜索时选择标准 -->
		<u-picker mode="selector" v-model="showtypeValue" :default-selector="typeValueIndex" :range="typeValuelist" range-key="name"
		 @confirm="closetypeValue" @cancel="emptysearchValue" cancel-text="重置" confirm-color="#4abdb4"></u-picker>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	var timer //判断页面滚动
	import lFile from '@/components/l-file/l-file.vue';
	import {
		queryExcelList,
		enableExcel,
		deleteExcel,
		queryCompanyGroup,
		personnel,
		categoryList,
		renameExcel,
		editExcal,
		personnelEcho,
		uploadExcelTemplate,
		addCategory,
		deleteCategory
	} from '@/api/standard.js';
	import debounce from '@/uview-ui/libs/function/debounce.js';

	export default {
		props: {
			offset: {
				type: Number,
				default: 0
			},
			subHeight: {
				type: Number,
				default: 0
			},
			curMode: {
				type: String,
				default: 'bottom'
			}
		},
		data() {
			return {
				old: {
					scrollTop: 0,
					isScrollUp: false
				},
				//触摸弹窗坐标及状态
				touchDotX: 0,
				touchDotY: 0,
				touchMoveX: 0,
				touchMoveY: 0,
				time: 0,
				interval: 0,
				// 标准编辑
				uploadform: {
					id: null,
					uploadname: '',
					type: '',
					range: '',
					switchVal: false
				},
				uploadshow: false,
				//标准分类
				typelist: [],
				showtype: false,
				canceltypevalue:'',
				typechoose: true,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#fa3534'
					}
				}],
				//数据范围
				rangelist: [],
				showrange: false,
				cancelrangevalue:'',
				rangechoose: true,
				// 搜索时选择分类
				typeSearchValue: '',
				typeValuelist: [],
				showtypeValue: false,
				typeValueIndex: [0],
				oldValue: '',
				typeValuechoose: false,
				// 删除
				deltypeIndex: '',
				showdelType: false,
				//搜索
				standardName: '',
				showCheck: false,
				batchtitle: '批量管理',
				checkLength: 0,
				checkList: [],
				actionStyle: {
					backgroundColor: '#4abdb4',
					color: '#fff',
					margin: '0',
					width: '100rpx',
					height: '68rpx',
					lineHeight: '68rpx',
					borderRadius: '0 10rpx 10rpx 0'
				},
				list: [],
				all: false, //是否全选
				renameshow: false,
				renameindex: '',
				renamevalue: '',
				stopshow: false,
				stopIndex: '',
				delshow: false,
				delIndex: '',
				delAllshow: false,
				Title: '',
				showAllot: false,
				allotitle: '下发',
				allotId: null,
				allotFlag: false,
				allotIds: [],
				personList: [],
				person: '',
				personId: '',
				hasList: [],
				listchoose: false,
				relevance: '',
				addrelevanceList: [],
				personSheetList: [],
				showPersonList: false,
				relevanceSheetList: [],
				showRelevanceList: false,
				// 分页
				changing: true,
				mescroll: null,
				upOption: {
					noMoreSize: 5,
					onScroll: true,
					textNoMore: '我也是有底线的~',
					offset:300
				},
				categoryList: null,
				//是否编辑操作
				isStatus: false,
				ipadFlag:false,
				subH:40,
				functionid:null,
				allotlock:false,
				lockdel:false,
				renamelock:false,
				editlock:false,
				singlelock:false,
				locktypedel:false
			};
		},
		created() {
			this.functionid = uni.getStorageSync('functionid');
			if (this.curMode == 'left') {
				this.ipadFlag = true;
				this.subH=60
			} else {
				this.ipadFlag = false;
				this.subH=40
			}
			let _this = this;
			this.uid = uni.getStorageSync('USER_ID');
			_this.querySpecialtyAndGroup();
			this.category();
		},
		// watch: {
		// 	//防抖搜索
		// 	standardName(newVal, oldVal) {
		// 		if (newVal != oldVal&&newVal!='') {
		// 			debounce(this.searchStandard(), 500);
		// 		}
		// 	},

		// },
		methods: {
			searchInput(value){
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
				setTimeout(()=>{
					let endvalue=value.replace(patrn,'')
					this.standardName = endvalue;
					debounce(this.searchStandard(), 500);
				},100)
			},
			//分类重名名
			replaceInput2() {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.renamevalue;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.renamevalue= endvalue;
				},100)
			},
			scrollfun() {
				// 只要滚动就清除状态
				clearTimeout(timer)
				timer = setTimeout(() => {
					this.old.scrollTop = this.mescroll.scrollTop
					this.old.isScrollUp = this.mescroll.isScrollUp
					// 告知标识 -> 结束滚动
					if (this.old.scrollTop<=50&&this.old.isScrollUp == false&&this.list.length>5) {
						this.mescroll.scrollTo(0,0)
						this.old.scrollTop = 0;
						this.$emit('scorllway', false)
					}
					if (this.old.scrollTop > 150 && this.old.isScrollUp == true&&this.list.length>5) {
						this.$emit('scorllway', true)
					}					
				}, 30);
			},
			//触摸开始事件
			touchStart(e) {
				this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点 
				this.touchDotY = e.touches[0].pageY; // 获取触摸时的y原点 
				// 使用js计时器记录时间  
				this.interval = setInterval(function() {
					this.time++;
				}, 100);
			},
			// 触摸移动事件
			touchMove(e) {
				this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点 
				this.touchMoveY = e.touches[0].pageY; // 获取移动时的y原点 
				// 向左滑动 (如果是左边的弹窗) 
				if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10 && this.curMode == "left") {
					this.showAllot = false
					this.uploadshow = false
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == "bottom") {
					this.showAllot = false
					this.uploadshow = false
				}
			},
			// 触摸结束事件 
			touchEnd(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},

			//触摸开始事件
			touchStart1(e) {
				this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点 
				this.touchDotY = e.touches[0].pageY; // 获取触摸时的y原点 
				// 使用js计时器记录时间  
				this.interval = setInterval(function() {
					this.time++;
				}, 100);
			},
			// 触摸移动事件
			touchMove1(e) {
				this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点 
				this.touchMoveY = e.touches[0].pageY; // 获取移动时的y原点 
				// 向左滑动 (如果是左边的弹窗) 
				if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10 && this.curMode == "left") {
					this.showrange = false
					this.showtype = false
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == "bottom") {
					this.showrange = false
					this.showtype = false
				}
			},
			// 触摸结束事件 
			touchEnd1(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},

			//初始化请求数据
			// mescroll组件初始化的回调,可获取到mescroll对象
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			// 下拉刷新
			downCallback(mescroll) {
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				this.old.scrollTop = 0;
				this.$emit('scorllway', false);
				this.mescroll.resetUpScroll();				
			},
			// 上拉回调
			upCallback(mescroll) {
				let category = ''
				if (this.typeSearchValue != '' || this.typeSearchValue != null || this.typeSearchValue != undefined) {
					this.typeValuelist.forEach(item => {
						if (this.typeSearchValue == item.name) {
							category = item.id
						}
					})
				}
				queryExcelList(mescroll.num, mescroll.size, category, this.standardName, this.uid).then(res => {
					if (res != null) {
						let totalPage = Number(res[0].total);
						this.mescroll.endByPage(res.length, totalPage); //必传参数(当前页的数据个数, 总数据量)
						//设置列表数据
						res.forEach(item => {
							if (item.user_id == this.uid) {
								item.flag = true
							} else {
								item.flag = false
							}
							item.checked = false;
						})
						if (this.mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
						this.list = this.list.concat(res); //追加新数据

					} else {
						this.list = [];
						this.changing = false;
						// 隐藏下拉加载状态
						this.mescroll.endErr();
					}
				});
			},

			click(e, index) {
				let arr = []
				let id = this.collapseList[index].id
				arr.push(id)
				let data = {
					uid: this.uid,
					id: JSON.stringify(arr)
				}
				let _this = this
				helper.request(helper.websiteUrl + 'v1/deleteExcel', data, 'POST', true, res => {
					if (res == "不能删除该准则") {
						uni.showToast({
							title: '该准则不能删除',
							icon: 'none'
						})
					} else {
						uni.showToast({
							title: '删除成功',
							icon: 'none'
						})
						_this.collapseList.splice(index, 1);
					}
				})
			},

			//搜索时触发
			searchStandard() {
				this.mescroll.resetUpScroll();
			},
			//搜索时点击清除按钮触发
			clear() {
				this.standardName = '';
				// this.mescroll.resetUpScroll();
			},
			// 搜索时选择标准分类
			typeSearch() {
				this.showtypeValue = true;
				this.oldValue = this.typeSearchValue;
				if (this.typeSearchValue == '') {
					this.typeValueIndex = [0]
				} else {
					this.typeValuelist.map((item, index) => {
						if (item.name == this.typeSearchValue) {
							this.typeValueIndex = [index]
						}
					})
				}
			},
			//清空标准
			emptysearchValue(e) {
				this.typeSearchValue = ''
				// 这里然后调用mescorll方法
				if (this.oldValue != this.typeSearchValue) {
					this.searchStandard()
				}
			},
			closetypeValue(e) {
				this.typeSearchValue = this.typeValuelist[e].name
				this.showtypeValue = false;
				// 这里然后调用mescorll方法
				if (this.oldValue != this.typeSearchValue) {
					this.searchStandard()
				}
			},
			//批量管理
			batch() {
				let len = 0;
				this.list.map(item => {
					if (item.flag && item.status == 0 && item.view == 1) {
						len++
					}
				});
				if (len) {
					this.showCheck = !this.showCheck;
					this.all = false;
					this.list.map(item => {
						item.checked = false;
					});
					this.allotIds = [];
					if (this.showCheck) {
						this.batchtitle = '管理完成';
					} else {
						this.batchtitle = '批量管理';
					}
				} else {
					this.$refs.uToast.show({
						title: '没有可管理的标准',
						type: 'warning'
					});
				}

			},
			//选中单个
			check(index) {
				let checkLength = 0;
				this.selfLen = 0;
				this.list.map((item, idx) => {
					if (index == idx) {
						item.checked = !item.checked;
					}
				});
				this.allotIds = [];
				let arr = this.list;
				arr.map(item => {
					if (item.checked && item.isFlag) {
						checkLength++;
						this.allotIds.push(item.id);
					}
					if (item.isFlag&&item.view==1&&item.user_id==uni.getStorageSync("USER_ID")) {
						this.selfLen++;
					}
				});
				this.checkLength = checkLength;
				if (this.checkLength == this.selfLen) {
					this.all = false;
					this.checkAll();
				} else {
					this.all = false;
				}
			},
			//全选
			checkAll() {
				this.allotIds = [];
				if (this.all == true) {
					this.checkLength = 0;
					this.list.forEach(val => {
						val.checked = false;
					});
					this.all = false;
				} else {
					this.all = false;
					this.list.map(val => {
						if (this.showCheck && val.flag && val.status == 0 && val.view == 1) {
							this.allotIds.push(val.id);
							val.checked = true;
						}
					});
					this.all = true;
					this.checkLength = this.allotIds.length;
				}
			},
			//批量删除
			batchDel() {
				if(this.lockdel) return;
				this.lockdel=true;
				if (this.checkLength == 0) {
					this.$refs.uToast.show({
						title: '请至少选择一项标准进行删除',
						type: 'warning'
					});
					return;
				}
				this.delAllshow = true;
				this.lockdel=false;
			},
			//批量删除确定操作
			delAllconfirm() {
				if(this.lockdel) return;
				this.lockdel=true;
				let arr = [];
				this.list.map((item, index) => {
					if (item.checked) {
						arr.push(item.id);
					}
				});
				deleteExcel(arr).then(res => {
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					});
					this.all = false;
					this.lockdel=false;
					this.delAllshow = false;
					this.mescroll.resetUpScroll();
				});
			},
			//下发或批量下发
			allot(type, id, flag) {
				//数据回显工作
				if(this.allotlock) return;
				this.allotlock=true;
				this.allotId = id;
				if (type == 'single' && flag == false) {
					this.allotFlag = true;
					this.allotitle = '下发';
					this.hasList = [];
					this.listchoose = false;
					this.checkList.map(item => {
						item.checked = false;
					});
				}
				if (type == 'edit' && flag == true) {
					this.queryAllot(id);
					this.allotFlag = false;
					this.allotitle = '编辑下发';
				}
				if (type == 'batch') {
					if (this.checkLength == 0) {
						this.$refs.uToast.show({
							title: '请至少选择一项标准进行下发',
							type: 'warning'
						});
						this.allotlock=false;
						return;
					}
					
					this.allotFlag = true;
					this.allotitle = '批量下发';
					this.personList = [];
					this.person = '';
					this.hasList = [];
					this.listchoose = false;
					this.checkList.map(item => {
						item.checked = false;
					});	
								
				}
				setTimeout(()=>{
					this.showAllot = true;
					this.surelock=false;
					this.allotlock=false;
				},100)	
			},
			// 重命名(编辑)
			reviewname(index) {
				editExcal(this.list[index].id).then(res => {
					//判断是否是编辑操作
					if (res.user_id[0] == "") {
						this.isStatus = true
						this.personSheetList.forEach(item => {
							if (item.id == this.uid) {
								this.uploadform.range = item.name
								item.disabled = true
							} else {
								item.disabled = false
							}
						})
						this.rangechoose = true;
					}
					this.uploadform.name = res.name;
					this.uploadform.id = res.id;
					if (res.user_id[0] != "") {
						let str = '';
						res.user_id.forEach(item => {
							this.rangelist.map(val => {
								if (val.id == item) {
									val.checked = true;
									str += val.text + ',';
								}
							});
						});
						this.uploadform.range = str.slice(0, str.length - 1);
						if (this.rangelist.length == res.user_id.length) {
							this.uploadform.range = '全部专责';
						}
					}
					//是否归类
					if (res.isCategory == 0) this.uploadform.switchVal = true;
					if (res.isCategory == 1) this.uploadform.switchVal = false;
					//分类选中
					if (res.categort_id != '' && res.categort_id != null) {
						this.uploadform.switchVal = true
						this.typelist.map(item => {
							if (item.id == res.categort_id) {
								this.uploadform.type = item.name;
							}
						});
					}else{
						 this.uploadform.switchVal = false;
					}
					//专责的数据回显
					if (this.uploadform.range == '全部专责') {
						this.uploadform.range = '全部专责';
						this.rangelist.map(val => {
							val.checked = true;
						});
						this.rangechoose = true;
					} else {
						let s = this.uploadform.range.split(',');
						s.map(item => {
							this.rangelist.map(val => {
								if (val.name == item) {
									val.checked = true;
								}
							});
						});
						this.rangechoose = false;
					}
					this.renameindex = index
					//这里是编辑
					this.uploadshow = true;
				});

			},
			opentype() {
				this.showtype = true;
				this.canceltypevalue=this.uploadform.type
			},
			closetype() {
				this.showtype = false;
				this.uploadform.type=this.canceltypevalue
			},
			suretype(){
			this.showtype = false;
			this.canceltypevalue=this.uploadform.type
				
			},
			//打开范围
			openrange() {
				this.showrange = true;
				this.cancelrangevalue=this.uploadform.range
				this.rangelist.map(val => {
					val.checked = false;
				});
				if (this.cancelrangevalue == '全部专责') {
					this.uploadform.range = '全部专责';
					this.rangelist.map(val => {
						val.checked = true;
					});
					this.rangechoose = true;
				} else {
					let s = this.cancelrangevalue.split(',');
					s.map(item => {
						this.rangelist.map(val => {
							if (val.name == item) {
								val.checked = true;
							}
						});
					});
					this.rangechoose = false;
				}
			},
			// 选择范围
			rangecheckboxChange(e) {},
			rangecheckboxGroupChange(e) {
				this.uploadform.range = '';
				let arr = '';
				this.rangelist.forEach(res => {
					if (res.checked) {
						arr += res.name + ',';
					}
				})
				this.uploadform.range = arr.substring(0, arr.length - 1);
				if (this.uploadform.range != '') {
					if (this.uploadform.range.split(",").length == this.rangelist.length) {
						this.uploadform.range = "全部专责"
						this.rangechoose = true;
					} else {
						this.rangechoose = false;
					}
				} else {
					this.rangechoose = false;
				}
			},
			// 全选
			rangecheckedAll() {
				if (this.rangechoose) {
					this.rangelist.map(val => {
						val.checked = true;
						this.uploadform.range = '全部专责';
					});
				} else {
					this.rangelist.map(val => {
						if (val.disable) {
							val.checked = true
							this.uploadform.range = val.name;
						} else {
							val.checked = false
						}
					});
					this.rangelist = this.rangelist

				}
			},
			closerange() {
				this.showrange = false;
				this.uploadform.range=this.cancelrangevalue
			},
			surerange(){
				this.showrange = false;
				this.cancelrangevalue=this.uploadform.range
			},
			newtype() {
				this.renamevalue = ''
				this.renameshow = true;
			},
			//新增标准分类名称
			renameconfirm() {
				if(this.renamelock) return;
				this.renamelock=true;
				if (this.renamevalue.length < 2 || this.renamevalue.length > 10) {
					this.$refs.uToast.show({
						title: '分类名称长度范围为2-10个字符',
						type: 'warning'
					});
					this.$refs.uModal.clearLoading();
					this.renamelock=false;
					return;
				} else {
					// 这里发请求改变typelist.
					addCategory({
						name: this.renamevalue,
						user_id: this.uid
					}).then(res => {
						if (res.constructor == String) {
							this.typelist.push({
								checked: false,
								name: this.renamevalue,
								show: false,
								id: res
							});
							this.uploadform.type=this.renamevalue;				
							this.renameshow = false;
							this.renamelock=false;
						} else {
							this.$refs.uToast.show({
								title: '名称重复',
								type: 'warning'
							});
							this.$refs.uModal.clearLoading();
							this.renamelock=false;
						}
					})
				}
			},
			open(e, index) {
				this.typelist[index].show = true;
				this.typelist.map((val, idx) => {
					if (index != idx) {
						this.typelist[idx].show = false;
					}
				})
			},
			//删除标准分类
			delType(e, index) {
				this.showdelType = true;
				this.deltypeIndex = index;
			},
			//确定删除标准分类(如果该分类下有标准则不可删除)
			confirmtypedel() {
				if(this.locktypedel) return;
				this.locktypedel=true;
				deleteCategory(this.typelist[this.deltypeIndex].id).then(res => {
					if (res) {
						let name = this.typelist[this.deltypeIndex].name
						if (this.uploadform.type == name) {
							this.uploadform.type = ''
						}
						this.showdelType = false;
						this.typelist.splice(this.deltypeIndex, 1);
						this.locktypedel=false
					} else {						
						this.$refs.uToast.show({
							title: '该分类暂时不能删除',
							type: 'warning'
						});
						this.$refs.uModal1.clearLoading();
						this.showdelType = false;
						this.locktypedel=false;
					}
				})
			},
			//清空标准分类选中
			emptytype() {
				this.uploadform.type = ''
			},
			// 启用
			startUse(index) {
				enableExcel(this.list[index].id, 2).then(res => {
					this.list[index].status = 0;
					this.stopshow = false;
				});
			},
			// 停用
			stopUse(index, name) {
				this.stopshow = true;
				this.stopIndex = index;
				this.Title = name;
			},
			stopconfirm() {
				enableExcel(this.list[this.stopIndex].id, 1).then(res => {
					this.list[this.stopIndex].status = 2;
					this.stopshow = false;
					let len = 0;
					this.list.map(item => {
						if (item.flag && item.status == 0 && item.view == 1) {
							len++
						}
					});
					if (len == 0) {
						this.showCheck = false;
						this.all = false;
						this.list.map(item => {
							item.checked = false;
						});
						this.batchtitle = '批量管理';
					}
				});
			},
			//删除
			del(index, name) {
				this.delshow = true;
				this.delIndex = index;
				this.Title = this.list[index].name;
			},
			delconfirm() {
				if(this.singlelock) return;
				this.singlelock=true
				let arr = [this.list[this.delIndex].id];
				deleteExcel(arr).then(res => {
					this.delshow = false;
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					});
					this.mescroll.resetUpScroll()
					this.singlelock=false;
				});
			},
			//下发弹框
			// 人员
			openPerson() {
				this.showPersonList = true;
			},
			personSheetCallback(index) {
				this.person = this.personSheetList[index].text;
				this.personId = this.personSheetList[index].id;
			},
			//查看数据人员点击添加按钮
			addPerson() {
				if (this.person == '') {
					this.$refs.uToast.show({
						title: '请选择查看数据的人员',
						type: 'warning'
					});
					return;
				}
				if (this.personList.length == 0) {
					this.personList.push({
						name: this.person,
						id: this.personId
					});
				} else {
					let flag = 0;
					this.personList.map(e => {
						if (e.name == this.person) {
							flag++;
						}
					});
					if (flag == 0) {
						this.personList.push({
							name: this.person,
							id: this.personId
						});
					} else {
						this.$refs.uToast.show({
							title: '无需重复添加',
							type: 'warning'
						});
					}
				}
			},
			delPerson(index) {
				this.personList.splice(index, 1);
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.hasList = [];
				e.map(item => {
					this.checkList.forEach(val => {
						if (val.id == item) {
							this.hasList.push({
								name: val.name,
								id: item
							});
						}
					});
				});
				if (e.length == this.checkList.length) {
					this.listchoose = true;
				} else {
					this.listchoose = false;
				}
			},
			// 全选
			checkedAllList() {
				this.hasList = [];
				if (this.listchoose == true) {
					this.checkList.map(val => {
						val.checked = true;
						this.hasList.push({
							name: val.name,
							id: val.id
						});
					});
				} else {
					this.checkList.map((val, index) => {
						val.checked = false;
						this.hasList.splice(index, 1);
					});
				}
			},
			delChecklist(index) {
				let id = this.hasList[index].id;
				this.hasList.splice(index, 1);
				this.checkList.forEach(item => {
					if (item.id == id) {
						item.checked = false;
					}
				});
				if (this.hasList.length == 0) {
					this.listchoose = false;
				}
			},
			//标准关联
			openRelevance() {
				this.showRelevanceList = true;
			},
			relevanceSheetCallback(index) {
				this.relevance = this.relevanceSheetList[index].text;
			},
			addrelevance() {
				if (this.addrelevanceList.length == 0) {
					this.addrelevanceList.push({
						name: this.relevance
					});
				} else {
					this.addrelevanceList.map(e => {
						if (e.name != this.relevance) {
							this.addrelevanceList.push({
								name: this.relevance
							});
						} else {
							this.$refs.uToast.show({
								title: '无需重复添加',
								type: 'warning'
							});
							return false;
						}
					});
				}
			},
			deladdrelevance() {
				this.addrelevanceList.splice(index, 1);
			},
			//确定下发按钮
			sure() {
				//allotFlag true下发操作  false编辑操作
				if(this.surelock) return;
				this.surelock=true;
				this.allotitle = '下发'
				if (this.allotFlag) {
					if (this.allotIds.length == 0) {
						//单个下发
						let arr = [];
						this.hasList.forEach(item => {
							arr.push(item.id);
						});
						personnel({
							excelIds: [this.allotId],
							userIds: arr
						}, true).then(res => {
							this.cancel();
							this.mescroll.resetUpScroll();
						});
					} else {
						//单个下发
						let arr = [];
						this.hasList.forEach(item => {
							arr.push(item.id);
						});
						personnel({
							excelIds: this.allotIds,
							userIds: arr
						}, true).then(res => {
							this.cancel();
							this.mescroll.resetUpScroll();
						});
					}
				} else {
					//单个下发
					let arr = [];
					this.hasList.forEach(item => {
						arr.push(item.id);
					});
					personnel({
						excelIds: [this.allotId],
						userIds: arr
					}, false).then(res => {
						this.cancel();
						this.mescroll.resetUpScroll();
					});
				}
			},
			//取消下发按钮
			cancel() {
				this.showAllot = false;
				this.personList = [];
				this.hasList = [];
				this.checkList.forEach(item => {
					item.checked = false;
				});
				this.allotFlag = false;
				this.allotId = null;
				this.allotIds = [];
				this.all = false;
				this.list.forEach(item => {
					item.checked = false;
				});
				this.showCheck = false;
				this.batchtitle = '批量管理';
				this.surelock=false;
			},
			//编辑确定按钮
			editing() {
				if(this.editlock) return;
				this.editlock=true;
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				if(patrn.test(this.uploadform.name)){
					this.$refs.uToast.show({
						title: '请勿输入特殊字符',
						type: 'warning'
					});
					this.$refs.uModal.clearLoading();
					this.editlock=false
					return;
				}
				if (this.uploadform.name.length < 2 || this.uploadform.name.length > 40) {
					this.$refs.uToast.show({
						title: '标准名称长度范围为2-40个字符',
						type: 'warning'
					});
					this.$refs.uModal.clearLoading();
					this.editlock=false
					return;
				}
				let len = 0;
				this.rangelist.map(item => {
					if (item.checked) {
						len++
					}
				})
				if (len == 0) {
					this.$refs.uToast.show({
						title: '数据汇总范围不能为空',
						type: 'warning'
					});
					this.editlock=false
					return;
				}
				let id = '';
				id = this.list[this.renameindex].id;
				let categort_id = '';
				if (this.uploadform.switchVal) {
					this.typelist.map(item => {
						if (item.name == this.uploadform.type) {
							categort_id = item.id;
						}
					})
				}
				let userId = [];
				this.rangelist.map(item => {
					if (item.checked) {
						userId.push(item.id);
					}
				});
				let obj = {
					id: id,
					name: this.uploadform.name,
					type: 1,
					user_id: userId,
					categort_id: categort_id
				};
				if (this.isStatus) {
					renameExcel(obj, true).then(res => {
						if (res) {
							this.editingCancel();
							this.mescroll.resetUpScroll();
						} else {
							this.$refs.uToast.show({
								title: '标准名称重复了',
								type: 'warning'
							});
							this.editlock=false
						}
					});
				} else {
					renameExcel(obj, false).then(res => {
						if (res) {
							this.editingCancel();
							this.mescroll.resetUpScroll();
						} else {
							this.$refs.uToast.show({
								title: '标准名称重复了',
								type: 'warning'
							});
							this.editlock=false
						}
					});
				}
			},
			editingCancel() {
				this.uploadform = {
						id: null,
						uploadname: '',
						type: '',
						range: '',
						switchVal: false
					},
					this.uploadshow = false;
				this.rangelist.forEach(item => {
					item.checked = false
				})
				this.typelist.forEach(item => {
					item.checked = false
				})
				this.isStatus = false
				this.editlock=false
			},
			checkboxChange() {},
			close() {
				this.showAllot = false;
			},
			newStandard() {
				helper.request(helper.uploadFile + 'v1/uploadExcel', param, 'POST', true, res => {});
			},
			upload() {
				//helper.downloadTask(helper.websiteUrl + 'v1/downloadTemplate');
				var w = plus.nativeUI.showWaiting("处理中，请等待...", {
									style: "black",
									loading: {
										display: "inline"
									}
								});
				uploadExcelTemplate().then(res => {
					w.close();
					//以上成对，加载之前showLoading，加载之后hideToast
					plus.nativeUI.toast(res);
					this.cancelCheck()
				})
			},
			//查询组长和专责列表
			querySpecialtyAndGroup() {
				queryCompanyGroup(this.uid).then(res => {
					this.checkList = res.group;
					this.personSheetList = res.leader;
					res.leader.forEach(item => {
						item.name = item.text;
						item.checked = false;
						if (item.id == this.uid) {
							item.disable = true
						} else {
							item.disable = false
						}
					});
					this.rangelist = res.leader;
				});
			},
			//查询下发记录
			queryAllot(id) {
				personnelEcho(id).then(res => {
					this.checkList.forEach(item => {
						item.checked = false
					})
					//组长的集合
					let group = [];
					this.isStatusFlag = false;
					this.listchoose=false
					res.forEach(val => {
						this.checkList.forEach(item => {
							if (item.id == val) {
								group.push({
									id: item.id,
									name: item.name
								});
								item.checked = true;
							}
						});
					});
					if (group.length == this.checkList.length) {
						this.listchoose = true;
					}
					this.hasList = group;
				})
			},
			closeupload() {
				this.uploadshow = false;
			},
			//新增标准
			onUpload() {
				let uid = uni.getStorageSync('USER_ID');
				let functionid = uni.getStorageSync('functionid');
				let company_id = uni.getStorageSync('company_id');
				let _this = this;
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					// nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: _this.$mp.page.$getAppWebview(),
					// #endif
					//非真实地址，记得更换,调试时ios有跨域，需要后端开启跨域并且接口地址不要使用http://localhost/
					url: 'v1/uploadExcel',
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
			onSuccess(res) {
				let data = JSON.stringify(res);
				uni.showToast({
					title: data.data,
					icon: 'none'
				});
				this.mescroll.resetUpScroll();
			},
			category() {
				categoryList(this.uid).then(res => {
					res.forEach(item => {
						item.checked = false;
					});
					this.typelist = res;
					this.typeValuelist = res;
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	
	/deep/.u-content {
		border-radius: 10rpx 0 0 10rpx !important;
	}
	/deep/.uni-checkbox-input-checked {
		border: 1px solid #4abdb4;
	}
	
	/deep/.uni-checkbox-input:hover {
		border-color: #4abdb4 !important;
	}

	// 筛选弹窗
	.Model {
		.toptitle {
			height: 90rpx;
			line-height: 90rpx;
			background: #4abdb4;
			color: #ffffff;
			font-size: 34rpx;
			text-align: center;
			position: fixed;
			top: 0rpx;
			width: 100%;
			z-index: 999;
		}

		.right {
			position: fixed;
			top: 0rpx;
			right: 0;
			width: 150rpx;
			height: 90rpx;
			color: #FFFFFF;
			line-height: 90rpx;
			font-size: 30rpx;
			z-index: 999;
		}

		.leftop {
			position: fixed;
			top: 0;
			left: 0;
			width: 150rpx;
			height: 90rpx;
			color: #FFFFFF;
			line-height: 90rpx;
			font-size: 30rpx;
			text-align: right;
			z-index: 999;			
		}
		.ipadPos{
			height: 50rpx;
			line-height: 50rpx;
			top: 40rpx;
		}
		.tips {
			font-size: 28rpx;
			color: #999999;
			text-align: right;
			border-bottom: 1px solid #f6f6f6;
			padding-bottom: 20rpx;
		}

		.all {
			margin-top: 100rpx;
			padding: 0 30rpx;
		}

		.part {
			margin-left: 100rpx;
		}

		.top-part {
			padding: 0 30rpx;
			margin-top: 100rpx;
			.normalH{
				height: 60vh;
				width: 100%;
			}
			.ipadH{
				height: 75vh;
				width: 100%;
			}

			.type-radio {
				padding: 10rpx 30rpx;
				line-height: 60rpx;
				border: 1px solid #EEEEEE;
				margin-top: 30rpx;
				border-radius: 20rpx;
			}

			.type-part {
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #EEEEEE;
				align-items: center;
				padding: 20rpx 0;
				width: 100%;

				.leftype {
					width: 90%;
				}

				.rightype {
					width: 10%;
				}
			}
		}

		.roleAction {
			position: fixed;
			bottom: 0;
			height: 100rpx;
			line-height: 100rpx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			font-size: 32rpx;
			width: 100%;
			border-top: 2rpx solid #f6f6f6;
			background: #ffffff;
			z-index: 999;

			.cancel {
				width: 40%;
				border: 2rpx solid #dedede;
				color: #606266;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 80rpx;
			}

			.sure {
				width: 40%;
				color: #ffffff;
				background: #4abdb4;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;
				border: 2rpx solid #4abdb4;
				border-radius: 80rpx;
			}
		}
	}
	.wrap{
		position: relative;
	}

	.standard {
		.standard-top {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 30rpx;
			background: #f6fff9;

			.action {
				width: 30%;
				background: #4abdb4;
				border-radius: 10rpx;
				color: #ffffff;
				font-size: 30rpx;
				text-align: center;
				height: 70rpx;
				line-height: 70rpx;
			}

			.gray {
				background: #c8c9cc;
			}
		}

		.subpart {
			padding: 20rpx 30rpx;
			background: #FFFFFF;

			.subtop {
				display: flex;
				justify-content: space-between;

				.subsearch {
					width: 100%;
					flex: 1;
				}

				.subnew {
					min-width: 200rpx;
					width: 25%;
					padding-right: 10rpx;

				}
			}
		}

		.standard-content {
			padding: 20rpx 20rpx 0 20rpx;

			.part {
				padding: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 20rpx;
				border: 2rpx solid #f6f6f6;
				background: #ffffff;

				.top-part {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin: 10rpx 0;

					.left {
						display: flex;
						margin-right: 20rpx;

						.check {
							width: 30px;
							height: 100rpx;
							line-height: 100rpx;
						}

						image {
							width: 100rpx;
							height: 100rpx;
						}
					}

					.right {
						width: 100%;
						flex: 1;

						.name {
							width: 100%;
							flex: 1;
							font-size: 30rpx;
							color: #333333;
							overflow: hidden;
							display: -webkit-box;
							text-overflow: ellipsis;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							line-height: 50rpx;
						}

						.detail {
							width: 100%;
							display: flex;
							justify-content: space-between;
							line-height: 50rpx;

							.size {
								font-size: 28rpx;
								color: #606266;
							}

							.time {
								font-size: 24rpx;
								color: #999999;
							}
						}
					}
				}

				.action {
					display: flex;
					justify-content: space-between;
					padding-top: 30rpx;
					border-top: 2rpx solid #f6f6f6;

					.actiontype {
						font-size: 28rpx;
						color: #999999;
						overflow: hidden;
						width: 25%;
						display: flex;
						align-items: center;
					}
				}

				.action-part {
					display: flex;
					justify-content: flex-end;
					font-size: 28rpx;
					width: 75%;
					flex: 1;


					.see {
						width: 100rpx;
						text-align: center;
						border: 2rpx solid #2b85e4;
						color: #2b85e4;
						margin-right: 10rpx;

						border-radius: 10rpx;
						height: 60rpx;
						line-height: 60rpx;
					}

					.allot {
						width: 100rpx;
						text-align: center;
						border: 2rpx solid #18b566;
						color: #18b566;
						margin-right: 10rpx;
						border-radius: 10rpx;
						height: 60rpx;
						line-height: 60rpx;
					}

					.del {
						width: 100rpx;
						text-align: center;
						border: 2rpx solid #dd6161;
						color: #dd6161;
						margin-right: 10rpx;
						border-radius: 10rpx;
						height: 60rpx;
						line-height: 60rpx;
					}

					.use {
						width: 100rpx;
						text-align: center;
						border: 2rpx solid #ff9900;
						color: #ff9900;
						margin-right: 10rpx;
						border-radius: 10rpx;
						height: 60rpx;
						line-height: 60rpx;
					}

					.gray {
						border: 2rpx solid #999999;
						color: #999999;
					}

					.green {
						border: 2rpx solid #18b566;
						color: #18b566;
					}
				}
			}
		}

		.bottom {
			position: fixed;
			width: 100%;
			background: #ffffff;
			height: 100rpx;
			line-height: 100rpx;
			box-shadow: 0 -6rpx 10rpx rgba(0, 0, 0, 0.15);
			bottom: 0;
			z-index: 99;

			.check-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx;

				.left {
					display: flex;
					color: #4abdb4;
					font-size: 32rpx;
				}

				.right {
					display: flex;
					justify-content: flex-end;

					.batch {
						background: #19be6b;
						color: #ffffff;
						border-radius: 40rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						margin-right: 20rpx;
						padding: 0 20rpx;
						box-shadow: 0 6rpx 6rpx #71d5a1;
					}

					.stop {
						background: #ff9900;
						margin: 20rpx 0;
					}

					.del {
						background: #fa3534;
						box-shadow: 0 6rpx 6rpx #fab6b6;
					}
				}
			}
		}

		.model {
			padding: 30rpx;

			.rename {
				margin: 20rpx 0;
			}

			.stop {
				font-size: #333333;
				line-height: 50rpx;
				font-size: 32rpx;
				margin: 20rpx 0;
			}

			.tips {
				font-size: 28rpx;
				color: #999999;
			}
		}

		//下发
		.roleModel {
			width: 100%;
			position: relative;
			padding-top: 90rpx;
			padding-bottom: 120rpx;

			.roleTop {
				height: 90rpx;
				line-height: 90rpx;
				background: #4abdb4;
				color: #ffffff;
				font-size: 34rpx;
				text-align: center;
				position: fixed;
				top: 0rpx;
				width: 100%;
				z-index: 99;
			}

			.content {
				padding: 30rpx;
			}

			.choose {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin: 40rpx 0 20rpx;

				.title {
					color: #333333;
					font-size: 30rpx;
					margin-right: 10rpx;
				}

				.input_part {
					margin-right: 10rpx;
					width: 100%;
					flex: 1;
				}

				.add {
					width: 100rpx;
					padding: 0 10rpx;
					height: 70rpx;
					line-height: 70rpx;
					font-size: 30rpx;
					border: 2rpx solid #dcdfe6;
					border-radius: 10rpx;
					color: #4abdb4;
					text-align: center;
				}
			}

			.hasChoosed {
				border: 2rpx solid #f6f6f6;
				padding: 20rpx;
				margin: 20rpx 0;
				border-radius: 20rpx;

				.has {
					display: inline-flex;
					justify-content: space-between;
					align-items: center;
					text-align: center;
					background: #f8f8f8;
					width: 25%;
					padding: 10rpx;
					border-radius: 10rpx;
					margin: 10rpx;

					.name {
						font-size: 28rpx;
					}

					.icon {
						margin-left: 10rpx;
					}
				}
			}

			.range {
				margin: 20rpx 0;

				.title {
					font-size: 32rpx;
					color: #333333;
					text-align: center;
					width: 100%;
					margin-bottom: 20rpx;
				}

				.part {
					display: flex;
					justify-content: space-between;

					.left {
						border: 2rpx solid #f6f6f6;
						width: 50%;

						.top {
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 30rpx;
							color: #333333;
							padding: 10rpx 20rpx;
						}

						.list {
							padding: 10rpx 20rpx;
							.normalHs{
								height: 50vh;
								width: 100%;
							}
							.ipadHs{
								height: 60vh;
								width: 100%;
							}

							/deep/.u-checkbox {
								border-bottom: 2rpx solid #f6f6f6;
							}

							.job {
								color: #4abdb4;
								margin-right: 10rpx;
							}

							text {
								font-size: 28rpx;
								color: #606266;
							}
						}
					}

					.right {
						width: 40%;
						border: 2rpx solid #f6f6f6;

						.top {
							font-size: 30rpx;
							color: #4abdb4;
							padding: 10rpx 20rpx;
						}

						.list {
							padding: 10rpx 20rpx;
							.normalHs{
								height: 50vh;
								width: 100%;
							}
							.ipadHs{
								height: 60vh;
								width: 100%;
							}

							.has {
								display: flex;
								background: #f6f6f6;
								padding: 10rpx;
								justify-content: space-between;
								align-items: center;
								border-radius: 10rpx;
								margin-top: 10rpx;

								.name {
									font-size: 28rpx;
								}

								.icon {
									margin: 0 10rpx;
								}
							}
						}
					}
				}
			}

			.roleAction {
				position: fixed;
				bottom: 0;
				height: 100rpx;
				line-height: 100rpx;
				display: flex;
				justify-content: space-around;
				align-items: center;
				border-top: 2rpx solid #f6f6f6;
				font-size: 32rpx;
				width: 100%;
				background: #ffffff;

				.cancel {
					width: 40%;
					border: 2rpx solid #dedede;
					color: #606266;
					text-align: center;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 80rpx;
				}

				.sure {
					width: 40%;
					color: #ffffff;
					background: #4abdb4;
					text-align: center;
					height: 80rpx;
					line-height: 80rpx;
					border: 2rpx solid #4abdb4;
					border-radius: 80rpx;
				}
			}
		}
	}
</style>
