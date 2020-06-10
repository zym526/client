// pages/addAddress/addAddress.js
const app=new getApp()
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,//设置为默认地址
    addressFW:"点击选择",//服务地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    if(options.type){
      that.setData({
        type:options.type,
      })
      // 当为1的时候是编辑则获取item
      if(options.type==1){
        that.setData({
          item:JSON.parse(options.item),
          addressXX:JSON.parse(options.item).detail_address,
          addressName:JSON.parse(options.item).name,
          addressPhone:JSON.parse(options.item).phone,
          checked:JSON.parse(options.item).default_address==1?true:false
        })
        // 将携带来的地址信息存储进缓存中
        wx.setStorageSync('addressText', that.data.item.province)
        wx.setStorageSync('lat', that.data.item.latitude)
        wx.setStorageSync('lon', that.data.item.longitude)
        wx.setStorageSync('bd_lat', that.data.item.latitude)
        wx.setStorageSync('bd_lng', that.data.item.longitude)
      }
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
    var that=this
    if(that.data.type=="1"){
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '添加新地址'
      })
    } 
    // 获取缓存中的经纬度和地区
    if(wx.getStorageSync('addressText')!=""){
      that.setData({
        addressFW:wx.getStorageSync('addressText')
      })
    }
  },
  // 跳转地图页面
  toMap(){
    wx.navigateTo({
      url: '/pages/map/map?type=0',
    })
  },
  // 切换设置默认
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
  },
  // 详细地址输入框
  getAddress(event){
    this.setData({
      addressXX:event.detail.value
    })
  },
  // 联系人输入框
  getName(event){
    this.setData({
      addressName:event.detail.value
    })
  },
  // 手机号输入框
  getPhone(event){
    this.setData({
      addressPhone:event.detail.value
    })
  },
  // 确定添加该或修改地点
  addressTwo(){
    var that=this
    // 服务地址，详细地址，联系人，手机号是否为空或者错误
    if(that.data.addressFW==""||that.data.addressFW=="点击选择"){
      app.showToast("请选择地址")
      return
    }else if(that.data.addressName==""||!that.data.addressName){
      app.showToast("请填写姓名")
      return
    }else if(!((app.globalData.phone).test(that.data.addressPhone))){
      app.showToast("手机号格式不正确")
      return
    }else{
      // 发起存储请求,1为编辑，0为添加
      var nowUrl,data
      if(that.data.type==1){
        nowUrl="edit_address",
        data={
          id:that.data.item.id,
          uid:wx.getStorageSync('uid'),
          name:that.data.addressName,
          phone:that.data.addressPhone,
          address:that.data.addressFW,
          longitude:wx.getStorageSync('lon'),
          latitude:wx.getStorageSync('lat'),
          detail_address:that.data.addressXX?that.data.addressXX:'',
          default_address:that.data.checked?1:0
        }
      }else{
        nowUrl="add_address",
        data={
          uid:wx.getStorageSync('uid'),
          name:that.data.addressName,
          phone:that.data.addressPhone,
          address:that.data.addressFW,
          longitude:wx.getStorageSync('lon'),
          latitude:wx.getStorageSync('lat'),
          detail_address:that.data.addressXX?that.data.addressXX:'',
          default_address:that.data.checked?1:0
        }
      }
      wx.request({
        url: app.globalData.url+nowUrl,
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data,
        success(res){
          if(res.data.code==200){
            if(app.globalData.goodsDetailNow==1){
              app.globalData.defaultAddress={
                province:that.data.addressFW,
                name:that.data.addressName,
                phone:that.data.addressPhone,
                id:res.data.data,
                latitude:wx.getStorageSync('lat'),
                longitude:wx.getStorageSync('lon')
              }
              wx.redirectTo({
                url: '/pages/goodsDetail/goodsDetail',
              })
            }else{
              wx.redirectTo({
                url: '/pages/addressList/addressList',
              })
            }
          }else{
            app.showToast(res.data.msg)
          }
        },  
        fail(err){
          app.showToast(err.data.msg)
        }
      })
    }
  },
  // 删除该地址
  delAddress(){
    var that=this
    Dialog.confirm({
      message: '您确定要删除此服务地址吗？',
    }).then(() => {
      wx.request({
        url: app.globalData.url+"del_address",
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          id:that.data.item.id,//地址id
          uid:wx.getStorageSync('uid')
        },
        success(res){
          // 如果成功
          if(res.data.code==200){
            app.showToast("删除成功")
            setTimeout(function(){ 
              wx.redirectTo({
                url: '/pages/addressList/addressList',
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