const loginCommonUrl="https://loginservice.codebook.com.cn/Common/Login/WXLogin"//公共登录
// const loginCommonUrl = "http://114.215.110.243:11111/Common/Login/WXLogin"//公共登录(测试)
//const service = "http://114.215.110.243:10007/" 
const service = "https://chinapoetrywebapi.codebook.com.cn/"
let token=wx.getStorageSync('token')
const commonService={
	weixinUser(){
	    return wx.getStorageSync('weixinUser');
	},
	//获取支付信息
	getPayInfo(book_id){
		let uid=this.weixinUser().uid;
		return this.get(service+'Education/Poetry/GetPayInfo',{uid:uid,book_id:book_id})
	},
	//消耗钥匙
	updateKeyNumber(){
		let uid=this.weixinUser().uid;
		return this.post(service+'Education/Poetry/UpdateKeyNumber',{uid:uid})
	},
	//分享增加钥匙
	addKeyNumberWithShare(share_uid){
		let uid=this.weixinUser().uid;
		return this.post(service+'Education/Poetry/AddKeyNumberWithShare',{share_uid:share_uid,partake_uid:uid})
	},
	//添加收藏
	addCollect(poetry_id){
		let uid=this.weixinUser().uid;
		return this.post(service+'Education/Poetry/AddCollect',{poetry_id:poetry_id,uid:uid})
	},
	//删除收藏
	deleteCollect(poetry_id){
		let uid=this.weixinUser().uid;
		return this.post(service+'Education/Poetry/DeleteCollect',{poetry_id:poetry_id,uid:uid})
	},
	//收藏列表
	getCollect(pageIndex,pageSize){
		let uid=this.weixinUser().uid;
		return this.get(service+'Education/Poetry/GetCollect',{pageSize:pageSize,pageIndex:pageIndex,uid:uid})
	},
  //PK记录列表
  GetRecordWithPK(pageIndex,pageSize){
    let uid = this.weixinUser().uid;
    return this.get(service + 'Education/Poetry/GetRecordWithPK', { pageSize: pageSize, pageIndex: pageIndex, uid: uid })
  },
  //PK记录详情
  GetRecordInfoWithPK(question_guid) {
    return this.get(service + 'Education/Poetry/GetRecordInfoWithPK', { question_guid: question_guid})
  },
  //我的信息
  GetUserInfo(){
    let uid = this.weixinUser().uid;
    return this.get(service + 'Education/Poetry/GetUserInfo', { uid: uid })
  },
  //分享增加学分
  ShareWithPK(encryptedData,iv) {
    let uid = this.weixinUser().uid;
    return this.post(service + 'Education/Poetry/ShareWithPK', { share_uid: uid, encryptedData: encryptedData,iv:iv })
  },
	//支付
	fastBuy(book_id,adviser_id) {  
		let uid=this.weixinUser().uid;
		var params = new Object();
  		params={
  			uid:uid,
  			book_id:book_id,
  			adviser_id:adviser_id,
  			shouFullname:'',
  			shouMobile:'',
  			shouAddress:'',
  			remarks:''
  		}
		return new Promise((resolve, reject) =>{
			this.post(service+'Education/Poetry/FastBuy',params).then(function(res){
		  		console.log("支付")
		  		console.log(res)
		  		if (res.success) {
	  				wx.requestPayment
		              ({
		                'timeStamp': res.data.timeStamp,
		                'nonceStr': res.data.nonceStr,
		                'package': res.data.package,
		                'signType': res.data.signType,
		                'paySign': res.data.paySign,
		                'success': function (res_success) {
		                  resolve(res_success);
		                },
		                'fail': function (res_fail) {
		                  //支付失败
		                  reject(res_fail);
		                  // that.setData({ goTap: false });                  
		                }
		            });	            
		          } else {
		            wx.showToast
		              ({
		                title: res.message,
		                icon: 'success',
		                duration: 2000,
		              })
		          }
		  	})
		})
	},
	get(service, data){
		if(!token){
			token=wx.getStorageSync('token')
		}
		return new Promise((resolve, reject) => {
			wx.request({
		    url: service,
		    data: data,
		    header: { 
		    	'content-type': 'application/x-www-form-urlencoded',
		    	'token':token,
		    },
		    success: function (res) {
		      if(res.data.success){
		        resolve(res.data);
		      }
		      else{
		        wx.showToast({
		          title: res.data.mgs,
		        })
		      }
		    },
		    fail:function(err){
		    	reject(err);
		    }
		  })
		})
	},
	post(service, data){  
		if(!token){
			token=wx.getStorageSync('token')
		}
	  	return new Promise((resolve, reject) => {
		    data = JSON.stringify(data);
		    wx.request({
			    url: service,
			    method: 'POST',
			    data: data,
			    header: {
			      'content-type': 'application/json',
			      'token':token,
			    },
			    success: function (res) {
			    	// console.log("en1",res)
			      if (res.data.success) {
			      	resolve(res.data);
			      }else {
			        wx.showToast({
			          title: res.data.mgs,
			        })
			      }
			    },
			    fail:function(err){
			    	console.log("en2")
			    	reject(err);
			    }
			})
		})
	}
}
	module.exports = {
		loginCommonUrl:loginCommonUrl,
		service:service,
	  	get:commonService.get,
	  	post:commonService.post,
	  	commonService:commonService
	}
