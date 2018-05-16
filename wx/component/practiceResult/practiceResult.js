// component/practiceResult/practiceResult.js
let app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		keyNumber:Number,
		rightCount:Number,
		book_name:String
  },

  /**
   * 组件的初始数据
   */
  data: {
		headimgurl:'',
		nickname:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
		again:function(e){
			var myEventDetail ={}  // detail对象，提供给事件监听函数
      var myEventOption = e // 触发事件的选项
			this.triggerEvent('again', myEventDetail, myEventOption)
		},
		pay:function(e){
			console.log("gougougou")
			var myEventDetail ={}  // detail对象，提供给事件监听函数
      var myEventOption = e // 触发事件的选项
			this.triggerEvent('pay', myEventDetail, myEventOption)
		}
  },
  ready:function(){
  	this.setData({headimgurl:app.globalData.weixinUser.headimgurl,nickname:app.globalData.weixinUser.nickname})
  }
})
