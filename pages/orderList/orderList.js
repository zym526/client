const app=getApp();
// pages/orderList/orderList.js
Page({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    onTabItemTap() {
        let that = this;
        that.onLoad();
    },
    data: {
        currentTab: 0,
        winWidth: 0,
        winHeight: 0,
        list: [],
        status: "",
        titleList: [
            { name: "全部订单", tabImg: 'diangdan-dd',status:100},
            { name: "待付款", tabImg: 'qianbao-dd',status:0},
            { name: "待服务", tabImg: 'daifuwu-dd' ,status:1},
            // { name: "待评价", tabImg: '../../img/dpn.png', status: 2 },
            { name: "已完成", tabImg: 'wancheng-dd' ,status:3},
        ],
        displayBlock: false,
        hasOnShow:false,
        currentId:100,//tabbar的id
        page:1,//页数
        isYes:true,
        yuePay:false,
    },
    goEva: function (e) {
        let order_number = e.currentTarget.dataset.order;
        wx.navigateTo({
            url: '../addEvaluate/addEvaluate?order_number=' + order_number,
        })
    },
    goDetail: function (e) {
        wx.navigateTo({
            url: '../orderListDetail/orderListDetail?obj=' + JSON.stringify(e.currentTarget.dataset.obj)
        })
    },
    // 点击tabbbar触发
    swichNav: function (e) {
        var that = this;
        console.log(e)
        that.setData({
            currentTab: e.currentTarget.dataset.index,
            currentId:e.currentTarget.dataset.id,
            list:[],
            page:1,
            isYes:true
        })
        console.log(e.currentTarget.dataset.current)
        that.getData(that.data.titleList[that.data.currentTab].status,1)
    },
    bindChange: function (e) {
        var that = this;
        console.log(that.data.titleList)
        that.setData({ 
            currentTab: e.detail.current,
            list:[],
            page:1,
            isYes:true 
        });
        console.log(e)
        for (let i = 0; i < that.data.titleList.length; i++) {
            if (e.detail.current == i) {
                console.log(e.detail.current,i)
                that.getData(that.data.titleList[that.data.currentTab].status,1)
            }
        }
    },
    // 请求数据
    getData(state,page){
        var that=this
        console.log(that.data.isYes,"请求开始")
        if(that.data.isYes){
            wx.showLoading({ title: '加载中', })
            let myToken = wx.getStorageSync("token");
            wx.request({
                url: app.globalData.url+'bespeak_order_list',
                dataType: "json",
                header: { "token": myToken },
                data: { order_state: state, lat: that.data.lat, lon: that.data.lon,page:page },
                success: function (res) {
                  console.log(res)
                    // 如果页码为1，返回数据为0则无数据不再请求
                    if(page==1&&res.data.data.length==0){
                        that.setData({
                            isYes:false,
                            displayBlock: true
                        })
                    }else{
                        if (res.data.data.length < 20 ) {
                            that.setData({
                                isYes:false,
                                list: that.data.list.concat(res.data.data),
                                displayBlock: false
                            })
                        } else {
                            that.setData({
                                isYes:true,
                                list:that.data.list.concat(res.data.data),
                                displayBlock: false
                            })
                        }
                    }
                    console.log(that.data.isYes,"请求结束")
                    wx.hideLoading()
                },
                error: res => {
                    wx.hideLoading()
                }
            })
        }else{
            console.log("没有更多数据")
        }
    },
    onLoad: function () {
        console.log(123)
        let that = this;
        console.log(that.data.hasOnShow)
        if (that.data.hasOnShow) {
            return
        }else{
            that.setData({
                hasOnShow: true
            })
        }
        that.setData({
            displayBlock: true,
            lat: wx.getStorageSync("lat"),
            lon: wx.getStorageSync("lon")
        })

        let myToken = wx.getStorageSync("token");

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
        
    },
    onShow: function(){
        var that=this
        this.passwordWriting = this.selectComponent('#passwordWriting')
        var aShow=wx.getStorageSync('aShow')
        if(aShow){
            wx.switchTab({
              url: '/pages/index/index',
            })
        }
        if (wx.getStorageSync('token')) {
          that.getData(100, 1)
        } else {
          wx.navigateTo({ url: '/pages/user/login/login' })
        }
    },
    payNow: function (e) {
        let that = this;
        let openId = wx.getStorageSync("openId");
        let order_number = e.currentTarget.dataset.order;
        that.setData({
            show: true,
            openIdNow:openId,
            order_number_now:order_number,
            categoryNow:e.currentTarget.dataset.category,
            statusNow:e.currentTarget.dataset.status,
            realprice:e.currentTarget.dataset.realprice,
        })
        // 判断余额是否充足
        wx.request({
            url: app.globalData.url + 'check_balance',
            header: { "token": wx.getStorageSync('token') },
            data: { uid: wx.getStorageSync('uid'), wsid: wx.getStorageSync('wsid'), type: 1, id: wx.getStorageSync('fuwuId') },
            success(res) {
              console.log(res)
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
              console.log(error)
            }
        })   
    },
    onClose2() {
        this.setData({ yuePay: false });
      },
      onClose() {
        this.setData({ show: false });
      },
    // 微信支付
    weixinPay(e){
        var that=this
        var openId=that.data.openIdNow
        var order_number=that.data.order_number_now
        var categoryNow=that.data.categoryNow
        var statusNow=that.data.statusNow
        if(categoryNow == 6){
            console.log("走汽车精养模式")
                wx.request({
                    url: app.globalData.url+'wx_pay',
                    data: { openid: openId, order_number: order_number, lat: that.data.lat, lon: that.data.lon },
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
            } else if (categoryNow == 1) {
                wx.request({
                  url: app.globalData.url+'wx_pay',
                    data: { openid: openId, order_number: order_number, lat: that.data.lat, lon: that.data.lon },
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
            } else if (categoryNow != 0 && statusNow == 11) {
                wx.request({
                  url: app.globalData.url+'wx_pay',
                    data: { openid: openId, order_number: order_number, lat: that.data.lat, lon: that.data.lon},
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
            } else if (categoryNow != 0 && statusNow != 11) {
                wx.showToast({
                    title: '请等待工作人员改价',
                    icon: 'none',
                    duration: 2000
                })
            }
    },
    // 余额支付
    yuePay() {
        var that = this
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
    // 取消订单
    cen: function (e) {
        let that = this;
        let myToken = wx.getStorageSync("token");
        if(e.currentTarget.dataset.phone=="客服电话"){
          wx.makePhoneCall({
            phoneNumber: '4000060808' //仅为示例，并非真实的电话号码
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '您真的要取消订单吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                      url: app.globalData.url+'cancel_bespeak_order',
                        header: { "token": myToken },
                        data: { order_number: e.currentTarget.dataset.order, lat: that.data.lat, lon: that.data.lon },
                        success: function (res) {
                            if (res.data.code == 200) {
                                wx.showToast({
                                    title: '取消订单成功',
                                    icon: 'none',
                                    duration: 2000
                                })
                              that.setData({
                                list: [],
                                page: 1,
                                isYes: true
                              })
                              that.getData(that.data.titleList[that.data.currentTab].status, that.data.page)
                            }
                        }
                    })
                } else if (res.cancel) {
                }
            }
          })
        }
    },
    goIndex: function () {
        wx.redirectTo({
            url: '../index/index',
        })
    },
    // 余额确定支付
    checkPassword() {
        var that=this
        wx.request({
            url: app.globalData.url + 'service_balance_pay',
            header: { "token": wx.getStorageSync('token') },
            method:"POST",
            data: { uid: wx.getStorageSync('uid'), order_number: that.data.order_number_now, password: that.data.currentValue,type:0 },
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
                that.passwordWriting.clearCurrentValue() 
                that.setData({
                  currentValue:''
                })
                that.setData({
                  list:[],
                  page:1,
                  isYes:true
                })
                that.getData(that.data.titleList[that.data.currentTab].status,1)
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
              console.log(err)
            },
          })
      },
    // 点击开始服务
    begin(e){
      var that=this
      var order_number=e.currentTarget.dataset.order
      wx.request({
        url: app.globalData.url + "start_service",
        header: { "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          order_number: order_number
        },
        success(res) {
          if (res.data.code==200){
            console.log("已经开始服务")
            that.setData({
              list: [],
              page: 1,
              isYes: true
            })
            that.getData(that.data.titleList[that.data.currentTab].status, that.data.page)
          }
        },
        fail(error){
          console.log(error)
        }
      })
    },
    // 获取输入的密码
    inputChange(e) {
        let currentValue = e.detail
        this.setData({
          currentValue
        })
    },
    // 结束服务
    endFw(e){
      var that=this
      var order_number = e.currentTarget.dataset.order
      wx.showModal({
        title: '提示',
        content: '您确定已完成此次服务吗？',
        success: function (res) {
            if (res.confirm) {
              wx.request({
                url: app.globalData.url + "end_service",
                header: { "token": wx.getStorageSync('token') },
                method: "POST",
                data: {
                  order_number: order_number
                },
                success(res) {
                  if (res.data.code == 200) {
                    console.log("结束服务")
                    that.setData({
                      list: [],
                      page: 1,
                      isYes: true
                    })
                    that.getData(that.data.titleList[that.data.currentTab].status, that.data.page)
                  }else{
                    wx.showToast({
                      title: res.data.msg,
                      icon: "none",
                      duration: 2000
                    })
                  }
                },
                fail(error) {
                  console.log(error)
                }
              })
            } else if (res.cancel) {
            }
        }
      })
    },
    /**
     * 组件的方法列表
     */
    methods: {

    },
    /**
   * 页面上拉触底事件的处理函数
   */
    onReachBottom: function () {
        var that=this
        console.log(that.data.isYes,"下拉触底",that.data.page)
        if(that.data.isYes){
          that.setData({
            page:that.data.page+1
          })
          that.getData(that.data.titleList[that.data.currentTab].status,that.data.page)
        }else{
          wx.showToast({
            title: '已经到底了',
            icon:"none",
            duration:2000
          })
        }
    },
})
