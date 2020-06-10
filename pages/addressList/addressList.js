// pages/addressList/addressList.js
const app=new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,//暂无数据界面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // type为1时,从订单页面过来,需带数据回去,为0时从设置页面过来
    if(options.type==1){
      that.setData({
        type:1
      })
    }else{
      that.setData({
        type: 0
      })
    }
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
    // 获取地址列表
    wx.request({
      url: app.globalData.url + "my_address",
      header: { "token": wx.getStorageSync('token') },
      method: "POST",
      data:{
        uid:wx.getStorageSync('uid')
      },
      success(res) {
        // 204的时候没有数据
        if(res.data.code==204){
          that.setData({
            isShow:false
          })
        // 200的时候有数据
        }else if(res.data.code==200){
          that.setData({
            isShow:true,
            allAddress:res.data.data
          })
        }else{
          app.showToast(res.data.msg)
        }
      },
      fail(err){
        app.showToast(err.data.msg)
      }
    })
  },
  // 跳转添加/编辑地址页面
  toAddAddress(e){
    var type=e.currentTarget.dataset.type
    var item=JSON.stringify(e.currentTarget.dataset.item)
    wx.removeStorageSync('addressText')//清除选择的地址
    wx.redirectTo({
      url: '/pages/addAddress/addAddress?type='+type+'&item='+item,
    })
  },
  // 选择地址跳转到下单页面
  toGoodsDetail(e){
    // 如果为1从订单页面过来则带数据回去
    var that=this
    // if(that.data.type==1){
    //   app.globalData.defaultAddress = e.currentTarget.dataset.item
    //   wx.redirectTo({
    //     url: '/pages/goodsDetail/goodsDetail',
    //   })
    // }
    if(app.globalData.goodsDetailNow==1){
      app.globalData.defaultAddress = e.currentTarget.dataset.item
      wx.redirectTo({
        url: '/pages/goodsDetail/goodsDetail',
      })
    }
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