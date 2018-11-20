//index.js
//获取应用实例
const app = getApp()
// const baseUrl = "https://dev.bianlimall.com"
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    baseImg: app.globalData.baseImg,
    imgUrls: [],
    userInfo: {},
    goodsInfo: [],
    hasUserInfo: false,
    loadingHidden: false,
    indicatorDots: true,
    duration: 100,
    autoplay: true,
    interval: 3000,
  },

  toDetail: function(option) {
    let url = option.currentTarget.dataset.url
    console.log(app.globalData.userInfo)
    if (url == "share") {
      wx.navigateTo({
        url: 'shareGift/shareGift',
      })
    } else if (url == "regist") {
      if (!app.globalData.userInfo.authorizedFlag) {
        wx.navigateTo({
          url: '/pages/authorize/authorize',
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

  onLoad: function() {

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
  },
})