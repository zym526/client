// components/addCarPopup/addCarPopup.js
var carCity=require('../../utils/carCity.js')
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
    //车子类型, 0轿车,1SUV,2MPV
    carType:[
      { type: "轿车", id: 0 },
      { type: "SUV", id: 1 },
      { type: "MPV", id: 2 },
    ],
    id:0,//车子类型
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
    // 打开输入车牌号键盘
    openCarNumber(){
      let item = {carView:true,showView:false}//要传给父组件的参数
      this.triggerEvent('carView',item)//通过triggerEvent将参数传给父组件
    },
    // 打开城市选择
    openCar: function (e) {
      let item = { carView: false, showView: true }//要传给父组件的参数
      this.triggerEvent('showView', item)//通过triggerEvent将参数传给父组件
    },
    // 选择当前车型
    changeType(e){
      var that=this
      var id = e.currentTarget.dataset.id
      that.setData({
        id:id
      })
      this.triggerEvent('changeType', id)//通过triggerEvent将参数传给父组件
    }
  }
})
