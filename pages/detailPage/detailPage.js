// pages/detailPage/detailPage.js
const app=new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  postOrder(){
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail',
    })
  },
  onLoad: function (options) {
    console.log(123456)
    var that=this
    // 获取服务信息
    wx.request({
      url: app.globalData.url+'service_detail',
      data: {
          id: wx.getStorageSync('fuwuId'),
          lat: wx.getStorageSync("lat"),
          lon: wx.getStorageSync("lon")
      },
      success: function (res) {
          that.setData({
              bannerList: res.data.data.images,
              allAfter:res.data.data,
              // category: res.data.data.category
          })
      }
    })    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})