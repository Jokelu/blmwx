const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    loginFlag: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.loginFlag) {
      this.setData({
        loginFlag: options.loginFlag
      })
    } else {
      this.setData({
        loginFlag: false
      })
    }
    console.log(this.data.loginFlag)
  },
  getUserInfo: function(e) {
    const that = this
    var sessionKey = app.globalData.userInfo.sessionKey
    var unionid = app.globalData.userInfo.unionid
    var shareUnionId = wx.getStorageSync('shareUnionId')
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
          if (shareUnionId) {
            wx.request({
              url: `${this.data.baseUrl}/user/recommendUser`,
              data: {
                shareUnionId: shareUnionId,
                getUnionId: unionid,
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function(result) {
                if (result.data.resultCode == "SUCCEED") {
                  if (!res.data.data.memberFlag && that.data.loginFlag) {
                    wx.navigateTo({
                      url: `/pages/login/index?delta=2`,
                    })
                  } else {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                } else {}
              }
            })
          } else {
            if (!res.data.data.memberFlag && that.data.loginFlag) {
              wx.navigateTo({
                url: `/pages/login/index?delta=2`,
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        } else {
          that.setData({
            userInfo: null,
          })
        }
      }
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})