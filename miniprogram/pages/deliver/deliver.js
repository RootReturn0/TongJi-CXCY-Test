// miniprogram/pages/deliver/deliver.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    phone: '',
    location: '',
    index: 0,
    choosing: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}`;
      } else if (type === 'minute') {
        return `${value}`;
      }
      return value;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function() {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      });
    };
    const db = wx.cloud.database()
    // 查询当前用户所有的 userInfo
    await db.collection('userInfo').where({
      _openid: this.data.openid
    }).get({
      success: async res => {
        this.setData({
          packages: res.data[0]['packages'],
          phone: res.data[0]['phone'],
          location: res.data[0]['location'],
        });
        console.log('[数据库] [查询记录] 成功: ', res);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
  },

  onChooseTime: async function(event) {
    let status = 'packages[' + this.data.index + '].status';
    let currentDate = 'packages[' + this.data.index + '].currentDate';
    // await this.setPackages(event.currentTarget.dataset.index, event.detail)
    await this.setData({
      choosing: false,
      [status]: '已预约',
      [currentDate]: event.detail
    });
    await console.log(status, currentDate, this.data.packages)
    await this.onUpdate();
  },

  onCancel: function(event) {
    let status = 'packages[' + event.currentTarget.dataset.index + '].status';
    console.log(event.currentTarget.dataset.index, this.data.packages, this.data.packages[event.currentTarget.dataset.index])
    this.setData({
      [status]: '未预约'
    })
    this.onUpdate()
  },
  onCancelTime: function() {
    this.setData({
      choosing: false
    })
  },
  onConfirm: function(event) {
    if(!this.data.phone){
      wx.showToast({
        icon: 'none',
        title: '请先完善个人信息'
      })
      return
    } else if (!this.data.location){
      wx.showToast({
        icon: 'none',
        title: '请先完善位置信息'
      })
      return
    } else {
    this.setData({
      index: event.currentTarget.dataset.index,
      choosing: true
    }
    )}
  },
  onUpdate: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 userInfo
    console.log(this.data.packages)
    db.collection('userInfo').where({
      _openid: this.data.openid
    }).update({
      data: {
        packages: this.data.packages,
      },
      success: res => {
        wx.showToast({
          title: '保存成功',
        });
        this.onLoad();
        console.log('[数据库] [更新记录] 成功: ', res);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '保存失败'
        });
        console.error('[数据库] [更新记录] 失败：', err);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})