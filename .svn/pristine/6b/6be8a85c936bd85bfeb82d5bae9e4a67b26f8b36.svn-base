<template>
	<view class="process">
		<a-head text="人员关联" bgColor='#4abdb4'></a-head>
		<view class="line" v-if="flag">
			<u-time-line>
				<u-time-line-item nodeTop="2" v-for="(item,index) in numList" :key="index">
					<template v-slot:node>
						<view class="u-node" style="background: #4abdb4;">
							<!-- 此处为uView的icon组件 -->
							<u-icon name="pushpin-fill" color="#fff" :size="24"></u-icon>
						</view>
					</template>
					
					<template v-slot:content>
						<view>
							<view class="u-order-title">{{item.title?item.title:"暂无"}}</view>
							<view class="u-order-desc" v-if="item.nameList.length == 0">{{"暂无"}}</view>
							<view class="u-order-desc" v-if="item.nameList.length != 0" v-for="(item1,index1) in item.nameList" :key="index1">{{item1.name}}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>

		<view class="empty" v-else>
			<a-empty :changing="false"></a-empty>
		</view>
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>

</template>
<script>
	export default {
		data() {
			return {
	            numList: [],
				flag: true,
				loading: false,
			}
		},
		
		onLoad(options) {
			if (options) {			
				this.numList = JSON.parse(options.list);
				this.flag = true;
			} else {
				this.numList = [];
				this.flag = false;
			}
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
	.process {
		padding: 30rpx;

		.line {
			padding: 30rpx;

		}

		.u-node {
			width: 44rpx;
			height: 44rpx;
			border-radius: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #d0d0d0;
		}

		.u-order-title {
			color: #333333;
			font-weight: bold;
			font-size: 30rpx;
			margin-bottom: 20rpx;
		}

		.u-order-desc {
			color: #4abdb4;
			font-size: 28rpx;
			margin-bottom: 10rpx;
		}

		.u-order-time {
			color: #999999;
			font-size: 26rpx;
		}
	}
</style>
