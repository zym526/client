// personal/pages/integral/integral.js
const app=new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 前往积分列表
  toIntegral(){
    wx.navigateTo({
      url: '/pages/particulars/particulars?title=1',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    wx.request({
      url: app.globalData.url + 'getuserdate',
      header: {
        "token": wx.getStorageSync("token")
      },
      data: {
        uid: wx.getStorageSync('uid')
      },
      success(res) {
        // console.log(res)
        if (res.data.code === 200) {
          that.setData({
            integral: parseInt(res.data.data.integral)
          })
        }
      },
      fail(error) {
        // console.log(error)
      }
    })
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