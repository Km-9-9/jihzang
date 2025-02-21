Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    paw: '',
    confirmPaw: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id
    })
  },

  onChangePaw(event) {
    this.setData({
      paw: event.detail
    })
  },

  onChangeConfirmPaw(event) {
    this.setData({
      confirmPaw: event.detail
    })
  },

  // 确认修改个人信息
  editUserInfo() {
    // 密码验证
    if (!(this.data.paw.length >= 6 && this.data.paw.length <= 16)) {
      wx.showModal({
        title: '提示',
        content: "密码必须是6 - 16位",
        showCancel: false,
        success() {
        }
      })
      return
    }

    // 确认密码验证
    if (this.data.paw !== this.data.confirmPaw) {
      wx.showModal({
        title: '提示',
        content: "两次输入的密码不一致",
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
              content: "修改成功，请重新登录",
              showCancel: false,
              success: (res2) => {
                if (res2.confirm) {
                  // 清除本地存储中的用户信息
                  wx.clearStorageSync();
                  // 跳转到登录页面
                  wx.navigateTo({
                    url: '/pages/login/index'
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