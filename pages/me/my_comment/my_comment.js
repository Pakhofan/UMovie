// pages/me/my_comment/my_comment.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    comment_array: []
  },
  /**
   * 查询数据库：我的评论
   */
  display_my_comment() {
    const db = wx.cloud.database().collection('comment')
      .where({
        user_openid: app.globalData.user_openid
      })
      .orderBy('comment_time_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          comment_array: res.data,
        })
      })
  },
  /**
   * 带参数跳转到movie的detail页
   */
  goto_detail(e) {
    var index = e.currentTarget.dataset.index //从前端传回来的index，知道用户选择了第几个comment
    var comment_detail = this.data.comment_array[index] //找到index对应的comment
    var comment_detail_string = encodeURIComponent(JSON.stringify(comment_detail.movie_time_num)) //把comment这个object双重解码成string
    wx.navigateTo({
      url: '../../movie/detail/detail?movie_detail=' + comment_detail_string
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.display_my_comment()
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