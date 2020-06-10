// pages/discounts/discounts.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    top:["服务卡","优惠券"],//顶部导航数据
    text:"服务卡",//当前选中
    // isShow:true,//true隐藏，false显示
    usableTimecard:[],//可用服务卡
    disabledTimecard:[],//不可用服务卡
    usableCoupon:[],//可用优惠券
    disabledCoupon:[],//不可用优惠券
  },
  // 改变顶部tabbar
  changeTabbar(e){
    var that=this
    var newText=e.currentTarget.dataset.text
    that.setData({
      text:newText
    })
  },
  // 前往下单页面
  toGoods(e){
    var services=e.currentTarget.dataset.services
    wx.setStorageSync('fuwuId', services)
    wx.redirectTo({
      url: '/pages/goodsDetail/goodsDetail',
    })
  },
  toWashList(){
    wx.navigateTo({
      url: '../washList/washList?currentTab=0&category=1',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      text:options.newText
    })
    // 当从订单页面过来
    // if(options.getInputValue||options.getInputValue===""){
    //   that.setData({
    //     isShow:true,
    //     getInputValue:options.getInputValue,
    //   })
    //   // 获取可用优惠券列表
    //   wx.request({
    //     url: app.globalData.url+'getordercoupon',
    //     header: {token: wx.getStorageSync('token')},
    //     data: {
    //       uid:wx.getStorageSync('uid'),
    //       wsid:wx.getStorageSync('wsid')
    //     },
    //     success: function (res) {
    //       if(res.errMsg==='request:ok'){
    //         var data=JSON.parse(JSON.stringify(res.data.data))
    //         var data2=JSON.parse(JSON.stringify(res.data.data))
    //         that.setData({
    //           allData:data
    //         })
    //         that.getNowData(0,data2)
    //       }
    //     },
    //     fail(error){
    //     }
    //   }) 
    // }else{
      that.setData({
        isShow:false
      })
      // 获取优惠券列表
      wx.request({
        url: app.globalData.url+"getcouponlist",
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          uid: wx.getStorageSync('uid'),
          wsid:wx.getStorageSync('wsid')
        },
        success(res){
          var timecard=res.data.data.timecard
          var coupon=res.data.data.coupon
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
          coupon.forEach(item=>{
            // item.creat_time=item.creat_time.split(" ")[0]
            // item.expire_time=item.expire_time.split(" ")[0]
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
    // }
  },
  // 判断是当前数据为未使用/已使用/已过期？
  // getNowData(state,data){
  //   var that=this
  //   // 未使用
  //   if(state===0){
  //     var newdata=data.filter((item)=>{
  //       return item.state===0
  //     })
  //     newdata=JSON.parse(JSON.stringify(newdata))
  //     that.changeTime(newdata)
  //   // 已使用
  //   }else if(state===1){
  //     var newdata=data.filter((item)=>{
  //       return item.state===1
  //     })
  //     newdata=JSON.parse(JSON.stringify(newdata))
  //     that.changeTime(newdata)
  //   // 已过期
  //   }else{
  //     var newdata=data.filter((item)=>{
  //       return item.state===2
  //     })
  //     newdata=JSON.parse(JSON.stringify(newdata))
  //     that.changeTime(newdata)
  //   }
  // },
  // changeTime(data){
  //   var that=this
  //   data.forEach((item)=>{
  //     item.create_time=app.formatDuring(item.create_time)
  //     item.end_time=app.formatDuring(item.end_time)
  //     item.start_time=app.formatDuring(item.start_time)
  //   })
  //   that.setData({
  //     nowData:data
  //   })
  // },
  // 返回订单页面
  // getBack(e){
  //   var that=this
  //   var cid=e.currentTarget.dataset.all.cid//优惠券id
  //   var price=e.currentTarget.dataset.all.price//获取优惠金额
  //   wx.redirectTo({
  //     url: '/pages/payment/payment?getInputValue='+that.data.getInputValue+"&youhuiId="+cid+"&price="+price,
  //   })
  // },

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