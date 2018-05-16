// pages/poetryDetail/poetryDetail.js
import { poetryListService } from '../../service/poetryList.js'
import { commonService } from '../../service/common.js'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: -1,//当前显示哪一首诗
    poetryList: [],
    totalCount: -1,
    pageIndex: 1,
    pageSize: 10,
    isLoadding: false,
    isDouble: false,
    isPlaying: false,//音频是否播放
    isChange: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let { pageSize } = this.data;
    let is_collect = options.is_collect;
    this.data.backgroundAudioManager = wx.getBackgroundAudioManager()
    let currentIndex = parseInt(options.index);
    console.log("进入")
    pageSize = currentIndex + 2;
    that.setData({ currentIndex, is_collect, pageSize })
    console.log(options.is_collect)
    if (options.is_collect > 0) {//是收藏进入
      let poetry_id = options.poetry_id;
      currentIndex = 0;
      this.setData({ poetry_id, currentIndex })
      that.getPoetry()
    } else {
      let book_id = options.book_id;
      let grade = options.grade;
      that.setData({ grade, book_id })
      that.getPoetrys()
    }
  },
  //获取某首诗
  getPoetry: function () {
    let that = this;
    let { poetryList, book_id, totalCount, poetry_id } = this.data;
    poetryListService.getPoetry(poetry_id, 1, 1).then(function (res) {
      if (res.success) {
        poetryList[0] = res.data;
        for (let k = 0; k < poetryList.length; k++) {
          //添加tabIndex选项卡索引
          poetryList[k].tabIndex = 0;
          //添加音频是否播放
          poetryList[k].isPlaying = false;
          //处理诗词的每个字 -拼音+汉字
          poetryList[k].words = [];
          let content = poetryList[k].poetry_content;
          let pinyin = poetryList[k].poetry_content_pinyin;
          let reg = /[\u4E00-\u9FA5\\s]+(\。|\，)/gi;//多个汉字+。 多个汉字+，
          let regPinyin = /\。|\，/gi;//多个拼音多个拼音。或，
          content = content.match(reg)
          if (pinyin) {//诗词详情有拼音
            pinyin = pinyin.split(regPinyin)
            for (let i = 0; i < content.length; i++) {
              content[i] = content[i].split("");
              pinyin[i] = pinyin[i].split(" ");
              poetryList[k].words[i] = []
              for (let j = 0; j < content[i].length; j++) {
                poetryList[k].words[i][j] = {}
                poetryList[k].words[i][j].word = content[i][j];
                poetryList[k].words[i][j].pinyin = pinyin[i][j];
              }
            }
          } else {//诗词详情无拼音
            for (let i = 0; i < content.length; i++) {
              content[i] = content[i].split("");
              poetryList[k].words[i] = []
              for (let j = 0; j < content[i].length; j++) {
                poetryList[k].words[i][j] = {}
                poetryList[k].words[i][j].word = content[i][j];
              }
            }
          }
          //处理释义
          let annotate = poetryList[k].annotate;
          poetryList[k].annotateNew = [];
          let reg2 = /((\r\n)|(\n)|(\r)|\s+)+/gi;
          annotate = annotate.replace(reg2, '**')
          console.log("333", annotate)
          annotate = annotate.split("**");
          let reg3 = /[\u4E00-\u9FA5\\s]+/gi;//多个汉字
          for (let i = 0; i < annotate.length; i++) {
            poetryList[k].annotateNew[i] = {};
            annotate[i] = annotate[i].split(/\:|\：/gi);
            poetryList[k].annotateNew[i].word = annotate[i][0];
            poetryList[k].annotateNew[i].explain = annotate[i][1];
          }

        }
        that.setData({ poetryList })
      }
    })
  },
  getPoetrys: function () {
    let that = this;
    let { poetryList, book_id, totalCount, pageIndex, pageSize } = this.data;
    poetryListService.getPoetrys(book_id, pageIndex, pageSize).then(function (res) {
      if (res.success) {
        let data = res.data;
        for (let k = 0; k < data.length; k++) {
          //添加tabIndex选项卡索引
          data[k].tabIndex = 0;
          //添加音频是否播放
          data[k].isPlaying = false;
          //处理诗词的每个字 -拼音+汉字
          data[k].words = [];
          let content = data[k].poetry_content;
          let pinyin = data[k].poetry_content_pinyin;
          let reg = /[\u4E00-\u9FA5\\s]+(\。|\，)/gi;//多个汉字+。 多个汉字+，
          let regPinyin = /\。|\，/gi;//多个拼音多个拼音。或，
          content = content.match(reg)
          if (pinyin) {//诗词详情有拼音
            pinyin = pinyin.split(regPinyin)
            for (let i = 0; i < content.length; i++) {
              content[i] = content[i].split("");
              pinyin[i] = pinyin[i].split(" ");
              data[k].words[i] = []
              for (let j = 0; j < content[i].length; j++) {
                data[k].words[i][j] = {}
                data[k].words[i][j].word = content[i][j];
                data[k].words[i][j].pinyin = pinyin[i][j];
              }
            }
          } else {//诗词详情无拼音
            for (let i = 0; i < content.length; i++) {
              content[i] = content[i].split("");
              data[k].words[i] = []
              for (let j = 0; j < content[i].length; j++) {
                data[k].words[i][j] = {}
                data[k].words[i][j].word = content[i][j];
              }
            }
          }
          //处理释义
          let annotate = data[k].annotate;
          data[k].annotateNew = [];
          if (annotate !== null) {
            let reg2 = /((\r\n)|(\n)|(\r)|\s+)+/g;
            annotate = annotate.replace(reg2, '**')
            console.log("333", annotate)
            annotate = annotate.split("**");
            let reg3 = /[\u4E00-\u9FA5\\s]+/gi;//多个汉字
            for (let i = 0; i < annotate.length; i++) {
              data[k].annotateNew[i] = {};
              annotate[i] = annotate[i].split(/\:|\：/gi);
              console.log(annotate[i])
              data[k].annotateNew[i].word = annotate[i][0];
              //data[k].annotateNew[i].word=data[k].annotateNew[i].word.match(reg3)[0]
              data[k].annotateNew[i].explain = annotate[i][1];
            }
          }

        }

        poetryList = poetryList.concat(data)
        totalCount = res.totalCount;
        that.setData({ poetryList, totalCount })
        that.setData({ isLoadding: false })
        that.setData({ isDouble: false })
      }
    })
  },
  //上一首
  toPre: function () {
    let { currentIndex, isDouble } = this.data;
    if (isDouble) {
      return;
    }
    this.setData({ isDouble: true })
    currentIndex--;
    this.setData({ currentIndex })
    this.setData({ isDouble: false })
  },
  //下一首
  toNext: function () {
    let { currentIndex, isDouble, pageIndex, poetryList } = this.data;
    if (isDouble) {
      return;
    }
    this.setData({ isDouble: true })
    currentIndex++;
    this.setData({ currentIndex })
    if (currentIndex == poetryList.length) {
      if (totalCount != poetryList.length) {
        pageIndex++;
        this.setData({ pageIndex })
        this.getPoetrys();
      }
    } else {
      this.setData({ isDouble: false })
    }

  },
  swiperAnimationfinish: function (event) {
    let currentIndex = event.detail.current;
    this.setData({ currentIndex, isDouble: false })
  },
  swiperChange: function (event) {
    console.log("变化", event)

    let { poetryList, totalCount, pageIndex, currentIndex } = this.data;
    if (this.data.backgroundAudioManager) {
      this.data.backgroundAudioManager.stop();
    }
    poetryList[currentIndex].isPlaying = false
    this.setData({ poetryList })
    let current = event.detail.current;

    if (current == poetryList.length - 1) {
      if (totalCount != poetryList.length) {
        pageIndex++;
        this.setData({ pageIndex })
        this.getPoetrys();
      }
    }
  },


  //音频
  toPlay: function (event) {
    // console.log("read", event);
    console.log('111')
    let { poetryList, currentIndex, backgroundAudioManager } = this.data;
    if (poetryList[currentIndex].isPlaying) {//在播放
      backgroundAudioManager.pause();
      for (let i = 0; i < poetryList.length; i++) {
        poetryList[i].isPlaying = false
      }
    } else {//没有播放
      if (poetryList[currentIndex].audio_url) {
        backgroundAudioManager.src = poetryList[currentIndex].audio_url;
        for (let i = 0; i < poetryList.length; i++) {
          poetryList[i].isPlaying = false
        }
        poetryList[currentIndex].isPlaying = true
      } else {
        backgroundAudioManager.pause();
        //提示没有音频
        wx.showToast({
          title: '暂无音频',
          icon: 'success',
          duration: 2000
        })
        for (let i = 0; i < poetryList.length; i++) {
          poetryList[i].isPlaying = false
        }
      }
    }
    this.setData({ poetryList })
    return;
    let { isPlaying } = event.detail;
    for (let i = 0; i < poetryList.length; i++) {
      poetryList[i].isPlaying = false
    }
    poetryList[currentIndex].isPlaying = isPlaying
    this.setData({ poetryList })
    console.log(poetryList)
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
    if (this.data.backgroundAudioManager) {
      this.data.backgroundAudioManager.stop();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.backgroundAudioManager) {
      this.data.backgroundAudioManager.stop();
    }
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
  onShareAppMessage: function (e) {
    var that = this;
    var title = '';
    var pageImg = '';
    var path = '';
    console.log(e)
    let { poetryInfo, grade } = that.data;
    if (e.from == 'button') {
      path = `/pages/index/index`;
    } else {
      path = `/pages/poetryList/poetryList?book_id=${poetryInfo.poetry_book_id}&grade=${grade}`;
    }
    return app.onShareAppMessage(title, pageImg, path);
  }
})