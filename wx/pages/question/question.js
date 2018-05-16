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
    hp: 0,//本次测试中的正确题数
    continueHp:0,//连对题目数量
    showRight:false,//是否展示连对提示
    isDouble: false,
    spellWord: [],//拼写题型写入的字母 有是否正确的信息
    displayX: false,//是否显示解析
    isOver: false,//是否本题答题结束
    isRight:0,//本题答题正确与否
    btnInfo:{},
    loop:true,//循环播放背景音乐
    openBgMusic:true,//默认打开背景音乐
    autoPlay:true,//自动播放
    showPracticeResult:false,//本次练习所以题目完成
    isPayed:false,//是否购买过
  	key_number:0,//钥匙数目
  	showPay:false,//是否显示支付界面
  	payInfo:{},//支付信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	this.setData({book_id:options.book_id,grade:options.grade})
  	let that = this;
    let grade_id=parseInt(options.grade_id)
    that.setData({grade_id})
		that.load();    
  },
  load:function(){
  	let that = this;
    let { str, time } = that.data;
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
    that.getPayInfo(function(){
			if(!that.data.isPayed){//没有购买过 消耗一把钥匙
				commonService.updateKeyNumber().then(function(res){
					if(res.success){
						that.getKeyNumber();
					}
				})
			}else{
				that.getKeyNumber();
			}
		});
		//获取试题
    that.getQuestion();
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
  //获取支付信息
  getPayInfo:function(cb){
  	let that=this;
  	let {book_id}=this.data;
  	commonService.getPayInfo(book_id).then(function(res){
  		if(res.success){
				if(res.data.paid){//已经购买过
					that.setData({isPayed:true})
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
  //获取钥匙
  getKeyNumber:function(){ 
  	let that=this;
		commonService.GetUserInfo().then(function(res){
			if(res.success){
				that.setData({key_number:res.data.key_number})	
			}
		})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取数据
  getQuestion:function(cb){
    let that = this;
    let {grade_id,totalCount,currentindex}=this.data;  
    let {book_id,ques_type}=that.data;
    poetryListService.getQuestion(book_id,'1').then(function(res){
    	if(res.success){
    		wx.hideLoading()
    		//数据列表
    		let data=res.data;
    		if(res.totalCount==0){
    			if(cb){
	    			cb(res);
	    		}
    			return;
    		}
    		let reg1=/\*+/gi
    		for(let i=0;i<data.length;i++){
    			let question_content=data[i].question_content;
    			data[i].question_content=question_content.split("")
    			
    		}
    		console.log("1111",data[0].question_content)
    		that.data.question=that.data.question.concat(data);
    		that.setData({question:that.data.question})
    		if(totalCount<0){//第一次需要赋值
    			that.setData({totalCount:data.length})
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
		e.detail.innerAudioContext.onPlay(() => {
		  	//播放 显示关闭音效
		})
		e.detail.innerAudioContext.onPause(()=> {
			//暂停 显示开启音效
		})
		e.detail.innerAudioContext.onStop(()=> {
			//停止 显示开启音效
		})
		e.detail.innerAudioContext.onError(()=> {
			//播放出错 显示开启音效
		})
	},
  //再来一次
  toAgain: function () {
    let that = this;
    let {isPayed,key_number,isDouble}=this.data;
    if(isDouble){
    	return;
    }
    this.setData({isDouble:true})
    //初始化数据
    that.setData({
    	totalCount:-1,
    	question:[],
    	currentindex:0,
    	hp: 0,
    	continueHp:0,
    	isDouble:false,
    	isRight:0,
    	openBgMusic:true,
    	showPracticeResult:false,
    	showRight:false
    })
      
    if(isPayed){//已购买 直接开始练习
    	that.load();
    }else{//没有购买 先判断有没有钥匙
    	if(key_number==0){//没有钥匙
	    	//弹购买提示
	    	this.setData({isDouble:false})
	    	that.load();
	    }else{//有钥匙 直接开始练习
	    	that.load();
	    }
    }
  },
  //点击书名 去购买
  showPay: function () {
  	console.log("gou")
  	let {isPayed,payInfo}=this.data;
  	//先判断有没有支付
  	if(!isPayed&&payInfo.is_free_scan==0){//没有购买并且不是免费的弹支付框
  		this.setData({showPay:true})
  	}
  },
  toPaySuccess:function(){
  	//支付成功
  	let that=this;
  	this.setData({showPay:false})
  	this.setData({isDouble:false})
  	this.setData({isPayed:true})
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
  //下一题
  nextWord: function () {
    let that = this;
    let { currentindex, displayWord, question,totalCount,isDouble } = that.data;
    if(isDouble){
    	return;
    }
    this.setData({isDouble:true})
    displayWord = [];
    currentindex++;        
    if(currentindex>=totalCount){//题目做完了
    	//展示结果页	
    	that.setData({showPracticeResult:true,isOver:false})
    	that.getPayInfo();
    	this.setData({isDouble:false})
			return;
    }
    this.setData({isDouble:false})
    that.setData({displayX:false})
    that.setData({currentindex,displayWord,isOver:false})
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
    let { currentindex, question, hp,continueHp, isOver,question_guid,isDouble} = that.data;    
    let answers=question[currentindex].answers;
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
		if(is_right == 1){//回答正确
			//下一个
			hp++;
			continueHp++;
			that.setData({hp,continueHp,question})
			if(continueHp>1){
				that.setData({showRight:true})
			}
			clearTimeout(timer);
			timer=setTimeout(function(){
				that.setData({showRight:false})
				that.nextWord();
			},2000)
			this.setData({isDouble:false})
		}else{//回答错误
			//展示
			continueHp=0;
			that.setData({continueHp,question})
			this.setData({isDouble:false})
		}	   
		if(answer_duration==0){
			answer_duration=1;
		}
    let parameter={
    	question_guid:question_guid,
    	uid :app.globalData.weixinUser.uid,
    	poetry_id:question[currentindex].poetry_id,
    	poetry_book_id :question[currentindex].poetry_book_id,
    	question_id :question[currentindex].id,
    	question_type :question[currentindex].question_type,
    	answer_content:answers[index].answer,
    	answer_duration :answer_duration,
    	is_right :that.data.isRight,
    	answer_mode:1//答题类型 1表示练习 2表示错题练习 
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
  onShareAppMessage:function(e){
		var that = this;
    var title ='';
    var pageImg='';
    var path ='';
    let {book_id,grade}=that.data;
    if(e.from=='button'){
    	path = `/pages/index/index`;
    }else{
    	path = `/pages/poetryList/poetryList?book_id=${book_id}&grade=${grade}`;
    }
    return app.onShareAppMessage(title, pageImg,path);
	}
})
