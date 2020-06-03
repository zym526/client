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
    city:{type:String}
  },

  /**
   * 组件的初始数据
   */
  data: {
    city:"",//车牌号
    radio:0,//车子类型
    carLength:6,//车牌长度
    isHiddenColor:true,//颜色选择
    carPlate:"请选择您的品牌车型",//车型
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
      console.log(event)
      var that=this
      that.setData({
        city:event.detail.value
      })
    },
    // 跳转车型选择
    toPlateNum(){
      wx.navigateTo({
        url: '/pages/plateNumber/plateNumber',
      })
    },
    //车辆颜色打开,车身颜色输入
    opColor(){
      this.setData({
        isHiddenColor:false
      })
    },
    // 颜色输入框失焦
    blurColor(){
      this.setData({
        isHiddenColor:true
      })
    },
    colorChange(event){
      var that=this
      that.setData({
        carColor:event.detail.value,
      })
    },
    // 颜色选择
    colorQue(e){
      console.log(e)
      this.setData({
        carColor:e.currentTarget.dataset.item
      })
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
          console.log(data)
          console.log("获取城市失败")
        };
        var success = function (data) {
          console.log("获取城市信息成功",data)
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
