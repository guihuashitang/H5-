//app.js
import { get, post, service, loginCommonUrl } from 'service/common.js'
import { userService } from 'service/user.js';
App({
  globalData: {
    weixinUser: null,
  },
  onLaunch: function () {
    let that = this;
    var weixinUser = wx.getStorageSync('weixinUser');
    var token = wx.getStorageSync('token');
    if (weixinUser) {
      that.globalData.weixinUser = weixinUser
      that.globalData.token = token
    } else {
      userService.login().then(function (dataObj) {
        console.log("登录")
        let { res, userinfo_res } = dataObj
        console.log(res)
        var data = {
          code: res.code,
          userinfo: userinfo_res.userInfo,
          appcode: 'POETRY',
          encryptedData: userinfo_res.encryptedData,
          iv: userinfo_res.iv
        };
        post(loginCommonUrl, data).then(function (res) {
          console.log("deng", res)
          if (res.success) {
            wx.setStorageSync('weixinUser', res.data.userInfo);
            wx.setStorageSync('token', res.data.token);
            that.globalData.weixinUser = res.data.userInfo
            userService.init().then(function () {
              if (that.uidCallback1) {//onload
                that.uidCallback1()
              }
              if (that.uidCallback2) {//onshow
                that.uidCallback2()
              }
            });

          } else {
            wx.showToast({
              title: '登录失败',
            })
          }
        })
      }, function () {
        wx.openSetting({
          success: (res) => {
            login(callback);
          }
        })
      })
    }

  },
  //分享的公共方法
  onShareAppMessage: function (pageTitle, pageImg, pagePath, cb) {
    //通用分享
    var that = this;
    if (pagePath.indexOf("?") > -1) {
      pagePath += "&share=true&preUid=" + that.globalData.weixinUser.uid;
    }
    else {
      pagePath += "?share=true&preUid=" + that.globalData.weixinUser.uid;
    }
    return {
      title: pageTitle,
      path: pagePath,
      imageUrl: pageImg,
      success: function (res) {
        if (cb) {
          cb(res);
        }
      },
      fail: function (res) {
        // 分享失败

      }
    }
  },
})
