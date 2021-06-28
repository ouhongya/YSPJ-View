<template>
	<view class="newpublic">
		<a-head bgColor='#4abdb4' text="新增公告"></a-head>
		<view class="content">
			<u-form :model="form" ref="uForm" label-position='top'>
				<u-form-item label="公告标题" prop="name" class="form">
					<u-input v-model="form.name" :border="true" placeholder="请输入公告标题(1-20字)" />
				</u-form-item>
				<u-form-item label="公告内容" prop="intro" class="form">
					<u-input v-model="form.intro" :border="true" type="textarea" height="200" :auto-height="true" placeholder="请输入公告内容(1-200字)" />
				</u-form-item>
			</u-form>
			<view class="range">
				<u-cell-group>
					<u-cell-item title="通知范围" :arrow="false" arrow-direction="right" :value="valuerang"></u-cell-item>
				</u-cell-group>
			</view>
			<view class="submit" @click="submit">
				发布
			</view>
		</view>

		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'
	import {
		queryPublicRange,
		savePublic
	} from '@/api/public.js'
	export default {
		data() {
			return {
				valuerang: '全部', //下发范围
				form: {
					name: '',
					intro: '',
				},
				rules: {
					name: [{
						required: true,
						min: 1,
						max: 20,
						message: '公告标题字数范围区间为1-30字',
						trigger: 'blur',
					}],
					intro: [{
						required: true,
						min: 1,
						max: 200,
						message: '公告内容字数范围区间为1-200字',
						trigger: 'blur'
					}]
				},
				uid: null,
				loading: false,
				lock:true,
				range:null
			};
		},
		onShow() {
			this.lock=true;
			this.queryPublicRange();
		},
		created() {
			this.loading = true;
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500)
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad(options) {
			this.valuerang = options.parameter || '全部';
		},
		methods: {
			submit() {
				if(this.lock){
					this.lock=false;
					this.$refs.uForm.validate(valid => {
						if (valid) {
							this.uid = uni.getStorageSync("USER_ID")
							let param = {
								title: this.form.name,
								content: this.form.intro,
								uid: this.uid
							};
							savePublic(param).then(res=>{
								this.jump();	
							})
							helper.request(helper.websiteUrl + 'v1/addBulletin', param, 'POST', true, res => {
								this.jump();					
							})
						} else {
							console.log('验证失败');
						}
					});
				}
				
			},
			jump() {
				uni.setStorageSync("publicflag", true);
				uni.setStorageSync("ggflag", true);
				this.lock=true;
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 查询通知范围
			 * @param {Object} uid
			 */
			queryPublicRange(){
				let uid = uni.getStorageSync("USER_ID")
				queryPublicRange(uid).then(res=>{
					/**
					 * 数据结构
					 * [{
						 role_id:123,
						 role_name:角色名,
						 child:[{
							 user_id:123,
							 name:用户名
						 }]
					 }]
					 */
					this.range=res
				})
			}
		},
	};
</script>

<style lang="less" scoped>
	.newpublic {
		background: #f6f6f6;
		min-height: 100vh;

		.content {

			.form {
				background: #FFFFFF;
				padding: 10rpx 30rpx 30rpx 30rpx;
				margin-bottom: 20rpx;
			}

			.range {
				margin: 20rpx 0;
			}

			.submit {
				width: 90%;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 36rpx;
				color: #FFFFFF;
				background: #00b2a4;
				text-align: center;
				position: fixed;
				bottom: 30rpx;
				box-shadow: 0px 10rpx 10rpx rgba(0, 0, 0, 0.3);
				border-radius: 50rpx;
				margin-left: 5%;
			}
		}
	}
</style>
