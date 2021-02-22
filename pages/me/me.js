// pages/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_image:"../../icons/person.png",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
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
   * 显示请先登录
   */
  login_send() {
    wx.showToast({
      title: '请先登录',
      image: '../../icons/me_active.png',
      duration: 2000
    })
  },
  /**
   * 如果没有用户信息，则显示先登录
   */
  goto_upload(){
    if (app.globalData.userInfo==null){
      this.login_send()
    }
    else{
      this.get_openid()
      wx.navigateTo({
        url: 'upload/upload',
      })
    }
  },
  /**
   * 如果已经得到了用户信息，则显示头像
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    this.get_openid() //调用在下面的get_openid函数
  },
  //获取用户的openid
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
      //console.log("app", app.globalData.user_openid)
    }, err => { //失败时候的err
      cosole.log("fail", err)
    })
  }
})