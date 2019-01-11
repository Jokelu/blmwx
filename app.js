//app.js
var util = require('/utils/util.js');
App({
  onLaunch: function(option) {
    // 登录
    wx.login({
      success: res => {
        wx.setStorageSync('code', res.code)
        wx.request({
          url: `${this.globalData.baseUrl}/user/getSessionResult`,
          data: {
            wxCode: res.code
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: (res) => {
            // if (res.data.resultCode == 'SUCCEED') {
             
            // }
            this.globalData.userInfo = res.data.data
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res.data.data);
            }
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    // baseUrl: "https://dev.bianlimall.com",
    baseUrl: "https://v.bianlimall.com/member",
    baseImg: "https://bianlimall-public.oss-cn-beijing.aliyuncs.com/",
  }
})