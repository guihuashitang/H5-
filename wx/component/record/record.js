// component/record.js
//import {audioToWordUrl} from '../../service/word.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
//		isRecord:Boolean
			getData:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
		recordStaus:-1,//-1未录音；0正在录音；1录音完成
		stopRecord:false,//按住时间较短的情况下，会出现先触摸结束后录音
		isPause:false,//录音暂停
		btnInfo:{
			content:"正在上传"
		}
  },
	ready(){
		
	},
  /**
   * 组件的方法列表
   */
  methods: {
	//按下 开始录音
  recordStart: function () {
    var that = this;
    that.setData({stopRecord:false})
    console.log("按下")
		console.log(this.data.getData)
	  that.setData({
	    recordStaus: 0,
	  });
		this.authorize();
  },
  send:function(){
  	var that=this;
  	that.setData({stopRecord:true})
  	console.log("结束录音")
  	that.setData({
	    recordStaus: -1,
	  });
  	if(that.recorderManager){
  		that.recorderManager.stop();
  	}
    
  },
  //开始录音
  recordNow:function() {
  	var that=this;
  	that.setData({
	    recordStaus: 0
	  })
    console.log("已授权开始录音")  
    if(that.recorderManager){
    	that.recorderManager={}
    }
  	that.recorderManager = wx.getRecorderManager()
  	const options = {
  		format:'mp3',
		  duration: 600000,
		  encodeBitRate:16000,
		  sampleRate:8000
		  //duration:6000,//测试用
		}		
		that.recorderManager.start(options)
		if(that.data.stopRecord){
			return false;
		}
		that.recorderManager.onStart(() => {
		  console.log('开始录音')
		  if(that.data.isPause){
		  	return false;
		  }
		})
		that.recorderManager.onPause((res) => {
		  console.log('录音暂停')
		  that.setData({isPause:true})
		  that.recorderManager.resume();
		})
		that.recorderManager.onStop((res) => {
		  console.log('停止', res)
		  let btnInfo={
		  	content:"正在上传"
		  }
		  that.setData({btnInfo:btnInfo,showModal:true})
		  that.setData({recordStaus:1})
		  const { tempFilePath } = res
		  let getData=that.data.getData;
		  //停止录音上传文件
        wx.uploadFile({
          url: audioToWordUrl,
//        header:{
//        	token:app.globalData.token
//        },
          filePath: tempFilePath,
          formData: { uid:getData.uid,word_card_id:getData.word_card_id,word_card_book_id:getData.word_card_book_id,word_card_grade_id:getData.word_card_grade_id,word:getData.word },
          name: 'file',
          success: function (res) {
          	that.setData({
		          recordStaus: -1,
		        })
          	console.log("成功")
            console.log(res);
            var data = JSON.parse(res.data);
            if(data.success){
            	console.log("录音上传成功")
            	that.setData({showModal:false})
				      var myEventDetail = data.data // detail对象，提供给事件监听函数
				      var myEventOption = {} // 触发事件的选项
				      that.triggerEvent('recordResult', myEventDetail, myEventOption)
            }else{//录音上传失败
            	console.log("录音上传失败")
            	let btnInfo={
								content:'上传失败，请重新录音',
							}
				  		that.setData({btnInfo:btnInfo,showModal:true})
				  		setTimeout(function(){
								that.setData({showModal:false})
							},600)
            }
          },
          fail:function(){
          	console.log("失败")
          	that.setData({
		          recordStaus: -1,
		        })
          	let btnInfo={
							content:'上传失败，请重新录音',
						}
			  		that.setData({btnInfo:btnInfo,showModal:true})
			  		setTimeout(function(){
							that.setData({showModal:false})
						},600)
          }
       });
		})	
		that.recorderManager.onError((res) => {
		  console.log('出错')
		  console.log(res)
		  that.setData({
	      recordStaus: -1,
	    })
		})
  },
  authorize(){
  	let that=this;
  	//查询是否授权
	  wx.getSetting({
	    success: function (res) {          
	      if (!res.authSetting['scope.record']) {
	      	console.log("未授权")
	        // 用户未授权录音
	        //发起授权请求
	        wx.authorize({
	          scope: 'scope.record',
	          success: function (errMsg) {
	          	console.log("接口调用成功")
	          	//接口调用成功
	          	//查询是否授权
	          	wx.getSetting({
					        success: function (res) {
					        	that.setData({
							        recordStaus: -1,
							      });
					          if (!res.authSetting['scope.record']) {
					            // 用户未授权录音
					            console.log("未授权2")
					            that.setData({
								        recordStaus: -1,
								      });
								      wx.openSetting({
					              success: function (res) {
					              	//打开成功
					              },
					              fail: function (res) {
					              }
					            })
					          } else {
					            // 用户已经授权录音
					            console.log("授权2")					            
					            if(!that.data.stopRecord){
							        	//that.recordNow();
							        }
					          }
					        }
					      })
	          },
	          fail:function(){
	          	console.log("接口调用失败")
	          	//打开设置界面，引导用户开启授权
	          	that.setData({
	              recordStaus: -1,
	            });
					      wx.openSetting({
		              success: function (res) {
		              	//打开成功
		              },
		              fail: function (res) {
		              }
		            })
	          }
	        })
	      } else {
	        // 用户已经授权录音
	        console.log("授权1")
	        console.log(that.data.stopRecord)
	        if(!that.data.stopRecord){
	        	that.recordNow();
	        }else{
	        	that.setData({
              recordStaus: -1,
            });
	        	wx.showToast({
		          title: '录音时间太短',
		          icon: 'success',
		          duration: 2000
		        })
	        }
	        
	      }
	    }
	  })
  }
  }
})
