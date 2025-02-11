// pages/edit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: {},
    showTime: false,
    showFenlei: false,
    actions: [],
    action1: [
      {
        id: 0,
        name: '餐饮',
      },
      {
        id: 1,
        name: '购物',
      },
      {
        id: 3,
        name: '交通',
      },
      {
        id: 7,
        name: '娱乐',
      },
      {
        id: 9,
        name: '旅行',
      }
    ],
    action2: [
      {
        id: 0,
        name: '工资',
      },
      {
        id: 1,
        name: '理财',
      },
      {
        id: 2,
        name: '其它收入',
      }
    ],
    currentDate: new Date().getTime()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // console.log(options);
    this.setData({
      id: options.id
    })
    this.getDetail(this.data.id)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  // 支出和收入相关的分类
  setFenlei() {
    let detail = this.data.detail
    // console.log(detail)

    if (this.data.detail.isActive == '1') {
      this.setData({
        actions: this.data.action1
      })
    } else if (this.data.detail.isActive == '2') {
      this.setData({
        actions: this.data.action2
      })
    }
  },

  // 根据id获取记账详情
  getDetail(id) {
    // 根据id获取记账详情
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getDetail',
      data: {
        id
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // console.log(res)
        this.setData({
          detail: res.data.list[0]
        })
        // console.log(this.data.detail)
        this.setFenlei()
        wx.hideLoading()
      }
    })
  },

  // 改变支出或收入选择类型
  onChange(event) {
    this.setData({
      'detail.isActive': event.detail,
    })
    this.setFenlei()
  },

  // 显示分类弹出框
  showFenlei() {
    this.setData({
      showTime: false,
      showFenlei: true
    })
  },

  // 关闭分类弹出框
  onCloseFenlei() {
    this.setData({ showFenlei: false });
  },

  // 选择分类
  onSelect(event) {
    // console.log(event.detail.id)
    this.setData({
      'detail.type': event.detail.name,
      'detail.num': event.detail.id
    })
  },

  // 显示日期弹出框
  showTime() {
    this.setData({
      showTime: true
    })
  },

  // 选择时间
  onInput(event) {
    // console.log(event.detail);
    this.getTime(event.detail)
    this.setData({
      currentDate: event.detail,
    });
  },

  // 时间戳转换成日期
  getTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const formattedDate = year + '-' + month + '-' + day;
    // console.log(formattedDate);
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const date1 = new Date(timestamp);
    this.setData({
      'detail.time': formattedDate,
      'detail.day': days[date1.getDay()]
    })
  },

  // 关闭选择时间弹出框
  closeTimeDialog() {
    this.setData({
      showTime: false
    })
  },

  // 金额输入框发生改变
  onChangeMoney(event) {
    this.setData({
      'detail.money': event.detail
    })
  },

  // 备注输入框发生改变
  onChangeMsg(event) {
    this.setData({
      'detail.msg': event.detail
    })
  },

  // 点击修改
  editRecords() {
    console.log(this.data.detail.time)


    if (!this.data.detail.type.trim()) {
      wx.showModal({
        title: '提示',
        content: "请选择分类！",
        showCancel: false,
        confirmColor: '#966fef'
      })
      return
    }
    if (!this.data.detail.time.trim()) {
      wx.showModal({
        title: '提示',
        content: "请选择日期！",
        showCancel: false,
        confirmColor: '#966fef'
      })
      return
    }
    if (!this.data.detail.money.trim()) {
      wx.showModal({
        title: '提示',
        content: "请输入金额！",
        showCancel: false,
        confirmColor: '#966fef'
      })
      return
    }

    // 提交信息
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/editInfo',
      data: {
        id: this.data.id,
        isActive: this.data.detail.isActive,
        money: this.data.detail.money,
        msg: this.data.detail.msg,
        time: this.data.detail.time,
        day: this.data.detail.day,
        type: this.data.detail.type,
        num: this.data.detail.num
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // console.log(res)
        wx.hideLoading()
        if (res.data.code == 200) {
          this.setData({
            isActive: '1',
            money: '',
            msg: '',
            time: '',
            day: '',
            type: '',
            num: null
          })
          wx.showModal({
            title: '提示',
            content: "修改成功！",
            showCancel: false,
            confirmColor: '#966fef',
            success: (res) => {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }
            },
          })
        }
      }
    })
  },

  // 删除记账
  delRecords() {
    wx.showModal({
      title: '提示',
      content: '是否删除该记账',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#966fef',
      success: (result) => {
        if (result.confirm) {
          // 提交信息
          wx.showLoading({
            title: '加载中...',
          })
          wx.request({
            url: 'http://127.0.0.1:5000/delInfo',
            data: {
              id: this.data.id
            },
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              // console.log(res)
              wx.hideLoading()
              if (res.data.code == 200) {
                wx.showModal({
                  title: '提示',
                  content: "删除成功！",
                  showCancel: false,
                  confirmColor: '#966fef',
                  success: (res) => {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '/pages/index/index'
                      });
                    }
                  },
                })
              }
            }
          })
        }
      }
    });


  }

})