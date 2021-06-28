<template>
	<view class="main">
		<a-head text="考试中心" bgColor="#4abdb4"></a-head>
		<view>
			<view class="hello">欢迎您，{{ user.name }},{{ user.stuId }}</view>
			<view class="part-top">
				<view class="part" @click="toPractice()"><view class="txt">考试练习</view></view>
			</view>

			<view class="center">
				<view class="list-center"><u-section title="我的考试" :right="false" font-size="30"></u-section></view>
				<mescroll-uni :top="0" @down="downCallback" @up="upCallback" :up="upOption" @init="mescrollInit" ref="mescrollRef" height="500px">
					<view class="list" v-for="(item, index) in list" :key="index">
						<view class="title">{{ item.name }}({{ item.createdTime }})</view>
						<view class="left">
							考试时间：
							<text>{{ $u.timeFormat(item.startTime, 'yyyy-mm-dd') }}</text>
							至
							<text>{{ $u.timeFormat(item.endTime, 'yyyy-mm-dd') }}</text>
						</view>
						<view class="subtitle">
							<view class="sub-part">
								<view class="sub">
									时长：
									<text>{{ item.longTime }}</text>
									分钟
								</view>
								<view class="sub">
									总分：
									<text>{{ item.totalScore }}</text>
									分
								</view>
								<view class="sub">
									合格：
									<text>{{ item.qualifiedScore }}</text>
									分
								</view>
							</view>
						</view>
						<view class="sublast">
							<view class="statepart" v-if="(item.status == 1 || item.status == 0 || item.isFlag == 0 || item.isFlag == 1) && item.status < 4">
								<view class="state">待作答</view>
							</view>
							<view class="statepart" v-if="item.score >= item.qualifiedScore && item.status >= 4">
								<view class="grade">
									得分：
									<text class="pass">{{ item.score }}</text>
									分
								</view>
								<view class="state-green">已通过</view>
							</view>
							<view class="statepart" v-if="item.score < item.qualifiedScore && item.status >= 4">
								<view class="grade">
									得分：
									<text class="fail">{{ item.score }}</text>
									分
								</view>
								<view class="state-red">未通过</view>
							</view>
							<view class="statepart" v-if="item.status == 2"><view class="state blue">进行中</view></view>
							<view class="action-part">
								<view class="nostart" v-if="item.isFlag == 1">考试未开始</view>
								<view class="nostart" v-if="item.status == 8">考试已结束</view>
								<view class="nostart" v-if="item.status == 4">考试已暂停</view>
								<!-- 0未开始,1已开始,2进行中,3暂停中,4再次答题,5查看错题,6合格,7不合格,8考试已结束 -->
								<view class="start" v-if="item.status == 1" @click="start(item.examId, item.name)">开始答题</view>
								<view class="start" v-if="item.status == 3">已暂停</view>
								<view class="see" v-if="item.status == 5" @click="toMistake(item.examId, item.name)">查看错题</view>
								<view class="see" v-if="item.status == 6 && item.examCount == item.topicCount && item.badTopic != 0" @click="toMistake(item.examId, item.name)">
									查看错题
								</view>
								<view class="see" v-if="item.status == 7 && item.examCount == item.topicCount && item.badTopic != 0" @click="toMistake(item.examId, item.name)">
									查看错题
								</view>
								<view class="again" v-if="item.status == 6 && item.examCount > item.topicCount" @click="again(item.examId, item.name, item.examUserId)">
									再次答题
								</view>
								<view class="again" v-if="item.status == 7 && item.examCount > item.topicCount" @click="again(item.examId, item.name, item.examUserId)">
									再次答题
								</view>
								<view class="continue" v-if="item.status == 2" @click="keep(item.examId, item.name)">继续考试</view>
							</view>
						</view>
					</view>
					<view class="empty"><a-empty :changing="false"></a-empty></view>
				</mescroll-uni>
			</view>
		</view>
		<!-- 练习选择 -->
		<u-popup v-model="practiceShow" mode="bottom" width="40%" height="80%" @close="closePractice">
			<view class="Model">
				<view class="toptitle">考试练习</view>
				<view class="collapsePart">
					<view class="content">
						<u-form ref="uForm" :label-style="labelStyle" label-width="160">
							<view class="range">
								<u-cell-group>
									<u-cell-item
										title="所属题库"
										:title-style="labelStyle"
										:arrow="true"
										arrow-direction="right"
										:value="belong"
										@click="belongChange()"
									></u-cell-item>
								</u-cell-group>
							</view>
							<u-form-item label="题目类型" class="form">
								<u-checkbox-group @change="checktype" icon-size="30">
									<u-checkbox v-model="item.checked" v-for="(item, index) in typeList" :key="index" :name="item.name" active-color="#4abdb4">
										<text>{{ item.name }}</text>
									</u-checkbox>
								</u-checkbox-group>
							</u-form-item>

							<u-form-item label="题目数量" class="form">
								<u-input v-model="count" :border="true" placeholder="请输入题目数量" type="text" @input="countInput($event)" @blur="countBlur($event)" />
							</u-form-item>
						</u-form>
					</view>
				</view>
				<view class="roleAction">
					<view class="cancel" @click="closePractice()">取消</view>
					<view class="sure" @click="startPractice()">开始练习</view>
				</view>
			</view>
		</u-popup>
		<!-- 所属题库选择 -->
		<u-popup v-model="belongShow" mode="bottom" width="40%" height="80%" @close="belongclose">
			<view class="Model">
				<view class="toptitle">所属题库</view>
				<view class="collapsePart">
					<view class="u-collapse-item">
						<view :hover-stay-time="200" class="u-collapse-head">
							<block>
								<u-checkbox-group @change="checkAll"><u-checkbox v-model="checkedAll" active-color="#4abdb4" icon-size="30">全部题库</u-checkbox></u-checkbox-group>
							</block>
						</view>
						<view class="u-collapse-body">
							<view class="u-collapse-content">
								<scroll-view scroll-y class="scroll-part">
									<u-checkbox-group @change="check1" :wrap="true" icon-size="30">
										<u-checkbox v-model="item.checked" v-for="(item, index) in belongList" :key="index" :name="item.name" active-color="#4abdb4">
											<text>{{ item.name }}</text>
										</u-checkbox>
									</u-checkbox-group>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
				<view class="roleAction">
					<view class="cancel" @click="belongclose()">取消</view>
					<view class="sure" @click="belongsure()">确定</view>
				</view>
			</view>
		</u-popup>

		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>
<script>
import {
	queryUserByNameAndStuId,
	queryExamList,
	queryExamListRoleLaunch,
	deleteExam,
	examStopToEnable,
	questionAgain,
	queryQuestionBankListNotLimit,
	examPractice
} from '@/api/exam/testbase.js';
export default {
	data() {
		return {
			upOption: {
				noMoreSize: 5,
				textNoMore: '我也是有底线的~'
			},
			mescroll: null,
			user: {
				name: null,
				stuId: null
			},
			loading: false,
			list: [
				{
					state: 1
				},
				{
					state: 2
				},
				{
					state: 3
				},
				{
					state: 4
				},
				{
					state: 5
				}
			],
			startlock: false,
			againlock: false,
			mistakelock: false,
			practicelock: false,
			keeplock: false,
			practiceShow: false,
			belongShow: false,
			titleStyle: {
				color: '#333333',
				fontSize: '30rpx'
			},
			labelStyle: {
				color: '#333333',
				fontSize: '30rpx'
			},
			checkedAll: false,
			belongList: [
				{
					id: 1,
					checked: false,
					name: '默认分类'
				},
				{
					id: 2,
					checked: false,
					name: 'xxx分类'
				},
				{
					id: 3,
					checked: false,
					name: 'xxx分类1'
				}
			],
			belong: '',
			belongPart: '',
			count: '',
			type: '',
			typeList: [
				{
					name: '单选',
					checked: false,
					disabled: false
				},
				{
					name: '多选',
					checked: false,
					disabled: false
				},
				{
					name: '判断',
					checked: false,
					disabled: false
				}
			]
		};
	},
	created() {
		this.loading = true;
		queryUserByNameAndStuId().then(res => {
			this.user.name = res.name;
			this.user.stuId = res.stu_id;
		});
		this.queryQuestionBankListNotLimit();
	},
	mounted() {
		setTimeout(() => {
			this.loading = false;
		}, 200);
	},
	methods: {
		//拉取题库列表
		queryQuestionBankListNotLimit() {
			queryQuestionBankListNotLimit().then(res => {
				res.forEach(item => {
					item.checked = false;
				});
				this.belongList = res;
			});
		},
		//初始化请求数据
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		// 上拉回调
		upCallback(mescroll) {
			queryExamList(mescroll.num, mescroll.size).then(res => {
				if (res && res.list.length) {
					mescroll.endByPage(res.size, res.pages);
					//设置列表数据
					if (mescroll.num == 1) this.list = []; //如果是第一页需手动制空列表
					let data = res.list;
					data.forEach(item => {
						let time = new Date().getTime();
						if (item.startTime <= time && time <= item.endTime) {
							item.isFlag = 0;
						} else if (item.startTime > time && time < item.endTime) {
							item.isFlag = 1;
						}
						item.createdTime = new Date(item.createdTime).toLocaleString();
					});
					this.list = this.list.concat(data); //追加新数据
				} else {
					this.list = [];
					// 隐藏下拉加载状态
					mescroll.endErr();
				}
			});
		},
		// 下拉刷新
		downCallback(mescroll) {
			this.mescroll.resetUpScroll();
		},
		// 开始作答
		start(id, name) {
			if (this.startlock) return;
			this.startlock = true;
			uni.navigateTo({
				url: './exam?id=' + id + '&name=' + name + '&button=嘿嘿&isFag=1'
			});
			setTimeout(() => {
				this.startlock = false;
			}, 500);
		},
		// 再次作答
		again(id, name, examUserId) {
			if (this.againlock) return;
			this.againlock = true;
			let URI = './exam?id=' + id + '&name=' + name + '&button=嘿嘿&isFag=2&examUserId='+examUserId;
			uni.navigateTo({
				url: URI
			});
			setTimeout(() => {
				this.againlock = false;
			}, 500);
		},
		// 继续考试
		keep(id, name) {
			if (this.keeplock) return;
			this.keeplock = true;
			uni.navigateTo({
				url: './exam?id=' + id + '&name=' + name + '&button=继续考试&isFag=1'
			});
			setTimeout(() => {
				this.keeplock = false;
			}, 500);
		},
		// 查看错题
		toMistake(id, name) {
			if (this.mistakelock) return;
			this.mistakelock = true;
			uni.navigateTo({
				url: './mistake?id=' + id + '&name=' + name + '&user_id=' + uni.getStorageSync('USER_ID')
			});
			setTimeout(() => {
				this.mistakelock = false;
			}, 500);
		},
		//考试练习
		toPractice() {
			this.practiceShow = true;
		},
		checktype(e) {
			this.type = e.toString();
		},
		countInput(event) {
			setTimeout(() => {
				let value = event;
				let patrn;
				let endvalue = '';
				if (value.length == 1) {
					patrn = /[^\d]/g;
					endvalue = value.replace(patrn, '');
				} else {
					endvalue = this.ChangeNumValue(value);
				}
				this.count = endvalue;
			}, 50);
		},
		countBlur(event) {
			let value = event;
			if (value == '') {
				this.count = 0;
			}
		},
		// 整数
		ChangeNumValue(tmpVal) {
			if (tmpVal) {
				let s = tmpVal.substring(0, 1);
				let t = tmpVal.substring(1, tmpVal.length);
				if (s == 0) {
					return t;
				}
				var tmpVal = tmpVal.replace(/[^\d]/g, '');
				return tmpVal;
			} else {
				return '';
			}
		},
		closePractice() {
			this.practiceShow = false;
		},
		startPractice() {
			// this.practiceShow = false;
			if (this.practicelock) return;
			this.practicelock = true;
			let examIds = [];
			this.belongList.forEach(entry => {
				if (entry.checked) {
					examIds.push(entry.id);
				}
			});
			let category = examIds.join(',');
			let type = '';
			this.typeList.forEach(item => {
				if (item.name == '单选' && item.checked) {
					type += '0';
				} else if (item.name == '多选' && item.checked) {
					type += '1';
				} else if (item.name == '判断' && item.checked) {
					type += '2';
				}
			});
			type = type.split('').join(',');
			examPractice(category, type, this.count).then(res => {
				if (res.indexOf('不足') != -1) {
					this.$refs.uToast.show({
						title: res,
						type: 'warning'
					});
					this.practicelock = false;
				} else {
					this.practiceShow = false;
					this.belongList.forEach(entry => {
						entry.checked = false;
					});
					this.typeList.forEach(item => {
						item.checked = false;
					});
					this.count = null;
					this.checkedAll = false;
					this.belong = '';
					uni.navigateTo({
						url: './practice?id=' + res
					});
					setTimeout(() => {
						this.practicelock = false;
					}, 500);
				}
			});
		},
		// 选择题库
		belongChange() {
			this.belongShow = true;
		},
		checkAll(e) {
			if (this.checkedAll) {
				this.belongList.map(item => {
					item.checked = true;
				});
				this.belongPart = '全部题库';
			} else {
				this.belongList.map(item => {
					item.checked = false;
				});
				this.belongPart = '';
			}
		},
		check1(e) {
			if (e.length == this.belongList.length) {
				this.checkedAll = true;
				this.belongPart = '全部题库';
			} else {
				this.checkedAll = false;
				this.belongPart = e.toString();
			}
		},
		belongclose() {
			this.belongShow = false;
		},
		belongsure() {
			this.belong = this.belongPart;
			this.belongShow = false;
		}
	}
};
</script>

<style lang="less" scoped>
page {
	background: #ffffff !important;
	min-height: 100vh;
}

.main {
	padding: 30rpx;
}

.Model {
	.content {
		padding: 20rpx 30rpx;
		/deep/.u-cell {
			padding: 10px 0;
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
			padding-left: 120rpx;

			.scroll-part {
				height: 50vh;
			}
			.gray {
				color: #999999;
			}
		}
	}
}

.hello {
	font-size: 32rpx;
	color: #333333;
	font-weight: bold;
	letter-spacing: 3px;
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
}

.part-top {
	padding: 20rpx 0;
	margin-top: 30rpx;

	.part {
		text-align: center;
		border-radius: 10rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(to right, #64b6fc, #2395f7);
		box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);

		.txt {
			font-size: 30rpx;
			color: #ffffff;
			letter-spacing: 3px;
		}
	}
}

.list-center {
	margin: 30rpx 0;
}

.list {
	margin: 20rpx 0;
	padding: 20rpx;
	border: 1px solid #eeeeee;

	border-radius: 10rpx;

	.title {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		color: #333333;
		line-height: 50rpx;
		font-size: 30rpx;
	}

	.left {
		color: #333333;
		margin: 10rpx 0;
		font-size: 28rpx;

		text {
			color: #333333;
			margin: 0 10rpx;
			// font-weight: bold;
		}
	}

	.subtitle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;

		.sub-part {
			// width: 48%;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.sub {
				color: #333333;
				margin: 10rpx 0;
				width: 33%;

				text {
					color: #999999;
					margin-right: 10rpx;
					font-weight: bold;
				}
			}
		}
	}

	.sublast {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #eeeeee;
		padding: 10rpx 0;
		margin-top: 20rpx;

		.statepart {
			width: 80%;
			display: flex;
			justify-content: space-between;
			padding-right: 60rpx;

			.state {
				color: #999999;
				font-size: 28rpx;
				width: 100rpx;
			}

			.blue {
				color: #19be6b;
			}

			.state-green {
				color: #19be6b;
				font-size: 28rpx;
				width: 100rpx;
			}

			.state-red {
				color: #fa3534;
				font-size: 28rpx;
				width: 100rpx;
			}

			.grade {
				color: #666666;
				font-size: 28rpx;

				text {
					margin: 0 10rpx;
					font-weight: bold;
				}

				.pass {
					color: #19be6b;
				}

				.fail {
					color: #fa3534;
				}
			}
		}

		.action-part {
			width: 40%;
			color: #ffffff;
			font-size: 28rpx;
			text-align: center;
			display: flex;
			justify-content: flex-end;

			.start {
				width: 80%;
				height: 60rpx;
				line-height: 60rpx;
				background: #19be6b;
				border-radius: 10rpx;
			}

			.nostart {
				width: 80%;
				height: 60rpx;
				line-height: 60rpx;
				background: #c8c9cc;
				border-radius: 10rpx;
			}

			.see {
				width: 80%;
				height: 60rpx;
				line-height: 60rpx;
				background: #fa3534;
				border-radius: 10rpx;
			}

			.again {
				width: 80%;
				height: 60rpx;
				line-height: 60rpx;
				background: #ff9900;
				border-radius: 10rpx;
			}

			.continue {
				width: 80%;
				height: 60rpx;
				line-height: 60rpx;
				background: #2979ff;
				border-radius: 10rpx;
			}
		}
	}
}
</style>
