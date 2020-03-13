// miniprogram/pages/deliverDetail/deliverDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDate: '',
    sendDate: '',
    longitude: 113.324520,
    latitude: 23.099994,
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  formatTimeTwo(number,format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number*1);
    returnArr.push(date.getFullYear());
    returnArr.push(this.formatNumber(date.getMonth() + 1));
    returnArr.push(this.formatNumber(date.getDate()));

    returnArr.push(this.formatNumber(date.getHours()));
    returnArr.push(this.formatNumber(date.getMinutes()));
    returnArr.push(this.formatNumber(date.getSeconds()))

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const db = wx.cloud.database()

    await db.collection('userInfo').where({
      _openid: this.data.openid
    }).get({
      success: async res => {
        this.setData({
          bookDate: this.formatTimeTwo(res.data[0]['packages'][options.index]['currentDate'], 'Y年M月D日 h:m'), 
          sendDate: this.formatTimeTwo(res.data[0]['packages'][options.index]['sendDate'], 'Y年M月D日 h:m'), 
        });
        console.log('[数据库] [查询记录] 成功: ', res);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
    // 查询所有的 car
    db.collection('car').where({
      name: 'root'
    }).get({
      success: async res => {
        console.log(res.data, res.data[0]['location']['longitude'])
        this.setData({
          longitude: res.data[0]['location']['longitude'],
          latitude: res.data[0]['location']['latitude'],
          markers: [{
            id: 1,
            longitude: res.data[0]['location']['longitude'],
            latitude: res.data[0]['location']['latitude'],
            title: '小车位置'
          }]
        });
        console.log('[数据库] [查询记录] 成功: ', res);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
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