const app=getApp();
// pages/index/index.js
Page({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        category: 1,
        winWidth: 0,
        winHeight: 0,
        // tab切换  
        currentTab: 0,
        open: false,
        coverDisplay: false,
        classColor: -1,
        classOther: -1,
        classs: -1,
        classvtb: -1,
        priceListDisplay: 1,
        activeNew: false,
        titleList: [],
        list: [],
        session: '',
        iv: '',
        data: '',
        lon: '',
        lat: '',
        all: {},
        firstId: '',
        selectId: '',
        currentCity: "",
        showNull: false,
        userInfos: false,
        huakuai:false,//滑块函数触发
        textEmpty:"",//空白页提示信息
    },

    onLoad: function (options) {
        let that = this;
        // 获取当前tabbar的数据
        that.setData({
            currentTab: options.currentTab,
            category: options.category
        });
        // 请求tab
        that.get_service()
        // 获取系统信息
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });
    },


    // 点击导航时触发
    swichNav: function (e) {
        var that = this;
        wx.showLoading({title: '加载中', mask: true})
        if (that.data.currentTab === e.target.dataset.index) {
            return false;
        } else {
            // 如果点击的导航不同则存储index和将数据清空
            that.setData({
                currentTab: e.target.dataset.index,
                list:[]
            })
            // 点击导航时将滑块锁定
            that.data.huakuai=true,
            // 请求当前tab的数据
            wx.request({
                url: app.globalData.url+'service_list_with_category_type',
                dataType: "json",
                data: {
                    lon: getApp().globalData.lon,
                    lat: getApp().globalData.lat,
                    type_id: e.target.dataset.id,
                    wsid: getApp().globalData.wsid,
                    category: that.data.category
                },
                success: function (res) {
                    // 当请求结束时将滑块解锁
                    that.data.huakuai =false
                    if (res.data.data == "") {
                        that.setData({
                            showNull: true,
                            list:[]
                        })
                    }else{
                        that.setData({
                            showNull:false,
                            list: res.data.data
                        })
                    }
                    wx.hideLoading()
                }
            })
        }
    },

    // 滑块改变的额时候触发
    bindChange: function (e) {
        var that = this;
        if(that.data.huakuai){
            return
        }
        wx.showLoading({title: '加载中', mask: true})

        that.setData({currentTab: e.detail.current});
        for (let i = 0; i < that.data.titleList.length; i++) {
            if (e.detail.current == i) {
                wx.request({
                    url: app.globalData.url+'service_list_with_category_type',
                    dataType: "json",
                    data: {
                        lon: getApp().globalData.lon,
                        lat: getApp().globalData.lat,
                        type_id: that.data.titleList[i].id,
                        category: that.data.category,
                        wsid: getApp().globalData.wsid
                    },
                    success: function (res) {
                        // 如果返回数据为空，则清空数据
                        if (res.data.data == '') {
                            that.setData({
                                showNull: true,
                                list: []
                            })
                        } else {
                            that.setData({
                                showNull: false,
                                list: res.data.data
                            })
                        }
                        wx.hideLoading()
                    }
                })
            }
        }
    },

    // 无调用
    tap_ch: function (e) {
        if (this.data.open) {
            this.setData({
                open: false,
                coverDisplay: false
            });
        } else {
            this.setData({
                open: true,
                coverDisplay: true
            });
        }
    },

    // 点击商品触发
    goDetail: function (event) {
        // 存储点击数据信息
        this.setData({
            all: event.currentTarget.dataset.all
        })
        // wx.setStorageSync("dataAll", JSON.stringify(this.data.all))//将当前点击数据存储在缓存中
        // wx.setStorageSync("category", this.data.all.category)
        wx.setStorageSync('fuwuId', this.data.all.id)//将该服务id存储在缓存中
        // 跳转页面
        wx.navigateTo({
            url: '../goodsDetail/goodsDetail?all=' + JSON.stringify(this.data.all),
        })
    },
    toDetailAll(event){
        // 存储点击数据信息
        this.setData({
            all: event.currentTarget.dataset.all
        })
        wx.setStorageSync('fuwuId', this.data.all.id)//将该服务id存储在缓存中
        // 跳转页面
        wx.navigateTo({
            url: '../detailPage/detailPage?all=' + JSON.stringify(this.data.all),
        })
    },

    // 请求数据
    loadCity: function (longitude, latitude) {
        var page = this
        // 请求tab下的数据
        wx.request({
            url: app.globalData.url+'service_list_with_category_type',
            dataType: "json",
            data: {
                lon: longitude,
                lat: latitude,
                longitude: longitude,
                latitude: latitude,
                type_id: page.data.firstId,
                category: page.data.category,
                wsid: getApp().globalData.wsid
            },
            success: function (res) {
                if (res.data.data == "") {
                    page.setData({
                        showNull: true,
                    })
                }
                wx.hideLoading()
                // 将请求到的数据存储
                page.setData({
                    showNull: false,
                    list: res.data.data
                })
            }
        })
    },

    // 进入求情tab
    get_service: function () {
        var that = this;
        // 如果有经纬度并且有wsid时请求数据
        if(app.globalData.lat&&app.globalData.lon){
            if(app.globalData.wsid!=""&&app.globalData.wsid){
                // 请求tab列表
                wx.request({
                    url: app.globalData.url+'service_category_types',
                    dataType: "json",
                    data: {
                        category: that.data.category,
                        lon: getApp().globalData.lon,
                        lat: getApp().globalData.lat,
                        wsid: getApp().globalData.wsid
                    },
                    success: function (res) {
                        console.log("获取tab",res)
                        that.setData({
                            firstId: res.data.data[that.data.currentTab].id,//导航id
                            titleList: res.data.data//导航列表
                        })
                        that.loadCity(getApp().globalData.lon, getApp().globalData.lat)
                    }

                });
            }else{
                console.log("没有wsid")
                that.setData({
                    textEmpty:"您所在的位置没有代理商运营哦",
                    showNull: true,
                })
            }  
        // 如果没有经纬度则做请求
        }else{
            that.getPermission()
        }
        
    },

    // 进入我的订单
    goOrderList: function () {
        wx.switchTab({
            url: '../orderList/orderList',
        })
    },

    /**
     * 组件的方法列表
     */
    methods: {},


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
                console.log(res)
                var wsid = res.data.data.wsid;
                var wash_station = res.data.data.station
                // 将wsid存储在app中并存储在缓存中
                getApp().globalData.wsid = wsid
                wx.setStorageSync("wsid", wsid);
                that.get_service()
            }
        })
    },
    // 打开权限获取当前地理位置
    openMap: function () {
        let that = this;
        // 微信获取用户当前权限
        wx.getSetting({
        success(res) {
            console.log("map_success:",res)
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
                        console.log(res)
                        var longitude = res.longitude;
                        var latitude = res.latitude;
                        // 将经纬度存储在app的globalData中
                        getApp().globalData.lat = latitude;
                        getApp().globalData.lon = longitude;
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
                            console.log("授权取消！")
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
                console.log("窗口失败")
            }
            })
        }
        })
        that.openMap();
    },


})
