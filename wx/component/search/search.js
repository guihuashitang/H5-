// component/search/search.js
//import {wordService} from '../../service/word.js'
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		
  },

  /**
   * 组件的初始数据
   */
  data: {
		value:''
  },
	ready(){
		let that=this;
		console.log("组件显示")
		
	},
	detached(){
		let that=this;
		console.log("组件移除");
		//如何取消监听
	},
  /**
   * 组件的方法列表
   */
  methods: {
		toSearch:function(event){
			console.log("视角")
			console.log(event)
			//this.setData({value:''})
			let value=event.detail.value;
			var myEventDetail = {
				value:value
			} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toSearch', myEventDetail, myEventOption)
		},
		clearIpt:function(event){
			this.setData({value:''})
			var myEventDetail = {
			} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('toClearIpt', myEventDetail, myEventOption)
		}
  }
})
