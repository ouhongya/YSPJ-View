<template>
	<view class="publicDetail">
		<a-head bgColor='#4abdb4' text="公告"></a-head>
		<view class="list">
			<view class="title">
				{{title}}
			</view>			
			<view class="info">
				<view class="left">
					{{name}}
				</view>
				<view class="right">
					{{$u.timeFormat(created_time, 'yyyy-mm-dd hh:MM:ss')}}
				</view>
			</view>			
			<u-line color="#dbdbdb" />
			<view class="swipetxt">
				<u-parse :html="content"></u-parse>
			</view>
		</view>
	</view>	
</template>

<script>
	export default {
		data() {
			return {
				title:null,				
				content: null,
				name:null,
				created_time:null,
			}
		},
		onShow() {
				let detail = uni.getStorageSync("publicDetail")
				this.title=detail.title
				this.content=detail.content
				this.name=detail.name
				this.created_time=detail.created_time
				uni.setStorageSync("publicMsgId",detail.id)
				uni.setStorageSync("publicMsgRead",true)
		}
	}
</script>

<style lang="less" scoped>
	.publicDetail{
		background: #FFFFFF;
		height: 100vh;
		overflow-y: auto;
	}
	.list {
		padding: 20rpx 0;
		.title {
			line-height: 60rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			color: #333333;
			font-weight: bold;
			font-size: 32rpx;
			color: #333333;
			text-align: center;
			padding:0 30rpx;
	
		}
	
		.swipetxt {
			white-space: pre-wrap;
			color: #666666;
			line-height: 50rpx;
			font-size: 28rpx;
			padding:20rpx 30rpx;
		}
	
		.info {
			display: flex;
			justify-content: space-between;
			margin-top: 10rpx;
			width: 50%;
			min-width: 350rpx;
			margin: 0 auto;
			line-height: 60rpx;
			margin-bottom: 30rpx;
	
			.left,
			.right {
				font-size: 26rpx;
				color: #999999;
			}
		}
	}
</style>
