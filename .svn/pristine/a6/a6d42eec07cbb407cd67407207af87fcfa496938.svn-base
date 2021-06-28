<template>
	<view class="container">
		<!-- 操作工具 -->
		<view class="tool-view">
			<view class="tool">
				<view class="single">
					<image src="../../static/icon/abold.png" mode="" @click="setBold" v-if="showBold"></image>
					<image src="../../static/icon/bold.png" mode="" @click="setBold" v-else></image>
				</view>
				<view class="single">
					<image src="../../static/icon/aitalic.png" mode="" @click="setItalic" v-if="showItalic"></image>
					<image src="../../static/icon/italic.png" mode="" @click="setItalic" v-else></image>
				</view>
				<view class="single">
					<image src="../../static/icon/aunder.png" mode="" @click="setIns" v-if="showIns"></image>
					<image src="../../static/icon/under.png" mode="" @click="setIns" v-else></image>
				</view>
				<!-- <view class="single">
					<image src="../../static/icon/aheader.png" mode="" @click="setHeader" v-if="showHeader"></image>
					<image src="../../static/icon/header.png" mode="" @click="setHeader" v-else></image>
				</view> -->
				<view class="single">
					<image src="../../static/icon/acenter.png" mode="" @click="setCenter" v-if="showCenter"></image>
					<image src="../../static/icon/center.png" mode="" @click="setCenter" v-else></image>
				</view>
				<view class="single">
					<image src="../../static/icon/aright.png" mode="" @click="setRight" v-if="showRight"></image>
					<image src="../../static/icon/right.png" mode="" @click="setRight" v-else></image>
				</view>
				<view class="single">
					<image src="../../static/icon/undo3.png" mode="" @click="undo"></image>
				</view>
				<view class="single">
					<image src="../../static/icon/undo3.png" mode="" class="redo" @click="redo"></image>
				</view>
				<view class="single">
					<image src="../../static/icon/delete3.png" mode="" @click="del"></image>
				</view>
			</view>
		</view>
		<!-- <editor class="ql-container" :placeholder="placeholder" :show-img-size="true" :show-img-toolbar="true"
		 :show-img-resize="true" @ready="onEditorReady" id="editor" @statuschange="statuschange" @focus="editFocus" @blur="editBlur"
		 ref="editot"></editor> -->
		 <editor class="ql-container" :placeholder="placeholder"  @ready="onEditorReady" id="editor" @statuschange="statuschange" ref="editot"></editor>
		<!-- 清空确认框 -->
		<u-modal v-model="showDel" @confirm="delConfirm" content="您确认要清空内容吗？" :show-title="false" :show-cancel-button="true"
		 :confirm-style="{'color':'#fa3534'}"></u-modal>
	</view>
</template>

<script>
	export default {
		props: {
			// 点击图片时显示图片大小控件
			showImgSize: {
				type: Boolean,
				default: false
			},
			// 点击图片时显示工具栏控件
			showImgToolbar: {
				type: Boolean,
				default: false
			},
			// 点击图片时显示修改尺寸控件
			showImgResize: {
				type: Boolean,
				default: false
			},
			// 占位符
			placeholder: {
				type: String,
				default: '开始输入...'
			},
			// 图片上传的地址
			uploadFileUrl: {
				type: String,
				default: '#'
			},
			// 上传文件时的name
			fileKeyName: {
				type: String,
				default: 'file'
			},
			// 上传图片时，http请求的header
			header: {
				type: Object
			},
			// 初始化html
			html: {
				type: String
			}
		},
		computed: {

		},
		data() {
			return {
				showMoreTool: false,
				showBold: false,
				showItalic: false,
				showIns: false,
				showHeader: false,
				showCenter: false,
				showRight: false,
				showSettingLayer: false,
				showDel: false,
				activeColor: '#00b2a4'
			};
		},
		methods: {
			onEditorReady(e) {
				uni.createSelectorQuery()
					.in(this)
					.select('.ql-container')
					.fields({
						size: true,
						context: true
					}, res => {
						this.editorCtx = res.context;
						this.editorCtx.setContents({
							html: this.html
						})
					})
					.exec();
			},
			undo() {
				this.editorCtx.undo();
			},
			// 插入图片
			insertImage() {
				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: async (res) => {
						var tempFilePaths = res.tempFilePaths;
						uni.showLoading({
							title: '正在上传中...'
						})
						for (let temp of tempFilePaths) {
							// 图片上传服务器
							await uni.uploadFile({
								url: this.uploadFileUrl,
								filePath: temp,
								name: this.fileKeyName,
								header: this.header,
								success: res => {
									// 上传完成后处理
									this.editorCtx.insertImage({
										src: temp, // 此处需要将图片地址切换成服务器返回的真实图片地址
										alt: '图片',
										success: function(e) {}
									});
									uni.hideLoading()
								},

							});
						}
					}
				});
			},
			insertDivider() {
				this.editorCtx.insertDivider();
			},
			redo() {
				this.editorCtx.redo();
			},
			showMore() {
				this.showMoreTool = !this.showMoreTool;
				this.editorCtx.setContents()
			},
			setBold() {
				this.showBold = !this.showBold;
				this.editorCtx.format('bold');

			},
			setItalic() {
				this.showItalic = !this.showItalic;
				this.editorCtx.format('italic');
			},
			checkStatus(name, detail, obj) {
				if (detail.hasOwnProperty(name)) {
					this[obj] = true;
				} else {
					this[obj] = false;
				}
			},
			statuschange(e) {
				var detail = e.detail;
				this.checkStatus('bold', detail, 'showBold');
				this.checkStatus('italic', detail, 'showItalic');
				this.checkStatus('ins', detail, 'showIns');
				this.checkStatus('header', detail, 'showHeader');
				if (detail.hasOwnProperty('align')) {
					if (detail.align == 'center') {
						this.showCenter = true;
						this.showRight = false;
					} else if (detail.align == 'right') {
						this.showCenter = false;
						this.showRight = true;
					} else {
						this.showCenter = false;
						this.showRight = false;
					}
				} else {
					this.showCenter = false;
					this.showRight = false;
				}
			},
			setIns() {
				this.showIns = !this.showIns;
				this.editorCtx.format('ins');
			},
			setHeader() {
				this.showHeader = !this.showHeader;
				this.editorCtx.format('header', this.showHeader ? 'H2' : false);
			},
			setCenter() {
				this.showCenter = !this.showCenter;
				this.editorCtx.format('align', this.showCenter ? 'center' : false);
			},
			setRight() {
				this.showRight = !this.showRight;
				this.editorCtx.format('align', this.showRight ? 'right' : false);
			},
			showSetting() {
				this.showSettingLayer = !this.showSettingLayer;
			},
			del() {
				this.showDel = true
			},
			delConfirm() {
				this.editorCtx.clear()
				this.showDel = false
			},
			getHtml() {
				this.editorCtx.getContents({
					success: res => {
						this.$emit('editOk', res);
					}
				})
			},
			clear() {
				this.editorCtx.setContents({
					html: '<p><br></p>'
				});
			}

		}
	};
</script>

<style scoped lang="less">
	.container {
		box-sizing: border-box;
		padding-bottom: 20rpx;
		border: 2rpx solid #EEEEEE;
		width: 100%;

	}

	.ql-container {
		line-height: 160%;
		font-size: 32rpx;
		width: 100%;
		padding: 0 20rpx;
		height: auto;
		max-height: 42vh;
		overflow-y: auto;
	}

	.tool {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-bottom: 2rpx solid #eee;
		width: 100%;
		position: relative;

		.single {

			image {
				height: 40rpx;
				width: 40rpx;
				font-size: 32rpx;
				line-height: 80rpx;
			}

			.redo {
				transform: scale(-1, 1);
			}

		}
	}
</style>
