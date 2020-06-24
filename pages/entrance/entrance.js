// wsid,lon,lat如果不是从map过来就获取当前位置的,并存储在app.js和storage中
const app=getApp()
// 引用百度地图微信小程序JSAPI模块
var bmap = require('../../libs/bmap-wx.js');
var txTobdMap = require('../../js/map.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tianqi:"",
    discountShow:true,
    isHeaderShow:true,//是否显示登录后的头部信息
    isVip: false,//是否是vip
    isAddCarShow:false,//填写车辆信息弹窗
    id:0,
    onlyTC:true,//地区性弹窗
    map:"",
    carType:"请选择您的品牌车型",
    nowAddressTextLeft:"默认位置："
  },
  // 跳转login页面
  toLogin(){
    wx.navigateTo({
      url: '/pages/user/login/login',
    })
  },
  // 跳转服务招募
  toRecruit(){
    wx.navigateTo({
      url: '../recruit/recruit',
    })
  },
  // 跳转钱包页面
  toWallet(){
    var that = this
    // 判断是否登录,登录跳转优惠券页面
    if (wx.getStorageSync('chooseUser_phone') && wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
    // 未登录跳转登录页面
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    } 
  },
  // 跳转积分页面
  toLookJF(){
    var that = this
    // 判断是否登录,登录跳转积分页面
    if (wx.getStorageSync('chooseUser_phone') && wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/integral/integral',
      })
    // 未登录跳转登录页面
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  //点击切换地址
  changeAddress(){
    app.globalData.nowIndex=0
    var topOrBottom="top"
    var type=0
    if(this.data.nowAddressTextLeft=="默认位置："){
      topOrBottom="bottom",
      type=1
    }
    wx.navigateTo({
      url: '/pages/map/map?type='+type+'&topOrBottom='+topOrBottom,
    })
  },
  // 跳转列表页面
  toWashList(e){
    var index=e.currentTarget.dataset.index
    var that=this
    if(index==="23"){
      that.setData({
        discountShow:true
      })      
      wx.navigateTo({
        url: '../washList/washList?currentTab=0&category=1',
      })
    }else{
      wx.navigateTo({
        url: '../washList/washList?currentTab=1&category=1',
      })
    }
  },
  // 跳转到订单页面
  toGoodsDetail(){
    var that=this
    // 判断是否登录
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('token')){
      // 判断是否有车辆信息
      wx.request({
        url: app.globalData.url+'get_my_cars',
        header: { "token": wx.getStorageSync('token') },
        data:{
          uid:wx.getStorageSync('uid')
        },
        success: res => {
          if(res.data.code==401){
            wx.showToast({
              title: "请退出重新登录",
              icon: 'none',
              duration: 2000
            })
            // that.getToken()
          }
          if(res.data.data.length==0){
            // that.getCity()
            that.setData({
              isAddCarShow:true
            })
          }else{
            // 跳转时将选择车辆清除
            wx.removeStorageSync('defaultCar')
            app.globalData.defaultCar = that.data.defaultCar
            app.globalData.defaultAddress=""
            app.globalData.userChooseTime=""
            app.globalData.radio="",
            app.globalData.youhuiId=""
            app.globalData.youhuiType=""
            app.globalData.getInputValue=""
            app.globalData.washTitle=""
            app.globalData.washList=""
            // 跳转订单页面
            wx.navigateTo({
              url: '/pages/goodsDetail/goodsDetail',
            })
            // 获取最近一次订单
            // wx.request({
            //   url: app.globalData.url+"userorder",
            //   header:{ "token": wx.getStorageSync('token') },
            //   method: "POST",
            //   data: {
            //     openid: wx.getStorageSync('openId'),
            //   },
            //   success: function (res) {
            //     if(res.data.code==401){
            //       wx.showToast({
            //         title: "token失效，稍后请重试",
            //         icon: 'none',
            //         duration: 2000
            //       })
            //       that.getToken()
            //     }
            //     // 如果有洗过车能获取最近一次洗车记录
            //     if(res.data.data){
            //       if(wx.getStorageSync('wsid')!=""&&wx.getStorageSync('wsid')){
            //         // 将车辆颜色，车牌信息，车辆id，经纬度存储起来
            //         wx.setStorageSync('car_color', res.data.data.car_color)
            //         wx.setStorageSync('car_number', res.data.data.car_number)
            //         wx.setStorageSync('myCar_id', res.data.data.car_id)
            //         wx.setStorageSync('lat', res.data.data.latitude)
            //         wx.setStorageSync('lon', res.data.data.longitude)
            //         wx.setStorageSync('bd_lat', res.data.data.latitude)
            //         wx.setStorageSync('bd_lng', res.data.data.longitude)
            //         wx.setStorageSync('fuwuId', res.data.data.service_id)
            //         wx.setStorageSync('car_category', res.data.data.car_category)
            //         // 跳转页面
            //         wx.navigateTo({
            //           url: '../goodsDetail/goodsDetail?recently=1&remark=' + res.data.data.remark,
            //         })
            //       }else{
            //         wx.showToast({
            //           title: "无法获取站点信息",
            //           icon: 'none',
            //           duration: 2000
            //         })
            //       } 
            //     //如果没洗过车 
            //     }else{
            //       // 判断所在地是否有站点
            //       wx.request({
            //         url: app.globalData.url+'get_bd_wash_station',
            //         data: { latitude: wx.getStorageSync('bd_lat'), longitude: wx.getStorageSync('bd_lng'), lat: wx.getStorageSync('bd_lat'), lon: wx.getStorageSync('bd_lng')},
            //         success: function (res) {
            //           // 没有站点
            //           if (res.data.code != 200) {
            //             wx.showToast({
            //               title: res.data.msg,
            //               icon: 'none',
            //               duration: 2000
            //             })
            //           } else {
            //             // 获取汽车清洗服务详情
            //             wx.request({
            //               url: app.globalData.url+"service_detail",
            //                 method: "GET",
            //                 data: {
            //                   id:27,
            //                   lat: wx.getStorageSync('lat'),
            //                   lon: wx.getStorageSync('lon')
            //                 },
            //                 success: function (res) {
            //                   that.setData({
            //                     all: res.data.data
            //                   }) 
            //                   wx.setStorageSync('fuwuId', res.data.data.id)//将该服务id存储在缓存中
            //                   // 跳转页面
            //                   wx.navigateTo({
            //                       url: '../goodsDetail/goodsDetail?all=' + JSON.stringify(that.data.all),
            //                   })
            //                 }
            //             })
            //           }
            //         }
            //       })
            //     }
            //   }
            // })  
          }
        },
        fail(err){
        },
      })   
    }else{
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  // 添加我的车辆
  addMyCar(){
    var that=this
    if(wx.getStorageSync('chooseUser_phone')&&wx.getStorageSync('userInfo')&&wx.getStorageSync('uid')){
      that.setData({
        isAddCarShow:true
      })
    }else{
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    } 
    
  },
  // 关闭填写车辆信息弹窗
  onClose() {
    this.setData({ 
      isAddCarShow:false,
      onlyTC:true,
    });
    this.onShow()
  },
  // 跳转到优惠券页面
  toLookYhq(){
    var that=this
    that.setData({
      discountShow:true
    })
    wx.navigateTo({
      url: '/pages/discounts/discounts?nweText=服务卡',
    })
  },
  // 跳转到优惠券页面
  toLookYhq2(){
    var that=this
    wx.navigateTo({
      url: '/pages/discounts/discounts?newText=优惠券',
    })
  },
  // 跳转购卡中心
  toPurchase(){
    // 判断是否登录,登录跳转优惠券页面
    if (wx.getStorageSync('chooseUser_phone') && wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/purchase/purchase',
      })
    // 未登录跳转登录页面
    } else {
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    } 
  },
  // ----------------------------------------------------------------------------------------------
  // 点击获取优惠券
  getQuan(e){
    var cid=e.currentTarget.dataset.cid
    var that=this
    // 判断是否登录
    if(wx.getStorageSync('chooseUser_phone')&&wx.getStorageSync('userInfo')&&wx.getStorageSync('uid')){
      // 请求获取优惠券
      wx.request({
        url: app.globalData.url+"getcoupon",
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          cid: cid,
          uid: wx.getStorageSync('uid')
        },
        success: function (res) {
          if(res.data.code==401){
            wx.showToast({
              title: "请退出重新登录",
              icon: 'none',
              duration: 2000
            })
          }
          if(res.data.code===200){
            that.setData({
              discountShow:false
            })
            that.getPageData()
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: 'none'
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: 'none'
            })
          }
        },
        fail(error){
          wx.showToast({
            title: '领取失败',
            duration: 3000,
            icon: 'none'
          })
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    } 
  },
  // 点击x关闭领取成功界面
  closeYhq(){
    var that=this
    that.setData({
      discountShow:true
    })
  },
  // ？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
  // 判断当前是否有车型
  lingquPD(e){
    var that=this
    if(wx.getStorageSync('userInfo')&&wx.getStorageSync('token')){
      // 判断是否有车辆信息
      wx.request({
        url: app.globalData.url+'get_my_cars',
        header: { "token": wx.getStorageSync('token') },
        data:{
          uid:wx.getStorageSync('uid')
        },
        success: res => {
          if(res.data.code==401){
            wx.showToast({
              title: "请退出重新登录",
              icon: 'none',
              duration: 2000
            })
            // that.getToken()
          }
          if(res.data.data.length==0){
            // that.getCity()
            that.setData({
              isAddCarShow:true
            })
          }else{
            var cid=e.currentTarget.dataset.cid
            // 请求获取优惠券
            wx.request({
              url: app.globalData.url+"getcoupon",
              header:{ "token": wx.getStorageSync('token') },
              method: "POST",
              data: {
                cid: cid,
                uid: wx.getStorageSync('uid')
              },
              success: function (res) {
                if(res.data.code==401){
                  wx.showToast({
                    title: "请退出重新登录",
                    icon: 'none',
                    duration: 2000
                  })
                  // that.getToken()
                }
                  that.setData({
                    onlyTC:true
                  })
                  that.getPageData()
                  wx.showToast({
                    title: res.data.msg,
                    duration: 3000,
                    icon: 'none'
                  })
                  if(res.data.code==200){
                    var time=setTimeout(function(){
                      wx.navigateTo({
                        url: '/pages/discounts/discounts?newText=优惠券',
                      })
                    },3000)
                  }
              },
              fail(error){
                wx.showToast({
                  title: '领取失败',
                  duration: 3000,
                  icon: 'none'
                })
              }
            })
            // wx.showToast({
            //   title: '领取成功',
            //   duration: 2000,
            //   icon: 'none'
            // })
            that.setData({
              onlyTC:true
            })
          }
        },
        fail(err){
        },
      })   
    }else{
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  // 城市选择
  changeCar: function (e) {
    let that = this;
    if (e.currentTarget.dataset.id) {
      that.setData({
        province: e.currentTarget.dataset.id
      })
    }
    that.setData({
      showView: false,
      carView: false
    })
  },
  // ？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
  // 添加数据
  // finish: function (e) {
  //   let that = this;
    //判断车牌信息

    // if (!that.isLicensePlate(that.data.province + that.data.city)) {
    //   wx.showToast({
    //     title: '请输入正确车牌号',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else {
    //   var car_number = that.data.province + that.data.city
    //   const stringCar = that.data.province + that.data.city
    //   let myToken = wx.getStorageSync("token");
    //   wx.setStorageSync('car_number', car_number)
    //     wx.request({
    //       url: app.globalData.url + 'add_car',
    //       header: { "token": myToken },
    //       data: { brand: '', car_number: car_number, category_car:that.data.id,car_color:"",id:"" },
    //       success: function (res) {
    //         if(res.data.code==401){
    //           wx.showToast({
    //             title: "token失效，稍后请重试",
    //             icon: 'none',
    //             duration: 2000
    //           })
    //           that.getToken()
    //         }
    //         wx.setStorageSync("myCar_id", res.data.data.id)
    //         wx.showToast({
    //           title: '车辆添加成功',
    //           icon: 'none',
    //           duration: 2000
    //         })
    //         that.toGoodsDetail()
    //         // 隐藏确认框,添加矿,显示支付选择
    //         that.setData({
    //           isAddCarShow:false,
    //           addCarShow:false,
    //           show:false
    //         })
    //       }
    //     })
    // }
  // },
  // 正则验证车牌,验证通过返回true,不通过返回false
  isLicensePlate(str) {
    return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领黔滇台][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that=this
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    item:[];
  },
  // ---------------------------------------------------------------------------------------------------
  // 获取wsid
  get_wsid: function (longitude, latitude) {
    var that = this
    // 发起请求获取wsid
    wx.request({
      url: app.globalData.url+"get_bd_wash_station",
      method: "POST",
      data: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        if(res.data.code==200){
          var wsid = res.data.data.wsid;
          var wash_station = res.data.data.station
          // 将wsid存储在app中并存储在缓存中
          getApp().globalData.wsid = wsid
          wx.setStorageSync("wsid", wsid);
          that.setData({
            wsid:wsid
          })
          // 获取优惠券列表
          wx.request({
            url: app.globalData.url+"couponlist",
            method: "GET",
            data:{
              wsid:wx.getStorageSync('wsid')
            },
            success: function (res) {
              var data=res.data.data
              data.forEach(item=>{
                if(item.type=="无门槛"){
                  item.text="送"+item.price+"元无门槛优惠券"
                }else if(item.type=="免洗"){
                  item.text="送您一张免洗券"
                }
              })
              that.setData({
                banner:data
              })
            }
          })
          that.getYHQ()
        }else{
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: 'none'
          })
          wx.request({
            url: app.globalData.url+"couponlist",
            method: "GET",
            data:{
              wsid:wx.getStorageSync('wsid')
            },
            success: function (res) {
              var data=res.data.data
              data.forEach(item=>{
                if(item.type=="无门槛"){
                  item.text="送"+item.price+"元无门槛优惠券"
                }else if(item.type=="免洗"){
                  item.text="送您一张免洗券"
                }
              })
              that.setData({
                banner:data
              })
            }
          })
        }
      }
    })
  },
  decodeUnicode(str) {  
    str = str.replace(/\\/g, "%");
    //转换中文
    str = unescape(str);
      //将其他受影响的转换回原来
    str = str.replace(/%/g, "\\");
      //对网址的链接进行处理
    str = str.replace(/\\/g, "");
    return str;
  },
  // 获取天气
  getWeather(){
    var that=this
    // 获取当天时间
    var nowDay=app.formatDuring(new Date().getTime()/1000)
    nowDay=nowDay.substring(5,nowDay.length)
    that.setData({
      nowDay:nowDay
    })
    // 如果缓存中有当前日期，并且当前日期和今天一致则获取缓存中的天气情况
    if(wx.getStorageSync('nowDay')&&wx.getStorageSync('nowDay')===that.data.nowDay){
      that.setData({
        tianqi:wx.getStorageSync('tianqi')
      })
    // 如果缓存中没有当前日期或者缓存日期和当前不一致，则发起请求获取当前天气并存储当前天气和日期
    }else{
      wx.setStorageSync('nowDay', nowDay)
      wx.request({
        url: app.globalData.url+"getwether",
        method: "POST",
        data: {
          lat:app.globalData.lat,
          lng:app.globalData.lon
        },
        success(res){
          var data=that.decodeUnicode(res.data.substring(0,res.data.length-4))
          var newData=JSON.parse(JSON.stringify(data))
          var newWeather,color
          switch (JSON.parse(newData).data.now.detail.weather) {
            case "晴":
            case "无":
              newWeather = "适宜洗车";
              color="#00CC66"
              break;
            case "多云":
            case "阴":
              newWeather = "较适宜洗车";
              color="#FF6600"
              break;
            case "阵雨":
            case "雷阵雨":
            case "雨夹雪":
            case "小雨":
            case "阵雪":
            case "小雪":
            case "雾":
            case "浮尘":
            case "扬沙":
            case "雨":
            case "雪":
              newWeather = "较不宜洗车";
              color="#FF6600"
              break;
            case "雷阵雨伴有冰雹":
            case "中雨":
            case "大雨":
            case "暴雨":
            case "大暴雨":
            case "特大暴雨":
            case "中雪":
            case "大雪":
            case "暴雪":
            case "冻雨":
            case "沙尘暴":
            case "小到中雨":
            case "中到大雨":
            case "大到暴雨":
            case "暴雨到大暴雨":
            case "大暴雨到特大暴雨":
            case "小到中雪":
            case "中到大雪":
            case "大到暴雪":
            case "强沙尘暴":
            case "霾":
              newWeather = "不适宜洗车";
              color="#FF0000"
              break; 
          } 

          var nowWeather={
            day_air_temperature:JSON.parse(newData).data.now.city.day_air_temperature,
            night_air_temperature:JSON.parse(newData).data.now.city.night_air_temperature,
            weather:JSON.parse(newData).data.now.detail.weather,
            weatherText:newWeather,
            color:color
          }
          // 将当前天气存储在缓存中
          wx.setStorageSync('tianqi', nowWeather)
          that.setData({
            tianqi:nowWeather
          })
        },
        fail(error){
        }
      })
    }
  },
  // 获取当地数据
  getYHQ(){
    var that=this
    // 获取当天时间
    var nowDay=app.formatDuring(new Date().getTime()/1000)
    nowDay=nowDay.substring(5,nowDay.length)
    that.setData({
      nowDay:nowDay
    })
    // 如果缓存中有当前日期
    if(wx.getStorageSync('nowDayYHQ')&&wx.getStorageSync('nowDayYHQ')===that.data.nowDay){
    // 如果缓存中没有当前日期或者缓存日期和当前不一致
    }else{
      wx.setStorageSync('nowDayYHQ', nowDay)
      // 获取当地优惠券弹窗数据
      wx.request({
        url: app.globalData.url+"new_coupon",
        method: "POST",
        data: {
          uid:wx.getStorageSync('uid'),
          wsid:app.globalData.wsid
        },
        success(res){
          // 已领取
          if(res.data.code==200){
            that.setData({
              yhqCity:res.data.data,
              onlyTC:false
            })
          }else{
            that.setData({
              onlyTC:true
            })
          }
        },
        fail(error){
        },
      })
    }  
  }, 
  // 打开键盘
  openCarNumber(e){
    var that=this
    that.setData({
      // carView: e.detail.carView,
      showView: e.detail.showView
    })
  },
  // 键盘高度
  marginTop(e){
    var that=this
    that.setData({
      marginTop:e.detail
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    this.passwordBox = this.selectComponent('#addCarPopup')
    if(wx.getStorageSync('carType')&&wx.getStorageSync('carType')!=""){
      var carType=wx.getStorageSync('carType')
      var car_category
      switch (carType.levelname) {
            case "中型车":
            case "中大型车":
            case "大型车":
            case "小型车":
            case "微卡":
            case "微型车":
            case "紧凑型车":
            case "跑车":
                car_category = 0;
                carType.levelname="轿车"
                break;
            case "中型SUV":
            case "中大型SUV":
              case "大型SUV":
            case "小型SUV":
            case "微面":
            case "紧凑型SUV":
                car_category = 1;
                carType.levelname="SUV"
                break;
            case "MPV":
            case "低端皮卡":        
            case "紧凑型MPV":
            case "轻客":
            case "高端皮卡":
                car_category = 2;
                carType.levelname="MPV"
                break;
      }
      that.setData({
        carType:carType.brand_name+'-'+carType.levelname,
        car_category:car_category,
        idCarType:carType.id,
        bid:carType.brandid
      })
    }
    // 获取添加车辆信息的键盘数据
    this.setData({
      cityList: app.globalData.cityList
    })
    // 每次进来判断是否登录，显示隐藏头部信息
    if(wx.getStorageSync('chooseUser_phone')&&wx.getStorageSync('userInfo')){
      that.setData({
        isHeaderShow:false,
        item:{
          "avatarUrl":wx.getStorageSync('userInfo').avatarUrl,
          "chooseUser_phone":wx.getStorageSync('chooseUser_phone').replace(/^(.{3})(?:\d+)(.{4})$/,  "\$1****\$2")
        }
      })
      // 发起页面请求获取余额，积分，卡券
      that.getPageData()
    }else{
      that.setData({
        isHeaderShow:true
      })
    }
    // 如果从地图或者车辆列表过来则获取缓存中的车辆信息和位置    
    console.log(app.globalData.nowIndex,app.globalData.nowIndex2)
    if(app.globalData.nowIndex==1||app.globalData.nowIndex2==1){
      console.log(app.globalData.nowIndex2,app.globalData.nowIndex)
      // 处理车辆信息进行拼接
      var car=wx.getStorageSync('defaultCar')
      if(car){
        car.info=(car.brand_name)+(car.car_color!=""?'-'+car.car_color:'')+(car.car_category==0?'-轿车':car.car_category==1?'-SUV':'-MPV')
      }
      var addressText=wx.getStorageSync('addressText').split("市").splice(1,20).join("市")
      that.setData({
        addressIndex:wx.getStorageSync('addressText'),
        addressIndex2:addressText,
        defaultCar:car,
        nowAddressTextLeft:app.globalData.nowIndex==1?"当前位置：":"默认位置："
      })
      that.getWeather()//获取天气，从地址过来的话可以直接获取app中经纬度请求，如果不是的话重新获取当前位置并请求
      // 获取优惠券列表，由于切换位置所以获取的是切换后位置的优惠券,滚动的
      wx.request({
        url: app.globalData.url+"couponlist",
        method: "GET",
        data:{
          wsid:wx.getStorageSync('wsid')
        },
        success: function (res) {
          var data=res.data.data
          data.forEach(item=>{
            if(item.type=="无门槛"){
              item.text="送"+item.price+"元无门槛优惠券"
            }else if(item.type=="免洗"){
              item.text="送您一张免洗券"
            }
          })
          that.setData({
            banner:data
          })
        }
      })
      that.getYHQ()//获取当前地区弹出窗获取列表
    }else{
      app.globalData.morenLon=""
      app.globalData.morenLat=""
      that.getCarAndAddress();//获取默认车辆信息和默认位置
    }
    
    // 判断是否从map页面过来
    // if (that.data.map === "1") {
      // if (wx.getStorageSync('addressText')!=='') {
      //   var pageAddress = wx.getStorageSync('addressText').substring(0, wx.getStorageSync('addressText').indexOf('市')+1);
      //   var pageAddressTwo = wx.getStorageSync('addressText').substring(wx.getStorageSync('addressText').indexOf('市')+1,wx.getStorageSync('addressText').length);
      //   that.setData({
      //     addressText: pageAddress,
      //     addressText2:pageAddressTwo
      //   })
      // }
      // 获取天气情况
      // that.getWeather()
      // if(wx.getStorageSync('wsid') == ""||!wx.getStorageSync('wsid')){
      //   wx.showToast({
      //     title: '站点信息获取失败',
      //     duration: 3000,
      //     icon: 'none'
      //   })
      //   return
      // }
      // 获取优惠券列表
      // wx.request({
      //   url: app.globalData.url+"couponlist",
      //   method: "GET",
      //   data:{
      //     wsid:wx.getStorageSync('wsid')
      //   },
      //   success: function (res) {
      //     var data=res.data.data
      //     data.forEach(item=>{
      //       if(item.type=="无门槛"){
      //         item.text="送"+item.price+"元无门槛优惠券"
      //       }else if(item.type=="免洗"){
      //         item.text="送您一张免洗券"
      //       }
      //     })
      //     that.setData({
      //       banner:data
      //     })
      //   }
      // })
      // that.// 获取优惠券列表
      // wx.request({
      //   url: app.globalData.url+"couponlist",
      //   method: "GET",
      //   data:{
      //     wsid:wx.getStorageSync('wsid')
      //   },
      //   success: function (res) {
      //     var data=res.data.data
      //     data.forEach(item=>{
      //       if(item.type=="无门槛"){
      //         item.text="送"+item.price+"元无门槛优惠券"
      //       }else if(item.type=="免洗"){
      //         item.text="送您一张免洗券"
      //       }
      //     })
      //     that.setData({
      //       banner:data
      //     })
      //   }
      // })
      // that.getYHQ()
    // } else {
      // 获取用户地理位置权限
      // that.getPermission()
    // }
  },
  // 跳转车辆列表
  toCarList(){
    app.globalData.nowIndex2=0
    wx.navigateTo({
      url: '/pages/carList/carList',
    })
  },
  // ------------------------------------------------------------------------------------------
  // 获取车辆信息和位置
  getCarAndAddress(){
    var that=this
    // 获取车辆信息和位置信息
    wx.request({
      url: app.globalData.url+"index_data",
      method: "POST",
      data:{
        uid:wx.getStorageSync('uid')
      },
      success(res){
        if(res.data.code==200){
          // 处理车辆信息进行拼接
          if(res.data.data.car){
            var car=res.data.data.car
            res.data.data.car.info=(car.brand_name)+(car.car_color!=""?'-'+car.car_color:'')+(car.car_category==0?'-轿车':car.car_category==1?'-SUV':'-MPV')
          }
          that.setData({
            defaultAddress:res.data.data.address,//默认地址
            defaultCar:res.data.data.car,//默认车辆
          })
          // 将车辆信息存贮
          wx.setStorageSync("defaultCar", res.data.data.car)
          // 判断是否返回默认地址信息，如果没有返回则获取当前位置
          if(!that.data.defaultAddress){
            that.getPermission()
            that.setData({
              nowAddressTextLeft:"当前位置："
            })
          }else{
            that.openMap2(),//获取当前位置和wsid
            // 有位置将当前经纬度和位置名称存储
            wx.setStorageSync('bd_lat', that.data.defaultAddress.latitude)
            wx.setStorageSync('bd_lng', that.data.defaultAddress.longitude)
            wx.setStorageSync('lat', that.data.defaultAddress.latitude)
            wx.setStorageSync('lon', that.data.defaultAddress.longitude)
            wx.setStorageSync('addressText', that.data.defaultAddress.province)
            that.setData({
              nowAddressTextLeft:"默认位置：",
              addressIndex:that.data.defaultAddress.province,
              addressIndex2:that.data.defaultAddress.province.split("市").splice(1,20).join("市")
            })
          }
          // 判断是否有默认车辆和地址，显示不同数据
        }else{
          app.showToast(res.data.msg)
        }
      },
      fail(err){
        app.showToast(err.data.msg)
      }
    })
  },
  // ------------------------------------------------------------------------------------------------
  // 获取当前位置
  //根据当前经纬度转百度地图获取精准定位，并存储经纬度和地址名
  loadCity: function (longitude, latitude) {
    var that = this;

      // 通过后台转换地址
      var string = "" + longitude + "," + latitude + ""
      wx.request({
        url: app.globalData.url+'get_location',
        data: { location: string, lat: latitude, lon: longitude },
        success: function (res) {
          var address = JSON.parse(JSON.stringify(res.data.data))
          // var address2=JSON.parse(JSON.stringify(res.data.data))
          that.setData({
            addressIndex:address.regeocode.formatted_address,
            addressIndex2:address.regeocode.formatted_address.split("市").splice(1,20).join("市")
          })
          // wx.setStorageSync("myCity", address_city.substring(0, address_city - 1));
          // 将经纬度和地址信息存储在缓存中
          wx.setStorageSync("lat", latitude);
          wx.setStorageSync("lon", longitude);
          wx.setStorageSync("bd_lat", latitude);
          wx.setStorageSync("bd_lng", longitude);
          wx.setStorageSync("addressText",that.data.addressIndex)
          // 将经纬度存储在app的globalData中
          getApp().globalData.lat = latitude;
          getApp().globalData.lon = longitude;
          that.getWeather()
          that.get_wsid(longitude, latitude); 
        }
      })
    // };

    // BMap.regeocoding({
    //   fail: fail,
    //   success: success
    // });
  },
  // ------------------------------------------------------------------------------------------------------------
  // 如果有默认地址的话获取当前地址并存储经纬度和wsid
  openMap2: function () {
    let that = this;
    // 微信获取用户当前权限
    wx.getSetting({
      success(res) {
        //scope.userLocation是返回的是否打开位置权限，true为打开
        if (!res.authSetting['scope.userLocation']) {
          // 微信获取用户地理位置
          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              var longitude = res.longitude;
              var latitude = res.latitude;
              // 将经纬度存储在app的globalData中
              getApp().globalData.lat = latitude;
              getApp().globalData.lon = longitude;
              that.getWeather()
              that.get_wsid(longitude, latitude); 
            },
          });
          // 调起用户设置界面，设置权限
          wx.openSetting({
            //设置权限，这个列表中会包含用户已请求过的权限，可更改权限状态
            success(res) {
              //如果再次拒绝则返回页面并提示
              if (!res.authSetting['scope.userLocation']) {
                wx.showToast({
                  title: '为方便为您提供上门洗车服务，请开启小程序定位',
                  duration: 3000,
                  icon: 'none'
                })
              } else {
                //允许授权，获取当前经纬度
                wx.getLocation({
                  type: 'gcj02',
                  success: function (res) {
                    var longitude = res.longitude;
                    var latitude = res.latitude;
                    // 将经纬度存储在app的globalData中
                    getApp().globalData.lat = latitude;
                    getApp().globalData.lon = longitude;
                    that.getWeather()
                    that.get_wsid(longitude, latitude); 
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
              // 将经纬度存储在app的globalData中
              getApp().globalData.lat = latitude;
              getApp().globalData.lon = longitude;
              that.getWeather()
              that.get_wsid(longitude, latitude); 
            },
          });
        }
      }
    })
  },
  // --------------------------------------------------------------------------------------------------------
  // 打开权限获取当前地理位置
  openMap: function () {
    let that = this;
    // 微信获取用户当前权限
    wx.getSetting({
      success(res) {
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
                  title: '为方便为您提供上门洗车服务，请开启小程序定位',
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
                // 当允许获取当前位置时，存储addressText
                wx.setStorageSync("addressText", "");
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
          wx.setStorageSync("addressText", "");
        }
      }
    })
  },
  // ----------------------------------------------------------------------------------------------------
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
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
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
  // ------------------------------------------------------------------------------------------------------------
  // 发起页面数据请求，获取余额，积分，卡券
  getPageData(){
    var that=this// 发起首页详情请求
    wx.request({
      url: app.globalData.url + 'getuserdate',
      header: {
        "token": wx.getStorageSync("token")
      },
      data:{
        uid:wx.getStorageSync('uid')
      },
      success(res){
        if(res.data.code==401){
          wx.showToast({
            title: "请退出重新登录",
            icon: 'none',
            duration: 2000
          })
          // that.getToken()
        }
        // console.log(res)
        if(res.data.code===200){
          res.data.data.integral=parseInt(res.data.data.integral)
          that.setData({
            getuserdate:res.data.data
          })
        }
      },
      fail(error){
        // console.log(error)
      }
    })
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
  // 跳转积分商城
  to_store(){
    wx.navigateToMiniProgram({
      appId: 'wx5abc49be69dedd86',
      success(res) {
        // console.log(res)
      }
    })
  },


  // wx.login({
    //   success: function (res) {
    //       if (res.code) {
    //           let myCode = res.code;
    //           wx.getUserInfo({
    //               success: function (res) {
    //                   that.setData({
    //                       userInfo: res.userInfo
    //                   })
    //                   wx.setStorageSync("userInfo", that.data.userInfo)
    //                   that.setData({
    //                       data: res.encryptedData,
    //                       iv: res.iv
    //                   })
    //                   wx.request({
    //                       url: app.globalData.url+'mp_login',
    //                       data: {
    //                           code: myCode,
    //                           iv: that.data.iv,
    //                           data: that.data.data,
    //                           m_type: "car",
    //                           lon: app.globalData.lon,
    //                           lat: app.globalData.lat
    //                       },
    //                       success: function (res) {
    //                           that.setData({
    //                             isAddCarShow:false
    //                           })
    //                           // console.log("login_info",res)
    //                           wx.setStorageSync("openId", res.data.data.openid)
    //                           wx.setStorageSync("unionid", res.data.data.unionid)
    //                           wx.setStorageSync("token", res.data.data.token)
    //                           getApp().globalData.token = res.data.data.token;
    //                           // that.onLoad()
    //                       }
    //                   })
    //               }
    //           })
    //       }
    //   }
    // });
})