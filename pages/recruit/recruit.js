// pages/recruit/recruit.js
const app=new getApp()
// 引用百度地图微信小程序JSAPI模块
var bmap = require('../../libs/bmap-wx.js');
var txTobdMap = require('../../js/map.js');
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
    address:"未获取到您的所在地"
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
            // console.log(res)
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
            // console.log(error)
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
    // 获取当前位置
    var that=this
    that.getPermission()
  },
  //根据当前经纬度转百度地图获取精准定位，并存储经纬度和地址名
  loadCity: function (longitude, latitude) {
    var that = this;

    //从微信的定位转换到百度地图定位
    var mapBD = txTobdMap.qqMapTransBMap(longitude, latitude);

    var BMap = new bmap.BMapWX({
      // ak: '6tBFv1u228awbjW4lNhbYxTtQHBKvNCy'
      ak:'NnxYM3KVSX3yAwArHsaxldeHPuUSeQ9B'
    });
    var fail = function (data) {
      // console.log(data)
      // console.log("获取城市失败")
    };
    var success = function (data) {
      // console.log("获取城市信息成功",data)
      var address_info = data.originalData.result.addressComponent//位置信息对象
      that.setData({
        address:address_info.city+address_info.district
      })
    };

    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  // 打开权限获取当前地理位置
  openMap: function () {
    let that = this;
    // 微信获取用户当前权限
    wx.getSetting({
      success(res) {
        // console.log("map_success:",res)
        //scope.userLocation是返回的是否打开位置权限，true为打开
        if (!res.authSetting['scope.userLocation']) {
          // 微信获取用户地理位置
          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              var longitude = res.longitude;
              var latitude = res.latitude;

              that.loadCity(longitude, latitude);
            },
          });
          // 调起用户设置界面，设置权限
          wx.openSetting({
            //设置权限，这个列表中会包含用户已请求过的权限，可更改权限状态
            success(res) {
              //如果再次拒绝则返回页面并提示
              if (!res.authSetting['scope.userLocation']) {
                wx.showToast({
                  title: '请开启小程序定位',
                  duration: 3000,
                  icon: 'none'
                })
              } else {
                //允许授权，获取当前经纬度
                wx.getLocation({
                  type: 'gcj02',
                  success: function (res) {
                    // console.log(res)
                    var longitude = res.longitude;
                    var latitude = res.latitude;

                    that.loadCity(longitude, latitude);
                  },
                });
              }
            }
          })
        } else {
          //获取当前经纬度
          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              var longitude = res.longitude;
              var latitude = res.latitude;

              that.loadCity(longitude, latitude);
            },
          });
        }
      }
    })
  },
  //获取用户地理位置权限
  getPermission: function () {
    var that = this;
    // 获取用户地理位置
    wx.getLocation({
      type: 'gcj02',
      // 如果确定则调用openMap进行位置获取和转换
      success: function (res) {
        that.openMap();
      },
      // 如果失败再次授权并提示
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            // 如果拒绝获取再次提示获取
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (tip) {
                  // 点击确定获取
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          //授权成功之后
                          that.openMap();
                        } else {
                          // console.log("授权取消！")
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '您已取消位置权限，请手动选择定位！',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            // console.log("窗口失败")
          }
        })
      }
    })
    that.openMap();
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