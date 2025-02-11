// pages/accredit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  },

  // 获取用户信息
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        wx.setStorageSync("userInfo", res.userInfo);
        wx.switchTab({
          url: '/pages/index/index'
        });
      }
    })
  },

})