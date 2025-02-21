Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: {},
    id: null,
    tel: '',
    paw: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserInfo()
    this.setData({
      tel: wx.getStorageSync('tel')
    })
  },

  // 获取用户信息
  getUserInfo() {
    const avatarUrl = wx.getStorageSync('userInfo').avatarUrl

    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getUserSearch',
      data: {
        tel: wx.getStorageSync('tel')
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        wx.hideLoading()
        this.setData({
          id: res.data.list[0].id,
          paw: res.data.list[0].paw
        })
      }
    })
    this.setData({
      avatarUrl
    })
  },

  goToChangePassword() {
    wx.navigateTo({
      url: `/pages/changePassword/index?id=${this.data.id}`
    })
  }

})