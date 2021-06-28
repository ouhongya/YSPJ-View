<script>
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	import helper from '@/common/helper.js';
	import {
		uploadImage
	} from '@/api/imageUpload.js';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			const {
				windowWidth,
				windowHeight,
				pixelRatio,
				brand,
				model
			} = uni.getSystemInfoSync();
			let ratio = windowHeight / windowWidth;
			if (windowWidth > 600 && ratio < 1.7 && windowHeight > 600||brand=="HUAWEI"&&model=="BAH3-W59") {
				// #ifdef APP-PLUS
				plus.screen.lockOrientation('landscape-primary');
				// #endif
			} else {
				// #ifdef APP-PLUS
				plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
				// #endif
			}
		},
		onShow: function() {
			console.log('App Show')
			this.isOpenDB(); //判断数据库是否打开，没有打开则打开
			this.userchange()//查询用户变更	
		},
		onHide: function() {
			console.log('App Hide')
		},
		onUnload: function() {
			console.log('App Unload')
			//关闭数据库
			closeComDB('local', '_doc/local.db', res => {
				console.log("关闭数据库");
			})
			uni.$off('ipadW')
		},
		methods: {
			//查询用户变更	
			userchange() {
				var interval = setInterval(() => {
						let sql =
							'select user_id,password,name,role_id,status,phone,company_id,isupdate from sys_user where user_id = ' +
							"'" + uni.getStorageSync('USER_ID') + "'";
						selectSQL('local', sql, res => {
							if (res.length != 0) {
								if (res[0].isupdate == 1||res[0].status == 1) {
									uni.clearStorage();
									uni.clearStorageSync();
									uni.setStorageSync("ismessage", true)
									clearInterval(interval); 
									uni.reLaunch({
										url: '/pages/login/login'
									});									  
								}							
							}
						})
					}, 10000)
			},

			//打开数据库
			isOpenDB() {
				var isOpen = plus.sqlite.isOpenDatabase({
					name: 'local',
					path: '_doc/local.db'
				});
				if (!isOpen) {
					this.openDB()
				}
			},
			openDB() {
				openComDB('local', '_doc/local.db', res => {
					console.log("打开数据库");
				})
			},
			getPhoneHeight() {
				let that = this;
				var Height = '1';
				uni.getSystemInfo({
					success: function(res) {
						Height = res.statusBarHeight
					}
				})
				return Height
			}




		}
	}
</script>

<style lang="less">
	page {
		background: #F8F8F8;
		min-height: 100vh;
	}

	// 时间展示
	/deep/.u-calendar__action {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/deep/.emptytips {
		color: #999999;
		padding-top: 15px;
		padding-left: 15px;
	}

	/deep/.u-input {
		align-items: center;
	}

	/deep/.u-td {
		word-wrap: break-word;
		word-break: break-all;
	}
</style>
