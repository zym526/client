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
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    typeId : '',
    showMap: true,
    pois: [],
    del: true,
    addressText : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      typeId: options.id
    })
    // 根据微信  获取当前经纬度
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude

        that.setData({
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
  gcj02tobd09: function (lng, lat){
    var that = this;
    wx.setStorageSync('bd_lng', lng);
    wx.setStorageSync('bd_lat', lat);
  },

  // 暂无用处
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },

  // 拖拽调用
  regionchange(e) {
    var that = this;
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end') {
      that.mapCtx.getCenterLocation({
        success: function (res) {
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
    that.gcj02tobd09(bd_lon, bd_lat);
    bd_lat = wx.getStorageSync("bd_lat");
    bd_lon = wx.getStorageSync("bd_lng");
    var string = "" + bd_lon + "," + bd_lat + ""
    wx.setStorageSync("lon", bd_lon)
    wx.setStorageSync("lat", bd_lat)
    wx.request({
      url: app.globalData.url+'get_location',
      data: { location: string, lat: bd_lat, lon: bd_lon },
      success: function (res) {
        console.log("map_data")
        console.log(res.data.data);
        var address = JSON.parse(JSON.stringify(res.data.data))
        var address2=JSON.parse(JSON.stringify(res.data.data))
        that.setData({
          address: address.regeocode.addressComponent.province+address.regeocode.addressComponent.city+address.regeocode.addressComponent.district+address.regeocode.addressComponent.streetNumber.street+address.regeocode.addressComponent.streetNumber.number
        })
        // 发起POI检索请求
        let newString = "" + bd_lat + "," + bd_lon + ""
        console.log("发起检索")
        BMap.regeocoding({
          "query": address.regeocode.addressComponent.province+address.regeocode.addressComponent.city+address.regeocode.addressComponent.districe+address.regeocode.addressComponent.streetNumber.street+address.regeocode.addressComponent.streetNumber.number,
          "location": newString,
          "pois": 1,
          success: function (data) {
            console.log(data)
            that.setData({
              pois: data.originalData.result.pois
            })
          },
        });
        wx.request({
          url: app.globalData.url+'get_bd_wash_station',
          data: { latitude: bd_lat, longitude: bd_lon, lat: bd_lat, lon: bd_lon},
          success: function (res) {
            console.log("get_bd_wash_station", bd_lat, bd_lon,res)
            // console.log("get_bd_wash_station",res)
            if (res.data.code == 2) {
              that.setData({
                offOn: "该位置没有服务站点，请选择其他位置"
              })
            } else {
              that.setData({
                offOn: res.data.data.station
              })

              wx.setStorageSync("wsid", res.data.data.wsid)
            }
          }
        })
      }
    })
  },

  listenerPhoneInput : function (){
    let that = this ;
    that.setData({
      address: ''
    })
  },

  // input实时监控
  bindKeyInput: function (e) {
    var that = this;
    that.setData({
      sugData: "",
      del: true
    });
    that.setData({
      inputAddress: e.detail.value
    })
    that.setData({
      showView: true,
      showMap: false
    })
    // 发起suggestion检索请求
    wx.getStorageSync("myCity")
    let myCity = wx.getStorageSync("myCity")
    BMap.suggestion({
      query: e.detail.value,
      region: myCity,
      city_limit: true,
      success: function (data) {
        that.setData({
          sugData: data.result
        });
      }
    });
  },

  // 删除
  del: function () {
    this.setData({
      address: "",
      showView: false,
      showMap: true,
      del: false,
      sugData: ''
    })
    let that = this;
    if (that.data.sugData == "") {
      let searchList = wx.getStorageSync('searchList');
      this.setData({
        address: "",
        showView: true,
        showMap: false,
        del: false,
        sugData: searchList
      })
    }
  },
  
  getLon: function (e, lat, lng) {
    let that = this;
    that.setData({
      nigList: '',
      del: true,
      addressText: e.currentTarget.dataset.name
    })
    that.getLngLat(e.currentTarget.dataset.lng, e.currentTarget.dataset.lat)
    that.setData({
      showView: false,
      showMap: true
    })
  },
  //搜索
  search: function () {
    let that = this;
    let lng = "";
    let lat = '';
    that.setData({
      nigList: ''
    })
    wx.getStorageSync('searchList');

    BMap.regeocoding({
      success: function (res) {
        BMap.search({
          "query": that.data.inputAddress,
          success: function (res) {
            if (res.wxMarkerData.length != 0) {
              let newArray = [];
              lng = res.originalData.results[0].location.lng
              lat = res.originalData.results[0].location.lat
              that.getLngLat(lng, lat)
              that.setData({
                showView: false,
                showMap: true
              })
              for (let i = 0; i < res.wxMarkerData.length && i < 3; i++) {
                newArray.push(res.originalData.results[i])
              }
              console.log(newArray)
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
  trueAddress: function () {
    let that = this;

    let addressText = ''
    if(that.data.addressText == ''){
        addressText = that.data.pois[0].name ;
    }else{
        addressText = that.data.addressText ;
    }
    wx.setStorageSync('addressText', that.data.address)
    wx.setStorageSync('addressText', that.data.address + "-" + addressText)
    if (that.data.offOn != "该位置没有服务站点，请选择其他位置") {
      if (that.data.typeId == 1) {
        wx.redirectTo({
          url: '../goodsDetail/goodsDetail',
        })
      } else if(that.data.typeId == 2){
        wx.reLaunch({
          url: '/pages/entrance/entrance?map='+1,
        })
      }
      // else {
      //   wx.redirectTo({
      //     url: '../orderDetail/orderDetail',
      //   })
      // }

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