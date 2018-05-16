import { get, post, service } from 'common.js'
const pkService = {
  weixinUser() {
    return wx.getStorageSync('weixinUser');
  },
  //pk题目
  GetQuestions_PK(level, question_type, pageIndex, pageSize){
    let uid = this.weixinUser().uid;
    return get(service + 'Education/Poetry/GetQuestions_PK', { uid: uid, level: level, question_type: question_type})
  },
  //pk结算
  Clearing(params) {
    return post(service + 'Education/Poetry/Clearing', params)
  },
  //排行榜
  GetRankingList(top){
    let uid = this.weixinUser().uid;
    return get(service + 'Education/Poetry/GetRankingList', { top: top,uid:uid })
  },
  //我的购买
  GetMyPay() {
    let uid = this.weixinUser().uid;
    // let uid = 539815;
    return get(service + 'Education/Poetry/GetMyPay', { uid: uid })
  },
  //PK记录列表
}


module.exports = {
  pkService: pkService
}