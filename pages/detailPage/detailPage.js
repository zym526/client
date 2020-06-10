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
    wx.removeStorageSync('defaultCar')
    app.globalData.defaultCar=""
    app.globalData.defaultAddress=""
    app.globalData.userChooseTime=""
    app.globalData.radio=this.data.all.id
    app.globalData.youhuiId=""
    app.globalData.youhuiType=""
    app.globalData.getInputValue=""
    app.globalData.washTitle=this.data.all.name
    app.globalData.washList=1
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail',
    })
  },
  onLoad: function (options) {
    var that=this
    that.setData({
      all:JSON.parse(options.all)
    })
    // 获取服务信息
    wx.request({
      url: app.globalData.url+'service_detail',
      data: {
          id: that.data.all.id,
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