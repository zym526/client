const app=new getApp()
// pages/forget/forget.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 监听input框
  passwordOld(e){
    var that=this
    that.setData({
      oldPassword:e.detail.value
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
    // console.log(e)
    that.setData({
      passwordTwo:e.detail.value
    })
  },
  // 提交修改密码
  toSubmit(){
    var that=this
    // 判断旧密码
    if(!that.data.oldPassword||that.data.oldPassword.length<6){
      if(!that.data.oldPassword||that.data.oldPassword.length===0){
        wx.showToast({
          title: '请输入旧密码',
          icon: 'none',
          duration: 2000
        })
        return
      }else{
        wx.showToast({
          title: '请输入六位旧密码',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    // 判断密码
    if(!that.data.password||that.data.password.length<6){
      if(!that.data.password||that.data.password.length===0){
        wx.showToast({
          title: '请输入新密码',
          icon: 'none',
          duration: 2000
        })
        return
      }else{
        wx.showToast({
          title: '请输入六位新密码',
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
      url: app.globalData.url+"feditpassword",
      header:{ "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        uid: wx.getStorageSync('uid'),
        password: that.data.oldPassword,
        newpassword: that.data.password
      },
      success(res){
        // console.log(res)
        if(res.data.code===200){
          wx.showToast({
            title: "密码修改成功",
            icon: 'none',
            duration: 2000,
          })
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/personal/personal',
            })
          },2000);//设置定时任务，1000毫秒为1秒
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(error){
        // console.log(error)
      },
    })
  },
  // 跳转设计/忘记密码页面-此处为修改
  toPassword(){
    wx.navigateTo({
      url: '/pages/password/password',
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