//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: "点击绑定微信",
    baseUrl: app.globalData.baseUrl,
    userInfo: {
      avatarUrl: "../../images/icon_zhuce.png",
      nickName: "点击绑定微信"
    },
    hasUserInfo: false,
  },
  getOrderList: function(e) {
    let currentItem = e.currentTarget.dataset.url
    if (!this.data.userInfo.authorizedFlag) {
      // wx.showToast({
      //   title: '请先授权微信',
      //   icon: 'none',
      //   duration: 2000
      // })
      wx.navigateTo({
        url: '/pages/authorize/authorize',
      })
    } else if (!this.data.userInfo.memberFlag) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    } else {
      wx.navigateTo({
        url: currentItem,
      })
    }
  },
  // onShareAppMessage: function(res) {
  //   if (res.from === 'menu') {
  //     // 来自页面内转发按钮
  //     return {
  //       title: '便丽猫请你来尝鲜！',
  //       path: '/pages/user/card/card?id=123'
  //     }
  //   } else if (res.from === 'button') {
  //     return {
  //       title: '便丽猫请你来尝鲜！',
  //       path: '/pages/user/index'
  //     }
  //   }
  // },
  goSetting: function() {
    wx.navigateTo({
      url: '../login/index',
    })
  },
  // showLoading: () => {
  //   wx.showLoading({
  //     title: '加载中。。。',
  //   })
  // },
  // hideLoading: () => {
  //   wx.hideLoading()
  // },
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
    // app.globalData.userInfo = e.detail.userInfo
  }
})