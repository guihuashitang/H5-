// pages/question/question.js
import { poetryListService } from '../../service/poetryList.js'
import { commonService } from '../../service/common.js'
var app = getApp();
var timer = null;
var timerAnswer=null;
var answer_duration=0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	totalCount:-1,//第一次进入本页面取到的总数量
    question: [],//单词数据
    currentindex: 0,
    indexNum: 0,
    pageSize:1,//每次取数据数量
    readType:'',//listen -- listenIsPlaying  read -- readIsPlaying
    hp: 0,//本次测试中的正确题数
    user_answer_list: [],
    isDouble: false,
    spellWord: [],//拼写题型写入的字母 有是否正确的信息
    displayX: false,//是否显示解析
    isOver: false,//是否本题答题结束
    isRight:0,//本题答题正确与否
    btnInfo:{},
    showRight:false,
    openBgMusic:true,//默认打开背景音乐
    autoPlay:true,//自动播放
    changeIndex: 0,//错题集索引
    isFirstAnser:true,//是否是第一次答题
    thatId: 0,
    isFir: true,
  },

  /**
   * 生命周期函数--监听页面加载 错题不消耗钥匙
   */
  onLoad: function (options) {
    this.setData({ book_id: options.book_id, ques_type: options.ques_type, changeIndex: parseInt(options.index), thatId: options.id, isFir: options.isFir})
  	let that = this;
    let { str, time } = that.data;
    let grade_id=parseInt(options.grade_id)
    that.setData({grade_id})
    wx.showLoading({
    	title:'正在加载中',    	
    })    
    let question_guid=that.getGuid();
    that.setData({question_guid})
    //第一题开始计时(延迟1s开始计时)
		answer_duration=0;
		timerAnswer=setInterval(function(){
			answer_duration++;
		},1000)
    if (app.globalData.weixinUser) {
  		//获取试题
      that.getReviewQuestions(that.data.changeIndex+1);
    }else {
  		//获取试题
      app.uidCallback1=function(){
        that.getReviewQuestions(that.data.changeIndex + 1);
      }
    }    
    //监听音频
  	wx.onBackgroundAudioStop(function(){
  		that.setData({listenIsPlaying:false})
  		that.setData({readIsPlaying:false})
  	})
  	wx.onBackgroundAudioPlay(function(){
  		let {readType}=that.data;
  		console.log(readType)
	  	if(readType=="listen"){
	  		that.setData({listenIsPlaying:true})
  			that.setData({readIsPlaying:false})
	  	}else if(readType=="read"){
	  		that.setData({listenIsPlaying:false})
  			that.setData({readIsPlaying:true})
	  	}
  	})
  },
  getGuid:function(){
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取数据
  getReviewQuestions:function(pageSize){
    let that = this;
    let {grade_id,totalCount}=this.data;  
    let {book_id,ques_type}=that.data;
    poetryListService.getReviewQuestions(book_id,1,pageSize).then(function(res){
    	if(res.success){
    		wx.hideLoading()
    		//数据列表
    		let data=res.data;
    		let reg1=/\*+/gi
    		for(let i=0;i<data.length;i++){
    			let question_content=data[i].question_content;
    			data[i].question_content=question_content.split("")
    			
    		}
    		that.data.question=data;
        // if (that.data.question[that.data.question.length - 1].id == that.data.thatId && !that.data.isFirstAnser) {
        //   // that.data.question.splice(that.data.question.length - 1, 1);
        //   that.setData({ pageSize: that.data.pageSize+1 })
        //   that.getReviewQuestions(pageSize)
        //   console.log('aaaaaaaaaaaaa')
        // }
    		that.setData({question:that.data.question})
        console.log(that.data.question[that.data.question.length - 1])
        that.setData({ isDouble: false})

    		if(totalCount<0){//第一次需要赋值
    			that.setData({totalCount:res.totalCount})
    		}   		
    	}
    })
	},
	toPlay:function(e){
		console.log("哈哈")
  	console.log(e.detail)
  	let that=this;
  	let {isDouble}=this.data;
  	let {type,isPlaying}=e.detail;
		if(isDouble){
    	return;
    }
    this.setData({isDouble:true})
  	if(isPlaying){
			that.setData({openBgMusic:true})
		}else{
			that.setData({openBgMusic:false})
		}
  	this.setData({isDouble:false})
	},
  //下一题
  nextWord: function () {
    let that = this;
    that.setData({ isFirstAnser: false })
    let { currentindex, displayWord, question, totalCount, isDouble, pageSize, changeIndex, indexNum} = that.data;
    if(isDouble){
    	return;
    }
    this.setData({isDouble:true})
    displayWord = [];
    currentindex++;
    indexNum++;
    if (currentindex == that.data.changeIndex){
      pageSize++;
      that.setData({ pageSize })
    }
    // if (that.data.question[that.data.question.length - 1].id == that.data.thatId) {
    //   that.data.question.splice(that.data.question.length - 1, 1);
    //   console.log('aaaaaaaaaaaaa')
    // }
    console.log('currentindex',currentindex)
    if (question.length!=totalCount) {//本次取的题目做完了且数据未取完
    	wx.showLoading({
	    	title:'正在加载中',    	
	    })
    	that.getReviewQuestions(pageSize);
    	
    }
    if (that.data.isFir){
      if (currentindex+1 >= totalCount) {//题目做完了
        //提示测试完了    
        let btnInfo = {
          content: '您已完成本次错题练习'
        }
        that.setData({ btnInfo: btnInfo, showModal: true })
        setTimeout(function () {
          that.setData({ showModal: false })
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
        that.setData({ displayX: false })
        this.setData({ isDouble: false })
        return;

      }
    }else{
      if (currentindex >= totalCount) {//题目做完了
        //提示测试完了    
        let btnInfo = {
          content: '您已完成本次错题练习'
        }
        that.setData({ btnInfo: btnInfo, showModal: true })
        setTimeout(function () {
          that.setData({ showModal: false })
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
        that.setData({ displayX: false })
        this.setData({ isDouble: false })
        return;

      }
    }

    that.setData({displayX:false})
    this.setData({isDouble:false})
    that.setData({ currentindex, indexNum,displayWord,isOver:false})
    //重新开始计时
    answer_duration=0;
		timerAnswer=setInterval(function(){
			answer_duration++;
		},1000)
    
    
  },
  //答题 ques_type=1
  answer: function (e) {
    let that = this;
    let {index} = e.currentTarget.dataset;
    let { currentindex, question, hp, isOver,question_guid,isDouble,pageSize,isFirstAnser} = that.data;    
    let answers=question[question.length-1].answers;
    let is_right=answers[index].is_right;
    answers[index].checked = true;
    if(isDouble){
    	return;
    }
    if (isOver) {
    	return;
    }
    this.setData({isDouble:true})
    //答题结束清除定时器
    if(timerAnswer){
    	clearInterval(timerAnswer);
    }
    
		that.setData({isOver:true,isRight:is_right})
    if (isFirstAnser) {
      that.setData({ pageSize: 1, currentindex: -1 })
      console.log('currentindex222', that.data.currentindex)
    }
		if(is_right == 1){//回答正确
			//下一个
			hp++;
			that.setData({hp,question})
			clearTimeout(timer);
			timer=setTimeout(function(){
				that.nextWord();
        
			},2000)
			this.setData({isDouble:false})
		}else{//回答错误
			//展示
      if (!that.data.isFirstAnser) {
        pageSize++;
        that.setData({ pageSize })
      }
			that.setData({question})
			this.setData({isDouble:false})
		}	   
    let parameter={
    	question_guid:question_guid,
    	uid :app.globalData.weixinUser.uid,
    	poetry_id:question[question.length-1].poetry_id,
    	poetry_book_id :question[question.length-1].poetry_book_id,
    	question_id :question[question.length-1].id,
    	question_type :question[question.length-1].question_type,
    	answer_content:answers[index].answer,
    	answer_duration :answer_duration,
    	is_right :that.data.isRight,
    	answer_mode:2//答题类型 1表示练习 2表示错题练习 
    }
    poetryListService.saveAnswer(parameter);
  },
  //删除单词
  del: function () {
    let that = this;
    let { question,currentindex} = that.data;
    let {keyboard,spellWord}=question[currentindex];
    for(let j=spellWord.length-1;j>=0;j--){
    	if(spellWord[j].one_word){
		    for (let i = 0; i < keyboard.length; i++) {			    	
	    		if(spellWord[j].one_word==keyboard[i].word&&keyboard[i].checked){
	    			keyboard[i].checked = false;
		    		spellWord[j].one_word="";
		    		break;		 
	    		}
		    }
		    break;
	    }
    }    
    that.setData({ question })
  },

  //解析
  detail: function () {
    let that = this;
    that.setData({ displayX: true })
  },

  close: function () {
    let that = this;
    that.setData({ displayX: false })
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
		this.setData({isDouble:false})
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
    clearTimeout(timer);
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
  onShareAppMessage:function(){
		var that = this;
    var title ='';
    var pageImg='';
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, pageImg,path);
	}
})
