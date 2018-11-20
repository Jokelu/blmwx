const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    baseUrl: app.globalData.baseUrl,
    imgalist: 'http://oss.bianlimall.com/member/228f3634e55a4b2c950a2402b0dc027c.png',
    shareUnionId: ""
  },
  previewImage: function(e) {
    var current = [e.target.dataset.src]
    wx.previewImage({
      current: current[0], // 当前显示图片的http链接   
      urls: current // 需要预览的图片http链接列表   
    })
  },
  getRecive: function() {
    let userInfo = this.data.userInfo
    if (!userInfo.authorizedFlag) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?shareUnionId=' + this.data.shareUnionId,
      })
    }
    if (userInfo.authorizedFlag && !userInfo.memberFlag) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    } else if (userInfo.authorizedFlag && userInfo.memberFlag) {
      wx.redirectTo({
        url: '/pages/user/coupon/coupon',
      })
      // let unionid = app.globalData.unionid
      // wx.request({
      //   url: `${this.data.baseUrl}/user/recommendUser`,
      //   data: {
      //     shareUnionId: this.data.shareUnionId,
      //     getUnionId: userInfo.unionid,
      //   },
      //   header: {
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   method: 'POST',
      //   success: function(res) {
      //     console.log(res)
      //     wx.navigateTo({
      //       url: '/pages/user/coupon/coupon',
      //     })
      //     if (res.data.resultCode == "SUCCEED") {
      //       wx.navigateTo({
      //         url: '/pages/user/coupon/coupon',
      //       })
      //       // wx.showModal({
      //       //   title: '提示',
      //       //   content: '领取成功！',
      //       //   confirmText: "前去查看",
      //       //   success(res) {
      //       //     if (res.confirm) {
      //       //       wx.navigateTo({
      //       //         url: '/pages/user/coupon/coupon',
      //       //       })
      //       //       console.log('用户点击确定')
      //       //     } else if (res.cancel) {
      //       //       console.log('用户点击取消')
      //       //     }
      //       //   }
      //       // })
      //     } else {
      //       // wx.showModal({
      //       //   title: '提示',
      //       //   content: '你已经',
      //       //   confirmText: "前去查看",
      //       //   success(res) {
      //       //     if (res.confirm) {
      //       //       wx.navigateTo({
      //       //         url: '/pages/user/coupon/coupon',
      //       //       })
      //       //       console.log('用户点击确定')
      //       //     } else if (res.cancel) {
      //       //       console.log('用户点击取消')
      //       //     }
      //       //   }
      //       // })
      //     }
      //   }
      // })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      shareUnionId: options.unionId
    })
    const that = this
    app.getAuthKey().then(function(res) {
      that.setData({
        userInfo: res
      })
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
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