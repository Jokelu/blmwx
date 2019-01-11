//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    userInfo: {
      avatarUrl: "../../images/icon_zhuce.png",
      nickName: "点击绑定微信"
    },
    hasUserInfo: false,
    couponCount: ""
  },
  getOrderList: function(e) {
    let currentItem = e.currentTarget.dataset.url
    if (!this.data.userInfo.authorizedFlag) {
      // wx.showToast({
      //   title: '请先授权微信',
      //   icon: 'none',
      //   duration: 2000
      // })
      if (currentItem == "card/card") {
        wx.navigateTo({
          url: '/pages/authorize/authorize?loginFlag=1',
        })
      } else if (currentItem == "custom/custom") {
        wx.navigateTo({
          url: currentItem,
        })
      } else {
        wx.navigateTo({
          url: '/pages/authorize/authorize',
        })
      }
    } else if (currentItem == "card/card" && this.data.userInfo.authorizedFlag && !this.data.userInfo.memberFlag) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    } else {
      wx.navigateTo({
        url: currentItem,
      })
    }
  },
  onLoad: function() {},
  onShow: function() {
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.authorizedFlag) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      }
    }
    this.getCountByUnionid()
  },
  getCountByUnionid: function() {
    let unionId = app.globalData.userInfo.unionid
    wx.request({
      url: `${this.data.baseUrl}/order/getAvailableNumber`,
      data: {
        unionId: unionId,
      },
      success: (res) => {
        if (res.data.resultCode == "SUCCEED") {
          this.setData({
            couponCount: res.data.data
          })
        } else {}
      }
    })
  },
  getUserInfo: function(e) {
    const that = this
    var sessionKey = app.globalData.userInfo.sessionKey
    if (!app.globalData.userInfo.authorizedFlag) {
      wx.request({
        url: `${this.data.baseUrl}/user/getUserAuthorization`,
        data: {
          sessionKey: sessionKey,
          encryptedData: e.detail.encryptedData,
          ivStr: e.detail.iv,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: (res) => {
          if (res.data.resultCode == "SUCCEED") {
            app.globalData.userInfo = res.data.data
            that.setData({
              userInfo: res.data.data,
              hasUserInfo: true
            })
          }
        }
      })
    }
  }
})