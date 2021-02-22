// pages/movie/movie.js
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
        name: "高分",
        isActive: false,
      }, {
        id: 2,
        name: "热门",
        isActive: false,
      }, {
        id: 3,
        name: "分类",
        isActive: false,
      }
    ],
    movie_array: [],
    movie_detail_string: '',
    movie_image: '../../images/more/movie-test.jpg',
    multiArray: [['纪录片', '故事片'], ['人物/事物', '文化/手艺', '历史/事件']],//分类页面的picker框
    multiIndex: [0, 0] //分类页面picker框的index
  },

  /**
   * 父组件的自定义事件，用来接收来自子组件的数据
   */
  handleItemChange(e) {
    const index = e.detail.index;
    let tabs = this.data.tabs;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);//遍历整个数组，i是index表示数组中的位置，v是index所对应的值
    this.setData({
      tabs: tabs //这里相当于把从父组件拿到的数据拷贝了一份到自己的data里，导致有两份不一样的数据，需要把数据发送回给父组件，更新父组件的数据
    })
    if (this.data.tabs[0].isActive == true) { //tab页为最新时
      this.display_time()
    }
    else if (this.data.tabs[1].isActive == true) { //tab页为高分时
      this.display_score()
    }
    else if (this.data.tabs[2].isActive == true) { //tab页为热门时
      this.display_critic_num()
    }
  },
  /**
   * 跳转到用户选择的movie
   */
  goto_detail(e){
    var index = e.currentTarget.dataset.index //从前端传回来的index，知道用户选择了第几个movie
    var movie_detail = this.data.movie_array[index] //找到index对应的movie
    this.setData({
      movie_detail_string: encodeURIComponent(JSON.stringify(movie_detail.movie_time_num)) //把movie这个object双重解码成string
    })
    wx.navigateTo({
      url: 'detail/detail?movie_detail=' + this.data.movie_detail_string, //带参数跳转到detail页
    })
  },
  /**
   * 查询数据库：最新电影
   */
  display_time(){
    const db = wx.cloud.database();
    db.collection('movie').orderBy('movie_time_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          movie_array: res.data,
        })
      })
  },
  /**
   * 查询数据库：高分电影
   */
  display_score() {
    const db = wx.cloud.database();
    db.collection('movie').orderBy('movie_score', 'desc')
      .get()
      .then(res => {
        this.setData({
          movie_array: res.data,
          //movie_array_string: JSON.stringify(res.data)
        })
      })
  },
  /**
   * 查询数据库：热门电影
   */
  display_critic_num() {
    const db = wx.cloud.database();
    db.collection('movie').orderBy('critic_num', 'desc')
      .get()
      .then(res => {
        this.setData({
          movie_array: res.data,
          //movie_array_string: JSON.stringify(res.data)
        })
      })
  },
  /**
   * 分类页面的picker框
   */
  bindMultiPickerColumnChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['人物/事物', '文化/手艺', '历史/事件'];
            break;
          case 1:
            data.multiArray[1] = ['剧情', '喜剧', '战争', '科幻', '悬疑', '爱情', '历史', '动作', '动画'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },
  bindMultiPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    //console.log(this.data.multiArray[0][this.data.multiIndex[0]])
    console.log(this.data.multiArray[1][this.data.multiIndex[1]])
    const db = wx.cloud.database().collection('movie')
      .where({
        movie_type: this.data.multiArray[1][this.data.multiIndex[1]]
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.display_time() //一开始先显示最新电影
    this.setData({
      tabs: [
        {
          id: 0,
          name: "最新",
          isActive: true,
        }, {
          id: 1,
          name: "高分",
          isActive: false,
        }, {
          id: 2,
          name: "热门",
          isActive: false,
        }, {
          id: 3,
          name: "分类",
          isActive: false,
        }
      ]
    })
  }
})