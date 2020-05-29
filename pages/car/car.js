// pages/car/car.js
const app=getApp();
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
        carZm: [],
        car: [],
        carType: [],
        cityList: [
            { name: "京" }, { name: "津" }, { name: "冀" }, { name: "晋" }, { name: "蒙" },
            { name: "辽" }, { name: "吉" }, { name: "黑" }, { name: "沪" }, { name: "苏" },
            { name: "浙" }, { name: "皖" }, { name: "闽" }, { name: "赣" }, { name: "鲁" },
            { name: "豫" }, { name: "鄂" }, { name: "湘" }, { name: "粤" }, { name: "桂" },
            { name: "琼" }, { name: "渝" }, { name: "川" }, { name: "黔" }, { name: "滇" },
            { name: "藏" }, { name: "陕" }, { name: "甘" }, { name: "青" }, { name: "宁" },
            { name: "新" }, { name: "台" }, { name: "港" }, { name: "澳" }
        ],
        carNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        chooseColor : [],
        chooseType:["轿车","SUV","MPV"],
        city: "浙",
        showView: false,
        carH: "",
        carColor: '',
        carP: '',
        optionsObj : '',
        carType2 : '',
        carId : '',
        carView : false ,
        carChooseNumber : '',
        colorView : false ,
        carChepai : '',
        popupShow:false,//下弹出层
        popupShow2:false,//车型
    },
    onLoad: function (options) {
        let that = this;
        console.log(options)
        if (options.obj){
            let optionsObj = JSON.parse(options.obj)
          console.log(options, optionsObj.id)
            that.setData({
                carH: optionsObj.car_number.substring(1,7),
                carChepai: optionsObj.car_number.substring(1, 7),
                city: optionsObj.car_number.substring(0, 1),
                carColor: optionsObj.car_color,
                carType: options.type,
                carId: optionsObj.id,
                carType2:optionsObj.car_category==0?'轿车':optionsObj.car_category==1?'SUV':'MPV',
                carTypeId: optionsObj.car_category
            })
        }
        wx.request({
          url: app.globalData.url+'get_colors',
            success : res => {
                that.setData({
                    chooseColor : res.data.data
                })
            }
        })

    },
    // 城市选择
    changeCar: function (e) {
        let that = this;
        if (e.currentTarget.dataset.id) {
            that.setData({
                city: e.currentTarget.dataset.id
            })
        }
        that.setData({
            showView: (!that.data.showView),
            carView: !that.data.carView
        })
    },
    // 打开城市选择
    openCar : function (e){
        let that = this;
        that.setData({
            carView : false ,
            colorView: false,
            showView: (!that.data.showView)
        })
    },
    // 打开车牌选择
    openCarNumber (e){
        let that = this;
        if (that.data.carH >= 6){
            that.setData({
                carH : ''
            })
        }
        that.setData({
            carView: !that.data.carView,
            colorView: false,            
        })
    },
    // 点击车牌添加
    chooseCar(e){
        let that = this;
        if (e.currentTarget.dataset.id) {
          that.setData({
            carH: that.data.carH + e.currentTarget.dataset.id
          })
        }
        // if (that.data.carChepai.length >= 6) {
        //     that.setData({
        //         carH: '',
        //         carChepai : '',
        //         colorView : false ,
        //         carView: false,
        //         carH: '' + e.currentTarget.dataset.id+''
        //     })

        // } else if (that.data.carH.length < 6){

        //     if (e.currentTarget.dataset.id) {
        //         that.setData({
        //             carH: that.data.carH + e.currentTarget.dataset.id
        //         })
        //     }
        //     if (that.data.carH.length == 6) {
        //         that.setData({
        //             colorView: false,
        //             carView: false,
        //             carView: !that.data.carView
        //         })
        //     }
        // }else{ 
        //     that.setData({
        //         carH: '',
        //         carChepai: '',
        //         carH: '' + e.currentTarget.dataset.id + ''
        //     })
        // }
    },
    // 打开车辆颜色选择
    openCarColor(e){
        let that = this ;
        that.setData({
            showView : false ,
            carView : false ,
            popupShow: true
        })
    },

    openCarType(){
        var that=this
        that.setData({
            popupShow2:true,
        })
    },
    onClose(){
        this.setData({
            popupShow:false,
            popupShow2:false,
        })
    },
    // 车辆颜色选择
    // chooseColor(e){
    //     let that = this;

    //     if (e.currentTarget.dataset.id) {
    //         that.setData({
    //             carColor: e.currentTarget.dataset.id
    //         })
    //     }
    //     that.setData({
    //         colorView: (!that.data.colorView)
    //     })
    // },
    onConfirm(event) {
        const { picker, value, index } = event.detail;
        this.setData({
            carColor: value,
            popupShow:false
        })
    },
    onConfirm2(event){
        const { picker, value, index } = event.detail;
        this.setData({
            carType2:value,
            carTypeId:index,
            popupShow2:false
        })
    },
    // 车牌删除
    delCar(e){
        let that = this ;
        if(that.data.carH.length > 0){
            that.setData({
                carH : that.data.carH.substring(0,that.data.carH.length - 1)
            })
        }
    },
    // 车牌确定
    btnCar: function () {
      var that = this;
      that.setData({
        colorView: false,
        carView: false,
        carView: !that.data.carView
      })
      //判断车牌信息
      if(!that.isLicensePlate(that.data.city+that.data.carH)){
          console.log("车牌不正确");
          wx.showToast({
            title: '请输入正确车牌号',
            icon: 'none',
            duration: 2000
          })
      }
    },

    // 正则验证车牌,验证通过返回true,不通过返回false
    isLicensePlate(str) {
        return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领黔滇台][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
    },
    finish: function (e) {
        let that = this;
        //判断车牌信息
        if(!that.isLicensePlate(that.data.city+that.data.carH)){
            console.log("车牌不正确");
            wx.showToast({
                title: '请输入正确车牌号',
                icon: 'none',
                duration: 2000
            })
        }else{      
            var car_number = that.data.city + e.detail.value.carH
            const stringCar = that.data.city + e.detail.value.carH + e.detail.value.carP + e.detail.value.carColor
            let myToken = wx.getStorageSync("token");
            wx.setStorageSync('car_color', e.detail.value.carColor)
            wx.setStorageSync('car_number', car_number)
            if(that.data.carType == 1){
              console.log(that.data.carId)
                wx.request({
                url: app.globalData.url+'add_car',
                    header: { "token": myToken },
                    data: { car_color: e.detail.value.carColor, brand: '', car_number: car_number, id: that.data.carId,category_car:that.data.carTypeId},
                    success: function (res) {
                        console.log(res)
                        wx.redirectTo({
                            url: "../carList/carList"
                        })
                    }
                })
            }else{
                wx.request({
                url: app.globalData.url+'add_car',
                    header: { "token": myToken },
                    data: { car_color: e.detail.value.carColor, brand: '', car_number: car_number,category_car:that.data.carTypeId,id:'' },
                    success: function (res) {
                        console.log(res)
                        wx.setStorageSync("myCar_id", res.data.data.id)
                        wx.redirectTo({
                            url: "../carList/carList"
                        })
                    }
                })
            }
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
    }
})