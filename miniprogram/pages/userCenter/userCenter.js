const app = getApp()

Page({
  data: {
    openid: '',
    active: 0,
    auth: false,
    location: {},
    userInfo: '',
  },
  onLoad: async function (){
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      });
      console.log(openid)
    }
    else {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    }
    
    await this.authUserInfo();
    await this.authLocation();
  },
  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail + 1}`,
      icon: 'none'
    });
  },
  chooseLocation: function () {
    if (this.data.auth)
      wx.chooseLocation({
        success: res =>  {
          console.log(res)
          this.setData({location: res});
          this.onUpdate();
        }
      });
  },
  bindGetUserInfo: function (e) {
    this.setData({
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
      userInfo: e.detail.userInfo.userInfo
    });
    this.onLoad()
  },
  authUserInfo: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) 
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        else 
          wx.authorize({
            scope: 'scope.userInfo',
            success: res => {
              this.setData({
                nickName: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
      },
    });
  },
  authLocation: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'])
          this.setData({auth: true});
        else
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
            },
          })
      }
    })
  },
  onUpdate: function () {
    const db = wx.cloud.database()
    db.collection('userInfo').where({
      _openid: this.data.openid
    }).update({
      data: {
        location: this.data.location
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
  scanQRCode: function () {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  },
  // onQuery: function () {
  //   const db = wx.cloud.database()
  //   // 查询当前用户所有的 userInfo
  //   db.collection('userInfo').where({
  //     _openid: this.data.openid
  //   }).get({
  //     success: res => {
  //       queryResult = res.data;
  //       console.log(queryResult, res.data);
  //       this.setData({
  //         campus: queryResult['campus'],
  //       });
  //       console.log('[数据库] [查询记录] 成功: ', res);
  //     },
  //     fail: err => {
  //       console.error('[数据库] [查询记录] 失败：', err);
  //     }
  //   })
  // },
});