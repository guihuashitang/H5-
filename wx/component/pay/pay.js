// component/pay/pay.js
import { commonService } from '../../service/common.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		book_id:Number,
		book_price:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
		btnInfo:{
			content:"分享给朋友，集齐5颗赞可以解锁本年级全部单词",
			confirm:{
				text:'分享',
				isShare:true
			}
		},
		isClickPay:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
		payClose(){						
			var myEventDetail = {
				close:true,//为 true 时，表示用户点击了确定按钮
			} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('cancle', myEventDetail, myEventOption)
		},
		fastBuySeed(){		
			let that=this;
			let {book_id,isClickPay}=this.data;
			
			if(isClickPay){
				return false;
			}
			console.log("dianji")
			this.setData({isClickPay:true})
	  	commonService.fastBuy(book_id,0).then(function(res){
	  		console.log("支付成功",res)
	  		that.setData({isClickPay:false})
	  		var myEventDetail = res // detail对象，提供给事件监听函数
	      var myEventOption = {} // 触发事件的选项
	      that.triggerEvent('paySuccess', myEventDetail, myEventOption)
	  		
	  	},function(res){
	  		console.log("支付失败了")
	  		that.setData({isClickPay:false})
				var myEventDetail = res // detail对象，提供给事件监听函数
	      var myEventOption = {} // 触发事件的选项
	      that.triggerEvent('payFail', myEventDetail, myEventOption)
	  	})
			
		}
  }
})
