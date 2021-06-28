<template>
	<view class="main">
		<a-head text="新增试题" bgColor="#4abdb4"></a-head>
		<view class="top" :style="{ top: phoneHeight + 10 + 'px' }">
			<l-file ref="lFile" @up-success="onSuccess"></l-file>
			<view  class="right" @click="onUpload()">批量导入</view>
		</view>
		<swiper class="swiper" :current="currentIndex" duration="300" @change="swiperChange">
			<swiper-item v-for="(item, index) in examlist" :key="index">
				<scroll-view scroll-y="true" class="swiper">
					<view class="tips">
						<view class="part">
							当前录入：
							<text>{{ index + 1 }}</text>
							/
							<text>{{ examlist.length }}</text>
							题
						</view>
						<view class="part" v-if="examlist.length > 1">
							<u-button :plain="true" size="mini" type="error" @click="del(index)">删除此题</u-button>
						</view>
					</view>
					<view class="content">
						<u-form ref="uForm" :label-style="labelStyle" label-width="160">
							<view class="range">
								<u-cell-group>
									<u-cell-item title="所属题库" :title-style="labelStyle" :arrow="true"
										arrow-direction="right" :value="item.belong" @click="toBelong(index)">
									</u-cell-item>
								</u-cell-group>
							</view>
							<u-form-item label="题目类型" class="form">
								<u-radio-group v-model="item.typename" @change="radioGroupChange($event, index)"
									active-color="#4abdb4">
									<u-radio v-for="(k, index4) in typeList" :key="index4" :name="k.name"
										:disabled="k.disabled">{{ k.name }}</u-radio>
								</u-radio-group>
							</u-form-item>
							<view class="rangetitle">
								<u-input v-model="item.title" :border="true" placeholder="请输入题目标题" type="textarea"
									:auto-height="true" />
							</view>
							<view class="range" v-if="item.type != 3">
								<view class="list" v-for="(i, index1) in item.optionList" :key="index1">
									<view class="option">{{ i.optionId }}</view>
									<u-input v-model="i.content" :border="true" type="textarea" :auto-height="true"
										height="60" />
								</view>
								<view class="addcount">
									<u-icon @click="addoption(index)" name="plus" color="#6ecac3" size="44"
										class="personicon"></u-icon>
									<u-icon @click="deloption(index)" name="minus" color="#fa3534" size="40"
										class="personicon"></u-icon>
								</view>
							</view>
							<u-form-item label="正确答案">
								<!-- 单选 -->
								<view class="" v-if="item.type == 1">
									<u-radio-group v-model="item.answer" active-color="#4abdb4"
										@change="singleGroupChange($event, index)">
										<u-radio v-for="(j, index3) in item.singleList" :key="index3" :name="j.name"
											:disabled="j.disabled">{{ j.name }}</u-radio>
									</u-radio-group>
								</view>
								<!-- 多选 -->
								<view class="" v-if="item.type == 2">
									<u-checkbox-group @change="checkboxGroupChange($event, index)"
										active-color="#4abdb4">
										<u-checkbox v-model="j.checked" v-for="(j, index3) in item.checkboxList"
											:key="index3" :name="j.name">{{ j.name }}</u-checkbox>
									</u-checkbox-group>
								</view>
								<view class="" v-if="item.type == 3">
									<u-radio-group v-model="item.answer" active-color="#4abdb4"
										@change="judgeGroupChange($event, index)">
										<u-radio v-for="(j, index3) in item.judgeList" :key="index3" :name="j.name"
											:disabled="j.disabled">{{ j.name }}</u-radio>
									</u-radio-group>
								</view>
							</u-form-item>
						</u-form>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="action-bottom">
			<view class="action">
				<view class="cancel" @click="cancel()">取消</view>
				<view class="preview" @click="multiple()">再录一题</view>
				<view class="submit" @click="save()">保存</view>
			</view>
		</view>
		<!-- 所属题库选择 -->
		<u-select v-model="belongShow" mode="single-column" :default-value="showbelongIndex" :list="showbelongList"
			@confirm="belongconfirm" confirm-color="#1fac9c"></u-select>
		<!-- 批量录入 -->
		<u-popup v-model="batchShow" mode="bottom" width="40%" height="80%" @close="batchclose">
			<view class="Model">
				<view class="toptitle">所属题库</view>
				<view class="collapsePart">
					<view class="u-collapse-item">
						<view class="u-collapse-body">
							<view class="u-collapse-content">
								<scroll-view scroll-y class="scroll-part">
									<u-radio-group v-model="batch" active-color="#4abdb4"
										@change="batchGroupChange($event)" :wrap="true">
										<u-radio v-for="(item, index) in belongList" :key="index" :name="item.name"
											:disabled="item.disabled" class="belong">
											{{ item.name }}
										</u-radio>
									</u-radio-group>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
				<view class="roleAction">
					<view class="cancel" @click="batchclose()">取消录入</view>
					<view class="sure" @click="batchsure()">开始录入</view>
				</view>
			</view>
		</u-popup>
		<!-- 删除提示 -->
		<u-modal v-model="delShow" @confirm="delConfirm()" :async-close="true" :show-cancel-button="true"
			:confirm-style="{ color: '#fa3534' }" :show-title="false" content="您确认要删除吗？"></u-modal>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>
<script>
	import {
		queryQuestionBankListNotLimit,
		addOneTopic,
		editOneTopic
	} from '@/api/exam/testbase.js';
	import helper from '@/common/helper.js';
	import lFile from '@/components/l-file/l-file.vue';
	export default {
		data() {
			return {
				examName: null,
				loading: false,
				phoneHeight: 20,
				currentIndex: 0,
				belongIndex: 0,
				belongShow: false,
				belong: '默认题库',
				showbelongIndex: [0],
				showbelongList: [{
						value: 1,
						label: '默认题库'
					},
					{
						value: 2,
						label: 'xxx分类'
					},
					{
						value: 3,
						label: 'xxx分类1'
					}
				],
				belongList: [{
						id: 1,
						disabled: false,
						name: '默认题库'
					},
					{
						id: 2,
						disabled: false,
						name: 'xxx分类'
					},
					{
						id: 3,
						disabled: false,
						name: 'xxx分类1'
					}
				],
				valuerang: '默认分类',
				labelStyle: {
					fontSize: '30rpx',
					color: '#333333'
				},
				typeList: [{
						name: '单选',
						disabled: false
					},
					{
						name: '多选',
						disabled: false
					},
					{
						name: '判断',
						disabled: false
					}
				],
				examlist: [{
					type: 1,
					typename: '单选',
					title: '',
					answer: '',
					belong: '默认题库',
					checkboxList: [{
							name: 'A',
							checked: false,
							disabled: false
						},
						{
							name: 'B',
							checked: false,
							disabled: false
						},
						{
							name: 'C',
							checked: false,
							disabled: false
						},

						{
							name: 'D',
							checked: false,
							disabled: false
						}
					],

					singleList: [{
							name: 'A',
							disabled: false
						},
						{
							name: 'B',
							disabled: false
						},
						{
							name: 'C',
							disabled: false
						},

						{
							name: 'D',
							disabled: false
						}
					],
					judgeList: [{
							name: '正确',
							disabled: false
						},
						{
							name: '错误',
							disabled: false
						}
					],
					optionList: [{
							optionId: 'A',
							content: ''
						},
						{
							optionId: 'B',
							content: ''
						},
						{
							optionId: 'C',
							content: ''
						},
						{
							optionId: 'D',
							content: ''
						}
					]
				}],
				multlock: false,
				batch: '',
				batchShow: false,
				delShow: false,
				delIndex: 0,
				savelock:false
			};
		},
		created() {
			queryQuestionBankListNotLimit().then(res => {
				res.forEach(item => {
					if (item.is_default == 1) {
						this.examlist[0].belong = item.name;
						this.examName = item.name;
					}
					item.label = item.name;
					item.value = item.id;
				});
				this.showbelongList = res;
			});
			this.loading = true;
			uni.getSystemInfo({
				success: function(res) {
					this.phoneHeight = res.statusBarHeight || '20';
				}
			});
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 200);
		},
		methods: {
			onUpload() {
				let uid = uni.getStorageSync('USER_ID');
				let functionid = uni.getStorageSync('functionid');
				let company_id = uni.getStorageSync('company_id');
				let _this = this;
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					currentWebview: _this.$mp.page.$getAppWebview(),
					// #endif
					url: helper.websiteUrl + 'v1/addBatckTopic',
					name: 'file',
					header: {},
					data: {
						uid: uid,
						functionid: functionid,
						flag: 4,
						company_id: _this.showbelongList
					}
				});
			},
			onSuccess(res) {
				let data = JSON.stringify(res);
				uni.navigateTo({
					url: './testbase?id=' + res.data.id + '&type=2'
				});
			},
			// 批量录入
			tobatch() {
				this.batchShow = true;
			},
			batchGroupChange(e) {
				this.batch = e;
			},
			batchsure() {
				console.log('批量录入');
			},
			batchclose() {
				this.batch = '';
				this.batchShow = false;
			},
			//类型选择
			radioGroupChange(e, index) {
				if (e == '单选') {
					this.examlist[index].type = 1;
					this.examlist[index].typename = '单选';
				} else if (e == '多选') {
					this.examlist[index].type = 2;
					this.examlist[index].typename = '多选';
				} else if (e == '判断') {
					this.examlist[index].type = 3;
					this.examlist[index].typename = '判断';
					this.examlist[index].optionList.map(item => {
						item.content = '';
					});
				}
				this.examlist[index].answer = '';
				this.examlist[index].checkboxList.map(val => {
					val.checked = false;
				});
			},
			//多选答案
			checkboxGroupChange(e, index) {
				let str = JSON.stringify(e);
				let answer = '';

				e.map(item => {
					if (str.indexOf(item) != -1) {
						answer += item;
					}
				});
				this.examlist[index].answer = answer;
			},
			//单选答案
			singleGroupChange(e, index) {
				this.examlist[index].answer = e;
			},
			//判断答案
			judgeGroupChange(e, index) {
				this.examlist[index].answer = e;
			},
			//选择题库
			toBelong(index) {
				this.belongIndex = index;
				this.showbelongList.map((item, index1) => {
					if (item.label == this.examlist[this.belongIndex].belong) {
						this.showbelongIndex = [index1];
					}
				});
				this.belongShow = true;
			},
			belongconfirm(e) {
				this.examlist[this.belongIndex].belong = e[0].label;
				this.belongShow = false;
			},
			//选项加
			addoption(index) {
				let i = this.examlist[index].optionList.length;
				let option = String.fromCharCode(65 + i);
				if (i < 10) {
					this.examlist[index].optionList.push({
						optionId: option,
						content: ''
					});
					this.examlist[index].singleList.push({
						name: option,
						disabled: false
					});
					this.examlist[index].checkboxList.push({
						name: option,
						checked: false,
						disabled: false
					});
				} else {
					this.$refs.uToast.show({
						title: '至多输入十个选项',
						type: 'warning'
					});
				}
			},
			// 选项减
			deloption(index) {
				if (this.examlist[index].optionList.length > 3) {
					this.examlist[index].optionList.pop();
					this.examlist[index].singleList.pop();
					this.examlist[index].checkboxList.pop();
				} else {
					this.$refs.uToast.show({
						title: '至少输入三个选项',
						type: 'warning'
					});
				}
			},
			//删除此题
			del(index) {
				this.delIndex = index;
				this.delShow = true;
			},
			delConfirm() {
				this.examlist.splice(this.delIndex, 1);
				this.currentIndex = this.delIndex - 1;
				this.delShow = false;
			},
			// 轮播切换
			swiperChange(e) {
				this.currentIndex = e.detail.current
			},
			// 判断重复
			isRepeat(arr) {
				var hash = {};
				for (var i in arr) {
					if (hash[arr[i]]) {
						return true;
					}
					hash[arr[i]] = true;
				}
				return false;
			},
			
			// 取消
			cancel() {
				uni.navigateBack({
					delta: 1
				});
			},
			//再录一题
			multiple() {
				if (this.multlock) return;
				this.multlock = true;
				let len = 0;
				let lent = 0;
				let lena = 0;
				let arr = [];
				let isRepeat = false;
				this.examlist.map((item, index) => {
					if (item.title == '') {
						lent++;
					}
					if (item.answer == '') {
						lena++;
					}
					item.optionList.map(i => {
						if (i.content == '') {
							len++;
						}
					})
				})
				this.examlist[this.currentIndex].optionList.map(i => {
					arr.push(i.content)
				})
				
				if (lent > 0) {
					this.$refs.uToast.show({
						title: '题目标题不能为空',
						type: 'warning'
					});
					this.multlock = false
					return;
				}

				if (len > 0) {
					this.$refs.uToast.show({
						title: '选项内容不能为空',
						type: 'warning'
					});
					this.multlock = false
					return;
				}
				isRepeat = this.isRepeat(arr)
				if (isRepeat) {
					this.$refs.uToast.show({
						title: '选项内容不能重复',
						type: 'warning'
					});
					this.multlock = false
					return;
				}
				if (lena > 0) {
					this.$refs.uToast.show({
						title: '请选择题目答案',
						type: 'warning'
					});
					this.multlock = false
					return;
				}
				let list = [{
					type: 1,
					typename: '单选',
					title: '',
					answer: '',
					belong: this.examName,
					checkboxList: [{
							name: 'A',
							checked: false,
							disabled: false
						},
						{
							name: 'B',
							checked: false,
							disabled: false
						},
						{
							name: 'C',
							checked: false,
							disabled: false
						},

						{
							name: 'D',
							checked: false,
							disabled: false
						}
					],

					singleList: [{
							name: 'A',
							disabled: false
						},
						{
							name: 'B',
							disabled: false
						},
						{
							name: 'C',
							disabled: false
						},

						{
							name: 'D',
							disabled: false
						}
					],
					judgeList: [{
							name: '正确',
							disabled: false
						},
						{
							name: '错误',
							disabled: false
						}
					],
					optionList: [{
							optionId: 'A',
							content: ''
						},
						{
							optionId: 'B',
							content: ''
						},
						{
							optionId: 'C',
							content: ''
						},
						{
							optionId: 'D',
							content: ''
						}
					]
				}];
				this.examlist = this.examlist.concat(list);

				setTimeout(() => {
					this.currentIndex = this.examlist.length - 1;
					this.multlock = false;
				}, 300);
			},
			// 保存
			save() {
				if (this.savelock) return;
				this.savelock = true;
				let len = 0;
				let lent = 0;
				let lena = 0;
				let arr = [];
				let isRepeat = false;
				this.examlist.map((item, index) => {
					if (item.title == '') {
						lent++;
					}
					if (item.answer == '') {
						lena++;
					}
					item.optionList.map(i => {
						if (i.content == '') {
							len++;
						}
					})
				})
				this.examlist[this.currentIndex].optionList.map(i => {
					arr.push(i.content)
				})
				
				if (lent > 0) {
					this.$refs.uToast.show({
						title: '题目标题不能为空',
						type: 'warning'
					});
					this.savelock = false
					return;
				}
				
				
				if (len > 0) {
					this.$refs.uToast.show({
						title: '选项内容不能为空',
						type: 'warning'
					});
					this.savelock = false
					return;
				}
				isRepeat = this.isRepeat(arr)
				if (isRepeat) {
					this.$refs.uToast.show({
						title: '选项内容不能重复',
						type: 'warning'
					});
					this.savelock = false
					return;
				}
				if (lena > 0) {
					this.$refs.uToast.show({
						title: '请选择题目答案',
						type: 'warning'
					});
					this.savelock = false
					return;
				}
				//组装数据
				let data = [];
				let stemData = [];
				this.examlist.forEach(item => {
					let obj = {};
					this.showbelongList.forEach(entry => {
						if (item.belong == entry.label) {
							obj.exam_category_id = entry.value;
						}
					});
					let exam_batch_id = this.uuid();
					obj.id = exam_batch_id;
					obj.stem = item.title;
					obj.type = item.type;
					obj.exam_batch_id = 0;
					obj.status = 0;
					obj.user_id = uni.getStorageSync('USER_ID');
					obj.created_time = new Date();
					obj.last_update_time = new Date();
					data.push(obj);
					//隔开答案
					let answer = item.answer.split('');
					if (item.type != 3) {
						item.optionList.forEach(entry => {
							let stemObj = {};
							stemObj.id = this.uuid();
							stemObj.exam_topic = exam_batch_id;
							stemObj.forder = entry.optionId;
							stemObj.type = answer.indexOf(entry.optionId) != -1 ? 0 : 1;
							stemObj.content = entry.content;
							stemData.push(stemObj);
						});
					} else {
						item.optionList.forEach((entry, index) => {
							if (index < 2) {
								let stemObj = {};
								stemObj.id = this.uuid();
								stemObj.exam_topic = exam_batch_id;
								stemObj.forder = entry.optionId;
								if (index == 0) {
									item.answer == '正确' ? (stemObj.type = 0) : (stemObj.type = 1);
								} else {
									item.answer == '错误' ? (stemObj.type = 0) : (stemObj.type = 1);
								}
								stemObj.content = entry.optionId == 'A' ? '正确' : '错误';
								stemData.push(stemObj);
							}
						});
					}
				});
				let ids = [];
				data.forEach(item => {
					ids.push(item.exam_category_id);
				});
				addOneTopic(data, stemData).then(res => {
					if (res == 'SUCCESS') {
						uni.navigateTo({
							url: './testbase?id=' + ids + '&type=1'
						});
					} else {
						this.$refs.uToast.show({
							title: res.substring(0, res.length - 1) + '题,题干重复,请重新编辑',
							type: 'warning'
						});
					}
				});
				setTimeout(() => {
					this.savelock = false;
				}, 300);
			},
			//uuid生成
			uuid() {
				return this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4() + this.S4();
			},
			S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}
		}
	};
</script>

<style lang="less" scoped>
	/deep/.u-cell {
		padding: 10px 0;
		line-height: 23px;
	}

	/deep/.u-radio {
		line-height: inherit;
	}

	page {
		background: #ffffff;
		min-height: 100vh;
	}

	.swiper {
		height: calc(100vh - 120px);
		padding-bottom: 20rpx;
	}

	.main {
		background: #ffffff;
		min-height: 100vh;
	}

	.tips {
		color: #666666;
		// text-align: center;
		font-size: 28rpx;
		padding: 20rpx 20rpx 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		text {
			margin: 0 6rpx;
			color: #4abdb4;
		}
	}

	.top {
		display: flex;
		justify-content: flex-end;
		right: 0;
		position: absolute;
		z-index: 999;
		align-items: center;
		padding: 0 30rpx;
		height: 44px;
		line-height: 44px;
		flex-direction: column;
		top: 0;

		.right {
			font-size: 30rpx;
			color: #ffffff;
		}
	}

	.content {
		padding: 30rpx;

		.form {
			margin-bottom: 30rpx;
			border-bottom: 1px solid #eeeeee;
		}

		.range {
			width: 100%;
			border-bottom: 1px solid #eeeeee;

			.list {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 20rpx;

				.option {
					padding-right: 20rpx;
				}
			}
		}

		.rangetitle {
			width: 100%;
			margin-bottom: 40rpx;
		}

		.submit {
			width: 90%;
		}

		.addcount {
			display: flex;
			align-items: center;
			width: 300rpx;
			margin: 20rpx auto;

			.personicon {
				margin: 0 50rpx;
			}
		}
	}

	.action-bottom {
		width: 100%;
		bottom: 0;
		position: fixed;
		background: #ffffff;
		padding: 20rpx 0;
		border-top: 1px solid #eeeeee;

		.action {
			display: flex;
			justify-content: space-between;
			text-align: center;
			color: #ffffff;
			font-size: 32rpx;
			height: 70rpx;
			line-height: 70rpx;
			align-items: center;
			padding: 0 30rpx;

			.cancel {
				width: 30%;
				border: 2rpx solid #e4e7ed;
				color: #999999;
				background: #ffffff;
				border-radius: 14rpx;
			}

			.preview {
				width: 30%;
				border: 2rpx solid #ffb64a;
				color: #ffffff;
				background: #ffb64a;
				border-radius: 14rpx;
			}

			.submit {
				width: 30%;
				background: #00b2a4;
				border: 2rpx solid #00b2a4;
				border-radius: 14rpx;
			}
		}
	}

	.Model {
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

		.collapsePart {
			padding: 100rpx 0;
			background: #ffffff;
			width: 100%;
			position: relative;

			.u-collapse-head {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				line-height: 1;
				padding: 10rpx 20rpx 10rpx 6rpx;
				text-align: left;
				padding-left: 60rpx;
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
				font-size: 26rpx;
				color: #666;
				text-align: left;
				padding-left: 30rpx;
				width: 100%;

				.scroll-part {
					height: 50vh;
					padding-top: 30rpx;

					.belong {
						margin-bottom: 30rpx;
					}
				}
			}
		}
	}
</style>
