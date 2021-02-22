// pages/me/my_movie/my_movie.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movie_array:[],
    movie_image: '../../../images/more/movie-test.jpg'
  },
  /**
   * 查询数据库：我的作品
   */
  display_my_movie() {
    const db = wx.cloud.database().collection('movie')
      .where({
        user_openid: app.globalData.user_openid
      })
      .orderBy('movie_time_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          movie_array: res.data,
        })
      })
  },
  /**
   * 跳转到用户选择的movie
   */
  goto_detail(e) {
    var index = e.currentTarget.dataset.index //从前端传回来的index，知道用户选择了第几个movie
    var movie_detail = this.data.movie_array[index] //找到index对应的movie
    this.setData({
      movie_detail_string: encodeURIComponent(JSON.stringify(movie_detail.movie_time_num)) //把movie这个object双重解码成string
    })
    wx.navigateTo({
      url: '../../movie/detail/detail?movie_detail=' + this.data.movie_detail_string, //带参数跳转到detail页
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.display_my_movie()
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