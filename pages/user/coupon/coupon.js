const app = getApp()
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseImg: app.globalData.baseImg,
    cardList: [],
    rotate_deg: 0,
    descHeight: 0,
    coupon_code: "",
    code_name: "",
    showMask: false,
    animationData: {},
    reqState: false
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    const that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (app.globalData.userInfo) {
      wx.hideLoading()
      if (!app.globalData.userInfo.authorizedFlag) {
        wx.navigateTo({
          url: '/pages/authorize/authorize',
        })
      } else {
        let unionid = app.globalData.userInfo.unionid
        that.getCouponList(unionid)
      }
    } else {
      app.userInfoReadyCallback = res => {
        if (res) {
          wx.hideLoading()
          if (!res.authorizedFlag) {
            wx.navigateTo({
              url: '/pages/authorize/authorize',
            })
          } else {
            that.getCouponList(res.unionid)
          }
        } else {
          wx.hideLoading()
        }
      }
    }
  },
  // 获取优惠券列表
  getCouponList: function(unionid) {
    wx.request({
      url: `${this.data.baseUrl}/coupon/getCouponUserListByUnionid`,
      data: {
        "unionid": unionid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: (res) => {
        if (res.data.resultCode == "SUCCEED") {
          wx.hideLoading()
          let data = res.data.data.map(item => {
            return Object.assign(item, {
              rotate_deg: 0,
              descHeight: 0
            })
          })
          this.setData({
            cardList: data
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '获取数据失败',
            icon: "none"
          })
        }
      },
      complete: () => {
        this.setData({
          reqState: true
        })
      },
      fail: function(err) {
        wx.showToast({
          title: '获取数据失败',
          icon: "none"
        })
      }
    })
  },
  showCode: function(e) {
    let data = e.currentTarget.dataset.info
    if (data.coupon_type == 1) {
      this.setData({
        coupon_code: data.coupon_code,
        code_name: data.title
      })
      drawQrcode({
        width: 220,
        height: 220,
        canvasId: 'myQrcode',
        text: 100000 + data.coupon_code
      })
      // var animation = wx.createAnimation({
      //   duration: 100,
      //   timingFunction: 'ease',
      // })
      // this.animation = animation
      // animation.opacity(0).scale(1).step()
      // this.setData({
      //   animationData: animation.export()
      // })
      // setTimeout(function() {
      //   // 执行第二组动画
      //   animation.opacity(1).scale(1).step();
      //   // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      //   this.setData({
      //     animationData: animation
      //   })
      // }.bind(this), 50)
      this.setData({
        // animationData: animation.export(),
        showMask: true,
      })
    }
  },
  hideCode: function() {
    this.setData({
      showMask: false
    })
  },
  getState: function(state) {
    console.log(state)
    return 1
  },
  onDescShow: function(e) {
    let index = e.currentTarget.dataset.index
    var rotate_deg = `cardList[${index}].rotate_deg`
    var descHeight = `cardList[${index}].descHeight`
    if (this.data.cardList[index].rotate_deg == 90) {
      this.setData({
        [rotate_deg]: 0,
        [descHeight]: 0,
      })
    } else {
      this.setData({
        [rotate_deg]: 90,
        [descHeight]: "auto",
      })
    }

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
    if (app.globalData.userInfo) {
      this.getCouponList(app.globalData.userInfo.unionid)
    }
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
  onPageScroll: function() {
    console.log("scroll")
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("上拉")
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})