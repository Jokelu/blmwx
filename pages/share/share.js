const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    success: "../../images/giftBox.png",
    options: {},
    msg: '好友邀你享用',
    userInfo: {},
    reciveMsg: "享受美味",
    reciveState: false,
    showModel: false
  },
  close: function() {
    this.setData({
      showModel: false
    })
  },
  goto: function() {
    const that = this
    let res = this.data.userInfo
    console.log(res)
    if (!res.authorizedFlag) {
      wx.navigateTo({
        url: '/pages/authorize/authorize',
      })
    } else {
      this.getShareOrder(res.unionid)
    }
    // if (res.authorizedFlag && !res.memberFlag) {
    //   wx.navigateTo({
    //     url: '/pages/login/index?delta=1',
    //   })
    // }

  },
  getRecive: function() {
    if (this.data.reciveState) {
      wx.switchTab({
        url: '/pages/user/index',
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options,
      msg: this.data.msg + (options.name || "")
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      // this.getShareOrder(app.globalData.userInfo.unionid)
    } else {
      wx.showLoading({
        title: '加载中',
      })
      app.userInfoReadyCallback = res => {
        if (res) {
          wx.hideLoading()
        }
        this.setData({
          userInfo: res
        })
        if (res.authorizedFlag) {
          // this.getShareOrder(res.unionid)
        } else {
          // this.setData({
          //   msg: "好友邀你享用",
          //   success: "../../images/giftBox.png",
          //   reciveMsg: "点击领取"
          // })
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getShareOrder: function(unionid) {
    wx.request({
      url: `${this.data.baseUrl}/order/shareOrder`,
      data: {
        shareUnionId: this.data.options.unionid,
        getUnionId: unionid,
        orderId: this.data.options.id,
        shareType: this.data.options.type
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        if (res.data.resultCode == 'SUCCEED') {
          this.setData({
            msg: '领取成功',
            success: "../../images/icon-chenggong.png",
            reciveMsg: "享用美味",
            reciveState: true,
            showModel: true
          })
        } else if (res.data.resultCode == 'FAILED') {
          this.setData({
            msg: res.data.data,
            success: "../../images/icon-shibai.png",
            reciveMsg: "前往商城",
            showModel: true
          })
        } else if (res.data.resultCode == 'RECLAIM') {
          this.setData({
            msg: res.data.data,
            success: "../../images/icon-chongfu.png",
            reciveMsg: "前往商城",
            showModel: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    // if (app.globalData.userInfo) {
    //   this.getShareOrder(app.globalData.userInfo.unionid)
    // } else {
    //   this.setData({
    //     msg: "好友邀你享用",
    //     success: "../../images/giftBox.png",
    //     reciveMsg: "点击领取"
    //   })
    // }
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