Component({
  properties: {
    isShow: Boolean
  },
  methods: {
    hidden: function() {
      this.setData({
        isShow: !this.data.isShow
      })
    }
  }
})