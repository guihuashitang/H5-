    var app = getApp()
import { indexService } from '../../service/index.js'
import { commonService } from '../../service/common.js'
Page({
  data: {
		grade:['全部','一年级','二年级','三年级','四年级','五年级','六年级','学前'],
		showAllGrade:false,//是否展示全部年级
		currentGrade:0,//默认全部
		bookInfo:[],
		scrollTo:'grade1',
    isDouble:false,//防止快速点击重复调用接口
    isSearch:false,//是条件搜索书籍 还是 全部书籍
    showSearch:true,//是否展示搜索框
		
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;  
    let {score}=that.data;
    if(options.share){//分享给新用户分享者得钥匙 
    	let preUid=parseInt(options.preUid);
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
  onShow:function(){
  	var that = this;
    if (app.globalData.weixinUser) {
      that.getBooks();
    } else {
      app.uidCallback2 = () => {
        that.getBooks();
      }
    }
  },
  //获取书籍列表
  getBooks:function(condition){
  	let that=this;	
  	if(!condition){
  		condition=""
  	}
  	let {isSearch}=that.data;
  	indexService.getBooks(condition,1,100).then(function(res){
  		console.log(res)
  		if(res.success){
  			var bookData=res.data;
  			var bookInfo=[];
  			let {grade}=that.data;
  			for(let i=0;i<grade.length;i++){
  				bookInfo[i]=[];
  				for(let j=0;j<bookData.length;j++){
  					if(grade[i]==bookData[j].book_grade){  						
  						bookInfo[i].push(bookData[j])
  					}
  				}
  			}
  			that.setData({bookInfo})
  			
  		}
  	})
  },
  //搜索
  searchInput:function(event){
  	console.log("搜索框")
  	console.log(event)
  	let value=event.detail.value;
  	this.setData({isSearch:true});
  	this.getBooks(value);
  	this.setData({showAllGrade:false,scrollTo:'grade0',currentGrade:0})
  },
  //清空搜索 显示全部
  clearIpt:function(){
  	this.getBooks();
  	this.setData({showAllGrade:false,scrollTo:'grade0',currentGrade:0})
  },
  //展开更多
  moreGrade:function(){
  	this.setData({showAllGrade:true})
  },
  //收起更多
  hideGrade:function(){
  	this.setData({showAllGrade:false})
  },
  //按年级筛选书籍
  toSearch:function(event){
  	let that=this;
  	let {bookInfo,isDouble,isSearch}=that.data;
  	if(bookInfo.length==0){
  		return false;
  	}
  	if(isDouble){
  		return false;
  	}
  	that.setData({isDouble:true})
  	setTimeout(function(){
  		that.setData({isDouble:false})
  	},350)
  	let {grade,index}=event.currentTarget.dataset;
//	if(index==0){//点击的是全部
//		//如果按照条件搜索 再点全部 显示全部书籍
//		if(isSearch){
//			that.setData({isSearch:false})
//			this.getBooks();
//		}
//		
//	}
  	that.setData({scrollTo:grade,currentGrade:index})  	
  	this.setData({showAllGrade:false})
  },
  //书籍跳转到诗词列表
  toSearchPaper:function(event){
  	let that=this;
  	let {isDouble}=that.data;
  	if(isDouble){
  		return false;
  	}
  	that.setData({isDouble:true})
  	console.log("年级")
  	console.log(event) 	
  	let {id,grade}=event.currentTarget.dataset;
  	console.log(id)
  	wx.navigateTo({
      url: '/pages/poetryList/poetryList?book_id='+id+'&grade='+grade,
    })
  	
  },
  scroll:function(e){
  	var showSearch;
  	console.log("滚动",e.detail.scrollTop)
    if (e.detail.scrollTop > 10) {
      showSearch = false;
      if (this.data.showSearch != showSearch) {
        this.setData({ showSearch: showSearch })
      }
    } else {
      showSearch = true;
      if (this.data.showSearch != showSearch) {
        this.setData({ showSearch: showSearch })
      }
    }
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
  },
  onHide:function(){
  	console.log("onHide")
  	this.setData({isDouble:false});
  },
  onUnload:function(){
  	console.log("onUnload")
  	this.setData({isDouble:false});
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
})

