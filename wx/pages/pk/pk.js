// pages/pk/pk.js
var app = getApp()
import { commonService } from '../../service/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  toPK: function (e) {
    let that = this;
    let { index } = e.currentTarget.dataset;
    console.log(index)
    wx.navigateTo({
      url: `/pages/pkAnswer/pkAnswer?level=${index}`,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, pageImg, path);
  }
})