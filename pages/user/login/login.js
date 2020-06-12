//获取应用实例
const app = getApp()
//   进入这个页面之前要清理所有本地登录数据

Page({
    data: {
        iv: '',
        data: '',
        textBtn:1,
        checked: true,//协议勾选
        color:"#00CC33",//btn颜色
    },
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },

    getPhoneNumber (e) {
        var that=this
        if(that.data.checked){
            // console.log(e)
            // console.log(e.detail.errMsg)
            // console.log(e.detail.iv)
            // console.log(e.detail.encryptedData)
            // 调用接口
            wx.request({
                url: app.globalData.url+'getphone',
                header:{"token":wx.getStorageSync('token')},
                data: {
                    session:that.data.session_key,
                    iv:e.detail.iv,
                    encryptedData:e.detail.encryptedData,
                    openid:wx.getStorageSync('openId')
                },
                success(res){
                    // console.log(res),
                    // 将获取到的手机号存储起来
                    wx.setStorageSync('chooseUser_phone', res.data.data)
                    wx.navigateBack({
                        delta: 1
                    })
                },
                fail(error){
                    wx.showToast({
                        title: '手机号获取失败',
                        icon: 'none',
                        duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
                    })
                }
            })
        }else{
            wx.showToast({
                title: '您需要同意《法律声明及隐私政策》',
                icon: 'none',
                duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            })
        }        
    },
    onShow: function () {
        wx.setStorageSync('aShow', true)
    },
    //获取个人信息弹框确认按钮
    getUserInfo(e) {
        var that=this
        if(that.data.checked){
            wx.showLoading({title: '登录中，请稍候', icon: 'loading', duration: 10000});
            let that = this;
            // console.log(e)
            if (e.detail.iv) {
                that.addUserToken();
            } else {
            }
        }else{
            wx.showToast({
                title: '您需要同意《法律声明及隐私政策》',
                icon: 'none',
                duration: 2000,//提示的延迟时间，单位毫秒，默认：1500 
            })
        }

    },
    addUserToken() {
        let that = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    let myCode = res.code;
                    wx.getUserInfo({
                        success: function (res) {
                            that.setData({
                                userInfos: false
                            })
                            that.setData({
                                userInfo: res.userInfo
                            })
                            wx.setStorageSync("userInfo", that.data.userInfo)
                            that.setData({
                                data: res.encryptedData,
                                iv: res.iv
                            })
                            wx.setStorageSync('iv', res.iv)
                            wx.setStorageSync('encryptedData', res.encryptedData)
                            

                            wx.request({
                                url: app.globalData.url+'mp_login',
                                data: {
                                    code: myCode,
                                    iv: that.data.iv,
                                    data: that.data.data,
                                    m_type: "car",
                                    lon: wx.getStorageSync('lon'),
                                    lat: wx.getStorageSync('lat')
                                },
                                success: function (res) {
                                    // console.log("login_info")
                                    // console.log(res)
                                    that.setData({
                                        "session_key":res.data.data.session_key
                                    })
                                    // 获取用户信息
                                    wx.request({
                                        url: app.globalData.url+'load_person_info',
                                        header: {"token": res.data.data.token},
                                        success: function (res) {
                                            wx.setStorageSync('aShow', false)
                                            // console.log("person_info")
                                            // console.log(res.data.data)
                                            that.setData({
                                                user_phone: res.data.data.phone
                                            })
                                            // console.log(res.data.data.phone)
                                            wx.setStorageSync("chooseUser_phone", res.data.data.phone)
                                            wx.setStorageSync("chooseUserName", res.data.data.username);
                                            wx.setStorageSync("chooseSex", res.data.data.sex);
                                            wx.setStorageSync("chooseImg", res.data.data.image);
                                            wx.setStorageSync('uid', res.data.data.uid)

                                            //从这里判断，用户是否绑定了手机号
                                            var is_bind = false
                                            // console.log(wx.getStorageSync("chooseUser_phone"))
                                            // console.log(wx.getStorageSync("chooseUser_phone").length)
                                            // console.log(wx.getStorageSync("chooseUser_phone").length == 11)
                                            if (wx.getStorageSync("chooseUser_phone")!==null&&wx.getStorageSync("chooseUser_phone").length == 11) {
                                                is_bind = true
                                            }else{
                                                is_bind = false
                                            }
                                            if (is_bind) {
                                                //返回上一级关闭当前页面
                                                console.log("绑定了手机号");
                                                wx.navigateBack({
                                                    delta: 1
                                                })
                                            } else {
                                                //跳转到绑定手机号的页面
                                                console.log("没有绑定手机号");
                                                // wx.redirectTo({url: "/pages/user/bind_phone/bind_phone"})
                                                // 更改按钮
                                                if(that.data.textBtn===1){
                                                    that.setData({
                                                        textBtn:2
                                                    })
                                                }
                                            }
                                        }
                                    })

                                    wx.setStorageSync("openId", res.data.data.openid)
                                    wx.setStorageSync("unionid", res.data.data.unionid)
                                    wx.setStorageSync("token", res.data.data.token)
                                    getApp().globalData.token = res.data.data.token;

                                    wx.hideLoading()
                                    //登录成功操作
                                    wx.showToast({
                                        title: "登录成功,请授权手机号",
                                        icon: 'none',
                                        duration: 1000,
                                        mask: true
                                    })
                                }
                            })
                        }
                    })
                }
            }
        });
    },
    // 协议勾选
    onChange(event) {
        var that=this
        this.setData({
          checked: event.detail,
        });
        // 判断颜色
        if(event.detail){
            that.setData({
                color:"#00CC33"
            })
        }else{
            that.setData({
                color:"#999999"
            })
        }
    },


})