import { get, post,service } from 'common.js'
const poetryListService = {
	weixinUser(){
	    return wx.getStorageSync('weixinUser');
	},	
	//诗词列表
  	getPoetrys (book_id,pageIndex,pageSize){
  		let uid=this.weixinUser().uid;
  		var params = new Object();
  		params={
  			uid:uid,
  			book_id:book_id,
  			pageIndex:pageIndex,
  			pageSize:pageSize
  		}
		return get(service+'Education/Poetry/GetPoetrys',params)
  	},
  	getPoetry(id){
  		let uid=this.weixinUser().uid;  		
		return get(service+'Education/Poetry/GetPoetry',{uid,uid,id:id})
  	},
  	//诗词题
  	getQuestion (book_id,ques_type){
  		//let uid=this.weixinUser().uid;
  		var params = new Object();
  		params={
  			book_id:book_id,
  			ques_type:ques_type
  		}
		return get(service+'Education/Poetry/GetQuestion',params)
  	},
  	//诗词题保存答案
  	saveAnswer (params){
		return post(service+'Education/Poetry/SaveAnswer',params)
  	},
  	//复习题目列表
	getReviews(book_id,pageIndex,pageSize){
		let uid=this.weixinUser().uid;
		return get(service+'Education/Poetry/GetReviews',{uid:uid,book_id:book_id,pageIndex:pageIndex,pageSize:pageSize})
	},
	//复习题列表
	getReviewQuestions(book_id,pageIndex,pageSize){
		let uid=this.weixinUser().uid;
		return get(service+'Education/Poetry/GetReviewQuestions',{uid:uid,book_id:book_id,pageIndex:pageIndex,pageSize:pageSize})
	}
}

module.exports = {
  poetryListService: poetryListService
}