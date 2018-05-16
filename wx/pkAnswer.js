 // pages/pkAnswer/pkAnswer.js
var app = getApp();
import { pkService } from '../../service/pk.js';
import { poetryListService } from '../../service/poetryList.js';
import { commonService } from '../../service/common.js'
var timer = null;
var timerAnswer = null;
var answer_duration = 0;
var totalTime = null;
var timeBeginPk = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 0,//答题时间(倒计时用)
    countIndex: 0,//答题时间(初始化用)
    challenge: 50,
    beChallenged: 50,
    question: [],//pk题目
    matcher: [],//pk对方信息
    currentindex: 0,
    isOver: false,//是否本题答题结束
    isPkOver: false,//对方是否答完
    isRight: 0,
    windowWidth: 0,
    progressWidth: 0,
    myRightNumber: 0,//自己回答对的题目数量
    pkRightNumber: 0,//对方答对次数
    isStarVoice: true, //是否开始录音
    myGrade: 0,//我的分数
    pkGrade: 0,//对方分数
    scale: '0',//第几题显示隐藏
    opacity: '0',//第几题显示隐藏
    opacityQuestionA: '0',//问题题目显示隐藏
    opacityVoice: '0',//录音组件显示隐藏
    scaleAnswer: '0',//答案显示隐藏
    opacityAnswer: '0',//答案显示隐藏
    showModal: false,//显示结果
    transY: -1500,
    showFailModal: false,
    transYFail: -1500,
    question_guid: 0,
    myHeadimgurl: '',
    mynNickname: '',
    answer_right_score: 0,//答对奖励分
    reward_time_score: 0,//时间奖励分
    my_time: 0,//我的答题总时间
    pk_time: 0,//对方答题总时间
    myAllReward: 0,//我的总奖励分
    pkAllReward: 0,//对方总奖励分
    isLoading: true,//匹配动画
    isMatching: true,//匹配动画
    myHeadTranslate: 0,//匹配动画  匹配到人
    isPkTxt: true,//匹配动画 匹配到人
    thunderTranslate: -100,//准备pk的logo
    hisInfoTranslate: -150,//对方信息
    isMynNickname: false,//自己名字
    rank_score: 0,//我当前的分数
    isLevel: false,//是否升级
    indexImg: 0,//是否升级
    isUnLoad: false,//是否退出本页面
    level: 1,
    isDraw: false,//平局

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({ myHeadimgurl: app.globalData.weixinUser.headimgurl, mynNickname: app.globalData.weixinUser.nickname, level: options.level })
    that.GetQuestions_PK(options.level);
    let question_guid = that.getGuid();
    that.setData({ question_guid });
    wx.showShareMenu({//是否使用带 shareTicket 的转发
      withShareTicket: true
    })
  },

  getGuid: function () {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
        guid += "-";
    }
    return guid;
  },

  //问题显示隐藏
  opacityQuestionA: function () {
    let that = this;
    if (that.data.opacityQuestionA == '0') {
      that.setData({ opacityQuestionA: '1' })
    } else {
      that.setData({ opacityQuestionA: '0' })
    }
  },

  //切换动画
  animation: function (time) {
    let that = this;
    if (that.data.isUnLoad) {
      return
    }
    timeBeginPk = setTimeout(function () {
      that.setData({ scale: '1', opacity: '1' });//显示第几题
      setTimeout(function () {
        that.setData({ scale: '0', opacity: '0' });//隐藏第几题
        setTimeout(function () {
          that.setData({ opacityQuestionA: '1' })//问题显示隐藏
          setTimeout(function () {
            if (that.data.question[that.data.currentindex].ques_type == '2') {
              that.setData({ opacityVoice: '1' })//显示答案
            } else {
              that.setData({ scaleAnswer: '1', opacityAnswer: '1' })//显示答案
            }
            that.countDown();
            that.pkAnswer();
            clearInterval(timerAnswer);
            answer_duration = 0
            setTimeout(function () {//计时每题答题时间
              timerAnswer = setInterval(function () {
                answer_duration++;
                // console.log('answer_duration', answer_duration)
              }, 1000)
            })
          }, 500)
        }, 500)
      }, 1000)
    }, 500);
  },

  //pk题目
  GetQuestions_PK: function (level) {
    let that = this;
    let question_type = 1;
    pkService.GetQuestions_PK(level, question_type).then(function (res) {
      if (res.success) {
        console.log('pk题目', res.data);
        that.setData({ question: res.data.question, matcher: res.data.matcher, count: res.data.question_config.answer_time_pk, answer_right_score: res.data.question_config.answer_right_score, reward_time_score: res.data.question_config.reward_time_score, countIndex: res.data.question_config.answer_time_pk, rank_score: res.data.rank_score })
        setTimeout(function () {
          that.setData({ isMatching: false, myHeadTranslate: 200, isPkTxt: false, thunderTranslate: 0, hisInfoTranslate: 0 })
          setTimeout(function () {
            that.setData({ isMynNickname: true })
            wx.vibrateLong({});
            setTimeout(function () {
              that.setData({ isLoading: false })
              that.animation()
           
            }, 1500)
          }, 100)
        }, 3000)
      }
    })
  },

  //倒计时
  countDown: function () {
    let that = this;
    if (that.data.isUnLoad) {
      return
    }
    let { count, question_guid, question, currentindex, my_time } = that.data;
    totalTime = setInterval(function () {
      count--;
      that.setData({ count });
      if (that.data.isOver && that.data.isPkOver) {
        clearInterval(totalTime);
        setTimeout(function () {
          that.setData({ opacityQuestionA: '0', opacityVoice: '0', scaleAnswer: '0', opacityAnswer: '0', isRight: 0, count: that.data.countIndex });
          that.nextWord();
        }, 1000)
        return;
      };
      if (count == 0) {  //0s切换下一题
        console.log('时间到了啊啊啊啊啊啊啊');
        clearInterval(totalTime);
        if (!that.data.isOver) {
          let parameter = {//提交答题信息（自己没有答题）
            question_guid: question_guid,
            uid: app.globalData.weixinUser.uid,
            poetry_id: question[currentindex].poetry_id,
            poetry_book_id: question[currentindex].poetry_book_id,
            question_id: question[currentindex].id,
            question_type: question[currentindex].question_type,
            answer_content: '',
            answer_duration: that.data.countIndex,
            is_right: 0,
            answer_mode: 3
          }
          console.log(parameter)
          poetryListService.saveAnswer(parameter).then(function (res) {
            console.log('saveAnswer', res)
          });
          my_time = my_time + that.data.countIndex;
          that.setData({ my_time })
        }
        // console.log('时间到', count);
        setTimeout(function () {//隐藏当前题
          that.setData({ opacityQuestionA: '0', opacityVoice: '0', scaleAnswer: '0', opacityAnswer: '0', isRight: 0 });
          that.nextWord();
        }, 1000)
      }
    }, 1000)

  },
  //下一题
  nextWord: function () {
    let that = this;
    if (that.data.isUnLoad) {
      return
    }
    let { currentindex, question, rank_score } = that.data;
    currentindex++;
    // console.log('currentindexAAAA', currentindex == question.length)
    if (currentindex >= question.length) {//本次pk完成 取数据
      clearInterval(timerAnswer);      //答题结束清除定时器
      that.setData({ opacityQuestionA: '0', opacityVoice: '0', scaleAnswer: '0', opacityAnswer: '0' });
      if (that.data.myGrade > that.data.pkGrade) {//我胜利
        if (rank_score < 1 && rank_score + 500 >= 1) {//判断是否升级
          that.setData({ isLevel: true, indexImg: 0 })
        } else if (rank_score < 1500 && rank_score + 500 >= 1500) {
          that.setData({ isLevel: true, indexImg: 1 })
        } else if (rank_score < 3000 && rank_score + 500 >= 3000) {
          that.setData({ isLevel: true, indexImg: 2 })
        } else if (rank_score < 4500 && rank_score + 500 >= 4500) {
          that.setData({ isLevel: true, indexImg: 3 })
        } else if (rank_score < 6500 && rank_score + 500 >= 6500) {
          that.setData({ isLevel: true, indexImg: 4 })
        } else if (rank_score < 8500 && rank_score + 500 >= 8500) {
          that.setData({ isLevel: true, indexImg: 5 })
        } else if (rank_score < 13000 && rank_score + 500 >= 13000) {
          that.setData({ isLevel: true, indexImg: 6 })
        } else {
          that.setData({ isLevel: false })
        }
        var myWin = 1;
        var pkWin = 0;
        setTimeout(function () {
          that.setData({ count: '胜利', showModal: true, transY: 0 });
          that.playSound("https://f3.5rs.me/upload/xcx_poetry/sound/victory.mp3");
        }, 600)
      } else if (that.data.myGrade < that.data.pkGrade) {//对方胜利
        var myWin = 0;
        var pkWin = 1;
        setTimeout(function () {
          that.setData({ count: '失败', showFailModal: true, transYFail: 0 });
          that.playSound("https://f3.5rs.me/upload/xcx_poetry/sound/fail.mp3");
        }, 600)
      } else {//平局
        var myWin = 2;
        var pkWin = 2;
        setTimeout(function () {
          that.setData({ count: '平局', showFailModal: true, isDraw: true });
          that.playSound("https://f3.5rs.me/upload/xcx_poetry/sound/victory.mp3");
        }, 600)
      };

      //结算
      let params = {
        owner: {
          uid: app.globalData.weixinUser.uid,
          question_guid: that.data.question_guid,
          answer_mode: 3,
          elapsed_time: that.data.my_time,
          reward_score: that.data.myAllReward,
          total_score: that.data.myGrade,
          right_count: that.data.myRightNumber,
          is_win: myWin
        },
        matcher: {
          uid: that.data.matcher.uid,
          question_guid: that.data.question_guid,
          answer_mode: 4,
          elapsed_time: that.data.pk_time,
          reward_score: that.data.pkAllReward,
          total_score: that.data.pkGrade,
          right_count: that.data.pkRightNumber,
          is_win: pkWin
        }
      }
      pkService.Clearing(params).then(function (res) {
        if (res.success) {
          console.log('结算', res)
        }
      })
      return
    }
    that.animation();
    setTimeout(function () {
      that.setData({ currentindex, isOver: false, isPkOver: false, isStarVoice: true, count: that.data.countIndex })
    }, 500)
  },
  //播放音效
  playSound: function (SoundURL) {
    let that = this;
    wx.playBackgroundAudio({
      dataUrl: SoundURL,
      title: '播放',
      success: function (res) {
      }
    })
  }, 
  //我方答题 
  answer: function (e) {
    let that = this;
    if (that.data.isUnLoad) {
      return
    }
    // console.log(app.globalData.weixinUserInfo.weixinUser.uid)
    let { index } = e.currentTarget.dataset;
    let { currentindex, question, isOver, question_guid, myGrade, reward_time_score, countIndex, answer_right_score, myRightNumber, my_time, myAllReward } = that.data;
    let answers = question[currentindex].answers;
    let is_right = answers[index].is_right;
    answers[index].checked = true;
    if (isOver) {
      return;
    }
    that.setData({ isOver: true, isRight: is_right })
    //应得分数
    var now_time = answer_duration;//答题所用时间
    if (now_time == 0) {
      now_time = 1
    }

    if (is_right == 1) {//回答正确
      that.playSound("https://f3.5rs.me/upload/xcx_poetry/sound/right.mp3");
      myRightNumber = myRightNumber + 1;
      console.log('myRightNumber', myRightNumber)
      myAllReward = (countIndex - now_time) * reward_time_score + myAllReward //我的总奖励分
      let myRightGrade = (countIndex - now_time) * reward_time_score + answer_right_score;//我的得分
      let allGra = myRightGrade + that.data.myGrade
      let difference = allGra - that.data.pkGrade;//双方分数差
      let a = difference / ((countIndex * reward_time_score + answer_right_score) * question.length * 2) * 100 + 50;//分数条偏移
      // console.log('wofang', difference,a)
      that.setData({ challenge: a, beChallenged: 100 - a, myRightNumber, myAllReward, RightGrade: myRightGrade })
      for (let i = 0; i < myRightGrade; i++) { //分数增加动画
        setTimeout(function () {
          let a = 0;
          a++;
          myGrade = myGrade + a;
          // that.data.myGrade =  that.data.myGrade 
          that.setData({ myGrade });
        }, i * 3)
      }
      that.setData({ question });
    } else { //回答错误
      //展示
      that.playSound("https://f3.5rs.me/upload/xcx_poetry/sound/wrong.mp3");
      that.setData({ question });
    }
    my_time = my_time + now_time;//我的答题总时间
    that.setData({ my_time })
    let parameter = {//提交答题信息
      question_guid: question_guid,
      uid: app.globalData.weixinUser.uid,
      poetry_id: question[currentindex].poetry_id,
      poetry_book_id: question[currentindex].poetry_book_id,
      question_id: question[currentindex].id,
      question_type: question[currentindex].question_type,
      answer_content: answers[index].answer,
      answer_duration: now_time,
      is_right: that.data.isRight,
      answer_mode: 3
    }
    // console.log(parameter)
    poetryListService.saveAnswer(parameter);


  },

  //对方答题
  pkAnswer: function () {
    let that = this;
    if (that.data.isUnLoad) {
      return
    }
    let { currentindex, question, isPkOver, isOver, question_guid, pkGrade, matcher, reward_time_score, countIndex, answer_right_score, pkRightNumber, pk_time, pkAllReward } = that.data;
    let time = Math.floor(Math.random() * that.data.countIndex + 1);
    // console.log(time)
    if (isPkOver) {
      return
    }
    setTimeout(function () {//对方随机时间答题
      that.setData({ isPkOver: true })
      let isClick = Math.round(Math.random());
      if (question[currentindex].matcher_answers[0].is_right) {
        if (that.data.isUnLoad) {
          return
        }
        pkRightNumber = pkRightNumber + 1
        //对方应得分数
        var now_time = answer_duration;//答题时间
        if (now_time == 0) {
          now_time = 1
        }
        pk_time = pk_time + now_time;
        pkAllReward = (countIndex - now_time) * reward_time_score + pkAllReward //对方总奖励分
        let pkRightGrade = (countIndex - now_time) * reward_time_score + answer_right_score;//对方得分
        let allGra = pkRightGrade + that.data.pkGrade
        let difference = that.data.myGrade - allGra;//双方分数差
        let a = difference / ((countIndex * reward_time_score + answer_right_score) * question.length * 2) * 100 + 50;//分数条偏移
        // console.log('difference',difference)
        that.setData({ challenge: a, beChallenged: 100 - a, pkRightNumber, pk_time, pkAllReward });
        for (let i = 0; i < pkRightGrade; i++) { //分数增加动画
          setTimeout(function () {
            let a = 0;
            a++;
            pkGrade = pkGrade + a;
            that.setData({ pkGrade });
          }, i * 3)
        };
        let parameter = {//提交答题信息
          question_guid: question_guid,
          uid: matcher.uid,
          poetry_id: question[currentindex].poetry_id,
          poetry_book_id: question[currentindex].poetry_book_id,
          question_id: question[currentindex].id,
          question_type: question[currentindex].question_type,
          answer_content: question[currentindex].matcher_answers[0].answer_content,
          answer_duration: now_time,
          is_right: question[currentindex].matcher_answers[0].is_right,
          answer_mode: 4
        }

        // console.log('对方答对', parameter)
        poetryListService.saveAnswer(parameter);
      } else {
        if (that.data.isUnLoad) {
          return
        }
        var n_time = answer_duration;
        if (n_time == 0) {
          n_time = 1
        }
        pk_time = pk_time + n_time;
        that.setData({ pk_time });
        let parameter = {//提交答题信息
          question_guid: question_guid,
          uid: matcher.uid,
          poetry_id: question[currentindex].poetry_id,
          poetry_book_id: question[currentindex].poetry_book_id,
          question_id: question[currentindex].id,
          question_type: question[currentindex].question_type,
          answer_content: question[currentindex].matcher_answers[0].answer_content,
          answer_duration: n_time,
          is_right: question[currentindex].matcher_answers[0].is_right,
          answer_mode: 4
        }
        // console.log('currentindexpkpkpk', currentindex)
        // console.log('对方答错', parameter)
        poetryListService.saveAnswer(parameter);
      }
    }, time * 1000)
  },



  // 录音
  soundRecording: function () {
    let that = this;
    const recorderManager = wx.getRecorderManager();
    let { isStarVoice, isOver } = that.data;
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    if (isStarVoice) {
      recorderManager.start(options);
      console.log('录音1')
    } else {
      recorderManager.stop(options)
      console.log('录音2');

    }
    if (isOver) {
      return;
    }

    that.setData({ isOver: true, isStarVoice: false })
    console.log('录音3')
    recorderManager.onStart(() => {
      console.log('recorder start');
    })
    recorderManager.onResume(() => {
      console.log('recorder resume');
    })
    recorderManager.onPause(() => {
      console.log('recorder pause');
    })
    recorderManager.onStop((res) => {
      console.log('recorder stop', res);
      const { tempFilePath } = res;
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res;
      console.log('frameBuffer.byteLength', frameBuffer.byteLength);
    })
    recorderManager.onError((res) => {
      console.log('recorder onError', res);
    })


  },
  //再来一局
  toAgain: function () {
    let that = this;
    console.log('aqwe');
    that.setData({
      count: 0,//答题时间(倒计时用)
      countIndex: 0,//答题时间(初始化用)
      challenge: 50,
      beChallenged: 50,
      question: [],//pk题目
      matcher: [],//pk对方信息
      currentindex: 0,
      isOver: false,//是否本题答题结束
      isPkOver: false,//对方是否答完
      isRight: 0,
      windowWidth: 0,
      progressWidth: 0,
      myRightNumber: 0,//自己回答对的题目数量
      pkRightNumber: 0,//对方答对次数
      isStarVoice: true, //是否开始录音
      myGrade: 0,//我的分数
      pkGrade: 0,//对方分数
      scale: '0',//第几题显示隐藏
      opacity: '0',//第几题显示隐藏
      opacityQuestionA: '0',//问题题目显示隐藏
      opacityVoice: '0',//录音组件显示隐藏
      scaleAnswer: '0',//答案显示隐藏
      opacityAnswer: '0',//答案显示隐藏
      showModal: false,//显示结果
      transY: -1500,
      showFailModal: false,
      transYFail: -1500,
      question_guid: 0,
      answer_right_score: 0,//答对奖励分
      reward_time_score: 0,//时间奖励分
      my_time: 0,//我的答题总时间
      pk_time: 0,//对方答题总时间
      myAllReward: 0,//我的总奖励分
      pkAllReward: 0,//对方总奖励分
      isLoading: true,//匹配动画
      isMatching: true,//匹配动画
      myHeadTranslate: 0,//匹配动画  匹配到人
      isPkTxt: true,//匹配动画 匹配到人
      thunderTranslate: -100,//准备pk的logo
      hisInfoTranslate: -150,//对方信息
      isMynNickname: false,//自己名字
      rank_score: 0,//我当前的分数
      isLevel: false,//是否升级
      indexImg: 0,//是否升级
      isUnLoad: false,//是否退出本页面
    })

    that.GetQuestions_PK(that.data.level);
    let question_guid = that.getGuid();
    that.setData({ question_guid });
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
    let that = this;
    console.log('onHide')
    clearInterval(totalTime);
    clearInterval(timerAnswer);
    clearTimeout(timeBeginPk)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this;
    console.log('onUnload')
    clearInterval(totalTime);
    clearInterval(timerAnswer);
    clearTimeout(timeBeginPk)
    timer = null;
    timerAnswer = null;
    answer_duration = 0;
    totalTime = null;
    that.setData({ isUnLoad: true })
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
    console.log(e)
    var title = '';
    var pageImg = '';
    var path = "";
    if (e.from == 'button') {
      path = "/pages/index/index";
    } else {
      path = "/pages/pk/pk";
    }
    return app.onShareAppMessage(title, pageImg, path, function (res) {
      console.log("转发成功", res)
      if (res.shareTickets) {
        let shareTickets = res.shareTickets[0]
        wx.getShareInfo({
          shareTicket: shareTickets,
          success: function (res) {
            console.log('iviviv',res)
            commonService.ShareWithPK(res.encryptedData, res.iv).then(function (res) {
              console.log(res)
            })
          },
        })
        // console.log("群", res.shareTickets[0]);

        // that.setData({ shareTickets: res.shareTickets });
      } else {
        console.log("不是群")
      }

    });
  }
})


