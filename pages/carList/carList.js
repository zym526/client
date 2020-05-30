// pages/carList/carList.js
const app=getApp()
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
        carList: [],
        key: false,
        startX : 0,
        startY :0,
        getInputValue:""
    },
    onLoad: function (options) {
        let that = this;
        console.log(app.globalData.getInputValue)
        // if(app.globalData.getInputValue!=""){
            that.setData({
                getInputValue:app.globalData.getInputValue
            })
        // }
        // if(options.getInputValue&&options.getInputValue!==""){
        //     that.setData({
        //         getInputValue:options.getInputValue
        //     })
        // }
        wx.showLoading({
            title: "正在加载",
            mask: true
        })
        let myToken = wx.getStorageSync("token");
        wx.request({
            url: app.globalData.url+'get_my_cars',
            header: { "token": myToken },
            success: res => {
                console.log(res)
                let carStr = ''
                for (let i = 0; i < res.data.data.length; i++) {
                    let str = JSON.stringify(res.data.data[i]);
                    str = str.substring(0, str.length - 1);
                    str = str + ',"isTouchMove":false},';
                    carStr = carStr + str

                }
                carStr = carStr.substring(0, carStr.length - 1);
                carStr = JSON.parse('[' + carStr + ']')
                that.setData({
                    carList: carStr
                })
                console.log(that.data.carList)
                wx.hideLoading()
            }
        })
    },
    selectCar: function (e) {
        let that = this;
        console.log(e)
        wx.setStorageSync("selectCar", e.currentTarget.dataset.item)
        // wx.setStorageSync("car_color", e.currentTarget.dataset.carcolor)
        wx.setStorageSync("car_number", e.currentTarget.dataset.carnumber)
        wx.setStorageSync("selectCarId", e.currentTarget.dataset.carid)
        wx.setStorageSync('car_category', e.currentTarget.dataset.carcategory)
        wx.redirectTo({
            url: '../goodsDetail/goodsDetail?recently=1&remark='+that.data.getInputValue
        })
    },
    addCar: function () {
        wx.redirectTo({
            url: "../car/car",
        })
    },

    edit(e) {
        let obj = JSON.stringify(e.currentTarget.dataset.obj)
        wx.redirectTo({
            url: '../car/car?obj=' + obj + "&type=" + 1,
        })
    },
    del(e) {
        let that = this;
        const token = wx.getStorageSync("token")
        console.log(e)
        wx.request({
          url: app.globalData.url+'delete_car',
            header: { token: token },
            data: { id: e.target.dataset.carid },
            success: res => {
                that.onLoad();
            }
        })
    },

    touchEnd (e){

    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.carList.forEach(function (v, i) {
            if (v.isTouchMove)//只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            carList: this.data.carList
        })
    },
    //滑动事件处理
    touchmove: function (e) {
        var that = this,
            index = e.currentTarget.dataset.index,//当前索引
            startX = that.data.startX,//开始X坐标
            startY = that.data.startY,//开始Y坐标
            touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
            //获取滑动角度
            angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
        that.data.carList.forEach(function (v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                else //左滑
                    v.isTouchMove = true
            }
        })
        //更新数据
        that.setData({
            carList: that.data.carList
        })
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function (start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    methods: {

    }
})
