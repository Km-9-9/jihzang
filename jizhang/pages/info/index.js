
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

  onChangePaw(event) {
    // console.log(event.detail)
    this.setData({
      paw: event.detail
    })
  },

  // 确认修改个人信息
  editUserInfo() {
    // 密码验证
    if (!(this.data.paw.length >= 6 && this.data.paw.length <= 16)) {
      wx.showModal({
        title: '提示',
        content: "密码必须是6-16位",
        showCancel: false,
        success() {
        }
      })
      return
    }
    
    if (this.data.paw) {
      wx.showLoading({
        title: '提交中',
      })
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: 'http://127.0.0.1:5000/editUserInfo',
        data: {
          id: this.data.id,
          paw: this.data.paw
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res)
          
          wx.hideLoading()
          if (res.data.code == 500) {
            wx.showModal({
              title: '提示',
              content: "修改失败",
              showCancel: false,
              success() {
              }
            })
          }
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: "修改成功",
              showCancel: false,
              success: (res2) => {
                if (res2.confirm) {
                  wx.switchTab({
                    url: '../my/index'
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
  }

})