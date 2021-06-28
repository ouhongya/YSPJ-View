import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Date.prototype.toLocaleString = function() {
	// 补0   例如 2018/7/10 14:7:2  补完后为 2018/07/10 14:07:02
	function addZero(num) {
		if (num < 10)
			return "0" + num;
		return num;
	}
	// 按自定义拼接格式返回
	return this.getFullYear() + "" + addZero(this.getMonth() + 1) + "" + addZero(this.getDate())
};

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

App.mpType = 'app'
//ui组件
import uView from "uview-ui";
Vue.use(uView);
//头部
import Ahead from '@/components/Ahead/index.vue';
Vue.component("a-head", Ahead)
//页面加载动画
import rfLoading from '@/components/rf-loading/index.vue';
Vue.component('rfLoading', rfLoading);
//空状态
import Empty from '@/components/empty/index.vue';
Vue.component('a-empty', Empty);

//mescorll加载
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-uni', MescrollUni)
const app = new Vue({
	...App
})
app.$mount()
