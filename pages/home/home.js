// pages/home/home.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        name: "最新",
        isActive: true,
      }, {
        id: 1,
        name: "热评",
        isActive: false,
      }, {
        id: 2,
        name: "精评",
        isActive: false,
      }
    ],
    swiper_image_1: 'cloud://uic-movie-8a508.7569-uic-movie-8a508-1257868822/uic-movie/1.jpg',
    swiper_image_2: 'cloud://uic-movie-8a508.7569-uic-movie-8a508-1257868822/uic-movie/2.jpg',
    swiper_image_3: 'cloud://uic-movie-8a508.7569-uic-movie-8a508-1257868822/uic-movie/3.jpg',
    swiper_image_4: 'cloud://uic-movie-8a508.7569-uic-movie-8a508-1257868822/uic-movie/4.jpg',
    userInfo: app.globalData.userInfo,
    user_image:'../../icons/person.png',
    comment_array:[],
    comment_time_num: null
  },
  /**
   * 父组件的自定义事件，用来接收来自子组件的数据
   */
  handleItemChange(e){
    const index=e.detail.index;
    let tabs=this.data.tabs;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);//遍历整个数组，i是index表示数组中的位置，v是index所对应的值
    this.setData({
      tabs:tabs //这里相当于把从父组件拿到的数据拷贝了一份到自己的data里，导致有两份不一样的数据，需要把数据发送回给父组件，更新父组件的数据
    })
    if(this.data.tabs[0].isActive == true){
      this.display_comment_time()
    }
    else if (this.data.tabs[1].isActive == true){
      this.display_comment_like_num()
    }
    else if(this.data.tabs[2].isActive == true){
      this.display_comment_score()
    }
  },
  /**
   * 按时间排列得到comment_array
   */
  display_comment_time(){
    const db = wx.cloud.database().collection("comment")
    db.orderBy('comment_time_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          comment_array: res.data
        })
      })
  },
  /**
   * 按点赞数排列得到comment_array
   */
  display_comment_like_num() {
    const db = wx.cloud.database().collection("comment")
    db.orderBy('like_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          comment_array: res.data
        })
      })
  },
  /**
   * 按comment字数排列得到comment_array
   */
  display_comment_score() {
    const db = wx.cloud.database().collection("comment")
    db.orderBy('movie_comment_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          comment_array: res.data
        })
      })
  },
  /**
   * 带参数跳转到movie的detail页
   */
  goto_detail(e){
    var index = e.currentTarget.dataset.index //从前端传回来的index，知道用户选择了第几个comment
    var comment_detail = this.data.comment_array[index] //找到index对应的comment
    //console.log(comment_detail)
    var comment_detail_string = encodeURIComponent(JSON.stringify(comment_detail.movie_time_num)) //把comment这个object双重解码成string
    wx.navigateTo({
      url: '../movie/detail/detail?movie_detail=' + comment_detail_string
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.display_comment_time()
    this.setData({
      tabs: [
        {
          id: 0,
          name: "最新",
          isActive: true,
        }, {
          id: 1,
          name: "热评",
          isActive: false,
        }, {
          id: 2,
          name: "精评",
          isActive: false,
        }
      ]
    })
  }
})