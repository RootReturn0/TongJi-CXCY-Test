// miniprogram/pages/userCenter/face/face.js
const app = getApp()

Page({
  data: {
    open_id: '',
    fileList: [],
    checked: false,
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
  onQuery: async function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 userInfo
    await db.collection('userInfo').where({
      _openid: this.data.openid
    }).get({
      success: async res => {
        await this.setData({
          checked: res.data[0]['useFaceID'],
        });
        console.log('[数据库] [查询记录] 成功: ', res);
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ checked: detail });
    this.onUpdate();
  },
  onUpdate: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 userInfo
    db.collection('userInfo').where({
      _openid: this.data.openid
    }).update({
      data: {
        useFaceID: this.data.checked,
      },
      success: res => {
        wx.showToast({
          title: '保存成功',
        });
        console.log('[数据库] [查询记录] 成功: ', res);
      },
      fail: err => {
        this.setData({checked: checked?false:true});
        wx.showToast({
          icon: 'none',
          title: '保存失败'
        });
        console.error('[数据库] [查询记录] 失败：', err);
      }
    })
  },
  afterRead(event) {
    const {
      file
    } = event.detail;
    this.uploadToCloud(event)
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
    //   filePath: file.path,
    //   name: 'file',
    //   formData: {
    //     user: 'test'
    //   },
    //   success(res) {
    //     // 上传完成需要更新 fileList
    //     const {
    //       fileList = []
    //     } = this.data;
    //     fileList.push({ ...file,
    //       url: res.data
    //     });
    //     this.setData({
    //       fileList
    //     });
    //   }
    // });
  },
  // 上传图片
  // uploadToCloud(event) {
  //   wx.cloud.init();

  //   const filePath = event.detail.file.path

  //   // 上传图片
  //   const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  //   wx.cloud.uploadFile({
  //     cloudPath,
  //     filePath,
  //     success: res => {
  //       console.log('[上传文件] 成功：', res)
  //       const newFileList=[]
  //       newFileList.push(event.detail.file.path)
  //       this.setData({
  //           // cloudPath: data,
  //           fileList: newFileList
  //         });
  //       console.log(this.fileList)
  //       app.globalData.fileID = res.fileID
  //       app.globalData.cloudPath = cloudPath
  //       app.globalData.imagePath = filePath
  //     },
  //     fail: e => {
  //       console.error('[上传文件] 失败：', e)
  //       wx.showToast({
  //         icon: 'none',
  //         title: '上传失败',
  //       })
  //     },
  //     complete: () => {
  //       wx.hideLoading()
  //     }
  //   })

  // }
  //   const fileList=[];
  //   event.detail.file['isImage']=true;
  //   fileList.push(event.detail.file);
  //   console.log(event.detail.file, fileList.length,fileList)
  //   if (!fileList.length) {
  //     wx.showToast({
  //       title: '请选择图片',
  //       icon: 'none'
  //     });
  //   } else {
  //     const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(`my-photo${index}.png`, file));
  //     Promise.all(uploadTasks)
  //       .then(data => {
  //         wx.showToast({
  //           title: '上传成功',
  //           icon: 'none'
  //         });
  //         const newFileList = data.map(item => {
  //           url: item.fileID
  //         });
  //         this.setData({
  //           cloudPath: data,
  //           fileList: newFileList
  //         });
  //       })
  //       .catch(e => {
  //         wx.showToast({
  //           title: '上传失败',
  //           icon: 'none'
  //         });
  //         console.log(e);
  //       });
  //   }
  // },

  // uploadFilePromise(fileName, chooseResult) {
  //   return wx.cloud.uploadFile({
  //     cloudPath: fileName,
  //     filePath: chooseResult.path
  //   });
  // }
})