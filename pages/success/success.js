// pages/success/success.js
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  goBack : function (){
    wx.switchTab({
      url: '/pages/entrance/entrance',
    })
  },
  goOrder:function(){
    wx.switchTab({
      url: '/pages/orderList/orderList',
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
