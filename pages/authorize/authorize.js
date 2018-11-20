const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    shareUnionId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.shareUnionId) {
      this.setData({
        shareUnionId: options.shareUnionId
      })
    }
    console.log(options)
  },
  getUserInfo: function(e) {
    const that = this
    var sessionKey = app.globalData.userInfo.sessionKey
    var unionid = app.globalData.userInfo.unionid
    console.log(sessionKey)
    // app.globalData.userInfo = e.detail.userInfo
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
          if (that.data.shareUnionId) {
            wx.request({
              url: `${this.data.baseUrl}/user/recommendUser`,
              data: {
                shareUnionId: this.data.shareUnionId,
                getUnionId: unionid,
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'POST',
              success: function(result) {
                console.log(result)
                if (result.data.resultCode == "SUCCEED") {
                  app.globalData.userInfo = res.data.data
                  if (!res.data.data.memberFlag) {
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
            if (!res.data.data.memberFlag) {
              wx.navigateTo({
                url: `/pages/login/index?delta=2`,
              })
            } else {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        }
        // that.setData({
        //   userInfo: res.data.data,
        //   hasUserInfo: true
        // })
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