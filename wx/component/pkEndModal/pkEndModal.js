// component/pkEndModal/pkEndModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnInfo: Object,
    transY: {
      type: String,
      value: '位移'
    },
    isLevel: {
      type: Boolean,
      value: '升级'
    },
    indexImg:{
      type: Number,
      value: '升级'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: true,
    victoryPk: ['+','5','0','0'],
    isYes: false,
    bg_img: [
      {
        levelName: '秀才',
        hatImg: '/images/xiucai.png',
      },
      {
        levelName: '举人',
        hatImg: '/images/juren.png',
      }, {
        levelName: '贡士',
        hatImg: '/images/gongshi .png',
      }, {
        levelName: '进士',
        hatImg: '/images/jinshi.png',
      }, {
        levelName: '探花',
        hatImg: '/images/tanhua.png',
      }, {
        levelName: '榜眼',
        hatImg: '/images/bangyan.png',
      }, {
        levelName: '状元',
        hatImg: '/images/zhuangyuan.png',
      }, 
    ],
    score: [5, 0, 0],
    animationData: {},
    animationData2: {},
    animationData3: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    again: function (e) {
      var myEventDetail = {}  // detail对象，提供给事件监听函数
      var myEventOption = e // 触发事件的选项
      this.triggerEvent('again', myEventDetail, myEventOption)
    },
    toAgain(){
      console.log('pk');
      let pages = getCurrentPages(),
        delta;
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].route == 'pages/pk/pk') {
          delta = pages.length - i - 1;
          break;
        }
      }
      wx.navigateBack({ delta });
      // wx.redirectTo({
      //   url: `/pages/pk/pk`,
      // })
    }
  },
  ready() {
    let that = this
    var y1 = 0;
    var y2 = 0;
    var y3 = 0;
    if (that.data.score[0] != 0) {
      y1 = that.data.score[0] * 50;
    } else {
      y1 = 10 * 50;
    }
    if (that.data.score[1] != 0) {
      y2 = that.data.score[1] * 50;
    } else {
      y2 = 10 * 50;
    }
    if (that.data.score[2] != 0) {
      y3 = that.data.score[2] * 50;
    } else {
      y3 = 10 * 50;
    }
    //百位 0 --5  1+9+1+(5-1)
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    that.animation = animation
    animation.translate(0, -y1).step({
      duration: 2000,
      delay: 1000
    })
    that.setData({
      animationData: animation.export()
    })
    //十位 0 --0  1+9+1+9
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 500
    })
    that.animation2 = animation2;
    animation2.translate(0, -y2).step({
      duration: 2000
    })
    that.setData({
      animationData2: animation2.export()
    })
    //个位 0 --0  1+9+1+9
    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    that.animation3 = animation3;
    animation3.translate(0, -y3).step({
      duration: 2000
    })
    that.setData({
      animationData3: animation3.export()
    })

    if (that.data.isLevel){
      setTimeout(function(){
        that.setData({ isYes: true })
      },4500)


    }
    
  }

})
