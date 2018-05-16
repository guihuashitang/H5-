// pages/myPk/myPk.js
import { commonService } from '../../service/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '学前'],
    pkInfo: [ ],
    totalCount: 0,
    pageLoad: false,
    pageMore: false,
    pageLoading: true,
    pageIndex: 1,
    pageSize: 12,
    isLoading: false
  },

  toPkDetail: function(e){
    let that = this;
    let { id } = e.currentTarget.dataset;
    console.log(id)
    wx.navigateTo({
      url: `/pages/myPkDetail/myPkDetail?id=${id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.GetRecordWithPK();
  },

    //PK记录列表
  GetRecordWithPK: function(){
    let that = this;
    let { pkInfo } = that.data;
    commonService.GetRecordWithPK(that.data.pageIndex, that.data.pageSize).then(function (res) {
      if (res.success) {
        that.setData({ pageLoad: true })
        if (res.totalCount == pkInfo.length){
          console.log(res.totalCount == pkInfo.length)
          that.setData({ pageMore: true, pageLoading: false })
          return
        }
        if (res.totalCount>=10){
          that.setData({ isLoading: true })
        }
        console.log('PK记录列表', res);
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          //解析时间2018-04-12 17:17:55
          data[i].create_time = data[i].create_time.substring(5, 10);//04-12
          data[i].create_time = data[i].create_time.replace("-", "月");//04月12
          data[i].create_time = data[i].create_time + "日";//04月12日
        }
        pkInfo = pkInfo.concat(data);
        that.setData({ pkInfo, totalCount: res.totalCount, totalPage: res.totalPage })
      }else{
        that.setData({ pageLoad: true })
      }
    })
  },

pkBottom: function(){
    let that = this;
    let { pageIndex } = that.data;
    pageIndex++;
    that.setData({ pageIndex })
    if (that.data.pageLoading && !that.data.pageMore){
      that.GetRecordWithPK();
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
  let that = this;
  that.pkBottom();
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