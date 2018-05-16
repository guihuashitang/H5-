// component/playAudio/playAudio.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		audioUrl:String,
		readType:String,
		autoPlay:Boolean,
		isPlaying:Boolean,
		loop:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
		innerAudioContext:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
		onTap(e){
			let that=this;
			let {audioUrl,autoPlay,isPlaying}=this.data;
			let {type}=e.currentTarget.dataset;
			console.log("啦啦",e);
      if(isPlaying){//正在播放
      	that.setData({isPlaying:false})
      	that.data.innerAudioContext.pause();
      }else{//没有音乐播放
      	that.data.innerAudioContext = wx.createInnerAudioContext();      
	  		that.data.innerAudioContext.src =audioUrl;  
	  		that.data.innerAudioContext.play();
	  		that.setData({isPlaying:true})
      }
			var myEventDetail ={type:type,isPlaying:that.data.isPlaying,innerAudioContext:this.data.innerAudioContext}  // detail对象，提供给事件监听函数
      var myEventOption = e // 触发事件的选项
			this.triggerEvent('play', myEventDetail, myEventOption)	
		}
  },
  ready:function(){
  	console.log("准备eee")
  	let that=this;
  	let {audioUrl,autoPlay,loop}=this.data;
  	if (that.data.innerAudioContext){
	    that.data.innerAudioContext.destroy();
	  }
		that.data.innerAudioContext = wx.createInnerAudioContext();      
	  that.data.innerAudioContext.src =audioUrl;  
	  if(loop){//循环播放
	  	console.log("循环播放")
  		that.data.innerAudioContext.loop=true;
  	}
	  if(autoPlay){//自动播放
	  	that.data.innerAudioContext.play();
	  	that.data.innerAudioContext.onPlay(function(){
	  		that.setData({isPlaying:true})
	  	})
	  }
  	
  },
  detached:function(){
  	console.log("卸载")
  	if (this.data.innerAudioContext){
	    this.data.innerAudioContext.destroy();
	  }
  }
})
