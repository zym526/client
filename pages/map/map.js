var bmap = require('../../libs/bmap-wx.js');
// var bmapaddress = require('../../libs/baidu_address.js');
var txTobdMap = require('../../js/map.js');
var wxMarkerData = [];
var app = getApp()
var BMap = new bmap.BMapWX({
  // ak: '6tBFv1u228awbjW4lNhbYxTtQHBKvNCy'
  ak:'NnxYM3KVSX3yAwArHsaxldeHPuUSeQ9B'
});

Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [],//标点位置
    // 经纬度
    latitude: '',
    longitude: '',
    // 检索出来的数据
    pois: [],
    del: true,//搜索的删除按钮
    addressText : '',//当前选择位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.topOrBottom,options)
    // 如果type为1则显示，否则隐藏则有默认位置，显示当前和默认按钮
    if(options.type==1){
      that.setData({
        type: options.type,//从哪里跳转过来的？type为1时显示默认和当前，为0时隐藏
        topOrBottom:"top",
        isShowAddress:false
      })
    }else{
      that.setData({
        type: options.type,//从哪里跳转过来的？type为1时显示默认和当前，为0时隐藏
        isShowAddress:true
      })
    }
    // 根据微信  获取当前经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        // 将获取到的当前位置的经纬度存储起来，并标点
        wx.setStorageSync('bd_lat', res.latitude)
        wx.setStorageSync('bd_lng', res.longitude)
        if(app.globalData.morenLat==""||app.globalData.morenLon==""){
          that.setData({
            morenLat:wx.getStorageSync('lat'),//默认位置的经纬度
            morenLon:wx.getStorageSync('lon'),//默认位置的经纬度
          })
          app.globalData.morenLon=wx.getStorageSync('lon')
          app.globalData.morenLat=wx.getStorageSync('lat')
        }else{
          that.setData({
            morenLat:app.globalData.morenLat,//默认位置的经纬度
            morenLon:app.globalData.morenLon,//默认位置的经纬度
          })
        }
        that.setData({
          dangqianLat:latitude,//当前位置的经纬度
          dangqianLon:longitude,//当前位置的经纬度
          longitude: longitude,
          latitude: latitude,
          markers: [
            {
              id: 0,
              iconPath: "../../img/wxd.png",
              longitude: longitude,
              latitude: latitude,
              width: 0,
              height: 0
            }
          ]
        })
        that.mapCtx = wx.createMapContext("map");
        // 获取站点
        that.bd_decrypt(longitude, latitude)
      }
    })
  },

  // 将经纬度存入缓存bg_lat，bd_lng
  // gcj02tobd09: function (lng, lat){
  //   var that = this;
  //   wx.setStorageSync('bd_lng', lng);
  //   wx.setStorageSync('bd_lat', lat);
  // },

  // 暂无用处
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },
  // 当前位置
  addressDangqain(){
    var that=this
    that.setData({
      topOrBottom:'top',
      markers: [
        {
          id: 0,
          iconPath: "../../img/wxd.png",
          longitude: that.data.dangqianLon,
          latitude: that.data.dangqianLat,
          width: 0,
          height: 0
        }
      ]
    })
    that.mapCtx = wx.createMapContext("map");
    // 获取站点
    that.bd_decrypt(that.data.dangqianLon, that.data.dangqianLat)
    that.getLngLat(that.data.dangqianLon, that.data.dangqianLat)
  },
  // 默认位置
  addressMoren(){
    var that=this
    that.setData({
      topOrBottom:'bottom',
      markers: [
        {
          id: 0,
          iconPath: "../../img/wxd.png",
          longitude: that.data.morenLon,
          latitude: that.data.morenLat,
          width: 0,
          height: 0
        }
      ]
    })
    that.mapCtx = wx.createMapContext("map");
    // 获取站点
    that.bd_decrypt(that.data.morenLon, that.data.morenLat)
    that.getLngLat(that.data.morenLon, that.data.morenLat)
  },

  // 拖拽调用
  regionchange(e) {
    var that = this;
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end') {
      that.mapCtx.getCenterLocation({
        success: function (res) {
          // console.log(res)
          wx.setStorageSync('bd_lat', res.latitude)
          wx.setStorageSync('bd_lng', res.longitude)
          that.mapCtx.translateMarker({
            markerId: 0,
            duration: 500,
            autoRotate:false,
            destination: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
            animationEnd() {
              // 获取站点
              that.bd_decrypt(res.longitude, res.latitude)
            }
          })
        }
      });
    }
  },

  //移动选址组件
  getLngLat: function (lon, lat,e) {
    var that = this;
    that.mapCtx = wx.createMapContext("map");
    that.mapCtx.getCenterLocation({
      success: function (res) {
        if (lon) {
          wx.setStorageSync('bd_lat', lat)
          wx.setStorageSync('bd_lng', lon)
          that.setData({
            longitude: lon,
            latitude: lat,
            markers: [
              {
                id: 0,
                iconPath: "../../img/wxd.png",
                longitude: lon,
                latitude: lat,
                width: 0,
                height: 0
              }
            ]
          })
          that.bd_decrypt(lon, lat)
        } else {
          wx.setStorageSync('bd_lat', res.latitude)
          wx.setStorageSync('bd_lng', res.longitude)
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
            markers: [
              {
                id: 0,
                iconPath: "../../img/wxd.png",
                longitude: res.longitude,
                latitude: res.latitude,
                width: 0,
                height: 0
              }
            ]
          })

          that.bd_decrypt(res.longitude, res.latitude)
        }
      }
    })
  },

  //换取地址；是否有站点
  bd_decrypt: function (bd_lon, bd_lat) {
    let that = this;
    // 存储经纬度，两种名字
    var string = "" + bd_lon + "," + bd_lat + ""
    wx.request({
      url: app.globalData.url+'get_location',
      data: { location: string, lat: bd_lat, lon: bd_lon },
      success: function (res) {
        // console.log(res.data.data);
        var address = JSON.parse(JSON.stringify(res.data.data))
        var address2=JSON.parse(JSON.stringify(res.data.data))
        that.setData({
          address:address.regeocode.formatted_address,
          nowCity:address.regeocode.addressComponent.province
        })
        // 发起POI检索请求
        let newString = "" + bd_lat + "," + bd_lon + ""
        // console.log("发起检索")
        BMap.regeocoding({
          "query":address.regeocode.formatted_address,
          "location": newString,
          "pois": 1,
          success: function (data) {
            // console.log(data)
            that.setData({
              pois: data.originalData.result.pois
            })
          },
        });
        wx.request({
          url: app.globalData.url+'get_bd_wash_station',
          data: { latitude: bd_lat, longitude: bd_lon, lat: bd_lat, lon: bd_lon},
          success: function (res) {
            // console.log("get_bd_wash_station", bd_lat, bd_lon,res)
            if (res.data.code == 2) {
              that.setData({
                offOn: "该位置没有服务站点，请选择其他位置"
              })
            } else {
              that.setData({
                offOn: res.data.data.station,
                wsid:res.data.data.wsid,
              }) 
            }
          }
        })
      }
    })
  },
  // 顶部搜索框点击置空
  listenerPhoneInput : function (){
    let that = this ;
    that.setData({
      address: ''//将输入框和当前位置置空
    })
  },

  // 顶部input实时监控
  bindKeyInput: function (e) {
    var that = this;
    that.setData({
      sugData: "",//数据置空
      del: true,//删除按钮显示
      inputAddress: e.detail.value,//输入内容
      showView: true,//搜索出的数据显示
    });
    // 发起suggestion检索请求
    BMap.suggestion({
      query: e.detail.value,
      region:that.data.nowCity,//要获取当前的省份
      city_limit: true,
      success: function (data) {
        that.setData({
          sugData: data.result//搜索除的数据
        });
      }
    });
  },

  // 输入框删除
  del: function () {
    this.setData({
      address: "",//输入框内容置空
      showView: false,
      del: false,//删除按钮隐藏
      sugData: ''//检索内容置空
    })
  },
  // 地址选择
  getLon: function (e, lat, lng) {
    let that = this;
    that.setData({
      del: true,
      addressText: e.currentTarget.dataset.name
    })
    that.getLngLat(e.currentTarget.dataset.lng, e.currentTarget.dataset.lat)
    that.setData({
      showView: false,
    })
  },
  //搜索
  search: function () {
    let that = this;
    let lng = "";
    let lat = '';
    BMap.regeocoding({
      success: function (res) {
        // console.log(res,that.data.inputAddress)
        BMap.search({
          "query": that.data.inputAddress,
          success: function (res) {
            // console.log(res)
            if (res.wxMarkerData.length != 0) {
              let newArray = [];
              lng = res.originalData.results[0].location.lng
              lat = res.originalData.results[0].location.lat
              that.getLngLat(lng, lat)
              that.setData({
                showView: false,
              })
              for (let i = 0; i < res.wxMarkerData.length && i < 3; i++) {
                newArray.push(res.originalData.results[i])
              }
              // console.log(newArray)
              that.setData({
                pois: newArray
              })
            }else{
              wx.showToast({
                title: '未检索到附近地址',
                icon: 'none',
                duration: 2000
              })
            }
          },
        });
      },
    });
  },
  // 确认地址
  trueAddress: function () {
    let that = this;
    if (that.data.offOn != "该位置没有服务站点，请选择其他位置") {
      let addressText = ''
      if(that.data.addressText == ''){
          addressText = that.data.pois[0].name ;
      }else{
          addressText = that.data.addressText ;
      }
      wx.setStorageSync('addressText', that.data.address + "-" + addressText)
      // 在拖拽/点击/搜索等情况下将经纬度存储在缓存中，如果点击确定则将两个经纬度相同
      wx.setStorageSync('lat', wx.getStorageSync('bd_lat'))
      wx.setStorageSync('lon', wx.getStorageSync('bd_lng'))
      // 返回上一页的时候判断缓存中lat和bd_lat，lon和bd_lng是否相同，不管何时都使用lat和lon
      // if(that.data.type==1){
        app.globalData.nowIndex=1
      // }
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
          title: '该位置没有服务站点',
          icon: 'none',
          duration: 2000
      })
    }
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