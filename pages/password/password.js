const app=new getApp()
// pages/password/password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",//手机号
    text:"获取验证码",//获取验证码
    lock:true,//判断是否可以重新获取
    countdown:60,//60秒
  },


  // 监听input框
  passwordCode(e){//验证码
    var that=this
    that.setData({
      code:e.detail.value
    })
  },
  passwordNew(e){
    var that=this
    that.setData({
      password:e.detail.value
    })
  },
  passwordNewTwo(e){
    var that=this
    console.log(e)
    that.setData({
      passwordTwo:e.detail.value
    })
  },

  // 获取验证码
  getCode(){
    var that=this
    // 如果lock为true则可以再次获取验证码
    if(that.data.lock){
      wx.request({
        url: app.globalData.url+"send_sms",
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          phone: wx.getStorageSync('chooseUser_phone')
        },
        success(res){
          console.log(res)
          if(res.data.code===200){
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
      console.log(that.data.countdown,that.data.text)
    }
    setTimeout(function() {that.settime() },1000);//设置定时任务，1000毫秒为1秒
  },

  // 提交密码
  toSubmit(){
    var that=this
    // 判断验证码
    if(!that.data.code||that.data.code.length===0){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return
    } 
    // 判断密码
    if(!that.data.password||that.data.password.length<6){
      if(!that.data.password||that.data.password.length===0){
        wx.showToast({
          title: '请输入密码',
          icon: 'none',
          duration: 2000
        })
        return
      }else{
        wx.showToast({
          title: '请输入六位密码',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    // 判断确认密码
    if(!that.data.passwordTwo||that.data.passwordTwo.length===0){
      wx.showToast({
        title: '请输入确认密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 判断输入密码是否一致
    if(that.data.password!==that.data.passwordTwo){
      wx.showToast({
        title: '确认密码不一致',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 发起请求
    wx.request({
      url: app.globalData.url+"setpassword",
      header:{ "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        phone: wx.getStorageSync('chooseUser_phone'),
        code: that.data.code,
        password: that.data.password
      },
      success(res){
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        if(res.data.code===200){
          wx.switchTab({
            url: '/pages/personal/personal',
          })
        }
      },
      fail(error){
        console.log(error)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // 获取手机号
    that.setData({
      phone:wx.getStorageSync('chooseUser_phone').replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
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