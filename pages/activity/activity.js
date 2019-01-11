const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    baseUrl: app.globalData.baseUrl,
    couponList: [],
    msg: "查看",
    showMask: false,
    aid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      aid: options.aid
    })
    let aid = options.aid
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
      if (!app.globalData.userInfo.authorizedFlag) {
        this.setData({
          showMask: true
        })
      } else {
        this.getCoupon(aid)
        this.setData({
          showMask: false
        })
      }
    } else {
      app.userInfoReadyCallback = res => {
        if (res) {
          this.setData({
            userInfo: res,
          })
          if (!res.authorizedFlag) {
            this.setData({
              showMask: true
            })
          } else {
            this.getCoupon(aid)
          }
        }
      }
    }
    this.getActivityCoupon(aid)
  },
  getCoupon: function(aid) {
    wx.request({
      url: `${this.data.baseUrl}/activity/activity/getActById`,
      header: {
        "Content-Type": "application/json"
      },
      data: {
        userid: this.data.userInfo.unionid,
        activityid: aid,
      },
      method: 'POST',
      success: (res) => {
        if (res.data.resultCode == "SUCCEED") {
          wx.showToast({
            title: '领取成功',
          })
        } else {
          wx.showToast({
            title: res.data.resultMsg,
            icon: "none"
          })
        }
        console.log(res)
        // if (res.data.resultCode == "SUCCEED") {
        //   this.setData({
        //     couponList: res.data.data
        //   })
        // }
      }
    })
  },
  getActivityCoupon: function(aid) {
    wx.request({
      url: `${this.data.baseUrl}/activity/activity/listActivityCoupon`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        activityId: aid
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.resultCode == "SUCCEED") {
          this.setData({
            couponList: res.data.data
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    let aid = this.data.aid
    const that = this
    var sessionKey = app.globalData.userInfo.sessionKey
    var unionid = app.globalData.userInfo.unionid
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
            showMask: false
          })
          that.getCoupon(aid)
        } else {
          that.setData({
            userInfo: null,
          })
        }
      }
    })
  },
  toCoupon: function() {
    wx.redirectTo({
      url: '/pages/user/coupon/coupon',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})