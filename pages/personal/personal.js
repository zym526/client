// pages/personal/personal.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHeaderShow:true,//是否显示登录后的头部信息
    isVip:false,//是否是vip
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // 将手机号进行*号处理
    if(wx.getStorageSync('chooseUser_phone')&&wx.getStorageSync('userInfo')){
      that.setData({
        item:{
          "avatarUrl":wx.getStorageSync('userInfo').avatarUrl,
          "chooseUser_phone":wx.getStorageSync('chooseUser_phone').replace(/^(.{3})(?:\d+)(.{4})$/,  "\$1****\$2")
        }
      })
    }
  },
  // 进入登录页面
  toLogin: function(){
    wx.navigateTo({
      url: '/pages/user/login/login',
    })
  },
  // 跳转到优惠券页面
  toLookYhq() {
    var that = this
    // 判断是否登录,登录跳转优惠券页面
    if (wx.getStorageSync('chooseUser_phone') && wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/discounts/discounts?newText=服务卡',
      })
    // 未登录跳转登录页面
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  // 跳转积分页面
  toLookJF(){
    var that = this
    // 判断是否登录,登录跳转积分页面
    if (wx.getStorageSync('chooseUser_phone') && wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/integral/integral',
      })
    // 未登录跳转登录页面
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  // 跳转至vip开通界面
  toVipChange(){
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },
  // 进入全部订单页面
  toAllOrder(){
    wx.switchTab({
      url: '/pages/orderList/orderList',
    })
  },
  // 拨打客服电话
  toTel(){
    console.log(123)
    wx.makePhoneCall({
      phoneNumber: '4000060808' //仅为示例，并非真实的电话号码
    })
  },
  // 跳转钱包页面
  toWallet(){
    var that = this
    // 判断是否登录,登录跳转优惠券页面
    if (wx.getStorageSync('chooseUser_phone') && wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
    // 未登录跳转登录页面
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    } 
  },
  // 跳转设置页面
  toSetting(){
    // 判断是否登录,登录跳转优惠券页面
    if (wx.getStorageSync('chooseUser_phone') && wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
    // 未登录跳转登录页面
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
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
    // 每次进来判断是否登录，显示隐藏头部信息
    if(wx.getStorageSync('chooseUser_phone')&&wx.getStorageSync('userInfo')){
      that.setData({
        isHeaderShow:false,
        item:{
          "avatarUrl":wx.getStorageSync('userInfo').avatarUrl,
          "chooseUser_phone":wx.getStorageSync('chooseUser_phone').replace(/^(.{3})(?:\d+)(.{4})$/,  "\$1****\$2")
        }
      })
      // 发起请求获取用户信息
      if(app.globalData.isVip&&app.globalData.isVip!==""){
        that.setData({
          isVip:app.globalData.isVip
        })
      }else{
        wx.request({
          url: app.globalData.url + 'load_person_info',
          header: {
            "token": wx.getStorageSync("token")
          },
          success(res){
            console.log(res)
            // 如果vip返回为1则为vip，0为非vip 
            if(res.data.data.vip===1){
              app.globalData.isVip=false
              that.setData({
                isVip:false
              })
            }else{
              app.globalData.isVip=true
              that.setData({
                isVip:true
              })
            }
          },
          fail(error){
            console.log(error)
          }
        })
      }
      // 发起首页详情请求
      wx.request({
        url: app.globalData.url + 'getuserdate',
        header: {
          "token": wx.getStorageSync("token")
        },
        data:{
          uid:wx.getStorageSync('uid')
        },
        success(res){
          console.log(res)
          if(res.data.code===200){
            res.data.data.integral=parseInt(res.data.data.integral)
            that.setData({
              getuserdate:res.data.data
            })
          }
        },
        fail(error){
          console.log(error)
        }
      })
    }else{
      that.setData({
        isHeaderShow:true
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