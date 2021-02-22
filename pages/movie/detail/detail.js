// pages/movie/detail/detail.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tran_movie_time:null,
    movie_detail: null,
    movie_image_test: '../../../images/more/movie-test.jpg',
    ellipsis: true, // 文字是否收起，默认收起
    ellipsis_comment: true, // 文字是否收起，默认收起
    showModalStatus: false, //下方弹起状态，默认不弹起
    animationData: '',
    array: [1, 2, 3, 4, 5,],
    index: 0, //下拉栏选择的index
    limited_num: 800, //详细地址的字数限制
    input_num: 0,//输入的字数
    comment_detail: [],
    comment_time_num: null,
    comment_array: [],
    temporary_like_num: 0,
    temporary_isLike: null
  },
  /**
   * 电影信息的收起/展开按钮点击事件
   */
  ellipsis() {
    let value = !this.data.ellipsis;
    this.setData({
      ellipsis: value
    })
  },
  /**
   * 获取用户的openid
   */
  get_openid() {
    wx.cloud.callFunction({
      name: "get_openid",
      success(res) {
        app.globalData.user_openid = res.result.openid
      }
    })
  },
  /**
   * picker选择器
   */
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 下方弹起
   */
  showModal: function () {
    this.get_openid() //先获得用户的opedid
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false,
    })
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
   * 显示上传成功
   */
  success_send() {
    wx.showToast({
      title: '上传成功',
      icon: 'success',
      duration: 2000
    })
  },
  /**
   * 显示请先登录
   */
  login_send() {
    wx.showToast({
      title: '请先登录',
      image: '../../../icons/me_active.png',
      duration: 2000
    })
  },
  /**
   * 提交表单的按钮
   */
  formSubmit(e) {
    if (app.globalData.userInfo==null){
      this.login_send()
    }
    else{
      this.success_send()
      this.setData({
        comment_detail: e.detail.value
      })
      this.comment_add()
      this.movie_update()
      wx.switchTab({
        url: '../../home/home', //上传成功，跳转到home页
      })
    }
  },
  /**
   * 根据传进来movie_time找到整个movie的数据
   */
  movie_get(){
    const db = wx.cloud.database().collection("movie")
    db.where({
      movie_time_num: this.data.tran_movie_time
    })
      .get()
      .then(res =>{
        this.setData({
          movie_detail: res.data[0]
        })
      })
  },
  /**
   * 根据传进来movie_time得到comment_array，评论数组
   */
  comment_get() {
    const db = wx.cloud.database().collection("comment")
    db.where({
      movie_time_num: this.data.tran_movie_time
    })
      .orderBy('like_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          comment_array: res.data
        })
      })
  },
  /**
   * 往comment数据库add数据
   */
  comment_add(){
    const db = wx.cloud.database().collection("comment")
    db.add({
      data: {
        movie_name: this.data.movie_detail.movie_name,
        movie_time_num: this.data.movie_detail.movie_time_num,
        movie_comment: this.data.comment_detail.comment,
        movie_comment_num: this.data.input_num,
        score: this.data.array[Number(this.data.comment_detail.score_index)],
        user_image: app.globalData.userInfo.avatarUrl,
        user_nickName: app.globalData.userInfo.nickName,
        comment_time_num: this.data.comment_time_num,
        user_openid: app.globalData.user_openid,
        like_num: 0,
        hasChange: false,
        ellipsis_comment: true
      }
    })
  },
  /**
   * add完后，更新movie数据库里的数据
   */
  movie_update(){
    wx.cloud.callFunction({
      name: 'movie_update',
      data:({
        critic_num: this.data.movie_detail.critic_num,
        movie_score: this.data.movie_detail.movie_score,
        score: this.data.array[Number(this.data.comment_detail.score_index)],
        movie_time_num: this.data.movie_detail.movie_time_num
      })
    })
  },
  /**
   * 得到当前时间
   */
  get_time() {
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time_num = Date.now();
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      comment_time_num: time_num
    })
  },
  /**
   * 评论信息的收起/展开按钮点击事件
   */
  ellipsis_comment(e) {
    var index = e.currentTarget.dataset.curindex
    var value = this.data.comment_array[index].ellipsis_comment
    this.data.comment_array[index].ellipsis_comment = !value
    this.setData({
      comment_array: this.data.comment_array
    })
    wx.cloud.callFunction({
      name: 'extract_comment',
      data: ({
        comment_time_num: this.data.comment_array[index].comment_time_num,
        value: true
      })
    })
  },
  /**
   * 点赞功能
   */
  praiseThis: function (e) {
    var index = e.currentTarget.dataset.curindex
    var like_num = this.data.comment_array[index].like_num
    var is_Like = this.data.comment_array[index].hasChange
    if (is_Like) {
      this.data.comment_array[index].like_num = (like_num - 1);
      this.data.comment_array[index].hasChange = false;
    } else {
      this.data.comment_array[index].like_num = (like_num + 1);
      this.data.comment_array[index].hasChange = true;
    }
    this.setData({
      comment_array: this.data.comment_array
    })
    wx.cloud.callFunction({
      name: 'like_num_update',
      data: ({
        comment_time_num: this.data.comment_array[index].comment_time_num,
        hasChange: false,
        like_num: this.data.comment_array[index].like_num
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var temporary1 = decodeURIComponent(options.movie_detail) //第一次解码
    var temporary2 = JSON.parse(temporary1) //第二次解码
    this.setData({
      tran_movie_time: temporary2 //接收到来自movie页面的string数据movie_detail，把它双重解码成object，并让movie_detail等于它
    })
    this.movie_get()
    this.comment_get()
    this.get_time()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
})