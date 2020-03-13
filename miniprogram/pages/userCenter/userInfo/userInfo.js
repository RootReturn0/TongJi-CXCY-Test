// miniprogram/pages/userCenter/userInfo/userInfo.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isNew: true,
    openid: '',
    name: '',
    phone: '',
    email: '',
    campus: '嘉定校区',
    campusList: [{
      text: '嘉定校区',
      value: '嘉定校区'
    },
    {
      text: '四平路校区',
      value: '四平路校区'
    },
    {
      text: '彰武路校区',
      value: '彰武路校区'
    },
    {
      text: '沪西校区',
      value: '沪西校区'
    },
    {
      text: '沪北校区',
      value: '沪北校区'
    }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    };
    this.onQuery();
  },

  saveInfo: function () {
    if (!this.data.name) wx.showToast({
      icon: 'none',
      title: '收件人姓名不能为空'
    });
    else if (!this.data.phone) wx.showToast({
      icon: 'none',
      title: '收件人手机号码不能为空'
    });
    else {
      if (this.data.isNeW === true) this.onAdd();
      else this.onUpdate();
    }
  },

  changeName: function (event) {
    this.setData({
      name: event.detail
    });
  },

  changePhone: function (event) {
    this.setData({
      phone: event.detail
    });
  },

  changeEmail: function (event) {
    this.setData({
      email: event.detail
    })
  },

  onAdd: function () {
    console.log('add?')
    const db = wx.cloud.database()
    db.collection('userInfo').add({
      data: {
        name: this.data.name,
        phone: this.data.phone,
        email: this.data.email,
        campus: this.data.campus,
      },
      success: res => {
        wx.showToast({
          title: '保存成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '保存失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onQuery: async function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 userInfo
    await db.collection('userInfo').where({
      _openid: this.data.openid
    }).get({
      success: async res => {
        await this.setData({
          isNew: false,
          name: res.data[0]['name'],
          phone: res.data[0]['phone'],
          email: res.data[0]['email'],
          campus: res.data[0]['campus'],
        });
        console.log('[数据库] [查询记录] 成功: ', res);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
  },
  onUpdate: function () {
    const db = wx.cloud.database()
    db.collection('userInfo').where({
      _openid: this.data.openid
    }).update({
      data: {
        name: this.data.name,
        phone: this.data.phone,
        email: this.data.email,
        campus: this.data.campus
      },
      success: res => {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: err => {
        wx.showToast({
          title: '保存失败',
        })
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})