// miniprogram/pages/userCenter/location/location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dorms: ['友园14号楼', '友园15号楼', '友园16号楼', '友园17号楼', '友园18号楼', '友园19号楼', '友园20号楼'],
    second: false,
  },

  activePicker: function() {
    this.setData({
      second: true
    })
  },

  onConfirm: function(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    console.log(
      `当前值：${value}, 当前索引：${index}`,
    );
  },
  onCancel: function() {
    this.setData({
      second: false
    })
  },

  chooseLocation: function () {
    wx.chooseLocation({
      success(res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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