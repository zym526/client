const app=new getApp()
// pages/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowMon:0,//当前充值金额
    show: false,//弹窗显示
    tipText: '为了您的钱包安全，请设置支付密码，用于以后支付使用',
    // 用于页面样式的
    valueIsShow: false,
    // 记录临时的值，点击按钮后再保存到对应变量中
    currentValue: '',
    firstValue: '',
    secondValue: '',
    isCenter:true,
  },
  // 跳转钱包明细
  toParticulars(){
    wx.navigateTo({
      url: '/pages/particulars/particulars',
    })
  },

  // 获取钱包余额
  getBala(){
    var that=this
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
          that.setData({
            bala:res.data.data.bala
          })
        }
      },
      fail(error){
        console.log(error)
      }
    })
  },

  //关闭弹出层
  onClose() {
    this.setData({ show: false });
  },

  // 充值
  topUp(e){
    var that=this
    var id=e.currentTarget.dataset.id
    // 判断是否设置过密码
    wx.request({
      url: app.globalData.url+"checkpassword",
      header:{ "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        uid: wx.getStorageSync('uid')
      },
      success(res){
        console.log(res)
        // 未设置
        if(res.data.code===200){
          that.setData({ show: true });
        // 已设置
        }else{
          wx.showLoading({
            title: "正在加载",
            mask: true
          })
          // 请求充值
          wx.request({
            url: app.globalData.url+"balaorder",
            header:{ "token": wx.getStorageSync('token') },
            method: "POST",
            data: {
              uid: wx.getStorageSync('uid'),
              rid: id
            },
            success(res){
              let data=res.data.data
              // 存储订单号
              that.setData({
                order_sn:data.order_sn
              })
              // 调起支付
              wx.requestPayment({
                timeStamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: data.signType,
                paySign: data.paySign,
                success(res) {
                  wx.hideLoading()
                  console.log(res)
                  if (res.errMsg == "requestPayment:ok") {
                    // 发起回调
                    wx.request({
                      url: app.globalData.url + "balaorder_callback",
                      header: { "token": wx.getStorageSync('token') },
                      method: "POST",
                      data: {
                        order_sn: that.data.order_sn,
                        phone:wx.getStorageSync('chooseUser_phone'),
                        uid:wx.getStorageSync('uid')
                      },
                      success(res){
                        console.log(res)
                        // 获取余额
                        that.getBala()
                      },
                      fail(error){
                        console.log(error)
                      },
                    })
                  } else {
                    wx.showToast({
                        title: "支付失败",
                        icon: 'none',
                        duration: 2000
                    })
                  }
                },
                fail(error){
                  wx.hideLoading()
                  if (error.errMsg == "requestPayment:fail cancel") {
                    wx.showToast({
                        title: "取消支付",
                        icon: 'none',
                        duration: 2000
                    })
                  }
                }
              })
            },
            fail(error){
              console.log(error)
              wx.hideLoading()
            }
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
    // 获取充值中心信息
    wx.request({
      url: app.globalData.url+"getpayway",
      header:{ "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        wsid: wx.getStorageSync('wsid')
      },
      success(res){
        console.log(res)
        if(res.data.code===200){
          // 如果返回数据为0则无充值中心
          if(res.data.data.length===0){
            that.setData({
              isCenter:false
            })
          }else{
            res.data.data.forEach(item=>{
              item.price=parseInt(item.price)
              item.text="送"+item.integral+"平台积分"
              if(item.coplist.length!=0){
                item.coplist.forEach(one=>{
                  if(one.type=="无门槛"){
                    item.noMK="送"+one.c_time+"张"+one.price+"元无门槛券"
                  }else if(one.type=="免洗"){
                    item.noWash="送"+one.c_time+"张免洗券"
                  }
                })
              }
            })
            that.setData({
              money:res.data.data
            })
          }
        }else{
          that.setData({
            isCenter:false
          })
        }
      },
      fail(error){
        console.log(error)
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
    var that=this
    this.passwordBox = this.selectComponent('#passwordBox')
    that.getBala()
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

  },

  // 调用组件中的方法
  toggleValue() {
    this.setData({
      valueIsShow: !this.data.valueIsShow
    }) 
    this.passwordBox.toggleValue()
  },
  inputChange(e) {
    let currentValue = e.detail 
    this.setData({
      currentValue
    })
  },
  // 下一步
  saveInputValue() {
    var that=this
    let value = this.data.currentValue
    if (value.length < 6) {
      return
    }
    if (this.data.firstValue == '') {
      // 调用组件中的方法，清除之前的值
      this.passwordBox.clearCurrentValue() 
      this.passwordBox.toggleValue(false)
      // 重置页面初始的数据，以及文案的修改
      this.setData({
        firstValue: value,
        currentValue: '',
        valueIsShow: false,
        tipText: '请确认您的支付密码'
      })
    } else {
      this.setData({
        secondValue: value
      })
    }
    if(this.data.firstValue!==''&&this.data.secondValue!==''){
      // 如果两次密码不一致
      if(this.data.firstValue!==this.data.secondValue){
        wx.showToast({
          title: '两次密码不一致',
          duration: 3000,
          icon: 'none'
        })
        this.passwordBox.clearCurrentValue() 
        that.setData({
          firstValue:'',
          secondValue:'',
          currentValue:'',
          tipText:"为了您的钱包安全，请设置支付密码，用于以后支付使用"
        })
      // 如果密码一致则请求
      }else{
        wx.request({
          url: app.globalData.url+"editpassword",
          header:{ "token": wx.getStorageSync('token') },
          method: "POST",
          data: {
            uid: wx.getStorageSync('uid'),
            openid:wx.getStorageSync('openId'),
            password:that.data.secondValue
          },
          success(res){
            console.log(res)
            if(res.data.code===200){
              that.onClose()
            }else{
              wx.showToast({
                title: '设置失败，请稍后重试',
                duration: 3000,
                icon: 'none'
              })
              this.passwordBox.clearCurrentValue() 
              that.setData({
                firstValue:'',
                secondValue:'',
                currentValue:''
              })
            }
          },
          fail(error){
            console.log(error)
          }
        })
      }
    }
  },
  // 验证
  checkPassword(){
    this.saveInputValue()
  }
})