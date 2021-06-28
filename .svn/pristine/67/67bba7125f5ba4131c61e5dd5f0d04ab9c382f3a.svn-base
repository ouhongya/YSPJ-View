<template>

	<view>
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="show" :mode="curMode" width="40%" height="80%">
				<view>出淤泥而不染，濯清涟而不妖</view>
			</u-popup>
			<u-button @click="show = true">打开</u-button>
		</view>
		<!-- 如果一个页面中有多个弹窗则只需改变方法 -->
		<view @touchstart="touchStart1" @touchmove="touchMove1" @touchend="touchEnd1">
			<u-popup v-model="show1" :mode="curMode" width="40%" height="80%">
				<view>出淤泥而不染，濯清涟而不妖11</view>
			</u-popup>
			<u-button @click="show1 = true">打开11</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		name: "index",
		data() {
			return {
				//
				touchDotX: 0,
				touchDotY: 0,
				touchMoveX: 0,
				touchMoveY: 0,
				time: 0,
				interval: 0,
				show: false,
				show1:false,
				curMode: "bottom", //(左边的弹窗:left;下边的弹窗：bottom)横屏或竖屏
			}
		},
		created() {
			uni.$on('curMode', res => {
				if(res.data){
					this.curMode = res.data;
				}				
			})
		},
		methods: {			
			
			// 触摸开始事件 
			touchStart(e) {
				this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点 
				this.touchDotY = e.touches[0].pageY; // 获取触摸时的y原点 
				// 使用js计时器记录时间  
				this.interval = setInterval(function() {
					this.time++;
				}, 100);
			},
			// 触摸移动事件 
			touchMove(e) {
				this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点 
				this.touchMoveY = e.touches[0].pageY; // 获取移动时的y原点 
				// 向左滑动 (如果是左边的弹窗) 
				if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10 && this.curMode == "left") {
					this.show = false
					console.log("向左滑动")
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == "bottom") {
					this.show = false
					console.log('向下滑动');
				}
			},
			// 触摸结束事件 
			touchEnd(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},
			
			
			
			// 触摸开始事件
			touchStart1(e) {
				this.touchDotX = e.touches[0].pageX; // 获取触摸时的x原点 
				this.touchDotY = e.touches[0].pageY; // 获取触摸时的y原点 
				// 使用js计时器记录时间  
				this.interval = setInterval(function() {
					this.time++;
				}, 100);
			},
			// 触摸移动事件 
			touchMove1(e) {
				this.touchMoveX = e.touches[0].pageX; // 获取移动时的x原点 
				this.touchMoveY = e.touches[0].pageY; // 获取移动时的y原点 
				// 向左滑动 (如果是左边的弹窗) 
				if (this.touchMoveX - this.touchDotX <= -40 && this.time < 10 && this.curMode == "left") {
					this.show1 = false
					console.log("向左滑动11")
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == "bottom") {
					this.show1 = false
					console.log('向下滑动11');
				}
			},
			// 触摸结束事件 
			touchEnd1(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},
		}
	}
</script>
