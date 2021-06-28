<template>
	<view class="newpublic">
		<a-head bgColor="#4abdb4" text="新增公告"></a-head>
		<view class="top" :style="{ top: phoneHeight + 10 + 'px' }"><view class="right" @click="jump()">历史公告</view></view>
		<view class="content">
			<u-form :model="form" ref="uForm" label-position="top" :label-style="labelStyle">
				<u-form-item label="公告标题" prop="name" class="form">
					<u-input v-model="form.name" :border="true" @input="replaceInput" placeholder="请输入公告标题(1-20字)" />
				</u-form-item>
				<view class="range">
					<u-cell-group>
						<u-cell-item title="通知范围" :title-style="labelStyle" :arrow="true" arrow-direction="right" :value="valuerang" @click="torange()"></u-cell-item>
					</u-cell-group>
				</view>
				<u-form-item label="公告内容" prop="intro" class="form"><jinEdit placeholder="请输入内容" @editOk="editOk" ref="jinedit"></jinEdit></u-form-item>
			</u-form>
			<view class="action-bottom">
				<view class="action">
					<view class="cancel" @click="cancel">取消</view>
					<view class="preview" @click="preview">预览</view>
					<view class="submit" @click="submit">发布</view>
				</view>
			</view>
		</view>
		<!-- 通知范围选择 -->
		<u-popup v-model="rangeShow" mode="bottom" width="40%" height="80%" @close="close">
			<view class="Model">
				<view class="toptitle">通知范围</view>
				<view class="collapsePart">
					<view class="u-collapse-item">
						<view :hover-stay-time="200" class="u-collapse-head" @tap="headClick()">
							<block>
								<view class="u-icon-wrap">
									<u-icon v-if="arrow" :class="{ 'u-arrow-down-icon-active': isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon>
								</view>
								<view class="check"><checkbox :checked="checked" @click.stop="check1()" color="#FFFFFF" /></view>
								<view class="u-collapse-title u-line-1">全部</view>
							</block>
						</view>
						<view class="u-collapse-body" v-if="isShow">
							<view class="u-collapse-content">
								<view class="" v-for="(i, index) in rangeList" :key="index">
									<view class="childPart" @click="headClick1(index)">
										<view class="left"><u-icon :class="{ 'u-arrow-down-icon-active': i.isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon></view>
										<view class="check"><checkbox :checked="i.checked" @click.stop="check2(index)" color="#FFFFFF" style="transform:scale(0.9)" /></view>
										<view class="u-collapse-title u-line-1">{{ i.name }}</view>
									</view>
									<scroll-view class="child" v-if="i.isShow" scroll-y>
										<view class="childPart" v-for="(j, index1) in i.child" :key="index1">
											<view class="childleft">
												<checkbox :checked="j.checked" @click="check3(index, index1)" color="#FFFFFF" style="transform:scale(0.8)" />
											</view>
											<view class="u-collapse-title u-line-1">{{ j.name }}</view>
										</view>
									</scroll-view>
									<view class="empty-tips" v-if="i.child.length == 0 && i.isShow">该角色下暂无人员~</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="roleAction">
					<view class="cancel" @click="close()">取消</view>
					<view class="sure" @click="sure()">确定</view>
				</view>
			</view>
		</u-popup>
		<!-- 预览 -->
		<u-popup v-model="previewShow" mode="center" width="80%" height="80%" @close="close1" border-radius="20">
			<view class="Model">
				<view class="list">
					<view class="title">{{ form.name }}</view>
					<view class="info">
						<view class="left">{{ form.userName }}</view>
						<view class="right">{{ $u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss') }}</view>
					</view>
					<u-line color="#dbdbdb" />
					<view class="swipetxt"><u-parse :html="messages"></u-parse></view>
				</view>
			</view>
		</u-popup>
		<!--页面加载动画-->
		<rfLoading :active="loading"></rfLoading>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import jinEdit from '@/components/jin-edit/jin-edit.vue';
import helper from '@/common/helper.js';
import bus from '@/common/bus.js';
import { queryPublicRange, savePublic, queryUserToName } from '@/api/public.js';
export default {
	components: {
		jinEdit
	},
	data() {
		return {
			arrow: true, //是否显示箭头
			isShow: true,
			checked: true,
			rangeList: [],
			changing: false,
			valuerang: '全部', //下发范围
			form: {
				name: '',
				userName: '',
				intro: ''
			},
			labelStyle: {
				fontSize: '30rpx',
				color: '#333333'
			},
			rules: {
				name: [
					{
						required: true,
						min: 1,
						max: 20,
						message: '公告标题字数范围区间为1-20字',
						trigger: 'change'
					}
				]
			},
			uid: null,
			loading: false,
			lock: false,
			range: null,
			rangeShow: false,
			previewShow: false,
			messages: '',
			phoneHeight: 20,
			ipadWflag: false,
			jumplock: false
		};
	},
	onShow() {
		this.lock = false;
		this.queryPublicRange();
		queryUserToName(uni.getStorageSync('USER_ID')).then(res => {
			this.form.userName = res;
		});
	},
	created() {
		this.loading = true;
		uni.getSystemInfo({
			success: function(res) {
				this.phoneHeight = res.statusBarHeight || '20';
			}
		});
		bus.$on('ipadW', e => {
			if ((e.data = 'ipadW')) {
				this.ipadWflag = true;
			} else {
				this.ipadWflag = false;
			}
		});
	},
	mounted() {
		setTimeout(() => {
			this.loading = false;
		}, 500);
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		replaceInput() {
			let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
			setTimeout(() => {
				let value = this.form.name;
				let endvalue = '';
				endvalue = value.replace(patrn, '');
				this.form.name = endvalue;
			}, 50);
		},
		preview() {
			this.$refs.jinedit.getHtml();
			this.$refs.uForm.validate(valid => {
				if (valid) {
					setTimeout(() => {
						if (this.messages == '<p><br></p>') {
							this.messages = '您还没有编辑公告内容,快去编辑公告内容吧...';
						}
						this.previewShow = true;
					}, 50);
				}
			});
		},
		close1() {
			this.previewShow = false;
		},
		editOk(res) {
			this.messages = res.html;
		},
		// 点击collapsehead头部
		headClick() {
			this.isShow = !this.isShow;
		},
		headClick1(index) {
			let clickindex = index;
			this.rangeList[index].isShow = !this.rangeList[index].isShow;
			this.rangeList.map((e, index) => {
				if (index != clickindex) {
					e.isShow = false;
				}
			});
		},
		torange() {
			uni.setStorageSync('valuerang', this.valuerang);
			uni.setStorageSync('rangeList', this.rangeList);
			uni.setStorageSync('checked', this.checked);
			this.rangeShow = true;
		},
		close() {
			const list = uni.getStorageSync('rangeList');
			const value = uni.getStorageSync('valuerang');
			const checked = uni.getStorageSync('checked');
			if (list) {
				this.rangeList = list;
				uni.removeStorageSync('rangeList');
			}
			if (value) {
				this.valuerang = value;
				uni.removeStorageSync('valuerang');
			}
			if (checked == false || checked) {
				this.checked = checked;
			}
			this.rangeShow = false;
		},
		sure() {
			let len = this.rangeList.length;
			let arr = [];
			let arrchild = [];
			let arrchild2 = [];
			this.rangeList.map(i => {
				if (i.checked == true) {
					arr.push(i);
				}
			});
			if (arr.length == len) {
				arr.map(j => {
					if (j.checked == true) {
						arrchild.push(j);
					}
				});
				if (arrchild.length == arr.length) {
					this.valuerang = '全部' + ',';
				} else {
					this.valuerang = '';
					arrchild.map(i => {
						this.valuerang += '全部' + i.name + ',';
					});
				}
			} else {
				this.valuerang = '';
				this.rangeList.map(i => {
					if (i.checked) {
						this.valuerang += '全部' + i.name + ',';
					} else {
						i.child.map(k => {
							if (k.checked) {
								this.valuerang += i.name + '(' + k.name + ')' + ',';
							}
						});
					}
				});
			}
			this.valuerang = this.valuerang.slice(0, this.valuerang.length - 1);
			uni.setStorageSync('valuerang', this.valuerang);
			uni.setStorageSync('rangeList', this.rangeList);
			uni.setStorageSync('checked', this.checked);
			this.rangeShow = false;
		},
		check1() {
			if (this.checked) {
				this.checked = false;
			} else {
				this.checked = true;
			}
			if (this.checked) {
				this.rangeList.map(i => {
					i.checked = true;
					if (i.child && i.child.length) {
						i.child.map(j => {
							j.checked = true;
						});
					}
				});
			} else {
				this.rangeList.map(i => {
					i.checked = false;
					if (i.child && i.child.length) {
						i.child.map(j => {
							j.checked = false;
						});
					}
				});
			}
		},
		check2(index) {
			let arr2 = [];
			let arr3 = [];
			this.rangeList[index].checked = !this.rangeList[index].checked;
			this.rangeList.map((i, idx) => {
				if (i.checked) {
					if (i.child && i.child.length) {
						i.child.map(j => {
							j.checked = true;
						});
					}
				} else {
					if (i.child && i.child.length) {
						i.child.map(j => {
							j.checked = false;
						});
					}
				}
			});
			this.rangeList.map(i => {
				if (i.checked) {
					arr2.push(i);
				}
			});
			if (arr2.length == this.rangeList.length) {
				this.checked = true;
			} else {
				this.checked = false;
			}
		},
		check3(index, index1) {
			let arr2 = [];
			let arr3 = [];
			this.rangeList[index].child[index1].checked = !this.rangeList[index].child[index1].checked;
			this.rangeList[index].child.map(j => {
				if (j.checked) {
					arr3.push(j);
				} else {
					this.checked = false;
				}
			});
			if (arr3.length == this.rangeList[index].child.length) {
				this.rangeList[index].checked = true;
			} else {
				this.rangeList[index].checked = false;
			}
			this.rangeList.map(i => {
				if (i.checked) {
					arr2.push(i);
				}
			});
			if (arr2.length == this.rangeList.length) {
				this.checked = true;
			} else {
				this.checked = false;
			}
		},
		submit() {
			if (this.lock) return;
			this.lock = true;
			this.$refs.jinedit.getHtml();
			setTimeout(() => {
				if (this.form.name == '') {
					this.$refs.uToast.show({
						title: '公告标题不能为空',
						type: 'warning'
					});
					this.lock = false;
					return;
				}
				if (this.messages == '' || this.messages == '<p><br></p>') {
					this.$refs.uToast.show({
						title: '公告内容不能为空',
						type: 'warning'
					});
					this.lock = false;
					return;
				}
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.uid = uni.getStorageSync('USER_ID');
						let type = '';
						let child = [];
						this.rangeList.forEach(item => {
							if (item.checked) {
								type += item.id + ',';
								item.child.forEach(val => {
									child.push(val.user_id);
								});
							}
						});
						let param = {
							title: this.form.name,
							content: this.messages,
							user_id: this.uid,
							type: type.substring(0, type.length - 1),
							child: child
						};

						if (child.length == 0) {
							this.$refs.uToast.show({
								title: '通知范围下至少需勾选一位人员',
								type: 'warning'
							});
							this.lock = false;
							return;
						}
						savePublic(param).then(res => {
							if (res) {
								this.jump();
								this.$refs.jinedit.clear();
								this.form.name = '';
								this.messages = '';
								this.valuerang = '全部';
								this.checked = true;
							}
						});
					} else {
						this.lock = false;
						console.log('验证失败');
					}
				});
			}, 100);
		},
		cancel() {
			uni.navigateBack({
				delta: 1
			});
		},
		jump() {
			if (this.jumplock) return;
			this.jumplock = true;
			uni.navigateTo({
				url: '/pages/public/public2'
			});
			setTimeout(() => {
				this.jumplock = false;
				this.lock = false;
			}, 500);
		},
		/**
		 * 查询公告通知列表
		 */
		queryPublicRange() {
			let _this = this;
			let uid = uni.getStorageSync('USER_ID');
			queryPublicRange(uid).then(res => {
				if (res.length !== 0) {
					res.forEach(item => {
						item.checked = true;
						item.isShow = false;
						item.name = item.role_name;
						item.id = item.role_id;
						if (item.child != null) {
							item.child.forEach(val => {
								val.checked = true;
								val.id = val.user_id;
							});
						}
					});
					_this.rangeList = res;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
/deep/.u-cell__right-icon-wrap {
	height: auto !important;
}

/deep/.uni-checkbox-input-checked {
	background: #4abdb4;
	border: 1px solid #4abdb4;
}

/deep/.uni-checkbox-input:hover {
	border-color: #4abdb4 !important;
}

.empty-tips {
	color: #999999;
	font-size: 26rpx;
	padding: 10rpx;
	padding-left: 180rpx;
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
		padding: 100rpx 10rpx 100rpx 10rpx;
		background: #ffffff;

		.u-collapse-item {
			width: 100%;
		}

		.u-collapse-head {
			position: relative;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #333333;
			font-size: 28rpx;
			line-height: 1;
			padding: 10rpx 20rpx 10rpx 6rpx;
			text-align: left;

			.check {
				width: 30px;
			}
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
			padding: 10rpx 20rpx 10rpx 6rpx;

			.child {
				max-height: 40vh;
				overflow: scroll;
				position: relative;
			}

			.childPart {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 10rpx 0;

				.left {
					line-height: 50rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					padding-left: 60rpx;
				}

				.childleft {
					padding-left: 180rpx;
				}

				.action {
					display: flex;
					justify-content: space-between;
					width: 40%;
					margin-left: 20rpx;

					.right {
						font-size: 24rpx;
						color: #2979ff;
						margin: 4rpx;
					}

					.red {
						color: #fa3534;
					}
				}
			}
		}
	}
}

.newpublic {
	.Model {
		.list {
			padding: 20rpx 0;
			background: #ffffff;

			.title {
				line-height: 60rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				color: #333333;
				font-weight: bold;
				font-size: 26rpx;
				color: #333333;
				text-align: center;
			}

			.swipetxt {
				white-space: pre-wrap;
				color: #666666;
				line-height: 40rpx;
				font-size: 24rpx;
				padding: 20rpx 30rpx;
			}

			.info {
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;
				width: 50%;
				min-width: 350rpx;
				margin: 0 auto;
				line-height: 50rpx;
				margin-bottom: 2rpx;

				.left,
				.right {
					font-size: 26rpx;
					color: #999999;
				}
			}
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

		.right {
			font-size: 30rpx;
			color: #ffffff;
		}
	}

	.content {
		.form {
			background: #ffffff;
			padding: 10rpx 30rpx 30rpx 30rpx;
			margin-bottom: 2rpx;
			width: 100%;
		}

		.editpart {
			width: 100%;
			height: 50vh;
			overflow: scroll;

			.editor {
				padding: 0 10rpx;
				height: 96%;
				border: 2rpx solid #eeeeee;
				overflow: scroll;

				/deep/.ql-toolbar.ql-snow {
					border: none !important;
					border-bottom: 2rpx solid #eeeeee !important;
					display: none;
				}

				/deep/.ql-container.ql-snow {
					border: none !important;
				}
			}
		}

		.range {
			margin: 2rpx 0;
		}

		.submit {
			width: 90%;
		}

		.action-bottom {
			width: 100%;
			bottom: 0;
			position: fixed;
			background: #ffffff;
			padding: 20rpx 0;

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
	}
}
</style>
