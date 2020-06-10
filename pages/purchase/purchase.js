const app=new getApp()
// 引用百度地图微信小程序JSAPI模块
var bmap = require('../../libs/bmap-wx.js');
var txTobdMap = require('../../js/map.js');
var carCity=require('../../utils/carCity.js')
// entrance/pages/purchase/purchase.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom:"19rpx",// 下移动
    top:-1,//固定在顶部的
    desc:[],
    isShow:false,
    show:false,//支付选择弹出框
    addCarShow:false,//是否添加车辆信息
    isAddCarShow:false,//添加车辆信息  
    id:0,//当前car的id
    payYE:true,//余额是否充足
    yuePay:false,//余额支付
    car1:"",
    car2:"",
    car3:"",
    showNull:false,
    carType:"请选择您的品牌车型",
  },
  // 点击展开
  cartoon(e){
    var that=this
    // 当前下标
    var index=e.currentTarget.dataset.index
    var rules=e.currentTarget.dataset.rules
    var time
    if(that.data.bottom==="19rpx"){
      that.setData({
        bottom:"calc(100vh - 550rpx)",
        top:index,  
        desc:rules   
      })
    }else{
      that.setData({
        bottom:"19rpx",
        top:-1,
        desc:[]
      })
    }  
    // console.log(that.data.top)
  },
  // 打开弹出层，选择支付方式
  getPayWay(e){
    var that=this
    var item=e.currentTarget.dataset.item
    this.setData({ item:item });
    // 判断车型
    wx.request({
      url: app.globalData.url+"check_car_category",
      header:{ "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        card_id:item.id,
        uid: wx.getStorageSync('uid')
      },
      success(res){
        console.log(res)
        // 判断车库中车型
        var carType=res.data.data
        carType.forEach(item=>{
          if(item.car_category==0){
            that.setData({
              car1:"轿车"
            })
          }else if(item.car_category==1){
            that.setData({
              car2:"SUV"
            })
          }else if(item.car_category==2){
            that.setData({
              car3:"MPV"
            })
          }
        })
        //205数据库没有车辆信息,204数据库有车辆信息但是无匹配,200可以购买
        if(res.data.code==204){
          that.setData({
            isAddCarShow: false,
            show: false,
            addCarShow:true
          })
        }else if(res.data.code==200){
          that.setData({
            show: true,
            isAddCarShow: false,
            addCarShow: false
          })
          that.purchasePay(item.id)
        }else if(res.data.code==205){
          that.setData({
            isAddCarShow: true,
            show:false,
            addCarShow:false
          })
          that.addCar()
        }
      },
      fail(error){
        // console.log(error)
      },
    })
  },
  onClose() {
    this.setData({ 
      show: false,
      addCarShow:false,
      isAddCarShow:false,
      showView: false,
      carView: false,
      yuePay:false
    });
  },
  // 添加车辆信息
  addCar(){
    var that=this
    // 关闭是否添加窗口，打开添加窗口
    that.setData({
      isAddCarShow:true,
      addCarShow:false
    });
    // 微信获取用户所在省份
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var longitude = res.longitude;
        var latitude = res.latitude;
      
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
          var province=data.originalData.result.addressComponent.province//省份
          var city=data.originalData.result.addressComponent.city//市
          province=province.replace("省","")
          city=city.replace("市","")
          // 便利数组获取当前的省市车牌前两位
          that.data.allCarCity.forEach(item=>{
            if(item.province.indexOf(province)!=-1&&item.city.indexOf(city)!=-1){
              that.setData({
                province:item.code.substr(0,1),
                city:item.code.substr(-1)
              })
            }else{
              that.setData({
                province:"浙",
                city:"A"
              })
            }
          })         
        };      
        BMap.regeocoding({
          fail: fail,
          success: success
        });
      },
      fail(error){
        wx.showToast({
          title: '省份获取失败',
          duration: 2000,
          icon: 'none'
        })
      }
    });
  },
  // 打开键盘
  openCarNumber(e){
    var that=this
    that.setData({
      // carView: e.detail.carView,
      showView: e.detail.showView
    })
  },
  // 获取car的id
  // changeType(e){
  //   var that=this
  //   that.setData({
  //     id:e.detail
  //   })
  // },
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
  // 输入车牌号
  // chooseCar(e){
  //   let that = this;
  //   if(that.data.city.length<6){
  //     if (e.currentTarget.dataset.id) {
  //       that.setData({
  //         city: that.data.city + e.currentTarget.dataset.id
  //       })
  //     }
  //   }
  // },
  // 车牌删除
  // delCar(e){
  //   let that = this ;
  //   if(that.data.city.length > 0){
  //       that.setData({
  //           city : that.data.city.substring(0,that.data.city.length - 1)
  //       })
  //   }
  // },
  // 车牌确定
  // btnCar: function () {
  //   var that = this;
  //   that.setData({
  //     carView: false,
  //   })
    //判断车牌信息
  //   if (!that.isLicensePlate(that.data.province + that.data.city)) {
  //     // console.log("车牌不正确");
  //     wx.showToast({
  //       title: '请输入正确车牌号',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   }
  // },
  // 正则验证车牌,验证通过返回true,不通过返回false
  isLicensePlate(str) {
    return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领黔滇台][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
  },
  // 添加数据
  // finish: function (e) {
  //   let that = this;
  //   //判断车牌信息
  //   if (!that.isLicensePlate(that.data.province + that.data.city)) {
  //     // console.log("车牌不正确");
  //     wx.showToast({
  //       title: '请输入正确车牌号',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   } else {
  //     var car_number = that.data.province + that.data.city
  //     const stringCar = that.data.province + that.data.city
  //     let myToken = wx.getStorageSync("token");
  //     wx.setStorageSync('car_number', car_number)
  //       wx.request({
  //         url: app.globalData.url + 'add_car',
  //         header: { "token": myToken },
  //         data: { brand: '', car_number: car_number, category_car:that.data.id,car_color:'',id:"" },
  //         success: function (res) {
  //           // console.log(123,res)
  //           wx.setStorageSync("myCar_id", res.data.data.id)
  //           wx.showToast({
  //             title: '车辆添加成功',
  //             icon: 'none',
  //             duration: 2000
  //           })
  //           // 隐藏确认框,添加矿,显示支付选择
  //           that.setData({
  //             isAddCarShow:false,
  //             addCarShow:false,
  //             show:false
  //           })
  //         }
  //       })
  //   }
  // },
  // 判断余额是否足够支付
  purchasePay(idCar){
    var that=this
    wx.request({
      url: app.globalData.url + 'check_balance',
      header: { "token": wx.getStorageSync('token') },
      data: { uid:wx.getStorageSync('uid'), wsid:wx.getStorageSync('wsid'), type:1, id:idCar },
      success(res){
        // console.log(res)
        // 可以购买
        if(res.data.code==200){
          that.setData({
            payYE:true,
          })
        // 余额不足
        }else if(res.data.code==204){
          that.setData({
            payYE:false,
            price:res.data.data
          })
        // 其它
        }else{
          that.setData({
            payYE:false,
            price:res.data.msg
          })
        }
      },
      fail(error){
        // console.log(error)
      }
    })
  },
  // 余额支付
  payYEleft(){
    var that=this
    // 判断余额是否充足,充足
    if(that.data.payYE){
      that.setData({
        yuePay:true
      })
    // 余额不足
    }else{
      wx.showToast({
        title: '余额不足',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 余额确定支付
  checkPassword(){
    var that=this
    wx.request({
      url: app.globalData.url + 'timecardbalabuy',
      header: { "token": wx.getStorageSync('token') },
      data: { uid:wx.getStorageSync('uid'),card_id:that.data.item.id, password:that.data.currentValue },
      success(res){
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
        that.onClose()
        wx.redirectTo({
          url: '/pages/discounts/discounts?newText=服务卡',
        })
      },
      fail(err){
        // console.log(err)
      },
    })
  },
  // 微信直接购买
  payWX(){ 
    var that=this
    wx.showLoading({
      title: "正在加载",
      mask: true
    })
    wx.request({
      url: app.globalData.url+"timecardbuy",
      header:{ "token": wx.getStorageSync('token') },
      method: "POST",
      data: {
        uid: wx.getStorageSync('uid'),
        card_id: that.data.item.id
      },
      success(res){
        // console.log(res)
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
            that.onClose()
            // console.log(res)
            if (res.errMsg == "requestPayment:ok") {
              wx.showToast({
                title: "购买成功",
                icon: 'none',
                duration: 2000
              })
              // 发起回调
              wx.request({
                url: app.globalData.url + "card_back",
                header: { "token": wx.getStorageSync('token') },
                method: "POST",
                data: {
                  order_sn: that.data.order_sn,
                  phone:wx.getStorageSync('chooseUser_phone'),
                  uid:wx.getStorageSync('uid')
                },
                success(res){
                  // console.log(res)
                  wx.redirectTo({
                    url: '/pages/discounts/discounts?newText=服务卡',
                  })
                },
                fail(error){
                  // console.log(error)
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
        // console.log(error)
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      allCarCity:carCity.allCarCity
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
    this.passwordBox = this.selectComponent('#addCarPopup')
    // 判断缓存中是否有车型
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
    this.setData({
      // carNumber: app.globalData.carNumber,
      cityList: app.globalData.cityList
    })
    that.panduan()
  },

  panduan(){
    var that=this
    // 判断是否获取到定位
    if(app.globalData.lat&&app.globalData.lon){
      if(app.globalData.wsid!=""&&app.globalData.wsid){
        // 获取服务卡列表
        wx.request({
          url: app.globalData.url+"timecard",
          header:{ "token": wx.getStorageSync('token') },
          method: "POST",
          data: {
            wsid: wx.getStorageSync('wsid')
          },
          success(res){
            if(res.data.code===200){
              if(res.data.data.length===0){
                that.setData({
                  isShow:true
                })
              }else{
                var data=res.data.data
                // category_car 0 轿车 1 SUV 2 MPV
                data.forEach(item=>{
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
                  item.rules=item.rules.split("@")
                })
                that.setData({
                  clip:data,
                  isShow:false
                })
              }
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
      }else{
        that.setData({
          textEmpty:"您所在的位置没有代理商运营哦",
          showNull: true,
          isShow:false
        })
      }
    }else{
      that.getPermission()
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

  },


  // 获取输入的密码
  inputChange(e) {
    let currentValue = e.detail 
    this.setData({
      currentValue
    })
  },
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
                // console.log(res)
                var wsid = res.data.data.wsid;
                var wash_station = res.data.data.station
                // 将wsid存储在app中并存储在缓存中
                getApp().globalData.wsid = wsid
                wx.setStorageSync("wsid", wsid);
                that.panduan()
            }
        })
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
                // 将经纬度存储在app的globalData中
                getApp().globalData.lat = latitude;
                getApp().globalData.lon = longitude;
                // 将经纬度和地址信息存储在缓存中
                wx.setStorageSync("lat", latitude);
                wx.setStorageSync("lon", longitude);
                wx.setStorageSync("bd_lat", latitude);
                wx.setStorageSync("bd_lng", longitude);
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
                        // console.log(res)
                        var longitude = res.longitude;
                        var latitude = res.latitude;
                        // 将经纬度存储在app的globalData中
                        getApp().globalData.lat = latitude;
                        getApp().globalData.lon = longitude;
                        // 将经纬度和地址信息存储在缓存中
                        wx.setStorageSync("lat", latitude);
                        wx.setStorageSync("lon", longitude);
                        wx.setStorageSync("bd_lat", latitude);
                        wx.setStorageSync("bd_lng", longitude);
                        that.get_wsid(longitude, latitude);
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
                // 将经纬度存储在app的globalData中
                getApp().globalData.lat = latitude;
                getApp().globalData.lon = longitude;
                // 将经纬度和地址信息存储在缓存中
                wx.setStorageSync("lat", latitude);
                wx.setStorageSync("lon", longitude);
                wx.setStorageSync("bd_lat", latitude);
                wx.setStorageSync("bd_lng", longitude);
                that.get_wsid(longitude, latitude);
                },
            });
            wx.setStorageSync("addressText", "");
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

})