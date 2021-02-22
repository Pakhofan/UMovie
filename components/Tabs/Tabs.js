// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   * (存放父向子传递的数据)
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e){
      const index=e.currentTarget.dataset.index;
      //this.triggerEvent("父组件自定义事件的名称",{要传递的参数})
      this.triggerEvent("itemChange",{index});
      //let tabs=this.data.tabs;
      //tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);//遍历整个数组，i是index表示数组中的位置，v是index所对应的值
      //this.setData({
        //tabs:tabs 这里相当于把从父组件拿到的数据拷贝了一份到自己的data里，导致有两份不一样的数据，需要把数据发送回给父组件，更新父组件的数据
      //})
    }
  }
})
