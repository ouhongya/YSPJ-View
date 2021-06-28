<template>
	<view class="login">
		<a-head :showBack="false" bgColor='#4abdb4'></a-head>
		<image class="img-a" src="@/static/bg1.png" :class="ipadW?'largeimg':''"></image>
		<view class="logintop" :class="(ipadW||smallpaid)?'largetop':''">
			<view class="title">
				验收评价
			</view>
			<view class="tips">
				<view class="center">
					<image src="../../static/airport.png" mode=""></image>
					<view class="txt">高效精益化检查</view>
				</view>
			</view>
		</view>
		<view class="content" :class="ipadW?'large':''">
			<view class="way" v-if="flag">
			<view class="name">
				<image src="../../static/user.png" mode=""></image>
				<u-input v-model="username" type="text" :border="false" placeholder="请输入登录名称" height="70" @input="replaceInput()"/>
			</view>
			<view class="phone">
				<image src="../../static/phone.png" mode=""></image>
				<u-input v-model="phone" type="number" :border="false" placeholder="请输入手机号码" height="70" maxlength="11"/>
			</view>
			<view class="codepart">
				<view class="left">
					<u-input v-model="code" type="number" :border="false" placeholder="请输入验证码" height="70" maxlength="4"/>
				</view>
				<view class="right">
					<view class="getcode" v-if="timeFlag" @click="getCode()">
						{{codetext}}
					</view>
					<view class="count" v-else>
						<u-count-down ref="uCountDown" @change="timeChange" :timestamp="timestamp" :show-days="false" :show-hours="false"
						 :show-minutes="false" color="#00b2a4"></u-count-down>秒后获取
					</view>
				</view>
			</view>
			</view>
			<view class="way" v-else>
				<view class="password">
					<image src="../../static/phone.png" mode=""></image>
					<u-input v-model="phone" type="number" :border="false" placeholder="请输入手机号码" height="70" maxlength="11"/>
				</view>
				<view class="password">
					<image src="../../static/password4.png" mode=""></image>
					<u-input v-model="password" type="password" :border="false" :password-icon="true" placeholder="请输入密码" height="70" maxlength="6" :clearable="false"/>
				</view>
			</view>
			<view class="action-part">
				<view class="loginin" @click="login()">
					登录
				</view>
			</view>
			<view class="change" @click="change()">
				<text>{{changeText}}</text>
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-text">
				<image src="../../static/copyright.png" mode="" class="copyright"></image>
				<text>成都积盛电子科技有限公司</text>
			</view>
		</view>
	</view>
</template>
<script>
	import helper from '@/common/helper.js'
	import md5 from '@/common/md5.js';
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	export default {
		data() {
			return {
				username: '', //名称
				phone: '', //电话号码
				code: '', //验证码
				codetext: '获取验证码', //验证码文字
				timeFlag: true, //倒计时状态
				timestamp: 59, //倒计时秒数
				IMEI: '', //手机标识
				hasLogin: false,
				ipadW: false,
				smallpaid:false,
				curphone:'',
				networkFlag:false,
				lock:false,
				locklogin:false,
				flag:true,
				password:'',
				changeText:'密码登录'
			}
		},
		created() {
			const {
				windowWidth,
				windowHeight,
				brand,
				model
			} = uni.getSystemInfoSync();
			let ratio = windowHeight / windowWidth;
			if (windowWidth > 600 && ratio < 1.7 && windowHeight > 600||brand=="HUAWEI"&&model=="BAH3-W59") {
				this.ipadW = true
			} else {
				this.ipadW = false
			}
			if(windowWidth>500&&windowHeight>700&&windowWidth<600){
				this.smallpaid=true
			}else{
				this.smallpaid=false
			}
					
		},
		onShow() {
			if(uni.getStorageSync("NAME")){
				this.username=uni.getStorageSync("NAME")
			}
			if(uni.getStorageSync("PHONE")){
				this.phone=uni.getStorageSync("PHONE")
			}
			let way=uni.getStorageSync("loginway")||'';
			if(way==1){
				this.flag=true;
				this.changeText='密码登录'
			}else if(way==2){
				this.flag=false;
				this.changeText='验证码登录'
			}else{
				this.flag=true;
				this.changeText='密码登录'
			}
						
			if(uni.getStorageSync("ismessage")){
				uni.removeStorageSync("ismessage");
				helper.showToast("用户信息变更，请重新登录！");
			}
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
			uni.onNetworkStatusChange(function(res) {
				if (res.isConnected) {
					uni.showToast({
						title: '网络已连接',
						icon: 'none'
					});
					_this.networkFlag = false;
				} else {
					uni.showToast({
						title: '网络已断开',
						icon: 'none'
					});
					_this.networkFlag = true;
				}
			});
		},
		watch: {
			phone(newVal, oldVal) {
				if (newVal!= this.curphone&&this.curphone!='') {
					this.timeFlag=true;
				}
			}		
		},
		methods: {
			// 登录名称
			replaceInput() {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.username;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.username = endvalue;
				},50)
			},
			change(){
				this.flag=!this.flag;
				this.username= '';
				this.code='';
				this.phone='';
				this.password='';
				if(this.flag){
					this.changeText	='密码登录'
				}else{
					this.changeText	='验证码登录'
				}				
			},
			//验证码获取
			getCode() {
				// if(this.networkFlag){
				// 	this.timeFlag=true;
				// 	helper.showToast('请先连接网络');					
				// 	return
				// }else{
				// 	helper.cache("code", '1234', 120);
				// 	this.timeFlag = false;
				// 	this.curphone=this.phone;
				// }
				// return
				if(this.lock) return;
				this.lock=true;
				if (!this.username) {
					this.lock=false;
					helper.showToast('请输入登录名称');
					return;
				}
				if (!this.phone) {
					this.lock=false;
					helper.showToast('请输入正确的手机号码');
					return;
				}
				if(!/^\d{11}$/.test(this.phone)){
					this.lock=false;
					helper.showToast('手机号码需为11位纯数字');
					return;
				}
				if(this.networkFlag){
					this.timeFlag=true;
					this.lock=false;
					helper.showToast('请先连接网络');
					return
				}
				this.curphone=this.phone;
				let param = {
					'phone': this.phone
				};
				helper.requestUrl(helper.websiteUrl + "v1/getSmsCaptcha", param, 'GET', (data) => {
					var status = data.status;
					var message = "";
					var number = data.number;
					switch (status) {
						case "100":
							message = "发送成功";
							helper.showToast(message);
							this.timeFlag = false;
							helper.cache("code", number,60);
							break;
						case "101":
							message = "验证失败";
							helper.showToast(message);
							break;
						case "102":
							message = "手机号码格式不正确";
							helper.showToast(message);
							break;
						case "103":
							message = "会员级别不够";
							helper.showToast(message);
							break;
						case "104":
							message = "内容未审核";
							helper.showToast(message);
							break;
						case "105":
							message = "内容过多";
							helper.showToast(message);
							break;
						case "106":
							message = "账户余额不足";
							helper.showToast(message);
							break;
						case "107":
							message = "Ip受限";
							helper.showToast(message);
							break;
						case "108":
							message = "手机号码发送太频繁，请换号或隔天再发";
							helper.showToast(message);
							break;
						case "109":
							message = "帐号被锁定";
							helper.showToast(message);
							break;
						case "110":
							message = "发送通道不正确";
							helper.showToast(message);
							break;
						case "111":
							message = "当前时间段禁止短信发送";
							helper.showToast(message);
							break;
						case "120":
							message = "系统升级";
							helper.showToast(message);
							break;
						case "130":
							message = "系统故障";
							helper.showToast(message);
							break;
						default:
							message = "系统故障";
							helper.showToast(message);
							break;
					}
					setTimeout(()=>{
						this.lock=false;
					},500)
				})
				
				
			},
			//倒计时
			timeChange(timestamp) {
				if (timestamp == 0) {
					this.timeFlag = true;
				}
			},

			loginUser(url) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						var roleid = "'" + res[0].role_id + "'";
						let sql = 'select menu_id from sys_menu_table where status !=1 and role_id = ' + roleid;
						let Time = new Date().getTime();
						uni.setStorageSync('TimeObj', JSON.stringify(Time)); //获取登录时间
						uni.setStorageSync('NAME', res[0].name);
						uni.setStorageSync('hasLogin', true);
						uni.setStorageSync('USER_ID', res[0].user_id);
						uni.setStorageSync('company_id', res[0].company_id);
						uni.setStorageSync('companyname', res[0].companyname);
						uni.setStorageSync('PHONE', res[0].phone);
						uni.setStorageSync('ROLE_ID', res[0].role_id);
						uni.setStorageSync('ROLE_NAME', res[0].role_name);
						uni.setStorageSync('functionid', res[0].function_id);
						uni.setStorageSync('status', res[0].status);
						this.userMenusid(sql);
					} else {
						this.locklogin=false;
						helper.showToast('登录失败，请重新登录！');
						return;
					}
				})
			},
			userMenusid(url) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						var ids = "";
						for (var value of res) {
							ids = ids + "'" + value.menu_id + "'" + ",";
						}
						ids = ids.substring(0, ids.length - 1);
						let sql = 'select menu_id,menu_name,menu_url,parent_id,menu_icon from sys_menu where menu_id in (' + ids + ')';
						this.userMenus(sql)
					} else {
						this.locklogin=false;
						helper.showToast('系统暂未给你分配功能菜单！');
						return;
					}
				})

			},

			userMenus(url) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						let sqls = 'update sys_user set isupdate = 0' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							"'" + new Date().getTime() + "'" + ' where user_id = ' + "'" + uni.getStorageSync('USER_ID') + "'"
						executeSQL("local", sqls, ress => {})
						uni.setStorageSync('menuList', res);
						if(this.flag){
							uni.setStorageSync('loginway',1);
						}else{
							uni.setStorageSync('loginway',2);
						}	
						this.locklogin=false;
						uni.redirectTo({
							url: '/pages/index/index'
						})
					} else {
						this.locklogin=false;
						console.log("登录根据菜单id查询菜单列表未查询出数据！")
						return;
					}
				})

			},
			//登录
			login() {
				if(this.locklogin) return;
				this.locklogin=true;
				if(this.flag){
				if (!this.username) {
					this.locklogin=false;
					helper.showToast('请输入登录名称');
					return;
				}
				if (!this.phone) {
					this.locklogin=false;
					helper.showToast('请输入正确的手机号码');
					return;
				}
				if(!(/^\d{11}$/.test(this.phone))){
					this.locklogin=false;
					helper.showToast('手机号码需为11位纯数字');
					return;
				}
				if(this.curphone!=this.phone){
					this.timeFlag = true;
					this.locklogin=false;
					helper.showToast('手机号已改变,请重新获取验证码');
					return;
				}
				if (!this.code) {
					this.locklogin=false;
					helper.showToast('请输入验证码');
					return;
				}				
				let number =''; 
				number=helper.cache("code",'cacheNum',60);
				if (this.code != number) {
					this.locklogin=false;
					helper.showToast('验证码错误');
					return;
				}
				let sql =
					'select user_id,password,name,role_id,status,phone,company_id from sys_user where  status = 0 and phone = ' + this
					.phone;
				selectSQL('local', sql, res => {
					if (res.length != 0) {						
						var password = "'" + this.phone.slice(5) + "'";
						var username = "'" + this.username + "'";

						let loginbyphone =
							'select u.user_id,u.password,u.name,u.role_id,u.status,u.phone,u.company_id,r.role_name,r.function_id,c.role_name as companyname from sys_user u left join sys_role r on u.role_id=r.role_id left join sys_role c on u.company_id = c.role_id  where 1=1 and u.status = 0 and u.name = ' +
							username + ' and u.phone = ' + this.phone;
						this.loginUser(loginbyphone);
					} else {
						this.locklogin=false;
						helper.showToast('您的手机:' + this.phone + '未开户，请核实管理员或拨打028-82449088 处理！');
						return;
					}

				})
				
				}else{
					if (!this.phone) {
						this.locklogin=false;
						helper.showToast('请输入正确的手机号码');
						return;
					}
					if(!(/^\d{11}$/.test(this.phone))){
						this.locklogin=false;
						helper.showToast('手机号码需为11位纯数字');
						return;
					}
					if (!this.password) {
						this.locklogin=false;
						helper.showToast('密码需为6位纯数字');
						return;
					}
					if(!(/^\d{6}$/.test(this.password))){
						this.locklogin=false;
						helper.showToast('密码需为6位纯数字');
						return;
					}
					let sql =
						'select user_id,password,name,role_id,status,phone,company_id from sys_user where  status = 0 and phone = ' + this
						.phone;
					selectSQL('local', sql, res => {
						if (res.length != 0) {
							var password = "'" + this.password + "'";
							let loginbyphone =
								'select u.user_id,u.password,u.name,u.role_id,u.status,u.phone,u.company_id,r.role_name,r.function_id,c.role_name as companyname from sys_user u left join sys_role r on u.role_id=r.role_id left join sys_role c on u.company_id = c.role_id  where 1=1 and u.status = 0 ' 
								 + ' and u.password = ' + password + ' and u.phone = ' + this.phone;
							this.loginUser(loginbyphone);
							this.locklogin=false;
						} else {
							this.locklogin=false;
							helper.showToast('您的手机:' + this.phone + '未开户，请核实管理员或拨打028-82449088 处理！');
							return;
						}
					
					})
					
					
				}
			}

		}
	}
</script>
<style lang="less" scoped>
	.login {
		width: 100%;
		min-height: 100vh;
		background: #4abdb4;
		position: relative;

		.loginbg {
			position: fixed;
			z-index: 1;
			height: 90%;
			width: 90%;
			margin: 0 5%;
			-webkit-filter: grayscale(50%);
			filter: grayscale(10%);


		}

		.large {
			width: 50% !important;
		}

		.largeimg {
			height: 80vh !important;
		}

		.largetop {
			padding-top: 0 !important;
		}

		.img-a {
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 1000;
		}

		.logintop {
			padding: 3vh 0 4vh;
			z-index: 1001;

			.title {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				color: #FFFFFF;
				font-size: 44rpx;
				text-align: center;
				font-weight: bold;
				letter-spacing: 10rpx;


			}

			.tips {
				width: 100%;
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.center {
					display: flex;
					align-items: center;
					height: 60rpx;

					image {
						height: 60rpx;
						width: 70rpx;
					}

					.txt {
						color: #F5F5F5;
						font-size: 30rpx;
						letter-spacing: 10rpx;
						margin-left: 10rpx;

					}
				}
			}
		}

		.content {
			z-index: 1001;
			width: 80%;
			margin: 0 auto;
			position: relative;
			background: #FFFFFF;
			padding: 60rpx 30rpx 30rpx 30rpx;
			border-radius: 20rpx;
			box-shadow: 0px 10rpx 10rpx rgba(0, 0, 0, 0.3);



			.name,
			.phone {
				padding: 20rpx 30rpx;
				height: 50rpx;
				line-height: 50rpx;
				display: flex;
				align-items: center;
				background: #FFFFFF;
				border-radius: 60rpx;
				margin-bottom: 50rpx;
				border: 1px solid #E4E7ED;

				image {
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}
			.password{
				padding: 20rpx 30rpx;
				height: 50rpx;
				line-height: 50rpx;
				display: flex;
				align-items: center;
				background: #FFFFFF;
				border-radius: 60rpx;
				margin-bottom: 50rpx;
				border: 1px solid #E4E7ED;
				
				image {
					width: 50rpx;
					height: 50rpx;
					margin-right: 20rpx;
				}
			}
			.change{
				padding: 30rpx 0 0 10rpx;
				text{
					color: #4abdb4;
					font-size:30rpx;
					text-decoration: underline;
				}
			}

			.codepart {
				display: flex;
				margin-bottom: 60rpx;

				.left {
					width: 55%;
					margin-right: 5%;
					background: #FFFFFF;
					border-radius: 60rpx;
					height: 50rpx;
					line-height: 50rpx;
					padding: 20rpx 30rpx;
					display: flex;
					align-items: center;
					border: 1px solid #E4E7ED;
				}

				.right {
					background: #FFFFFF;
					width: 40%;
					text-align: center;
					border-radius: 60rpx;
					font-size: 30rpx;
					border: 1px solid #E4E7ED;
					height: 50rpx;
					line-height: 50rpx;
					padding: 20rpx 0;

					.getcode {
						color: #4abdb4;
						border-radius: 60rpx;

					}

					.count {
						color: #999999;
						border-radius: 60rpx;
					}
				}
			}

			.action-part {

				.loginin {
					width: 100%;
					color: #FFFFFF;
					line-height: 100rpx;
					height: 100rpx;
					font-size: 36rpx;
					// border: 2rpx solid #FFFFFF;
					box-shadow: 0px 10rpx 10rpx rgba(0, 0, 0, 0.3);
					text-align: center;
					border-radius: 60rpx;
					letter-spacing: 10rpx;
					// background: #4abdb4;
					background: linear-gradient(180deg, #8cdcd6 0%, #00b2a4 90%);
				}
			}

		}

		.bottom {
			position: fixed;
			bottom: 20rpx;
			color: #FFFFFF;
			width: 100%;
			text-align: center;
			z-index: 99;

			.bottom-text {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 60rpx;
				line-height: 60rpx;

				text {
					font-size: 30rpx;
				}

				.copyright {
					width: 26rpx;
					height: 26rpx;
					margin-right: 4rpx;
				}
			}
		}
	}
</style>

