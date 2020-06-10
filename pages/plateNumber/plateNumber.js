// pages/plateNumber/plateNumber.js
const app=new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//右侧弹出层
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
    var that=this
    // 获取列表信息
    wx.showLoading({
      title: "正在加载",
      mask: true
    })
    wx.request({
      url: app.globalData.url + "car_cagegory",
      header: { "token": wx.getStorageSync('token') },
      method: "POST",
      success(res) {
        if(res.data.data.length==0){
          wx.hideLoading()
          wx.showToast({
            title: err.data.msg,
            icon: 'none',
            duration: 2000
          })
        }else{
          // console.log(res)
          that.setData({
            allData:res.data.data,//列表数据
            allTopData:res.data.car_common//顶部数据
          })
          wx.hideLoading()
          // console.log(that.data.allData)
        }
      },
      fail(err){
        wx.hideLoading()
        wx.showToast({
          title: err.data.msg,
          icon: 'none',
          duration: 2000
        })
      },
    })
  },
  // 打开或关闭弹出层
  showPopup(e){
    var that=this
    if(e.currentTarget.dataset.item){
      var bid=e.currentTarget.dataset.item.bid//id
      that.setData({
        imageOnly:e.currentTarget.dataset.item.brand_logo
      })
      wx.request({
        url: app.globalData.url + "car_type",
        header: { "token": wx.getStorageSync('token') },
        method: "POST",
        data:{bid},
        success(res) {
          // console.log(res)
          // 请求的数据展示
          if(res.data.code==200){
            that.setData({
              insideData:res.data.data
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail(err){
          wx.showToast({
            title: err.data.msg,
            icon: 'none',
            duration: 2000
          })
        },
      })
    }
    that.setData({
      show:!that.data.show,
    })
  },
  // 选择车型进行跳转
  toBlack(e){
    var item=e.currentTarget.dataset.item
    wx.setStorageSync('carType', item)
    wx.navigateBack({
      delta: 1
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