const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unionId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
      unionId: app.globalData.userInfo.unionid
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
  onShareAppMessage: function(res) {
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      return {
        title: '便丽猫请你来尝鲜！',
        path: '/pages/index/newUser/newUser?unionId=' + this.data.unionId,
        imageUrl: "../../../images/shareimg.jpg"
      }
    } else if (res.from === 'button') {
      return {
        title: '便丽猫请你来尝鲜！',
        path: '/pages/index/newUser/newUser?unionId=' + this.data.unionId,
        imageUrl: "../../../images/shareimg.jpg"
      }
    }
  }
})