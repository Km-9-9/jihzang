
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearNow: '',
    showYear: false,
    currentDate: new Date().getTime(),
    yearIncome: 0, // 年收入
    yearDisburse: 0, // 年支出
    yearList: [],
    yearJieyu: 0,
    array: [
      {
        id: 0,
        month: '12',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 1,
        month: '11',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 2,
        month: '10',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 3,
        month: '09',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 4,
        month: '08',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 5,
        month: '07',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 6,
        month: '06',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 7,
        month: '05',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 7,
        month: '04',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 8,
        month: '03',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 1,
        month: '02',
        shouru: 0,
        zhichu: 0
      },
      {
        id: 11,
        month: '01',
        shouru: 0,
        zhichu: 0
      }
    ]
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
    this.getJizhangYear()

  },

  // 获取当前年份
  getTimeNow() {
    let now = new Date()
    let yearNow = now.getFullYear()

    this.setData({
      yearNow
    })
  },

  // 获取年份的记账数据
  getJizhangYear() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getJizhangYear',
      data: {
        tel: wx.getStorageSync('tel'),
        yearNow: this.data.yearNow
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        // console.log(res.data.list)
        const yearList = res.data.list
        // 计算年总收入
        let income = yearList.filter(item => {
          return item.isActive == '2'
        })
        let yearIncome = income.reduce((sum, item) => {
          return sum + +item.money
        }, 0)
        // console.log(yearIncome)

        // 计算年总支出
        let disburse = yearList.filter(item => {
          return item.isActive == '1'
        })
        let yearDisburse = disburse.reduce((sum, item) => {
          return sum + +item.money
        }, 0)
        // console.log(yearDisburse)

        // 计算年总结余
        let yearJieyu = yearIncome - yearDisburse
        // console.log(yearJieyu)

        this.setData({
          yearList,
          yearIncome,
          yearDisburse,
          yearJieyu
        })
        this.getEveryMonth()
        wx.hideLoading()
      }
    })
  },

  // 切换年份
  handleYear() {
    this.setData({
      showYear: true
    })
  },

  // 关闭选择年弹出框
  onCloseYear() {
    this.setData({
      showYear: false,
    });
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    })
  },

  // 时间戳转换成日期
  changeTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();

    this.setData({
      yearNow: year
    })
  },

  // 根据日期筛选记账记录
  filterJizhang() {
    this.changeTime(this.data.currentDate)
    this.getJizhangYear()

    this.setData({
      showYear: false
    })
  },

  // 计算每月的支出和收入
  getEveryMonth() {
    let yearList = this.data.yearList
    let array = this.data.array
    array.forEach(item => {
      // console.log(item.month)
      let twelveList = yearList.filter(item1 => {
        if (item1.time.includes(`${this.data.yearNow}-${item.month}`)) {
          return item
        }
      })
      // console.log(twelveList)
      
      // 本月支出
      let disburse = twelveList.filter(item1 => {
        return item1.isActive == '1'
      })
      let twelveDisburse = disburse.reduce((sum, item1) => {
        return sum + +item1.money
      }, 0)
      item.zhichu = twelveDisburse
      
      // console.log(item.zhichu)
      
      // 本月收入
      let income = twelveList.filter(item1 => {
        return item1.isActive == '2'
      })
      let twelveIncome = income.reduce((sum, item1) => {
        return sum + +item1.money
      }, 0)
      item.shouru = twelveIncome

    })

    this.setData({
      array
    })

  },

})