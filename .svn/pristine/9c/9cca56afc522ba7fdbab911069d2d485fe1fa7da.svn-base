<template>
	<view class="exam">
		<a-head bgColor="#4abdb4" :text="name"></a-head>
		<view class="header" id="header" :class="ipadflag ? 'ipadw' : ''">
			<view class="header-left">第{{ currentIndex + 1 }}/{{ questionList.length }} 题</view>
			<view class="header-right" @click="history()">历史成绩</view>
		</view>
		<view id="subHeader" :class="ipadflag ? 'ipads' : ''">
			<view class="sub-header" v-if="questionList.length > 0">
				<view class="left" v-if="questionList[currentIndex]">
					<view class="line"></view>
					<view class="sub-header-type" v-if="questionList[currentIndex].type == 1">选择题</view>
					<view class="sub-header-type" v-if="questionList[currentIndex].type == 2">多选题</view>
					<view class="sub-header-type" v-if="questionList[currentIndex].type == 3">判断题</view>
					<!-- <view class='sub-header-type' v-if='questionList[currentIndex].type==1'>判断题</view>
					<view class='sub-header-type' v-if='questionList[currentIndex].type==2'>选择题</view>
					<view class='sub-header-type' v-if='questionList[currentIndex].type==3'>多选题</view> -->
					<view class="sub-header-number">({{ questionList[currentIndex].score }}分/题)</view>
				</view>
			</view>
		</view>
		<swiper
			class="content"
			:duration="duration"
			:current="currentIndex"
			@change="handleSwiperChanged"
			v-if="questionList.length > 0"
			:style="{ height: swiperHeight }"
			:class="ipadflag ? 'ipads' : ''"
		>
			<template v-for="item in questionList">
				<swiper-item class="content-item">
					<scroll-view scroll-y :style="{ height: swiperHeight }">
						<view class="content-title">{{ item.title }}</view>
						<view class="content-solutions" v-if="item.type == 3">
							<template v-for="subItem in item.optionList">
								<view :class="item.answer.indexOf(subItem.id) > -1 ? 'right' : ''" class="content-solutions-item">
									<view :class="[item.userAnswer == subItem.id ? 'content-solutions-item-select' : '']" class="content-solutions-item-check-content">
										{{ subItem.content }}
									</view>
								</view>
							</template>
						</view>
						<view class="content-solutions" v-if="item.type == 1">
							<template v-for="subItem in item.optionList">
								<view :class="item.answer.indexOf(subItem.id) > -1 ? 'right' : ''" class="content-solutions-item">
									<view class="content-solutions-item-single" :class="item.userAnswer.indexOf(subItem.id) > -1 ? 'select' : ''">{{ subItem.id }}</view>
									<view :class="item.userAnswer == subItem.id ? 'content-solutions-item-select' : ''" class="content-solutions-item-content">
										{{ subItem.content }}
									</view>
								</view>
							</template>
						</view>
						<view class="content-solutions" v-if="item.type == 2">
							<template v-for="subItem in item.optionList">
								<view :class="item.answer.indexOf(subItem.id) > -1 ? 'right' : ''" class="content-solutions-item">
									<view class="content-solutions-item-single" :class="item.userAnswer.indexOf(subItem.id) > -1 ? 'select' : ''">{{ subItem.id }}</view>
									<view :class="item.userAnswer.indexOf(subItem.id) > -1 ? 'content-solutions-item-select' : ''" class="content-solutions-item-content">
										{{ subItem.content }}
									</view>
								</view>
							</template>
						</view>
						<view class="according" v-if="item.according">题目依据：{{ item.according }}</view>
						<view class="content-item-explain">
							<view class="content-item-explain-result">
								正确答案:
								<text class="correct">{{ item | rightAnswerFilter }}</text>
							</view>
							<view class="content-item-explain-result">
								你的答案:
								<text class="error">{{ item | rightuserAnswerFilter }}</text>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</template>
		</swiper>

		<view class="footer" id="footer" :class="ipadflag ? 'ipadw' : ''">
			<view class="footer-back" @click="handleChangeCurrentSwiper(-1)" v-if="currentIndex > 0">上一题</view>
			<view class="footer-back gray" v-else>上一题</view>
			<view class="footer-right" @click="handleChangeCurrentSwiper(1)" v-if="currentIndex + 1 < questionList.length">下一题</view>
			<view class="footer-right gray" v-else>下一题</view>
		</view>
		<!-- 历史成绩 -->
		<u-modal v-model="historyShow" @confirm="historyConfirm()" :async-close="true" :confirm-style="{ color: '#19be6b' }" title="历史成绩" confirm-text="我知道了">
			<view class="slot-content">
				<view class="model" v-for="item in historical">
					<view class="result">
						第{{ item.inde }}次得分：
						<text>{{ item.score }}</text>
						<text class="red">{{ item.is_flag == 0 ? '合格' : '不合格' }}</text>
					</view>
				</view>
			</view>
		</u-modal>

		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>
<script>
import { wrongQuestions, historicalAchievements } from '@/api/exam/testbase.js';
export default {
	data() {
		return {
			uid: null,
			historical: null,
			name: null,
			id: null,
			currentIndex: 0,
			swiperHeight: 0,
			modalHeight: '',
			modalContentHeight: '',
			showQuestion: false,
			currentSwiperItem: 0,
			duration: 300,
			showSubmit: false,
			timestamp: 360,
			loading: false,
			showTips: false,
			showOut: false,
			ipadflag: false,
			historyShow: false,
			questionList: [
				{
					id: 652,
					title: '黄金持续上涨，因此2020年鼠年金币的发行价格相对去年上涨30%是合理的',
					answer: 'B',
					type: 1,
					score: '5',
					according: 'dfg',
					optionList: [
						{
							optionId: 2469,
							id: 'A',
							questionId: 652,
							content: '正确',

							type: 1
						},
						{
							optionId: 2470,
							id: 'B',
							questionId: 652,
							content: '错误',
							type: 1
						}
					],
					userAnswer: 'A'
				},
				{
					id: 541,
					title: '1931年在中华苏维埃第一次全国代表大会上，（）受命在江西瑞金筹建了第一家共和国国家银行——中华苏维埃共和国国家银行，并任行长。',
					answer: 'B',
					type: 2,
					score: '5',
					according: '',
					optionList: [
						{
							optionId: 2045,
							id: 'A',
							questionId: 541,
							content: '习仲勋',
							type: 2
						},
						{
							optionId: 2046,
							id: 'B',
							questionId: 541,
							content: '毛泽民',
							type: 2
						},
						{
							optionId: 2047,
							id: 'C',
							questionId: 541,
							content: '刘志丹',
							type: 2
						},
						{
							optionId: 2048,
							id: 'D',
							questionId: 541,
							content: '毛泽东',
							type: 2
						}
					],
					userAnswer: 'C'
				},
				{
					id: 685,
					title: '铜质熊猫纪念币的发行年份分别是哪几年？（）',
					answer: 'ABC',
					type: 3,
					score: '10',
					according: '',
					optionList: [
						{
							optionId: 2543,
							id: 'A',
							questionId: 685,
							rado: '0',
							content: '1983年',
							type: 3
						},
						{
							optionId: 2544,
							id: 'B',
							questionId: 685,
							rado: '0',
							content: '1984年',
							type: 3
						},
						{
							optionId: 2545,
							id: 'C',
							questionId: 685,
							rado: '1',
							content: '1985年',
							type: 3
						},
						{
							optionId: 2546,
							id: 'D',
							questionId: 685,
							rado: '1',
							content: '1986年',
							type: 3
						}
					],
					userAnswer: 'AD'
				}
			]
		};
	},
	filters: {
		rightAnswerFilter(item) {
			if (item.type == 3) {
				switch (item.answer) {
					case 'A':
						return '正确';
					case 'B':
						return '错误';
				}
			} else {
				return item.answer;
			}
		},
		rightuserAnswerFilter(item) {
			if (item.type == 3) {
				switch (item.userAnswer) {
					case 'A':
						return '正确';
					case 'B':
						return '错误';
				}
			} else {
				return item.userAnswer;
			}
		}
	},
	watch: {
		currentSwiperItem(val) {
			this.currentIndex = val;
		}
	},
	onLoad(options) {
		this.uid = options.user_id;
		wrongQuestions(options.id, options.user_id).then(res => {
			res = res.sort((a, b) => {
				return parseInt(a.type) - parseInt(b.type);
			});
			res.forEach(item => {
				item.optionList.forEach(val => {
					val.sort = val.id.charCodeAt(0);
				});
				item.optionList.sort((a, b) => {
					return parseInt(a.sort) - parseInt(b.sort);
				});
			});
			this.questionList = res;
			this.questionList = res;
			this.name = options.name;
			this.id = options.id;
			this.loading = true;
		});
	},
	onShow() {
		let _this = this;
		const { windowWidth, windowHeight, brand, model } = uni.getSystemInfoSync();
		let ratio = windowHeight / windowWidth;
		if ((windowWidth > 600 && ratio < 1.7 && windowHeight > 600) || (brand == 'HUAWEI' && model == 'BAH3-W59')) {
			_this.ipadflag = true;
		} else {
			_this.ipadflag = false;
		}
		uni.onNetworkStatusChange(function(res) {
			if (!res.isConnected) {
				uni.showToast({
					title: '网络已断开',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 500);
			}
		});
	},
	mounted() {
		setTimeout(() => {
			this.loading = false;
			this.showTips = true;
		}, 500);
		this.setAnswerHeight();
	},

	methods: {
		//设置题目的高度

		setAnswerHeight() {
			let that = this;
			let tempHeight = 0;
			uni.getSystemInfo({
				//获取手机屏幕高度信息，让swiper的高度和手机屏幕一样高
				success: function(res) {
					tempHeight = res.windowHeight;
					that.modalHeight = res.windowHeight - uni.upx2px(200) + 'px';
					that.modalContentHeight = res.windowHeight - uni.upx2px(380) + 'px';
					uni.createSelectorQuery()
						.select('#header')
						.fields(
							{
								size: true,
								scrollOffset: true
							},
							data => {
								tempHeight -= data.height;
								uni.createSelectorQuery()
									.select('#subHeader')
									.fields(
										{
											size: true,
											scrollOffset: true
										},
										data => {
											tempHeight -= data.height;
											uni.createSelectorQuery()
												.select('#footer')
												.fields(
													{
														size: true,
														scrollOffset: true
													},
													data => {
														tempHeight -= data.height;
														that.swiperHeight = tempHeight - 80 + 'px';
													}
												)
												.exec();
										}
									)
									.exec();
							}
						)
						.exec();
				}
			});
		},
		//跳转指定题目
		handleJumpSwiper(index) {
			this.currentIndex = index;
			this.showQuestion = false;
		},
		// 滑动题目
		handleSwiperChanged(event) {
			this.currentIndex = event.detail.current;
		},
		//调用上一页，下一页
		handleChangeCurrentSwiper(operation) {
			let max = this.questionList.length - 1;
			let min = 0;
			if ((this.currentIndex > min && operation < 0) || (this.currentIndex < max && operation > 0)) {
				this.currentIndex += operation;
			}
		},
		// 历史成绩
		history() {
			historicalAchievements(this.questionList[0].exam_id, this.uid).then(res => {
				res.forEach(item => {
					item.inde = this.NoToChinese(parseInt(item.sort));
				});
				this.historical = res;
				this.historyShow = true;
			});
		},
		//阿拉伯数字转中文数字
		NoToChinese(num) {
			if (!/^\d*(\.\d*)?$/.test(num)) {
				alert('Number is wrong!');
				return 'Number is wrong!';
			}
			var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
			var BB = new Array('', '十', '百', '千', '万', '亿', '点', '');
			var a = ('' + num).replace(/(^0*)/g, '').split('.'),
				k = 0,
				re = '';
			for (var i = a[0].length - 1; i >= 0; i--) {
				switch (k) {
					case 0:
						re = BB[7] + re;
						break;
					case 4:
						if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) re = BB[4] + re;
						break;
					case 8:
						re = BB[5] + re;
						BB[7] = BB[5];
						k = 0;
						break;
				}
				if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
				if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
				k++;
			}
			if (a.length > 1) {
				//加上小数部分(如果有小数部分)
				re += BB[6];
				for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
			}
			return re;
		},
		historyConfirm() {
			this.historyShow = false;
		}
	}
};
</script>

<style lang="less" scoped>
page {
	background-color: #ffffff;
}

.model {
	padding: 30rpx;

	.result {
		font-size: #333333;
		line-height: 50rpx;
		font-size: 28rpx;
		margin: 20rpx 0;
		.green {
			font-size: 30rpx;
			color: #19be6b;
			margin-left: 60rpx;
		}

		.red {
			font-size: 30rpx;
			color: #fa3534;
			margin-left: 60rpx;
		}
	}
}

#header,
#subHeader {
	height: 100rpx;
}

.header {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	border-bottom: 1px solid #eeeeee;

	.header-button {
		width: auto;
		height: 40rpx;
		line-height: 40rpx;
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		letter-spacing: 2rpx;
		color: #f4f4f5;
		background-color: #19be6b;
	}

	.header-left {
		font-size: 34rpx;
		color: #19be6b;
		font-weight: 600;
	}

	.header-right {
		font-size: 30rpx;
		color: #8a8a8a;
		display: flex;
		align-items: center;

		image {
			width: 32rpx;
			height: 32rpx;
			padding-right: 10rpx;
		}
	}
}

.sub-header {
	padding: 30rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #333333;

	.left {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.line {
		width: 12rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 10rpx;
		background: #39b54a;
		margin-right: 10rpx;
	}

	.sub-header-number {
		color: #999999;
		padding-left: 10rpx;
		font-size: 30rpx;
	}

	.sub-right {
		font-size: 30rpx;
		color: #19be6b;
		display: flex;
	}
}

.content {
	letter-spacing: 3rpx;
	.according {
		color: #999999;
		line-height: 50rpx;
		font-size: 28rpx;
		font-style: italic;
		margin-bottom: 20rpx;
	}

	.content-item {
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.content-title {
		margin-bottom: 30rpx;
		font-size: 30rpx;
		line-height: 50rpx;
		color: #333333;
	}

	.content-solutions {
		width: 100%;
		padding-bottom: 20rpx;

		.content-solutions-item {
			margin: 60rpx 0;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			font-size: 30rpx;
			background: #f4f4f5;
			border: 2rpx solid #f4f4f5;

			.content-solutions-item-check-content {
				padding: 20rpx;
				border-radius: 10rpx;
				width: 100%;
				flex: 1;
				color: #333333;
			}

			.content-solutions-item-single {
				width: 80rpx;
				text-align: center;
				color: #333333;
				padding: 20rpx 0;
			}

			.select {
				color: #ffffff;
				background: #fab6b6;
				border-top-left-radius: 8rpx;
				border-bottom-left-radius: 8rpx;
			}

			.content-solutions-item-content {
				padding: 20rpx;
				width: 100%;
				flex: 1;
				border-top-right-radius: 8rpx;
				border-bottom-right-radius: 8rpx;
				color: #333333;
				background-color: #f4f4f5;
			}

			.content-solutions-item-select {
				color: #ffffff;
				background: #fa3534;
				border-top-right-radius: 8rpx;
				border-bottom-right-radius: 8rpx;
			}
		}
	}

	.content-item-explain {
		padding: 20rpx 0;
		font-size: 30rpx;
		color: #666666;
		border-top: 1px solid #eeeeee;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.content-item-explain-result {
			.correct {
				padding-left: 20rpx;
				color: #19be6b;
			}

			.error {
				color: #fa3534;
				padding-left: 20rpx;
			}
		}
	}

	.right {
		border: 4rpx solid #19be6b !important;
	}
}

.footer {
	width: 100%;
	height: 100rpx;
	padding: 30rpx 20rpx;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: space-between;
	bottom: 0;
	font-size: 30rpx;
	box-sizing: border-box;
	color: #19be6b;
	box-shadow: 0 -5rpx 5rpx rgba(0, 0, 0, 0.3);
	background: #ffffff;

	.gray {
		color: #c8c9cc;
	}
}

.ipadw {
	padding-left: 30rpx;
	padding-right: 30rpx;
}

.ipads {
	padding-left: 40rpx;
	padding-right: 40rpx;
}
</style>
