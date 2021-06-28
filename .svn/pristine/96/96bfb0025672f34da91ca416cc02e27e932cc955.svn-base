<template>
	<view class="setting">
		<u-sticky :offset-top="offset">
			<view>
				<u-tabs :list="sublist" :is-scroll="false" :current="curNow" @change="sectionChange" active-color="#6ecac3"
				 bg-color='#f6fff9' height='90'></u-tabs>
			</view>
		</u-sticky>
		<swiper :style="{height: subHeight+15+'px'}" :current="subIndex" @change="swiperChange">
			<swiper-item>
				<view class="subpart">
					<!-- 账户 -->
					<!-- 搜索 -->
					<view class="subtop">
						<view class="subsearch">
							<u-search placeholder="请输入姓名" v-model="accountName" shape="square" :action-style="actionStyle" border-color='#4abdb4'
							 bg-color="#ffffff" @search="searchAccount()" @custom="searchAccount()" @clear="clearAccount()" @change="searchInput"></u-search>
						</view>
						<view class="subnew">
							<view class="new" @click="handleAccount('')">
								新增账户
							</view>
						</view>
					</view>
					<!-- 表单 -->
					<view class="table-part">
						<u-table border-color="#6ecac3">
							<u-tr class="u-tr">
								<u-th class="u-th" width="20%">姓名</u-th>
								<u-th class="u-th" width="20%">角色</u-th>
								<u-th class="u-th" width="30%">电话</u-th>
								<u-th class="u-th">操作</u-th>
							</u-tr>
						</u-table>
					</view>
				</view>
				<view class="wrap" :style="{height: subHeight+10+'px'}">
					<mescroll-uni :down="downOption" @init="mescrollInit0" @down="downCallback" @up="upCallback" :up="upOption"
					 @scroll="scrollfun" :fixed="false" bottom="160rpx">
						<!-- 表单 -->
						<view class="subpart">
							<view class="table-part">
								<u-table>
									<u-tr class="u-tr" v-for="(item, index) in tab0.list"  :key="index">
										<u-td class="u-td" width="20%">{{item.name}}</u-td>
										<u-td class="u-td" width="20%">{{item.role_name}}</u-td>
										<u-td class="u-td" width="30%">{{item.phone}}</u-td>
										<u-td class="u-td">
											<view class="action-part">
												<view class="edit" @click="handleAccount(item)">编辑</view>
												<view class="del" @click="delAccount(item,index)">删除</view>
												<!-- <view class="code" @click="IMEIAccount(item)">清空</view> -->
											</view>
										</u-td>
									</u-tr>
								</u-table>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="subpart">
					<!-- 角色 -->
					<!-- 搜索 -->
					<view class="subtop">
						<view class="subsearch">
							<u-search placeholder="请输入角色名称" v-model="roleName" shape="square" :action-style="actionStyle" border-color='#4abdb4'
							 bg-color="#ffffff" @search="searchRole()" @custom="searchRole()" @clear="clearRole()" @change="searchInput2"></u-search>
						</view>
						<view class="subnew">
							<view class="new" @click="newORedit('')">
								新增角色
							</view>
						</view>
					</view>
					<view class="table-part">
						<u-table border-color="#6ecac3">
							<u-tr class="u-tr">
								<u-th class="u-th" width="30%">角色</u-th>
								<u-th class="u-th" width="30%">菜单权限</u-th>
								<u-th class="u-th">操作</u-th>
							</u-tr>
						</u-table>
					</view>
				</view>
				<!-- 表单 -->
				<view class="wrap" :style="{height: subHeight+10+'px'}">
					<mescroll-uni :down="downOption" @init="mescrollInit1" @down="downCallback" @up="upCallback" :up="upOption1"
					 @scroll="scrollfun" :fixed="false" bottom="160rpx">
						<view class="subpart">
							<view class="table-part">
								<u-table>
									<u-tr class="u-tr" v-for="(item,index) in tab1.list" :key="index">
										<u-td class="u-td" width="30%">{{item.role_name}}</u-td>
										<u-td class="u-td" width="30%">
											<view class="" v-for="(role,index1) in item.menus" :key="index1">{{role.menu_name}}</view>
										</u-td>
										<u-td class="u-td">
											<view class="action-part">
												<view class="see" @click="see(item)">查看</view>
												<view class="edit" @click="newORedit(item)">编辑</view>
												<view class="del" @click="del(index,item)" v-if="index>2">删除</view>
											</view>
										</u-td>
									</u-tr>
								</u-table>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="subpart">
					<!-- 字段配置 -->
					<!-- 搜索 -->
					<view class="subtop">
						<view class="subsearch">
							<u-search placeholder="请输入单位名称" v-model="fieldsName" shape="square" :action-style="actionStyle" border-color='#4abdb4'
							 bg-color="#ffffff" @search="searchFields()" @custom="searchFields()" @clear="clearFields()" @change="searchInput3"></u-search>
						</view>
						<view class="subnew">
							<view class="new" @click="handleFields('','')">
								新增单位
							</view>
						</view>
					</view>
				</view>
				<view class="wrap" :style="{height: subHeight+10+'px'}">
					<mescroll-uni :down="downOption" @init="mescrollInit2" @down="downCallback" @up="upCallback" :up="upOption"
					 @scroll="scrollfun" :fixed="false" bottom="120rpx">

						<!-- 折叠面板 -->
						<view class="collapsePart">
							<view class="u-collapse-item" v-for="(item,index) in tab2.list" :key="index">
								<view :hover-stay-time="200" class="u-collapse-head">
									<block>
										<view class="u-icon-wrap" @click.stop="headClick(index,item)">
											<u-icon v-if="arrow" :class="{ 'u-arrow-down-icon-active': item.isShow }" class="u-arrow-down-icon" name="arrow-down"></u-icon>
										</view>
										<view class="u-collapse-title u-line-1" @click.stop="headClick(index,item)">
											{{item.unit_name}}
										</view>
										<view class="action">
											<view class="right" @click="handleChild(index,1,'','')">
												新增子单位
											</view>
											<view class="right" @click="handleFields(item,index)">
												编辑
											</view>
											<view class="right red" @click="delFields(item,index)">
												删除
											</view>
										</view>
									</block>
								</view>

								<view class="u-collapse-body" v-if="item.isShow">
									<view class="u-collapse-content" v-for="(i,index1) in item.secondunit" :key="index1">
										<view class="childPart">
											<view class="left">
												{{i.unit_name}}
											</view>
											<view class="action">
												<view class="right" @click="handleChild(index,2,index1,i)">
													编辑
												</view>
												<view class="right red" @click="delChild(index,index1,i)">
													删除
												</view>
											</view>
										</view>
									</view>
									<view class="u-collapse-content" v-if="item.secondunit.length==0">
										<view class="empty-tips">
											暂无子单位~
										</view>
									</view>
								</view>
							</view>
						</view>
					</mescroll-uni>
				</view>
			</swiper-item>
		</swiper>


		<!-- 新增或编辑账户弹框 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showAccount" :mode="curMode" width="40%" height="80%" z-index="998">
				<view class="roleModel">
					<view class="roleTop">
						{{accountTopName}}
					</view>
					<view class="left" v-if="accountType" @click="downExcel()" :class="ipadFlag?'ipadPos':''">
						下载模板
					</view>
					<view>
						<l-file ref="lFile" @up-success="onSuccess"></l-file>
						<view class="right" v-if="accountType" @click="onUpload()" :class="ipadFlag?'ipadPos':''">
							批量导入
						</view>
					</view>
					<!-- 加一 -->
					<view v-for="(item,index) in accountList" :key="index" class="part">
						<view class="rolePart">
							<view class="name">
								<text>*</text>姓名
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.name" type="text" :border="true" height="70" placeholder="请输入姓名" @input="replaceInput(index)"/>
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								<text>*</text>手机
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.phone" type="number" :border="true" height="70" placeholder="请输入手机号码" maxlength="11" @input='replacePhone(index)'/>
								</view>
							</view>
						</view>
						<view class="rolePart" v-if="!accountType">
							<view class="name">
								<text>*</text>密码
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.password" type="password" :border="true" :password-icon="true" placeholder="请输入密码" height="70" maxlength="6" :clearable="false"/>
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								<text>*</text>角色
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.accountfunction" type="select" :border="true" @click="openAccountList (index)" height="70"
									 placeholder="点击选择角色" />
								</view>
							</view>
						</view>
					</view>
					<view class="addcount" v-if="accountType">
						<u-icon @click="addAccount()" name="man-add-fill" color="#6ecac3" size="44" class="personicon"></u-icon>
						<u-icon @click="deleteAccount()" name="person-delete-fill" color="#fa3534" size="40" class="personicon" v-if="accountList.length>1"></u-icon>
						<u-icon name="person-delete-fill" color="#c8c9cc" size="40" class="personicon" v-else></u-icon>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="cancelAccount()">
							取消
						</view>
						<view class="sure" @click="sureAccount(accountType)">
							确定
						</view>
					</view>
				</view>

			</u-popup>
		</view>
		<u-action-sheet :list="accountSheetList" v-model="showAccountList" @click="accountSheetCallback" border-radius="20"></u-action-sheet>
		<!-- 删除账户弹框 -->
		<u-modal v-model="showAccountdel" @confirm="accountdel" content="您确认要删除吗？" :show-title="false" :show-cancel-button="true"
		 :confirm-style="{'color':'#fa3534'}"></u-modal>
		<!-- 新增或编辑角色弹框 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showRole" :mode="curMode" width="40%" height="80%" z-index="998">
				<view class="roleModel">
					<view class="roleTop">
						{{roleTopName}}
					</view>
					<view class="rolePart" v-if="roleType">
						<view class="name">
							<text>*</text>角色名称
						</view>
						<view class="content">
							<view class="limit">
								<u-input v-model="roleform.name" type="text" :border="true" height="70" placeholder="请输入角色名称" @input="replaceInput2()"/>
							</view>
						</view>
					</view>
					<view class="rolePart">
						<view class="name">
							<text>*</text>角色职能
						</view>
						<view class="content">
							<view v-if="roleType" class="limit">
								<u-input v-model="roleform.roleFunction" type="select" :border="true" @click="showSheetList = true" height="70" />
							</view>
							<view class="limit" v-else>
								<u-input v-model="roleform.roleFunction" type="text" :border="true" height="70" disabled class="gray" />
							</view>
						</view>
					</view>
					<view class="rolePart column">
						<view class="name">
							<text>*</text>角色权限
						</view>
						<view class="content">
							<u-checkbox-group width='50%' icon-size="30">
								<u-checkbox v-model="item.checked" v-for="(item, index) in checkboxList" :key="index" :name="item.name"
								 active-color="#4abdb4">
									{{ item.name }}
								</u-checkbox>
							</u-checkbox-group>
						</view>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="cancelRole()">
							取消
						</view>
						<view class="sure" @click="sureRole(roleType)">
							确定
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<u-action-sheet :list="roleSheetList" v-model="showSheetList" @click="roleSheetCallback" border-radius="20"></u-action-sheet>
		<!-- 查看角色弹框 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="seeRole" :mode="curMode" width="40%" height="80%" z-index="998">
				<view class="roleModel">
					<view class="roleTop">
						详情
					</view>
					<view class="roletablePart">
						<u-table border-color="#6ecac3" class="roleTable">
							<u-tr>
								<u-th width="30%">角色</u-th>
								<u-th>人员列表</u-th>
							</u-tr>
							<u-tr>
								<u-td width="30%">{{currentRole}}</u-td>
								<u-td v-if="rolepeople&&rolepeople.length">
									<view class="person" v-for="(item,index1) in rolepeople" :key="index1">
										{{item.name}}
									</view>
								</u-td>
								<u-td v-else>
									<view class="person">
										<a-empty :changing="false" text="暂无相关人员" :marginShow="false"></a-empty>
									</view>
								</u-td>
							</u-tr>
						</u-table>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 删除角色弹框 -->
		<u-modal v-model="showRoledel" @confirm="roledel" content="您确认要删除吗？" :show-title="false" :show-cancel-button="true"
		 :confirm-style="{'color':'#fa3534'}"></u-modal>


		<!-- 新增或编辑父单位弹框 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showFields" :mode="curMode" width="40%" height="80%" z-index="998">
				<view class="roleModel">
					<view class="roleTop">
						{{FieldsTopName}}
					</view>
					<view class="left" v-if="FieldsType" @click="uploadUnit" :class="ipadFlag?'ipadPos':''">
						下载模板
					</view>
					<view class="right">
						<l-file ref="lFile" @up-success="onSuccess1"></l-file>
						<view class="right" v-if="FieldsType" @click="onUpload1()" :class="ipadFlag?'ipadPos':''">
							批量导入
						</view>
					</view>
					<!-- 加一 -->
					<view v-for="(item,index) in FieldsList" :key="index" class="part">
						<view class="rolePart">
							<view class="name">
								<text>*</text>单位名称
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.company" type="text" :border="true" height="70" placeholder="请输入单位名称" @input="replaceInput3(index)"/>
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								负责人
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.name" type="text" :border="true" height="70" placeholder="请输入负责人姓名" @input="replaceInput4(index)"/>
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								负责人电话
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.phone" type="number" :border="true" height="70" placeholder="请输入手机号码" maxlength="11" />
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								单位地址
							</view>
							<view class="content">
								<u-input v-model="item.address" type="textarea" :border="true" height="70" placeholder="请输入单位地址" @input="replaceInput5(index)"/>
							</view>
						</view>
					</view>
					<view class="addcount" v-if="FieldsType">
						<u-icon @click="addFields()" name="plus" color="#6ecac3" size="44" class="personicon"></u-icon>
						<u-icon @click="deleteFields()" name="minus" color="#fa3534" size="40" class="personicon" v-if="FieldsList.length>1"></u-icon>
						<u-icon name="minus" color="#c8c9cc" size="40" class="personicon" v-else></u-icon>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="cancelFields()">
							取消
						</view>
						<view class="sure" @click="sureFields(FieldsType)">
							确定
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 删除父单位 -->
		<u-modal v-model="showFieldsdel" @confirm="Fieldsdel" content="您确认要删除吗？" :show-title="false" :show-cancel-button="true"
		 :confirm-style="{'color':'#fa3534'}"></u-modal>
		<!-- 新增或编辑子单位弹框 -->
		<view @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
			<u-popup v-model="showChild" :mode="curMode" width="40%" height="80%" z-index="998">
				<view class="roleModel">
					<view class="roleTop">
						{{ChildTopName}}
					</view>
					<view v-for="(item,index) in ChildList" :key="index" class="part">
						<view class="rolePart">
							<view class="name">
								所属单位
							</view>
							<view class="content">
								<view class="title">
									{{item.parentcompany}}
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								<text>*</text>单位名称
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.company" type="text" :border="true" height="70" placeholder="请输入子单位名称" @input="replaceInput6(index)"/>
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								负责人
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.name" type="text" :border="true" height="70" placeholder="请输入负责人姓名" @input="replaceInput7(index)"/>
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								负责人电话
							</view>
							<view class="content">
								<view class="limit">
									<u-input v-model="item.phone" type="number" :border="true" height="70" placeholder="请输入手机号码" maxlength="11" />
								</view>
							</view>
						</view>
						<view class="rolePart">
							<view class="name">
								单位地址
							</view>
							<view class="content">
								<u-input v-model="item.address" type="textarea" :border="true" height="70" placeholder="请输入单位地址" @input="replaceInput8(index)"/>
							</view>
						</view>
					</view>
					<view class="roleAction">
						<view class="cancel" @click="cancelChild()">
							取消
						</view>
						<view class="sure" @click="sureChild(ChildType)">
							确定
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		<!-- 删除子单位 -->
		<u-modal v-model="showChildel" @confirm="Childel" content="您确认要删除吗？" :show-title="false" :show-cancel-button="true"
		 :confirm-style="{'color':'#fa3534'}"></u-modal>
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	var timer //判断页面滚动
	import debounce from '@/uview-ui/libs/function/debounce.js';
	import helper from '@/common/helper.js'
	import md5 from '@/common/md5.js';
	import {
		uploadUnitTemplate,
		uploadUserTemplate
	} from '@/api/standard.js'
	import {
		listUsers,
		roleandrolemenu,
		unitlist,
		unitlistsearch
	} from '@/api/setting.js'
	import lFile from '@/components/l-file/l-file.vue'
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	export default {
		props: {
			offset: {
				type: Number,
				default: 0
			},
			subHeight: {
				type: Number,
				default: 0
			},
			curMode: {
				type: String,
				default: 'bottom'
			}
		},
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
				old: {
					scrollTop: 0,
					isScrollUp: false
				},
				//触摸弹窗坐标及状态
				touchDotX: 0,
				touchDotY: 0,
				touchMoveX: 0,
				touchMoveY: 0,
				time: 0,
				interval: 0,
				// 头部导航
				curNow: 0, //当前选中
				subIndex: 0, //当前选中内容
				sublist: [{
						name: '账户'
					},
					{
						name: '角色'
					},
					{
						name: '单位配置'
					}
				],
				accountTopName: '新增账户',
				roleTopName: '新增角色',
				FieldsTopName: '新增单位',
				ChildTopName: '新增子单位',
				accountName: "",
				downOption: {
					auto: true //是否在初始化后,自动执行下拉回调callback; 默认true
				},

				upOption: {
					onScroll: true,
					auto: false,
					noMoreSize: 5,
					textNoMore: '我也是有底线的~',
					offset: 300
				},
				upOption1: {
					onScroll: true,
					auto: false,
					noMoreSize: 3,
					textNoMore: '我也是有底线的~',
					offset: 300
				},
				mescroll: null, //mescroll实例对象
				tab0: {
					mescroll: null,
					isListInit: false,
					scrollY: 0,
					list: []
				},
				tab1: {
					mescroll: null,
					isListInit: false,
					scrollY: 0,
					list: []
				},
				tab2: {
					mescroll: null,
					isListInit: false,
					scrollY: 0,
					list: []
				},
				globalData: {
					"uid": uni.getStorageSync("USER_ID"),
					"company_id": uni.getStorageSync("company_id"),
					"pageNum": 0,
					"type": "",
					"keywords": ""
				},
				showAccount: false,
				accountType: false,
				showAccountdel: false,
				roleName: '',
				showRole: false,
				roleType: true,
				seeRole: false,
				showRoledel: false,
				fieldsName: '',
				showFields: false,
				FieldsType: true,
				arrow: true, //是否显示箭头
				showFieldsdel: false,
				showChildel: false,
				showAccountList: false,
				accountList: [],
				accountSheetList: [],
				currentRole: '',
				rolepeople: [],
				FieldsList: [],
				showChild: false,
				ChildList: [],
				checkboxList: [],
				roleSheetList: [{
					"value": "3",
					"text": "检查员"
				}, {
					"value": "2",
					"text": "组长"
				}, {
					"value": "1",
					"text": "专责"
				}],
				showSheetList: false,
				openindex: "",
				userid: "",
				deluser: {},
				deluserindex: "",
				roleform: {
					name: '',
					roleFunction: '检查员',
					rolecheckList: []
				},
				deleteroleid: "",
				deleteroleindex: "",
				editroleid: "",
				deleteunitid: "",
				deleteunitindex: "",
				deletechildunitid: "",
				deletechildunitindex1: "",
				deletechildunitindex: "",
				parentcompany: "",
				parentcompanyid: "",
				unitindex: "",
				bianunitid: "",
				bianindex: "",
				bianunitidchild: "",
				editunit: "",
				editunitchild: "",
				ipadFlag: false,
				handleAlock: false,
				lockaccountdel: false,
				seelock: false,
				eaitlock: false,
				lockroledel: false,
				handleFlock: false,
				handleClock: false,
				delFlock: false,
				delClock: false,
				downlock: false,
				unitlock: false,
				sureAlock: false,
				sureRlock: false,
				sureFlock: false,
				sureClock: false,
				password:''
			}
		},
		// watch: {
		// 	//为空时自动搜索
		// 	accountName(newVal, oldVal) {
		// 		if (newVal == '' && oldVal != '') {
		// 			this.clearAccount();
		// 		}
		// 	},
		// 	roleName(newVal, oldVal) {
		// 		if (newVal == '' && oldVal != '') {
		// 			this.clearRole();
		// 		}
		// 	},
		// 	fieldsName(newVal, oldVal) {
		// 		if (newVal == '' && oldVal != '') {
		// 			this.clearFields();
		// 		}
		// 	}
		// },
		created() {
			if (this.curMode == 'left') {
				this.ipadFlag = true;
			} else {
				this.ipadFlag = false;
			}
		},
		methods: {
			searchInput(value){
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
				setTimeout(()=>{
					let endvalue=value.replace(patrn,'')
					this.accountName = endvalue;
					debounce(this.searchAccount(), 500);
				},100)
			},
			searchInput2(value){
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
				setTimeout(()=>{					
					let endvalue=value.replace(patrn,'')
					this.roleName = endvalue;
					debounce(this.searchRole(), 500);
				},100)
			},
			searchInput3(value){
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g;
				setTimeout(()=>{
					let endvalue=value.replace(patrn,'')
					this.fieldsName = endvalue;
					debounce(this.searchFields(), 500);
				},100)
			},
			// 姓名
			replaceInput(index) { 
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.accountList[index].name;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.accountList[index].name = endvalue;
				},100)
			},
			// 手机号码
			replacePhone(index){
				setTimeout(()=>{
					let str = this.accountList[index].phone;
					if(str.length==11){
						let endvalue='';
						endvalue=str.substring(str.length-6);
						this.accountList[index].password = endvalue;
					}
				},100)	
			},
			//角色名称
			replaceInput2() {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.roleform.name;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.roleform.name= endvalue;
				},100)
			},
			//父单位名称
			replaceInput3(index) {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.FieldsList[index].company;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.FieldsList[index].company = endvalue;
				},100)
			},
			//父单位负责人
			replaceInput4(index) {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.FieldsList[index].name;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.FieldsList[index].name = endvalue;
				},100)
			},
			//父单位地址
			replaceInput5(index) {		
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.FieldsList[index].address;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.FieldsList[index].address = endvalue;
				},100)
			},
			//子单位名称
			replaceInput6(index) {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.ChildList[index].company;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.ChildList[index].company = endvalue;
				},100)
			},
			//子单位负责人
			replaceInput7(index) {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.ChildList[index].name;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.ChildList[index].name = endvalue;
				},100)
			},
			//子单位地址
			replaceInput8(index) {
				let patrn = /[`&()\+"{}|\/'\\[\]（）\|“”‘']/g; 
				setTimeout(()=>{
					let value = this.ChildList[index].address;
					let endvalue='';
					endvalue=value.replace(patrn,'')
					this.ChildList[index].address = endvalue;
				},100)
			},
			
			scrollfun() {
				// 只要滚动就清除状态
				clearTimeout(timer)
				timer = setTimeout(() => {
					if (this.curNow == 0) {
						this.old.scrollTop = this.tab0.mescroll.scrollTop
						this.old.isScrollUp = this.tab0.mescroll.isScrollUp
						if (this.old.scrollTop <= 50 && this.old.isScrollUp == false && this.tab0.list.length > 14) {
							this.tab0.mescroll.scrollTo(0, 0)
							this.old.scrollTop = 0;
							this.$emit('scorllway', false)
						}
						// 告知标识 -> 结束滚动
						if (this.old.scrollTop > 150 && this.old.isScrollUp == true && this.tab0.list.length > 14) {
							this.$emit('scorllway', true)
						}
					}
					if (this.curNow == 1) {
						this.old.scrollTop = this.tab1.mescroll.scrollTop
						this.old.isScrollUp = this.tab1.mescroll.isScrollUp
						if (this.old.scrollTop <= 50 && this.old.isScrollUp == false && this.tab1.mescroll.num > 1) {
							this.tab1.mescroll.scrollTo(0, 0)
							this.old.scrollTop = 0;
							this.$emit('scorllway', false)
						}
						// 告知标识 -> 结束滚动
						if (this.old.scrollTop > 150 && this.old.isScrollUp == true && this.tab1.mescroll.num > 1) {
							this.$emit('scorllway', true)
						}
					}
					if (this.curNow == 2) {
						this.old.scrollTop = this.tab2.mescroll.scrollTop
						this.old.isScrollUp = this.tab2.mescroll.isScrollUp
						if (this.old.scrollTop <= 50 && this.old.isScrollUp == false && this.tab2.list.length > 14) {
							this.tab2.mescroll.scrollTo(0, 0)
							this.old.scrollTop = 0;
							this.$emit('scorllway', false)
						}
						// 告知标识 -> 结束滚动
						if (this.old.scrollTop > 150 && this.old.isScrollUp == true && this.tab2.list.length > 14) {
							this.$emit('scorllway', true)
						}
					}

				}, 30);
			},
			//触摸开始事件
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
					this.showAccount = false
					this.showRole = false
					this.seeRole = false
					this.showFields = false
					this.showChild = false
				}
				// 向下滑动 （如果是下边的弹窗）
				if (this.touchMoveY - this.touchDotY >= 40 && this.time < 10 && this.curMode == "bottom") {
					this.showAccount = false
					this.showRole = false
					this.seeRole = false
					this.showFields = false
					this.showChild = false
				}
			},
			// 触摸结束事件 
			touchEnd(e) {
				clearInterval(this.interval); // 清除setInterval 
				this.time = 0;
			},
			//导航切换
			sectionChange(index) {
				var curTab = this.getTabData(this.curNow); //当前tab
				var newTab = this.getTabData(index); //准备切换过去的tab
				this.curNow = index;
				this.subIndex = index;
				if (!newTab.isListInit) {
					// 如果列表没有初始化过,则初始化
					newTab.mescroll.resetUpScroll();

				}
				newTab.mescroll.scrollTo(0, 0)
				this.old.scrollTop = 0;
				this.$emit('scorllway', false)
			},
			// 轮播切换
			swiperChange(e) {
				var curTab = this.getTabData(this.curNow); //当前tab
				var newTab = this.getTabData(e.detail.current); //准备切换过去的tab
				this.subIndex = e.detail.current
				this.curNow = e.detail.current
				if (!newTab.isListInit) {
					// 如果列表没有初始化过,则初始化
					newTab.mescroll.resetUpScroll();
				}
				newTab.mescroll.scrollTo(0, 0)
				this.old.scrollTop = 0;
				this.$emit('scorllway', false)
			},
			getTabData(tabType) {
				if (tabType == 0) {
					return this.tab0;
				} else if (tabType == 1) {
					return this.tab1;
				} else if (tabType == 2) {
					return this.tab2;
				}
			},

			mescrollInit0(mescroll) {
				mescroll.tabType = 0; // 加入标记,便于在回调中取到对应的list
				this.tab0.mescroll = mescroll;
			},
			mescrollInit1(mescroll) {
				mescroll.tabType = 1;
				this.tab1.mescroll = mescroll;
			},
			mescrollInit2(mescroll) {
				mescroll.tabType = 2;
				this.tab2.mescroll = mescroll;
			},
			/*下拉刷新的回调 */
			downCallback(mescroll) {
				if (this.subIndex == 0) {
					this.old.scrollTop = 0;
					this.$emit('scorllway', false);
					this.tab0.mescroll.resetUpScroll();
				} else if (this.subIndex == 1) {
					this.old.scrollTop = 0;
					this.$emit('scorllway', false);
					this.tab1.mescroll.resetUpScroll();
				} else if (this.subIndex == 2) {
					this.old.scrollTop = 0;
					this.$emit('scorllway', false);
					this.tab2.mescroll.resetUpScroll();
				}
			},
			/*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
			upCallback(mescroll) {
				if (this.curNow != mescroll.tabType) {
					mescroll.endSuccess(); // 只处理当前页的回调,避免tab切换过快,触发的回调和当前页不一致的问题
					return;
				}
				if (mescroll.tabType == 0) {
					this.tab0.isListInit = true; //标记列表已初始化,保证列表只初始化一次
					//联网加载数据
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData, totalResult) => {
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
						//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
						mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
						//设置列表数据
						if (mescroll.num == 1) this.tab0.list = []; //如果是第一页需手动制空列表
						this.tab0.list = this.tab0.list.concat(curPageData); //追加新数据
					}, () => {
						if (mescroll.num == 1) this.tab0.isListInit = false;
						mescroll.endErr(); //联网失败的回调,隐藏下拉刷新的状态
					})
				} else if (mescroll.tabType == 1) {
					this.tab1.isListInit = true; //标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData, totalResult) => {
						if (totalResult == 0) {
							mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
							//设置列表数据
							if (mescroll.num == 1) this.tab1.list = []; //如果是第一页需手动制空列表
							this.tab1.list = this.tab1.list.concat(curPageData); //追加新数据
						} else {
							var PageData = [];
							curPageData.forEach(item => {

								let sql = 'select menu_id from sys_menu_table where  status != 1 and role_id = ' + "'" + item.role_id + "'";
								selectSQL('local', sql, res => {

									if (res.length != 0) {

										var ids = "";
										for (var value of res) {
											ids = ids + "'" + value.menu_id + "'" + ",";
										}
										ids = ids.substring(0, ids.length - 1);
										let sql1 =
											'select menu_id,menu_name,menu_url,parent_id,menu_icon from sys_menu where parent_id = 0 and menu_id in (' +
											ids +
											')';

										selectSQL('local', sql1, res1 => {

											if (res1.length != 0) {
												item.menus = res1;
												PageData.push(item);
												if (PageData.length == curPageData.length) {
													mescroll.endBySize(PageData.length, totalResult);
													if (mescroll.num == 1) this.tab1.list = []; //如果是第一页需手动制空列表
													this.tab1.list = this.tab1.list.concat(PageData); //追加新数据

													return;
												}

											} else {
												console.log("登录根据菜单id查询菜单列表未查询出数据！")
											}
										})
									} else {

										console.log('系统暂未给你分配功能菜单！');
									}
								})
							})
						}

					}, () => {

						if (mescroll.num == 1) this.tab1.isListInit = false;
						mescroll.endErr(); //联网失败的回调,隐藏下拉刷新的状态
					})


				} else if (mescroll.tabType == 2) {
					this.tab2.isListInit = true; //标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData, totalResult) => {
						curPageData.forEach(item => {
							item.isShow = false;
						})
						mescroll.endBySize(curPageData.length, totalResult);
						if (mescroll.num == 1) this.tab2.list = []; //如果是第一页需手动制空列表
						this.tab2.list = this.tab2.list.concat(curPageData); //追加新数据
					}, () => {
						if (mescroll.num == 1) this.tab2.isListInit = false;
						mescroll.endErr(); //联网失败的回调,隐藏下拉刷新的状态
					})
				}
			},
			getListDataFromNet(tabcur, pageNum, pageSize, successCallback, errorCallback) {
				// this.globalData.pageNum = pageNum;
				switch (tabcur) {
					case 0:
						this.globalData.type = "0";
						var comp = "'" + this.globalData.company_id + "'";
						let sql = 'select COUNT(user_id) as totalResult from sys_user where name like "%' + this.accountName + '%"' +
							'and status != 1 and company_id = ' + comp;
						selectSQL('local', sql, res => {
							if (res.length != 0) {
								var totalResult = res[0].totalResult;
								var pages = Math.floor(totalResult / pageSize);
								var surplus = totalResult - Math.floor(totalResult / pageSize) * pageSize
								if (surplus > 0) {
									pages = pages + 1;
								}
								var pagebegin = (pageNum - 1) * pageSize;
								pagebegin = "'" + pagebegin + "'";
								var size = "'" + pageSize + "'";
								var company_id = "'" + this.globalData.company_id + "'";
								let selectuser = "";
								if (this.accountName != "") {
									selectuser =
										'select u.user_id,u.password,u.name,u.role_id,u.status,u.phone,u.company_id,r.role_name,r.function_id from sys_user u left join sys_role r on u.role_id=r.role_id where u.company_id = ' +
										company_id + 'and u.status != 1' + ' and u.name like "%' + this.accountName + '%"' +
										' order by u.user_id asc limit ' +
										size + ' offset ' + pagebegin;
								} else {
									selectuser =
										'select u.user_id,u.password,u.name,u.role_id,u.status,u.phone,u.company_id,r.role_name,r.function_id from sys_user u left join sys_role r on u.role_id=r.role_id where u.company_id = ' +
										company_id + ' and u.status != 1' + ' order by u.user_id asc limit ' +
										size + ' offset ' + pagebegin;
								}

								this.selectUser(selectuser, totalResult, successCallback);
							} else {
								console.log("查询用户总数量报错")
								return;
							}
						})
						break;
					case 1:
						this.globalData.type = "1";
						var comp = "'" + this.globalData.company_id + "'";
						let sql1 = 'select COUNT(role_id) as totalResult from sys_role where role_name like "%' + this.roleName + '%"' +
							' and status != 1 and parent_id = ' + comp;
						selectSQL('local', sql1, res => {
							if (res.length != 0) {

								var totalResult = res[0].totalResult;
								var pages = Math.floor(totalResult / pageSize);
								var surplus = totalResult - Math.floor(totalResult / pageSize) * pageSize
								if (surplus > 0) {
									pages = pages + 1;
								}
								var pagebegin = (pageNum - 1) * pageSize;
								pagebegin = "'" + pagebegin + "'";
								var size = "'" + pageSize + "'";
								var company_id = "'" + this.globalData.company_id + "'";
								let selectuser = "";
								if (this.roleName != '') {
									selectuser =
										'select role_id,role_name,parent_id,status,function_id from sys_role where parent_id = ' +
										company_id + 'and status != 1' + ' and role_name like "%' + this.roleName + '%"' +
										' order by role_id asc limit ' +
										size + ' offset ' + pagebegin;
								} else {
									selectuser =
										'select role_id,role_name,parent_id,status,function_id from sys_role where parent_id = ' +
										company_id + ' and status != 1' + ' order by role_id asc limit ' +
										size + ' offset ' + pagebegin;
								}

								this.selectRole(selectuser, totalResult, successCallback);
							} else {
								console.log("查询角色总数量报错")
								return;
							}
						})
						break;
					case 2:
						this.globalData.type = "2";
						var comp1 = "'" + this.globalData.company_id + "'";

						let sql2 = 'select COUNT(unit_id) as totalResult from sys_unit where unit_name like "%' + this.fieldsName + '%"' +
							' and status != 1 and parent_id = 0 and company_id = ' + comp1;
						selectSQL('local', sql2, res => {
							if (res.length != 0) {
								var totalResult = res[0].totalResult;
								var pages = Math.floor(totalResult / pageSize);
								var surplus = totalResult - Math.floor(totalResult / pageSize) * pageSize
								if (surplus > 0) {
									pages = pages + 1;
								}
								var pagebegin = (pageNum - 1) * pageSize;
								pagebegin = "'" + pagebegin + "'";
								var size = "'" + pageSize + "'";

								var company_id = "'" + this.globalData.company_id + "'";

								let selectuser = "";

								if (this.fieldsName != '') {
									selectuser =
										'select unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id from sys_unit where parent_id = 0 and company_id = ' +
										company_id + 'and status != 1' + ' and unit_name like "%' + this.fieldsName + '%"' +
										' order by unit_id asc limit ' +
										size + ' offset ' + pagebegin;
								} else {
									selectuser =
										'select unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id from sys_unit where parent_id = 0 and company_id = ' +
										company_id + ' and status != 1' + ' order by unit_id asc limit ' +
										size + ' offset ' + pagebegin;
								}

								this.selectUnit(selectuser, totalResult, successCallback);
							} else {
								console.log("查询父单位总数量报错")
								return;
							}
						})
						break;
				}
			},
			selectUser(url, pages, successCallback) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						successCallback && successCallback(res, pages);
					} else {
						console.log("分页查询用户数据报错")
						successCallback && successCallback(res, pages);
						return;
					}
				})

			},
			selectRole(url, pages, successCallback) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						successCallback && successCallback(res, pages);
					} else {
						console.log("分页查询角色数据报错")
						successCallback && successCallback(res, pages);
						return;
					}
				})

			},
			selectUnit(url, pages, successCallback) {
				selectSQL('local', url, res => {
					if (res.length != 0) {
						successCallback && successCallback(res, pages);
					} else {
						console.log("分页查询单位数据报错")
						successCallback && successCallback(res, pages);
						return;
					}
				})

			},
			//账户部分start
			searchAccount() {
				var curTab = this.getTabData(this.curNow); //当前tab
				curTab.mescroll.resetUpScroll();


			},
			//点击清除按钮
			clearAccount() {
				this.accountName='';
				// var curTab = this.getTabData(this.curNow); //当前tab
				// curTab.mescroll.resetUpScroll();

			},
			//新增或编辑账户
			handleAccount(item) {
				if (this.handleAlock) return;
				this.handleAlock = true;
				if (item == '') {
					// 新增
					this.accountTopName = '新增账户';
					this.accountType = true;
					var company_id = "'" + this.globalData.company_id + "'";
					let url =
						'select role_id,role_name,parent_id,function_id,status from sys_role  where parent_id = ' +
						company_id + ' and status !=1';
					selectSQL('local', url, res => {
						if (res.length != 0) {
							this.accountSheetList = [];
							res.forEach(item => {
								var good = {
									"text": item.role_name,
									"value": item.role_id
								}
								this.accountSheetList.push(good);
							})
							this.accountList = [{
								name: '',
								phone: '',
								roleid: res[0].role_id,
								accountfunction: res[0].role_name
							}]
							setTimeout(() => {
								this.showAccount = true;
								this.handleAlock = false;
							}, 100)
						} else {
							console.log("新增用户查询角色报错！")
							this.handleAlock = false;
							return;
						}
					})
				} else {
					// 编辑
					this.accountTopName = '编辑账户';
					this.accountType = false;
					var company_id = "'" + this.globalData.company_id + "'";
					let url =
						'select role_id,role_name,parent_id,function_id,status from sys_role  where parent_id = ' +
						company_id + ' and status !=1';
					selectSQL('local', url, res => {
						if (res.length != 0) {
							this.accountSheetList = [];
							res.forEach(item => {
								var good = {
									"text": item.role_name,
									"value": item.role_id
								}
								this.accountSheetList.push(good);
							})
							this.userid = item.user_id;
							this.accountList = [{
								name: item.name,
								phone: item.phone,
								roleid: item.role_id,
								accountfunction: item.role_name,
								password:item.password
							}];
							setTimeout(() => {
								this.showAccount = true;
								this.handleAlock = false;
							}, 100)
						} else {
							console.log("编辑用户查询角色报错！")
							this.handleAlock = false;
							return;
						}
					})
				}
			},
			//删除弹框
			delAccount(USER, index) {
				this.deluser = USER;
				this.deluserindex = index;
				this.showAccountdel = true;
			},
			searchRole() {
				var curTab = this.getTabData(this.curNow); //当前tab
				curTab.mescroll.resetUpScroll();
			},
			clearRole() {
				this.roleName='';
				// var curTab = this.getTabData(this.curNow); //当前tab
				// curTab.mescroll.resetUpScroll();
			},
			//新增或编辑角色
			newORedit(item) {
				if (this.eaitlock) return;
				this.eaitlock = true;
				if (item == '') {
					this.roleTopName = '新增角色';
					this.roleType = true;
					this.checkboxList = [];
					this.roleform.roleFunction = "检查员";
					this.roleform.name = "";
					let url =
						'select menu_id,menu_name,menu_url,parent_id,menu_icon from sys_menu where parent_id = 0';
					selectSQL('local', url, res => {
						if (res.length != 0) {
							var menus = [];
							res.forEach(item => {
								var role = {
									"menu_id": item.menu_id,
									"name": item.menu_name,
									"checked": false,
									"disabled": false
								}
								menus.push(role);
							})
							this.checkboxList = menus;
							this.showRole = true;
							setTimeout(() => {
								this.eaitlock = false;
							}, 500)
						} else {
							console.log("查询主菜单列表报错！")
							this.eaitlock = false;
							return;
						}
					})
				} else {
					this.roleTopName = '编辑角色';
					this.roleType = false;
					var menuids = [];
					item.menus.forEach(it => {
						menuids.push(it.menu_id);
					})
					let url =
						'select menu_id,menu_name,menu_url,parent_id,menu_icon from sys_menu where parent_id = 0';
					selectSQL('local', url, res => {
						if (res.length != 0) {
							var menus = [];
							res.forEach(item => {
								var index = menuids.indexOf(item.menu_id);
								var role = {};
								if (index == -1) {
									role = {
										"menu_id": item.menu_id,
										"name": item.menu_name,
										"checked": false,
										"disabled": false
									}
								} else {
									role = {
										"menu_id": item.menu_id,
										"name": item.menu_name,
										"checked": true,
										"disabled": false
									}
								}
								menus.push(role);
							})

							this.checkboxList = menus;
							this.roleform.roleFunction = item.role_name;
							this.editroleid = item.role_id
							this.showRole = true;
							setTimeout(() => {
								this.eaitlock = false;
							}, 500)

						} else {
							console.log("查询主菜单列表报错！")
							this.eaitlock = false;
							return;
						}
					})



				}
			},



			//确认新增或编辑角色
			sureRole(type) {
				if (this.sureRlock) return;
				this.sureRlock = true;
				let length = 0;
				if (type == true) {
					if (!this.roleform.name) {
						this.$refs.uToast.show({
							title: '角色名称不能为空',
							type: 'warning'
						})
						this.sureRlock = false;
						return;
					}

					this.checkboxList.map(item => {
						if (item.checked) {
							length++;
						}
					})
					if (length == 0) {
						this.$refs.uToast.show({
							title: '请至少勾选一项角色权限',
							type: 'warning'
						})
						this.sureRlock = false;
						return;
					}
					uni.showLoading({
						title: "创建中..."
					});
					this.roleform.rolecheckList = this.checkboxList
					let len = 0;
					var uuid = new Date().getTime();
					var status = "0";
					var fuid = "";
					var direty = "1";
					var deleted = "0";
					if (this.roleform.roleFunction == '检查员') {
						fuid = "3";
					} else if (this.roleform.roleFunction == '组长') {
						fuid = "2";
					} else if (this.roleform.roleFunction == '专责') {
						fuid = "1";
					}
					var time = new Date().getTime();
					let insertrole = 'insert into sys_role values (' + "'" + uuid + "'" + "," + "'" + this.roleform.name + "'" + "," +
						"'" + this.globalData.company_id + "'" + "," + "'" + status + "'" + "," + "'" + fuid +
						"'" + "," + "'" + direty + "'" + "," + "'" + deleted + "'" + "," + "'" + time + "'" + ' ) ';
					executeSQL("local", insertrole, res => {
						this.roleform.rolecheckList.forEach((item, index) => {
							if (item.checked) {
								len++;
								var direty1 = "1";
								var deleted1 = "0";
								var status1 = "0";
								var time1 = new Date().getTime();
								let insermenutable = 'insert into sys_menu_table values (' + "'" + uuid + "'" + "," + "'" + item.menu_id +
									"'" + "," +
									"'" + status1 + "'" + "," + "'" + direty1 + "'" + "," + "'" + deleted1 + "'" + "," + "'" + time1 + "'" +
									' ) ';
								executeSQL("local", insermenutable, res1 => {
									if (len == length) {
										uni.hideLoading();
										this.showRole = false;
										setTimeout(() => {
											this.sureRlock = false;
										}, 500)
										var curTab = this.getTabData(this.curNow); //当前tab
										curTab.mescroll.resetUpScroll();
									}
								})
							}
						})
					})

				} else {
					//编辑
					this.checkboxList.map(item => {
						if (item.checked) {
							length++;
						}
					})
					if (length == 0) {
						this.$refs.uToast.show({
							title: '请至少勾选一项角色权限',
							type: 'warning'
						})
						this.sureRlock = false;
						return;
					}
					uni.showLoading({
						title: "编辑中..."
					});
					this.roleform.rolecheckList = this.checkboxList
					let len = 0;
					var dir = "0";
					var del = "1";
					var tim = new Date().getTime();
					let sql = 'update sys_menu_table set status = 1 ' + "," + ' `delete` = 1 ' + "," +
						' updatetime = ' + "'" + tim + "'" + ' where role_id = ' + "'" + this.editroleid + "'";
					executeSQL("local", sql, res => {})
					this.roleform.rolecheckList.forEach((it, index) => {
						if (it.checked) {
							len++
							var direty1 = "1";
							var deleted1 = "0";
							var status1 = "0";
							var time1 = new Date().getTime();
							let insermenutable = 'insert into sys_menu_table values (' + "'" + this.editroleid + "'" + "," + "'" + it.menu_id +
								"'" + "," +
								"'" + status1 + "'" + "," + "'" + direty1 + "'" + "," + "'" + deleted1 + "'" + "," + "'" + time1 + "'" +
								' ) ';
							executeSQL("local", insermenutable, res1 => {
								if (len == length) {
									uni.hideLoading();
									this.showRole = false;
									setTimeout(() => {
										this.sureRlock = false;
									}, 500)
									var curTab = this.getTabData(this.curNow); //当前tab
									curTab.mescroll.resetUpScroll();
								}
							})
						}
					})
				}
			},

			//查看角色
			see(item) {
				if (this.seelock) return;
				this.seelock = true;
				this.rolepeople = [];
				var company_id = "'" + item.parent_id + "'";
				var role_id = "'" + item.role_id + "'";
				let url =
					'select user_id,password,name,role_id,status,phone,company_id from sys_user  where company_id = ' +
					company_id + ' and status !=1 and role_id = ' + role_id;
				selectSQL('local', url, res => {
					if (res.length != 0) {
						this.rolepeople = res
						this.currentRole = item.role_name;
						this.seeRole = true;
						setTimeout(() => {
							this.seelock = false;
						}, 500)
					} else {
						console.log("查询角色用户报错！")
						this.rolepeople = res
						this.currentRole = item.role_name;
						this.seeRole = true;
						setTimeout(() => {
							this.seelock = false;
						}, 500)
						return;
					}
				})

			},
			del(index, item) {
				this.showRoledel = true;
				this.deleteroleid = item.role_id;
				this.deleteroleindex = index;
			},
			// 字段配置部分start
			//搜索

			searchFields() {
				var company_id = "'" + this.globalData.company_id + "'";
				if (this.fieldsName != '') {
					let selectuser =
						'select unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id from sys_unit where company_id = ' +
						company_id + 'and status != 1' + ' and unit_name like "%' + this.fieldsName + '%"' +
						' order by unit_id';
					selectSQL('local', selectuser, res => {
						if (res.length != 0) {
							this.tab2.list = [];
							var second = [];
							res.forEach(it => {
								if (it.parent_id == "0") {
									this.tab2.list.push(it)
								} else {
									second.push(it)
								}
							})
							var second1 = [];
							second.forEach(it => {
								second1.push(it.parent_id)
							})
							var list1 = [];
							this.tab2.list.forEach(it => {
								list1.push(it.unit_id)
							})

							var arr = this.MergeArray(second1, list1)
							var ids = "";
							for (var value of arr) {
								ids = ids + "'" + value + "'" + ",";
							}
							ids = ids.substring(0, ids.length - 1);
							let sqls =
								'select unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id from sys_unit where unit_id in (' +
								ids + ')';
							selectSQL('local', sqls, res1 => {
								if (res1.length != 0) {
									res1.forEach(its => {
										its.isShow = true;
										its.secondunit = [];
										var indexs = this.findall(second.map(a => a.parent_id), its.unit_id)
										indexs.forEach(itss => {
											its.secondunit.push(second[itss])
										})
									})
									this.tab2.list = res1;
									var curTab = this.getTabData(this.curNow); //当前tab
									curTab.mescroll.lockDownScroll(true);
									curTab.mescroll.lockUpScroll(true);

								} else {
									console.log("查询所有父菜单报错！")

								}
							})

						} else {
							var curTab = this.getTabData(this.curNow); //当前tab
							curTab.mescroll.lockDownScroll(false);
							curTab.mescroll.lockUpScroll(false);
							curTab.mescroll.resetUpScroll();
						}
					})


				} else {
					var curTab = this.getTabData(this.curNow); //当前tab
					curTab.mescroll.lockDownScroll(false);
					curTab.mescroll.lockUpScroll(false);
					curTab.mescroll.resetUpScroll();
				}

			},
			clearFields() {
				this.fieldsName='';
				// var curTab = this.getTabData(this.curNow); //当前tab
				// curTab.mescroll.resetUpScroll();
				// curTab.mescroll.lockDownScroll(false);
				// curTab.mescroll.lockUpScroll(false);
			},

			MergeArray(arr1, arr2) {
				var _arr = new Array();
				for (var i = 0; i < arr1.length; i++) {
					_arr.push(arr1[i]);
				}
				for (var i = 0; i < arr2.length; i++) {
					var flag = true;
					for (var j = 0; j < arr1.length; j++) {
						if (arr2[i] == arr1[j]) {
							flag = false;
							break;
						}
					}
					if (flag) {
						_arr.push(arr2[i]);
					}
				}
				return _arr;
			},
			findall(a, x) {
				var results = [],
					len = a.length,
					pos = 0;
				while (pos < len) {
					pos = a.indexOf(x, pos);
					if (pos === -1) { //未找到就退出循环完成搜索
						break;
					}
					results.push(pos); //找到就存储索引
					pos += 1; //并从下个位置开始搜索
				}
				return results;
			},
			//新增或编辑父单位弹框
			handleFields(item, index) {
				if (this.handleFlock) return;
				this.handleFlock = true;
				if (item == '') {
					// 新增
					this.showFields = true;
					this.FieldsTopName = '新增单位';
					this.FieldsType = true;
					this.FieldsList = [{
						company: '',
						name: '',
						phone: '',
						address: ''
					}];
					setTimeout(() => {
						this.handleFlock = false;
					}, 500)
				} else {
					// 编辑
					this.showFields = true;
					this.FieldsTopName = '编辑单位';
					this.FieldsType = false;
					this.FieldsList = [{
						company: item.unit_name,
						name: item.unit_user,
						phone: item.unit_userphone,
						address: item.address
					}];
					this.bianunitid = item.unit_id;
					this.bianindex = index;
					setTimeout(() => {
						this.handleFlock = false;
					}, 500)
				}
			},
			// 点击collapsehead头部
			headClick(index, item) {
				if (this.fieldsName == '') {
					var company_id = "'" + item.company_id + "'";
					var unit_id = "'" + item.unit_id + "'";
					let url =
						'select unit_id,unit_name,unit_user,unit_userphone,address,parent_id,status,company_id from sys_unit  where company_id = ' +
						company_id + ' and status !=1 and parent_id = ' + unit_id;
					selectSQL('local', url, res => {
						if (res.length != 0) {
							this.tab2.list[index].secondunit = res;
							this.tab2.list[index].isShow = !this.tab2.list[index].isShow;
							this.tab2.list.map((e, inde) => {
								if (inde != index) {
									e.isShow = false;
								}
							})
						} else {
							this.tab2.list[index].secondunit = res;
							this.tab2.list[index].isShow = !this.tab2.list[index].isShow;
							this.tab2.list.map((e, inde) => {
								if (inde != index) {
									e.isShow = false;
								}
							})
						}
					})
				} else {
					this.tab2.list[index].isShow = !this.tab2.list[index].isShow;
					this.tab2.list.map((e, inde) => {
						if (inde != index) {
							e.isShow = false;
						}
					})
				}
			},
			//新增或编辑子单位弹框

			handleChild(index, type, index1, i) {
				if (this.handleClock) return;
				this.handleClock = true;
				this.unitindex = index;
				this.parentcompany = this.tab2.list[index].unit_name;
				this.parentcompanyid = this.tab2.list[index].unit_id;
				if (type == 1) {
					// 新增
					this.showChild = true;
					this.ChildTopName = '新增子单位';
					this.ChildType = true;
					this.ChildList = [{
						company: '',
						name: '',
						phone: '',
						address: '',
						parentcompany: this.parentcompany,
						parentcompanyid: this.parentcompanyid
					}];
					setTimeout(() => {
						this.handleClock = false;
					}, 500)

				} else if (type == 2) {
					this.ChildTopName = '编辑子单位';
					this.ChildType = false;
					this.editunit = index;
					this.editunitchild = index1;
					this.bianunitidchild = i.unit_id;
					this.ChildList = [{
						company: i.unit_name,
						name: i.unit_user,
						phone: i.unit_userphone,
						address: i.address,
						parentcompany: this.parentcompany,
						parentcompanyid: this.parentcompanyid
					}];
					setTimeout(() => {
						this.showChild = true;
						this.handleClock = false;
					}, 100)
				}
			},
			//删除弹框
			delFields(item, index) {
				this.deleteunitid = item.unit_id;
				this.deleteunitindex = index;
				this.showFieldsdel = true;
			},
			//删除弹框
			delChild(index, index1, i) {
				this.deletechildunitid = i.unit_id;
				this.deletechildunitindex1 = index1;
				this.deletechildunitindex = index;
				this.showChildel = true;
			},
			downExcel() {
				if (this.downlock) return;
				this.downlock = true;
				uploadUserTemplate().then(res => {
					uni.showToast({
						title: res,
						icon: 'none',
						duration: 5000
					});
					setTimeout(() => {
						this.downlock = false;
					}, 500)
				})
			},
			uploadUnit() {
				if (this.unitlock) return;
				this.unitlock = true;
				uploadUnitTemplate().then(res => {
					uni.showToast({
						title: res,
						icon: 'none',
						duration: 5000
					});
					setTimeout(() => {
						this.unitlock = false;
					}, 500)
				})
			},
			onSuccess(res) {
				let data = JSON.stringify(res);
				uni.showToast({
					title: data.data,
					icon: 'none'
				});
				this.tab0.mescroll.resetUpScroll();
				this.showAccount = false;
			},
			onUpload() {
				let uid = uni.getStorageSync('USER_ID');
				let functionid = uni.getStorageSync('functionid');
				let company_id = uni.getStorageSync('company_id');
				let _this = this;
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					// nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: _this.$mp.page.$getAppWebview(),
					// #endif
					//非真实地址，记得更换,调试时ios有跨域，需要后端开启跨域并且接口地址不要使用http://localhost/
					url: helper.websiteUrl + 'v1/uploadExcel',
					//默认file,上传文件的key
					name: 'file',
					header: {},
					data: {
						uid: uid,
						functionid: functionid,
						flag: 2,
						company_id: company_id
					}
				});
			},
			onSuccess1(res) {
				let data = JSON.stringify(res);
				uni.showToast({
					title: data.data,
					icon: 'none'
				});
				this.tab2.mescroll.resetUpScroll();
				this.cancelFields()
			},
			onUpload1() {
				let uid = uni.getStorageSync('USER_ID');
				let functionid = uni.getStorageSync('functionid');
				let company_id = uni.getStorageSync('company_id');
				let _this = this;
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					// nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: _this.$mp.page.$getAppWebview(),
					// #endif
					//非真实地址，记得更换,调试时ios有跨域，需要后端开启跨域并且接口地址不要使用http://localhost/
					url: helper.websiteUrl + 'v1/uploadExcel',
					//默认file,上传文件的key
					name: 'file',
					header: {},
					data: {
						uid: uid,
						functionid: functionid,
						flag: 3,
						company_id: company_id
					}
				});
			},
			openAccountList(index) {
				this.openindex = index;
				this.showAccountList = true;
			},

			addAccount() {
				this.accountList = this.accountList.concat([{
					name: '',
					phone: '',
					roleid: this.accountList[this.accountList.length - 1].roleid,
					accountfunction: this.accountList[this.accountList.length - 1].accountfunction
				}])
			},

			deleteAccount() {
				if (this.accountList.length == 1) {
					helper.showToast('至少添加一个用户！');
					return;
				}
				this.accountList.splice(this.accountList.length - 1, 1)
			},
			//取消新增或编辑账户
			cancelAccount() {
				this.showAccount = false;
				this.sureAlock = false;
			},
			//确认新增或编辑账户
			sureAccount(type) {
				if (this.sureAlock) return;
				this.sureAlock = true;
				let namelen = 0;
				let phonelen = 0;
				this.accountList.map(item => {
					if (!item.name) {
						namelen++
					}
					if (!item.phone||(!(/^\d{11}$/.test(item.phone)))) {
						phonelen++
					}
				})
				if (namelen > 0) {
					this.$refs.uToast.show({
						title: '姓名不能为空',
						type: 'warning'
					})
					this.sureAlock = false;
					return
				}
				if (phonelen > 0) {
					this.$refs.uToast.show({
						title: '手机号不正确',
						type: 'warning'
					})
					this.sureAlock = false;
					return
				}
				if (type == true) {
					//新增
					uni.showLoading({
						title: "创建中..."
					});
					let len = this.accountList.length;
					let sqlcount =
						'select count(*) as number from sys_user where status = 0 and company_id = ' +
						"'" + uni.getStorageSync('company_id') + "'";
					selectSQL('local', sqlcount, rescount => {
						let sqlcompanynumber =
							'select function_id from sys_role where role_id = ' +
							"'" + uni.getStorageSync('company_id') + "'";
						selectSQL('local', sqlcompanynumber, rescompanynumber => {
							if (Number(rescount[0].number + len) > Number(rescompanynumber[0].function_id)) {
								helper.showToast("创建账号数量达到上限！")
								uni.hideLoading();
								this.sureAlock = false;
								return;
							} else {
								var phones = [];
								this.accountList.forEach((item, index) => {
									let sql =
										'select user_id,password,name,role_id,status,phone,company_id from sys_user where status = 0 and phone = ' +
										"'" + item.phone + "'";
									selectSQL('local', sql, res => {
										if (res.length == 0) {
											var uuid = new Date().getTime();
											var password = item.phone.slice(5);
											var status = "0";
											var direty = "1";
											var deleted = "0";
											var time = new Date().getTime();
											let insertuser = 'insert into sys_user values (' + "'" + uuid + "'" + "," + "'" + password + "'" +
												"," +
												"'" + item.name + "'" + "," + "'" + item.roleid + "'" + "," + "'" + status +
												"'" + "," + "'" + item.phone +
												"'" + "," + "'" + this.globalData.company_id + "'" + "," + "'" + direty + "'" + "," + "'" + deleted +
												"'" +
												"," + "'" + time + "'" + "," + "'" + "0" + "'" + ' ) ';
											this.adduser(insertuser);
										} else {
											phones.push(res[0].phone);
										}
										
										if(index == this.accountList.length - 1){
											this.sureAlock = false;
											uni.hideLoading();
											this.showAccount = false;
											if(phones.length > 0){
												helper.showToast('手机:' + phones.toString() + '已经被开户，请使用未开户的手机！');
											}	
										}

									})
								})	
							}
						})
					})
				} else {
					if (!this.accountList[0].password) {
						this.sureAlock = false;
						this.$refs.uToast.show({
							title: '密码需为6位纯数字',
							type: 'warning'
						})
						return;
					}
					if(!(/^\d{6}$/.test(this.accountList[0].password))){
						this.sureAlock = false;
						this.$refs.uToast.show({
							title: '密码需为6位纯数字',
							type: 'warning'
						})
						return;
					}
					uni.showLoading({
						title: "编辑中..."
					});
					let sql =
						'select user_id,password,name,role_id,status,phone,company_id from sys_user where status = 0 and phone = ' + "'" +
						this.accountList[0].phone + "'";
					selectSQL('local', sql, res => {
						if (res.length != 0 && res[0].user_id != this.userid) {
							uni.hideLoading();
							this.sureAlock = false;
							helper.showToast('手机:' + this.accountList[0].phone + '已经被开户，请使用未开户的手机！');
						} else {
							var password = "'" + this.accountList[0].password + "'";
							var tim = new Date().getTime();
							let update = 'update sys_user set name = ' + "'" + this.accountList[0].name + "'" + "," + "phone= " + "'" +
								this.accountList[0].phone + "'" + "," + "password = " + password + "," + "role_id = " + "'" + this.accountList[
									0].roleid + "'" + "," + ' direty = 1 ' + "," + ' updatetime = ' + "'" + tim + "'" + "," + ' isupdate = ' +
								"'" + "1" + "'" +
								' where user_id = ' + "'" + this.userid + "'";
							this.edituser(update);
							uni.hideLoading();
							this.showAccount = false;
							setTimeout(() => {
								this.sureAlock = false;
							}, 500)
							var curTab = this.getTabData(this.curNow); //当前tab
							curTab.mescroll.resetUpScroll();
						}
					})
				}
			},
			adduser(insertuser) {
				
				executeSQL("local", insertuser, res => {})
				var curTab = this.getTabData(this.curNow); //当前tab
				curTab.mescroll.resetUpScroll();
			},
			edituser(edituser) {
				executeSQL("local", edituser, res => {})
			},
			// 账户选中
			accountSheetCallback(index) {
				this.accountList[this.openindex].accountfunction = this.accountSheetList[index].text;
				this.accountList[this.openindex].roleid = this.accountSheetList[index].value;
			},

			//确认删除
			accountdel() {
				if (this.lockaccountdel) return;
				this.lockaccountdel = true;
				var uid = "'" + this.deluser.user_id + "'";
				var tim = new Date().getTime();
				let sql = 'update sys_user set status = 1' + "," + ' `delete` = 1 ' + "," + ' updatetime = ' +
					"'" + tim + "'" + ' where user_id = ' + uid;
				executeSQL("local", sql, res => {})
				this.deluser = {};
				this.deluserindex = "";
				this.showAccountdel = false;
				var curTab = this.getTabData(this.curNow); //当前tab
				curTab.mescroll.resetUpScroll();
				this.lockaccountdel = false;
			},
			//确认删除
			roledel() {
				if (this.lockroledel) return;
				this.lockroledel = true;
				let url =
					'select user_id,password,name,role_id,status,phone,company_id from sys_user where ' + ' status !=1 and role_id = ' +
					"'" + this.deleteroleid + "'";
				selectSQL('local', url, res => {
					if (res.length != 0) {
						this.$refs.uToast.show({
							title: '请先删除改角色下的用户',
							type: 'warning'
						})
						this.lockroledel = false;
						return;
					} else {
						var tim = new Date().getTime();
						let sql = 'update sys_role set status = 1' + "," + ' `delete` = 1 ' + "," +
							' updatetime = ' + "'" + tim + "'" + ' where role_id = ' + "'" + this.deleteroleid + "'";
						executeSQL("local", sql, res => {

						})

						var tim1 = new Date().getTime();
						let sql1 = 'update sys_menu_table set status = 1' + "," + ' `delete` = 1 ' + "," +
							' updatetime = ' + "'" + tim1 + "'" + ' where role_id = ' + "'" + this.deleteroleid + "'";
						executeSQL("local", sql1, res => {

						})
						this.showRoledel = false;
						setTimeout(() => {
							this.lockroledel = false;
						}, 500)
						var curTab = this.getTabData(this.curNow); //当前tab
						curTab.mescroll.resetUpScroll();

					}
				})
			},
			cancelRole() {
				this.roleform = {
					name: '',
					roleFunction: "检查员",
					rolecheckList: []
				}
				this.showRole = false;
				this.sureRlock = false;
			},
			//批量导入
			addFields() {
				this.FieldsList = this.FieldsList.concat([{
					company: '',
					name: '',
					phone: '',
					address: ''
				}])

			},
			//批量导入
			deleteFields() {
				this.FieldsList.splice(this.FieldsList.length - 1, 1)
			},
			//取消新增或编辑父单位
			cancelFields() {
				this.showFields = false;
				this.sureFlock = false;
			},

			//确认新增或编辑父单位
			sureFields(type) {
				if (this.sureFlock) return;
				this.sureFlock = true;
				let companylen = 0
				this.FieldsList.forEach(item => {
					if (item.company == '') {
						companylen++
					}
				})
				if (companylen > 0) {
					this.$refs.uToast.show({
						title: '单位名称不能为空',
						type: 'warning'
					})
					this.sureFlock = false;
					return;
				}
				if (type == true) {
					//新增
					uni.showLoading({
						title: "创建中..."
					});
					let len = this.FieldsList.length;
					var Fields = [];
					this.FieldsList.forEach((item, index) => {
						let sqlparentunit =
							'select unit_name from sys_unit where status = 0 and parent_id = 0 and company_id = ' + "'" + this.globalData.company_id +
							"'" + ' and unit_name = ' + "'" + item.company + "'";
						selectSQL('local', sqlparentunit, resparentunit => {
							
							if (resparentunit.length == 0) {
								var uuid = new Date().getTime();
								var status = "0";
								var direty = "1";
								var deleted = "0";
								var parent_id = "0";
								var time = new Date().getTime();
								let insertunit = 'insert into sys_unit values (' + "'" + uuid + "'" + "," + "'" + item.company + "'" + "," +
									"'" + item.name + "'" + "," + "'" + item.phone + "'" + "," + "'" + item.address +
									"'" + "," + "'" + parent_id +
									"'" + "," + "'" + status + "'" + "," + "'" + this.globalData.company_id + "'" + "," + "'" + direty + "'" +
									"," + "'" + deleted + "'" + "," + "'" + time + "'" + ' ) ';
								this.addunit(insertunit);
							} else {
								Fields.push(item.company);
								
							}
							
							if(index == this.FieldsList.length- 1){
								uni.hideLoading();
								this.showFields = false;	
								this.sureFlock = false;
								this.fieldsName = '';
								if(Fields.length > 0){
								 helper.showToast(Fields.toString() + '单位名重复，新增失败！')	
								}
							}
						})
					})

				} else {
					//编辑
					uni.showLoading({
						title: "修改中..."
					});
					let sqlparentunit =
						'select unit_id,unit_name from sys_unit where status = 0 and parent_id = 0 and company_id = ' + "'" + this.globalData
						.company_id + "'" + ' and unit_name = ' + "'" + this.FieldsList[0].company + "'";
					selectSQL('local', sqlparentunit, resparentunit => {
						if (resparentunit.length == 0) {
							var tim = new Date().getTime();
							let update = 'update sys_unit set unit_name = ' + "'" + this.FieldsList[0].company + "'" + "," + "unit_user= " +
								"'" +
								this.FieldsList[0].name + "'" + "," + "unit_userphone = " + "'" + this.FieldsList[0].phone + "'" + "," +
								"address = " + "'" +
								this.FieldsList[0].address + "'" + "," + ' direty = 1 ' + "," + ' updatetime = ' + "'" +
								tim + "'" + ' where unit_id = ' + "'" + this.bianunitid + "'";
							this.edituser(update);
							uni.hideLoading();
							this.showFields = false;
							setTimeout(() => {
								this.sureFlock = false;
							}, 500)
							this.tab2.list[this.bianindex].unit_name = this.FieldsList[0].company;
							this.tab2.list[this.bianindex].unit_user = this.FieldsList[0].name;
							this.tab2.list[this.bianindex].unit_userphone = this.FieldsList[0].phone;
							this.tab2.list[this.bianindex].address = this.FieldsList[0].address;
						} else {
							if (resparentunit[0].unit_id == this.bianunitid) {
								var tim = new Date().getTime();
								let update = 'update sys_unit set unit_name = ' + "'" + this.FieldsList[0].company + "'" + "," +
									"unit_user= " +
									"'" +
									this.FieldsList[0].name + "'" + "," + "unit_userphone = " + "'" + this.FieldsList[0].phone + "'" + "," +
									"address = " + "'" +
									this.FieldsList[0].address + "'" + "," + ' direty = 1 ' + "," + ' updatetime = ' + "'" +
									tim + "'" + ' where unit_id = ' + "'" + this.bianunitid + "'";
								this.edituser(update);
								uni.hideLoading();
								this.showFields = false;
								setTimeout(() => {
									this.sureFlock = false;
								}, 500)
								this.tab2.list[this.bianindex].unit_name = this.FieldsList[0].company;
								this.tab2.list[this.bianindex].unit_user = this.FieldsList[0].name;
								this.tab2.list[this.bianindex].unit_userphone = this.FieldsList[0].phone;
								this.tab2.list[this.bianindex].address = this.FieldsList[0].address;
							} else {
								uni.hideLoading();
								helper.showToast("编辑的单位名重复！")
								setTimeout(() => {
									this.sureFlock = false;
								}, 500)
							}
						}
					})
				}
			},
			addunit(insertunit) {
				executeSQL("local", insertunit, res => {})
				var curTab = this.getTabData(this.curNow); //当前tab
				curTab.mescroll.resetUpScroll();
			},
			//确认删除
			Fieldsdel() {
				if (this.delFlock) return;
				this.delFlock = true;
				var tim = new Date().getTime();
				let sql1 = 'update sys_unit set status = 1' + "," + ' `delete` = 1 ' + "," +
					' updatetime = ' + "'" + tim + "'" + ' where unit_id = ' + "'" + this.deleteunitid + "'";
				executeSQL("local", sql1, res1 => {})
				let sql2 = 'update sys_unit set status = 1' + "," + ' `delete` = 1 ' + "," +
					' updatetime = ' + "'" + tim + "'" + ' where parent_id = ' + "'" + this.deleteunitid + "'";
				executeSQL("local", sql2, res2 => {})
				this.showFieldsdel = false;
				setTimeout(() => {
					this.delFlock = false;
				}, 500)
				if (this.fieldsName != '') {
					this.tab2.list.splice(this.deleteunitindex, 1)
				} else {
					var curTab = this.getTabData(this.curNow); //当前tab
					curTab.mescroll.resetUpScroll();
					curTab.mescroll.scrollTo(0, 0)
					this.old.scrollTop = 0;
					this.$emit('scorllway', false)
				}
			},
			//取消新增或编辑父单位
			cancelChild() {
				this.showChild = false;
				this.sureClock = false;
			},
			//确认新增或编辑父单位
			sureChild(type) {
				if (this.sureClock) return;
				this.sureClock = true;
				if (!this.ChildList[0].company) {
					this.$refs.uToast.show({
						title: '子单位名称不能为空',
						type: 'warning'
					})
					this.sureClock = false;
					return;
				}
				if (type == true) {
					//新增
					uni.showLoading({
						title: "创建中..."
					});
					var uuid = helper.uuid();
					var status = "0";
					var direty = "1";
					var deleted = "0";
					var parent_id = this.ChildList[0].parentcompanyid;
					var time = new Date().getTime();
					let sqluni =
						'select unit_name from sys_unit where status = 0 and parent_id = ' + "'" +
						parent_id + "'" + ' and unit_name = ' + "'" + this.ChildList[0].company + "'";
					selectSQL('local', sqluni, resuni => {
						if (resuni.length == 0) {
							let insertunit = 'insert into sys_unit values (' + "'" + uuid + "'" + "," + "'" + this.ChildList[0].company +
								"'" +
								"," +
								"'" + this.ChildList[0].name + "'" + "," + "'" + this.ChildList[0].phone + "'" + "," + "'" + this.ChildList[0]
								.address +
								"'" + "," + "'" + parent_id +
								"'" + "," + "'" + status + "'" + "," + "'" + this.globalData.company_id + "'" + "," + "'" + direty + "'" +
								"," + "'" + deleted + "'" + "," + "'" + time + "'" + ' ) ';
							this.addunit(insertunit);
							if (this.fieldsName == '') {
								var unit = {
									"unit_id": uuid,
									"unit_name": this.ChildList[0].company,
									"unit_user": this.ChildList[0].name,
									"unit_userphone": this.ChildList[0].phone,
									"address": this.ChildList[0].address,
									"parent_id": parent_id,
									"status": status,
									"company_id": this.globalData.company_id
								}


								if (this.tab2.list[this.unitindex].secondunit) {
									this.tab2.list[this.unitindex].secondunit.push(unit);
								} else {
									this.tab2.list[this.unitindex].secondunit = [];
									this.tab2.list[this.unitindex].secondunit.push(unit);
								}


								this.tab2.list[this.unitindex].isShow = true;
								this.tab2.list.map((e, inde) => {
									if (inde != this.unitindex) {
										e.isShow = false;
									}
								})
							} else {
								var unit = {
									"unit_id": uuid,
									"unit_name": this.ChildList[0].company,
									"unit_user": this.ChildList[0].name,
									"unit_userphone": this.ChildList[0].phone,
									"address": this.ChildList[0].address,
									"parent_id": parent_id,
									"status": status,
									"company_id": this.globalData.company_id
								}
								if (this.tab2.list[this.unitindex].secondunit) {
									this.tab2.list[this.unitindex].secondunit.push(unit);
								} else {
									this.tab2.list[this.unitindex].secondunit = [];
									this.tab2.list[this.unitindex].secondunit.push(unit);
								}

								this.tab2.list[this.unitindex].isShow = true;
								this.tab2.list.map((e, inde) => {
									if (inde != this.unitindex) {
										e.isShow = false;
									}
								})
							}
							uni.hideLoading()
							this.showChild = false;
							setTimeout(() => {
								this.sureClock = false;
							}, 500)
						} else {
							uni.hideLoading()
							helper.showToast("子单位名重复！")
							setTimeout(() => {
								this.sureClock = false;
							}, 500)
						}
					})
				} else {
					//编辑	
					uni.showLoading({
						title: "编辑中..."
					});
					var tim = new Date().getTime();
					let sqluni =
						'select unit_id,unit_name from sys_unit where status = 0 and parent_id = ' + "'" +
						this.ChildList[0].parentcompanyid + "'" + ' and unit_name = ' + "'" + this.ChildList[0].company + "'";
					selectSQL('local', sqluni, resuni => {
						if (resuni.length == 0) {
							let update = 'update sys_unit set unit_name = ' + "'" + this.ChildList[0].company + "'" + "," + "unit_user= " +
								"'" +
								this.ChildList[0].name + "'" + "," + "unit_userphone = " + "'" + this.ChildList[0].phone + "'" + "," +
								"address = " + "'" +
								this.ChildList[0].address + "'" + "," + ' direty = 1 ' + "," + ' updatetime = ' + "'" +
								tim + "'" + ' where unit_id = ' + "'" + this.bianunitidchild + "'";
							this.edituser(update);
							this.tab2.list[this.editunit].secondunit[this.editunitchild].unit_name = this.ChildList[0].company;
							this.tab2.list[this.editunit].secondunit[this.editunitchild].unit_user = this.ChildList[0].name;
							this.tab2.list[this.editunit].secondunit[this.editunitchild].unit_userphone = this.ChildList[0].phone;
							this.tab2.list[this.editunit].secondunit[this.editunitchild].address = this.ChildList[0].address;
							uni.hideLoading();
							this.showChild = false;
							setTimeout(() => {
								this.sureClock = false;
							}, 500)
						} else {
							if (resuni.length == 1) {
								if (resuni[0].unit_id == this.bianunitidchild) {
									let update = 'update sys_unit set unit_name = ' + "'" + this.ChildList[0].company + "'" + "," +
										"unit_user= " +
										"'" +
										this.ChildList[0].name + "'" + "," + "unit_userphone = " + "'" + this.ChildList[0].phone + "'" + "," +
										"address = " + "'" +
										this.ChildList[0].address + "'" + "," + ' direty = 1 ' + "," + ' updatetime = ' + "'" +
										tim + "'" + ' where unit_id = ' + "'" + this.bianunitidchild + "'";
									this.edituser(update);
									this.tab2.list[this.editunit].secondunit[this.editunitchild].unit_name = this.ChildList[0].company;
									this.tab2.list[this.editunit].secondunit[this.editunitchild].unit_user = this.ChildList[0].name;
									this.tab2.list[this.editunit].secondunit[this.editunitchild].unit_userphone = this.ChildList[0].phone;
									this.tab2.list[this.editunit].secondunit[this.editunitchild].address = this.ChildList[0].address;
									uni.hideLoading();
									this.showChild = false;
									setTimeout(() => {
										this.sureClock = false;
									}, 500)
								} else {
									uni.hideLoading();
									helper.showToast("子单位名重复！")
									setTimeout(() => {
										this.sureClock = false;
									}, 500)
								}
							} else {
								uni.hideLoading();
								helper.showToast("子单位名重复！")
								setTimeout(() => {
									this.sureClock = false;
								}, 500)
							}
						}
					})

				}
			},
			//确认删除
			Childel() {
				if (this.delClock) return;
				this.delClock = true;
				var tim = new Date().getTime();
				let sql1 = 'update sys_unit set status = 1' + "," + ' `delete` = 1 ' + "," +
					' updatetime = ' + "'" + tim + "'" + ' where unit_id = ' + "'" + this.deletechildunitid + "'";
				executeSQL("local", sql1, res1 => {})
				this.showChildel = false;
				setTimeout(() => {
					this.delClock = false;
				}, 500)
				this.tab2.list[this.deletechildunitindex].secondunit.splice(this.deletechildunitindex1, 1)
			},
			// 角色选中
			roleSheetCallback(index) {
				this.roleform.roleFunction = this.roleSheetList[index].text;
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/.u-content {
		border-radius: 10rpx 0 0 10rpx !important;
	}

	/deep/.u-subsection {
		padding: 0 10rpx !important;
		border-radius: 0 !important;
	}

	.wrap {
		position: relative;
	}

	.setting {
		z-index: 999;

		.u-th {
			background-color: #6ecac3;
			color: #FFFFFF;
			padding: 10rpx 0 !important;
		}

		.u-td {
			padding: 20rpx 10rpx !important;
		}

		.subpart {
			.subtop {
				display: flex;
				justify-content: space-between;
				padding: 20rpx 30rpx;
				background: #FFFFFF;
				margin-bottom: 20rpx;

				.subsearch {
					width: 100%;
					flex: 1;
				}

				.subnew {
					margin-left: 30rpx;

					.new {
						background-color: #4abdb4;
						color: #FFFFFF;
						height: 68rpx;
						line-height: 68rpx;
						border-radius: 10rpx;
						width: auto;
						padding: 0 20rpx;
						text-align: center;
						font-size: 28rpx;
					}
				}
			}
		}

		.table-part {
			// position: relative;
			padding: 0 30rpx;

			.action-part {
				display: flex;
				justify-content: space-around;

				.see {
					color: #00b2a4;
				}

				.edit {
					color: #2979ff;
				}

				.del {
					color: #fa3534;
				}

				.code {
					color: #ff9900;
				}
			}
		}


		//字段配置页面
		.collapsePart {
			padding: 0 30rpx;
			background: #FFFFFF;

			.u-collapse-head {
				position: relative;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				font-size: 28rpx;
				line-height: 1;
				padding: 20rpx 10rpx;
				text-align: left;
				background-color: #FFFFFF;
				border-bottom: 2rpx solid #f6f6f6;

				.action {
					display: flex;
					justify-content: space-between;
					width: 300rpx;
					margin-left: 20rpx;

					.right {
						font-size: 26rpx;
						color: #2979ff;
						margin: 4rpx;
					}

					.red {
						color: #fa3534;
					}
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
				overflow: hidden;
				transition: all 0.3s;
				background: #FFFFFF;
			}

			.u-collapse-content {
				overflow: hidden;
				font-size: 26rpx;
				color: #666;
				text-align: left;
				padding: 6rpx 10rpx;

				.empty-tips {
					color: #999999;
					text-align: center;
					padding: 10rpx 0;
				}

				.childPart {
					border-bottom: 2rpx solid #f6f6f6;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 10rpx 0;

					.left {
						flex: 1;
						width: 100%;
						line-height: 50rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						padding-left: 60rpx;
					}

					.action {
						display: flex;
						justify-content: space-between;
						width: 140rpx;
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

	//新增或编辑角色弹框
	.roleModel {
		width: 100%;
		position: relative;
		padding-top: 90rpx;
		padding-bottom: 120rpx;


		.roleTop {
			height: 90rpx;
			line-height: 90rpx;
			background: #4abdb4;
			color: #FFFFFF;
			font-size: 34rpx;
			text-align: center;
			position: fixed;
			top: 0rpx;
			width: 100%;
			z-index: 999;
		}

		.right {
			position: fixed;
			top: 0rpx;
			right: 0;
			width: 150rpx;
			height: 90rpx;
			color: #FFFFFF;
			line-height: 90rpx;
			font-size: 30rpx;
			z-index: 999;
		}

		.left {
			position: fixed;
			top: 0rpx;
			left: 0;
			width: 150rpx;
			height: 90rpx;
			color: #FFFFFF;
			line-height: 90rpx;
			font-size: 30rpx;
			text-align: right;
			z-index: 999;
		}

		.ipadPos {
			height: 50rpx;
			line-height: 50rpx;
			top: 40rpx;
		}


		.part {
			margin: 20rpx;
			border-radius: 20rpx;
			border: 2rpx solid #f6f6f6;

		}


		.rolePart {
			padding: 0 30rpx;
			display: flex;
			line-height: 100rpx;
			justify-content: flex-start;
			align-items: center;
			margin: 30rpx;

			.name {
				font-size: 30rpx;
				margin-right: 20rpx;
				color: #333333;
				width: 160rpx;
				text-align: right;

				text {
					color: #fa3534;
					margin-right: 10rpx;
				}
			}

			.content {
				flex: 1;

				.selectType {
					border: 2rpx solid #dcdfe6;
					height: 70rpx;
					line-height: 70rpx;
					color: #303133;
					width: 100%;
					font-size: 30rpx;

				}

				.title {
					color: #4abdb4;
					font-size: 32rpx;
				}

				.limit {
					height: 74rpx;
					line-height: 74rpx;

					.gray {
						background: #f6f6f6;
					}
				}
			}

		}

		.roletablePart {
			padding: 60rpx;

			.roleTable {
				.person {
					padding: 10rpx;
				}
			}


		}

		.column {
			display: block;

			.content {

				// background: #f6fff9;
				border: 1px solid #EEEEEE;
				box-shadow: 0 4px 4px rgba(0, 0, 0, .2);
				border-radius: 20rpx;
				padding: 0 60rpx 30rpx 60rpx;
			}

		}

		.addcount {
			display: flex;
			align-items: center;
			width: 300rpx;
			margin: 0 auto;

			.personicon {
				margin: 0 50rpx;
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
			background: #FFFFFF;
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
				color: #FFFFFF;
				background: #4abdb4;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;
				border: 2rpx solid #4abdb4;
				border-radius: 80rpx;
			}
		}
	}
</style>
