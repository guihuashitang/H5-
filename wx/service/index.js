import { get, post,service } from 'common.js'
const indexService = {
	weixinUser(){
	    return wx.getStorageSync('weixinUser');
	},
	getGrades(grade){
		let uid=this.weixinUser().uid;
		if(!grade){
			grade="";
		}
		return get(service+'Word/WordCard/GetGrades',{uid:uid,grade:grade})
	},
	//书籍列表
  	getBooks(condition,pageIndex,pageSize){
  		let uid=this.weixinUser().uid;
  		var params = new Object();
  		params={
  			uid:uid,
  			condition:condition,
  			pageIndex:pageIndex,
  			pageSize:pageSize
  		}
		return get(service+'Education/Poetry/GetBooks',params)
  	}
}

module.exports = {
  indexService: indexService
}