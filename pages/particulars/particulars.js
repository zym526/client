const app=new getApp()
// pages/particulars/particulars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,//当前页数
    req:"",//请求的接口
    lock:true,//是否还有数据
    integral:[],//积分
    wallet:[],//钱包
    noPage:true
  },

  // 请求明细
  getPart(pages){
    var that=this
    // 如果title=1则为积分明细，否则为钱包明细 
    if(that.data.title==="1"){
      that.setData({
        req:"intelog"
      })
    }else{
      that.setData({
        req:"balalog"
      })
    }
    if(that.data.lock){
      wx.request({
        url: app.globalData.url+that.data.req,
        header:{ "token": wx.getStorageSync('token') },
        method: "POST",
        data: {
          uid: wx.getStorageSync('uid'),
          pages:pages
        },
        success(res){
          console.log(res)
          // 如果请求第一页并且数据返回为空则显示无数据页面
          if(res.data.data.length==0&&pages==1){
            that.setData({
              noPage:false
            })
          }
          res.data.data.forEach(item=>{
            item.nowintegral=parseInt(item.nowintegral)
            item.wash_integral=parseInt(item.wash_integral)
          })
          var newData=res.data.data
          if(newData.length<20){
            that.setData({
              lock:false
            })
          }
          // 如果是积分
          if(that.data.title==="1"){
            var oldIntegral=that.data.integral
            that.setData({      
              integral:oldIntegral.concat(newData)
            })
          }else{
            var oldWallet=that.data.wallet
            that.setData({
              wallet:oldWallet.concat(newData)
            })
          }
        },
        fail(error){
          console.log(error)
        }
      })
    }   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      title:options.title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this
    if(that.data.title==="1"){
      wx.setNavigationBarTitle({
        title: '积分明细'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: '#FF6600'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '钱包明细'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff', // 必写项
        backgroundColor: "#1678FF",
      })
    }    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    that.getPart(1)
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
    var that=this
    if(that.data.lock){
      that.setData({
        page:that.data.page+1
      })
      that.getPart(that.data.page)
    }else{
      wx.showToast({
        title: '已经到底了',
        icon:"none",
        duration:2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})