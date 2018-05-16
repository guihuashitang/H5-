// pages/rankingList/rankingList.js
var app = getApp()
import { pkService } from '../../service/pk.js';
import { commonService } from '../../service/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [],
    translateX: 110,
    ranking: 0,
    pageLoad: false
  },

//排行榜
  GetRankingList: function(){
    let that = this;
    let top = '999'
    pkService.GetRankingList(top).then(function(res){
      console.log('排行榜',res.data);
      that.setData({ rankList: res.data.ranking_list, ranking: res.data.ranking, pageLoad: true })
      setTimeout(function(){
        that.setData({ translateX: 0 })
      },50)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	let that = this;
  	if(options.share){//分享给新用户分享者得钥匙 
    	let preUid=options.preUid;
    	if (app.globalData.weixinUser) {
	      commonService.addKeyNumberWithShare(preUid);
	    } else {
	      app.uidCallback1 = () => {
	        commonService.addKeyNumberWithShare(preUid);
	      }
	    }    	
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.GetRankingList();
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var title = '';
    var pageImg = '';
    var path = `/pages/rankingList/rankingList`;
    return app.onShareAppMessage(title, pageImg, path);
  }
})