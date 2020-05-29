// pages/recruit/recruit.js
const app=new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,//同意书
    isMy:true,//注册成为小哥
    name:"",//姓名
    phone:"",//手机号
    code:"",//验证码
    text:"获取验证码",//获取验证码
    lock:true,//判断是否可以重新获取
    countdown:60,//60秒
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  // 注册会员
  zhuce(){
    var that=this
    if(that.data.checked){
      that.setData({
        isMy:false,
      })      
    }
  },
  // 关闭弹窗
  onClose(){
    this.setData({
      isMy:true
    })
  },
  // 获取用户名
  getName(e){
    this.setData({
      name:e.detail.value
    })
  },
  // 获取手机号
  getPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  // 验证码
  getCode(e){
    this.setData({
      code:e.detail.value
    })
  },
  // 确认提交
  subFinish(){
    var that=this
    if(that.data.name==""){
      wx.showToast({
        title: "请输入姓名",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(that.data.phone==""){
      wx.showToast({
        title: "请输入电话",
        icon: 'none',
        duration: 2000
      })
      return
    }else{
      if(!(/^1[3456789]\d{9}$/.test(that.data.phone))){
        wx.showToast({
          title: "手机格式不正确",
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    if(that.data.code==""){
      wx.showToast({
        title: "请输入验证码",
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      url: app.globalData.url+"add_work",
      header:{ "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        phone: that.data.phone,
        name:that.data.name,
        code:that.data.code
      },
      success(res){
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        if(res.data.code===200){
          wx.switchTab({
            url: '/pages/entrance/entrance',
          })
        }
      },
      fail(error){
        console.log(error)
      }
    })
  },
  // 获取验证码
  toCode(){
    var that=this
    // 如果lock为true则可以再次获取验证码
    if((/^1[3456789]\d{9}$/.test(that.data.phone))){
      if(that.data.lock){
        wx.request({
          url: app.globalData.url+"work_code",
          header:{ "token": wx.getStorageSync('token') },
          method: "POST",
          data: {
            phone: that.data.phone
          },
          success(res){
            console.log(res)
            if(res.data.code===1){
              that.setData({
                lock:false
              })
              that.settime()
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail(error){
            console.log(error)
          },
        })
      }
    }else{
      wx.showToast({
        title: "手机格式不正确",
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 验证码倒计时
  settime() {
    var that=this
    if (that.data.countdown == 0) {
      that.setData({
        text:"获取验证码",
        countdown:60,
        lock:true
      })
      return;
    } else {
      var min=that.data.countdown
      min--
      that.setData({
        text:min+"秒后重新发送",
        countdown:min
      })
    }
    setTimeout(function() {that.settime() },1000);//设置定时任务，1000毫秒为1秒
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