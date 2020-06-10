// pages/orderListDetail/orderListDetail.js
const app=new getApp()
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    obj : {},
    show:false,// 支付方式
  },
  onLoad : function(options){
    let that = this ;
    let obj = JSON.parse(options.obj)
    obj.jiaoyi=that.formatDuring(obj.creat_time)
    // 判断车型
    if(obj.car_category==0){
      obj.car_type="轿车"
    }else if(obj.car_category==1){
      obj.car_type="SUV"
    }else if(obj.car_category==2){
      obj.car_type="MPV"
    }
    that.setData({
      obj : obj,
      lat: wx.getStorageSync("lat"),
      lon:wx.getStorageSync("lon")
    })
    // console.log(that.data.obj)
  },
  // 时间戳转年月日
  formatDuring(timestamp) {
    var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    
    var strDate = Y+M+D+h+m+s;
    return strDate;    
  },
  onShow: function(){
    var that=this
    this.passwordWriting = this.selectComponent('#passwordWriting')
    var obj=that.data.obj
    // 如果为待付款状态
    if(obj.order_state=='0'){
      // 结束时间
      var endTime=(obj.creat_time+(30*60))*1000
      var  time=setInterval(function(){
        // 当前时间
        var nowTime=new Date().getTime()
        if(nowTime==endTime){
          wx.switchTab({
            url: '/pages/orderList/orderList',
          })
        }else{
          that.setData({
            nowTime:app.formatDuringDay(parseInt((endTime-nowTime)/1000))
          })
        }
      },1000);
      //  console.log(that.data.nowTime)
    }
    // 如果为服务中
    if(obj.order_state=='11'){
      // 结束时间
      var endTime=(obj.creat_time+(60*60*24*3))*1000
      var  time=setInterval(function(){
        // 当前时间
        var nowTime=new Date().getTime()
        if(nowTime>=endTime){
          wx.switchTab({
            url: '/pages/orderList/orderList',
          })
        }else{
          that.setData({
            nowTime:that.formatDuringDay(parseInt((endTime-nowTime)/1000))
          })
        }
      },1000);
      //  console.log(that.data.nowTime)
    }
  },
  formatDuringDay: function(mss) {
    var time = parseInt(mss) + "秒";
    if( parseInt(mss )> 60){

      var second = parseInt(mss) % 60;  //取余获得秒数
      var min = parseInt(mss / 60);  //当剩余分钟数不大于60分钟时，取整获得分数
      time = min + ":" + second;  
      // 如果大于60分钟则判断小时
      if( min > 60 ){  
          min = parseInt(mss / 60) % 60;  //获得分钟数
          var hour = parseInt( parseInt(mss / 60) /60 ); //获得小时 
          time = hour + ":" + min + ":" + second;  
          // 如果大于24小时则判断天数
          if( hour > 24 ){  
              hour = parseInt( parseInt(mss / 60) /60 ) % 24; //获得小时 
              var day = parseInt( parseInt( parseInt(mss / 60) /60 ) / 24 );  //获得天
              time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
          }  
      }       
    }
    return time;
  },
  // 点击开始服务
  begin(e){
    var that=this
    wx.requestSubscribeMessage({
      tmplIds: ['H-oYiigLOGzJHJAm4FULGuNpK2DMPm_LXdpKf1QwZRs','uRoacH2E2QenP_wEKcc1irOn_Tu1X94ULLua1ua-vr4','H-oYiigLOGzJHJAm4FULGg5ivWuoQs0J9yFnwaDs8c0'],
      success (res) { }
    })
    // console.log("123456789")
    wx.request({
      url: app.globalData.url + "start_service",
      header: { "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        order_number: that.data.obj.order_number
      },
      success(res) {
        if(res.data.code == 200){
          wx.switchTab({
            url: '/pages/orderList/orderList',
          })
        }
      },
      fail(error){
        // console.log(error)
      }
    })
  },
  // 结束服务
  endFw(e){
    var that=this
    wx.requestSubscribeMessage({
      tmplIds: ['H-oYiigLOGzJHJAm4FULGuNpK2DMPm_LXdpKf1QwZRs','uRoacH2E2QenP_wEKcc1irOn_Tu1X94ULLua1ua-vr4','H-oYiigLOGzJHJAm4FULGg5ivWuoQs0J9yFnwaDs8c0'],
      success (res) { }
    })
    wx.showModal({
      title: '提示',
      content: '确定完成订单吗？',
      success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.url + "end_service",
              header: { "token": wx.getStorageSync('token') },
              method: "POST",
              data: {
                order_number: that.data.obj.order_number
              },
              success(res) {
                // console.log(res.data.data)
                if (res.data.code == 200) {
                  wx.switchTab({
                    url: '/pages/orderList/orderList',
                  })
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                })
                }
              },
              fail(error) {
                // console.log(error)
              }
            })
          } else if (res.cancel) {
          }
      }
    })
  },
  // 取消订单
  cen: function (e) {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: '4000060808' //仅为示例，并非真实的电话号码
    })
    // let myToken = wx.getStorageSync("token");
    // wx.showModal({
    //     title: '提示',
    //     content: '您真的要取消订单吗？',
    //     success: function (res) {
    //         if (res.confirm) {
    //             wx.request({
    //               url: app.globalData.url+'cancel_bespeak_order',
    //                 header: { "token": myToken },
    //                 data: { order_number: that.data.obj.order_number, lat: wx.getStorageSync('lat'), lon: wx.getStorageSync('lon') },
    //                 success: function (res) {
    //                     if (res.data.code == 1) {
    //                         wx.showToast({
    //                             title: '取消订单成功',
    //                             icon: 'none',
    //                             duration: 2000
    //                         })
    //                       wx.switchTab({
    //                         url: '/pages/orderList/orderList',
    //                       })
    //                     }
    //                 }
    //             })
    //         } else if (res.cancel) {
    //         }
    //     }
    // })

},
  // 给小哥打电话
  toTel(){
    var that=this
    // console.log(that.data.obj)
    wx.makePhoneCall({
      phoneNumber: that.data.obj.workman_phone //仅为示例，并非真实的电话号码
    })
  },
  //点击立即下单   
  payNow : function (e){
    let that = this ;
    wx.requestSubscribeMessage({
      tmplIds: ['H-oYiigLOGzJHJAm4FULGuNpK2DMPm_LXdpKf1QwZRs','uRoacH2E2QenP_wEKcc1irOn_Tu1X94ULLua1ua-vr4','H-oYiigLOGzJHJAm4FULGg5ivWuoQs0J9yFnwaDs8c0'],
      success (res) { }
    })
    // 显示支付方式
    that.setData({
        show: true,
    })
    // 判断余额是否充足
    wx.request({
        url: app.globalData.url + 'check_balance',
        header: { "token": wx.getStorageSync('token') },
        data: { uid: wx.getStorageSync('uid'), wsid: wx.getStorageSync('wsid'), type: 1, id: wx.getStorageSync('fuwuId') },
        success(res) {
          // console.log(res)
          // 可以购买
          if (res.data.code == 200) {
            that.setData({
              payYE: true,
              priceYE: res.data.data
            })
            // 余额不足
          } else if (res.data.code == 204) {
            that.setData({
              payYE: false,
              priceYE: res.data.data
            })
            // 其它
          } else {
            that.setData({
              payYE: false,
              priceYE: res.data.msg
            })
          }
        },
        fail(error) {
          // console.log(error)
        }
    })  
  },
  // 微信支付
  weixinPay(e){
    var that=this
    wx.requestSubscribeMessage({
      tmplIds: ['H-oYiigLOGzJHJAm4FULGuNpK2DMPm_LXdpKf1QwZRs', 'uRoacH2E2QenP_wEKcc1irOn_Tu1X94ULLua1ua-vr4', 'H-oYiigLOGzJHJAm4FULGg5ivWuoQs0J9yFnwaDs8c0'],
      success(res) { }
    })
    // console.log(that.data.obj)
    if(that.data.obj.category == 1){
            wx.request({ 
            url: 'https://wash.xypvip.cn/wx_pay',
                data: { openid: wx.getStorageSync('openId'), order_number: that.data.obj.order_number,lat:that.data.lat,lon:that.data.lon },
                success: function (res) {
                    // if (res.data.data.err_code_des !== "该订单已支付") {
                    wx.requestPayment({
                        timeStamp: '' + res.data.data.timeStamp + '',
                        nonceStr: '' + res.data.data.nonceStr + '',
                        package: '' + res.data.data.package + '',
                        signType: 'MD5',
                        paySign: '' + res.data.data.paySign + '',
                        success: function (res) {
                            if (res.errMsg == "requestPayment:ok") {
                                wx.redirectTo({
                                    url: '../success/success',
                                })
                            } else {
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function (res) {
                            if (res.errMsg == "requestPayment:fail cancel") {
                                wx.showToast({
                                    title: '支付取消',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        }
                    })

                }
            })
        } else  {
            wx.request({
            url: 'https://wash.xypvip.cn/wx_pay', 
                data: { openid: wx.getStorageSync('openId'), order_number: that.data.obj.order_number, lat: that.data.lat, lon: that.data.lon },
                success: function (res) {
                    // if (res.data.data.err_code_des !== "该订单已支付") {
                    wx.requestPayment({
                        timeStamp: '' + res.data.data.timeStamp + '',
                        nonceStr: '' + res.data.data.nonceStr + '',
                        package: '' + res.data.data.package + '',
                        signType: 'MD5',
                        paySign: '' + res.data.data.paySign + '',
                        success: function (res) {
                            if (res.errMsg == "requestPayment:ok") {
                                wx.redirectTo({
                                    url: '../success/success',
                                })
                            } else {
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function (res) {
                            if (res.errMsg == "requestPayment:fail cancel") {
                                wx.showToast({
                                    title: '取消支付',
                                    icon: 'none',
                                    duration: 2000
                                })
                                var timer = setTimeout(function () {
                                    that.onLoad();
                                }, 1000);
                            }
                        }
                    })
                }
            })
        }
  },
    // 余额支付
    yuePay() {
        var that = this
        wx.requestSubscribeMessage({
          tmplIds: ['H-oYiigLOGzJHJAm4FULGuNpK2DMPm_LXdpKf1QwZRs', 'uRoacH2E2QenP_wEKcc1irOn_Tu1X94ULLua1ua-vr4', 'H-oYiigLOGzJHJAm4FULGg5ivWuoQs0J9yFnwaDs8c0'],
          success(res) { }
        })
        if (that.data.payYE) {
            that.setData({
                yuePay: true
            })
        } else {
            wx.showToast({
                title: "余额不足",
                icon: 'none',
                duration: 2000
            })
        }
    },
    // 立即评价，暂时无用
  evaNow : function (e){
    let order_number = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '../addEvaluate/addEvaluate?order_number=' + order_number,
    })
  },
  //关闭弹窗
  onClose2() {
    this.setData({ yuePay: false });
  },
  onClose() {
    this.setData({ show: false });
  },
  // 余额确定支付
  checkPassword() {
    var that=this
    wx.requestSubscribeMessage({
      tmplIds: ['H-oYiigLOGzJHJAm4FULGuNpK2DMPm_LXdpKf1QwZRs', 'uRoacH2E2QenP_wEKcc1irOn_Tu1X94ULLua1ua-vr4', 'H-oYiigLOGzJHJAm4FULGg5ivWuoQs0J9yFnwaDs8c0'],
      success(res) { }
    })
    wx.request({
        url: app.globalData.url + 'service_balance_pay',
        header: { "token": wx.getStorageSync('token') },
        method:"POST",
        data: { uid: wx.getStorageSync('uid'), order_number: that.data.obj.order_number, password: that.data.currentValue,type:0 },
        success(res) {
          wx.hideLoading()
          that.onClose()
          that.onClose2()
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          if(res.data.code==200){
            var t2 = setTimeout(function(){
              wx.switchTab({
                url: '../orderList/orderList?name=payment',
              })
            },3000)
          }else{
            that.passwordWriting.clearCurrentValue() 
            that.setData({
              currentValue:''
            })
          }
        },
        fail(err) {
          wx.hideLoading()
          // console.log(err)
        },
      })
  },
  // 获取输入的密码
  inputChange(e) {
    let currentValue = e.detail
    this.setData({
      currentValue
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
