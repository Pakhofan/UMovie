//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: app.globalData.userInfo
  },
  goto_home: function(e) {
    //得到用户信息
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.get_openid() //调用在下面的get_openid函数
    //跳转到home页面
    wx.switchTab({
      url: '/pages/home/home',
    });
  },
  /**
   * 获取用户的openid
   */
  get_openid(){
    wx.cloud.callFunction({
      name: "get_openid",
      success(res){
        app.globalData.user_openid = res.result.openid
      }
    })
  },
  onLoad: function() {

  },
  onShow: function() {

  },
  onReady: function() {
    var that = this;
    setTimeout(function() {
      that.setData({
        remind: ''
      });
    }, 500);
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }
});