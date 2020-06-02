//app.js
var txTobdMap = require('/js/map.js');
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var that=this
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        var token = wx.getStorageSync('token') || null
        if (token) {
            that.globalData.token = token;
            console.log(token)
        }

        // 获取员工端token
        var tokenXI = wx.getStorageSync("tokenXI") || null
        if(tokenXI){
          that.globalData.tokenXI=tokenXI;
          console.log(tokenXI)
        }

        var lat = wx.getStorageSync('lat') || null
        if (lat) {
            that.globalData.lat = lat;
            console.log(lat)
        }

        var lon = wx.getStorageSync('lon') || null
        if (lon) {
            that.globalData.lon = lon;
            console.log(lon)
        }

        var wsid = wx.getStorageSync('wsid') || null
        if (wsid) {
            that.globalData.wsid = wsid;
            console.log(wsid)
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

    globalData: {
        userInfo: null,
        // url:"https://wash.xypvip.cn/",
        url:"http://192.168.10.62:83/",
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
    }
})
