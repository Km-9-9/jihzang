
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    paw: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUser(e) {
    console.log(e.detail.value)
    this.setData({
      user: e.detail.value
    });
  },
  getPaw(e) {
    console.log(e.detail.value)
    this.setData({
      paw: e.detail.value
    });
  },
  // 点击登录
  login() {
    if (this.data.user && this.data.paw) {
      wx.showLoading({
        title: '加载中...',
      })
      // 通过 wx.request 方法发送请求到后端服务器
      wx.request({
        url: 'http://127.0.0.1:5000/signIn',
        data: {
          tel: this.data.user,
          paw: this.data.paw
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          wx.hideLoading()
          if (res.data.code == 500) {
            wx.showModal({
              title: '提示',
              content: "密码错误",
              showCancel: false,
              success() {
              }
            })
          }
          if (res.data.code == 0) {
            wx.showModal({
              title: '提示',
              content: "该用户没有注册",
              showCancel: false,
              success() {
              }
            })
          }
          if (res.data.code == 200) {
            console.log(res.data)
            wx.showModal({
              title: '提示',
              content: "登录成功",
              showCancel: false,
              success: (res2) => {
                wx.setStorageSync('tel', res.data.data.tel)
                wx.setStorageSync('info', res.data.data)
                if (res2.confirm) {
                  wx.navigateTo({
                    url: '../accredit/index'
                  })
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请把信息输入完整',
        showCancel: false,
        success(res) {
        }
      })
    }
  },

  // 注册
  goRegister() {
    wx.navigateTo({
      url: '../zhuce/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


})