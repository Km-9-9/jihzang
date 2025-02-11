
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
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
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
  }

})