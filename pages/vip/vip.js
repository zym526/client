// pages/vip/vip.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 获取会员类型
    wx.request({
      url: app.globalData.url + "vip_type",
      header: { "token": wx.getStorageSync('token') },
      method: "POST",
      success: function (res) {
        var data=res.data.data
        that.setData({
          allData:data,
          vipId:data[0].id,//第一个会员id
        })
      },
      fail(error){
        // console.log(error)
      }
    })
  },
  // 选中会员
  thisVipId(e){
    var that=this
    var id = e.currentTarget.dataset.id
    that.setData({
      vipId:id
    })
  },
  // 开通vip
  buyVip(){
    var that=this
    // 购买会员请求
    wx.request({
      url: app.globalData.url + "buyvip",
      header: { "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        uid:wx.getStorageSync('uid'),
        vid:that.data.vipId
      },
      success(res){
        // console.log(res)
        // 发起支付请求
        if(res.data.message==='Successful'){
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function (resage) {
              // console.log(resage)
              if (resage.errMsg == "requestPayment:ok") {
                // console.log("支付成功")
                // 发起回调
                wx.request({
                  url: app.globalData.url + "wxcallbackforvip",
                  header: { "token": wx.getStorageSync('token') },
                  method: "POST",
                  data: {
                    order_sn: res.data.data.order_sn
                  },
                  success(res){
                    // console.log(res)
                  },
                  fail(error){
                    // console.log(error)
                  },
                })
                wx.switchTab({
                  url: '/pages/personal/personal',
                })
              } else {
                wx.showToast({
                  title: "支付失败",
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (error) {
              wx.hideLoading()
              if (error.errMsg == "requestPayment:fail cancel") {
                wx.showToast({
                  title: "取消支付",
                  icon: 'none',
                  duration: 2000
                })
                // var timer = setTimeout(function () {
                //   wx.redirectTo({
                //     url: '../orderList/orderList',
                //   })
                // }, 1000);
              }
            }
          })
        }
      },
      fail(error){
        // console.log(error)
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