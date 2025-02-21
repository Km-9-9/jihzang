// pages/remind/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearNow: '',
    monthNow: '',
    budget: '',
    budget1: '',
    totalExpend: 0
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
    this.getTimeNow()
    this.getJizhang()
    this.getYusuan()
  },

  // 获取当前年月
  getTimeNow() {

    let now = new Date()
    let yearNow = now.getFullYear()
    let monthNow = now.getMonth() + 1
    monthNow = (monthNow < 10) ? '0' + monthNow : monthNow.toString()
    this.setData({
      yearNow,
      monthNow
    })
  },

  // 获取年月的记账信息
  getJizhang() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getInfo',
      data: {
        tel: wx.getStorageSync('tel'),
        monthNow: this.data.monthNow,
        yearNow: this.data.yearNow
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let list = res.data.list
        this.getSort(list)
        // console.log(list)

        // console.log(recordsList);
        wx.hideLoading()

      }
    })
  },

  // 排序
  getSort(list) {
    let arr = {}

    list.forEach((item, index) => {
      let { time, day } = item
      if (!arr[time] && !arr[day]) {
        arr[time] = {
          time,
          day,
          child: []
        }
      }
      arr[time].child.push(item)
    })

    let recordsList = Object.values(arr)

    recordsList.sort((a, b) => new Date(a.time) - new Date(b.time))
    // console.log(recordInfo)
    this.setData({
      recordsList
    })

    let totalExpend = 0
    let totalIncome = 0

    recordsList.forEach((item, index) => {
      // 总支出
      totalExpend = totalExpend + item.child.reduce((sum, item1) => {
        if (item1.isActive == 1) {
          return sum + +item1.money
        }
        return sum
      }, 0)

      // 总收入
      totalIncome = totalIncome + item.child.reduce((sum, item1) => {
        if (item1.isActive == 2) {
          return sum + +item1.money
        }
        return sum
      }, 0)
    })
    this.setData({
      totalExpend,
      totalIncome
    })
  },

  // 获取本月预算
  getYusuan() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getYusuan',
      data: {
        tel: wx.getStorageSync('tel'),
        year: this.data.yearNow,
        month: this.data.monthNow
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.list.length > 0) {
          // 设置了本月预算
          const budget = res.data.list[0].budget
          this.setData({
            budget
          })
        }
        wx.hideLoading()
      }
    })
  },

  // 设置预算输入框内容发生改变
  onChange(e) {
    // console.log(e.detail)
    this.setData({
      budget1: e.detail
    })
  },

  // 设置本月预算
  setBudget() {
    // console.log(budget)
    if (!this.data.budget) {
      // 一开始未设置预算，点击保存就是设置预算
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: 'http://127.0.0.1:5000/setBudget',
        data: {
          tel: wx.getStorageSync('tel'),
          year: this.data.yearNow,
          month: this.data.monthNow,
          budget: this.data.budget1
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '设置成功！',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#966fef'
            });
          }
          this.getYusuan()
          wx.hideLoading()
        }
      })
    } else {
      // 修改预算
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: 'http://127.0.0.1:5000/editBudget',
        data: {
          tel: wx.getStorageSync('tel'),
          year: this.data.yearNow,
          month: this.data.monthNow,
          budget: this.data.budget1
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '设置成功！',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#966fef'
            });
          }
          this.getYusuan()
          wx.hideLoading()
        }
      })
    }
  }

})