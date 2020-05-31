var bmap = require('../../libs/bmap-wx.js');
var BMap = new bmap.BMapWX({
    ak: 'C2MtfEeUcDRo4qM6bk6XCLMGVFM4cCr1'
});
var sha1Js = require("../../js/sha1.js");
var wxMarkerData = [];
var app = getApp()
import Dialog from '../../dist/dialog/dialog';
Page({
    data: {
        category: null,
        map_width: 380,
        map_height: 380,
        markers: [],
        rgcData: {},
        all: {},
        showView: false,
        address: "",
        addressText: '',
        userPhone: '',
        allAfter: {},
        chuanAll: '',
        time: '',
        date: '',
        eva: {},
        service_id: '',
        webView: '',
        imageText: "",
        service_begin_time: '',
        service_end_time: '',
        service_start_date: '',
        service_end_date: '',
        begin_month: [],
        begin_date: [],
        begin_Hour: [],
        chooseTime: "",
        chooseDate: "",
        date: false,
        bannerList: [],
        carType: '添加车辆',
        carId: '',
        getInputValue: '',
        defaultImg: "../../img/logoImg.jpg",
        getUserPhone: '',
        getUserName: '',
        userName: '',
        userPhone: '',
        res: {},
        endtodayHours: '',
        isVip:false,//该用户是否是vip
        isBtn:true,//btn颜色,true灰色，false蓝色
        price: "未使用",//优惠券
        price2: "未使用",//服务卡
        show:false,//支付弹窗
        yuePay: false,//余额支付
    },
    // 打开时间选择
    openDate: function () {
        this.setData({
            date: true
        })
    },
    get_poi_list: function () {
        var that = this;
        // 发起POI检索请求
        let newString = "" + getApp().globalData.lat + "," + getApp().globalData.lon + ""
        BMap.regeocoding({
            "query": "",
            "location": newString,
            "pois": 1,
            success: function (data) {
                console.log(data.originalData.result.pois)
                wx.setStorageSync('addressText', data.originalData.result.pois[0].name)
                that.setData({
                    addressText: data.originalData.result.pois[0].name
                })
            },
        });
    },

    // 获取用户车辆信息
    get_mycar: function () {
        var that = this;
        wx.request({
            url: app.globalData.url+'get_my_cars',
            dataType: "json",
            header: {token: wx.getStorageSync('token')},
            data: {
                lon: getApp().globalData.lon,
                lat: getApp().globalData.lat,
                wsid: getApp().globalData.wsid
            },
            success: function (res) {
                console.log(res)
                // 将用户车辆第一个车辆信息进行存储并显示
                if (wx.getStorageSync("selectCar").length == 0) {
                  console.log("没有车辆信息",wx.getStorageSync("selectCar"))
                    wx.setStorageSync('car_category', res.data.data[0].car_category)
                    console.log("将第一个车辆信息存储")
                    if(res.data.data!==0){
                        wx.setStorageSync('selectCar', res.data.data[0].car_number)// + "-" + res.data.data[0].car_color
                        wx.setStorageSync('selectCarId', res.data.data[0].id)
                        var car_category=""
                        if (res.data.data[0].car_category==0){
                          car_category="轿车"
                        } else if (res.data.data[0].car_category == 1){
                          car_category="SUV"
                        } else if (res.data.data[0].car_category == 2) {
                          car_category="MPV"
                        }
                      // if (res.data.data[0].car_color && res.data.data[0].car_color!=""){
                      //   that.setData({
                      //     carType: res.data.data[0].car_number + "-" + res.data.data[0].car_color + "-" + car_category ,
                      //     carId: res.data.data[0].id,
                      //     car_category: res.data.data[0].car_category
                      //   })
                      // }else{
                        that.setData({
                          // carType: res.data.data[0].car_number + "-" + res.data.data[0].car_color,
                          carType: res.data.data[0].car_number + "-" + car_category,
                          carId: res.data.data[0].id,
                          car_category: res.data.data[0].car_category
                        })
                      // }
                    }                   
                } else {
                    console.log("有车辆信息",wx.getStorageSync("selectCar"))
                    // 车辆信息，服务时间，服务地点是否有改变btn颜色
                    // if(wx.getStorageSync('selectCar')&&wx.getStorageSync('addressText')&&wx.getStorageSync('userChooseTime')){
                    //     that.setData({
                    //         isBtn:false
                    //     })
                    // }else{
                    //     that.setData({
                    //         isBtn:true
                    //     })
                    // }
                }
            }
        });
    },

    // 查看是否还有预约时间
    load_yytime: function () {
        var that = this;
        console.log("yy_time")
        console.log(that.data.begin_month)
        console.log(that.data.begin_Hour)
        if(that.data.begin_Hour[0]==null){
            console.log("今天没有预约时间了")

        }else{
            wx.setStorageSync('userChooseTime', that.data.begin_month[0] + "" + that.data.begin_Hour[0])
            that.setData({
                userChooseTime: that.data.begin_month[0] + "" + that.data.begin_Hour[0],
                date: false
            })
        }


    },

    // 选择车辆
    selectCar(e) {
      var that=this
        wx.setStorageSync('selectCar', "")
        wx.setStorageSync('selectCarId', "")
        app.globalData.getInputValue=that.data.getInputValue
        wx.redirectTo({
            url: '../carList/carList',
        })
    },

    // 跳转到卡券
    toDiscounts(e) {
      var that = this
      var type = e.currentTarget.dataset.type
      app.globalData.getInputValue=that.data.getInputValue
      // 服务卡
      if(type==1){
        if(that.data.count2==0){
          return
        }else{
          app.globalData.getInputValue=that.data.getInputValue
          wx.redirectTo({
            url: '/pages/coupon/coupon?type=' + type+"&recently=1",
          })
        }
      }else{
        if(that.data.count==0){
          return
        }else{
          app.globalData.getInputValue=that.data.getInputValue
          wx.redirectTo({
            url: '/pages/coupon/coupon?type=' + type+"&recently=1",
          })
        }
      }
      
    },
     /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.passwordWriting = this.selectComponent('#passwordWriting')
    },
    onShow() {
        let that = this;
        // 发起请求获取用户信息
        wx.request({
            url: app.globalData.url + 'load_person_info',
            header: {
              "token": wx.getStorageSync("token")
            },
            success(res){
              console.log(res)
              // 如果vip返回为1则为vip，0为非vip 
              if(res.data.data.vip===1){
                that.setData({
                  isVip:true
                })
              }else{
                that.setData({
                  isVip:false
                })
              }
            },
            fail(error){
              console.log(error)
            }
        })
        if (getApp().globalData.wsid != null) {
            that.get_poi_list()
        }
        console.log("onshow")
    },

    onLoad: function (options) {
        var that = this;
        console.log(options)
        that.setData({
          car_category:wx.getStorageSync('car_category')
        })
        // 判断是否有最新的服务订单
        if(options.recently){
            that.setData({
                recently:options.recently,
                getInputValue:options.remark,
            })
        }
        let myToken = wx.getStorageSync("token");
        // 获取用户车辆信息
        wx.request({
            url: app.globalData.url+'get_my_cars',
            header: {
                "token": myToken
            },
            success: res => {
                console.log(res)
                if (res.data.code == 401) {
                    wx.showLoading({
                        title: '登录状态失效！',
                    })
                    wx.navigateTo({url: '/pages/user/login/login'})
                }else if(res.data.data.length!==0){
                    //如果缓存没有车辆信息，则获取车牌号和车辆颜色 
                    if (wx.getStorageSync("selectCar") == ' '||wx.getStorageSync('selectCar')=="") {
                      console.log("缓存中没有")
                        var car_category=""
                        if(wx.getStorageSync("car_category")==0){
                          car_category="轿车"
                        } else if (wx.getStorageSync("car_category") == 1) {
                          car_category="SUV"
                        } else if (wx.getStorageSync("car_category") == 2) {
                          car_category="MPV"
                        }
                      // if (wx.getStorageSync("car_color") && wx.getStorageSync("car_color")!=""){
                      //   that.setData({
                      //     carType: wx.getStorageSync('car_number') + '-' + wx.getStorageSync('car_color')+'-'+car_category,
                      //     carId: wx.getStorageSync('selectCarId')
                      //   })
                      // }else{
                        console.log("缓存中有")
                        that.setData({
                          carType: wx.getStorageSync('car_number') + '-' + car_category,
                          carId: wx.getStorageSync('selectCarId')
                        })
                      // }
                        
                    } else {
                        var car_category = ""
                        if (wx.getStorageSync("car_category") == 0) {
                          car_category = "轿车"
                        } else if (wx.getStorageSync("car_category") == 1) {
                          car_category = "SUV"
                        } else if (wx.getStorageSync("car_category") == 2) {
                          car_category = "MPV"
                        }
                        that.setData({
                          carType: wx.getStorageSync("selectCar") + '-' + car_category,
                            carId: wx.getStorageSync("selectCarId")
                        })
                    }
                  // 如果有最新的购买经历
                  if (that.data.recently === "1") {
                    console.log("买买买")
                    // if(wx.getStorageSync('car_color')&&wx.getStorageSync('car_color')!=""){
                    //   wx.setStorageSync('selectCar', wx.getStorageSync('car_number') + "-" + wx.getStorageSync('car_color'))
                    // }else{
                    wx.setStorageSync('selectCar', wx.getStorageSync('car_number'))
                    // }
                    var car_category = ""
                    if (wx.getStorageSync("car_category") == 0) {
                      car_category = "轿车"
                    } else if (wx.getStorageSync("car_category") == 1) {
                      car_category = "SUV"
                    } else if (wx.getStorageSync("car_category") == 2) {
                      car_category = "MPV"
                    }
                    that.setData({
                      carType: wx.getStorageSync('selectCar') + '-' + car_category,
                      carId: wx.getStorageSync('myCar_id'),
                      isBtn: false
                    })
                    // 如果没有最新的一次购买经历
                  } else {
                    console.log("其他")
                    wx.setStorageSync('selectCar', "")
                    that.get_mycar()
                  }
                }
            }
        })
        // 获取服务信息
        wx.request({
            url: app.globalData.url+'service_detail',
            data: {
                id: wx.getStorageSync('fuwuId'),
                lat: wx.getStorageSync("lat"),
                lon: wx.getStorageSync("lon")
            },
            success: function (res) {
                that.setData({
                    bannerList: res.data.data.images,
                    allAfter:res.data.data,
                    category: res.data.data.category
                })
              // 获取可用优惠券
              wx.request({
                url: app.globalData.url + 'getordercoupon',
                header: { token: wx.getStorageSync('token') },
                data: {
                  uid: wx.getStorageSync('uid'),
                  wsid: wx.getStorageSync('wsid'),
                  sid:wx.getStorageSync('fuwuId')
                },
                success: function (res) {
                  if (res.errMsg === 'request:ok') {
                    that.setData({
                      count: res.data.count,
                      youhui: res.data.data
                    })
                    if(res.data.count==0){
                      that.setData({
                        price:"无可用"
                      })
                    }
                    // 获取可用服务卡
                    wx.request({
                      url: app.globalData.url + 'getordercard',
                      header: { token: wx.getStorageSync('token') },
                      data: {
                        uid: wx.getStorageSync('uid'),
                        wsid: wx.getStorageSync('wsid'),
                        sid:wx.getStorageSync('fuwuId')
                      },
                      success: function (res) {
                        console.log(res)
                        if (res.errMsg == 'request:ok') {
                          that.setData({
                            count2: res.data.data.count,
                            fuwuka: res.data.data.use
                          })
                          if(res.data.data.count==0){
                            that.setData({
                              price2:"无可用"
                            })
                          }
                          // 如果从优惠券/服务卡跳转
                          if (options.youhuiId) {
                            // 从优惠券/服务卡过来金额为0
                            that.setData({
                              dealWith: 0,
                              dealWith2: 0
                            })
                            console.log(options.type)
                            if (options.type == '1') {
                              that.setData({
                                optionsType:1
                              })
                              that.data.fuwuka.forEach(item => {
                                if (item.id == options.youhuiId) {
                                  that.setData({
                                    // price: "未使用",
                                    price2: item.service_name,
                                  })
                                }
                              })
                              // 优惠券过来
                            } else {
                              that.setData({
                                optionsType: 2
                              })
                              that.data.youhui.forEach(item => {
                                if (item.id == options.youhuiId) {
                                  if (item.couponprice == 0) {
                                    that.setData({
                                      price: "免洗券",
                                      // price2: "未使用"
                                    })
                                  } else {
                                    that.setData({
                                      price: '-￥' + item.couponprice,
                                      // parice2: "未使用",
                                      dealWith: that.data.allAfter.city_price - item.couponprice,
                                      dealWith2: item.couponprice
                                    })
                                  }
                                }
                              })
                            }
                            that.setData({
                              youhuiId: options.youhuiId
                            })
                          } else {
                            that.setData({
                              dealWith: that.data.allAfter.city_price,
                              dealWith2: 0
                            })
                          }
                        } else {
                          that.setData({
                            count2: 0
                          })
                        }
                      },
                      fail(error) {
                        console.log(error)
                      },
                    })
                  } else {
                    that.setData({
                      count: 0
                    })
                  }
                },
                fail(error) {
                  console.log(error)
                }
              })
            }
        })        
        // 暂时没有6
        if (that.data.category == 6) {
            that.get_near_wash_stores();
        }
        var myAll=that.data.allAfter
        // 缓存中是否有定位地址
        if (wx.getStorageSync("addressText")!=='') {
            var pageAddress=wx.getStorageSync('addressText').split('-')
            that.setData({
                addressText: pageAddress[0],
                addressText1:pageAddress[1]
            })
        }
        // 缓存中是否有用户手机号
        if (wx.getStorageSync("getUserPhone")) {
            that.setData({
                userPhone: wx.getStorageSync("getUserPhone")
            })
        }
        // 缓存中是否有用户姓名
        if (wx.getStorageSync("getUserName")) {
            that.setData({
                userName: wx.getStorageSync("getUserName")
            })
        }
        showView: (options.showView == "true" ? true : false)
        let myCity = wx.getStorageSync("myCity")

        // 详细服务工作时间
        wx.request({
            url: app.globalData.url+'get_service_time',
            data: {
                lat: wx.getStorageSync("lat"),
                lon: wx.getStorageSync("lon")
            },
            success: function (res) {
                that.setData({
                    res: res
                })
                let startBeginHours = parseInt(res.data.data.service_end_time.substring(0, 2))
                let date = new Date();
                let day = date.getDate();
                let hours = date.getHours();
                that.setData({
                    endtodayHours: hours,
                    startBeginHours: startBeginHours
                })
                if (that.data.endtodayHours >= startBeginHours) {
                    that.getDay(7)
                    that.getDay(6)
                    that.getDay(5)
                    that.getDay(4)
                    that.getDay(3)
                    that.getDay(2)
                    that.getDay(1)
                } else {
                    that.getDay(6)
                    that.getDay(5)
                    that.getDay(4)
                    that.getDay(3)
                    that.getDay(2)
                    that.getDay(1)
                    that.getDay(0)
                }

                let begin_date = that.data.begin_date.substr(0, that.data.begin_date.length - 1);
                let begin_month = that.data.begin_month.substr(0, that.data.begin_month.length - 1);
                begin_date = begin_date.split(",")
                begin_month = begin_month.split(",")
                let beginList = [];
                let newDateList = [];
                let newYear = new Date().getFullYear();
                // let newXq = [];
                for (let i = 0; i < begin_month.length; i++) {
                    beginList.push(begin_month[i] + "月" + "" + begin_date[i] + "日");
                    newDateList.push(newYear + "-" + begin_month[i] + "-" + begin_date[i])
                }
                let newDateXq = []
                for (let i = 0; i < newDateList.length; i++) {
                    let xqs = newDateList[i];
                    let xq = xqs.split("-");
                    xq = new Date(xq[0], parseInt(xq[1] - 1), xq[2]);
                    let newXq = "周" + "日一二三四五六".charAt(xq.getDay());
                    newDateXq.push(newDateList[i] + "" + newXq)
                }
                that.setData({
                    begin_month: newDateXq
                })
                console.log("newDateXq")
                console.log(newDateXq)

                let monthsVal = newDateXq[0]
                let todayDays = monthsVal.substring(8, 10)
                if (day == todayDays && hours < that.data.startBeginHours) {
                    that.addHours();

                } else {
                    let res = that.data.res
                    let begin_time = res.data.data.service_begin_time.substr(0, 2)
                    let service_end_time = res.data.data.service_end_time.substr(0, 2)
                    let beginNum = parseInt(begin_time);
                    let endNum = parseInt(service_end_time);
                    let chaNum = endNum - beginNum;
                    let myHours = [];
                    myHours.push(begin_time + ":00:00")
                    for (let i = 0; i < chaNum; i++) {
                        begin_time = parseInt(begin_time) + 1
                        if (begin_time.toString().length == 1) {
                            begin_time = "0" + begin_time
                        }
                        myHours.push(begin_time + ":00:00")
                    }
                    let myHourList = [];
                    for (let i = 0; i < myHours.length - 1; i++) {
                        let changeHours = myHours[i] + "-" + myHours[i + 1];
                        myHourList.push(changeHours)
                    }
                    that.setData({
                        begin_Hour: myHourList
                    })

                    console.log("begin_Hour")
                    console.log(myHourList)
                    that.load_yytime()
                }
            }
        })
    },

    onUnload: function () {
        if (getCurrentPages().length > 2) {
            wx.switchTab({
                url: '../washList/washList',
            })
        }
    },

    // 添加时间
    addHours() {
        let that = this;
        let res = that.data.res;
        let begin_time = res.data.data.service_begin_time.substr(0, 2)
        let service_end_time = res.data.data.service_end_time.substr(0, 2)
        let date = new Date();
        let hours = date.getHours();

        let beginNum = parseInt(begin_time);
        let chooseHours = hours;
        let myHours = [];
        let todayHours = parseInt(service_end_time) - hours;
        for (let i = 0; i < todayHours; i++) {
            chooseHours = parseInt(chooseHours) + 1;

            if (chooseHours.toString().length == 1) {
                chooseHours = "0" + chooseHours
            }
            myHours.push(chooseHours + ":00:00")
        }
        let myHourList = [];
        let changeHours = "";
        for (let i = 0; i < myHours.length - 1; i++) {
            changeHours = myHours[i] + "-" + myHours[i + 1];
            myHourList.push(changeHours)
        }
        that.setData({
            begin_Hour: myHourList
        })
        that.load_yytime()
    },

    // 选择时间
    bindChange: function (e) {
        let that = this;
        const val = e.detail.value;
        let date = new Date();
        let day = date.getDate();
        let hours = date.getHours();
        let monthsVal = that.data.begin_month[val[0]]
        let todayDays = monthsVal.substring(8, 10)

        if (day == todayDays && hours < that.data.startBeginHours) {
            that.addHours();
        } else {
            let res = that.data.res
            let begin_time = res.data.data.service_begin_time.substr(0, 2)
            let service_end_time = res.data.data.service_end_time.substr(0, 2)
            let beginNum = parseInt(begin_time);
            let endNum = parseInt(service_end_time);
            let chaNum = endNum - beginNum;
            let myHours = [];
            myHours.push(begin_time + ":00:00")
            for (let i = 0; i < chaNum; i++) {
                begin_time = parseInt(begin_time) + 1
                if (begin_time.toString().length == 1) {
                    begin_time = "0" + begin_time
                }
                myHours.push(begin_time + ":00:00")
            }
            let myHourList = [];
            for (let i = 0; i < myHours.length - 1; i++) {
                let changeHours = myHours[i] + "-" + myHours[i + 1];
                myHourList.push(changeHours)
            }
            that.setData({
                begin_Hour: myHourList
            })
        }
        that.setData({
            chooseDate: that.data.begin_month[val[0]],
            chooseTime: that.data.begin_Hour[val[1]]
        })
    },

    getDay: function (day) {
        let that = this;
        var today = new Date();

        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

        today.setTime(targetday_milliseconds); //注意，这行是关键代码

        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = that.doHandleMonth(tMonth + 1);
        tDate = that.doHandleMonth(tDate);
        that.setData({
            begin_month: tMonth + "," + that.data.begin_month,
            begin_date: tDate + "," + that.data.begin_date,
        })
        return tYear + "-" + tMonth + "-" + tDate;
    },

    doHandleMonth: function (month) {
        var m = month;
        if (month.toString().length == 1) {
            m = "0" + month;
        }
        return m;
    },

    getDates: function () {
        let that = this;
        let date = new Date();
        let hours = date.getHours();
        let days = that.doHandleMonth(date.getDate());
        let lastDays = '';
        days = parseInt(days);
        let endHours = "";
        if (that.data.chooseDate && that.data.chooseTime) {
            lastDays = that.data.chooseDate;
            lastDays = lastDays.substring(lastDays.length - 4, lastDays.length - 2)
            lastDays = parseInt(lastDays);
            endHours = that.data.chooseTime.substring(9, 11);
            if (days == lastDays) {
                if (endHours > hours) {
                    that.setData({
                        userChooseTime: that.data.chooseDate + "" + that.data.chooseTime,
                        date: false
                    })
                } else {
                    wx.showToast({
                        title: "选择日期小于当前日期",
                        icon: 'none',
                        duration: 2000
                    })
                }
                wx.setStorageSync('userChooseTime', that.data.userChooseTime)
            } else {
                that.setData({
                    userChooseTime: that.data.chooseDate + "" + that.data.chooseTime,
                    date: false
                })
                wx.setStorageSync('userChooseTime', that.data.userChooseTime)
            }
        } else {
            endHours = that.data.begin_Hour[0].substring(9, 11);
            lastDays = that.data.begin_month[0];
            lastDays = lastDays.substring(lastDays.length - 4, lastDays.length - 2)
            lastDays = parseInt(lastDays);
            if (days == lastDays) {
                if (endHours > hours) {
                    that.setData({
                        userChooseTime: that.data.begin_month[0] + "" +

                            that.data.begin_Hour[0],
                        chooseDate: that.data.begin_month[0],
                        chooseTime: that.data.begin_Hour[0],
                        date: false
                    })
                    wx.setStorageSync('userChooseTime', that.data.userChooseTime)
                } else {
                    wx.showToast({
                        title: "选择日期小于当前日期",
                        icon: 'none',
                        duration: 2000
                    })
                }
            } else {
                that.setData({
                    userChooseTime: that.data.begin_month[0] + "" + that.data.begin_Hour[0],
                    chooseDate: that.data.begin_month[0],
                    chooseTime: that.data.begin_Hour[0],
                    date: false
                })
                wx.setStorageSync('userChooseTime', that.data.userChooseTime)
            }
        }
    },
    closeDates(){
        var that=this
        that.setData({
            date:false
        })
    },

    getInputValue(e) {
        let that = this;
        that.setData({
            getInputValue: e.detail.value
        })
        console.log(that.data.getInputValue)
    },

    getUserPhone(e) {
        let that = this;
        that.setData({
            getUserPhone: e.detail.value
        })
        wx.setStorageSync("getUserPhone", that.data.getUserPhone);
    },

    getUserName(e) {
        let that = this;
        that.setData({
            getUserName: e.detail.value
        })
        wx.setStorageSync("getUserName", that.data.getUserName);
    },

    // 一键下单
    fukuan(){
        var that=this
        if(!wx.getStorageSync('selectCar')||wx.getStorageSync('selectCar')===''){
            wx.showToast({
                title: "请选择车辆信息",
                icon: 'none',
                duration: 2000
            })
        }else if(!wx.getStorageSync('addressText')||wx.getStorageSync('addressText')===''){
            wx.showToast({
                title: "请选择服务地址",
                icon: 'none',
                duration: 2000
            })
        }else if(!wx.getStorageSync('userChooseTime')||wx.getStorageSync('userChooseTime')===''){
            wx.showToast({
                title: "请选择服务时间",
                icon: 'none',
                duration: 2000
            })
        }else{
          console.log(that.data.car_category, that.data.allAfter)
          // 判断车辆信息是否缺少
          // if(that.data.carType.split("-").length==2){
          //   Dialog.confirm({
              // title: '标题',
              // message: '缺少车辆颜色，是否补全?',
              // confirmButtonText:"补全"
          //   }).then(() => {
          //       app.globalData.getInputValue=that.data.getInputValue
          //       wx.redirectTo({
          //         url: '/pages/carList/carList',
          //       })
          //   }).catch(() => {
          //   });
          // }else{
            //判断车型是否一致
            if (that.data.car_category == that.data.allAfter.category_car){
              // 判断实付金额是否为0
              if (that.data.dealWith == 0){
                console.log("实付金额为0", that.data.optionsType)            
                wx.showModal({
                    title: '提示',
                    content: '确定下单吗？',
                    success: function (res) {
                        if (res.confirm) {
                          var mySha1 = sha1Js.hex_sha1(that.data.allAfter.id.toString() + wx.getStorageSync('wsid').toString() + wx.getStorageSync('userChooseTime') + wx.getStorageSync('chooseUser_phone'));
                          mySha1 = mySha1.toUpperCase()//转为大写
                          // 根据获取的服务信息预约订单
                          wx.request({
                            url: app.globalData.url + 'place_wash_car_order',
                            header: { token: wx.getStorageSync('token') },
                            method: "GET",
                            data: {
                              bespeak_time: wx.getStorageSync('userChooseTime'),
                              sign: mySha1,
                              longitude: wx.getStorageSync('lon'),
                              latitude: wx.getStorageSync('lat'),
                              lat: wx.getStorageSync('bd_lat'),
                              lon: wx.getStorageSync('bd_lng'),
                              service_id: that.data.allAfter.id,
                              car_id: that.data.carId,
                              pay_way: that.data.optionsType ? that.data.optionsType : '',
                              time_card_id: that.data.optionsType == 1 ? that.data.youhuiId : '',
                              user_phone: wx.getStorageSync('chooseUser_phone'),
                              address: wx.getStorageSync('addressText'),
                              remark: that.data.getInputValue,
                              city: '',
                              user_name: '',
                              wsid: wx.getStorageSync('wsid'),
                              couponid: that.data.optionsType == 2 ? that.data.youhuiId : '',
                            },
                            success(res) {
                              console.log(res)
                              if (res.errMsg === "request:ok") {
                                var data = res.data.data;
                                wx.showLoading({
                                  title: "正在加载",
                                  mask: true
                                })
                                // type:1不走密码，0走密码
                                wx.request({
                                  url: app.globalData.url + 'service_balance_pay',
                                  header: { "token": wx.getStorageSync('token') },
                                  method:"POST",
                                  data: { uid: wx.getStorageSync('uid'), order_number: data.order_number, password: that.data.currentValue,type:1 },
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
                                    console.log(err)
                                  },
                                })
                              } else {
                                wx.showToast({
                                  title: "下单失败",
                                  icon: 'none',
                                  duration: 2000
                                })
                              }
                            },
                            fail(error) {
                              console.log(error)
                            },
                          })
                        } else if (res.cancel) {
                        }
                    }
                })
              }else{
                console.log("实付金额不为0")
                that.setData({
                  show: true
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
              }
            }else{
              Dialog.confirm({
                // title: '标题',
                message: '您的车型与所选服务车型不符!',
                confirmButtonText:"切换车型"
              }).then(() => {
                  app.globalData.getInputValue=that.data.getInputValue
                  wx.redirectTo({
                    url: '/pages/carList/carList',
                  })
              }).catch(() => {
              });
            }
          // }
        }
    },

    // 选择服务地点
    onChangeShowState: function () {
        var that = this;
        wx.navigateTo({
            url: '../map/map?id=' + "1" + "&all=" + that.data.chuanAll,
        })
    },

    // 在onLoad中调用，暂时未用到
    get_near_wash_stores: function () {
        var that = this;
        console.log("获取最近的精养馆")
        wx.request({
            url: app.globalData.url+'near_wash_stores',
            method: "GET",
            data: {
                category: that.data.category,
                latitude: wx.getStorageSync("lat"),
                longitude: wx.getStorageSync("lon"),

                lat: wx.getStorageSync("lat"),
                lon: wx.getStorageSync("lon"),
                service_id: that.data.allAfter.id
            },
            success: function (res) {
                console.log(res.data.data)
                that.setData({
                    linerStore: res.data.data[0].name,
                    linerStore_id: res.data.data[0].id,

                })
            }
        })

    },

    onClose2() {
      this.setData({ yuePay: false });
    },
    onClose() {
      this.setData({ show: false });
    },
    // 获取输入的密码
    inputChange(e) {
      let currentValue = e.detail
      this.setData({
        currentValue
      })
    },
    // 微信支付
    weixinPay() {
      var that = this
      var mySha1 = sha1Js.hex_sha1(that.data.allAfter.id.toString() + wx.getStorageSync('wsid').toString() + wx.getStorageSync('userChooseTime') + wx.getStorageSync('chooseUser_phone'));
      mySha1 = mySha1.toUpperCase()//转为大写
      // 根据获取的服务信息预约订单
      wx.request({
        url: app.globalData.url + 'place_wash_car_order',
        header: { token: wx.getStorageSync('token') },
        method: "GET",
        data: {
          bespeak_time: wx.getStorageSync('userChooseTime'),
          sign: mySha1,
          longitude: wx.getStorageSync('lon'),
          latitude: wx.getStorageSync('lat'),
          lat: wx.getStorageSync('bd_lat'),
          lon: wx.getStorageSync('bd_lng'),
          service_id: that.data.allAfter.id,
          car_id: that.data.carId,
          pay_way: that.data.optionsType ? that.data.optionsType:'',
          time_card_id: that.data.optionsType == 1 ? that.data.youhuiId:'',
          user_phone: wx.getStorageSync('chooseUser_phone'),
          address: wx.getStorageSync('addressText'),
          remark: that.data.getInputValue,
          city: '',
          user_name: '',
          wsid: wx.getStorageSync('wsid'),
          couponid: that.data.optionsType == 2 ? that.data.youhuiId : '',
        },
        success(res) {
          console.log(res)
          if (res.errMsg === "request:ok") {
            var data = res.data.data;
            wx.showLoading({
              title: "正在加载",
              mask: true
            })
            // 发起支付请求
            wx.request({
              url: app.globalData.url + 'wx_pay',
              header: { token: wx.getStorageSync('token') },
              method: "GET",
              data: {
                openid: wx.getStorageSync('openId'),
                order_number: data.order_number,
              },
              success(res) {
                console.log(res)
                if (res.data.msg === "Successful") {
                  var data = res.data.data
                  wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success(res) {
                      wx.hideLoading()
                      if (res.errMsg == "requestPayment:ok") {
                        wx.switchTab({
                          url: '../orderList/orderList?name=payment',
                        })
                      } else {
                        wx.showToast({
                          title: "支付失败",
                          icon: 'none',
                          duration: 2000
                        })
                      }
                    },
                    fail(error) {
                      wx.hideLoading()
                      if (error.errMsg == "requestPayment:fail cancel") {
                        wx.showToast({
                          title: "取消支付",
                          icon: 'none',
                          duration: 2000
                        })
                        wx.switchTab({
                          url: '../orderList/orderList?name=payment',
                        })
                      }
                    }
                  })
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: "请求失败",
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              fail(error) {
                console.log(error)
              }
            })
          } else {
            wx.showToast({
              title: "下单失败",
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail(error) {
          console.log(error)
        },
      })
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
    // 余额确定支付
    checkPassword() {
      var that = this
      console.log(that.data.youhuiId)
      var mySha1 = sha1Js.hex_sha1(that.data.allAfter.id.toString() + wx.getStorageSync('wsid').toString() + wx.getStorageSync('userChooseTime') + wx.getStorageSync('chooseUser_phone'));
      mySha1 = mySha1.toUpperCase()//转为大写
      // 根据获取的服务信息预约订单
      wx.request({
        url: app.globalData.url + 'place_wash_car_order',
        header: { token: wx.getStorageSync('token') },
        method: "GET",
        data: {
          bespeak_time: wx.getStorageSync('userChooseTime'),
          sign: mySha1,
          longitude: wx.getStorageSync('lon'),
          latitude: wx.getStorageSync('lat'),
          lat: wx.getStorageSync('bd_lat'),
          lon: wx.getStorageSync('bd_lng'),
          service_id: that.data.allAfter.id,
          car_id: that.data.carId,
          pay_way: that.data.optionsType ? that.data.optionsType : '',
          time_card_id: that.data.optionsType == 1 ? that.data.youhuiId : '',
          user_phone: wx.getStorageSync('chooseUser_phone'),
          address: wx.getStorageSync('addressText'),
          remark: that.data.getInputValue,
          city: '',
          user_name: '',
          wsid: wx.getStorageSync('wsid'),
          couponid: that.data.optionsType == 2 ? that.data.youhuiId : '',
        },
        success(res) {
          console.log(res)
          if (res.errMsg === "request:ok") {
            var data = res.data.data;
            wx.showLoading({
              title: "正在加载",
              mask: true
            })
            // type:1不走密码，0走密码
            wx.request({
              url: app.globalData.url + 'service_balance_pay',
              header: { "token": wx.getStorageSync('token') },
              method:"POST",
              data: { uid: wx.getStorageSync('uid'), order_number: data.order_number, password: that.data.currentValue,type:0 },
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
                console.log(err)
              },
            })
          } else {
            wx.showToast({
              title: "下单失败",
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail(error) {
          console.log(error)
        },
      })
    },
})