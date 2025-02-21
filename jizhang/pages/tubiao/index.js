import * as echarts from "../../ec-canvas/echarts"
// 饼图
let chart = null
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  let option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  chart.setOption(option);
  return chart;
}
// 柱状图
let chart1 = null
function initChart1(canvas, width, height) {
  chart1 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart1);

  let option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  };
  chart1.setOption(option);
  return chart1;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isActive: '1',
    yearNow: '',
    monthNow: '',
    totalExpend: 0, // 支出
    totalIncome: 0, // 收入
    showMonth: false,
    jizhangList: [],
    currentDate: new Date().getTime(),
    ec: {
      onInit: initChart
    },
    ec1: {
      onInit: initChart1
    }
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
    this.filterLeixing()
  },

  // 改变选择类型
  onChangeLeixing(event) {

    this.setData({
      isActive: event.detail,
    });
    this.filterLeixing()
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
  },

  // 根据支出/收入筛选记账记录
  filterLeixing() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: 'http://127.0.0.1:5000/getIsActive',
      data: {
        tel: wx.getStorageSync('tel'),
        monthNow: this.data.monthNow,
        yearNow: this.data.yearNow,
        isActive: this.data.isActive
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        let list = res.data.list

        let totalExpend = 0
        let totalIncome = 0

        if (this.data.isActive == '1') {
          // 总支出
          totalExpend = list.reduce((sum, item) => {
            return sum + +item.money
          }, 0)
          // console.log(totalExpend)
          this.setData({
            totalExpend
          })
        } else if (this.data.isActive == '2') {
          // 总收入
          totalIncome = list.reduce((sum, item) => {
            return sum + +item.money
          }, 0)
          // console.log(totalIncome)
          this.setData({
            totalIncome
          })
        }

        let jizhangList = list.map(item => {
          return {
            name: item.type,
            value: item.money
          }
        })

        // console.log(jizhangList);
        // 类别一样的对money求和
        let sumByName = jizhangList.reduce((acc, current) => {
          if (acc[current.name]) {
            acc[current.name] += +current.value;
          } else {
            acc[current.name] = +current.value;
          }
          return acc;
        }, {});

        // 对象变数组
        jizhangList = Object.entries(sumByName).map(([name, value]) => ({ name, value }));
        // console.log(jizhangList)
        

        this.setData({
          jizhangList
        })

        // 动态渲染echarts饼图
        let option = {
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              // name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: this.data.jizhangList,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        let arr = jizhangList.map(item => {
          return item.name
        })
        let arr1 = jizhangList.map(item => {
          return item.value
        })
        
        // 动态渲染echarts柱状图
        let option1 = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: arr,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: this.data.isActive == '1' ? '支出' : '收入',
              type: 'bar',
              barWidth: '60%',
              data: arr1,
              itemStyle: {
                // 设置柱状图的颜色
                color: '#966fef'
            }
            }
          ]
        };

        setTimeout(() => {
          chart.clear()
          chart.setOption(option);
          chart1.clear()
          chart1.setOption(option1);
        }, 300)

        wx.hideLoading()
      }
    })
  },

  // 切换月份
  handleMonth() {
    this.setData({
      showMonth: true
    })
  },

  // 关闭选择年月弹出框
  onCloseMonth() {
    this.setData({
      showMonth: false,
    });
    this.filterLeixing()
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    })
    // console.log(this.data.currentDate);
  },

  // 时间戳转换成日期
  changeTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);

    this.setData({
      yearNow: year,
      monthNow: month
    })
  },

  // 根据日期筛选记账记录
  filterJizhang() {
    this.changeTime(this.data.currentDate)
    this.filterLeixing()

    this.setData({
      showMonth: false,
      type: ''
    })
  },


})