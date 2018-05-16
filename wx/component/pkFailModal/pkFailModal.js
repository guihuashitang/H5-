// component/pkFailModal/pkFailModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    transYFail: {
      type: String,
      value: '位移'
    },
    isDraw: {
      type: Boolean,
      value: '平局'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showFailModal:true,
    failPk: ['+', '0', '0', '0'],
    score: [3, 0, 0],
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
    toAgain() {
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
    var y1 = 0;
    var y2 = 0;
    var y3 = 0;
    if (this.data.score[0] != 0) {
      y1 = this.data.score[0] * 50;
    } else {
      y1 = 10 * 50;
    }
    if (this.data.score[1] != 0) {
      y2 = this.data.score[1] * 50;
    } else {
      y2 = 10 * 50;
    }
    if (this.data.score[2] != 0) {
      y3 = this.data.score[2] * 50;
    } else {
      y3 = 10 * 50;
    }
    //百位 0 --5  1+9+1+(5-1)
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translate(0, -y1).step({
      duration: 2000,
      delay: 1000
    })
    this.setData({
      animationData: animation.export()
    })
    //十位 0 --0  1+9+1+9
    var animation2 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      delay: 500
    })
    this.animation2 = animation2;
    animation2.translate(0, -y2).step({
      duration: 2000
    })
    this.setData({
      animationData2: animation2.export()
    })
    //个位 0 --0  1+9+1+9
    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation3 = animation3;
    animation3.translate(0, -y3).step({
      duration: 2000
    })
    this.setData({
      animationData3: animation3.export()
    })



  }
})
