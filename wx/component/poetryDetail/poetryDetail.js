// component/poetryDetail/poetryDetail.js
import { commonService } from '../../service/common.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
		poetryList:Object,
		currentIndex:Number,
  
  },

  /**
   * 组件的初始数据
   */
  data: {
		isDouble:false,
    changeIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {  	
		//切换选项卡
		toTap:function(event){
			console.log(event)
			let {index}=event.target.dataset;
			let {poetryList,currentIndex}=this.data;
			poetryList[currentIndex].tabIndex=index;

			this.setData({poetryList})
		},
		//音频
	// toPlay:function(event){
	// 	console.log("read",event)
	// 	let {poetryList,currentIndex,backgroundAudioManager}=this.data;
	// 	if(poetryList[currentIndex].isPlaying){//在播放
	// 		backgroundAudioManager.pause();
	// 		for(let i=0;i<poetryList.length;i++){
	// 			poetryList[i].isPlaying=false
	// 		}
	// 	}else{//没有播放
	// 		if(poetryList[currentIndex].audio_url){
	// 			backgroundAudioManager.src =poetryList[currentIndex].audio_url;
	// 			for(let i=0;i<poetryList.length;i++){
	// 				poetryList[i].isPlaying=false
	// 			}
	// 			poetryList[currentIndex].isPlaying=true
	// 		}else{
	// 			backgroundAudioManager.pause();
	// 			//提示没有音频
	// 			wx.showToast({
	// 			  title: '暂无音频',
	// 			  icon: 'success',
	// 			  duration: 2000
	// 			})
	// 			for(let i=0;i<poetryList.length;i++){
	// 				poetryList[i].isPlaying=false
	// 			}
	// 		}			
	// 	}
	// 	this.setData({poetryList})
	// 	return;
	// 	let {isPlaying}=event.detail;
	// 	for(let i=0;i<poetryList.length;i++){
	// 		poetryList[i].isPlaying=false
	// 	}
	// 	poetryList[currentIndex].isPlaying=isPlaying
	// 	this.setData({poetryList})
	// 	console.log(poetryList)
	// },
	//收藏
	collection:function(){
		let that=this;
		let {poetryList,currentIndex,isDouble}=that.data;
		let id=poetryList[currentIndex].id;
		let is_collect=poetryList[currentIndex].is_collect;
		if(isDouble){
			return;
		}
		this.setData({isDouble:true})
		if(is_collect>0){//原本收藏 -- 取消收藏
			commonService.deleteCollect(id).then(function(res){
				poetryList[currentIndex].is_collect=0;
				that.setData({poetryList})
				that.setData({isDouble:false})
			})
		
		}else{//原本没有收藏 -- 添加收藏
			commonService.addCollect(id).then(function(res){
				poetryList[currentIndex].is_collect=1;
				that.setData({poetryList})
				that.setData({isDouble:false})
			})
		}
	},
  play: function (e) {
    console.log('toPlay')
    var myEventDetail = {}  // detail对象，提供给事件监听函数
    var myEventOption = e // 触发事件的选项
    this.triggerEvent('play', myEventDetail, myEventOption)
  },
  },
  ready:function(){
  	// this.data.backgroundAudioManager = wx.getBackgroundAudioManager()
    console.log(this.data.currentIndex,)
    // if (this.data.currentIndex != this.data.changeIndex){
    //   this.data.backgroundAudioManager.stop();
    //   this.setData({ changeIndex: this.data.currentIndex  })
    // }
  },
  // detached:function(){
  // 	if (this.data.backgroundAudioManager){
	//     this.data.backgroundAudioManager.stop();
	//   }
  // }
})
