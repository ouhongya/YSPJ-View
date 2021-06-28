// 登录模块
const baseIp = `http://39.107.143.125:8081`;
const loginUrl = `${baseIp}/api/v1/login`;//登录
const getSmsCaptcha = `${baseIp}/api/v1/getSmsCaptcha`;//获取验证码
export {
	loginUrl,
	getSmsCaptcha
};
