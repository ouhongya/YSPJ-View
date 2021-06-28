import helper from '@/common/helper.js'
import {
	saveExamXLSA
}  from  '@/api/exam/examDowload.js';

/**
 * 查询题库列表
 * @param {Object} page
 * @param {Object} size
 * @param {Object} ids
 */
export function queryQuestionBankList(page, size, ids) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/queryQuestionBankList`, {
			page: page,
			size: size,
			ids: ids,
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}

/**
 * 查询题库列表不分页
 */
export function queryQuestionBankListNotLimit() {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/queryQuestionBankListNotLimit`, {
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}

/**
 * 添加题库
 * @param {Object} name
 */
export function addQuestionBank(name) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/addQuestionBank`, {
			name: name,
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 删除题库
 * @param {Object} id
 */
export function deleteQuestionBank(id) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/deleteQuestionBank`, {
			id: id,
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}

/**
 * 停用/启用题库
 * @param {Object} id
 * @param {Object} status
 */
export function statusQuestionBank(id, status) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/statusQuestionBank`, {
			id: id,
			status: status,
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}
/**
 * 添加试题
 * @param {Object} topic
 * @param {Object} topicByAnswer
 */
export function addOneTopic(topic, topicByAnswer) {
	return new Promise(resolve => {
		let param = {
			topic: JSON.stringify(topic),
			topicByAnswer: JSON.stringify(topicByAnswer),
			companyId: uni.getStorageSync("company_id")
		}
		helper.requestUrl(helper.websiteUrl + `v1/addOneTopic`, param, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 编辑试题
 * @param {Object} stem
 * @param {Object} answer
 */
export function editOneTopic(stem, answer) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/editOneTopic`, {
			stem: JSON.stringify(stem),
			answer: JSON.stringify(answer),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 查询试题
 * @param {Object} id
 * @param {Object} status
 */
export function queryOneTopic(id, status) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/queryOneTopic`, {
			id: id,
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 查询题库详情
 * @param {Object} id
 */
export function queryBankDetail(id) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/queryBankDetail`, {
			id: id,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 题库Excel停用/启用/删除
 * @param {Object} categoryId
 * @param {Object} bankId
 * @param {Object} status
 */
export function updateExcelStatus(categoryId, bankId, status) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/updateExcelStatus`, {
			status: status,
			categoryId: categoryId,
			bankId: bankId,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 题库重命名
 * @param {Object} id
 * @param {Object} name
 */
export function remarkQuestionBank(id, name) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/remarkQuestionBank`, {
			id: id,
			name: name,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 单题停用/启用/删除
 * @param {Object} id
 */
export function updateOneTopicStatus(id) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/updateOneTopicStatus`, {
			id: id,
			status: 1,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}
/**
 * 获取用户名以及考号
 */
export function queryUserByNameAndStuId() {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/queryUserByNameAndStuId`, {
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 发布考试
 * @param {Object} params
 */
export function releaseExam(params) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/releaseExam`, {
			params: [JSON.stringify(params)],
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 考生范围
 * @param {Object} id
 */
export function examineRange() {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/examineRange`, {
			uid: uni.getStorageSync("USER_ID"),
			compayId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 查询考试列表
 * @param {Object} page
 * @param {Object} size
 */
export function queryExamList(page, size) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/queryExamList`, {
			page: page,
			size: size,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}

/**
 * 查询我发起的考试列表
 * @param {Object} page
 * @param {Object} size
 * @param {Object} sarch
 */
export function queryExamListRoleLaunch(page, size, sarch) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/queryExamListRoleLaunch`, {
			page: page,
			size: size,
			search: sarch,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}

/**
 * 删除考试
 * @param {Object} id
 */
export function deleteExam(id) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/deleteExam`, {
			id: id,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}

/**
 * 停用/启用考试
 * @param {Object} id
 * @param {Object} status
 */
export function examStopToEnable(id, status) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/examStopToEnable`, {
			id: id,
			status: status,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 拉去考试详情
 * @param {Object} id
 */
export function startExam(id) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/startExam`, {
			id: id,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'GET', res => {
			resolve(res)
		})
	})
}

/**
 * 开始考试
 * @param {Object} exam_user_id
 * @param {Object} examTimeNew
 * @param {Object} pauseTime
 */
export function startUserExam(exam_user_id, examTimeNew, pauseTime) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/startUserExam`, {
			exam_user_id: exam_user_id,
			examTimeNew: examTimeNew,
			pauseTime: pauseTime,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}
/**
 * 继续考试
 * @param {Object} exam_user_id
 * @param {Object} examTimeNew
 * @param {Object} pauseTime
 */
export function continueExamination(exam_user_id, examTimeNew, pauseTime) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/continueExamination`, {
			exam_user_id: exam_user_id,
			examTimeNew: examTimeNew,
			pauseTime: pauseTime,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}


/**
 * 开始答题
 * @param {Object} exam_id
 * @param {Object} exam_user_topic_id
 * @param {Object} userAnswer
 * @param {Object} right
 */
export function startUserAnswer(exam_id, exam_user_topic_id, userAnswer, right) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/startUserAnswer`, {
			exam_id: exam_id,
			exam_user_topic_id: exam_user_topic_id,
			userAnswer: userAnswer,
			right: right,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 提交试卷
 * @param {Object} exam_id
 * @param {Object} exam_user_id
 */
export function submitTestPaper(exam_id, exam_user_id, type) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/submitTestPaper`, {
			exam_id: exam_id,
			exam_user_id: exam_user_id,
			type: type,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}
/**
 * 获取考试结果
 * @param {Object} exam_id
 * @param {Object} exam_user_id
 */
export function answers(exam_id, exam_user_id) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/answers`, {
			exam_id: exam_id,
			exam_user_id: exam_user_id,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 查看错题
 * @param {Object} examId
 */
export function wrongQuestions(examId, uid) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/wrongQuestions`, {
			id: examId,
			ids: uid,
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 查看历史成绩
 * @param {Object} examId
 */
export function historicalAchievements(examId, uid) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/historicalAchievements`, {
			id: examId,
			ids: uid,
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 再次答题
 * @param {Object} examId
 */
export function questionAgain(examId, examUserId) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/questionAgain`, {
			examId: examId,
			examUserId: examUserId,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 考试练习
 * @param {Object} category_id
 * @param {Object} type
 * @param {Object} count
 */
export function examPractice(category_id, type, count) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/examPractice`, {
			category_id: category_id,
			type: type,
			count: count,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}
/**
 * 考试详情头
 * @param {Object} examId
 */
export function examDetail(examId) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/examDetail`, {
			examId: examId,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 考试详情体
 * @param {Object} page
 * @param {Object} size
 * @param {Object} search
 * @param {Object} examId
 */
export function examDetailBody(page, size, search, examId) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/examDetailBody`, {
			page: page,
			size: size,
			search: search,
			examId: examId,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 查看试卷
 * @param {Object} examId
 */
export function viewPaper(examId) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/viewPaper`, {
			exam_id: examId,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			resolve(res)
		})
	})
}

/**
 * 下载成绩
 * @param {Object} examId
 */
export function exportResults(examId) {
	return new Promise(resolve => {
		helper.requestUrl(helper.websiteUrl + `v1/exportResults`, {
			exam_id: examId,
			uid: uni.getStorageSync("USER_ID"),
			companyId: uni.getStorageSync("company_id")
		}, 'POST', res => {
			let url = helper.addBaseUrl(helper.baseIp + res.url);
			 saveExamXLSA(url,res.fileName).then(result=>{
				resolve(result)
			})
		})
	})
}
