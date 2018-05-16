// pages/my/my.js
var app = getApp();
import { pkService } from '../../service/pk.js';
import { commonService } from '../../service/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelNow: 0,
    hat_img: [
      {
        current: 1,
        hatImg: '/images/hat1.png',
      },
      {
        current: 2,
        hatImg: '/images/hat2.png',
      }, {
        current: 3,
        hatImg: '/images/hat3.png',
      }, {
        current: 4,
        hatImg: '/images/hat4.png',
      }, {
        current: 5,
        hatImg: '/images/hat5.png',
      }, {
        current: 6,
        hatImg: '/images/hat6.png',
      }, {
        current: 7,
        hatImg: '/images/hat7.png',
      }, {
        current: 8,
        hatImg: '/images/hat8.png',
      },
    ],
    currentImg: 0,
    myGrade: 0,
    allGrade: 0,
    myInfo: [],
    pageLoad: false
  },

  toDetail: function (e) {
    let that = this;

    let title = e.currentTarget.dataset.title;
    if (title == 'buy') {
      console.log('我的购买');
      wx.navigateTo({
        url: `/pages/myBuy/myBuy`,
      })
    } else if (title == 'collection') {
      wx.navigateTo({
        url: `/pages/myCollection/myCollection`,
      })
      console.log('我的收藏')
    } else if (title == 'myPk') {
      wx.navigateTo({
        url: `/pages/myPk/myPk`,
      })
      console.log('我的pk')
    } else if (title == 'contact') {
      console.log('联系客服')
    } else {
      console.log('系统设置')
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
  },

  //我的信息
  GetUserInfo: function(){
    let that = this;
    let { levelNow,} = that.data;
    commonService.GetUserInfo().then(function(res){
      if(res.success){
        console.log('我的信息',res);
        if (res.data.rank_score.indexOf('/')!=-1){
          console.log(res.data.rank_score.indexOf('/'));
          res.data.rank_score = res.data.rank_score.split('/');
          that.setData({ myInfo: res.data, myGrade: res.data.rank_score[0], allGrade: res.data.rank_score[1], pageLoad: true })
          levelNow = that.data.myGrade / that.data.allGrade;
          levelNow = levelNow.toFixed(2) * 100;
        }else{
          that.setData({ myInfo: res.data, myGrade: res.data.rank_score, pageLoad: true })
        }

        if (that.data.myGrade<13000){
          setTimeout(function () {
            that.setData({ levelNow })
          }, 50)
      }else{
          setTimeout(function () {
            that.setData({ levelNow: 100 })
          }, 50)
      }

    if (that.data.myGrade<1){//头像上帽子
      that.setData({ currentImg: 0 })
    } else if (that.data.myGrade >= 1 && that.data.myGrade < 1500) {
      that.setData({ currentImg: 1 })
    }else if (that.data.myGrade>=1500&&that.data.myGrade < 3000){
      that.setData({ currentImg: 2 })
    } else if (that.data.myGrade >=3000&&that.data.myGrade < 4500) {
      that.setData({ currentImg: 3 })
    } else if (that.data.myGrade >=4500&&that.data.myGrade < 6500) {
      that.setData({ currentImg: 4 })
    } else if (that.data.myGrade >=6500&&that.data.myGrade < 8500) {
      that.setData({ currentImg: 5 })
    } else if (that.data.myGrade >=8500&&that.data.myGrade < 13000) {
      that.setData({ currentImg: 6 })
    } else {
      that.setData({ currentImg: 7 })
    }

      }

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
    let that = this;
    that.GetUserInfo()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let that = this;
    // that.setData({ levelNow: 0 })
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