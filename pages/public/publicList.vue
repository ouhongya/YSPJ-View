<template>
	<view class="public">
		<a-head bgColor="#4abdb4" text="公告列表" @headHeight="getHeight"></a-head>
		<u-sticky offset-top="0">
			<view class="subtop" :id="searchId">
				<view class="subsearch">
					<u-search
						placeholder="请输入关键字"
						v-model="publicName"
						shape="square"
						:action-style="actionStyle"
						border-color="#4abdb4"
						bg-color="#ffffff"
						@search="search()"
						@change="replaceInput"
						@custom="search()"
						@clear="clear()"
					></u-search>
				</view>
			</view>
		</u-sticky>
		<view class="content" v-if="publiclist.length == 0"><a-empty :changing="false"></a-empty></view>
		<view class="content">
			<mescroll-uni top="0" @down="downCallback" @up="upCallback" :up="upOption" @init="mescrollInit" :height="wHeight + 'px'">
				<view class="swipe" v-for="(item, index) in publiclist" :key="index">
					<view class="list" @click="jump(item.id, item.title, item.content, item.name, item.created_time)">
						<view class="title">{{ item.title }}</view>
						<view class="swipetxt" :id="item.leadid"><u-parse :html="item.content"></u-parse></view>
						<u-line color="#dbdbdb" />
						<view class="info">
							<view class="left">{{ item.name }}</view>
							<view class="right">{{ $u.timeFormat(item.created_time, 'yyyy-mm-dd hh:MM:ss') }}</view>
						</view>
						<u-badge :is-dot="true" type="error" :count="item.isFlag == 1 ? 1 : 0" class="circle"></u-badge>
					</view>
				</view>
			</mescroll-uni>
		</view>

		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
	</view>
</template>

<script>
import helper from '@/common/helper.js';
import debounce from '@/uview-ui/libs/function/debounce.js';
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins.js';
import { openComDB, closeComDB, executeSQL, selectSQL } from '@/common/local.js';
import { queryBulletin, deleteBulletin } from '@/api/application.js';
import { queryPublicList, deletePublic, publicRead, publicList } from '@/api/public.js';
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			actionStyle: {
				backgroundColor: '#4abdb4',
				color: '#fff',
				margin: '0',
				width: '100rpx',
				height: '68rpx',
				lineHeight: '68rpx',
				borderRadius: '0 10rpx 10rpx 0'
			},
			publicName: '',
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#FF5377'
					}
				}
			],
			publiclist: [],
			uid: null,
			loading: true, //页面加载动画
			// 分页
			changing: false,
			mescroll: null,
			upOption: {
				noMoreSize: 5,
				textNoMore: '我也是有底线的~'
			},
			wHeight: 600,
			headH: 44,
			searchId: this.$u.guid(),
			jumplock: false
		};
	},
	created() {
		this.uid = uni.getStorageSync('USER_ID');
		this.loading = true;
	},
	onShow() {
		const id = uni.getStorageSync('publicMsgId');
		const value = uni.getStorageSync('publicMsgRead');
		if (value) {
			if (this.mescroll) {
				publicRead(id, this.uid);
				this.mescroll.resetUpScroll();
			}
			uni.removeStorageSync('publicMsgRead');
		}
	},
	mounted() {
		setTimeout(() => {
			this.loading = false;
		}, 500);
		this.$nextTick(() => {
			this.$uGetRect('#' + this.searchId).then(res => {
				this.wHeight = this.wHeight - res.height - 20 + 60;
			});
		});
	},
	// watch: {
	// 	//防抖搜索
	// 	publicName(newVal, oldVal) {
	// 		if (newVal != oldVal&&newVal!='') {
	// 			debounce(this.search(), 500);
	// 		}
	// 	}
	// },
	methods: {
		replaceInput(value){
			let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
			setTimeout(()=>{
				let endvalue=value.replace(patrn,'')
				this.publicName = endvalue;
				debounce(this.search(), 500);
			},100)
		},
		getHeight(res) {
			this.headH = res + 60;
			const { windowWidth, windowHeight } = uni.getSystemInfoSync();
			this.wHeight = windowHeight - this.headH;
		},
		search() {
			this.mescroll.resetUpScroll();
		},
		clear() {
			this.publicName = '';
			// this.search();
		},
		

		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		// 下拉刷新
		downCallback(mescroll) {
			// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
			mescroll.resetUpScroll();
		},
		// 上拉回调
		upCallback(mescroll) {
			publicList(this.uid, mescroll.num, mescroll.size, this.publicName).then(res => {
				if (res && res.length) {
					let totalSize = Number(res[0].totalSize);
					mescroll.endBySize(res.length, totalSize); //必传参数(当前页的数据个数, 总数据量)
					//设置列表数据
					if (mescroll.num == 1) this.publiclist = []; //如果是第一页需手动制空列表
					this.publiclist = this.publiclist.concat(res); //追加新数据
					let lists = [];
					this.publiclist.forEach(entry => {
						if (entry.isFlag == 1) {
							lists.push(entry);
						}
					});
					this.publiclist.forEach(entry => {
						if (entry.isFlag == 2) {
							lists.push(entry);
						}
					});
					this.publiclist = lists;
				} else {
					this.publiclist = [];
					// 隐藏下拉加载状态
					mescroll.endErr();
				}
			});
		},
		//详情
		jump(id, title, content, name, created_time) {
			if (this.jumplock) return;
			this.jumplock = true;
			let param = {
				id: id,
				title: title,
				content: content,
				name: name,
				created_time: created_time
			};
			uni.setStorageSync('publicDetail', param);
			uni.navigateTo({
				url: './detail'
			});
			setTimeout(() => {
				this.jumplock = false;
			}, 500);
		}
	}
};
</script>

<style lang="less" scoped>
/deep/.circle {
	padding: 0;
}

/deep/.u-content {
	border-radius: 10rpx 0 0 10rpx !important;
}

/deep/.u-subsection {
	padding: 0 10rpx !important;
	border-radius: 0 !important;
}

.public {
	.subtop {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background: #ffffff;

		.subsearch {
			width: 100%;
			flex: 1;
		}
	}

	.content {
		padding: 20rpx 0 0 0;
		position: relative;

		.swipe {
			margin-bottom: 10rpx;
			position: relative;
		}

		.list {
			padding: 20rpx 30rpx;
			background: #ffffff;
			//position: relative;

			.title {
				width: 100%;
				line-height: 60rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				color: #333333;
				font-weight: bold;
				font-size: 30rpx;
				color: #333333;
			}

			.swipetxt {
				white-space: pre-wrap;
				color: #666666;
				margin-bottom: 10rpx;
				line-height: 50rpx;
				font-size: 28rpx;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;
			}

			.info {
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;

				.left,
				.right {
					font-size: 26rpx;
					color: #999999;
				}
			}
		}
	}
}
</style>
