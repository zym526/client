// pages/addEvaluate/addEvaluate.js
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
    starType: false,
    starTypeF: false,
    starTypeS: false,
    starTypeT: false,
    starTypeFi: false, 
    starText : "一般",
    active : false ,
    typeActiveList : [],
    newList : [],
    classvtb : -1,
    imgList : [],
    starNum :"",
    order_number : '',
    tag: '',
    tag1 : '',
    myUrl0 : '',
    myUrl1: '', 
    myUrl2: '',
  },
  changeStar : function (event){
    let that = this ;
    if (event.currentTarget.dataset.num == 1){
      that.setData({
        starType: true,
        starTypeF : false ,
        starTypeS: false,
        starTypeT: false,
        starTypeFi : false ,
        starText : '差',
        starNum: 1,
        tag: "",
        tag1: ''
      })
    } else if (event.currentTarget.dataset.num == 2){
      that.setData({
        starType: true,
        starTypeF: true,
        starTypeS: false,
        starTypeT: false,
        starTypeFi: false,
        starText: '一般',
        starNum: 2,
        tag: "",
        tag1: ''
      })
    } else if (event.currentTarget.dataset.num == 3) {
      that.setData({
        starType: true,
        starTypeF: true,
        starTypeS: true,
        starTypeFi: false,
        starTypeT: false,
        starText: '还不错',
        starNum: 3,
        tag: "",
        tag1: ''
      })
    } else if (event.currentTarget.dataset.num == 4) {
      that.setData({
        starType: true,
        starTypeF: true,
        starTypeS: true,
        starTypeT: true,
        starTypeFi: false,
        starText: '很满意',
        starNum: 4,
        tag : "",
        tag1 : ''
      })
    } else if (event.currentTarget.dataset.num == 5) {
      that.setData({
        starType: true,
        starTypeF: true,
        starTypeS: true,
        starTypeT: true,
        starTypeFi: true,
        starText: '强烈推荐',
        starNum:5
      })
    }
    wx.request({
      url: 'https://wash.xypvip.cn/get_evaluate_config',
      data: { type: 2, up_value: event.currentTarget.dataset.num },
      success: function (res) {
        that.setData({
          typeActiveList : res.data.data
        })
      }
    })
  },
  finish : function (e){
    let that = this ;
    let order_number = that.data.order_number;
    let text = e.detail.value.textarea ;
    let score = that.data.starNum ;
    let myToken = wx.getStorageSync("token");
    let tags = that.data.tag + "," + that.data.tag1;
    let image_str = ""
    if (that.data.myUrl0 != "" && that.data.myUrl1 == "" && that.data.myUrl2 == ""){
      image_str = that.data.myUrl0 ;
    } else if (that.data.myUrl0 != "" && that.data.myUrl1 != "" && that.data.myUrl2 == "") {
      image_str = that.data.myUrl0 + "#" + that.data.myUrl1;
    } else if (that.data.myUrl0 != "" && that.data.myUrl1 != "" && that.data.myUrl2 != "") {
      image_str = ''+that.data.myUrl0 + '#' + that.data.myUrl1 + '#' + that.data.myUrl2+'';
    }
    wx.request({
      url: 'https://wash.xypvip.cn/submit_evaluate',
      header: { "token": myToken },
      data: { order_number: order_number, text: text, score: score, tags: tags, image_str: image_str},
      success : function(res){

        wx.redirectTo({
          url: '../evaSuccess/evaSuccess',
        })
      }
    })

  },
  bindType: function (event){
    let that = this ;
    var index = event.currentTarget.dataset.key;
    if (that.data.typeActiveList[index].image_url == 1) {
      that.data.typeActiveList[index].image_url = null;
    } else if (that.data.typeActiveList[index].image_url == null) {
      that.data.typeActiveList[index].image_url = 1;
    }
    if (that.data.tag == ""){
      that.setData({
        tag: event.currentTarget.dataset.content
      })
    } else if (that.data.tag == event.currentTarget.dataset.content){
      that.setData({
        tag: ""
      })
    }else if (that.data.tag1 == "" && that.data.tag !== "" ) {
      that.setData({
        tag1: event.currentTarget.dataset.content
      })
    } else if (that.data.tag1 == event.currentTarget.dataset.content) {
      that.setData({
        tag1: ""
      })
    }

    that.setData({
      typeActiveList: that.data.typeActiveList,
    });
  },

  chooseImg : function (){
    var that = this ;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgList : tempFilePaths
        })
        for (let i = 0; i < that.data.imgList.length; i++) {
          that.upload(that.data.imgList[i],i)
        }
      }
    })

  },
  upload: function (path,i, success, fail){
    let that = this ;
    wx.uploadFile({
      url: "https://wash.xypvip.cn/upload1",
      filePath: path ,
      name: "goodsName",
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      // formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        if (res.statusCode == 200 && !res.data.result_code) {
          let thisUrl = JSON.parse(res.data)
          if(i == 0){
            that.setData({
              myUrl0: thisUrl.data[0]
            })
          } else if (i == 1) {
            that.setData({
              myUrl1: thisUrl.data[0]
            })
          } else if (i == 2) {
            that.setData({
              myUrl2: thisUrl.data[0]
            })
          }

          typeof success == "function" && success(res.data);
        } else {
          typeof fail == "function" && fail(res);
        }
      },
      fail: function (res) {
        typeof fail == "function" && fail(res);
      }
    })
  },
  openBig : function (e){
    let that = this ;
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: that.data.imgList // 需要预览的图片http链接列表
    })
  },
  onLoad : function(options){
    let that = this ; 
    that.setData({
      order_number: options.order_number
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
