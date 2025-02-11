// pages/setting/index.js
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

  // 退出登录
  exitLogin() {
    wx.showModal({
      title: '提示',
      content: '是否退出登录',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#966fef',
      success: (result) => {
        if (result.confirm) {
          wx.clearStorageSync();
          wx.navigateTo({
            url: '/pages/login/index'
          });
            
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
  },

  onShow() {

  }

})