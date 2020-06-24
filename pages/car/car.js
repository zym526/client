// pages/car/car.js
const app=getApp();
import Dialog from '../../dist/dialog/dialog';
var carCity=require('../../utils/carCity.js')
var txTobdMap = require('../../js/map.js');
var bmap = require('../../libs/bmap-wx.js');
Page({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        province:"浙",
        showView:false,//地址选择
        car:"",//车牌信息
        carLength:6,//车牌长度
        radio:"",//是否为新能源
        carType:"请选择您的品牌车型",//品牌
        car_category:"",//车型
        chooseColor:[],//选择的颜色
        carColor:"",//车辆颜色
        isShow:true,//颜色隐藏
        checked:false,//是否为默认车辆
        ID:"",//车辆id
        cityList: [
            { name: "京" }, { name: "津" }, { name: "冀" }, { name: "晋" }, { name: "蒙" },
            { name: "辽" }, { name: "吉" }, { name: "黑" }, { name: "沪" }, { name: "苏" },
            { name: "浙" }, { name: "皖" }, { name: "闽" }, { name: "赣" }, { name: "鲁" },
            { name: "豫" }, { name: "鄂" }, { name: "湘" }, { name: "粤" }, { name: "桂" },
            { name: "琼" }, { name: "渝" }, { name: "川" }, { name: "黔" }, { name: "滇" },
            { name: "藏" }, { name: "陕" }, { name: "甘" }, { name: "青" }, { name: "宁" },
            { name: "新" }, { name: "台" }, { name: "港" }, { name: "澳" }
        ],
        icon:{
            active:"../../img/noActive.png",
            noActive:"../../img/nullSelected.png"
        }
    },
    onLoad: function (options) {
        var that=this
        if(options.type){
            that.setData({
                type:options.type,
            })
            // 当为1的时候是编辑则获取item
            if(options.type==1){
                console.log(JSON.parse(options.item))
                that.setData({
                    item:JSON.parse(options.item),
                    province:JSON.parse(options.item).car_number.substr(0,1),
                    carLength:JSON.parse(options.item).car_gear==1?7:6,
                    car:JSON.parse(options.item).car_number.substr(1,JSON.parse(options.item).car_number.length),
                    radio:JSON.parse(options.item).car_gear==0?'':'1',
                    checked:JSON.parse(options.item).is_defual==0?false:true,
                    carColor:JSON.parse(options.item).car_color,
                    carType:(JSON.parse(options.item).brand_name) + (JSON.parse(options.item).car_category==0?'-轿车':JSON.parse(options.item).car_category==1?'-SUV':'-MPV'),
                    ID:JSON.parse(options.item).id,
                    car_category:JSON.parse(options.item).car_category,
                    carTypeAll:{
                        id:JSON.parse(options.item).brand_secont,
                        brandid:JSON.parse(options.item).brand
                    }
                })
            }else{
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
                        console.log(province,city)
                        // 便利数组获取当前的省市车牌前两位
                        that.data.allCarCity.forEach(item=>{
                        if(item.province.indexOf(province)!=-1&&item.city.indexOf(city)!=-1){
                            that.setData({
                                province:item.code.substr(0,1),
                                car:item.code.substr(-1)
                            })
                        }else{
                            that.setData({
                                province:"浙",
                                car:"A"
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
        }
        that.setData({
            allCarCity:carCity.allCarCity
        })
    },
    onShow:function(){
        var that=this
        if(that.data.type=="1"){
          wx.setNavigationBarTitle({
            title: '编辑车辆'
          })
        }else{
          wx.setNavigationBarTitle({
            title: '添加车辆'
          })
        }
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
                carTypeAll:carType,
                carType:carType.brand_name+'-'+carType.levelname,
                car_category:car_category
            })
            console.log(that.data.carTypeAll)
        } 
        // 获取车辆颜色
        wx.request({
            url: app.globalData.url+'get_colors',
            success : res => {
                that.setData({
                    chooseColor : res.data.data
                })
            }
        })
    },
    // 打开城市选择
    openCar(){
        let that = this;
        that.setData({
            showView: (!that.data.showView)
        })
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
            showView: (!that.data.showView),
        })
    },
    // 车牌输入
    cityChange(e){
        this.setData({
            car:e.detail.value.toUpperCase()
        })
    },
    // 是否为新能源
    onChange(event){
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
    // 选择车型
    toPlate(){
        wx.navigateTo({
          url: '/pages/plateNumber/plateNumber',
        })
    },
    // 显示颜色选择
    showColor(){
        this.setData({
            isShow:false
        })
    },
    // 失焦则隐藏颜色选择
    loseColor(){
        this.setData({
            isShow:true
        })
    },
    // 实时监听车身颜色
    colorChange(e){
        this.setData({
            isShow:false,
            carColor:e.detail.value,
        })
    },
    // 点击选择颜色添加
    getColor(e){
        this.setData({
            isShow:true,
            carColor:e.currentTarget.dataset.item,
        })
    },
    // 设置默认车辆
    changeDef(){
        this.setData({
            checked:!this.data.checked
        })
    },
    // 添加或编辑
    addCarTwo(){
        var that=this
        that.setData({
            car:that.data.car.toUpperCase()
        })
        // if((that.data.province+that.data.car).length<7){
        //     app.showToast("车牌信息错误")
        //     return
        // }else 
        if(that.data.carType=="请选择您的品牌车型"||that.data.carType==""){
            app.showToast("请选择您的品牌车型")
            return
        }else if(that.data.carColor==""){
            app.showToast("请填写您的车身颜色")
            return
        }else{
            // type：0为添加，1为编辑
            var data
            wx.request({
                url: app.globalData.url+"add_car",
                header:{ "token": wx.getStorageSync('token') },
                method: "POST",
                data:{
                    car_color:that.data.carColor,//车辆颜色
                    brand_secont:that.data.carTypeAll.id,//车系id
                    bid:that.data.carTypeAll.brandid,//品牌id
                    car_number:that.data.province+that.data.car,//车牌号
                    category_car:that.data.car_category,//车型
                    car_gear:that.data.radio==1?1:0,//是否为新能源
                    default:that.data.checked?1:0,//是否为默认车型
                    id:that.data.ID,//车辆id
                    uid:wx.getStorageSync('uid'),//用户id
                },
                success(res){
                    if(res.data.code==200){
                        wx.redirectTo({
                          url: '/pages/carList/carList',
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
    },
    // 删除车辆
    delCar(){
        var that=this
        Dialog.confirm({
          message: '您确定要删除此车辆信息吗？',
        }).then(() => {
          wx.request({
            url: app.globalData.url+"delete_car",
            header:{ "token": wx.getStorageSync('token') },
            method: "POST",
            data: {
              id:that.data.ID,//车辆id
            },
            success(res){
              // 如果成功
              if(res.data.code==200){
                app.showToast("删除成功")
                setTimeout(function(){ 
                  wx.redirectTo({
                    url: '/pages/carList/carList',
                  })
                 }, 1000);
              }else{
                app.showToast(res.data.code)
              }
            },
            fail(err){
              app.showToast(err.data.msg)
            }
          })
        }).catch(() => {
        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
    }
})
