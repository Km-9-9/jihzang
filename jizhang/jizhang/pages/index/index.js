
Page({
    data: {
        // recordInfo: [],
        recordsList: [],
        currentDate: new Date().getTime(),
        showMonth: false,
        yearNow: '',
        monthNow: '',
        time: '',
        totalExpend: 0, // 支出
        totalIncome: 0, // 收入
        showFenlei: false,
        type: '',
        actions: [
            {
                id: 0,
                name: '全部类型',
            },
            {
                id: 1,
                name: '餐饮',
            },
            {
                id: 2,
                name: '购物',
            },
            {
                id: 3,
                name: '交通',
            },
            {
                id: 4,
                name: '娱乐',
            },
            {
                id: 5,
                name: '旅行',
            },
            {
                id: 6,
                name: '工资',
            },
            {
                id: 7,
                name: '理财',
            },
            {
                id: 8,
                name: '其它收入',
            }
        ]
    },

    onLoad: function (options) {

    },

    onShow: function () {
        this.getTimeNow()
        this.getJizhang()
    },

    // 跳转到修改记账
    toEdit(event) {
        const id = event.currentTarget.dataset.id
        wx.navigateTo({
            url: '../edit/index?id=' + id
        });
          
    },

    // 显示筛选分类弹出层
    showFenlei() {
        this.setData({
            showFenlei: true
        })
    },

    // 选择分类
    onSelect(event) {
        // console.log(event.detail.name)
        this.setData({
            type: event.detail.name
        })
        if(event.detail.name == '全部类型') {
            this.getJizhang()
            return
        } else {
            this.filterLeixing()
        }
    },

    // 根据类型筛选记账记录
    filterLeixing() {
        wx.showLoading({
            title: '加载中...',
        })
        wx.request({
            url: 'http://127.0.0.1:5000/getLeixing',
            data: {
                tel: wx.getStorageSync('tel'),
                monthNow: this.data.monthNow,
                yearNow: this.data.yearNow,
                type: this.data.type
            },
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                let list = res.data.list
                this.getSort(list)
                // console.log(recordsList);
                wx.hideLoading()
            }
        })
        // let recordsList = this.data.recordsList
        // let type = this.data.type

        // let res = []
        // let list = []
        // recordsList.forEach((item, index) => {

        //     res = item.child.filter(item1 => {

        //         return item1.type == type
        //     })
        //     console.log(res);

        //     list.push(...res)
        // })
        // console.log(list);

        // this.setData({
        //     showMonth: false
        // })
    },

    // 关闭分类弹出框
    onCloseFenlei() {
        this.setData({ showFenlei: false });
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
            totalIncome,
            recordsList
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
        this.getJizhang()
        // this.getNowJizhang()
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
        this.getJizhang()

        this.setData({
            showMonth: false,
            type: ''
        })
    },


    // 获取当前年月的记账信息
    // getJizhang() {
    //     wx.showLoading({
    //         title: '加载中...',
    //     })
    //     wx.request({
    //         url: 'http://127.0.0.1:5000/getInfo',
    //         data: {
    //             tel: '17860252293'
    //         },
    //         header: {
    //             'content-type': 'application/json'
    //         },
    //         success: res => {
    //             //   console.log(res)
    //             let list = res.data.list
    //             let arr = {}

    //             list.forEach((item, index) => {
    //                 let { time, day } = item
    //                 if (!arr[time] && !arr[day]) {
    //                     arr[time] = {
    //                         time,
    //                         day,
    //                         child: []
    //                     }
    //                 }
    //                 arr[time].child.push(item)
    //             })
    //             let recordInfo = Object.values(arr)
    //             recordInfo.sort((a, b) => new Date(a.time) - new Date(b.time))
    //             // console.log(recordInfo)
    //             this.setData({
    //                 recordInfo
    //             })
    //             // console.log(recordInfo);
    //             // 筛选当前月份的记账
    //             let recordsList = []

    //             recordsList = recordInfo.filter(item => {
    //                 return new Date(item.time).getFullYear() == this.data.yearNow && new Date(item.time).getMonth() + 1 == this.data.monthNow
    //             })

    //             let totalExpend = 0
    //             let totalIncome = 0

    //             recordsList.forEach((item, index) => {
    //                 // 总支出
    //                 totalExpend = totalExpend + item.child.reduce((sum, item1) => {
    //                     if (item1.isActive == 1) {
    //                         return sum + +item1.money
    //                     }
    //                     return sum
    //                 }, 0)

    //                 // 总收入
    //                 totalIncome = totalIncome + item.child.reduce((sum, item1) => {
    //                     if (item1.isActive == 2) {
    //                         return sum + +item1.money
    //                     }
    //                     return sum
    //                 }, 0)
    //             })
    //             this.setData({
    //                 totalExpend,
    //                 totalIncome,
    //                 recordsList
    //             })
    //             console.log(recordsList);
    //             wx.hideLoading()
    //             // console.log('a');

    //         }
    //     })
    // },

});

