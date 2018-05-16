// pages/myPkDetail/myPkDetail.js
import { commonService } from '../../service/common.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pkDetail: [],
    clearing: '',
    clearing_list: [],
    pageLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let that = this;
  console.log(options.id)
  //PK记录详情
  commonService.GetRecordInfoWithPK(options.id).then(function(res){
    if(res.success){
      console.log('PK记录详情',res.data);
      that.setData({ clearing: res.data.clearing, clearing_list: res.data.clearing_list, pageLoad: true })
      
    }
  })
  },

  again:function(){
    let that = this;
    wx.reLaunch({
      url: `/pages/pk/pk`,
    })
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