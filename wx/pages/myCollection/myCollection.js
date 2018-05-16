// pages/myCollection/myCollection.js
import { commonService } from '../../service/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
  totalCount:-1,
    poetryList: [],
  pageMore: false,
  pageLoading: true,
  pageIndex: 1,
  pageSize: 10,
  isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  	let that=this;
    that.getCollect();
  },

  getCollect: function(){
    let that = this;
    let { poetryList, totalCount } = this.data;
    commonService.getCollect(that.data.pageIndex, that.data.pageSize).then(function (res) {
      if (res.success) {
        console.log(res)
        if (res.totalCount == poetryList.length) {
          console.log(res.totalCount == poetryList.length)
          that.setData({ pageMore: true, pageLoading: false })
          return
        }
        if (res.totalCount >= 10) {
          that.setData({ isLoading: true })
        }
        let data = res.data;
        for (let i = 0; i < data.length; i++) {
          //解析时间2018-04-12 17:17:55
          data[i].create_time = data[i].create_time.substring(5, 10);//04-12
          data[i].create_time = data[i].create_time.replace("-", "月");//04月12
          data[i].create_time = data[i].create_time + "日";//04月12日
          //取内容第一句
          data[i].poetry_bref = data[i].poetry_content.split("。")[0] + '。'
        }
        // poetryList = data;
        poetryList = poetryList.concat(data);
        totalCount = res.totalCount;
        that.setData({ poetryList, totalCount })
      }
    })
  },

  toPageEnd: function () {
    let that = this;
    let { pageIndex } = that.data;
    pageIndex++;
    that.setData({ pageIndex })
    if (that.data.pageLoading && !that.data.pageMore) {
      console.log('AA')
      that.getCollect();
    }

  },

//去诗词详情
  toDetail:function(event){
  	console.log(event)
  	let {index}=event.currentTarget.dataset;
  	let {poetryList}=this.data;
  	wx.navigateTo({
      url: '/pages/poetryDetail/poetryDetail?index='+index+'&is_collect=1'+'&poetry_id='+poetryList[index].poetry_id,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  onShareAppMessage: function () {
  	var that = this;
    var title ='';
    var pageImg='';
    var path = `/pages/index/index`;
    return app.onShareAppMessage(title, pageImg,path);
  }
})