// pages/poetryList.js
import { poetryListService } from '../../service/poetryList.js'
import { commonService } from '../../service/common.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  book_id:0,
  grade:'',
  poetryList:[],//诗词列表
  pageIndex:1,//分页加载
  totalCount:0,//诗词总数
  isLoadding:false,//是否正在加载
  isPayed:false,//是否购买过
  key_number:0,//钥匙数目
  showPay:false,//支付弹框
  isDouble:false,//双击
  translateX: 110,
  clickIndex:-1,//点击诗词列表为索引，点击开始练习为NaN
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	this.setData({book_id:options.book_id,grade:options.grade})
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
  	let that=this;
    let { book_id, poetryList, totalCount, pageIndex}=this.data;
    //初始化
    this.data.poetryList=[];
    this.data.totalCount=-1;
    this.data.pageIndex=1;
  	this.getPoetrys();
  	if (app.globalData.weixinUser) {
      that.getPayInfo();
    } else {
      app.uidCallback2 = () => {
        that.getPayInfo();
      }
    }
  	
  },
  getPoetrys:function(){
  	let that=this;
  	let {book_id,poetryList,totalCount,pageIndex}=this.data;
  	poetryListService.getPoetrys(book_id,pageIndex,7).then(function(res){
  		if(res.success){
  			let data=res.data;
  			for(let i=0;i<data.length;i++){
  				data[i].poetry_bref=data[i].poetry_content.split("。")[0]+'。'
  			}
  			poetryList=poetryList.concat(data)
  			totalCount=res.totalCount;
  			that.setData({poetryList,totalCount})
  			that.setData({isLoadding:false})
  			setTimeout(function(){
  				that.setData({ translateX: 0 })
  			},30)
  		}
  	})
  },
  //去诗词详情
  toDetail:function(event){
  	console.log(event)
  	let {index}=event.currentTarget.dataset;
  	let {book_id,isPayed,grade,isDouble,payInfo}=this.data;
  	if(isDouble){
  		return;
  	}
  	this.setData({isDouble:true})
  	//先判断有没有购买过 没有购买过弹提示框
  	if(isPayed){//已购买
  		wx.navigateTo({
	      url: '/pages/poetryDetail/poetryDetail?grade='+grade+'&book_id='+book_id+'&index='+index+'&is_collect=0',
	    })
  	}else{//未购买
  		//没有购买 判断是不是免费
  		if(payInfo.is_free_scan==1){//免费
  			wx.navigateTo({
		      url: '/pages/poetryDetail/poetryDetail?grade='+grade+'&book_id='+book_id+'&index='+index+'&is_collect=0',
		    })
  		}else{//没有购买不免费
  			this.setData({showPay:true})
	  		this.setData({isDouble:false})
	  		this.setData({clickIndex:index})
  		}
  	}
  	
  },
  //去练习
  toQuestion:function(){
  	let {book_id,grade,isPayed,payInfo,key_number,isDouble}=this.data;
  	if(isDouble){
  		return;
  	}
  	this.setData({isDouble:true})
  	//先判断有没有购买过，还有没有钥匙，如果没有购买过也没有钥匙则弹提示框
  	if(isPayed){//已购买直接练习
  		wx.navigateTo({
	      url: '/pages/question/question?book_id='+book_id+'&grade='+grade,
	    })
  	}else{
  		//没有购买 判断是不是免费
  		if(payInfo.is_free_scan==1){//免费
  			wx.navigateTo({
		      url: '/pages/question/question?book_id='+book_id+'&grade='+grade,
		    })
  		}else{//没有购买不免费 判断有没有钥匙
  			if(key_number>0){//有钥匙  			
	  			wx.navigateTo({
			      url: '/pages/question/question?book_id='+book_id+'&grade='+grade,
			    })
	  		}else{//没有钥匙 弹出提示框
	  			this.setData({showPay:true})
	  			this.setData({isDouble:false})
	  			this.setData({clickIndex:-1})
	  		}
  		}
  	}
  	
  },
  //错题集
  toErrorBook:function(){
  	let {book_id,isDouble}=this.data;
  	if(isDouble){
  		return;
  	}
  	this.setData({isDouble:true})
  	wx.navigateTo({
      url: '/pages/errorBook/errorBook?book_id='+book_id
    })
  },
  toPaySuccess:function(){
  	//支付成功
  	let that=this;
  	let {clickIndex,grade,book_id}=that.data;
  	this.setData({showPay:false})
  	this.setData({isDouble:false})
  	if(clickIndex>-1){
  		wx.navigateTo({
	      url: '/pages/poetryDetail/poetryDetail?grade='+grade+'&book_id='+book_id+'&index='+clickIndex+'&is_collect=0',
	    })
  	}else{
  		wx.navigateTo({
	      url: '/pages/question/question?book_id='+book_id+'&grade='+grade,
	    })
  	}
  },
  toPayFail:function(){
  	//支付失败
  	this.setData({showPay:false})
  	this.setData({isDouble:false})
  	wx.showToast({
		  title: '支付失败',
		  duration: 2000
		})
  },
  hidePay:function(){
  	this.setData({showPay:false})
  },
  //获取支付信息
  getPayInfo:function(cb){
  	let that=this;
  	let {book_id}=this.data;
  	commonService.getPayInfo(book_id).then(function(res){
  		if(res.success){
				if(res.data.paid){//已经购买过
					that.setData({isPayed:true})
					that.setData({payInfo:res.data.payinfo})
				}else{
					that.setData({isPayed:false})
					that.setData({key_number:res.data.key_number})					
					that.setData({payInfo:res.data.payinfo})
				}
				if(cb){
					cb();
				}
  		}
  	})
  },
	toPageEnd:function(){
		//滚动到底部
		console.log("到底了，加载新页面")
		let that=this;
		let {totalCount,poetryList,isLoadding,pageIndex}=this.data;
		if(totalCount!=poetryList.length&&!isLoadding){
			pageIndex++;
			that.setData({pageIndex,isLoadding:true})
			this.getPoetrys();
		}
		
	},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  this.setData({isDouble:false})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  this.setData({isDouble:false})
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
    var title ='';
    var pageImg='';
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})