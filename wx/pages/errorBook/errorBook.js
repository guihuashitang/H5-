// pages/errorBook/errorBook.js
import { poetryListService } from '../../service/poetryList.js'
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  book_id:0,
  grade:'',
  poetryList:[],
  pageIndex:1,
  isLoadding:false,
  totalCount:-1,
  isDouble:false,
  translateX: 110,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	this.setData({book_id:options.book_id})
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
  	if (app.globalData.weixinUser) {
      that.getReviews();
    } else {
      app.uidCallback1 = () => {
        that.getReviews();
        
      }
    }  	
  },
  getReviews:function(){
  	let that=this;
  	let {book_id,poetryList,totalCount,isLoadding,pageIndex}=this.data;
  	poetryListService.getReviews(book_id,pageIndex,15).then(function(res){
  		if(res.success){
  			let data=res.data;
  			if(totalCount==-1){
  				setTimeout(function(){
  					that.setData({translateX: 0})
  				},30)
  			}
  			if(data.length>0){//有错题
	    		for(let i=0;i<data.length;i++){
	    			let question_content=data[i].question_content;
	    			data[i].question_content=question_content.split("")
	    			
	    		}
	    		that.setData({poetryList:data,totalCount:res.totalCount})
	    		that.setData({isLoadding:false})
  			}else{//没有错题
  				that.setData({totalCount:0})
//		  		setTimeout(function(){
//				    wx.navigateBack({
//						  delta: 1
//						})
//					},3000)
  			}
  		}
  	})
  },
  toQuestion:function(e){
  	let {book_id,isDouble}=this.data;
    let { index,id } = e.currentTarget.dataset;
    console.log(index)
  	if(isDouble){
  		return;
  	}
    if(index == 0){
      var isFir = true;
    }else{
      var isFir = false;
    }
  	this.setData({isDouble:true})
  	wx.navigateTo({
      url: '/pages/errorQuestion/errorQuestion?book_id=' + book_id + '&ques_type=1&index=' + index + '&id=' + id + '&isFir=' + isFir,
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