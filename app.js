//app.js
var txTobdMap = require('/js/map.js');
App({
    onLaunch: function () {
        console.log("app.js")
        // 用户版本更新
        if (wx.canIUse("getUpdateManager")) {
          let updateManager = wx.getUpdateManager();
          updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate);
          })
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  wx.clearStorageSync()
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                } else if (res.cancel) {
                  return false;
                }
              }
            })
          })
          updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            wx.hideLoading();
            wx.showModal({
              title: '升级失败',
              content: '新版本下载失败，请检查网络！',
              showCancel: false
            });
          });
        }

        //调用API从本地缓存中获取数据
        var that=this
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        var token = wx.getStorageSync('token') || null
        if (token) {
            that.globalData.token = token;
        }

        // 获取员工端token
        var tokenXI = wx.getStorageSync("tokenXI") || null
        if(tokenXI){
          that.globalData.tokenXI=tokenXI;
        }

        var lat = wx.getStorageSync('lat') || null
        if (lat) {
            that.globalData.lat = lat;
        }

        var lon = wx.getStorageSync('lon') || null
        if (lon) {
            that.globalData.lon = lon;
        }

        var wsid = wx.getStorageSync('wsid') || null
        if (wsid) {
            that.globalData.wsid = wsid;
        }
    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },
    // 时间戳转年月日
    formatDuring(timestamp) {
        var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        
        var strDate = Y+M+D;
        return strDate;    
    },
    formatDuringDay: function(mss) {
        var time = parseInt(mss) + "秒";
        if( parseInt(mss )> 60){
    
          var second = parseInt(mss) % 60;  //取余获得秒数
          var min = parseInt(mss / 60);  //当剩余分钟数不大于60分钟时，取整获得分数
          time = min + ":" + second;  
          // 如果大于60分钟则判断小时
        //   if( min > 60 ){  
        //       min = parseInt(mss / 60) % 60;  //获得分钟数
        //       var hour = parseInt( parseInt(mss / 60) /60 ); //获得小时 
        //       time = hour + ":" + min + ":" + second;  
        //       // 如果大于24小时则判断天数
        //       if( hour > 24 ){  
        //           hour = parseInt( parseInt(mss / 60) /60 ) % 24; //获得小时 
        //           var day = parseInt( parseInt( parseInt(mss / 60) /60 ) / 24 );  //获得天
        //           time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
        //       }  
        //   }       
        }
        return time;
    },
    // 车牌正则，包括新能源
    isLicensePlate(str) {
        return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领黔滇台][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(str);
    },
    /*信息提示 */
    showToast(title = "未知错误，请重试！", icon = "none", duration = 1000) {
        wx.showToast({
            title: title,
            icon: icon,
            duration: duration,
            mask: true
        });
    },
    globalData: {
        userInfo: null,
        url:"https://wash.xypvip.cn/",
        // url:"http://192.168.10.62:83/",
        // url: "https://test.xinyixi.net/",
        lat:null,
        lon:null,
        wsid:null,
        token:null,
        carNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, '0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],//车牌键盘
        cityList: [
          { name: "京" }, { name: "津" }, { name: "冀" }, { name: "晋" }, { name: "蒙" },
          { name: "辽" }, { name: "吉" }, { name: "黑" }, { name: "沪" }, { name: "苏" },
          { name: "浙" }, { name: "皖" }, { name: "闽" }, { name: "赣" }, { name: "鲁" },
          { name: "豫" }, { name: "鄂" }, { name: "湘" }, { name: "粤" }, { name: "桂" },
          { name: "琼" }, { name: "渝" }, { name: "川" }, { name: "黔" }, { name: "滇" },
          { name: "藏" }, { name: "陕" }, { name: "甘" }, { name: "青" }, { name: "宁" },
          { name: "新" }, { name: "台" }, { name: "港" }, { name: "澳" }
        ],
        getInputValue:"",//备注
        phone:/^1[3456789]\d{9}$/ //手机号正则
    }
})
