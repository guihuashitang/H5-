import { get, post,service} from 'common.js'
var app = getApp()
const userService = {
	weixinUser(){
	    return wx.getStorageSync('weixinUser');
	},
  login() {
    //用户登录
    return new Promise((resolve, reject) => {
			wx.login
		  ({
		    success: function (res) {
		      if (res.code) {
		        wx.getUserInfo({
		          withCredentials: true,
		          lang: 'zh_CN',
		          success: function (userinfo_res) {
		          	resolve({userinfo_res:userinfo_res,res:res})		            
		          },
		          fail: function () {
		          	reject();		            
		          }
		        })
		      }
		      else {
		        console.log('获取用户登录态失败！' + res.errMsg)
		      }
		    }
		  });
		})
  },
  init(){
  	let uid=this.weixinUser().uid;  		
		return get(service+'Education/Poetry/Init',{uid:uid})
  },
}

module.exports = {
  userService: userService
}