const app = getApp()
import drawQrcode from '../../../utils/weapp.qrcode.esm.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    baseImg: app.globalData.baseImg,
    userInfo: null,
    codeHeight: 135,
    orderList: [],
    codeList: [],
    active: false,
    down: "../../../images/icon-xia.png",
    showMask: false,
    animationData: {},
    cardVoucherId: "", // 兑换码id
    isActive: "",
    shareImg: "",
    cuttentIndex: null,
    heightStyle: "135",
    cardVoucherCode: "",
    cardVoucherTitle:""
  },
  isShow: function(e) {
    let index = e.target.dataset.index
    var rotate_deg = `orderList[${index}].rotate_deg`
    var codeHeight = `orderList[${index}].codeHeight`
    if (this.data.orderList[index].rotate_deg == 180) {
      this.setData({
        [rotate_deg]: 0,
        [codeHeight]: 135,
      })
    } else {
      this.setData({
        [rotate_deg]: 180,
        [codeHeight]: this.data.orderList[index].cardVoucherList.length * 45,
      })
    }
  },
  toGoodsInfo: function(el) {
    let id = el.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({
        url: `/pages/index/goodsInfo/index?id=${id}`,
      })
    }
  },
  showCode: function(option) {

    let state = option.currentTarget.dataset.state
    let refundState = option.currentTarget.dataset.refund
    let cardVoucherCode = option.currentTarget.dataset.code
    let cardVoucherTitle = option.currentTarget.dataset.title
    this.setData({
      shareImg: option.currentTarget.dataset.img
    })
    if (state == 0 && refundState) {
      drawQrcode({
        width: 220,
        height: 220,
        canvasId: 'myQrcode',
        text: 100000 + cardVoucherCode
      })
      this.setData({
        cardVoucherId: option.currentTarget.dataset.cardvoucherid,
        cardVoucherCode: cardVoucherCode,
        cardVoucherTitle: cardVoucherTitle
      })
      var animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.opacity(0).scale(0.8).step()
      this.setData({
        animationData: animation.export()
      })
      setTimeout(function() {
        // 执行第二组动画
        animation.opacity(1).scale(1).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
        this.setData({
          animationData: animation
        })
      }.bind(this), 50)
      this.setData({
        animationData: animation.export(),
        showMask: true,
      })
    }
  },
  hideCode: function() {
    this.setData({
      showMask: false
    })
  },
  refund: function(e) {
    const that = this
    let orderId = e.target.dataset.id
    let state = e.target.dataset.state
    if (state == 2) {
      wx.showModal({
        title: '提示',
        content: '确定退款吗？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: `${that.data.baseUrl}/order/refundOrder`,
              data: {
                orderId: orderId
              },
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              success: function(res) {
                if (res.data.resultCode == 'SUCCEED') {
                  that.getOrderList()
                  wx.showToast({
                    title: '退款成功',
                    icon: "none"
                  })

                } else {
                  wx.showToast({
                    title: '退款失败',
                    icon: "none"
                  })
                }
                console.log(res)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  onShareAppMessage: function(res) {
    console.log(res)
    var unionid = app.globalData.userInfo.unionid
    let shareImg = res.target.dataset.img
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      return {
        title: '便丽猫请你来尝鲜！',
        path: '/pages/share/share?id=123',
      }
    } else if (res.from === 'button') {
      let ids = ""
      let type = ""
      if (res.target.dataset.orderid) {
        ids = res.target.dataset.orderid
        type = 1
      } else if (res.target.dataset.cardvoucherid) {
        ids = res.target.dataset.cardvoucherid
        type = 0
      }
      return {
        title: '便丽猫请你来尝鲜！',
        path: '/pages/share/share?id=' + ids + '&unionid=' + unionid + '&type=' + type,
        imageUrl: shareImg
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getOrderList()
  },
  getOrderList: function() {
    const that = this
    let unionid = app.globalData.userInfo.unionid
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    })
    wx.request({
      url: `${this.data.baseUrl}/order/listOrder`,
      data: {
        unionId: unionid,
      },
      success: (res) => {
        if (res.data.resultCode == "SUCCEED") {
          wx.hideLoading()
          let data = res.data.data.map(item => {
            return Object.assign(item, {
              rotate_deg: 0,
              codeHeight: 135,
              cardVoucherList: item.cardVoucherList || []
            })
          })
          that.setData({
            orderList: data
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '获取数据失败',
            icon: "none"
          })
        }
        console.log(res)
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
    // console.log(app.globalData.userInfo)
    // this.setData({
    //   userInfo: app.globalData.userInfo
    // })
    // if (userInfo) {
    //   wx.redirectTo({
    //     url: '/pages/login/index',
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