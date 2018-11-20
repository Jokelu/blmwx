const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    success: "../../images/moren.png",
    shibai: "../../images/icon-shibai.png",
    chongfu: "../../images/icon-chongfu.png",
    options: {},
    msg: '成为会员领取',
    userInfo: {},
    reciveMsg: "点击领取",
    reciveState: false
  },
  goto: function() {
    const that = this
    let res = this.data.userInfo
    if (!res.authorizedFlag) {
      wx.navigateTo({
        url: '/pages/authorize/authorize',
      })
    }
    if (res.authorizedFlag && !res.memberFlag) {
      wx.navigateTo({
        url: '/pages/login/index?delta=1',
      })
    }
    if (res.authorizedFlag && res.memberFlag) {
      if (this.data.reciveState) {
        wx.redirectTo({
          url: '/pages/user/coupon/coupon',
        })
      }else {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
    // const that = this
    // app.getAuthKey().then(function(res) {
    //   console.log(res)
    //   that.setData({
    //     userInfo: res
    //   })
    // })
  },
  // getAuthorize() {
  //   const {
  //     globalData
  //   } = getApp()
  //   return new Promise((resolve, reject) => {
  //     if(globalData.userInfo) {
  //       resolve(global.userInfo)
  //     }else {

  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this
    app.getAuthKey().then(function(res) {
      that.setData({
        userInfo: res
      })
      if (res.memberFlag) {
        wx.request({
          url: `${that.data.baseUrl}/order/shareOrder`,
          data: {
            shareUnionId: that.data.options.unionid,
            getUnionId: res.unionid,
            orderId: that.data.options.id,
            shareType: that.data.options.type
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function(res) {
            console.log(res)
            if (res.data.resultCode == 'SUCCEED') {
              that.setData({
                msg: '领取成功',
                success: "../../images/icon-chenggong.png",
                reciveMsg: "享用美味",
                reciveState: true
              })
            } else if (res.data.resultCode == 'FAILED') {
              that.setData({
                msg: res.data.data,
                success: "../../images/icon-shibai.png",
                reciveMsg: "前往商城"
              })
            } else if (res.data.resultCode == 'RECLAIM') {
              that.setData({
                msg: res.data.data,
                success: "../../images/icon-chongfu.png",
                reciveMsg: "前往商城"
              })
            }
          }
        })
      }
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