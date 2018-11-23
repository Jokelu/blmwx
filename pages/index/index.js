//index.js
//获取应用实例
const app = getApp()
// const baseUrl = "https://dev.bianlimall.com"
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseImg: app.globalData.baseImg,
    imgUrls: [],
    userInfo: null,
    goodsInfo: [],
    hasUserInfo: false,
    loadingHidden: false,
    indicatorDots: true,
    duration: 100,
    autoplay: true,
    interval: 3000,
    showModel: false
  },

  toDetail: function(option) {
    let url = option.currentTarget.dataset.url
    if (url == "share") {
      if (app.globalData.userInfo.memberFlag) {
        wx.navigateTo({
          url: 'shareGift/shareGift',
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '只有便丽猫会员才能参与本活动哟',
          showCancel: false
        })
      }
    } else if (url == "regist") {
      if (!app.globalData.userInfo.authorizedFlag) {
        wx.navigateTo({
          url: '/pages/authorize/authorize?loginFlag=1',
        })
      } else if (app.globalData.userInfo.memberFlag) {
        wx.navigateTo({
          url: '/pages/user/card/card',
        })
      } else {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }
    } else {
      wx.navigateTo({
        url: 'goodsInfo/index?id=' + url,
      })
    }
  },
  getGoodsDetail: (e) => {
    let data = e.currentTarget.dataset.url
    if (data.name == "敬请期待") {
      return
    } else {
      wx.navigateTo({
        url: 'goodsInfo/index?id=' + e.currentTarget.dataset.url.id,
      })
    }
  },
  showLoading: () => {
    wx.showLoading({
      title: '加载中。。。',
    })
  },
  hideLoading: () => {
    wx.hideLoading()
  },
  close: function() {
    this.setData({
      showModel: false
    })
  },
  getGift: function() {
    if (!app.globalData.userInfo.authorizedFlag) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?loginFlag=1',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }

  },
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      if (!app.globalData.userInfo.memberFlag) {
        this.setData({
          showModel: true
        })
      }
    } else {
      app.userInfoReadyCallback = res => {
        if (res) {
          this.setData({
            userInfo: res
          })
          if (!res.memberFlag) {
            this.setData({
              showModel: true
            })
          }
        }
      }
    }
    if (options.unionId) {
      wx.setStorageSync('shareUnionId', options.unionId)
    } else {
      wx.setStorageSync('shareUnionId', "")
    }
  },
  onShow: function() {
    wx.request({
      url: `${this.data.baseUrl}/mall/banner`,
      success: (res) => {
        this.setData({
          imgUrls: res.data.data
        })
      }
    })
    wx.request({
      url: `${this.data.baseUrl}/mall/homePage`,
      success: (res) => {
        this.setData({
          goodsInfo: res.data.data
        })
      }
    })
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      if (!app.globalData.userInfo.memberFlag) {
        this.setData({
          showModel: true
        })
      } else {
        this.setData({
          showModel: false
        })
      }
    }
  },
})