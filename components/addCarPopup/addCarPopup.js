// components/addCarPopup/addCarPopup.js
const app=new getApp()
var carCity=require('../../utils/carCity.js')
// 引用百度地图微信小程序JSAPI模块
var bmap = require('../../libs/bmap-wx.js');
var txTobdMap = require('../../js/map.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    province:{type:String},
    city:{type:String},
    carType:{type:String},
    idCarType:{type:String},
    bid:{type:String},
    car_category:{type:String}
  },

  /**
   * 组件的初始数据
   */
  data: {
    city:"",//车牌号
    radio:0,//车子类型
    carLength:6,//车牌长度
    isHiddenColor:true,//颜色选择
    icon:{
      active:"../../img/noActive.png",
      noActive:"../../img/nullSelected.png"
    }
  },
  ready(){
    var that=this
    that.setData({
      allCarCity:carCity.allCarCity
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取省份简称
    getProvince(){

    },
    // 获取市ABC
    getCity(){

    },
    // 打开城市选择
    openCar: function (e) {
      let item = { showView: true }//要传给父组件的参数
      this.triggerEvent('showView', item)//通过triggerEvent将参数传给父组件
    },
    // 新能源选择
    onChange(event) {
      var that=this
      if(event.detail==that.data.radio){
        that.setData({
          radio:"",
          carLength:6
        })
      }else{
        this.setData({
          radio: event.detail,
          carLength:7
        });
      }
    },
    // 获取车牌输入框内容
    cityChange(event){ 
      var that=this
      that.setData({
        city:event.detail.value.toUpperCase()
      })
    },
    // 跳转车型选择
    toPlateNum(){
      this.setData({
        isHiddenColor: true
      })
      wx.navigateTo({
        url: '/pages/plateNumber/plateNumber',
      })
    },
    //车辆颜色打开,车身颜色输入
    opColor(){
      this.setData({
        isHiddenColor:false
      })
      this.triggerEvent('marginTop', "350rpx")//通过triggerEvent将参数传给父组件
    },
    // 输入框上移动
    marginTop(){
      this.triggerEvent('marginTop', "350rpx")//通过triggerEvent将参数传给父组件
    },
    closeColor(){
      this.setData({
        isHiddenColor:true
      })
    },
    // 颜色输入框失焦
    blurColor(){
      this.triggerEvent('marginTop', "")//通过triggerEvent将参数传给父组件
    },
    marginTopNo(){
      this.triggerEvent('marginTop', "")//通过triggerEvent将参数传给父组件
    },
    colorChange(event){
      var that=this
      that.setData({
        carColor:event.detail.value,
      })
    },
    // 颜色选择
    colorQue(e){
      this.setData({
        isHiddenColor: true,
        carColor:e.currentTarget.dataset.item,
      })
    },
    // 添加车辆
    finish(){
      var that=this
      that.setData({
        isHiddenColor:true,
      })
      if((that.data.province+that.data.city).length!=7&&(that.data.province+that.data.city).length!=8){
        app.showToast("车牌长度不对")
        return
      }else if(that.data.carType=="请选择您的品牌车型"||that.data.carType==""){
        app.showToast("请选择您的品牌车型")
        return
      }else if(that.data.carColor==""||!that.data.carColor){
        app.showToast("请填写您的车身颜色")
        return
      }else{
        wx.request({
          url: app.globalData.url+"add_car",
          header:{ "token": wx.getStorageSync('token') },
          method: "POST",
          data:{
            car_color:that.data.carColor,//车辆颜色
            brand_secont:that.data.idCarType,//车系id
            bid:that.data.bid,//品牌id
            car_number:that.data.province+that.data.city,//车牌号
            category_car:that.data.car_category,//车型
            car_gear:that.data.radio==1?1:0,//是否为新能源
            default:1,//是否为默认车型
            id:"",//车辆id
            uid:wx.getStorageSync('uid'),//用户id
          },
          success(res){
            if(res.data.code==200){
              that.triggerEvent('onClose', false)//通过triggerEvent将参数传给父组件
              // wx.navigateTo({
              //   url: '/pages/carList/carList',
              // })
              wx.removeStorageSync('carType')
            }else if(res.data.code==401){
              console.log("请退出登录")
            }else{
              app.showToast(res.data.msg)
            }
          },
          fail(err){
            app.showToast(err.data.msg)
          },
        })
      }
    },
  },
  created(){
    var that=this
    // 创建时获取颜色
    wx.request({
      url: app.globalData.url+'get_colors',
        success : res => {
            that.setData({
                chooseColor : res.data.data
            })
        }
    })
    // 获取当前城市简称
    var that=this
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
        };
        var success = function (data) {
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
  }
})
