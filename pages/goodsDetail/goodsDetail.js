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

  
     /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.passwordWriting = this.selectComponent('#passwordWriting')
    },



    // 选择车辆
    toCarList(e) {
      var that = this
      app.globalData.youhuiId=""
      app.globalData.youhuiType=""
      wx.navigateTo({
        url: '/pages/carList/carList',
      })
    },
    // 跳转地址列表
    toAddressList(){
      var that=this
      app.globalData.youhuiId=""
      app.globalData.youhuiType=""
      if(that.data.nowName==""||!that.data.nowName||that.data.nowPhone==""||!that.data.nowPhone){
        wx.navigateTo({
          url: '/pages/addAddress/addAddress?type=0',
        })
      }else{
        wx.navigateTo({
          url: '/pages/addressList/addressList?type=1',
        })
      }
    },
    // 获取年月日
    getDay: function (day) {
      let that = this;
      var today = new Date();//获取当前时间
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;//现在的时间往后加1天到7天
      today.setTime(targetday_milliseconds); //注意，这行是关键代码，向 1970/01/01 添加 1到7天的 毫秒
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();//获取这七天的年月日
      tMonth = that.doHandleMonth(tMonth + 1);//月份处理+1
      tDate = that.doHandleMonth(tDate);//天数处理
      that.setData({
          begin_month: tMonth + "," + that.data.begin_month,
          begin_date: tDate + "," + that.data.begin_date,
      })
      return tYear + "-" + tMonth + "-" + tDate;//获取年月日
    },
    // 获取时分秒
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
          myHours.push(chooseHours + ":00")
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
    // 判断是否还有预约时间
    load_yytime: function () {
      var that = this;
      if(that.data.begin_Hour[0]==null){
          // console.log("今天没有预约时间了")
          that.setData({
            noTime:"今天没有预约时间了,点击预约其它时间"
          })
      }else{
          that.setData({
              userChooseTime: {
                month:that.data.begin_month[0].substring(0, 10),
                week:that.data.begin_month[0].substring(10, 12),
                time:that.data.begin_Hour[0]
              },
              date: false
          })
          // console.log(that.data.begin_month[0],that.data.userChooseTime)
          app.globalData.userChooseTime=that.data.userChooseTime
      }
    },
    // 打开时间选择
    openDate: function () {
      this.setData({
          date: true
      })
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
          myHours.push(begin_time + ":00")
          for (let i = 0; i < chaNum; i++) {
              begin_time = parseInt(begin_time) + 1
              if (begin_time.toString().length == 1) {
                  begin_time = "0" + begin_time
              }
              myHours.push(begin_time + ":00")
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
    // 月份处理
    doHandleMonth: function (month) {
      var m = month;
      if (month.toString().length == 1) {
          m = "0" + month;
      }
      return m;
    },
    // 确定时间选择
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
          endHours = that.data.chooseTime.substring(6, 8);
          if (days == lastDays) {
              if (endHours > hours) {
                  that.setData({
                      userChooseTime: {
                        month:that.data.chooseDate.substring(0, 10),
                        week:that.data.chooseDate.substring(10, 12),
                        time:that.data.chooseTime
                      },
                      date: false
                  })
              } else {
                  wx.showToast({
                      title: "选择日期小于当前日期",
                      icon: 'none',
                      duration: 2000
                  })
              }
              // wx.setStorageSync('userChooseTime', that.data.userChooseTime)
              app.globalData.userChooseTime=that.data.userChooseTime
          } else {
              that.setData({
                  userChooseTime: {
                    month:that.data.chooseDate.substring(0, 10),
                    week:that.data.chooseDate.substring(10, 12),
                    time:that.data.chooseTime
                  },
                  date: false
              })
              // wx.setStorageSync('userChooseTime', that.data.userChooseTime)
              app.globalData.userChooseTime=that.data.userChooseTime
          }
      } else {
          endHours = that.data.begin_Hour[0].substring(6, 8);
          lastDays = that.data.begin_month[0];
          lastDays = lastDays.substring(lastDays.length - 4, lastDays.length - 2)
          lastDays = parseInt(lastDays);
          if (days == lastDays) {
              if (endHours > hours) {
                  that.setData({
                      userChooseTime: {
                        month:that.data.begin_month[0].substring(0, 10),
                        week:that.data.begin_month[0].substring(10, 12),
                        time:that.data.begin_Hour[0]
                      },
                      chooseDate: that.data.begin_month[0],
                      chooseTime: that.data.begin_Hour[0],
                      date: false
                  })
                  // wx.setStorageSync('userChooseTime', that.data.userChooseTime)
                  app.globalData.userChooseTime=that.data.userChooseTime
              } else {
                  wx.showToast({
                      title: "选择日期小于当前日期",
                      icon: 'none',
                      duration: 2000
                  })
              }
          } else {
              that.setData({
                  userChooseTime: {
                    month:that.data.begin_month[0].substring(0, 10),
                    week:that.data.begin_month[0].substring(10, 12),
                    time:that.data.begin_Hour[0]
                  },
                  chooseDate: that.data.begin_month[0],
                  chooseTime: that.data.begin_Hour[0],
                  date: false
              })
              // wx.setStorageSync('userChooseTime', that.data.userChooseTime)
              app.globalData.userChooseTime=that.data.userChooseTime
          }
      }
    },
    // 关闭时间选择
    closeDates(){
      var that=this
      that.setData({
          date:false
      })
    },
    // 切换服务
    onChange(event) {
      var that=this
      this.setData({
        radio: event.detail,
        optionsType:''
      });
      app.globalData.radio=event.detail
      app.globalData.youhuiId=""
      app.globalData.youhuiType=""
      that.getFuwuInfo(event.detail)
      // console.log(app.globalData.radio)
    },
    // 获取服务内容,价格,优惠券信息,服务卡信息等
    getFuwuInfo(fuwuId){
      var that=this
      that.setData({
        price:"未使用",
        price2:"未使用"
      })
      // 先获取服务详情,根据返回数据获取优惠券,服务卡等信息
      wx.request({
        url: app.globalData.url + 'service_detail',
        data: {
          id: fuwuId,
          lat: that.data.nowLat,
          lon: that.data.nowLon
        },
        success: function (res) {
          console.log(res,"获取服务价格")
          that.setData({
            city_price:res.data.data.city_price,
            fuwu_category_car:res.data.data.category_car.split(",")
          })
          // 根据现在选择地址的经纬度获取wsid
          wx.request({
            url: app.globalData.url + "get_bd_wash_station",
            method: "POST",
            data: {
              latitude: that.data.nowLat,
              longitude: that.data.nowLon
            },
            success(res){
              if(res.data.code==200){
                wx.setStorageSync('wsid', res.data.data.wsid)
                // 获取可用优惠券
                wx.request({
                  url: app.globalData.url + 'getordercoupon',
                  header: { token: wx.getStorageSync('token') },
                  data: {
                    uid: wx.getStorageSync('uid'),
                    wsid: wx.getStorageSync('wsid'),
                    sid: fuwuId
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.data.code == 200) {
                      that.setData({
                        count: res.data.count,//优惠券数量
                        youhui: res.data.data//优惠券列表
                      })
                      if (res.data.count == 0) {
                        that.setData({
                          price: "无可用"
                        })
                      }
                      // 获取可用服务卡
                      wx.request({
                        url: app.globalData.url + 'getordercard',
                        header: { token: wx.getStorageSync('token') },
                        data: {
                          uid: wx.getStorageSync('uid'),
                          wsid: wx.getStorageSync('wsid'),
                          sid: fuwuId
                        },
                        success: function (res) {
                          // console.log(res)
                          if (res.data.code == 200) {
                            that.setData({
                              count2: res.data.data.count,//服务卡数量
                              fuwuka: res.data.data.use//服务卡列表
                            })
                            if (res.data.data.count == 0) {
                              that.setData({
                                price2: "无可用"
                              })
                            }
                            if(app.globalData.youhuiId!=""){
                              // console.log(app.globalData.youhuiId,that.data.city_price)
                              // 从优惠券/服务卡过来金额为0
                              that.setData({
                                dealWith: 0,
                                dealWith2: 0
                              })
                              // 从服务卡过来
                              if(app.globalData.youhuiType==1||app.globalData.youhuiType==2){
                                if (app.globalData.youhuiType == 1) {
                                  that.setData({
                                    optionsType: 1
                                  })
                                  that.data.fuwuka.forEach(item => {
                                    if (item.id == app.globalData.youhuiId) {
                                      that.setData({
                                        price2: item.service_name,
                                      })
                                    }
                                  })
                                  // 优惠券过来
                                } else if(app.globalData.youhuiType == 2){
                                  that.setData({
                                    optionsType: 2
                                  })
                                  that.data.youhui.forEach(item => {
                                    // console.log(item)
                                    if (item.id == app.globalData.youhuiId) {
                                      if (item.couponprice == 0) {
                                        that.setData({
                                          price: item.title,
                                        })
                                      } else {
                                        that.setData({
                                          price: '-￥' + item.couponprice,
                                          dealWith: (that.data.city_price - item.couponprice)<0?0:that.Subtr(that.data.city_price,item.couponprice),
                                          dealWith2: item.couponprice
                                        })
                                      }
                                    }
                                  })
                                }
                                that.setData({
                                  youhuiId: app.globalData.youhuiId
                                })
                              }else{
                                app.globalData.youhuiId=""
                                app.globalData.youhuiType=""
                                that.setData({
                                  dealWith: that.data.city_price,
                                  dealWith2: 0
                                })
                              }
                            } else {
                              // console.log(app.globalData.youhuiId,that.data.city_price)
                              that.setData({
                                dealWith: that.data.city_price,
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
                          // console.log(error)
                        },
                      })
                    } else {
                      that.setData({
                        count: 0
                      })
                    }
                  },
                  fail(error) {
                    app.showToast(err.data.msg)
                  }
                })
              }else{
                app.showToast(res.data.msg)
              }
            },
            fail(err){
              app.showToast(err.data.msg)
            },
          })
        }
      }) 
    },
    // 跳转到卡券
    toDiscounts(e) {
      var that = this
      var type = e.currentTarget.dataset.type//2为优惠券，1为服务卡
      // 服务卡
      if(type==1){
        if(that.data.count2==0){
          return
        }else{
          wx.navigateTo({
            url: '/pages/coupon/coupon?type=' + type,
          })
        }
      }else{
        if(that.data.count==0){
          return
        }else{
          wx.navigateTo({
            url: '/pages/coupon/coupon?type=' + type,
          })
        }
      }
      
    },
    // 备注
    getInputValue(e) {
      let that = this;
      that.setData({
          getInputValue: e.detail.value
      })
      app.globalData.getInputValue=e.detail.value
    },
    onShow() {
        let that = this;
        app.globalData.goodsDetailNow=1
        // 获取输入框内容
        that.setData({
          getInputValue:app.globalData.getInputValue
        })
        // 从首页过来defaultAddress清空,首页
        if(app.globalData.defaultAddress==""){
          // 从首页进入的话经纬度和地图肯定是当前选中的或者选择的地址
          var nowLat = wx.getStorageSync("lat")//经纬度
          var nowLon = wx.getStorageSync("lon")
          that.setData({
            nowLat,
            nowLon
          })
          // console.log(that.data.nowLat,that.data.nowLon)
          // 获取地址接口,根据经纬度判断是否有存储地址
          wx.request({
            url: app.globalData.url + "my_address",
            header: { "token": wx.getStorageSync('token') },
            method: "POST",
            data: {
              uid: wx.getStorageSync('uid')
            },
            success(res) {
              // console.log(res)
              // 204的时候没有数据,显示当前地址位置,经纬度存储,地址id为空
              if (res.data.code == 204) {
                that.setData({
                  nowAddress: wx.getStorageSync("addressText"),
                  addressId: ""
                })
                // 200的时候有数据
              } else if (res.data.code == 200) {
                // 过滤数据将经纬度相同的筛选出来,如果没有则为空数组
                var addressFilter=[]
                if(app.globalData.washList==1){
                  console.log("从列表过来")
                  addressFilter.push(res.data.data[0])
                  wx.setStorageSync('lat', res.data.data[0].latitude)
                  wx.setStorageSync('lon', res.data.data[0].longitude)
                  that.setData({
                    nowLat:res.data.data[0].latitude,
                    nowLon:res.data.data[0].longitude,
                    radio:app.globalData.radio
                  })
                }else{
                  addressFilter = res.data.data.filter(function (item) {
                    return item.latitude == nowLat && item.longitude == nowLon
                  })
                }
                // 没有该地址,获取存储的地址数据
                if (addressFilter.length == 0) {
                  that.setData({
                    nowAddress: wx.getStorageSync("addressText"),
                    addressId: ""
                  })
                  // 如果不为0则存储数据中第一地址数据
                } else {
                  that.setData({
                    nowAddress: addressFilter[0].province,//地址
                    nowName: addressFilter[0].name,//姓名
                    nowPhone: addressFilter[0].phone,//电话
                    addressId: addressFilter[0].id//地址id
                  })
                }
              } else {
                app.showToast(res.data.msg)
              }
            },
            fail(err) {
              app.showToast(err.data.msg)
            }
          })
        // 从地址列表过来
        }else{
          that.setData({
            nowAddress: app.globalData.defaultAddress.province,//地址
            nowName: app.globalData.defaultAddress.name,//姓名
            nowPhone: app.globalData.defaultAddress.phone,//电话
            addressId: app.globalData.defaultAddress.id,//地址id
            nowLat:app.globalData.defaultAddress.latitude,
            nowLon:app.globalData.defaultAddress.longitude,
            radio:app.globalData.radio
          })
          console.log(app.globalData.radio,that.data.radio)
          that.getFuwuInfo(app.globalData.radio)
        }

        // 判断是否有默认车,有的话肯定从首页或者车辆列表过来,否则从服务列表过来
        if(app.globalData.defaultCar!=""){
          // console.log(app.globalData.washTitle)
          that.setData({
            washTitle:app.globalData.washTitle
          })
          // 从车辆列表过来肯定有缓存
          if (wx.getStorageSync("defaultCar")) {
            var car = wx.getStorageSync("defaultCar")
            car.info = car.carInfo||car.info
            that.setData({
              defaultCar: car
            })
          // 没有从首页过来
          } else {
            that.setData({
              defaultCar:app.globalData.defaultCar
            })
          }
          // 根据车辆信息判断服务内容展示
          // console.log(that.data.defaultCar)
          // 判断是否是轿车
          if(app.globalData.washList!=1){
            if(that.data.defaultCar.car_category==0){
              // console.log("轿车",app.globalData.radio)
              // 如果是轿车判断是否有缓存，有的话
              if(app.globalData.radio!=""){
                // 判断是否切换车型
                if(app.globalData.radio==27||app.globalData.radio==424){
                  that.setData({
                    radio:app.globalData.radio,
                    radio1:[27,"轿车清洗（标准）"],
                    radio2:[424,"轿车外观清洗"]
                  })
                }else{
                  that.setData({
                    radio:27,
                    radio1:[27,"轿车清洗（标准）"],
                    radio2:[424,"轿车外观清洗"]
                  })
                }
              }else{
                that.setData({
                  radio:27,
                  radio1:[27,"轿车清洗（标准）"],
                  radio2:[424,"轿车外观清洗"]
                })
              }
            // 判断是否是suv
            }else if(that.data.defaultCar.car_category==1){
              // console.log("SUV")
              if(app.globalData.radio!=""){
                // 判断是否切换车型
                // console.log(app.globalData.radio)
                if(app.globalData.radio==29||app.globalData.radio==425){
                  // console.log("是suv")
                  that.setData({
                    radio:app.globalData.radio,
                    radio1:[29,"SUV清洗（标准）"],
                    radio2:[425,"SUV外观清洗"]
                  })
                }else{
                  // console.log("不是SUV")
                  that.setData({
                    radio:29,
                    radio1:[29,"SUV清洗（标准）"],
                    radio2:[425,"SUV外观清洗"]
                  })
                }
              }else{
                that.setData({
                  radio:29,
                  radio1:[29,"SUV清洗（标准）"],
                  radio2:[425,"SUV外观清洗"]
                })
              }
            // 判断是否为MPV
            }else if(that.data.defaultCar.car_category==2){
              // console.log("MPV")
              if(app.globalData.radio!=""){
                // 判断是否切换车型
                if(app.globalData.radio==131||app.globalData.radio==426){
                  that.setData({
                    radio:app.globalData.radio,
                    radio1:[131,"MPV清洗（标准）"],
                    radio2:[426,"MPV外观清洗"]
                  })
                }else{
                  that.setData({
                    radio:131,
                    radio1:[131,"MPV清洗（标准）"],
                    radio2:[426,"MPV外观清洗"]
                  })
                }
              }else{
                that.setData({
                  radio:131,
                  radio1:[131,"MPV清洗（标准）"],
                  radio2:[426,"MPV外观清洗"]
                })
              }
            }
            app.globalData.radio=that.data.radio//将当前的radio存储在缓存中
            console.log(app.globalData.radio)
            // 获取服务价格，优惠券，服务卡等
            that.getFuwuInfo(that.data.radio)
          }else{
            that.getFuwuInfo(app.globalData.radio)
          }
          
        // 否则从服务列表进来
        }else{
          console.log(app.globalData.radio)
          // app.globalData.radio=that.data.radio//将当前的radio存储在缓存中
          // 获取服务价格，优惠券，服务卡等
          that.getFuwuInfo(app.globalData.radio)
          that.setData({
            washTitle:app.globalData.washTitle,
            radio:app.globalData.radio
          })
          // 获取车辆信息
          wx.request({
            url: app.globalData.url+"index_data",
            method: "POST",
            data:{
              uid:wx.getStorageSync('uid')
            },
            success(res){
              if(res.data.code==200){
                // console.log(res.data)
                // 处理车辆信息进行拼接
                if(res.data.data.car){
                  var car=res.data.data.car
                  res.data.data.car.info=(car.brand_name)+(car.car_color!=""?'-'+car.car_color:'')+(car.car_category==0?'-轿车':car.car_category==1?'-SUV':'-MPV')
                  that.setData({
                    defaultCar:res.data.data.car,//默认车辆
                  })
                  app.globalData.defaultCar=res.data.data.car
                  // 将车辆信息存贮
                  wx.setStorageSync("defaultCar", res.data.data.car)
                }else{
                  that.setData({
                    selectCar:"点击选择车辆信息"
                  })
                }
              }else{
                app.showToast(res.data.msg)
              }
            },
            fail(err){
              app.showToast(err.data.msg)
            }
          })
        }
        
        if(app.globalData.userChooseTime!=""){
          console.log("有选择时间")
          that.setData({
            userChooseTime:app.globalData.userChooseTime,
            begin_Hour:[],
            begin_month:[]
          })
          console.log(that.data.userChooseTime)
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
                // 获取当天结束服务时间
                let startBeginHours = parseInt(res.data.data.service_end_time.substring(0, 2))
                let date = new Date();
                let day = date.getDate();//现在几号
                let hours = date.getHours();//现在几点
                // console.log(date,day,hours)
                that.setData({
                    endtodayHours: hours,//现在几点
                    startBeginHours: startBeginHours//结束几点
                })
                // 如果现在时间在当天服务结束之后，获取年月日
                if (that.data.endtodayHours >= startBeginHours) {
                    that.getDay(7)
                    that.getDay(6)
                    that.getDay(5)
                    that.getDay(4)
                    that.getDay(3)
                    that.getDay(2)
                    that.getDay(1)
                // 如果现在时间在当天服务结束之前//获取年月日
                } else {
                    that.getDay(6)
                    that.getDay(5)
                    that.getDay(4)
                    that.getDay(3)
                    that.getDay(2)
                    that.getDay(1)
                    that.getDay(0)
                }

                let begin_date = that.data.begin_date.substr(0, that.data.begin_date.length - 1);//日
                let begin_month = that.data.begin_month.substr(0, that.data.begin_month.length - 1);//月份
                begin_date = begin_date.split(",")//一周的日期
                begin_month = begin_month.split(",")//月份
                let beginList = [];
                let newDateList = [];
                let newYear = new Date().getFullYear();
                // let newXq = [];
                for (let i = 0; i < begin_month.length; i++) {
                    beginList.push(begin_month[i] + "月" + "" + begin_date[i] + "日");//月日
                    newDateList.push(newYear + "-" + begin_month[i] + "-" + begin_date[i])//年月日
                }
                let newDateXq = []
                // 根据年月日获取周几
                for (let i = 0; i < newDateList.length; i++) {
                    let xqs = newDateList[i];
                    let xq = xqs.split("-");
                    xq = new Date(xq[0], parseInt(xq[1] - 1), xq[2]);
                    let newXq = "周" + "日一二三四五六".charAt(xq.getDay());
                    newDateXq.push(newDateList[i] + "" + newXq)
                }
                that.setData({
                    begin_month: newDateXq//七天时间（年月日，周几）
                })
                // console.log(newDateXq)

                let monthsVal = newDateXq[0]
                let todayDays = monthsVal.substring(8, 10)//年月日
                if (day == todayDays && hours < that.data.startBeginHours) {
                    // that.addHours();
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
                        myHours.push(chooseHours + ":00")
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
                } else {
                    let res = that.data.res
                    let begin_time = res.data.data.service_begin_time.substr(0, 2)
                    let service_end_time = res.data.data.service_end_time.substr(0, 2)
                    let beginNum = parseInt(begin_time);
                    let endNum = parseInt(service_end_time);
                    let chaNum = endNum - beginNum;
                    let myHours = [];
                    myHours.push(begin_time + ":00")
                    for (let i = 0; i < chaNum; i++) {
                        begin_time = parseInt(begin_time) + 1
                        if (begin_time.toString().length == 1) {
                            begin_time = "0" + begin_time
                        }
                        myHours.push(begin_time + ":00")
                    }
                    let myHourList = [];
                    for (let i = 0; i < myHours.length - 1; i++) {
                        let changeHours = myHours[i] + "-" + myHours[i + 1];
                        myHourList.push(changeHours)
                    }
                    that.setData({
                        begin_Hour: myHourList
                    })
                    // console.log("begin_Hour")
                    // console.log(myHourList)
                }
            }
          })
        }else{
          console.log("没有选择时间")
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
                // 获取当天结束服务时间
                console.log(res.data.data.service_end_time)
                let startBeginHours = parseInt(res.data.data.service_end_time.substring(0, 2))
                let date = new Date();
                let day = date.getDate();//现在几号
                let hours = date.getHours();//现在几点
                // console.log(date,day,hours)
                that.setData({
                    endtodayHours: hours,//现在几点
                    startBeginHours: startBeginHours//结束几点
                })
                // 如果现在时间在当天服务结束之后，获取年月日
                if (that.data.endtodayHours >= startBeginHours) {
                    that.getDay(7)
                    that.getDay(6)
                    that.getDay(5)
                    that.getDay(4)
                    that.getDay(3)
                    that.getDay(2)
                    that.getDay(1)
                // 如果现在时间在当天服务结束之前//获取年月日
                } else {
                    that.getDay(6)
                    that.getDay(5)
                    that.getDay(4)
                    that.getDay(3)
                    that.getDay(2)
                    that.getDay(1)
                    that.getDay(0)
                }

                let begin_date = that.data.begin_date.substr(0, that.data.begin_date.length - 1);//日
                let begin_month = that.data.begin_month.substr(0, that.data.begin_month.length - 1);//月份
                begin_date = begin_date.split(",")//一周的日期
                begin_month = begin_month.split(",")//月份
                let beginList = [];
                let newDateList = [];
                let newYear = new Date().getFullYear();
                // let newXq = [];
                for (let i = 0; i < begin_month.length; i++) {
                    beginList.push(begin_month[i] + "月" + "" + begin_date[i] + "日");//月日
                    newDateList.push(newYear + "-" + begin_month[i] + "-" + begin_date[i])//年月日
                }
                let newDateXq = []
                // 根据年月日获取周几
                for (let i = 0; i < newDateList.length; i++) {
                    let xqs = newDateList[i];
                    let xq = xqs.split("-");
                    xq = new Date(xq[0], parseInt(xq[1] - 1), xq[2]);
                    let newXq = "周" + "日一二三四五六".charAt(xq.getDay());
                    newDateXq.push(newDateList[i] + "" + newXq)
                }
                that.setData({
                    begin_month: newDateXq//七天时间（年月日，周几）
                })
                // console.log(newDateXq)

                let monthsVal = newDateXq[0]
                let todayDays = monthsVal.substring(8, 10)//年月日
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
                    myHours.push(begin_time + ":00")
                    for (let i = 0; i < chaNum; i++) {
                        begin_time = parseInt(begin_time) + 1
                        if (begin_time.toString().length == 1) {
                            begin_time = "0" + begin_time
                        }
                        myHours.push(begin_time + ":00")
                    }
                    let myHourList = [];
                    for (let i = 0; i < myHours.length - 1; i++) {
                        let changeHours = myHours[i] + "-" + myHours[i + 1];
                        myHourList.push(changeHours)
                    }
                    that.setData({
                        begin_Hour: myHourList
                    })
                    // console.log("begin_Hour")
                    // console.log(myHourList)
                    that.load_yytime()
                }
            }
          })
        }
        
    },

    onLoad: function (options) {
        var that = this;     
    },

    onUnload: function () {
        if (getCurrentPages().length > 2) {
            wx.switchTab({
                url: '../washList/washList',
            })
        }
    },

    // 一键下单
    fukuan(){
        var that=this
        if(!that.data.defaultCar||that.data.defaultCar==""){
          app.showToast("请选择车辆信息")
        }else if(!that.data.addressId||that.data.addressId==""){
          // app.showToast("请填写服务地址")
          Dialog.confirm({
            message: '前往完善地址信息？',
            confirmButtonText:"完善地址"
          }).then(() => {
              wx.navigateTo({
                url: '/pages/addAddress/addAddress?type=0',
              })
            }).catch(() => {
          });
        }else if(!that.data.userChooseTime||that.data.userChooseTime==''){
          app.showToast("请选择服务时间")
        }else{
          // console.log(that.data.car_category, that.data.allAfter)
            wx.requestSubscribeMessage({
              tmplIds: ['H-oYiigLOGzJHJAm4FULGuNpK2DMPm_LXdpKf1QwZRs','uRoacH2E2QenP_wEKcc1irOn_Tu1X94ULLua1ua-vr4','H-oYiigLOGzJHJAm4FULGg5ivWuoQs0J9yFnwaDs8c0'],
              success (res) { 
                console.log(res)
              },
              complete(obj){
                console.log(obj)
              }
            })
            //判断车型是否一致
            console.log(that.data.defaultCar.car_category,that.data.fuwu_category_car)
            if (that.data.defaultCar.car_category == that.data.fuwu_category_car[0]||that.data.defaultCar.car_category == that.data.fuwu_category_car[1]||that.data.defaultCar.car_category == that.data.fuwu_category_car[2]){
              // 判断实付金额是否为0
              if (that.data.dealWith == 0){          
                wx.showModal({
                    title: '提示',
                    content: '确定下单吗？',
                    success: function (res) {
                        if (res.confirm) {
                          var mySha1 = sha1Js.hex_sha1(that.data.radio.toString() + wx.getStorageSync('wsid').toString() + (that.data.userChooseTime.month+' '+that.data.userChooseTime.week+' ' +that.data.userChooseTime.time).toString() + that.data.nowPhone.toString());
                          mySha1 = mySha1.toUpperCase()//转为大写
                          // 根据获取的服务信息预约订单
                          wx.request({
                            url: app.globalData.url + 'place_wash_car_order',
                            header: { token: wx.getStorageSync('token') },
                            method: "GET",
                            data: {
                              bespeak_time: that.data.userChooseTime.month+' '+that.data.userChooseTime.week+' ' +that.data.userChooseTime.time,
                              sign: mySha1,
                              longitude: that.data.nowLon,
                              latitude: that.data.nowLat,
                              lat: that.data.nowLat,
                              lon: that.data.nowLon,
                              service_id: that.data.radio,
                              car_id: that.data.defaultCar.id,
                              pay_way: that.data.optionsType ? that.data.optionsType : '',//1次卡支付，2优惠券
                              time_card_id: that.data.optionsType == 1 ? that.data.youhuiId : '',
                              user_phone: that.data.nowPhone,
                              address: that.data.addressId,
                              remark: that.data.getInputValue,
                              city: '',
                              user_name: '',
                              wsid: wx.getStorageSync('wsid'),
                              couponid: that.data.optionsType == 2 ? that.data.youhuiId : '',
                            },
                            success(res) {
                              // console.log(res)
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
                                      wx.switchTab({
                                        url: '../orderList/orderList?name=payment',
                                      })
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
                              } else {
                                wx.showToast({
                                  title: "下单失败",
                                  icon: 'none',
                                  duration: 2000
                                })
                              }
                            },
                            fail(error) {
                              // console.log(error)
                            },
                          })
                        } else if (res.cancel) {
                        }
                    }
                })
              }else{
                // console.log("实付金额不为0")
                that.setData({
                  show: true
                })
                // 判断余额是否充足
                wx.request({
                  url: app.globalData.url + 'check_balance',
                  header: { "token": wx.getStorageSync('token') },
                  data: { uid: wx.getStorageSync('uid'), wsid: wx.getStorageSync('wsid'), type: 0, id: that.data.radio },
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
              }
            }else{
              Dialog.confirm({
                message: '您的车型与所选服务车型不符!',
                confirmButtonText:"切换车型"
              }).then(() => {
                  app.globalData.getInputValue=that.data.getInputValue
                  app.globalData.youhuiId=""
                  app.globalData.youhuiType=""
                  wx.navigateTo({
                    url: '/pages/carList/carList',
                  })
              }).catch(() => {
              });
            }
          // }
        }
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
      var mySha1 = sha1Js.hex_sha1(that.data.radio.toString() + wx.getStorageSync('wsid').toString() + (that.data.userChooseTime.month+' '+that.data.userChooseTime.week+' ' +that.data.userChooseTime.time).toString() + that.data.nowPhone.toString());
      mySha1 = mySha1.toUpperCase()//转为大写
      // 根据获取的服务信息预约订单
      wx.request({
        url: app.globalData.url + 'place_wash_car_order',
        header: { token: wx.getStorageSync('token') },
        method: "GET",
        data: {
          bespeak_time: that.data.userChooseTime.month+' '+that.data.userChooseTime.week+' ' +that.data.userChooseTime.time,
          sign: mySha1,
          longitude: that.data.nowLon,
          latitude: that.data.nowLat,
          lat: that.data.nowLat,
          lon: that.data.nowLon,
          service_id: that.data.radio,
          car_id: that.data.defaultCar.id,
          pay_way: that.data.optionsType ? that.data.optionsType:'',//1次卡支付，2优惠券
          time_card_id: that.data.optionsType == 1 ? that.data.youhuiId:'',
          user_phone: that.data.nowPhone,
          address: that.data.addressId,
          remark: that.data.getInputValue,
          city: '',
          user_name: '',
          wsid: wx.getStorageSync('wsid'),
          couponid: that.data.optionsType == 2 ? that.data.youhuiId : '',
        },
        success(res) {
          // console.log(res)
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
                // console.log(res)
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
                // console.log(error)
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
          // console.log(error)
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
      // console.log(that.data.youhuiId)
      console.log(that.data.radio,wx.getStorageSync('wsid'),that.data.userChooseTime.month,that.data.userChooseTime.week,that.data.userChooseTime.time,that.data.nowPhone)
      var mySha1 = sha1Js.hex_sha1(that.data.radio.toString() + wx.getStorageSync('wsid').toString() + (that.data.userChooseTime.month+' '+that.data.userChooseTime.week+' ' +that.data.userChooseTime.time).toString() + that.data.nowPhone.toString());
      mySha1 = mySha1.toUpperCase()//转为大写
      // 根据获取的服务信息预约订单
      wx.request({
        url: app.globalData.url + 'place_wash_car_order',
        header: { token: wx.getStorageSync('token') },
        method: "GET",
        data: {
          bespeak_time: that.data.userChooseTime.month+' '+that.data.userChooseTime.week+' ' +that.data.userChooseTime.time,
          sign: mySha1,
          longitude: that.data.nowLon,
          latitude: that.data.nowLat,
          lat: that.data.nowLat,
          lon: that.data.nowLon,
          service_id: that.data.radio,
          car_id: that.data.defaultCar.id,
          pay_way: that.data.optionsType ? that.data.optionsType : '',
          time_card_id: that.data.optionsType == 1 ? that.data.youhuiId : '',
          user_phone: that.data.nowPhone,
          address: that.data.addressId,
          remark: that.data.getInputValue,
          city: '',
          user_name: '',
          wsid: wx.getStorageSync('wsid'),
          couponid: that.data.optionsType == 2 ? that.data.youhuiId : '',
        },
        success(res) {
          // console.log(res)
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
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              },
              fail(err) {
                wx.hideLoading()
                // console.log(err)
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
          // console.log(error)
        },
      })
    },
    // 减法处理
    Subtr(arg1,arg2){ 
      var r1,r2,m,n; 
      try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
      try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0} 
      m=Math.pow(10,Math.max(r1,r2)); 
      n=(r1>=r2)?r1:r2; 
      return ((arg1*m-arg2*m)/m).toFixed(n); 
    }
})