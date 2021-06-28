<template>
	<view class="checktask">
		<u-sticky :offset-top="offset">
			<view class="checktask-top">
				<view class="action" @click="newchecktask('new','')">
					<image src="../../static/newtask.png" mode=""></image>
					<view class="new">
						新建任务
					</view>
				</view>
			</view>
			<view class="task-state">
				<u-tabs :list="sublist" :is-scroll="false" :current="curNow" @change="sectionChange" active-color="#6ecac3"></u-tabs>
			</view>
		</u-sticky>
		<!-- 未归档 -->
		<view v-show="subIndex==0">
			<view class="wrap" :style="{height: subHeight-25+'px'}">
				<mescroll-uni :down="downOption" @init="mescrollInit0" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scrollfun"
				 :fixed="false">
					<view class="checktask-content">
						<uni-swipe-action>
							<uni-swipe-action-item class="swipe" v-for="(item,index) in tab0.list" :right-options="item.options" :key="index"
							 @change="open($event, index)" @click="click($event, index,item.utask_id)">
								<view class="part" @click="jump(item.taskdetail_id,item.utask_id,item.utype,item.ustatus,item.rtask_name,item.uuser_id,item.ruser_id)">
									<view class="top-part">
										<view class="left">
											<view class="name">
												<view class="nametitle">
													{{item.rtask_name}}
												</view>
												<view class="nameicon" v-if="functiond == 2 && item.utype == 1">
													<u-badge type="error" v-if="item.rtotolequestion " :count="item.rtotolequestion" class="badge-msg"></u-badge>
												</view>
												<view class="nameicon" v-if="functiond == 2 && item.utype == 2">
													<u-badge type="error" v-if="item.rtotolequestion " :count="item.rtotolequestion" class="badge-msg"></u-badge>
												</view>
												<view class="nameicon" v-if="functiond == 2 && item.utype == 3">
													<u-badge type="error" v-if="item.xfunction_id == 3" :count="item.utotlequestion" class="badge-msg"></u-badge>
													<u-badge type="error" v-if="item.xfunction_id == 2" :count="item.rtotolequestion" class="badge-msg"></u-badge>
												</view>
												<view class="nameicon" v-if="functiond == 3">
													<u-badge type="error" v-if="item.utotlequestion" :count="item.utotlequestion" class="badge-msg"></u-badge>
												</view>
											</view>
											<view class="detail">
												<view class="title">
													检查标准：
												</view>
												<view class="sizemore" v-if="item.normresult.length>2">
													<u-read-more show-height="100" :toggle="true" close-text="展开" color="#c0c4cc" :shadow-style="shadowStyle"
													 text-indent="0">
														<view class="size">
															<view class="sizename" v-for="(it,index1) in item.normresult" :key="index1">
																<text v-if="it.status == 0" class="noself">{{it.name}}</text>
																<!--status = 0 是没有包括的标准 -->
																<text v-if="it.status == 1" class="self">{{it.name}}</text>
																<!--status = 1 是包括了的标准 -->
															</view>
														</view>
													</u-read-more>
												</view>
												<view class="size" v-else>
													<view class="sizename" v-for="(it,index1) in item.normresult" :key="index1">
														<text v-if="it.status == 0" class="noself">{{it.name}}</text>
														<text v-if="it.status == 1" class="self">{{it.name}}</text>
													</view>
												</view>
											</view>
											<view class="detail">
												<view class="title" v-if="item.utype==2">
													整改期限：
												</view>
												<view class="title" v-if="item.utype==1||item.utype==3">
													计划时间：
												</view>
												<view class="time">
													{{$u.timeFormat(item.rstar_time, 'yyyy-mm-dd')}}
													<text>至</text>
													{{$u.timeFormat(item.rend_time, 'yyyy-mm-dd')}}
												</view>
											</view>
										</view>
										<view class="right">
											<!-- 这下面是驳回展示 -->
											<view class="namerefuse" v-if="item.isnow == 1">
												<view class="nameicon">
													<u-icon name="info-circle" color="#fa3534" size="36"></u-icon>
													<view class="refuse">驳回</view>
												</view>
											</view>
											<view class="arrow" v-if="item.show">
												<u-icon name="arrow-right-double" color="#999999" size="32"></u-icon>
											</view>
											<view class="arrow" v-else>
												<u-icon name="arrow-left-double" color="#999999" size="32"></u-icon>
											</view>
										</view>
									</view>
									<view class="action-part">
										<view class="left">
											<view class="company-part">
												<image src="../../static/company3.png" mode=""></image>
												<view class="company">
													{{item.unit_name}}
													<text class="childCompany" v-if="item.site_name">({{item.site_name}})</text>
												</view>
											</view>
											<view class="prograss" v-if="item.utype == 1 && functiond == 2 ">
												<u-line-progress :striped="true" :percent="item.rpercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.rpercent}}%</text><text>({{item.rhascheck}}/{{item.rtotlecheck}})</text>
											</view>
											<view class="prograss" v-if="item.utype == 2 && functiond == 2">
												<u-line-progress :striped="true" :percent="item.rpercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.rpercent}}%</text><text>({{item.rhascheck}}/{{item.rtotlecheck}})</text>
											</view>
											<view class="prograss" v-if="item.xfunction_id == 2 && item.utype == 3 && functiond == 2">
												<u-line-progress :striped="true" :percent="item.rpercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.rpercent}}%</text><text>({{item.rhascheck}}/{{item.rtotlecheck}})</text>
											</view>
											<view class="prograss" v-if="item.xfunction_id == 3 && item.utype == 3 && functiond == 2">
												<u-line-progress :striped="true" :percent="item.upercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.upercent}}%</text><text>({{item.uhascheck}}/{{item.utotlecheck}})</text>
											</view>
											<view class="prograss" v-if="functiond == 3">
												<u-line-progress :striped="true" :percent="item.upercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.upercent}}%</text><text>({{item.uhascheck}}/{{item.utotlecheck}})</text>
											</view>
										</view>
										<view class="right">
											<view v-if="functiond == 2">
												<view v-if="item.utype == 1">
													<view class="state gray" v-if="item.rstatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.rstatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.rstatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.rstatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.rstatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.rstatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.rstatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.rstatus==9">
														复检
													</view>
												</view>
												<view v-if="item.utype == 2">
													<view class="state gray" v-if="item.rstatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.rstatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.rstatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.rstatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.rstatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.rstatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.rstatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.rstatus==9">
														复检
													</view>
												</view>
												<view v-if="item.xfunction_id == 2 && item.utype == 3 ">
													<view class="state gray" v-if="item.rstatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.rstatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.rstatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.rstatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.rstatus==6">
														延期完成
													</view>
												</view>
												<view v-if="item.xfunction_id == 3 && item.utype == 3 ">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
												</view>
											</view>
											<view v-if="functiond == 3">
												<view v-if="item.utype == 1">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.ustatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.ustatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.ustatus==9">
														复检
													</view>
												</view>
												<view v-if="item.utype == 2">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.ustatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.ustatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.ustatus==9">
														复检
													</view>
												</view>
												<view v-if="item.utype == 3 && item.ruser_id == item.uuser_id">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
												</view>
												<view v-if="item.utype == 3 && item.ruser_id != item.uuser_id">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.ustatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.ustatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.ustatus==9">
														复检
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</view>
				</mescroll-uni>
			</view>
		</view>
		<!-- 已归档 -->
		<view v-show="subIndex==1">
			<view class="wrap" :style="{height: subHeight-25+'px'}">
				<mescroll-uni :down="downOption" @init="mescrollInit1" @down="downCallback" @up="upCallback" :up="upOption" @scroll="scrollfun"
				 :fixed="false">
					<view class="checktask-content">
						<uni-swipe-action>
							<uni-swipe-action-item class="swipe" v-for="(item,index) in tab1.list" :right-options="item.options" :key="index"
							 @change="open1($event, index)" @click="click($event, index,item.utask_id)">
								<view class="part" @click="jump(item.taskdetail_id,item.utask_id,item.utype,item.ustatus,item.rtask_name,item.uuser_id,item.ruser_id)">
									<view class="top-part">
										<view class="left">
											<view class="name">
												<view class="nametitle">
													{{item.rtask_name}}
												</view>
												<view class="nameicon" v-if="functiond == 2 && item.utype == 1">
													<u-badge type="error" v-if="item.rtotolequestion " :count="item.rtotolequestion" class="badge-msg"></u-badge>
												</view>
												<view class="nameicon" v-if="functiond == 2 && item.utype == 2">
													<u-badge type="error" v-if="item.rtotolequestion " :count="item.rtotolequestion" class="badge-msg"></u-badge>
												</view>
												<view class="nameicon" v-if="functiond == 2 && item.utype == 3">
													<u-badge type="error" v-if="item.xfunction_id == 3" :count="item.utotlequestion" class="badge-msg"></u-badge>
													<u-badge type="error" v-if="item.xfunction_id == 2" :count="item.rtotolequestion" class="badge-msg"></u-badge>
												</view>
												<view class="nameicon" v-if="functiond == 3">
													<u-badge type="error" v-if="item.utotlequestion" :count="item.utotlequestion" class="badge-msg"></u-badge>
												</view>
											</view>
											<view class="detail">
												<view class="title">
													检查准则：
												</view>
												<view class="sizemore" v-if="item.normresult.length>2">
													<u-read-more show-height="100" :toggle="true" close-text="展开" color="#c0c4cc" :shadow-style="shadowStyle"
													 text-indent="0">
														<view class="size">
															<view class="sizename" v-for="(it,index1) in item.normresult" :key="index1">
																<text v-if="it.status == 0" class="noself">{{it.name}}</text>
																<!--status = 0 是没有包括的标准 -->
																<text v-if="it.status == 1" class="self">{{it.name}}</text>
																<!--status = 1 是包括了的标准 -->
															</view>
														</view>
													</u-read-more>
												</view>
												<view class="size" v-else>
													<view class="sizename" v-for="(it,index1) in item.normresult" :key="index1">
														<text v-if="it.status == 0" class="noself">{{it.name}}</text>
														<text v-if="it.status == 1" class="self">{{it.name}}</text>
													</view>
												</view>
											</view>
											<view class="detail">
												<view class="title" v-if="item.utype==2">
													整改期限：
												</view>
												<view class="title" v-if="item.utype==1||item.utype==3">
													计划时间：
												</view>
												<view class="time">
													{{$u.timeFormat(item.rstar_time, 'yyyy-mm-dd')}}
													<text>至</text>
													{{$u.timeFormat(item.rend_time, 'yyyy-mm-dd')}}
												</view>
											</view>
										</view>
										<view class="right">
											<view class="arrow" v-if="item.show">
												<u-icon name="arrow-right-double" color="#999999" size="32"></u-icon>
											</view>
											<view class="arrow" v-else>
												<u-icon name="arrow-left-double" color="#999999" size="32"></u-icon>
											</view>
										</view>
									</view>
									<view class="action-part">
										<view class="left">
											<view class="company-part">
												<image src="../../static/company3.png" mode=""></image>
												<view class="company">
													{{item.unit_name}}
													<text class="childCompany" v-if="item.site_name">({{item.site_name}})</text>
												</view>
											</view>
											
											<view class="prograss" v-if="item.utype == 1 && functiond == 2 ">
												<u-line-progress :striped="true" :percent="item.rpercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.rpercent}}%</text><text>({{item.rhascheck}}/{{item.rtotlecheck}})</text>
											</view>
											<view class="prograss" v-if="item.utype == 2 && functiond == 2">
												<u-line-progress :striped="true" :percent="item.rpercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.rpercent}}%</text><text>({{item.rhascheck}}/{{item.rtotlecheck}})</text>
											</view>
											<view class="prograss" v-if="item.xfunction_id == 2 && item.utype == 3 && functiond == 2">
												<u-line-progress :striped="true" :percent="item.rpercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.rpercent}}%</text><text>({{item.rhascheck}}/{{item.rtotlecheck}})</text>
											</view>
											<view class="prograss" v-if="item.xfunction_id == 3 && item.utype == 3 && functiond == 2">
												<u-line-progress :striped="true" :percent="item.upercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.upercent}}%</text><text>({{item.uhascheck}}/{{item.utotlecheck}})</text>
											</view>
											<view class="prograss" v-if="functiond == 3">
												<u-line-progress :striped="true" :percent="item.upercent" :striped-active="true" :show-percent="false"></u-line-progress><text
												 class="rate">{{item.upercent}}%</text><text>({{item.uhascheck}}/{{item.utotlecheck}})</text>
											</view>
											
											
											
										</view>
										<view class="right">
											<view v-if="functiond == 2">
												<view v-if="item.utype == 1">
													<view class="state gray" v-if="item.rstatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.rstatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.rstatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.rstatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.rstatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.rstatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.rstatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.rstatus==9">
														复检
													</view>
												</view>
												<view v-if="item.utype == 2">
													<view class="state gray" v-if="item.rstatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.rstatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.rstatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.rstatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.rstatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.rstatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.rstatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.rstatus==9">
														复检
													</view>
												</view>
												
												<view v-if="item.xfunction_id == 2 && item.utype == 3 ">
													<view class="state gray" v-if="item.rstatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.rstatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.rstatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.rstatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.rstatus==6">
														延期完成
													</view>
												</view>
												<view v-if="item.xfunction_id == 3 && item.utype == 3 ">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
												</view>
											</view>
											<view v-if="functiond == 3">
												<view v-if="item.utype == 1">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.ustatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.ustatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.ustatus==9">
														复检
													</view>
												</view>
												<view v-if="item.utype == 2">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.ustatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.ustatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.ustatus==9">
														复检
													</view>
												</view>
												<view v-if="item.utype == 3 && item.ruser_id == globalData.uid">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
												</view>
												<view v-if="item.utype == 3 && item.ruser_id != globalData.uid">
													<view class="state gray" v-if="item.ustatus==2">
														未开始
													</view>
													<view class="state blue" v-if="item.ustatus==3">
														进行中
													</view>
													<view class="state green" v-if="item.ustatus==4">
														已完成
													</view>
													<view class="state red" v-if="item.ustatus==5">
														已延期
													</view>
													<view class="state yellow" v-if="item.ustatus==6">
														延期完成
													</view>
													<view class="state yellow" v-if="item.ustatus==7">
														待审核
													</view>
													<view class="state green" v-if="item.ustatus==8">
														已完结
													</view>
													<view class="state yellow" v-if="item.ustatus==9">
														复检
													</view>
												</view>
											</view>
											<!--  #ECECEC未开始，#2979ff进行中,#19be6b已完成, #fa3534已延期,#ff9900延期已完成-->
											<!-- 状态:0删除,1未检查,2检查中,3检查完成,4已上报,5已延期,6延期完成,7未上报,8待审核,9已完结,10审核驳回 -->
										</view>
									</view>
								</view>
							</uni-swipe-action-item>
						</uni-swipe-action>
					</view>
				</mescroll-uni>
			</view>
		</view>

		<!-- 删除弹框 -->
		<u-modal v-model="delshow" @confirm="delconfirm" :async-close="true" :show-cancel-button="true" :confirm-style="{'color':'#fa3534'}"
		 :show-title="false" content="您确认要删除吗？">
		</u-modal>
		<!-- 上报弹框 -->
		<u-modal v-model="showreport" @confirm="reportconfirm" :async-close="true" :show-cancel-button="true" :confirm-style="{'color':'#fa3534'}"
		 :show-title="false" content="您确认要上报吗？">
		</u-modal>
		<!-- 问题整改指派 -->
		<u-popup v-model="showAllot" :mode="curMode" width="40%" height="80%" @close="cancelproblem()">
			<view class="roleModel">
				<view class="roleTop">
					问题整改指派
				</view>
				<view class="content">
					<!-- 折叠面板 -->
					<view class="collapsePart">
						<view class="u-collapse-item" v-for="(item,index) in collapseList" :key="index">
							<view :hover-stay-time="200" class="u-collapse-head">
								<block>
									<view class="u-icon-wrap" @tap="headClick(index)">
									</view>
									<view class="u-collapse-title u-line-1">
										{{item.detail}}<text  class="badge-msg1">({{item.question}})</text>
									</view>
									<view class="action">
										<u-input v-model="item.person" type="select" :border="true" @click="openPerson(index)" height="70"
										 placeholder="指派给" />
									</view>
								</block>
							</view>
						</view>
					</view>
				</view>
				<view class="roleAction">
					<view class="cancel" @click="cancelproblem()">
						取消
					</view>
					<view class="sure" @click="sureproblem()">
						确定
					</view>
				</view>
			</view>
		</u-popup>
		<!-- 选择人员 -->
		<u-action-sheet :list="personSheetList" v-model="showPersonList" @click="personSheetCallback" border-radius="20"
		 @close="personSheetClose"></u-action-sheet>
		<!-- 导出 -->
		<u-modal v-model="showExcelOut" :title-style="{color: '#fff',background:'#4abdb4'}" @confirm="confirmExcelOut()"
		 :confirm-style="{color:'#4abdb4'}" :show-title="false" :show-cancel-button="true">
			<view class="slot-content">
				<view class="contentModel">
					<u-form :model="form" ref="uForm">
						<u-form-item label="导出图片" :label-style="labelStyle" :label-width='labelWidth'>
							<u-radio-group v-model="checkpic" icon-size="30" size="40" style="marginTop:10rpx;">
								<u-radio v-for="(item, index) in checkpicList" :key="index" :name="item.name" active-color="#4abdb4">
									{{ item.name }}
								</u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="数据类型" :label-style="labelStyle" :label-width='labelWidth' :border-bottom="false">
							<u-radio-group v-model="checktype" icon-size="30" size="40" style="marginTop:10rpx;">
								<u-radio v-for="(item, index) in checktypeList" :key="index" :name="item.name" active-color="#4abdb4">
									{{ item.name }}
								</u-radio>
							</u-radio-group>
						</u-form-item>
					</u-form>
				</view>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>

</template>
<script>
	var timer; //判断页面滚动
	import helper from '@/common/helper.js'
	import md5 from '@/common/md5.js';
	import {
		openComDB,
		closeComDB,
		executeSQL,
		selectSQL
	} from '@/common/local.js'
	import {
		importUserToTask
	} from '@/api/importExcel.js'
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
			},
			process: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				old: {
					scrollTop: 0,
					isScrollUp: false
				},
				labelStyle: {
					color: '#333',
					fontSize: '32rpx'
				},
				labelWidth: '150',
				// 头部导航
				curNow: 0, //当前选中
				subIndex: 0, //当前选中内容
				sublist: [{
						name: '未归档'
					},
					{
						name: '已归档'
					}
				],
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
				// 分页
				downOption: {
					auto: true //是否在初始化后,自动执行下拉回调callback; 默认true
				},
				upOption: {
					onScroll: true,
					auto: false,
					noMoreSize: 3,
					textNoMore: '我也是有底线的~',
					offset: 300
				},
				delshow: false,
				showreport: false,
				personSheetList: [],
				showPersonList: false,
				arrow: true, //是否显示箭头
				showExcelOut: false,
				form: {},
				checkpic: '是',
				globalData: {
					"uid": uni.getStorageSync("USER_ID"),
					"company_id": uni.getStorageSync("company_id"),
					"pageNum": 0,
					"type": "",
					"keywords": ""
				},
				checkpicList: [{
						name: '是',
					},
					{
						name: '否',
					}
				],
				checktype: '全部数据',
				checktypeList: [{
						name: '全部数据'
					},
					{
						name: '问题数据'
					},
				],
				showAllot: false,
				collapseList: [],
				functiond: uni.getStorageSync('functionid'),
				index: '',
				task_id: "",
				tasktype: 1,
				nowtask: null,
				taskName: null,
				shadowStyle: {
					backgroundImage: "none",
					paddingTop: "0",
					marginTop: "20rpx"
				},
				allow: true,
				lock: false,
				lockup: false,
				lockdel: false,
				lockjump: false,
				locktask: false,
				lockclick: false
			}
		},
		// watch: {
		// 	process(newVal, oldVal) {
		// 		if (newVal != oldVal&&this.allow) {					
		// 			this.selectprocessandstatus()	
		// 		}
		// 	}
		// },
		methods: {
			scrollfun() {
				// 只要滚动就清除状态
				clearTimeout(timer);
				timer = setTimeout(() => {
					if (this.curNow == 0) {
						this.old.scrollTop = this.tab0.mescroll.scrollTop;
						this.old.isScrollUp = this.tab0.mescroll.isScrollUp;
						if (this.old.scrollTop <= 60 && this.old.isScrollUp == false && this.tab0.list.length >= 5) {
							this.old.scrollTop = 0;
							this.$emit('scorllway', false);
							this.tab0.mescroll.scrollTo(0, 0)
						}
						// 告知标识 -> 结束滚动
						if (this.old.scrollTop > 200 && this.old.isScrollUp == true && this.tab0.list.length >= 5) {
							this.$emit('scorllway', true);
						}
					}
					if (this.curNow == 1) {
						this.old.scrollTop = this.tab1.mescroll.scrollTop;
						this.old.isScrollUp = this.tab1.mescroll.isScrollUp;
						if (this.old.scrollTop <= 60 && this.old.isScrollUp == false && this.tab1.list.length >= 5) {
							this.old.scrollTop = 0;
							this.$emit('scorllway', false);
							this.tab1.mescroll.scrollTo(0, 0)
						}
						// 告知标识 -> 结束滚动
						if (this.old.scrollTop > 200 && this.old.isScrollUp == true && this.tab1.list.length >= 5) {
							this.$emit('scorllway', true);
						}
					}
				}, 30);
			},
			//任务列表刷新
			refreshtask() {
				if (this.tab0.mescroll) {
					this.curNow = 0;
					this.subIndex = 0;
					this.tab0.mescroll.resetUpScroll();
					this.tab0.mescroll.scrollTo(0, 0)
					this.old.scrollTop = 0
					this.$emit('scorllway', false);
					this.selectprocessandstatus();
					this.tab0.mescroll.resetUpScroll();
				}
			},
			refreshtask1() {
				if (this.tab1.mescroll) {
					this.curNow = 1;
					this.subIndex = 1;
					this.tab1.mescroll.resetUpScroll();
					this.tab1.mescroll.scrollTo(0, 0)
					this.old.scrollTop = 0
					this.$emit('scorllway', false);
					this.selectprocessandstatus();
					this.tab1.mescroll.resetUpScroll();
				}
			},
			newchecktask(type, id) {
				if (this.locktask) return
				this.locktask = true
				if (type == 'new') {
					uni.setStorageSync('taskIndex', 0)
					uni.navigateTo({
						url: '/pages/task/task'
					})
				} else {
					uni.setStorageSync('taskIndex', this.curNow)
					uni.navigateTo({
						url: '/pages/task/task'
					})
				}
				setTimeout(() => {
					this.locktask = false
				}, 500)
			},
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
				this.$emit('scorllway', false);
			},

			getTabData(tabType) {
				if (tabType == 0) {
					return this.tab0;
				} else if (tabType == 1) {
					return this.tab1;
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

						if (curPageData.length > 0) {
							curPageData.forEach((item, index) => {

								if (item.runit_id != null) {
									let sql = 'select unit_name from sys_unit where unit_id = ' + "'" + item.runit_id + "'";
									selectSQL('local', sql, res => {
										item.unit_name = res[0].unit_name;

										if (item.rsite_id != "") {
											let sqls = 'select unit_name from sys_unit where unit_id = ' + "'" + item.rsite_id + "'";
											selectSQL('local', sqls, ress => {
												item.site_name = ress[0].unit_name;
												if (curPageData.length - 1 == index) {
													mescroll.endBySize(curPageData.length, totalResult);
													if (mescroll.num == 1) this.tab0.list = []; //如果是第一页需手动制空列表

													this.tab0.list = this.tab0.list.concat(curPageData); //追加新数据

													this.selectprocessandstatus()
												}

											})

										} else {
											if (curPageData.length - 1 == index) {
												mescroll.endBySize(curPageData.length, totalResult);
												if (mescroll.num == 1) this.tab0.list = []; //如果是第一页需手动制空列表
												this.tab0.list = this.tab0.list.concat(curPageData); //追加新数据


												this.selectprocessandstatus()
											}
										}
									})

								}


							})

						} else {
							mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
							//设置列表数据
							if (mescroll.num == 1) this.tab0.list = []; //如果是第一页需手动制空列表
							this.tab0.list = this.tab0.list.concat(curPageData); //追加新数据
						}


					}, () => {
						if (mescroll.num == 1) this.tab0.isListInit = false;
						mescroll.endErr(); //联网失败的回调,隐藏下拉刷新的状态
					})
				} else if (mescroll.tabType == 1) {
					this.tab1.isListInit = true; //标记列表已初始化,保证列表只初始化一次
					this.getListDataFromNet(mescroll.tabType, mescroll.num, mescroll.size, (curPageData, totalResult) => {
						if (curPageData.length > 0) {
							curPageData.forEach((item, index) => {

								if (item.runit_id != null) {
									let sql = 'select unit_name from sys_unit where unit_id = ' + "'" + item.runit_id + "'";
									selectSQL('local', sql, res => {
										item.unit_name = res[0].unit_name;
										if (item.rsite_id != "") {
											let sqls = 'select unit_name from sys_unit where unit_id = ' + "'" + item.rsite_id + "'";
											selectSQL('local', sqls, ress => {
												item.site_name = ress[0].unit_name;
												if (curPageData.length - 1 == index) {
													mescroll.endBySize(curPageData.length, totalResult);
													if (mescroll.num == 1) this.tab1.list = []; //如果是第一页需手动制空列表
													this.tab1.list = this.tab1.list.concat(curPageData); //追加新数据
												}

											})

										} else {
											if (curPageData.length - 1 == index) {
												mescroll.endBySize(curPageData.length, totalResult);
												if (mescroll.num == 1) this.tab1.list = []; //如果是第一页需手动制空列表
												this.tab1.list = this.tab1.list.concat(curPageData); //追加新数据
											}
										}
									})

								}


							})
						} else {
							mescroll.endBySize(curPageData.length, totalResult); //必传参数(当前页的数据个数, 总数据量)
							//设置列表数据
							if (mescroll.num == 1) this.tab1.list = []; //如果是第一页需手动制空列表
							this.tab1.list = this.tab1.list.concat(curPageData); //追加新数据
						}



					}, () => {
						if (mescroll.num == 1) this.tab1.isListInit = false;
						mescroll.endErr(); //联网失败的回调,隐藏下拉刷新的状态
					})
				}
			},
			getListDataFromNet(tabcur, pageNum, pageSize, successCallback, errorCallback) {
				switch (tabcur) {
					case 0:
						this.globalData.type = "0";
						var uid = "'" + uni.getStorageSync('USER_ID') + "'";
						let sql = 'select COUNT(taskdetail_id) as totalResult from tb_task_detail where (user_id = ' + uid +
							' or group_id = ' + uid + ') and status != 1 and status != 8';
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
								let selecttask =
									'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus,x.function_id as xfunction_id from tb_task_detail u left join tb_task r on u.task_id=r.task_id left join sys_user c on r.user_id=c.user_id left join sys_role x on c.role_id=x.role_id where (u.user_id = ' +
									uid + ' or u.group_id = ' + uid + ') and u.status != 1 and u.status != 8' +
									' order by u.created_time desc limit ' + size + ' offset ' + pagebegin;
								this.selecttask1(selecttask, totalResult, successCallback)
							} else {
								console.log("查询用户总数量报错")
								return;
							}
						})
						break;
					case 1:
						this.globalData.type = "1";
						var uid1 = "'" + uni.getStorageSync('USER_ID') + "'";
						let sql1 = 'select COUNT(taskdetail_id) as totalResult from tb_task_detail where (user_id = ' + uid1 +
							' or group_id = ' + uid1 + ') and status != 1 and status = 8';
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
								let selecttask1 =
									'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus,x.function_id as xfunction_id from tb_task_detail u left join tb_task r on u.task_id=r.task_id left join sys_user c on r.user_id=c.user_id left join sys_role x on c.role_id=x.role_id where (u.user_id = ' +
									uid1 + ' or u.group_id = ' + uid1 + ') and u.status != 1 and u.status = 8' +
									' order by u.created_time desc limit ' + size + ' offset ' + pagebegin;
								this.selecttask(selecttask1, totalResult, successCallback);
							} else {
								console.log("查询用户总数量报错")
								return;
							}
						})
						break;
				}

			},
			selecttask(url, pages, successCallback) {
				selectSQL('local', url, res => {

					var curPageData = res;
					if (curPageData.length != 0) {
						for (var i = 0; i < curPageData.length; i++) {
							(function(i) {
								let sql1 =
									'select u.norm_id,r.name from tb_task_detail_norm u left join tb_norm r on u.norm_id = r.norm_id where u.task_id = ' +
									"'" + curPageData[i].utask_id + "'" + ' group by r.norm_id';
								selectSQL('local', sql1, res1 => {
									if (res1.length != 0) {
										var allnorm = [];
										res1.forEach(it => {
											allnorm.push(it.name)
										})

										let sql2 =
											'select u.norm_id,r.name from tb_task_detail_norm u left join tb_norm r on u.norm_id = r.norm_id where u.taskdetail_id = ' +
											"'" + curPageData[i].taskdetail_id + "'" + ' group by r.norm_id';
										selectSQL('local', sql2, res2 => {
											if (res2.length != 0) {
												var departnorm = [];
												res2.forEach(it => {
													departnorm.push(it.name)
												})
												var result = [];
												allnorm.forEach(it => {
													if (departnorm.indexOf(it) > -1) {
														var nor = {
															"name": it,
															"status": "1"
														};
														result.push(nor);
													} else {
														var nor = {
															"name": it,
															"status": "0"
														};
														result.push(nor);
													}
												})
												curPageData[i].normresult = result;
												var num = curPageData[i].rhascheck / curPageData[i].rtotlecheck;
												num = (num * 100).toFixed(2)
												curPageData[i].rpercent = num;

												var num1 = curPageData[i].uhascheck / curPageData[i].utotlecheck;
												num1 = (num1 * 100).toFixed(2)
												curPageData[i].upercent = num1;
												curPageData[i].show = false;
												curPageData[i].options = [];
												curPageData[i].options.push({
													text: '导出',
													style: {
														backgroundColor: '#19be6b'
													}
												})
												if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

													if (uni.getStorageSync('USER_ID') == curPageData[i].ruser_id) {
														curPageData[i].options.push({
															text: '删除',
															style: {
																backgroundColor: '#fa3534'
															}
														})
													}
												}
												if (curPageData.length - 1 == i) {
													successCallback && successCallback(curPageData, pages);
												}
											} else {
												console.log("登录子项目id查询normids没有结果！")
												var result = [];
												allnorm.forEach(it => {
													var nor = {
														"name": it,
														"status": "0"
													};
													result.push(nor);

												})

												curPageData[i].normresult = result;
												var num = curPageData[i].rhascheck / curPageData[i].rtotlecheck;
												num = (num * 100).toFixed(2)
												curPageData[i].rpercent = num;
												var num1 = curPageData[i].uhascheck / curPageData[i].utotlecheck;
												num1 = (num1 * 100).toFixed(2)
												curPageData[i].upercent = num1;

												curPageData[i].show = false;
												curPageData[i].options = [];
												curPageData[i].options.push({
													text: '导出',
													style: {
														backgroundColor: '#19be6b'
													}
												})
												if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

													if (uni.getStorageSync('USER_ID') == curPageData[i].ruser_id) {
														curPageData[i].options.push({
															text: '删除',
															style: {
																backgroundColor: '#fa3534'
															}
														})
													}

												}
												if (curPageData.length - 1 == i) {

													successCallback && successCallback(curPageData, pages);

												}

											}
										})

									} else {
										console.log("登录项目id查询normids没有结果！")
									}
								})

							})(i);
						}


					} else {
						uni.hideLoading()
						successCallback && successCallback(curPageData, pages);
						return;
					}
				})
			},

			selecttask1(url, pages, successCallback) {
				selectSQL('local', url, res => {

					var curPageData = res;
					if (curPageData.length != 0) {
						var functionid = uni.getStorageSync('functionid');
						for (var i = 0; i < curPageData.length; i++) {
							(function(i) {
								let sqlreport =
									'select id from tb_group_report where task_id = ' +
									"'" + curPageData[i].utask_id + "'" + ' and taskdetail_id = ' + "'" + curPageData[i].taskdetail_id + "'" +
									' and user_id = ' + "'" + curPageData[i].uuser_id + "'" + ' and status = 0';
								selectSQL('local', sqlreport, resreport => {
									if (resreport.length > 0) {
										curPageData[i].isnow = 1
									} else {
										curPageData[i].isnow = 0
									}

									let sql1 =
										'select u.norm_id,r.name from tb_task_detail_norm u left join tb_norm r on u.norm_id = r.norm_id where u.task_id = ' +
										"'" + curPageData[i].utask_id + "'" + ' group by r.norm_id';
									selectSQL('local', sql1, res1 => {

										if (res1.length != 0) {
											var allnorm = [];
											res1.forEach(it => {
												allnorm.push(it.name)
											})


											let sql2 =
												'select u.norm_id,r.name from tb_task_detail_norm u left join tb_norm r on u.norm_id = r.norm_id where u.taskdetail_id = ' +
												"'" + curPageData[i].taskdetail_id + "'" + ' group by r.norm_id';
											selectSQL('local', sql2, res2 => {
												if (res2.length != 0) {
													var departnorm = [];
													res2.forEach(it => {
														departnorm.push(it.name)
													})
													var result = [];
													allnorm.forEach(it => {
														if (departnorm.indexOf(it) > -1) {
															var nor = {
																"name": it,
																"status": "1"
															};
															result.push(nor);
														} else {
															var nor = {
																"name": it,
																"status": "0"
															};
															result.push(nor);
														}
													})

													curPageData[i].normresult = result;
													var num = curPageData[i].rhascheck / curPageData[i].rtotlecheck;
													num = (num * 100).toFixed(2)
													curPageData[i].rpercent = num;
													var num1 = curPageData[i].uhascheck / curPageData[i].utotlecheck;
													num1 = (num1 * 100).toFixed(2)
													curPageData[i].upercent = num1;
													curPageData[i].show = false;
													curPageData[i].options = [];
													curPageData[i].options.push({
														text: '导出',
														style: {
															backgroundColor: '#19be6b'
														}
													})
													
													if (curPageData[i].utype == '2' && curPageData[i].utoperson == '0' && functionid == '2' &&
														curPageData[i].rstatus != '1' && curPageData[i].rstatus !=
														'8' && curPageData[i].rstatus !=
														'7') {
														if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

															curPageData[i].options.push({
																text: '指派',
																style: {
																	backgroundColor: '#007aff'
																}
															})


														}
													}
													if (functionid == '2' && curPageData[i].rstatus != '8') {
														if (curPageData[i].rstatus == '4' || curPageData[i].rstatus == '6') {
															if (curPageData[i].utype == '2' || curPageData[i].utype == '1') {
																if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {
																	curPageData[i].options.push({
																		text: '上报',
																		style: {
																			backgroundColor: '#ff9900'
																		}
																	})
																}
															}
															if (curPageData[i].utype == '3') {
																if (curPageData[i].uuser_id != curPageData[i].ruser_id) {
																	curPageData[i].options.push({
																		text: '上报',
																		style: {
																			backgroundColor: '#ff9900'
																		}
																	})

																}

															}
														}

													} else if (functionid == '3' && curPageData[i].ustatus != '8') {

														if (curPageData[i].ustatus == '4' || curPageData[i].ustatus == '6') {


															if (curPageData[i].utype == '2' || curPageData[i].utype == '1') {
																curPageData[i].options.push({
																	text: '上报',
																	style: {
																		backgroundColor: '#ff9900'
																	}
																})
															}

															if (curPageData[i].utype == '3') {

																if (curPageData[i].uuser_id != curPageData[i].ruser_id) {
																	curPageData[i].options.push({
																		text: '上报',
																		style: {
																			backgroundColor: '#ff9900'
																		}
																	})

																}

															}
														}

													}


													if (curPageData[i].utype == '1') {

														if (curPageData[i].uuser_id == curPageData[i].ruser_id) {

															if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

																curPageData[i].options.push({
																	text: '编辑',
																	style: {
																		backgroundColor: '#007aff'
																	}
																})
																curPageData[i].options.push({
																	text: '删除',
																	style: {
																		backgroundColor: '#fa3534'
																	}
																})

															}

														}
													}

													if (curPageData[i].utype == '3') {
														if (curPageData[i].uuser_id == curPageData[i].ruser_id) {
															if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

																curPageData[i].options.push({
																	text: '编辑',
																	style: {
																		backgroundColor: '#007aff'
																	}
																})

																curPageData[i].options.push({
																	text: '删除',
																	style: {
																		backgroundColor: '#fa3534'
																	}
																})
															}
														}
													}
													if (curPageData[i].utype == '2') {
														if (curPageData[i].ustatus != '8') {
															if (curPageData[i].ustatus != '7') {

															}
														} else if (curPageData[i].ustatus == '8') {
															if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

																curPageData[i].options.push({
																	text: '编辑',
																	style: {
																		backgroundColor: '#007aff'
																	}
																})

																curPageData[i].options.push({
																	text: '删除',
																	style: {
																		backgroundColor: '#fa3534'
																	}
																})
															}

														}
													}
													if (curPageData.length - 1 == i) {

														successCallback && successCallback(curPageData, pages);
													}
												} else {
													var result = [];
													allnorm.forEach(it => {
														var nor = {
															"name": it,
															"status": "0"
														};
														result.push(nor);
													})
													curPageData[i].normresult = result;
													var num = curPageData[i].rhascheck / curPageData[i].rtotlecheck;
													num = (num * 100).toFixed(2)
													curPageData[i].rpercent = num;
													var num1 = curPageData[i].uhascheck / curPageData[i].utotlecheck;
													num1 = (num1 * 100).toFixed(2)
													curPageData[i].upercent = num1;
													curPageData[i].show = false;
													curPageData[i].options = [];
													curPageData[i].options.push({
														text: '导出',
														style: {
															backgroundColor: '#19be6b'
														}
													})
													if (curPageData[i].utype == '2' && curPageData[i].utoperson == '0' && functionid == '2' &&
														curPageData[
															i].rstatus != '1' && curPageData[i].rstatus !=
														'8') {
														if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {
															curPageData[i].options.push({
																text: '指派',
																style: {
																	backgroundColor: '#007aff'
																}
															})
														}
													}
													if (functionid == '2' && curPageData[i].ustatus != '8' && curPageData[i].utype != '3') {
														if (curPageData[i].rstatus == '4' || curPageData[i].rstatus == '6') {
															if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {
																curPageData[i].options.push({
																	text: '上报',
																	style: {
																		backgroundColor: '#ff9900'
																	}
																})
															}
														}

													} else if (functionid == '3' && curPageData[i].ustatus != '8' && curPageData[i].utype != '3') {

														if (curPageData[i].ustatus == '4' || curPageData[i].ustatus == '6') {
															curPageData[i].options.push({
																text: '上报',
																style: {
																	backgroundColor: '#ff9900'
																}
															})

														}

													}


													if (curPageData[i].utype == '1') {
														if (curPageData[i].ustatus != '8') {
															if (curPageData[i].uuser_id == curPageData[i].ruser_id) {
																if (curPageData[i].ustatus != '7') {
																	if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

																		curPageData[i].options.push({
																			text: '编辑',
																			style: {
																				backgroundColor: '#007aff'
																			}
																		})

																		curPageData[i].options.push({
																			text: '删除',
																			style: {
																				backgroundColor: '#fa3534'
																			}
																		})
																	}
																}
															}
														} else if (curPageData[i].ustatus == '8') {
															if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

																curPageData[i].options.push({
																	text: '编辑',
																	style: {
																		backgroundColor: '#007aff'
																	}
																})

																curPageData[i].options.push({
																	text: '删除',
																	style: {
																		backgroundColor: '#fa3534'
																	}
																})
															}
														}

													}

													if (curPageData[i].utype == '3') {
														if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {

															curPageData[i].options.push({
																text: '编辑',
																style: {
																	backgroundColor: '#007aff'
																}
															})

															curPageData[i].options.push({
																text: '删除',
																style: {
																	backgroundColor: '#fa3534'
																}
															})
														}
													}
													if (curPageData[i].utype == '2') {
														if (curPageData[i].ustatus != '8') {
															if (curPageData[i].ustatus != '7') {

															}

														} else if (curPageData[i].ustatus == '8') {
															if (uni.getStorageSync('USER_ID') == curPageData[i].uuser_id) {


																curPageData[i].options.push({
																	text: '编辑',
																	style: {
																		backgroundColor: '#007aff'
																	}
																})
																curPageData[i].options.push({
																	text: '删除',
																	style: {
																		backgroundColor: '#fa3534'
																	}
																})
															}
														}
													}

													if (curPageData.length - 1 == i) {
														successCallback && successCallback(curPageData, pages);
													}
												}
											})
										} else {
											console.log("登录项目id查询normids没有结果！")
										}
									})
								})
							})(i);
						}
					} else {
						console.log("分页查询用户数据报错")
						uni.hideLoading()
						successCallback && successCallback(curPageData, pages);
						return;
					}
				})

			},
			// 左滑打开
			open(e, index) {
				if (e == 'right') {
					this.tab0.list[index].show = true;
					this.tab0.list.map((val, idx) => {
						if (index != idx) {
							this.tab0.list[idx].show = false;
						}
					})
				} else {
					this.tab0.list.map((val, idx) => {
						this.tab0.list[idx].show = false;
					})
				}
			},
			open1(e, index) {
				if (e == 'right') {
					this.tab1.list[index].show = true;
					this.tab1.list.map((val, idx) => {
						if (index != idx) {
							this.tab1.list[idx].show = false;
						}
					})
				} else {
					this.tab1.list.map((val, idx) => {
						this.tab1.list[idx].show = false;
					})
				}
			},
			openPerson(index) {
				this.openindex = index;
				this.showPersonList = true;
			},
			click(e, index, id) {
				if (this.lockclick) return;
				this.lockclick = true;
				this.lockjump = true;
				this.task_id = id
				let name = "";
				if (this.curNow == 0) {
					name = this.tab0.list[index].rtask_name
				} else if (this.curNow == 1) {
					name = this.tab1.list[index].rtask_name
				}
				this.taskName = name
				this.index = index
				let {
					content
				} = e;
				if (content.text === '删除') {
					this.lockdel = false;
					this.delshow = true;
				}
				if (content.text === '编辑') {
					let id = "";
					if (this.curNow == 0) {
						id = this.tab0.list[this.index].taskdetail_id
					} else if (this.curNow == 1) {
						id = this.tab1.list[this.index].taskdetail_id
					}
					uni.navigateTo({
						url: '/pages/task/task?id=' + id
					})
				}
				if (content.text === '上报') {
					this.lockup = false;
					this.showreport = true;
				}

				if (content.text === '导出') {
					this.showExcelOut = true;
				}

				if (content.text === '指派') {
					this.queryUserBySpecialty();
					this.groupAllocationList(this.tab0.list[this.index])
					this.nowtask = this.tab0.list[this.index];
					this.lock = false;
					this.showAllot = true;
				}
				setTimeout(() => {
					this.lockclick = false
					this.lockjump = false;
				}, 500)
			},
			groupAllocationList(item) {
				let that = this;
				var arr = [];
				let sqlnormids =
					'select u.question,u.norm_detail_id,r.item from tb_task_detail_norm u left join tb_norm_detail r on u.norm_detail_id=r.id  where u.taskdetail_id = ' +
					"'" + item.taskdetail_id + "'";
				selectSQL('local', sqlnormids, resnormids => {
					resnormids.forEach(it => {
						var ar = {
							id: it.norm_detail_id,
							detail: it.item,
							person: '',
							personid: '',
							isShow: false,
							question:it.question
						}
						arr.push(ar)
					})
					that.collapseList = arr
				})
			},


			//拉去组员列表
			queryUserBySpecialty() {
				let that = this;
				let sql =
					'select u.user_id as id,u.name as text from sys_user u left join sys_role r on u.role_id=r.role_id where 1=1 and u.status = 0 and r.status = 0 and r.function_id = 3 and u.company_id = ' +
					"'" + uni.getStorageSync('company_id') + "'";
				selectSQL('local', sql, res => {
					that.personSheetList = res;
				})
			},



			jump(taskdetail_id, utask_id, utype, ustatus, rtask_name, userid,ruserid) {
				if (this.lockjump) return;
				this.lockjump = true;

				if (uni.getStorageSync('USER_ID') != userid) {
					ustatus = "8"
				}
				let data = {
					"taskdetail_id": taskdetail_id,
					"utask_id": utask_id,
					"utype": utype,
					"ustatus": ustatus,
					"rtask_name": rtask_name,
					"ruserid":ruserid
				}
				uni.setStorageSync('taskIndex', this.curNow)
				uni.navigateTo({
					url: '/pages/task/detail?data=' + JSON.stringify(data)
				})
				setTimeout(() => {
					this.lockjump = false;
				}, 500)
			},
			//删除
			delconfirm() {
				if (this.lockdel) return;
				this.lockdel = true;
				uni.showLoading({
					title: '请稍后...'
				})
				var tim = new Date().getTime();
				let id = "";
				var statuss = "";
				if (this.curNow == 0) {
					id = this.tab0.list[this.index].utask_id
					statuss = this.tab0.list[this.index].rstatus;
					let sqldel = 'select taskdetail_id,task_id,status from tb_task_detail where task_id = ' + "'" + id + "'";
					selectSQL('local', sqldel, resdel => {
						resdel.forEach(it => {
							let sql3 = 'select COUNT(task_id) as totalResult from tb_task_delete_status where task_id = ' + "'" + it.taskdetail_id +
								"'";
							selectSQL('local', sql3, res3 => {
								if (res3[0].totalResult == 0) {
									let inserttaskstatus = 'insert into tb_task_delete_status values (' + "'" + it.taskdetail_id + "'" + "," +
										"'" + it.status +
										"'" + "," +
										"'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + ' ) ';
									executeSQL("local", inserttaskstatus, restaskstatus => {});
								} else {
									let sqlstatus = 'update tb_task_delete_status set status = ' + "'" + it.status + "'" + "," +
										' direty = 1 ' + "," +
										' updatetime = ' +
										"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.taskdetail_id + "'";
									executeSQL("local", sqlstatus, resstatuss => {})
								}
							})
						})
					})
					let sqlall = 'select COUNT(task_id) as totalResult from tb_task_delete_status where task_id = ' + "'" + id + "'";
					selectSQL('local', sqlall, resall => {
						if (resall[0].totalResult == 0) {
							let inse = 'insert into tb_task_delete_status values (' + "'" + id + "'" + "," + "'" + statuss +
								"'" + "," +
								"'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + ' ) ';
							executeSQL("local", inse, rest => {});
						} else {
							let sqlsta = 'update tb_task_delete_status set status = ' + "'" + statuss + "'" + "," + ' direty = 1 ' + "," +
								' updatetime = ' +
								"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + id + "'";
							executeSQL("local", sqlsta, resstat => {})
						}

					})

				} else if (this.curNow == 1) {
					id = this.tab1.list[this.index].utask_id
					statuss = this.tab1.list[this.index].rstatus;
					let sqldel = 'select taskdetail_id,task_id,status from tb_task_detail where task_id = ' + "'" + id + "'";
					selectSQL('local', sqldel, resdel => {
						resdel.forEach(it => {
							let sql3 = 'select COUNT(task_id) as totalResult from tb_task_delete_status where task_id = ' + "'" + it.taskdetail_id +
								"'";
							selectSQL('local', sql3, res3 => {
								if (res3[0].totalResult == 0) {
									let inserttaskstatus = 'insert into tb_task_delete_status values (' + "'" + it.taskdetail_id + "'" + "," +
										"'" + it.status +
										"'" + "," +
										"'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + ' ) ';
									executeSQL("local", inserttaskstatus, restaskstatus => {});
								} else {
									let sqlstatus = 'update tb_task_delete_status set status = ' + "'" + it.status + "'" + "," +
										' direty = 1 ' + "," +
										' updatetime = ' +
										"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.taskdetail_id + "'";
									executeSQL("local", sqlstatus, resstatuss => {})
								}
							})
						})
					})

					let sqlall = 'select COUNT(task_id) as totalResult from tb_task_delete_status where task_id = ' + "'" + id + "'";
					selectSQL('local', sqlall, resall => {
						if (resall[0].totalResult == 0) {
							let inse = 'insert into tb_task_delete_status values (' + "'" + id + "'" + "," + "'" + statuss +
								"'" + "," +
								"'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + ' ) ';
							executeSQL("local", inse, rest => {});
						} else {
							let sqlsta = 'update tb_task_delete_status set status = ' + "'" + statuss + "'" + "," + ' direty = 1 ' + "," +
								' updatetime = ' +
								"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + id + "'";
							executeSQL("local", sqlsta, resstat => {})
						}

					})
				}


				let sql = 'update tb_task set status = 1' + "," + ' `delete` = 1 ' + "," + ' updatetime = ' +
					"'" + tim + "'" + ' where task_id = ' + "'" + id + "'";
				executeSQL("local", sql, res => {})
				let sql1 = 'update tb_task_detail set status = 1' + "," + ' `delete` = 1 ' + "," + ' updatetime = ' +
					"'" + tim + "'" + ' where task_id = ' + "'" + id + "'";
				executeSQL("local", sql1, res1 => {
					this.lockdel = false;
					uni.hideLoading();
					this.delshow = false;
					uni.showToast({
						title: "删除成功",
						icon: 'none'
					})
					var curTab = this.getTabData(this.curNow); //当前tab
					curTab.mescroll.resetUpScroll();
					if (this.old.scrollTop != 0) {
						curTab.mescroll.scrollTo(0, 0)
						this.old.scrollTop = 0;
						this.$emit('scorllway', false);
					}
				})
			},


			// 上报
			reportconfirm() {
				this.allow = false
				if (this.lockup) return;
				this.lockup = true;
				uni.showLoading({
					title: '上报中...'
				})
				if (this.curNow == 0) {
					if (this.tab0.list[this.index].utype == 1) {
						if (this.tab0.list[this.index].uuser_id == this.tab0.list[this.index].ruser_id) {
							let sql = 'select norm_id  from tb_task_detail_norm where taskdetail_id = ' + "'" + this.tab0.list[this.index].taskdetail_id +
								"'" + ' group by norm_id';
							selectSQL('local', sql, res => {
								var ids = "";
								for (var value of res) {
									ids = ids + "'" + value.norm_id + "'" + ",";
								}
								ids = ids.substring(0, ids.length - 1);
								let sqlexecelid = 'select excel_id from tb_norm where norm_id in (' + ids + ')' + ' group by excel_id';
								selectSQL('local', sqlexecelid, resexecelids => {
									var exeids = "";
									for (var value of resexecelids) {
										exeids = exeids + "'" + value.excel_id + "'" + ",";
									}
									exeids = exeids.substring(0, exeids.length - 1);
									let sqluserids = 'select distinct user_id from tb_excel where id in (' + exeids + ')';
									selectSQL('local', sqluserids, resuserids => {
										let sqltaskdetails = 'select user_id from tb_task_detail where task_id = ' + "'" + this.tab0.list[this.index]
											.utask_id + "'" + ' group by user_id';
										selectSQL('local', sqltaskdetails, restaskdetails => {
											var taskdetails = "";
											for (var value of restaskdetails) {
												taskdetails = taskdetails + value.user_id + ",";
											}
											taskdetails = taskdetails.substring(0, taskdetails.length - 1);

											let sql1 = 'update tb_task set status = 8' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + this.tab0.list[this.index].utask_id +
												"'";

											executeSQL("local", sql1, res1 => {
												let sql2 = 'update tb_task_detail set status = 8' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
													"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + this.tab0.list[this.index].taskdetail_id +
													"'";
												executeSQL("local", sql2, res2 => {

													uni.hideLoading();
													this.showreport = false;
													uni.showToast({
														title: "上报成功",
														icon: 'none'
													})

												})
											})

											var that = this;

											for (var x = 0; x < resuserids.length; x++) {
												(function(x) {

													let sqly1 = 'select id from tb_excel where user_id = ' + "'" + resuserids[x].user_id + "'";
													selectSQL('local', sqly1, resy1 => {
														var idsy1 = "";
														for (var valuey1 of resy1) {
															idsy1 = idsy1 + "'" + valuey1.id + "'" + ",";
														}
														idsy1 = idsy1.substring(0, idsy1.length - 1);

														let sqlnormids =
															'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm u left join tb_norm r on u.norm_id=r.norm_id  where u.taskdetail_id = ' +
															"'" + that.tab0.list[that.index].taskdetail_id + "'" + ' and r.excel_id in (' + idsy1 + ')';
														selectSQL('local', sqlnormids, resnormids => {

															var tasknormids = "";
															for (var valuex1 of resnormids) {
																tasknormids = tasknormids + "'" + valuex1.tasknormid + "'" + ",";
															}
															tasknormids = tasknormids.substring(0, tasknormids.length - 1);
															let sqltasknormids =
																'select u.tasknormdetailid,u.norm_detail_id,r.serial,r.item as ritem,c.item as citem,u.user_id as uuser_id from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id left join tb_norm_detail c on r.parent_id = c.id where u.tasknormid in (' +
																tasknormids + ')';
															selectSQL('local', sqltasknormids, restasknormdetailid => {

																var arrquestion = [];
																for (var i = 0; i < restasknormdetailid.length; i++) {
																	(function(i) {
																		let sqlquestion =
																			'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,u.updatetime,r.content from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
																			"'" + restasknormdetailid[i].tasknormdetailid + "'";
																		selectSQL('local', sqlquestion, resquestion => {
																			for (var j = 0; j < resquestion.length; j++) {
																				(function(j) {
																					let sqluser = 'select name from sys_user where user_id = ' + "'" +
																						restasknormdetailid[i].uuser_id + "'";
																					selectSQL('local', sqluser, resuser => {

																						if (!(resquestion[j].score == "0" && resquestion[j].problempicture == "" &&
																								resquestion[j].remark == "" && resquestion[j].correctpicture == "" &&
																								resquestion[j].correctremark == "")) {
																							if (that.tab0.list[that.index].utype == "1") {
																								var qes = {
																									"task_name": that.tab0.list[that.index].rtask_name,
																									"serial": restasknormdetailid[i].serial,
																									"status": resquestion[j].status,
																									"unit_name": that.tab0.list[that.index].unit_name,
																									"ritem": restasknormdetailid[i].ritem,
																									"citem": restasknormdetailid[i].citem,
																									"tasktype": that.tab0.list[that.index].utype,
																									"grouper": resuser[0].name,
																									"questioncontent": resquestion[j].content,
																									"questionscore": resquestion[j].score,
																									"questionpicture": resquestion[j].problempicture,
																									"questionremark": resquestion[j].remark,
																									"solveask": resquestion[j].correct,
																									"correctpicture": resquestion[j].correctpicture,
																									"correctremark": resquestion[j].correctremark,
																									"correcttime": "",
																									"scoretype": resquestion[j].score_type
																								}
																								arrquestion.push(qes)
																							} else if (that.tab0.list[that.index].utype == "2") {
																								var qes = {
																									"task_name": that.tab0.list[that.index].rtask_name,
																									"serial": restasknormdetailid[i].serial,
																									"status": resquestion[j].status,
																									"unit_name": that.tab0.list[that.index].unit_name,
																									"ritem": restasknormdetailid[i].ritem,

																									"citem": restasknormdetailid[i].citem,
																									"tasktype": that.tab0.list[that.index].utype,
																									"grouper": resuser[0].name,
																									"questioncontent": resquestion[j].content,
																									"questionscore": resquestion[j].score,
																									"questionpicture": resquestion[j].problempicture,
																									"questionremark": resquestion[j].remark,
																									"solveask": resquestion[j].correct,
																									"correctpicture": resquestion[j].correctpicture,
																									"correctremark": resquestion[j].correctremark,
																									"correcttime": resquestion[j].updatetime,
																									"scoretype": resquestion[j].score_type
																								}
																								arrquestion.push(qes)
																							} else if (that.tab0.list[that.index].utype == "3") {
																								var qes = {
																									"task_name": that.tab0.list[that.index].rtask_name,
																									"serial": restasknormdetailid[i].serial,
																									"status": resquestion[j].status,
																									"unit_name": that.tab0.list[that.index].unit_name,
																									"ritem": restasknormdetailid[i].ritem,
																									"citem": restasknormdetailid[i].citem,
																									"tasktype": that.tab0.list[that.index].utype,
																									"grouper": resuser[0].name,
																									"questioncontent": resquestion[j].content,
																									"questionscore": resquestion[j].score,
																									"questionpicture": resquestion[j].problempicture,
																									"questionremark": resquestion[j].remark,
																									"solveask": resquestion[j].correct,
																									"correctpicture": resquestion[j].correctpicture,
																									"correctremark": resquestion[j].correctremark,
																									"correcttime": "",
																									"scoretype": resquestion[j].score_type
																								}
																								arrquestion.push(qes)
																							}

																						}


																						if (i == restasknormdetailid.length - 1 && j == resquestion.length - 1) {

																							var uuid = helper.uuid();

																							var toles = 0;
																							arrquestion.forEach(vals => {
																								if (vals.scoretype == "1" && vals.questionscore != "0") {
																									toles = toles + 1;
																								}
																							})

																							var toles1 = 0;
																							arrquestion.forEach(vals => {
																								if (vals.scoretype == "0" && vals.questionscore != "0") {
																									toles1 = toles1 + 1;
																								}
																							})

																							var types = "0"
																							var statuses = "1"
																							if (toles > 0) {
																								types = "1"
																								statuses = "0"
																							}

																							let insert = 'insert into tb_group_report values (' + "'" + uuid + "'" +
																								"," +
																								"'" + that.tab0.list[that.index].utask_id +
																								"'" + "," +
																								"'" + that.tab0.list[that.index].taskdetail_id + "'" + "," + "'" + "" +
																								"'" + "," + "'" + "" +
																								"'" +
																								"," + "'" + that.tab0.list[that.index].runit_id + "'" + "," + "'" + that.tab0
																								.list[that.index].rsite_id +
																								"'" + "," + "'" + toles + "'" + "," + "'" + that.tab0.list[
																									that.index]
																								.uuser_id + "'" + "," + "'" + taskdetails + "'" + "," + "'" + resuserids[x]
																								.user_id + "'" + "," + "'" + types +
																								"'" + "," + "'" + statuses + "'" + "," + "'" + toles1 + "'" + "," + "'" +
																								new Date().getTime() +
																								"'" +
																								"," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() +
																								"'" + "," +
																								"'" +
																								"" + "'" + "," + "'" + JSON.stringify(arrquestion) + "'" + ' ) ';

																							executeSQL("local", insert, resinsert => {

																								if (resuserids.length - 1 == x) {
																									var curTab = that.getTabData(that.curNow); //当前tab
																									curTab.mescroll.resetUpScroll();
																									that.allow = true;
																									if (that.old.scrollTop != 0) {
																										curTab.mescroll.scrollTo(0, 0)
																										that.old.scrollTop = 0;
																										that.$emit('scorllway', false);
																									}
																								}

																							});







																						}



																					})
																				})(j);
																			}
																		})

																	})(i);

																}

															})

														})
													})

												})(x);
											}


										})
									})
								})
							})
						} else if (this.tab0.list[this.index].uuser_id != this.tab0.list[this.index].ruser_id) {


							let that = this;
							var arrquestion = [];
							let sqly1 = 'select id from tb_excel where user_id = ' + "'" + that.tab0.list[that.index].ruser_id + "'";
							selectSQL('local', sqly1, resy1 => {
								var idsy1 = "";
								for (var valuey1 of resy1) {
									idsy1 = idsy1 + "'" + valuey1.id + "'" + ",";
								}
								idsy1 = idsy1.substring(0, idsy1.length - 1);

								let sqlnormids =
									'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm  u  where u.taskdetail_id = ' +
									"'" + that.tab0.list[that.index].taskdetail_id + "'";



								selectSQL('local', sqlnormids, resnormids => {

									var tasknormids = "";
									for (var valuex1 of resnormids) {
										tasknormids = tasknormids + "'" + valuex1.tasknormid + "'" + ",";
									}
									tasknormids = tasknormids.substring(0, tasknormids.length - 1);
									let sqltasknormids =
										'select u.tasknormdetailid,u.norm_detail_id,r.serial,r.item as ritem,c.item as citem from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id left join tb_norm_detail c on r.parent_id = c.id where u.tasknormid in (' +
										tasknormids + ')';
									selectSQL('local', sqltasknormids, restasknormdetailid => {

										for (var i = 0; i < restasknormdetailid.length; i++) {
											(function(i) {
												let sqlquestion =
													'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,u.updatetime,r.content from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
													"'" + restasknormdetailid[i].tasknormdetailid + "'";
												selectSQL('local', sqlquestion, resquestion => {
													for (var j = 0; j < resquestion.length; j++) {
														(function(j) {
															let sqluser = 'select name from sys_user where user_id = ' + "'" + that.tab0.list[that.index].uuser_id +
																"'";
															selectSQL('local', sqluser, resuser => {


																if (!(resquestion[j].score == "0" && resquestion[j].problempicture == "" && resquestion[j].remark ==
																		"" && resquestion[j].correctpicture == "" && resquestion[j].correctremark == "")) {
																	if (that.tab0.list[that.index].utype == "1") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,
																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": "",
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	} else if (that.tab0.list[that.index].utype == "2") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,

																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": resquestion[j].updatetime,
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	} else if (that.tab0.list[that.index].utype == "3") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,
																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": "",
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	}

																}
																if (i == restasknormdetailid.length - 1 && j == resquestion.length - 1) {

																	var toles = 0;
																	arrquestion.forEach(vals => {
																		if (vals.scoretype == "0" && vals.questionscore != "0") {
																			toles = toles + 1;
																		}
																	})



																	let insert = 'insert into tb_group_report values (' + "'" + helper.uuid() + "'" + "," +
																		"'" + that.tab0.list[that.index].utask_id +
																		"'" + "," +
																		"'" + that.tab0.list[that.index].taskdetail_id + "'" + "," + "'" + "" + "'" + "," + "'" +
																		"" + "'" +
																		"," + "'" + that.tab0.list[that.index].runit_id + "'" + "," + "'" + that.tab0.list[that.index]
																		.rsite_id +
																		"'" + "," + "'" + that.tab0.list[that.index].utotlequestion + "'" + "," + "'" + that.tab0
																		.list[
																			that.index]
																		.ruser_id + "'" + "," + "'" + that.tab0.list[that.index].uuser_id + "'" + "," + "'" +
																		that.tab0.list[that.index]
																		.ruser_id + "'" + "," + "'" +
																		"0" + "'" + "," + "'" + "0" + "'" + "," + "'" + toles + "'" + "," + "'" + new Date().getTime() +
																		"'" +
																		"," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																		"," + "'" +
																		"" + "'" + "," + "'" + JSON.stringify(arrquestion) + "'" + ' ) ';
																	executeSQL("local", insert, resinsert => {
																		let sql2 = 'update tb_task_detail set status = 7' + "," + ' direty = 1 ' + "," +
																			' updatetime = ' +
																			"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.tab0.list[
																				that.index].taskdetail_id +
																			"'";
																		executeSQL("local", sql2, res2 => {

																			uni.hideLoading();
																			that.showreport = false;
																			uni.showToast({
																				title: "上报成功",
																				icon: 'none'
																			})
																			var curTab = that.getTabData(that.curNow); //当前tab
																			curTab.mescroll.resetUpScroll();
																			that.allow = true;
																			if (that.old.scrollTop != 0) {
																				curTab.mescroll.scrollTo(0, 0)
																				that.old.scrollTop = 0;
																				that.$emit('scorllway', false);
																			}

																		})

																		let sql22 = 'update tb_group_report set status = ' + "'" + "1" + "'" +
																			"," +
																			' direty = 1 ' + "," + ' updatetime = ' +
																			"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.tab0.list[
																				that.index].taskdetail_id + "'" + ' and user_id = ' + "'" + that.tab0.list[that.index]
																			.uuser_id + "'" + ' and status = 0';
																		executeSQL("local", sql22, re22 => {})
																	});

																}

															})
														})(j);
													}
												})

											})(i);

										}

									})

								})
							})

						}
					} else if (this.tab0.list[this.index].utype == 2) {
						if (this.tab0.list[this.index].uuser_id == this.tab0.list[this.index].ruser_id) {
							let sql = 'select norm_id from tb_task_detail_norm where taskdetail_id = ' + "'" + this.tab0.list[this.index].taskdetail_id +
								"'" + ' group by norm_id';
							selectSQL('local', sql, res => {
								var ids = "";
								for (var value of res) {
									ids = ids + "'" + value.norm_id + "'" + ",";
								}
								ids = ids.substring(0, ids.length - 1);
								let sqlexecelid = 'select excel_id from tb_norm where norm_id in (' + ids + ')' + ' group by excel_id';
								selectSQL('local', sqlexecelid, resexecelids => {
									var exeids = "";
									for (var value of resexecelids) {
										exeids = exeids + "'" + value.excel_id + "'" + ",";
									}
									exeids = exeids.substring(0, exeids.length - 1);
									let sqluserids = 'select distinct user_id from tb_excel where id in (' + exeids + ')';
									selectSQL('local', sqluserids, resuserids => {
										let sqltaskdetails = 'select user_id from tb_task_detail where task_id = ' + "'" + this.tab0.list[this.index]
											.utask_id + "'" + ' group by user_id';
										selectSQL('local', sqltaskdetails, restaskdetails => {

											var taskdetails = "";
											for (var value of restaskdetails) {
												taskdetails = taskdetails + value.user_id + ",";
											}
											taskdetails = taskdetails.substring(0, taskdetails.length - 1);
											let sql1 = 'update tb_task set status = 7' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + this.tab0.list[this.index].utask_id +
												"'";
											executeSQL("local", sql1, res1 => {
												let sql2 = 'update tb_task_detail set status = 7' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
													"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + this.tab0.list[this.index].taskdetail_id +
													"'";
												executeSQL("local", sql2, res2 => {

													uni.hideLoading();
													this.showreport = false;
													uni.showToast({
														title: "上报成功",
														icon: 'none'
													})


												})


												let sql22 = 'update tb_group_report set status = ' + "'" + "1" + "'" +
													"," +
													' direty = 1 ' + "," + ' updatetime = ' +
													"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + this.tab0.list[this.index].taskdetail_id +
													"'" + ' and user_id = ' + "'" + this.tab0.list[this.index].uuser_id + "'" + ' and status = 0';
												executeSQL("local", sql22, re22 => {})
											})

											for (var value of resuserids) {


												let that = this;
												var arrquestion = [];
												let sqly1 = 'select id from tb_excel where user_id = ' + "'" + value.user_id + "'";
												selectSQL('local', sqly1, resy1 => {
													var idsy1 = "";
													for (var valuey1 of resy1) {
														idsy1 = idsy1 + "'" + valuey1.id + "'" + ",";
													}
													idsy1 = idsy1.substring(0, idsy1.length - 1);


													let sqlnormids =
														'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm u left join tb_norm r on u.norm_id=r.norm_id  where u.taskdetail_id = ' +
														"'" + that.tab0.list[that.index].taskdetail_id + "'" + ' and r.excel_id in (' + idsy1 + ')';


													selectSQL('local', sqlnormids, resnormids => {

														var tasknormids = "";
														for (var valuex1 of resnormids) {
															tasknormids = tasknormids + "'" + valuex1.tasknormid + "'" + ",";
														}
														tasknormids = tasknormids.substring(0, tasknormids.length - 1);
														let sqltasknormids =
															'select u.tasknormdetailid,u.norm_detail_id,r.serial,r.item as ritem,c.item as citem,u.user_id as uuser_id from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id left join tb_norm_detail c on r.parent_id = c.id where u.tasknormid in (' +
															tasknormids + ')';
														selectSQL('local', sqltasknormids, restasknormdetailid => {

															for (var i = 0; i < restasknormdetailid.length; i++) {
																(function(i) {
																	let sqlquestion =
																		'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,u.updatetime,r.content from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
																		"'" + restasknormdetailid[i].tasknormdetailid + "'";
																	selectSQL('local', sqlquestion, resquestion => {
																		for (var j = 0; j < resquestion.length; j++) {
																			(function(j) {
																				let sqluser = 'select name from sys_user where user_id = ' + "'" +
																					restasknormdetailid[i].uuser_id + "'";
																				selectSQL('local', sqluser, resuser => {
																					if (!(resquestion[j].score == "0" && resquestion[j].problempicture == "" &&
																							resquestion[j].remark == "" && resquestion[j].correctpicture == "" &&
																							resquestion[j].correctremark == "")) {
																						if (that.tab0.list[that.index].utype == "1") {
																							var qes = {
																								"task_name": that.tab0.list[that.index].rtask_name,
																								"serial": restasknormdetailid[i].serial,
																								"status": resquestion[j].status,
																								"unit_name": that.tab0.list[that.index].unit_name,
																								"ritem": restasknormdetailid[i].ritem,
																								"citem": restasknormdetailid[i].citem,
																								"tasktype": that.tab0.list[that.index].utype,
																								"grouper": resuser[0].name,
																								"questioncontent": resquestion[j].content,
																								"questionscore": resquestion[j].score,
																								"questionpicture": resquestion[j].problempicture,
																								"questionremark": resquestion[j].remark,
																								"solveask": resquestion[j].correct,
																								"correctpicture": resquestion[j].correctpicture,
																								"correctremark": resquestion[j].correctremark,
																								"correcttime": "",
																								"scoretype": resquestion[j].score_type
																							}
																							arrquestion.push(qes)
																						} else if (that.tab0.list[that.index].utype == "2") {
																							var qes = {
																								"task_name": that.tab0.list[that.index].rtask_name,
																								"serial": restasknormdetailid[i].serial,
																								"status": resquestion[j].status,
																								"unit_name": that.tab0.list[that.index].unit_name,
																								"ritem": restasknormdetailid[i].ritem,

																								"citem": restasknormdetailid[i].citem,
																								"tasktype": that.tab0.list[that.index].utype,
																								"grouper": resuser[0].name,
																								"questioncontent": resquestion[j].content,
																								"questionscore": resquestion[j].score,
																								"questionpicture": resquestion[j].problempicture,
																								"questionremark": resquestion[j].remark,
																								"solveask": resquestion[j].correct,
																								"correctpicture": resquestion[j].correctpicture,
																								"correctremark": resquestion[j].correctremark,
																								"correcttime": resquestion[j].updatetime,
																								"scoretype": resquestion[j].score_type
																							}
																							arrquestion.push(qes)
																						} else if (that.tab0.list[that.index].utype == "3") {
																							var qes = {
																								"task_name": that.tab0.list[that.index].rtask_name,
																								"serial": restasknormdetailid[i].serial,
																								"status": resquestion[j].status,
																								"unit_name": that.tab0.list[that.index].unit_name,
																								"ritem": restasknormdetailid[i].ritem,
																								"citem": restasknormdetailid[i].citem,
																								"tasktype": that.tab0.list[that.index].utype,
																								"grouper": resuser[0].name,
																								"questioncontent": resquestion[j].content,
																								"questionscore": resquestion[j].score,
																								"questionpicture": resquestion[j].problempicture,
																								"questionremark": resquestion[j].remark,
																								"solveask": resquestion[j].correct,
																								"correctpicture": resquestion[j].correctpicture,
																								"correctremark": resquestion[j].correctremark,
																								"correcttime": "",
																								"scoretype": resquestion[j].score_type
																							}
																							arrquestion.push(qes)
																						}
																					}
																					if (i == restasknormdetailid.length - 1 && j == resquestion.length - 1) {

																						var toles = 0;
																						arrquestion.forEach(vals => {
																							if (vals.scoretype == "0" && vals.questionscore != "0") {
																								toles = toles + 1;
																							}
																						})

																						let insert = 'insert into tb_group_report values (' + "'" + helper.uuid() +
																							"'" + "," +
																							"'" + that.tab0.list[that.index].utask_id +
																							"'" + "," +
																							"'" + that.tab0.list[that.index].taskdetail_id + "'" + "," + "'" + "" + "'" +
																							"," + "'" + "" + "'" +
																							"," + "'" + that.tab0.list[that.index].runit_id + "'" + "," + "'" + that.tab0
																							.list[that.index].rsite_id +
																							"'" + "," + "'" + that.tab0.list[that.index].utotlequestion + "'" + "," +
																							"'" + that.tab0.list[
																								that.index]
																							.uuser_id + "'" + "," + "'" + taskdetails + "'" + "," + "'" + value.user_id +
																							"'" + "," + "'" +
																							"0" + "'" + "," + "'" + "0" + "'" + "," + "'" + toles + "'" + "," + "'" +
																							new Date().getTime() + "'" +
																							"," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() +
																							"'" + "," + "'" +
																							"" + "'" + "," + "'" + JSON.stringify(arrquestion) + "'" + ' ) ';
																						executeSQL("local", insert, resinsert => {
																							var curTab = that.getTabData(that.curNow); //当前tab
																							curTab.mescroll.resetUpScroll();
																							that.allow = true;
																							if (that.old.scrollTop != 0) {
																								curTab.mescroll.scrollTo(0, 0)
																								that.old.scrollTop = 0;
																								that.$emit('scorllway', false);
																							}

																						});

																					}

																				})
																			})(j);
																		}
																	})

																})(i);

															}

														})

													})
												})

											}

										})
									})
								})
							})
						} else if (this.tab0.list[this.index].uuser_id != this.tab0.list[this.index].ruser_id) {

							let that = this;
							var arrquestion = [];
							let sqly1 = 'select id from tb_excel where user_id = ' + "'" + that.tab0.list[that.index].ruser_id + "'";
							selectSQL('local', sqly1, resy1 => {
								var idsy1 = "";
								for (var valuey1 of resy1) {
									idsy1 = idsy1 + "'" + valuey1.id + "'" + ",";
								}
								idsy1 = idsy1.substring(0, idsy1.length - 1);

								let sqlnormids =
									'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm  u  where u.taskdetail_id = ' +
									"'" + that.tab0.list[that.index].taskdetail_id + "'";


								selectSQL('local', sqlnormids, resnormids => {

									var tasknormids = "";
									for (var valuex1 of resnormids) {
										tasknormids = tasknormids + "'" + valuex1.tasknormid + "'" + ",";
									}
									tasknormids = tasknormids.substring(0, tasknormids.length - 1);
									let sqltasknormids =
										'select u.tasknormdetailid,u.norm_detail_id,r.serial,r.item as ritem,c.item as citem from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id left join tb_norm_detail c on r.parent_id = c.id where u.tasknormid in (' +
										tasknormids + ')';
									selectSQL('local', sqltasknormids, restasknormdetailid => {

										for (var i = 0; i < restasknormdetailid.length; i++) {
											(function(i) {
												let sqlquestion =
													'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,u.updatetime,r.content from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
													"'" + restasknormdetailid[i].tasknormdetailid + "'";
												selectSQL('local', sqlquestion, resquestion => {
													for (var j = 0; j < resquestion.length; j++) {
														(function(j) {
															let sqluser = 'select name from sys_user where user_id = ' + "'" + that.tab0.list[that.index].uuser_id +
																"'";
															selectSQL('local', sqluser, resuser => {
																if (!(resquestion[j].score == "0" && resquestion[j].problempicture == "" && resquestion[j].remark ==
																		"" && resquestion[j].correctpicture == "" && resquestion[j].correctremark == "")) {
																	if (that.tab0.list[that.index].utype == "1") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,
																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": "",
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	} else if (that.tab0.list[that.index].utype == "2") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,

																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": resquestion[j].updatetime,
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	} else if (that.tab0.list[that.index].utype == "3") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,
																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": "",
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	}
																}
																if (i == restasknormdetailid.length - 1 && j == resquestion.length - 1) {

																	var toles = 0;
																	arrquestion.forEach(vals => {
																		if (vals.scoretype == "0" && vals.questionscore != "0") {
																			toles = toles + 1;
																		}
																	})

																	let insert = 'insert into tb_group_report values (' + "'" + helper.uuid() + "'" + "," +
																		"'" + that.tab0.list[that.index].utask_id +
																		"'" + "," +
																		"'" + that.tab0.list[that.index].taskdetail_id + "'" + "," + "'" + "" + "'" + "," + "'" +
																		"" + "'" +
																		"," + "'" + that.tab0.list[that.index].runit_id + "'" + "," + "'" + that.tab0.list[that.index]
																		.rsite_id +
																		"'" + "," + "'" + that.tab0.list[that.index].utotlequestion + "'" + "," + "'" + that.tab0
																		.list[
																			that.index]
																		.ruser_id + "'" + "," + "'" + that.tab0.list[that.index].uuser_id + "'" + "," + "'" +
																		that.tab0.list[that.index]
																		.ruser_id + "'" + "," + "'" +
																		"0" + "'" + "," + "'" + "0" + "'" + "," + "'" + toles + "'" + "," + "'" + new Date().getTime() +
																		"'" +
																		"," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																		"," + "'" +
																		"" + "'" + "," + "'" + JSON.stringify(arrquestion) + "'" + ' ) ';
																	executeSQL("local", insert, resinsert => {
																		let sql2 = 'update tb_task_detail set status = 7' + "," + ' direty = 1 ' + "," +
																			' updatetime = ' +
																			"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.tab0.list[
																				that.index].taskdetail_id +
																			"'";
																		executeSQL("local", sql2, res2 => {

																			uni.hideLoading();
																			that.showreport = false;
																			uni.showToast({
																				title: "上报成功",
																				icon: 'none'
																			})
																			var curTab = that.getTabData(that.curNow); //当前tab
																			curTab.mescroll.resetUpScroll();
																			that.allow = true;
																			if (that.old.scrollTop != 0) {
																				curTab.mescroll.scrollTo(0, 0)
																				that.old.scrollTop = 0;
																				that.$emit('scorllway', false);
																			}
																		})

																		let sql22 = 'update tb_group_report set status = ' + "'" + "1" + "'" +
																			"," +
																			' direty = 1 ' + "," + ' updatetime = ' +
																			"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.tab0.list[
																				that.index].taskdetail_id + "'" + ' and user_id = ' + "'" + that.tab0.list[that.index]
																			.uuser_id + "'" + ' and status = 0';
																		executeSQL("local", sql22, re22 => {})
																	});


																}

															})
														})(j);
													}
												})

											})(i);

										}

									})

								})
							})
						}
					} else if (this.tab0.list[this.index].utype == 3) {
						if (this.tab0.list[this.index].uuser_id != this.tab0.list[this.index].ruser_id) {

							let that = this;
							var arrquestion = [];
							let sqly1 = 'select id from tb_excel where user_id = ' + "'" + that.tab0.list[that.index].ruser_id + "'";
							selectSQL('local', sqly1, resy1 => {
								var idsy1 = "";
								for (var valuey1 of resy1) {
									idsy1 = idsy1 + "'" + valuey1.id + "'" + ",";
								}
								idsy1 = idsy1.substring(0, idsy1.length - 1);


								let sqlnormids =
									'select u.norm_id,u.question,u.tasknormid from tb_task_detail_norm  u  where u.taskdetail_id = ' +
									"'" + that.tab0.list[that.index].taskdetail_id + "'";



								selectSQL('local', sqlnormids, resnormids => {

									var tasknormids = "";
									for (var valuex1 of resnormids) {
										tasknormids = tasknormids + "'" + valuex1.tasknormid + "'" + ",";
									}
									tasknormids = tasknormids.substring(0, tasknormids.length - 1);
									let sqltasknormids =
										'select u.tasknormdetailid,u.norm_detail_id,r.serial,r.item as ritem,c.item as citem from tb_task_detail_norm_detail u left join tb_norm_detail r on u.norm_detail_id = r.id left join tb_norm_detail c on r.parent_id = c.id where u.tasknormid in (' +
										tasknormids + ')';
									selectSQL('local', sqltasknormids, restasknormdetailid => {

										for (var i = 0; i < restasknormdetailid.length; i++) {
											(function(i) {
												let sqlquestion =
													'select u.tasknormdetailid,u.norm_row_id,u.score_type,u.score,u.status,u.problempicture,u.remark,u.correct,u.correctremark,u.correctpicture,u.updatetime,r.content from tb_task_detail_checkrow u left join tb_norm_detail_row r on u.norm_row_id = r.id where u.tasknormdetailid = ' +
													"'" + restasknormdetailid[i].tasknormdetailid + "'";
												selectSQL('local', sqlquestion, resquestion => {
													for (var j = 0; j < resquestion.length; j++) {
														(function(j) {
															let sqluser = 'select name from sys_user where user_id = ' + "'" + that.tab0.list[that.index].uuser_id +
																"'";
															selectSQL('local', sqluser, resuser => {
																if (!(resquestion[j].score == "0" && resquestion[j].problempicture == "" && resquestion[j].remark ==
																		"" && resquestion[j].correctpicture == "" && resquestion[j].correctremark == "")) {
																	if (that.tab0.list[that.index].utype == "1") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,
																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": "",
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	} else if (that.tab0.list[that.index].utype == "2") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,

																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": resquestion[j].updatetime,
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	} else if (that.tab0.list[that.index].utype == "3") {
																		var qes = {
																			"task_name": that.tab0.list[that.index].rtask_name,
																			"serial": restasknormdetailid[i].serial,
																			"status": resquestion[j].status,
																			"unit_name": that.tab0.list[that.index].unit_name,
																			"ritem": restasknormdetailid[i].ritem,
																			"citem": restasknormdetailid[i].citem,
																			"tasktype": that.tab0.list[that.index].utype,
																			"grouper": resuser[0].name,
																			"questioncontent": resquestion[j].content,
																			"questionscore": resquestion[j].score,
																			"questionpicture": resquestion[j].problempicture,
																			"questionremark": resquestion[j].remark,
																			"solveask": resquestion[j].correct,
																			"correctpicture": resquestion[j].correctpicture,
																			"correctremark": resquestion[j].correctremark,
																			"correcttime": "",
																			"scoretype": resquestion[j].score_type
																		}
																		arrquestion.push(qes)
																	}
																}
																if (i == restasknormdetailid.length - 1 && j == resquestion.length - 1) {
																	var toles = 0;
																	arrquestion.forEach(vals => {
																		if (vals.scoretype == "0" && vals.questionscore != "0") {
																			toles = toles + 1;
																		}
																	})


																	let insert = 'insert into tb_group_report values (' + "'" + helper.uuid() + "'" + "," +
																		"'" + that.tab0.list[that.index].utask_id +
																		"'" + "," +
																		"'" + that.tab0.list[that.index].taskdetail_id + "'" + "," + "'" + "" + "'" + "," + "'" +
																		"" + "'" +
																		"," + "'" + that.tab0.list[that.index].runit_id + "'" + "," + "'" + that.tab0.list[that.index]
																		.rsite_id +
																		"'" + "," + "'" + that.tab0.list[that.index].utotlequestion + "'" + "," + "'" + that.tab0
																		.list[
																			that.index]
																		.ruser_id + "'" + "," + "'" + that.tab0.list[that.index].uuser_id + "'" + "," + "'" +
																		that.tab0.list[that.index]
																		.ruser_id + "'" + "," + "'" +
																		"0" + "'" + "," + "'" + "0" + "'" + "," + "'" + toles + "'" + "," + "'" + new Date().getTime() +
																		"'" +
																		"," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" +
																		"," + "'" +
																		"" + "'" + "," + "'" + JSON.stringify(arrquestion) + "'" + ' ) ';
																	executeSQL("local", insert, resinsert => {
																		let sql2 = 'update tb_task_detail set status = 7' + "," + ' direty = 1 ' + "," +
																			' updatetime = ' +
																			"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.tab0.list[
																				that.index].taskdetail_id +
																			"'";
																		executeSQL("local", sql2, res2 => {
																			uni.hideLoading();
																			that.showreport = false;
																			uni.showToast({
																				title: "上报成功",
																				icon: 'none'
																			})
																			var curTab = that.getTabData(that.curNow); //当前tab
																			curTab.mescroll.resetUpScroll();
																			that.allow = true;
																			if (that.old.scrollTop != 0) {
																				curTab.mescroll.scrollTo(0, 0)
																				that.old.scrollTop = 0;
																				that.$emit('scorllway', false);
																			}
																		})
																		let sql22 = 'update tb_group_report set status = ' + "'" + "1" + "'" +
																			"," +
																			' direty = 1 ' + "," + ' updatetime = ' +
																			"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.tab0.list[
																				that.index].taskdetail_id + "'" + ' and user_id = ' + "'" + that.tab0.list[that.index]
																			.uuser_id + "'" + ' and status = 0';
																		executeSQL("local", sql22, re22 => {})


																	});



																}

															})
														})(j);
													}
												})

											})(i);

										}

									})

								})
							})

						}
					}
				} else if (this.curNow == 1) {
					console.log("此处不应出现上报")
				}
			},
			personSheetCallback(index) {
				let name = this.personSheetList[index].text;
				let id = this.personSheetList[index].id;
				this.collapseList[this.openindex].person = name;
				this.collapseList[this.openindex].personid = id;
			},
			personSheetClose() {
				this.collapseList[this.openindex].person = '';
				this.collapseList[this.openindex].personid = '';
			},
			cancelproblem() {
				this.showAllot = false;
			},
			sureproblem() {
				if (this.lock) return;
				this.lock = true;
				let that = this;
				var person = []
				this.collapseList.map(item => {
					if (person.map(c => c.userid).indexOf(item.personid) == -1) {
						var per = {
							"userid": item.personid,
							"detailids": [item.id]
						}
						person.push(per)
					} else {
						var dex = person.map(c => c.userid).indexOf(item.personid)
						if (person[dex].detailids.indexOf(item.id) == -1) {
							person[dex].detailids.push(item.id)
						}
					}
				})


				var k = 0;
				for (var i = 0; i < person.length; i++) {
					if (person[i].userid == '') {
						k = k + 1;
					}
				}

				if (k == person.length) {
					this.$refs.uToast.show({
						title: '请先指派人员',
						type: 'warning'
					});
					this.lock = false;
					return;
				}

				uni.showLoading({
					title: '请稍后...'
				})
				person.forEach(it => {
					if (it.userid != '') {

						var ids = "";
						for (var value of it.detailids) {
							ids = ids + "'" + value + "'" + ",";
						}
						ids = ids.substring(0, ids.length - 1);

						let sql = 'select totlecheck,question from tb_task_detail_norm where norm_detail_id in (' + ids + ')' +
							' and taskdetail_id = ' + "'" + that.nowtask.taskdetail_id + "'";
						selectSQL('local', sql, resids => {

							var num = 0;
							resids.forEach(rev => {
								num = Number(num) + Number(rev.totlecheck)
							});
							var num1 = 0;
							resids.forEach(rev => {
								num1 = Number(num1) + Number(rev.question)
							});


							var uuid = helper.uuid();
							let inserttaskdetail = 'insert into tb_task_detail values (' + "'" + uuid + "'" + "," + "'" +
								that.nowtask.utask_id +
								"'" + "," +
								"'" + num1 + "'" + "," + "'" + num + "'" + "," + "'" + "0" + "'" + "," + "'" +
								new Date().getTime() + "'" + "," + "'" + "" + "'" + "," + "'" + it.userid + "'" + "," + "'" +
								"2" +
								"'" + "," + "'" + "1" + "'" + "," + "'" + "0" + "'" + "," + "'" + new Date().getTime() + "'" + "," +
								"'" + "2" + "'" + "," + "'" + "0" + "'" + ' ) ';

							executeSQL("local", inserttaskdetail, resintaskdetail => {
								let sql6 = 'update tb_task_detail set totlecheck = totlecheck - ' + "'" + num + "'" + "," +
									' totlequestion = totlequestion - ' + "'" + num1 + "'" + "," +
									' direty = 1 ' +
									"," + ' updatetime = ' +
									"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.nowtask.taskdetail_id +
									"'";
								executeSQL("local", sql6, res6 => {

									let sql7 = 'update tb_task set totolequestion = totolequestion - ' + "'" + num1 + "'" +
										"," + ' direty = 1 ' + "," + ' updatetime = ' +
										"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + that.nowtask.utask_id +
										"'";
									executeSQL("local", sql7, res7 => {})
								})

								for (var value1 of it.detailids) {
									let sql5 =
										'select tasknormid,task_id,norm_id,norm_detail_id,totlecheck,status,question,losescroe,score,hascheck,user_id from tb_task_detail_norm where taskdetail_id = ' +
										"'" + that.nowtask.taskdetail_id + "'" + ' and norm_detail_id = ' + "'" + value1 + "'";
									selectSQL('local', sql5, res5 => {

										if (res5[0].hascheck != "0") {
											let sql9 = 'update tb_task set hascheck = hascheck - ' + "'" + res5[0].hascheck + "'" + "," +
												' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + that.nowtask.utask_id +
												"'";
											executeSQL("local", sql9, res9 => {})

											let sql10 = 'update tb_task_detail set hascheck = hascheck - ' + "'" + res5[0].hascheck + "'" + "," +
												' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + that.nowtask.taskdetail_id +
												"'";
											executeSQL("local", sql10, res10 => {})
										}

										let update = 'update tb_task_detail_norm set taskdetail_id = ' + "'" + uuid + "'" +
											"," + ' status = ' + "'" + "0" + "'" + "," +
											' hascheck = ' +
											"'" + "0" + "'" + "," + ' user_id = ' + "'" + it.userid + "'" + "," +
											' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where tasknormid = ' + "'" + res5[0].tasknormid + "'";

										executeSQL("local", update, resupdate => {
											let updatedetail = 'update tb_task_detail_norm_detail set status = ' + "'" + "0" + "'" +
												"," +
												' user_id = ' + "'" + it.userid + "'" + "," +
												' direty = 1 ' + "," + ' updatetime = ' +
												"'" + new Date().getTime() + "'" + ' where tasknormid = ' + "'" + res5[0].tasknormid + "'";
											executeSQL("local", updatedetail, resupdatedetail => {
												let sql15 =
													'select tasknormdetailid from tb_task_detail_norm_detail where tasknormid = ' +
													"'" + res5[0].tasknormid + "'";
												selectSQL('local', sql15, res15 => {

													var idss = "";
													for (var value3 of res15) {
														idss = idss + "'" + value3.tasknormdetailid + "'" + ",";
													}
													idss = idss.substring(0, idss.length - 1);
													let updatedetailrow = 'update tb_task_detail_checkrow set direty =  1' +
														"," +
														' updatetime = ' +
														"'" + new Date().getTime() + "'" + ' where tasknormdetailid in (' + idss + ')';
													executeSQL("local", updatedetailrow, resupdatedetailrow => {

													})

												})
											})
										})
									})
								}
							})
						})

					}
				})




				let sql2 = 'update tb_task_detail set toperson = 1' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + this.nowtask.taskdetail_id +
					"'";
				executeSQL("local", sql2, res2 => {
					setTimeout(() => {
						this.lock = false;
						uni.hideLoading();
						this.showAllot = false;
						var curTab = this.getTabData(this.curNow); //当前tab
						curTab.mescroll.resetUpScroll();
					}, 800)


				})
			},
			//确认导出
			confirmExcelOut() {

				/**
				 * 导出单个任务的数据
				 * 是否导出图片:isFlag:1导出图片,2不导出图片
				 * 全部数据/问题数据(分权限)status:1全部数据,2问题数据
				 * importUserToTask(taskId, isFlag, status)
				 * @param {Object} taskId
				 */
				let status = 1;
				let isFlag = 1;
				if (this.checkpic == "否") {
					isFlag = 2
				}
				if (this.checktype == "问题数据") {
					status = 2
				}
				var w = plus.nativeUI.showWaiting("处理中，请等待...", {
					style: "black",
					loading: {
						display: "inline"
					}
				});
				importUserToTask(this.taskName, this.task_id, isFlag, status).then(res => {
					if (res.constructor === String) {
						if (res == "isFlag") {
							w.close();
							//以上成对，加载之前showLoading，加载之后hideToast
							plus.nativeUI.toast('暂无数据');
						} else {
							w.close();
							//以上成对，加载之前showLoading，加载之后hideToast
							plus.nativeUI.toast(res);
							this.cancelCheck()
						}
					} else {
						w.close();
						//以上成对，加载之前showLoading，加载之后hideToast
						plus.nativeUI.toast("导出数据失败了");
					}
				})

			},

	selectprocessandstatus() {
				this.tab0.list.forEach(it => {
			if(uni.getStorageSync('USER_ID') != it.ugroup_id){
					if (uni.getStorageSync('USER_ID') == it.ruser_id) {
					  if(it.utype == 1 || it.utype == 2){
						if (it.rstatus != "1" && it.rstatus != "7" && it.rstatus != "8" && it.rstatus != "9") {
							var now = new Date().getTime();
							var age = 86399999 + Number(it.rend_time);
							//被比较的开始时间必须大于等于既定的开始时间,结束时间必须小于等于既定的结束时间
							if (now < age) {
								let selecttask =
									'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
									"'" + it.taskdetail_id + "'";
								selectSQL('local', selecttask, res => {
									if (Number(res[0].rhascheck) == 0) {
										it.rstatus = 2
										let sql1 = 'update tb_task set status = 2' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
										executeSQL("local", sql1, res1 => {})

										let sql11 = 'update tb_task_detail set status = 2' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql11, res11 => {})

									} else if (Number(res[0].rhascheck) > 0 && Number(res[0].rhascheck) < Number(res[0].rtotlecheck)) {
										it.rstatus = 3
										let sql1 = 'update tb_task set status = 3' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
										executeSQL("local", sql1, res1 => {})


										let sql11 = 'update tb_task_detail set status = 3' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql11, res11 => {})

									} else if (res[0].rhascheck == res[0].rtotlecheck) {
										it.rstatus = 4
										let sql1 = 'update tb_task set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
										executeSQL("local", sql1, res1 => {})

										let sql11 = 'update tb_task_detail set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql11, res11 => {})
										
										
										
										let sqltoperson = 'update tb_task_detail set toperson = 1' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id +
											"'";
										executeSQL("local", sqltoperson, restoperson => {})
										

									}
									it.rhascheck = res[0].rhascheck;
									it.rtotlecheck = res[0].rtotlecheck;
									var num = it.rhascheck / it.rtotlecheck;
									num = (num * 100).toFixed(2)
									it.rpercent = num;
								})
							} else if (now > age) {

								let selecttask =
									'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
									"'" + it.taskdetail_id + "'";
								selectSQL('local', selecttask, res => {

									if (Number(res[0].rhascheck) < Number(res[0].rtotlecheck)) {
										it.rstatus = 5
										let sql1 = 'update tb_task set status = 5' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
										executeSQL("local", sql1, res1 => {})

										let sql11 = 'update tb_task_detail set status = 5' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql11, res11 => {})
									} else if (res[0].rhascheck == res[0].rtotlecheck) {
										it.rstatus = 6
										let sql1 = 'update tb_task set status = 6' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
										executeSQL("local", sql1, res1 => {})

										let sql11 = 'update tb_task_detail set status = 6' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql11, res11 => {})
										
										let sqltoperson = 'update tb_task_detail set toperson = 1' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id +
											"'";
										executeSQL("local", sqltoperson, restoperson => {})
										
									}
									it.rhascheck = res[0].rhascheck;
									it.rtotlecheck = res[0].rtotlecheck;
									var num = it.rhascheck / it.rtotlecheck;
									num = (num * 100).toFixed(2)
									it.rpercent = num;
								})
							}
						}
                       }else if(it.utype == 3){
						   if(it.xfunction_id == 2){
							 if (it.rstatus != "1" && it.rstatus != "7" && it.rstatus != "8" && it.rstatus != "9") {
							 	var now = new Date().getTime();
							 	var age = 86399999 + Number(it.rend_time);
							 	//被比较的开始时间必须大于等于既定的开始时间,结束时间必须小于等于既定的结束时间
							 	if (now < age) {
							 		let selecttask =
							 			'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
							 			"'" + it.taskdetail_id + "'";
							 		selectSQL('local', selecttask, res => {
							 
							 			if (Number(res[0].rhascheck) == 0) {
							 				it.rstatus = 2
							 				let sql1 = 'update tb_task set status = 2' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
							 				executeSQL("local", sql1, res1 => {})
							 
							 				let sql11 = 'update tb_task_detail set status = 2' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							 				executeSQL("local", sql11, res11 => {})
							 
							 			} else if (Number(res[0].rhascheck) > 0 && Number(res[0].rhascheck) < Number(res[0].rtotlecheck)) {
							 				it.rstatus = 3
							 				let sql1 = 'update tb_task set status = 3' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
							 				executeSQL("local", sql1, res1 => {})
							 
							 
							 				let sql11 = 'update tb_task_detail set status = 3' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							 				executeSQL("local", sql11, res11 => {})
							 
							 			} else if (res[0].rhascheck == res[0].rtotlecheck) {
							 				it.rstatus = 4
							 				let sql1 = 'update tb_task set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
							 				executeSQL("local", sql1, res1 => {})
							 
							 				let sql11 = 'update tb_task_detail set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							 				executeSQL("local", sql11, res11 => {})
							 
							 			}
							 			it.rhascheck = res[0].rhascheck;
							 			it.rtotlecheck = res[0].rtotlecheck;
							 			var num = it.rhascheck / it.rtotlecheck;
							 			num = (num * 100).toFixed(2)
							 			it.rpercent = num;
							 		})
							 	} else if (now > age) {
							 
							 		let selecttask =
							 			'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
							 			"'" + it.taskdetail_id + "'";
							 		selectSQL('local', selecttask, res => {
							 
							 			if (Number(res[0].rhascheck) < Number(res[0].rtotlecheck)) {
							 				it.rstatus = 5
							 				let sql1 = 'update tb_task set status = 5' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
							 				executeSQL("local", sql1, res1 => {})
							 
							 				let sql11 = 'update tb_task_detail set status = 5' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							 				executeSQL("local", sql11, res11 => {})
							 			} else if (res[0].rhascheck == res[0].rtotlecheck) {
							 				it.rstatus = 6
							 				let sql1 = 'update tb_task set status = 6' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where task_id = ' + "'" + it.utask_id + "'";
							 				executeSQL("local", sql1, res1 => {})
							 
							 				let sql11 = 'update tb_task_detail set status = 6' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							 					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							 				executeSQL("local", sql11, res11 => {})
							 			}
							 			it.rhascheck = res[0].rhascheck;
							 			it.rtotlecheck = res[0].rtotlecheck;
							 			var num = it.rhascheck / it.rtotlecheck;
							 			num = (num * 100).toFixed(2)
							 			it.rpercent = num;
							 		})
							 	}
							 }  
   
						   }else if(it.xfunction_id == 3){
							   if (it.ustatus != "1" && it.ustatus != "7" && it.ustatus != "8" && it.ustatus != "9") {
							   	var now = new Date().getTime();
							   	var age = 86399999 + Number(it.rend_time)
							   	if (now < age) {
							   		let selecttask =
							   			'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
							   			"'" + it.taskdetail_id + "'";
							   		selectSQL('local', selecttask, res => {
							   
							   			if (Number(res[0].uhascheck) == 0) {
							   				it.ustatus = 2
							   				let sql1 = 'update tb_task_detail set status = 2' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							   					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							   				executeSQL("local", sql1, res1 => {})
							   			} else if (Number(res[0].uhascheck) > 0 && Number(res[0].uhascheck) < Number(res[0].utotlecheck)) {
							   				it.ustatus = 3
							   				let sql1 = 'update tb_task_detail set status = 3' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							   					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							   				executeSQL("local", sql1, res1 => {})
							   			} else if (res[0].uhascheck == res[0].utotlecheck) {
							   				it.ustatus = 4
							   				let sql1 = 'update tb_task_detail set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							   					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							   				executeSQL("local", sql1, res1 => {})
							   			}
							   			it.uhascheck = res[0].uhascheck;
							   			it.utotlecheck = res[0].utotlecheck;
							   			var num = it.uhascheck / it.utotlecheck;
							   			num = (num * 100).toFixed(2)
							   			it.upercent = num;
							   		})
							   
							   	} else if (now > age) {
							   		let selecttask =
							   			'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
							   			"'" + it.taskdetail_id + "'";
							   		selectSQL('local', selecttask, res => {
							   			if (Number(res[0].uhascheck) < Number(res[0].utotlecheck)) {
							   				it.ustatus = 5
							   				let sql1 = 'update tb_task_detail set status = 5' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							   					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							   				executeSQL("local", sql1, res1 => {})
							   			} else if (res[0].uhascheck == res[0].utotlecheck) {
							   				it.ustatus = 6
							   				let sql1 = 'update tb_task_detail set status = 6' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
							   					"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
							   				executeSQL("local", sql1, res1 => {})
							   			}
							   			it.uhascheck = res[0].uhascheck;
							   			it.utotlecheck = res[0].utotlecheck;
							   			var num = it.uhascheck / it.utotlecheck;
							   			num = (num * 100).toFixed(2)
							   			it.upercent = num;
							   		})
							   
							   	}
							   
							   }  
							   
						   }
					   }

					} else{
						if (it.ustatus != "1" && it.ustatus != "7" && it.ustatus != "8" && it.ustatus != "9") {
							var now = new Date().getTime();
							var age = 86399999 + Number(it.rend_time)
							if (now < age) {
								let selecttask =
									'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
									"'" + it.taskdetail_id + "'";
								selectSQL('local', selecttask, res => {

									if (Number(res[0].uhascheck) == 0) {
										it.ustatus = 2
										let sql1 = 'update tb_task_detail set status = 2' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql1, res1 => {})
									} else if (Number(res[0].uhascheck) > 0 && Number(res[0].uhascheck) < Number(res[0].utotlecheck)) {
										it.ustatus = 3
										let sql1 = 'update tb_task_detail set status = 3' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql1, res1 => {})
									} else if (res[0].uhascheck == res[0].utotlecheck) {
										it.ustatus = 4
										let sql1 = 'update tb_task_detail set status = 4' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql1, res1 => {})
									}
									it.uhascheck = res[0].uhascheck;
									it.utotlecheck = res[0].utotlecheck;
									var num = it.uhascheck / it.utotlecheck;
									num = (num * 100).toFixed(2)
									it.upercent = num;
								})

							} else if (now > age) {
								let selecttask =
									'select u.taskdetail_id,u.task_id as utask_id,u.type as utype,u.toperson as utoperson,u.totlequestion as utotlequestion,u.totlecheck as utotlecheck,u.hascheck as uhascheck,u.created_time as ucreated_time,u.group_id as ugroup_id,u.user_id as uuser_id,u.status as ustatus,r.task_id as rtask_id,r.task_name as rtask_name,r.unit_id as runit_id,r.site_id as rsite_id,r.star_time as rstar_time,r.end_time as rend_time,r.location as rlocation,r.frequency as rfrequency,r.created_time as rcreated_time,r.totlecheck as rtotlecheck,r.type as rtype,r.totolequestion as rtotolequestion,r.user_id as ruser_id,r.hascheck as rhascheck,r.status as rstatus from tb_task_detail u left join tb_task r on u.task_id=r.task_id where u.taskdetail_id = ' +
									"'" + it.taskdetail_id + "'";
								selectSQL('local', selecttask, res => {
									if (Number(res[0].uhascheck) < Number(res[0].utotlecheck)) {
										it.ustatus = 5
										let sql1 = 'update tb_task_detail set status = 5' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql1, res1 => {})
									} else if (res[0].uhascheck == res[0].utotlecheck) {
										it.ustatus = 6
										let sql1 = 'update tb_task_detail set status = 6' + "," + ' direty = 1 ' + "," + ' updatetime = ' +
											"'" + new Date().getTime() + "'" + ' where taskdetail_id = ' + "'" + it.taskdetail_id + "'";
										executeSQL("local", sql1, res1 => {})
									}
									it.uhascheck = res[0].uhascheck;
									it.utotlecheck = res[0].utotlecheck;
									var num = it.uhascheck / it.utotlecheck;
									num = (num * 100).toFixed(2)
									it.upercent = num;
								})

							}

						}

					}
}
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	/deep/.u-content {
		border-radius: 10rpx 0 0 10rpx !important;
	}

	/deep/.u-item-bg {
		height: 100%;
		border-radius: 0;
		bottom: 0;
	}


	/deep/.u-subsection {
		padding: 0 10rpx !important;
		border-radius: 0 !important;
	}

	.wrap {
		position: relative;
	}

	.contentModel {
		padding: 30rpx;

		.succcess {
			font-size: 30rpx;
		}

		.explain {
			line-height: 50rpx;
			color: #999999;
			font-size: 28rpx;
		}
	}



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
			z-index: 99;
		}

		.content {
			padding: 30rpx;

			.title {
				color: #333333;
				font-size: 30rpx;
				margin-bottom: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					width: 60%;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;

				}

				.right {
					width: 40%;
				}
			}

			.collapsePart {
				margin-bottom: 60rpx;
				border: 2rpx solid #f6f6f6;

				.u-collapse-head {
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #333333;
					font-size: 28rpx;
					line-height: 1;
					padding: 10rpx 6rpx;
					text-align: left;
					border-bottom: 2rpx solid #f6f6f6;

					.action {
						display: flex;
						justify-content: space-between;
						margin-left: 20rpx;
						width: 50%;

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
					.badge-msg1 {
						color: #999999;
						padding-left: 10rpx;
					}

					.count {
						color: #999999;
						padding-left: 10rpx;
					}
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

				}

				.u-collapse-content {
					overflow: hidden;
					font-size: 26rpx;
					color: #666;
					text-align: left;
					padding: 10rpx 6rpx;

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

			.form {
				width: 100%;

				.border {
					border-bottom: 2rpx solid #f6f6f6;
				}

				.form-part {
					margin: 20rpx 0;
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					padding: 20rpx 0;


					.form-title {
						color: #333333;
						font-size: 30rpx;
						margin-right: 20rpx;
					}

					.form-right {
						width: 100%;
						flex: 1;

						.time {

							color: #606266;
							font-size: 28rpx;
							display: flex;
							justify-content: flex-end;

							.gray {
								color: #999999;
							}

							view {
								margin-right: 10rpx;

								text {
									margin: 0 10rpx;
								}
							}
						}

					}


				}
			}


		}

		.roleAction {
			position: fixed;
			bottom: 0;
			height: 100rpx;
			line-height: 100rpx;
			display: flex;
			justify-content: space-around;
			font-size: 32rpx;
			width: 100%;
			background: #FFFFFF;
			border-top: 2rpx solid #f6f6f6;
			align-items: center;

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



	.checktask {
		.checktask-top {
			padding: 10rpx 30rpx;
			background: #F8F8F8;

			.action {
				background-image: linear-gradient(to bottom right, #28b09c, #62ca99);
				border-radius: 10rpx;
				padding: 10rpx 30rpx;
				height: 60rpx;
				line-height: 60rpx;
				border: 2rpx solid #FFFFFF;
				display: flex;
				align-items: center;

				image {
					width: 50rpx;
					height: 50rpx;
				}

				.new {
					color: #FFFFFF;
					font-size: 30rpx;
					margin-left: 10rpx;
				}
			}
		}

		.task-state {
			padding: 0 30rpx;
		}


		.checktask-content {
			padding: 20rpx 30rpx 0 30rpx;
			position: relative;

			.swipe {
				margin-bottom: 20rpx;
			}

			.part {

				background: #FFFFFF;
				width: 100%;
				position: relative;

				.top-part {
					padding: 20rpx 20rpx 0 20rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 10rpx 0;

					.left {
						width: 80%;

						.name {
							color: #333333;
							font-size: 32rpx;
							margin-bottom: 10rpx;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							position: relative;

							.nametitle {

								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								padding-right: 10rpx;

							}

							.nameicon {
								width: 100rpx;
								height: 60rpx;
								position: relative;

								.badge-msg {
									right: auto !important;
									top: 0 !important;
									position: absolute;
								}
							}

						}


						.detail {
							display: flex;
							margin-bottom: 0 20rpx 20rpx 20rpx;
							line-height: 50rpx;
							align-items: center;

							.title {
								font-size: 30rpx;
								color: #333333;

							}

							.sizemore {
								width: 100%;
								flex: 1;
							}

							.size {
								color: #606266;
								font-size: 28rpx;
								width: 100%;
								flex: 1;
								display: flex;
								flex-wrap: wrap;
								align-content: stretch;

								.sizename {
									display: block;
									font-size: 28rpx;
									padding-right: 10rpx;

									.noself {
										color: #999999;	
									}
									.self{
										color: #333333 !important;
									}
								}

								.wrap {
									display: flex;
									flex-wrap: wrap;
									align-content: stretch;

									.noself {
										color: #999999;
										
									}
									.self{
										color: #333333 !important;
										
									}
								}
							}

							.time {
								color: #999999;
								font-size: 28rpx;

								text {
									color: #606266;
									margin: 0 10rpx;
								}
							}
						}
					}

					.right {
						width: 100rpx;
						text-align: center;

						.namerefuse {
							position: absolute;
							top: 30rpx;

							.nameicon {
								display: flex;
								align-items: center;

								.refuse {
									color: #fa3534;
									font-size: 28rpx;
									padding-left: 6rpx;
								}
							}
						}
						
						.name {
							width: 100%;
							flex: 1;
							font-size: 30rpx;
							color: #333333;
							overflow: hidden;
							display: -webkit-box;
							text-overflow: ellipsis;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							line-height: 50rpx;
						}

						.detail {
							width: 100%;
							display: flex;
							justify-content: space-between;
							line-height: 50rpx;

							.size {
								font-size: 28rpx;
								color: #606266;


							}

							.time {
								font-size: 24rpx;
								color: #999999;
							}
						}
					}
				}

				.action-part {
					display: flex;
					font-size: 28rpx;
					border-top: 2rpx solid #f6f6f6;
					padding-top: 30rpx;
					justify-content: space-between;
					align-items: center;
					padding: 20rpx;

					.left {
						width: 60%;

						.company-part {
							display: flex;

							image {
								width: 50rpx;
								height: 50rpx;
								margin-right: 20rpx;
							}

							.company {
								font-size: 30rpx;
								color: #333333;

								.childCompany {
									color: #999999;
									margin-left: 10rpx;
									font-size: 28rpx;
								}

							}
						}

						.prograss {
							margin: 20rpx 0;
							display: flex;
							align-items: center;

							text {
								font-size: 24rpx;
								color: #999999;
								margin-left: 6rpx;
							}

							.rate {
								color: #19be6b;
							}
						}
					}

					.right {
						.state {
							text-align: center;
							border-radius: 60rpx;
							color: #FFFFFF;
							padding: 10rpx 20rpx;
							font-size: 28rpx;
						}

						.red {

							background: #FA3534;
						}

						.yellow {

							background: #ff9900;
						}

						.blue {

							background: #2979FF;
						}

						.gray {

							background: #ECECEC;
						}

						.green {

							background: #18b566;
						}
					}


				}

			}
		}

		.bottom {

			position: fixed;
			width: 100%;
			background: #FFFFFF;
			height: 100rpx;
			line-height: 100rpx;
			box-shadow: 0 -6rpx 10rpx rgba(0, 0, 0, 0.15);
			bottom: 0;
			z-index: 99;

			.check-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx;

				.left {
					display: flex;
					color: #2979ff;
					font-size: 32rpx;

				}

				.right {
					display: flex;
					justify-content: flex-end;

					.batch {

						background: #19be6b;
						color: #FFFFFF;
						border-radius: 40rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						margin-right: 20rpx;
						padding: 0 20rpx;
						box-shadow: 0 6rpx 6rpx #71d5a1;

					}

					.stop {
						background: #ff9900;
						margin: 20rpx 0;
					}

					.del {
						background: #fa3534;
						box-shadow: 0 6rpx 6rpx #fab6b6;
					}
				}
			}

		}
		.noself {
			color: #999999 !important;
		}
		.self{
			color: #333333 !important;
		}

		.model {
			padding: 30rpx;

			.rename {
				margin: 20rpx 0;
			}

			.stop {
				font-size: #333333;
				line-height: 50rpx;
				font-size: 32rpx;
				margin: 20rpx 0;
			}

			.tips {
				font-size: 28rpx;
				color: #999999;
			}
		}


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
				z-index: 99;
			}

			.content {
				padding: 30rpx;
			}

			.choose {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				margin: 40rpx 0 20rpx;

				.title {
					color: #333333;
					font-size: 30rpx;
					margin-right: 10rpx;
				}

				.input_part {
					margin-right: 10rpx;
					width: 100%;
					flex: 1;
				}

				.add {
					width: 100rpx;
					padding: 0 10rpx;
					height: 70rpx;
					line-height: 70rpx;
					font-size: 30rpx;
					border: 2rpx solid #dcdfe6;
					border-radius: 10rpx;
					color: #4abdb4;
					text-align: center;
				}
			}

			.hasChoosed {
				border: 2rpx solid #f6f6f6;
				padding: 20rpx;
				margin: 20rpx 0;
				border-radius: 20rpx;
				width: 100%;

				.has {
					display: inline-flex;
					justify-content: space-between;
					align-items: center;
					text-align: center;
					background: #F8F8F8;
					width: 25%;
					padding: 10rpx;
					border-radius: 10rpx;
					margin: 10rpx;
					

					.name {

						font-size: 28rpx;
					}

					.icon {
						margin-left: 10rpx;
					}
				}
			}

			.range {
				margin: 20rpx 0;

				.title {
					font-size: 32rpx;
					color: #333333;
					text-align: center;
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
				}

				.part {
					display: flex;
					justify-content: space-between;

					.left {
						border: 2rpx solid #f6f6f6;
						width: 50%;

						.top {
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 30rpx;
							color: #333333;
							padding: 10rpx 20rpx;
						}

						.list {
							padding: 10rpx 20rpx;

							/deep/.u-checkbox {
								border-bottom: 2rpx solid #f6f6f6;
							}

							.job {
								color: #007AFF;
								margin-right: 10rpx;

							}

							text {
								font-size: 28rpx;
								color: #606266;

							}
						}
					}

					.right {
						width: 40%;
						border: 2rpx solid #f6f6f6;

						.top {
							font-size: 30rpx;
							color: #4abdb4;
							padding: 10rpx 20rpx;
						}

						.list {
							padding: 10rpx 20rpx;

							.has {
								display: flex;
								background: #f6f6f6;
								padding: 10rpx;
								justify-content: space-between;
								align-items: center;
								border-radius: 10rpx;
								margin-top: 10rpx;

								.name {
									font-size: 28rpx;
								}

								.icon {
									margin: 0 10rpx;
								}
							}
						}
					}
				}
			}

			.roleAction {
				position: fixed;
				bottom: 0;
				height: 100rpx;
				line-height: 100rpx;
				display: flex;
				justify-content: space-around;
				font-size: 32rpx;
				width: 100%;
				background: #FFFFFF;

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
	}
</style>
