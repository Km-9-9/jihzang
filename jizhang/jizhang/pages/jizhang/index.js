
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive: '1',
    showFenlei: false,
    showTime: false,
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
    type: '',
    time: '',
    day: '',
    currentDate: new Date().getTime(),
    money: '',
    msg: '',
    num: null,
    yearNow: '', // 当前年份
    monthNow: '', // 当前月份
    budget: null,
    totalExpend: null
  },

  onLoad(options) {

  },

  onShow() {
    this.setFenlei()
    this.getTimeNow()
  },

  // 支出和收入相关的分类
  setFenlei() {
    if(this.data.isActive == '1') {
      this.setData({
        actions: this.data.action1
      })
    } else if(this.data.isActive == '2') {
      this.setData({
        actions: this.data.action2
      })
    }
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
    // console.log(event.detail.name)
    this.setData({
      type: event.detail.name,
      num: event.detail.id
    })
  },

  // 显示日期弹出框
  showTime() {
    this.setData({
      showTime: true
    })
  },

  // 关闭选择时间弹出框
  closeTimeDialog() {
    this.setData({
      showTime: false
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
    const date1 = new Date(timestamp)
    
    this.setData({
      time: formattedDate,
      day: days[date1.getDay()]
    })
  },

  // 金额输入框发生改变
  onChangeMoney(event) {
    this.setData({
      money: event.detail
    })
  },

  // 备注输入框发生改变
  onChangeMsg(event) {
    this.setData({
      msg: event.detail
    })
  },

  // 改变选择类型
  onChange(event) {
    this.setData({
      isActive: event.detail,
    });
    this.setFenlei()
  },

  // 点击提交
  subRecords() {
    if (!this.data.type.trim()) {
      wx.showModal({
        title: '提示',
        content: "请选择分类！",
        showCancel: false,
        confirmColor: '#966fef'
      })
      return
    }
    if (!this.data.time.trim()) {
      wx.showModal({
        title: '提示',
        content: "请选择日期！",
        showCancel: false,
        confirmColor: '#966fef'
      })
      return
    }
    if (!this.data.money.trim()) {
      wx.showModal({
        title: '提示',
        content: "请输入金额！",
        showCancel: false,
        confirmColor: '#966fef'
      })
      return
    }

    // console.log(this.data.time)
    
    // 判断记账是否是当前月份的支出记账信息以及是否设置了预算
    if(this.data.time.includes(`${this.data.yearNow}-${this.data.monthNow}`) && this.data.isActive == 1 && this.data.budget !== null) {
      // 是本月的记账记录判断本月支出是否超过预算
      
      
      console.log(this.data.totalExpend + +this.data.money)
      console.log(this.data.budget)
      
      
      if(this.data.totalExpend + +this.data.money > +this.data.budget) {
        // 本月支出加本次记账大于本月预算
        wx.showModal({
          title: '提示',
          content: '本月支出已超出预算！',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#966fef',
          success: (result) => {
            if (result.confirm) {
            }
          }
        })
        return
      }
      
    }

    // 提交信息
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/addInfo',
      data: {
        tel: wx.getStorageSync('tel'),
        isActive: this.data.isActive,
        money: this.data.money,
        msg: this.data.msg,
        time: this.data.time,
        day: this.data.day,
        type: this.data.type,
        num: this.data.num
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
            content: "记录成功！",
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

  // 获取当前年月
  getTimeNow() {

    let now = new Date()
    let yearNow = now.getFullYear()
    let monthNow = now.getMonth() + 1

    this.setData({
      yearNow,
      monthNow
    })
    // 本月支出
    this.getJizhang()
    // 本月预算
    this.getYusuan()
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
        // console.log(res.data)
        
        let budget = res.data.list[0].budget
        console.log(budget)
        
        if(!budget) {
          this.setData({
            budget: ''
          })
        } else {
          this.setData({
            budget
          })
        }
        wx.hideLoading()

      }
    })
  },

  // 获取本月的记账信息
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

        wx.hideLoading()

      }
    })
  },

  // 排序 计算本月总支出
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

    let totalExpend = 0

    recordsList.forEach((item, index) => {
      // 总支出
      totalExpend = totalExpend + item.child.reduce((sum, item1) => {
        if (item1.isActive == 1) {
          return sum + +item1.money
        }
        return sum
      }, 0)

    })
    // console.log(totalExpend)
    
    this.setData({
      totalExpend
    })
  },

})