const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImg: app.globalData.baseImg,
    baseUrl: app.globalData.baseUrl,
    imgUrls: [],
    detailPicture: [],
    indicatorDots: true,
    duration: 100,
    autoplay: true,
    interval: 3000,
    commercialInfo: {},
    specificationList: [],
    goodsInfo: {},
    currentIndex: 0,
    count: 1,
    price: 0,
    isShow: false,
    selectSku: "",
    payState: true
  },
  goodsSelect: function(e) {
    // 选择商品切换价格
    this.setData({
      currentIndex: e.target.dataset.index,
      goodsInfo: e.target.dataset.info,
      count: 1,
      price: e.target.dataset.info.price,
      selectSku: e.target.dataset.info.skuPictureUrl
    })
  },
  selectModel: function() {
    this.setData({
      isShow: true
    })
  },
  close: function() {
    this.setData({
      isShow: false
    })
  },
  // 增加数量
  add: function() {
    // console.log(this.data.goodsInfo.price)
    // console.log(this.data.price)
    this.setData({
      count: this.data.count += 1,
      ["goodsInfo.price"]: Math.floor(this.data.goodsInfo.price * 100 + this.data.price * 100) / 100
    })
  },
  // 减少数量
  reduce: function() {
    if (this.data.count > 1) {
      // console.log(this.data.goodsInfo.price)
      // console.log(this.data.price)
      this.setData({
        count: this.data.count -= 1,
        ["goodsInfo.price"]: Math.floor(this.data.goodsInfo.price * 100 - this.data.price * 100) / 100
      })
    } else {
      this.setData({
        count: 1
      })
    }
  },
  buy: function() {
    this.setData({
      isShow: true
    })
  },
  payment: function() {
    if (this.data.payState) {
      this.setData({
        payState: false
      })
      const that = this
      let userInfo = app.globalData.userInfo
      if (userInfo) {
        if (!userInfo.authorizedFlag) {
          this.setData({
            payState: true
          })
          wx.showToast({
            title: '请授权！',
            icon: "none"
          })
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        } else if (userInfo.authorizedFlag && !userInfo.memberFlag) {
          this.setData({
            payState: true
          })
          wx.navigateTo({
            url: '/pages/login/index',
          })
        } else {
          wx.request({
            url: `${this.data.baseUrl}/order/placeOrder`,
            data: {
              skuId: this.data.goodsInfo.sku,
              count: this.data.count,
              unionId: userInfo.unionid
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function(res) {
              if (res.data.resultCode == "SUCCEED") {

                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.packageValue,
                  signType: 'MD5',
                  paySign: res.data.data.paySign,
                  success(res) {
                   
                    wx.navigateTo({
                      url: '/pages/user/order/order',
                    })
                  },
                  fail(res) {
                    
                  },
                  complete() {
                    that.setData({
                      payState: true
                    })
                  }
                })
              } else if (res.data.resultCode == "FAILED") {
                // wx.showToast({
                //   title: res.data.resultMsg,
                //   icon: 'none'
                // })
                that.setData({
                  payState: true
                })
                wx.showToast({
                  title: res.data.resultMsg,
                  icon: "none"
                })
              }
              console.log(res)
            }
          })
        }
      }
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    })
    wx.request({
      url: `${this.data.baseUrl}/mall/productDetail`,
      data: {
        productCode: options.id
      },
      success: (res) => {
        if (res.data.resultCode == "SUCCEED") {
          wx.hideLoading()
          let data = res.data.data
          this.setData({
            commercialInfo: data.commercialInfo,
            specificationList: data.specificationList,
            goodsInfo: data.specificationList[0],
            price: data.specificationList[0].price,
            imgUrls: data.commercialBannerList,
            detailPicture: data.commercialDetailList,
            selectSku: data.specificationList[0].skuPictureUrl
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '获取数据失败',
            icon: "none"
          })
        }
      }
    })
  },

  hidden: function() {
    this.setData({
      isShow: false
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