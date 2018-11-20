//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    userInfo: {},
    phone: '',
    phoneCode: "",
    time: 60,
    isGetCode: true,
    hasUserInfo: false,
    loadingHidden: false,
    disabled: false,
    submitDisabled: true,
    delta: 1,
  },
  userPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  userPhoneCodeInput: function(e) {
    this.setData({
      phoneCode: e.detail.value
    })
  },
  getPhoneCode: function() {
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.phone.length != 11) {
      wx.showToast({
        title: '请输入11位手机号',
        icon: 'none',
        duration: 2000
      })
    } else {
      var timer = setInterval(() => {
        if (this.data.time >= 0) {
          this.setData({
            time: this.data.time - 1
          })
        }
        if (this.data.time <= 0) {
          clearInterval(timer)
          this.setData({
            isGetCode: true,
            disabled: false,
            time: 60
          })
        }
      }, 1000)
      this.setData({
        isGetCode: false,
        disabled: true,
        submitDisabled: false
      })
      wx.request({
        url: `${this.data.baseUrl}/user/getMsgCode`,
        data: util.json2Form({
          phoneNo: this.data.phone
        }),
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          console.log(res)
        }
      })
      // 

    }
  },
  submit: function() {
    let unionid = app.globalData.userInfo.unionid
    const that = this
    if (this.data.phoneCode) {
      wx.request({
        url: `${this.data.baseUrl}/user/verifyMsgCode`,
        data: util.json2Form({
          phoneNo: this.data.phone,
          code: this.data.phoneCode,
          unionId: unionid,
        }),
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          if (res.data.resultCode == "SUCCEED") {
            app.globalData.userInfo = res.data.data
            wx.showToast({
              title: "登录成功",
              icon: 'none',
              duration: 2000
            })
            if (that.data.delta) {
              wx.navigateBack({
                delta: that.data.delta
              })
            }
          } else {
            wx.showToast({
              title: res.data.resultMsg,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '连接服务失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入手机验证码',
        icon: 'none',
        duration: 2000
      })
    }
  },

  onLoad: function(option) {
    if (option.delta) {
      this.setData({
        delta: parseInt(option.delta)
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})