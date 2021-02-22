// pages/me/upload/upload.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time_string: null,
    time_num: null,
    openid: null,
    limited_num: 800, //详细地址的字数限制
    input_num: 0,//输入的字数
    temporary_movie_form: null, //实时知道用户选择的影片形式
    temporary_image_path: null,
    file_id: '',
    movie_information: null
  },
  /**
   * 实时显示输入的字数
   */
  input(event) {
    var value = event.detail.value,
      len = parseInt(value.length);
    this.setData({
      input_num: len
    })
  },
  /**
   * 实时知道影片形式
   */
  get_movie_form1(e){
    this.setData({
      temporary_movie_form: e.target.id
    })
  },
  get_movie_form2(e) {
    this.setData({
      temporary_movie_form: e.target.id
    })
  },
  /*
  *把全局变量的user_openid更新到本地
  */
  update_openid(){
    this.setData({
      openid: app.globalData.user_openid
    })
  },
  /**
   * 上传图片到云库
   */
  choose_image(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          temporary_image_path: res.tempFilePaths
        })
        that.upload_image(res.tempFilePaths[0])
      }
    })
  },
  upload_image(tem_path){
    const promise = new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: 'uic-movie/' + this.data.time_num + '.png',
        filePath: tem_path, // choose_image中的临时文件路径
        success: res => {
          resolve(res)//上面的函数执行成功时，会把进行中改变成已成功，跳到下一步then
        },
        fail: err => {
          reject(err)//上面的函数执行失败时，会把进行中改变成已失败，跳到下一步err
        }
      })
    })
    promise.then(res => { //成功时候的then
      this.setData({
        file_id: res.fileID
      })
    }, err => { //失败时候的err
      cosole.log("fail", err)
    })
  },
  /**
   * 往movie数据库add信息
   */
  add_data(){
    const db = wx.cloud.database().collection("movie")
    db.add({
      data: {
        critic_num: 0,
        description: this.data.movie_information.movie_description,
        movie_form: this.data.movie_information.movie_form,
        movie_image: this.data.file_id,
        movie_name: this.data.movie_information.movie_name,
        movie_score: 0,
        movie_time_num: this.data.time_num,
        movie_time_string: this.data.time_string,
        movie_type: this.data.movie_information.movie_type,
        other_information: '',
        source_link: this.data.movie_information.source_link,
        team_name: this.data.movie_information.team_name,
        user_openid: app.globalData.user_openid,
        user_image: app.globalData.userInfo.avatarUrl,
        user_user_nickName: app.globalData.userInfo.nickName,
        year: this.data.movie_information.year
      }
    })
  },
  /**
   * 显示上传成功
   */
  success_send() {
    wx.showToast({
      title: '上传成功',
      icon: 'success',
      duration: 1500
    })
  },
  /**
   * 提交表单的按钮
   */
  formSubmit(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.success_send()
    this.setData({
      movie_information: e.detail.value
    })
    this.update_openid()//this.get_openid() //测试完记得删，替换为this.update_openid()
    this.add_data()
    wx.switchTab({
      url: '../../movie/movie', //上传成功，跳转到movie页
    })
  },
  /**
   * 测试的时候用，写完这一页记得删!!!!!!!!!!!!!!!!!!!!!!!!
   */
  get_openid() {
    //在异步操作时，会导致有些值传不出去。用封装promise.then的方法可以使异步变成同步，解决问题。类似于if-then函数，promise运行中有三个状态,pending 进行中,fulfilled 已成功,rejected 已失败
    const promise = new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: "get_openid",
        success: res => {
          resolve(res)//上面的函数执行成功时，会把进行中改变成已成功，跳到下一步then
        },
        fail: err => {
          reject(err)//上面的函数执行失败时，会把进行中改变成已失败，跳到下一步err
        }
      })
    })
    promise.then(res => { //成功时候的then
      app.globalData.user_openid = res.result.openid
      this.setData({
        openid: app.globalData.user_openid
      })
    }, err => { //失败时候的err
      cosole.log("fail", err)
    })
  },
  /**
   * 得到当前时间
   */
  get_time(){
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time_string = util.formatTime(new Date());
    var time_num = Date.now();
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      time_string: time_string,
      time_num: time_num
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_time()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})