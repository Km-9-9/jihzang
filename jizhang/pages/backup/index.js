Page({
  data: {
    backupStart: '',    // 备份开始日期
    backupEnd: '',      // 备份结束日期
    restoreStart: '',   // 恢复开始日期
    restoreEnd: ''      // 恢复结束日期
  },

  // 备份部分日期选择处理
  bindStartDateChange(e) {
    this.setData({ backupStart: e.detail.value });
  },

  bindEndDateChange(e) {
    this.setData({ backupEnd: e.detail.value });
  },

  handleBackupByRange() {
    this._handleDateOperation('backup');
  },

  // 恢复部分日期选择处理
  bindRestoreStartDateChange(e) {
    this.setData({ restoreStart: e.detail.value });
  },

  bindRestoreEndDateChange(e) {
    this.setData({ restoreEnd: e.detail.value });
  },

  handleRestoreByRange() {
    this._handleDateOperation('restore');
  },

  // 统一日期处理方法
  safeDateParse(dateStr) {
    if (!dateStr) return '';
    // 处理 iOS 不兼容格式
    const normalized = dateStr
      .replace(/ /g, 'T')    // 空格转 T
      .replace(/\.\d+/, ''); // 去除毫秒
    return new Date(normalized);
  },

  // 格式化日期函数
  formatDate(dateStr) {
    const date = this.safeDateParse(dateStr);
    if (!date || isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  _handleDateOperation(type) {
    const prefix = type === 'backup' ? 'backup' : 'restore';
    const start = this.data[`${prefix}Start`];
    const end = this.data[`${prefix}End`];
    const tel = wx.getStorageSync('tel');

    // 验证日期范围
    if (!start || !end) {
      wx.showToast({ title: '请选择完整日期范围', icon: 'none' });
      return;
    }
    if (start > end) {
      wx.showToast({ title: '开始日期不能晚于结束日期', icon: 'none' });
      return;
    }

    wx.showLoading({ title: type === 'backup' ? '备份中...' : '恢复中...', mask: true });

    // 动态配置请求参数
    const config = {
      backup: {
        url: 'http://127.0.0.1:5000/backupToManualByRange',
        successMsg: '备份成功'
      },
      restore: {
        url: 'http://127.0.0.1:5000/restoreFromManualByRange',
        successMsg: '恢复成功'
      }
    }[type];

    wx.request({
      url: config.url,
      method: 'GET',
      data: {
        tel: tel,
        startDate: this.formatDate(start),
        endDate: this.formatDate(end)
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code === 200) {
          wx.showToast({ title: res.data.msg || config.successMsg, icon: 'success' });
        } else {
          wx.showToast({ title: res.data.msg || '操作失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误，请重试', icon: 'none' });
      }
    });
  }
});