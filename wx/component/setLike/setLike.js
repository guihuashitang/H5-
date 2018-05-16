// component/showModal/showModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		userInfo:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
		showSetLike:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
		sure(){
			var myEventDetail = {
				confirm:true,//为 true 时，表示用户点击了确定按钮
			} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('setLike', myEventDetail, myEventOption)
		},
		close(){
			this.setData({showSetLike:false})
		}
  },
  ready(){

  	}
})
