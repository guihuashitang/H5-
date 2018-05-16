// pages/myBuy/myBuy.js
import { pkService } from '../../service/pk.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '学前'],
    bookInfo: [],
    totalCount: 0,
    pageLoad: false,
    
  },


  //我的购买
  GetMyPay: function () {
    let that = this;
    pkService.GetMyPay().then(function (res) {
      if (res.success) {
        // if (res.totalCount == bookInfo.length) {
        //   console.log(res.totalCount == pkInfo.length)
        //   that.setData({ pageMore: true, pageLoading: false })
        //   return
        // }
        console.log(res)
        let { bookInfo, totalCount } = that.data;
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          //解析时间2018-04-12 17:17:55
          data[i].createtime = data[i].createtime.substring(5, 10);//04-12
          data[i].createtime = data[i].createtime.replace("-", "月");//04月12
          data[i].createtime = data[i].createtime + "日";//04月12日
          //取内容第一句
          // data[i].poetry_bref = data[i].poetry_content.split("。")[0] + '。'
        }
        bookInfo = data;
        // totalCount = res.totalCount;
        that.setData({ bookInfo, pageLoad: true })


      }

    })
  },

  toSearchPaper: function(e){
    let that = this;
    let { bookid, grade } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/poetryList/poetryList?book_id=${bookid}&grade=${grade}`,
    })
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    that.GetMyPay()
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