// pages/coupon/coupon.js
const app=new getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usableCoupon:[],//可用优惠券
    disabledCoupon:[],//不可用优惠券
    usableTimecard:[],//可用服务卡
    disabledTimecard:[],//不可用服务卡
    activeIcon: '../../img/activeYes.png',
    inactiveIcon: '../../img/inactiveNo.png',
    noActive:'../../img/noActive.png',
    yesActive:'../../img/yesActive.png',
  },

  // 选择优惠券
  onChange(event) {
    var that=this
    this.setData({
      radio: event.detail,
    });
    // 将服务卡id存储
    app.globalData.youhuiId=that.data.radio
    app.globalData.youhuiType=that.data.type
    wx.redirectTo({
      url: '/pages/goodsDetail/goodsDetail',
    })
  },
  // 返回订单页面
  // toDetail(){
  //   var that=this
  //   wx.redirectTo({
  //     url: '/pages/goodsDetail/goodsDetail?remark='+that.data.getInputValue+"&youhuiId="+that.data.radio+"&type="+that.data.type+"&recently=1",
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      type:options.type,//1为服务卡，2为优惠券
      fuwuId:options.fuwuId//服务id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    if(that.data.type==="1"){
      wx.setNavigationBarTitle({
        title: '选择服务卡'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '选择优惠券'
      })
    } 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    if(that.data.type=="1"){
       // 获取服务卡列表
       wx.request({
        url: app.globalData.url+"getordercard",
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          uid: wx.getStorageSync('uid'),
          wsid:wx.getStorageSync('wsid'),
          sid: app.globalData.radio
        },
        success(res){
          var timecard=res.data.data.use
          // state中1为可用，-1为过期，2为已使用
          timecard.forEach(item=>{
            item.create_time=app.formatDuring(item.create_time+(60*60*24*365))
            // category_car 0 轿车 1 SUV 2 MPV
            if(item.category_car==0){
              item.color="#FF6600",
              item.bg="small-car.png"
            } else if(item.category_car==1){
              item.color="#1678FF",
              item.bg="SUV.png"
            } else if(item.category_car==2){
              item.color="#59493F",
              item.bg="MPV.png"
            } 
            if(item.state==1){
              that.setData({
                usableTimecard:that.data.usableTimecard.concat(item)
              })
            }else{
              that.setData({
                disabledTimecard:that.data.disabledTimecard.concat(item)
              })
            }
          })
        },
        fail(error){
          wx.showToast({
            title: '获取失败',
            duration: 3000,
            icon: 'none'
          })
        }
      })
    }else{
      // 获取优惠券列表
      wx.request({
        url: app.globalData.url+"getordercoupon",
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          uid: wx.getStorageSync('uid'),
          wsid:wx.getStorageSync('wsid'),
          sid: app.globalData.radio
        },
        success(res){
          var coupon=res.data.data
          // state中1为可用，-1为过期，2为已使用
          coupon.forEach(item=>{
            item.creat_time=item.creat_time.split(" ")[0]
            item.expire_time=item.expire_time.split(" ")[0]
            if(item.state==1){
              that.setData({
                usableCoupon:that.data.usableCoupon.concat(item)
              })
            }else{
              that.setData({
                disabledCoupon:that.data.disabledCoupon.concat(item)
              })
            }
          })
        },
        fail(error){
          wx.showToast({
            title: '获取失败',
            duration: 3000,
            icon: 'none'
          })
        }
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