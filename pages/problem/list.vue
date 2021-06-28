<template>
	<view class="problemList">
		<a-head :text="headTitle" bgColor="#4abdb4"></a-head>
		<view class="scorll-content">
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view class="top">
					<view class="scorll-th">
						<view class="srorll-title">项目序号</view>
					</view>
					<view class="scorll-th">
						<view class="srorll-title">问题性质</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">检查单位</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">评判项目</view>
					</view>
					<view class="scorll-th">
						<view class="srorll-title">检查模块</view>
					</view>
					<view class="scorll-th">
						<view class="srorll-title">负责人</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">评分项</view>
					</view>
					<view class="scorll-th">
						<view class="srorll-title">评分</view>
					</view>
					<view class="scorll-th pic">
						<view class="srorll-title">问题图片</view>
					</view>
					<view class="scorll-th detail">
						<view class="srorll-title">问题备注</view>
					</view>
					<view class="scorll-th detail" v-if="isFlag && tasktype == 2">
						<view class="srorll-title">整改要求</view>
					</view>
					<view class="scorll-th pic" v-if="isFlag && tasktype == 2">
						<view class="srorll-title">整改图片</view>
					</view>
					<view class="scorll-th detail" v-if="isFlag && tasktype == 2">
						<view class="srorll-title">整改备注</view>
					</view>
					<view class="scorll-th" v-if="isFlag && tasktype == 2">
						<view class="srorll-title">整改时间</view>
					</view>
				</view>
				<view v-for="(i, index1) in tableList" :key="index1" class="tableheight">
					<view class="scorll-th">
						<view class="scorll-td">
							<view class="content">
								<view class="input">
									{{ i.serial?i.serial:'暂无' }}
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th">
						<view class="scorll-td">
							<view class="content">
								<view v-if="i.status == 0">一般</view>
								<view v-if="i.status == 1">严重</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td detail">
							<view class="content">{{ i.unit_name?i.unit_name:'暂无' }}</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">{{ i.ritem?i.ritem:'暂无' }}</view>
						</view>
					</view>
					<view class="scorll-th">
						<view class="scorll-td">
							<view class="content">{{ i.citem?i.citem:'暂无' }}</view>
						</view>
					</view>
					<view class="scorll-th">
						<view class="scorll-td">
							<view class="content">{{ i.grouper?i.grouper:'暂无' }}</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content">{{ i.questioncontent?i.questioncontent:'暂无' }}</view>
						</view>
					</view>
					<view class="scorll-th">
						<view class="scorll-td">
							<view class="content" v-if="i.scoretype == 0 && i.questionscore > 0">
							+{{ i.questionscore?i.questionscore:'暂无' }}
							</view>
							<view class="content red" v-if="i.scoretype == 1 && i.questionscore > 0">
							-{{ i.questionscore?i.questionscore:'暂无' }}
							</view>
							<view class="content" v-if="i.scoretype == 1 && i.questionscore == 0">
							{{ i.questionscore?i.questionscore:'暂无' }}
							</view>
							<view class="content" v-if="i.scoretype == 0 && i.questionscore == 0">
							{{ i.questionscore?i.questionscore:'暂无' }}
							</view>
						</view>
					</view>
					<view class="scorll-th pic">
						<view class="scorll-td">
							<view class="content">
								<view class="imgpart" v-if="i.filequestion.length!=0">
									<u-swiper :list="i.filequestion" @click="previewImage(i.filequestion)"></u-swiper>
								</view>
								<view class="imgpart" v-else>
									<view class="empty-tips">暂无图片</view>
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail">
						<view class="scorll-td">
							<view class="content" v-if="i.questionremark">{{ i.questionremark }}</view>
							<view class="content" v-else><view class="empty-tips">暂无备注</view></view>
						</view>
					</view>

					<view class="scorll-th detail" v-if="isFlag && tasktype == 2">
						<view class="scorll-td">
							<view class="content">{{ i.solveask ?i.solveask:'暂无'}}</view>
						</view>
					</view>
					<view class="scorll-th pic" v-if="isFlag && tasktype == 2">
						<view class="scorll-td">
							<view class="content">
								<view class="imgpart" v-if="i.filecorrect.length!=0">
									<u-swiper :list="i.filecorrect" @click="previewImage(i.filecorrect)"></u-swiper>
								</view>
								<view class="imgpart" v-else>
									<view class="empty-tips">暂无图片</view>
								</view>
							</view>
						</view>
					</view>
					<view class="scorll-th detail" v-if="isFlag  && tasktype == 2">
						<view class="scorll-td">
							<view class="content" v-if="i.correctremark">{{ i.correctremark }}</view>
							<view class="content" v-else><view class="empty-tips">暂无备注</view></view>
						</view>
					</view>
					<view class="scorll-th" v-if="isFlag && tasktype == 2">
						<view class="scorll-td">
							<view class="content">
							{{ i.correcttime?$u.timeFormat(i.correcttime, 'yyyy-mm-dd hh:MM:ss'):'暂无' }}
							</view>
						</view>
					</view>

				</view>
			</scroll-view>

		</view>
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>

<script>
	import helper from '@/common/helper.js';
	export default {
		data() {
			return {
				loading: false,
				headTitle: '问题明细',
				tasktype:"",
				action: 'http://192.168.1.204:8888/api/v1/uploadImage',
				tableList: [{
						id: '45'
					},
					{

						id: '5646'
					}
				],
				data: [],
				id: '',
				group_id: '',
				isFlag: true,
				functionId: null
			};
		},
		onLoad(options) {
			if (options.param) {
				let param = JSON.parse(options.param);
				this.headTitle = param[0].task_name + '明细';
				this.tasktype = param[0].tasktype;
				param.forEach(item => {
					var list = item.questionpicture.split(",").filter(it => it != "");
					item.filequestion = [];
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
						item.filequestion.push(img)
					})
					var list1 = item.correctpicture.split(",").filter(it1 => it1 != "");
					item.filecorrect = [];
					list1.forEach(ilist1 => {
						var img1 = {
							url: ilist1,
							progress: 0,
							image: ilist1,
							title: ilist1.split("/")[2].split(".")[0],
							name: ilist1.split("/")[2].split(".")[0],
							url: ilist1,
							type: 1,
							id: ilist1.split("/")[2].split(".")[0],
							error: false
						}
						item.filecorrect.push(img1)
					})
				
				})
				this.tableList = param
			} else {
				this.headTitle = '问题明细';
			}
		},
		created() {
			this.functionId = uni.getStorageSync('functionid');
			this.loading = true;
			this.questionsTaskList(this.id, this.group_id);
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 500);
		},
		methods: {
			//预览图片
			previewImage(fileList) {
				let list = [];
				fileList.map(i => {
					list.push(i.image);
				});
				let current = list[0];
				uni.previewImage({
					current: current, // 当前显示图片的http链接
					urls: list // 需要预览的图片http链接列表
				});
			},
			//拉去数据
			questionsTaskList(taskId, userId) {
				let obj = {
					uid: uni.getStorageInfoSync('USER_ID'),
					taskId: taskId,
					userId: userId
				};
				helper.request(helper.websiteUrl + 'v1/questionsTaskOne', obj, 'POST', true, res => {
					if (res.length && res) {
						this.pages = parseInt(res[0].total);
						let array = [];
						let arr = [];
						res.forEach(item => {
							let obj1 = {};
							item.issueList = item.issueList.reduce((item1, next) => {
								if (!obj1[next.issueContent]) {
									item1.push(next);
									obj1[next.issueContent] = true;
								}
								return item1;
							}, []);
							item.issueList.forEach(key => {
								let img1 = [];
								let img2 = [];
								key.issueImage.forEach(val => {
									if (val.type == 1) {
										img1.push({
											title: val.name,
											image: helper.addBaseUrl(val.url),
											id: val.id
										});
									} else {
										this.isFlag = true;
										img2.push({
											title: val.name,
											image: helper.addBaseUrl(val.url),
											id: val.id
										});
									}
								});
								arr.push({
									serial: key.serial,
									status: item.STATUS,
									unitName: key.unitName,
									item: key.item,
									issueContent: key.issueContent,
									normName: key.normName,
									issueUserName: key.issueUserName,
									rectifyName: key.rectifyName,
									score: key.score,
									issueImage: key.issueImage,
									remark: key.remark,
									rectifyImage: key.rectifyImage,
									rectifyRemark: key.rectifyRemark,
									operatingTime: key.operatingTime,
									rectifyMeasures: key.rectifyMeasures,
									type: item.type,
									//问题图片
									showPic1: true,
									list1: img1,
									fileList1: [],
									//整改图片
									showPic: true,
									list: img2,
									fileList: []
								});
							});
							let norm = '';
							item.normName.forEach(key => {
								norm += key.name + '    ';
							});
							arr.sort((a, b) => {
								return parseInt(a.serial) - parseInt(b.serial);
							});
							array.push({
								isShow: false,
								normName: norm.substring(0, norm.length - 1),
								name: item.NAME,
								status: item.STATUS,
								unitName: item.unitName,
								total_issue: item.total_issue,
								tableList: arr
							});
						});
						this.data = array;
						this.tableList = arr;
						this.headTitle = this.data[0].name + ' 问题列表';
					}
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.scorll-content {
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
					.red{
						color: #fa3534;
					}
				}
			}

			.detail {
				width: 250rpx;
			}

			.pic {

				width: 400rpx;

				.imgpart {
					padding: 10rpx 0;

					/deep/uni-swiper {
						height: 200rpx !important;
					}
				}
			}
		}
	}
</style>
