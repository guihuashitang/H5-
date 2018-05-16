// component/showModal/showModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		btnInfo:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
		showModal:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
		sure(){
			var myEventDetail = {
				confirm:true,//为 true 时，表示用户点击了确定按钮
				data:this.data.btnInfo.confirm
			} // detail对象，提供给事件监听函数
			if(this.data.btnInfo.confirm.isShare){
				var myEventDetail = {
					confirm:true,//为 true 时，表示用户点击了确定按钮
					isShare:true,//表示用户点击了确定分享
				}
			}
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('confirm', myEventDetail, myEventOption)
		},
		close(){
			this.setData({showModal:false})
			var myEventDetail = {
				confirm:false,//为 true 时，表示用户点击了取消
			} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('confirm', myEventDetail, myEventOption)
		}
  },
  ready(){
  		
  	}
})
