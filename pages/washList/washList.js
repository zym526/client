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
    methods: {}
})
