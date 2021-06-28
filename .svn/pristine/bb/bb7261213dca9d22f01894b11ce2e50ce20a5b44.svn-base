<template>
	<view class="main">
		<a-head text="试卷" bgColor='#4abdb4'></a-head>
		<view>
			<view class="top">
				<view class="title">
					{{title.name}}
				</view>
			</view>
			<view class="center">
				<view class="part">
					总分：{{title.totalScore}}
				</view>
				<view class="part">
					合格分：{{title.is_hash}}
				</view>
				<view class="part">
					题目总数：{{title.count}}
				</view>
			</view>
			<view class="bottom">
				<view class="list" v-for="(item,index) in typelist" :key="index">
					<view class="type-part">
						<text class="num" v-if="index==0"> 一、</text>
						<text class="num" v-if="index==1"> 二、</text>
						<text class="num" v-if="index==2"> 三、</text>
						{{item.typename}}<text>（{{item.grade*item.count}}分</text><text>每题{{item.grade}}分</text><text>共{{item.count}}题）</text>
					</view>
					<view class="subject" v-for="(i,index1) in item.list" :key="index1">
						<view class="sub-title">
							{{index1+1}}、{{i.title}}
						</view>
						<view class="sub-option" v-for="(j,index2) in i.optionList" :key="index2">
							<view class="option">
								{{j.optionId}}、{{j.content}}
							</view>
						</view>
						<view class="according" v-if="i.according">
							题目依据：{{i.according}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>

</template>
<script>
	import {
		viewPaper
	} from '@/api/exam/testbase.js';
	export default {
		data() {
			return {
				title:{
					name:null,
					totalScore:null,
					is_hash:null,
					count:null
				},
				loading: false,
				typelist: [{
						type: 1,
						typename: '单选题',
						grade: '2',
						count: '12',
						list: [{
							according:'42353',
							title: '1931年在中华苏维埃第一次全国代表大会上，（）受命在江西瑞金筹建了第一家共和国国家银行——中华苏维埃共和国国家',
							"optionList": [{
									"optionId": "A",
									"content": "习仲勋",
								},
								{
									"optionId": "B",
									"content": "毛泽民",
								},
								{
									"optionId": "C",
									"content": "刘志丹",
								},
								{
									"optionId": "D",
									"content": "毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东毛泽东",
								}
							],
						}]
					},
					{
						type: 2,
						typename: '多选题',
						grade: '2',
						count: '12',
						list: [{
							title: 'hhhh',
							according:'42353',
							"optionList": [{

									"optionId": "A",
									"content": "gsehsdh",

								},
								{

									"optionId": "B",

									"content": "eedfhaesjsh",

								},
								{
									"optionId": "C",
									"content": "dfhahj",

								},
								{
									"optionId": "D",
									"content": "dffhsdj",

								}
							],
						}]
					},
					{
						type: 3,
						typename: '判断题',
						grade: '2',
						count: '12',
						list: [{
							title: 'hhhh',
							according:'',
							"optionList": [{

									"optionId": "A",
									"content": "正确",

								},
								{

									"optionId": "B",

									"content": "错误",

								}
							],
						}]
					}
				]
			}
		},
		onLoad(options) {
			viewPaper(options.id).then(res=>{
				this.title.name= res[0].examName
				this.title.totalScore= res[0].totalScore
				this.title.is_hash= res[0].is_hash
				this.title.count= res[0].totalCount
				res = res.sort((a, b) => {
					return parseInt(a.type) - parseInt(b.type);
				});
				res.forEach(item => {
					item.optionList.forEach(val => {
						val.optionId=val.id
						val.sort = val.id.charCodeAt(0);
					});
					item.optionList.sort((a, b) => {
						return parseInt(a.sort) - parseInt(b.sort);
					});
				});
				let data  = res;
				let radioTopic = 0;
				let checkboxTopic = 0;
				let judgeTopic = 0;
				let radioScore = 0;
				let checkboxScore = 0;
				let judgeScore = 0;
				data.forEach(item => {
					let type = item.type;
					if (type == 1) {
						radioScore=item.score
						radioTopic += 1;
					} else if (type == 2) {
						checkboxScore=item.score
						checkboxTopic += 1;
					} else if (type == 3) {
						judgeScore=item.score
						judgeTopic += 1;
					}
				});
				data.forEach(item => {
					let type = item.type;
					if (type == 1) {
						item.size = radioTopic;
					} else if (type == 2) {
						item.size = checkboxTopic;
					} else if (type == 3) {
						item.size = judgeTopic;
					}
				});
				let radioList = [];
				let checkboxList= [];
				let judgeList= [];
				data.forEach(item=>{
					if(item.type==1){
						radioList.push(item)
					}
					if(item.type==2){
						checkboxList.push(item)
					}
					if(item.type==3){
						judgeList.push(item)
					}
				})
				this.typelist = []
				if(radioTopic!=0){
					this.typelist.push( {
							type: 1,
							typename: '单选题',
							grade: radioScore,
							count: radioTopic,
							list: radioList
						})
				}
				if(checkboxTopic!=0){
					this.typelist.push({
						type: 2,
						typename: '多选题',
						grade: checkboxScore,
						count: checkboxTopic,
						list: checkboxList
					})
				}
				if(judgeTopic!=0){
					this.typelist.push({
						type: 3,
						typename: '判断题',
						grade: judgeScore,
						count: judgeTopic,
						list: judgeList
					})
				}
			})
		},
		created() {
			this.loading = true;
		},
		mounted() {
			setTimeout(() => {
				this.loading = false;
			}, 200)
		},
		methods: {

		},
	}
</script>

<style lang="less" scoped>
	page {
		background: #FFFFFF;
	}

	.main {
		padding: 30rpx 20rpx;
	}

	.top {


		.title {
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			word-break: break-all;
			color: #333333;
			text-align: center;
			margin-bottom: 20rpx;
			font-size: 32rpx;

		}
	}

	.center {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		font-size: 30rpx;
		color: #333333;
		margin: 20rpx 0;
		border-bottom: 1px solid #EEEEEE;

		.part {
			width: 33%;
			margin-bottom: 20rpx;

			text {
				color: #06C1AE;
			}
		}
	}

	.bottom {
		margin: 20rpx 0;

		.list {
			margin-bottom: 40rpx;
			

			.type-part {
				font-size: 32rpx;
				font-weight: bold;
				color: #333333;
				line-height: 60rpx;
				margin-bottom: 30rpx;

				text {

					font-weight: normal;
					color: #999999;
					padding: 0 10rpx;
				}

				.num {
					font-size: 30rpx;
					font-weight: bold;
					color: #333333;
				}
			}

			.subject {
				margin-bottom: 20rpx;
				.according{
					color: #999999;
					line-height: 50rpx;
					font-size: 28rpx;
					font-style: italic;
					
				}

				.sub-title {

					color: #333333;
					margin-bottom: 20rpx;
					font-size: 32rpx;
					line-height: 50rpx;

				}

				.sub-option {
					.option {
						color: #666666;
						padding: 10rpx 0;
						font-size: 30rpx;
						line-height: 50rpx;

					}
				}
			}
		}
	}
</style>
