<template>
	<view class="index" v-if="menuflag">
		<a-index bgColor='#4abdb4' text="验收评价" :showList='true' :showBack="false" :msgdata="msgdata1" :curMode="curMode"
		 :username="leftname" :phone='leftphone' :role='leftrole' @headHeight='getHeight' ref="headtop" :headpic="leftpic" :net="networkFlag"></a-index>
		<view class="netpart" v-if="networkFlag" :style="{top:phoneHeight+15+'px'}">
			<view class="network">
				<image src="/static/network.png"></image>
				<view class="net">
					设备未联网
				</view>
			</view>
		</view>
		<u-sticky offset-top="0">
			<view :class="header?'header':'nonelead'">
				<view class="lead" :id="leadId" :class="header?'':'none'">
					<view class="lead-part" :class="header?'':'none'">
						<u-grid :col="leadcount">
							<u-grid-item v-for="(menu,index) in menuList" :key="index" :bg-color="index=== current1?'#e0f9f7':''" @click="change(menu.menu_url,index)">
								<u-badge :count="scheduleDot" :offset="[20, 20]" v-if="menu.menu_url=='/pages/schedule/schedule'"></u-badge>
								<image :src="menu.menu_icon"></image>
								<view class="grid-text" :class="index=== current1?'white':''">{{menu.menu_name}}</view>
							</u-grid-item>
						</u-grid>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="content" v-if="current=='/pages/index/index'">
			<!-- 这里是图表统计 -->
			<statistics :offset='leadheight' :curMode='curMode' :subHeight="subHeight" @scorllway='scorllway'></statistics>
		</view>
		<view class="content" v-if="current=='/pages/checktask/checktask'">
			<!-- 这里是检查任务-->
			<checktask :offset='leadheight' :curMode='curMode' ref="checktask" :subHeight="subHeight" @scorllway='scorllway'
			 :process="process"></checktask>
		</view>
		<view class="content" v-if="current=='/pages/question/question'">
			<!-- 这里是问题列表 -->
			<question :offset='leadheight' :curMode='curMode' :subHeight="subHeight" @scorllway='scorllway'></question>
		</view>
		<view class="content" v-if="current=='/pages/standard/standard'">
			<!-- 这里是标准模板 -->
			<standard :offset='leadheight' :curMode='curMode' :subHeight="subHeight" @scorllway='scorllway'></standard>
		</view>
		<view class="content" v-if="current=='/pages/schedule/schedule'">
			<!-- 这里是待办事项 -->
			<schedule :offset='leadheight' :curMode='curMode' @msgRead='subDot' :subHeight="subHeight" @scorllway='scorllway'></schedule>
		</view>
		<view class="content" v-if="current=='/pages/application/application'">
			<!-- 这里是应用中心 -->
			<application :offset='leadheight' :netflag="!networkFlag"></application>
		</view>
		<view class="content" v-if="current=='/pages/setting/setting'">
			<!-- 这里是系统配置-->
			<setting :offset='leadheight' :curMode='curMode' @funInfo='getInfo' :subHeight="subHeight" @scorllway='scorllway'></setting>
		</view>
		<view class="content" v-if="current=='forbidden'">
			<!-- 这里是没有角色权限对应菜单显示-->
			<forbidden></forbidden>
		</view>
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
	<view class="emptypart" v-else>
		<view class="empty1">
			<view>
				<image src="../../static/mescroll-empty.png" mode=""></image>
				<view class="empty-tips">
					该账号暂无任何权限~
				</view>
				<view class="contact">
					联系管理员或<text class="changing" @click="changing">
						切换账号
					</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import bus from '@/common/bus.js'
	import helper from '@/common/helper.js'
	import Aindex from '@/components/AIndex/index.vue'
	import statistics from '@/components/statistics/statistics.vue';
	import application from '@/components/application/application.vue';
	import question from '@/components/question/question.vue';
	import schedule from '@/components/schedule/schedule.vue';
	import standard from '@/components/standard/standard.vue';
	import setting from '@/components/setting/setting.vue';
	import checktask from '@/components/checktask/checktask.vue'
	import forbidden from '@/components/forbidden/forbidden.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	import {
		queryToUserPublicCount
	} from '@/api/public.js'
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		components: {
			'statistics': statistics, //统计
			'application': application, //应用中心
			'question': question, //问题列表
			'schedule': schedule, //待办事项
			'standard': standard, //标准模板
			'setting': setting, //系统配置
			'checktask': checktask, //检查任务
			'a-index': Aindex
		},
		data() {
			return {
				leadId: this.$u.guid(),
				leadheight: 0,
				subHeight: 300,
				current: '/pages/index/index', //当前选中模块
				current1: 0,
				leadcount: '1',
				menuList: [],
				msgdata1: "0",
				networkFlag: false,
				curMode: 'bottom',
				header: true,
				leftname: '暂无',
				leftphone: '暂无',
				leftrole:'暂无',
				leftpic:'../../static/headpic8.png',
				scollheight: 0,
				menuflag: true,
				loading: false,
				scheduleDot: 0,
				noneFlag: false,
				process: true,
				funId:1,
				phoneHeight:20		
			}
		},
		created() {
			if (uni.getStorageSync('functionid')) {
				this.funId = uni.getStorageSync('functionid');
			}
			this.init();
			let _this = this;
			uni.getNetworkType({
				success: function(res) {
					if (res.networkType == 'none') {
						_this.networkFlag = true;
					} else {
						_this.networkFlag = false;
						
					}
				}
			});
			uni.getSystemInfo({
				success: function(res) {
					_this.phoneHeight = res.statusBarHeight || 20
				}
			})
			_this.headinfo();
			uni.setStorageSync("flagtask", false);
		},
		onShow() {
			let _this = this;
			uni.onNetworkStatusChange(function(res) {
				if (res.isConnected) {
					uni.showToast({
						title: '网络已连接',
						icon: 'none'
					});
					_this.networkFlag = false;
					_this.headinfo();
				} else {
					uni.showToast({
						title: '网络已断开',
						icon: 'none'
					});
					_this.networkFlag = true;
					_this.headinfo();
				}
			});
			const {
				windowWidth,
				windowHeight,
				brand,
				model
			} = uni.getSystemInfoSync();
			let ratio = windowHeight / windowWidth;
			if (windowWidth > 600 && ratio < 1.7 && windowHeight > 600||brand=="HUAWEI"&&model=="BAH3-W59") {
				this.curMode = 'left'
				//平板端搜索框样式
				bus.$emit('ipadW', {
					data: 'ipadW'
				})
				uni.setStorageSync('curMode', this.curMode);
			} else {
				this.curMode = 'bottom'
				uni.setStorageSync('curMode', this.curMode);
			}

			uni.$on('headHeight', res => {
				this.scollheight = res.data;
			})

			uni.$on('current', res => {
				this.current = res.data;
			})
			//修改当前登录人的名字或电话
			this.leftname = uni.getStorageSync("NAME")
			this.leftphone = uni.getStorageSync("PHONE")
			this.leftrole= uni.getStorageSync("ROLE_NAME")
			//公告小红点
			this.queryUserByBulletin();
			//任务列表刷新
			const value=uni.getStorageSync("flagtask")
			const taskIndex = uni.getStorageSync("taskIndex")
			if (value&&this.current =='/pages/checktask/checktask') {			
				if(taskIndex==0){
					this.$refs.checktask.refreshtask();	
				}
				if(taskIndex==1){
					this.$refs.checktask.refreshtask1();	
				}
				uni.removeStorageSync("taskIndex")
				uni.removeStorageSync("flagtask")	
			}
			
			setInterval(this.queryUserToRectifyNum,1000);	
			
		},
		
		mounted(){
			this.getleadHeight();
		},
		methods: {
			headinfo(){
				if(this.networkFlag){
					if(uni.getStorageSync('picflag')){
						this.leftpic = uni.getStorageSync('leftpic');						
					}else{
						this.leftpic = '../../static/headpic8.png';
					}
				}else{
					let company_id=uni.getStorageSync('company_id');
					helper.requestUrl(helper.websiteUrl + "v1/getpictures", {
						'PICTURES_ID':company_id
					}, 'GET', (data) => {
						let pic=helper.addBaseUrl(helper.baseIp +'uploadFiles/uploadImgs/'+ data.PATH);					
						this.getNetworkImage(pic).then(res=>{
							this.leftpic = res;
							uni.setStorageSync('picflag',true)
							uni.setStorageSync('leftpic',res)
						});					
					})
				}
			},
			getNetworkImage(url) {  
				return new Promise(resolve=>{
					uni.downloadFile({
	                        url,
	                        success: (e) => {
								uni.getImageInfo({
								src: e.tempFilePath,
								success: function (image) {
								resolve(image.path);
								}
							});
	                    },
					})
				})
			},
			changing() {
				uni.clearStorage();
				uni.clearStorageSync();
				uni.reLaunch({
					url: '/pages/login/login'
				});
			},
			scorllway(res) {
				if (res == this.noneFlag) {
					return;
				}
				const {
					windowWidth,
					windowHeight
				} = uni.getSystemInfoSync();
				if (res) {
					this.leadheight = this.scollheight * 2;
					this.subHeight = uni.getSystemInfoSync().windowHeight - this.leadheight
					if(windowWidth>500&&windowHeight>700&&windowWidth<600){
						this.leadheight = this.scollheight * 2-60;
						this.subHeight = uni.getSystemInfoSync().windowHeight - this.leadheight-120
					}
					this.header = false;
					this.noneFlag = true;
				} else {
					const value = uni.getStorageSync('leadpart');
					if (value) {
						this.leadheight = value[0].leadheight;
						this.subHeight = value[0].subHeight;
					}
					this.header = true;
					this.noneFlag = false;
				}
			},
			getHeight(res) {
				this.scollheight = res;
			},
			init() {
				this.loading = true;
				if (uni.getStorageSync('menuList')) {
					this.menuList = uni.getStorageSync('menuList')
					var menuListlength = new Array();
					for (var value of this.menuList) {
						if (value.parent_id == 0) {
							menuListlength.push(value)
						}
					}
					this.menuList = menuListlength;
					this.menuflag = true;
					this.current = this.menuList[0].menu_url;
					if (this.menuList.length > 4) {
						this.leadcount = Math.ceil(this.menuList.length / 2)
					} else {
						this.leadcount = this.menuList.length
					}
					
					
					setTimeout(() => {
											this.loading = false;
								}, 800)
				
				
				} else {
					this.menuList = [];
					this.menuflag = false;
                    setTimeout(() => {
                    						this.loading = false;
                    			}, 800)
				
					

				}
			},

			getInfo(data) {
				this.leftname = uni.getStorageSync("USERNAME")
				this.leftphone = uni.getStorageSync("PHONE")
			},

			queryUserByBulletin() {
				let uid = uni.getStorageSync("USER_ID");
				queryToUserPublicCount(uid).then(res => {
					this.msgdata1 = res.toString();
					this.$forceUpdate();
				})
			},
			queryUserToRectifyNum() {
			
				let sql = 'select COUNT(id) as totalResult from tb_group_report where user_id = ' + "'" + uni.getStorageSync(
					"USER_ID") + "'" + ' and status = 0';
				selectSQL('local', sql, res => {
				
					this.scheduleDot = res[0].totalResult;
				})
			},
			subDot(data) {
				if (this.scheduleDot > 0) {
					this.scheduleDot--
				}
			},

			//获取导航栏内容高度
			getleadHeight() {
				const {
					windowWidth,
					windowHeight
				} = uni.getSystemInfoSync();
				this.$nextTick(() => {
					this.$uGetRect('#' + this.leadId).then(res => {
						this.leadheight = res.height * 2;
						this.subHeight = uni.getSystemInfoSync().windowHeight - res.height - this.scollheight * 2
						if(windowWidth>500&&windowHeight>700&&windowWidth<600){
							this.leadheight = res.height * 2-70;
							this.subHeight = uni.getSystemInfoSync().windowHeight - res.height - this.scollheight * 2-50
						}
						let data = [];
						data.push({
							leadheight: this.leadheight,
							subHeight: this.subHeight
						})
						uni.setStorageSync('leadpart', data)
					})
				});
			},
			//当前选中模块
			change(url, index) {
				this.current1 = index;				
				this.noneFlag = false;
				if(url=='/pages/index/index'||url=='/pages/standard/standard'||url=='/pages/question/question'||url=='/pages/schedule/schedule'||url=='/pages/application/application'){
					this.current = url;
				}				
				if(url=='/pages/setting/setting'){
					if(this.funId==1){
						this.current = url;
					}else{
						this.current ='forbidden';
					}
				}				
				if(url=='/pages/checktask/checktask'){
					if(this.funId==2||this.funId==3){
						this.current = url;
					}else{
						this.current ='forbidden';
					}
				}
				uni.$emit('current', {
					data: this.current
				})
			},
			//图片路径函数
			addBaseUrl(PHOTO_PATH) {
				return helper.addBaseUrl(PHOTO_PATH);
			},
		}
	}
</script>
<style lang="less" scoped>
	/deep/.u-border-top {
		border-top: 2rpx solid #f6f6f6;
	}

	/deep/.u-border-left {
		border-right: 2rpx solid #f6f6f6
	}

	/deep/.u-border-right {
		border-left: 2rpx solid #f6f6f6
	}

	/deep/.u-border-bottom {
		border-bottom: 2rpx solid #f6f6f6
	}

	/deep/.u-grid {
		background: #FFFFFF;
	}

	.emptypart {
		background: #FFFFFF;
		min-height: 100vh;
	}

	.empty1 {
		width: 100%;
		text-align: center;
		padding: 150rpx 0 60rpx;

		image {
			width: 340rpx;
			height: 340rpx;
		}

		.empty-tips {
			color: #bfbfbf;
			margin-top: 10rpx;
			font-size: 28rpx;
		}

		.contact {
			color: #bfbfbf;
			margin-top: 20rpx;
			font-size: 28rpx;

			.changing {
				color: #06C1AE;
				text-decoration: underline;
				margin-left: 10rpx;
				font-size: 28rpx;
			}
		}
	}

	.netpart {
		position: fixed;
		z-index: 999;
		right: 30rpx;

		.network {
			display: flex;
			justify-content: flex-end;
			align-items: center;

			image {
				width: 16px;
				height: 16px;
			}

			.net {
				font-size: 24rpx;
				color: #FFFFFF;
				margin-left: 5px;
			}
		}
	}

	.none {
		height: 0;
		opacity: 0;
		padding: 0;
		overflow: hidden;
		transition: all .6s linear;
	}

	.header {
		transition: all .8s linear;
	}

	.nonelead {
		visibility: hidden;
		position: absolute;
		transition: all .6s linear;
	}

	.white {
		color: #00b2a4 !important;
	}

	.lead {
		width: 100%;
		background: #4abdb4;
		padding: 15px 0;
		// transition: all .5s ease-in-out;

		.lead-part {
			width: 90%;
			margin: 0 auto;
			background: #e0f9f7;
			position: relative;
			border-radius: 20rpx;
			padding: 10rpx;
			box-shadow: 10rpx 10rpx 6rpx rgba(0, 0, 0, 0.4);
			transition: all .8s linear;
		}

		.badge-icon {
			position: absolute;
			top: 14rpx;
			right: 40rpx;
		}

		image {
			width: 60rpx;
			height: 60rpx;
		}

		.grid-text {
			font-size: 28rpx;
			margin-top: 10rpx;
			color: #333333;
		}

	}

	.oval {
		background: #c8ebe8;
		border-radius: 96%;
		width: 90%;
		margin: 0 auto;
		height: 80rpx;
		margin-top: -44rpx;

	}
</style>
