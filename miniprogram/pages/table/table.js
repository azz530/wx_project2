const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:null,
    TableData:[],
    TipsData:[],
    AlbumData:[],
    canEditor:false,
    TipsEditor:false,
    TablecurrentId:"",
    TipscurrentId:"",
    CloudPicPath:"cloud://cloud1-3gtlq2234f937878.636c-cloud1-3gtlq2234f937878-1305999115/",
    TipsPicPath:[],
    TablePicPath:[],
    hasAlbum:false,
    isShow:false,
    AlbumCurrentId:[],
    AlbumPhoto:[],
    AlbumCoverPic:"",
    DivData:[],
    hasUserInfo:false,
  },
  // 获取课表数据
  getTableData(){
    var that = this;
    wx.cloud.callFunction({
      name:"getTableData"
    }).then(res=>{
      that.setData({
        TableData:res.result.data,
      })
      // console.log(this.data.TableData)
    })
  },
  // 获取相册数据
  getAlbumData(){
    var that = this;
    wx.cloud.callFunction({
      name:"getAlbumData"
    }).then(res=>{
      that.setData({
        AlbumData:res.result.data
      })
      // console.log(that.data.AlbumData)
    })
  },
  getDivData(){
    let that = this;
    wx.cloud.callFunction({
      name:"getDisData"
    }).then(res=>{
      that.setData({
        DivData:res.result.data,
        DivPicPath:res.result.data.DivPic
      })
      console.log(that.data.DivData)
    })
  },
  // 预览图
  ViewTablePic(e){
    var that = this;
    var TablePicId = e.currentTarget.id;
    var TableIndex = e.currentTarget.dataset.listid;
    var TablePicData = that.data.TableData;
    // console.log(TablePicData[TableIndex])
    var ImageSrc = "cloud://cloud1-3gtlq2234f937878.636c-cloud1-3gtlq2234f937878-1305999115/" + TablePicData[TableIndex].TPic[TablePicId];
    wx.previewImage({
      urls: [ImageSrc],
    })
  },
  // 获取便签数据
  getTipsData(){
    var that = this;
    wx.cloud.callFunction({
      name:"getTipsData"
    }).then(res=>{
      that.setData({
        TipsData:res.result.data
      })
      // console.log(this.data.TipsData)
    })
  },
  // 便签详情页链接
  GotoTips(e){
    let index = e.currentTarget.dataset.index;
    // console.log(index)
    wx.navigateTo({
      url: '../tips/tips?index=' + index,
    })
  },
  // 触发编辑删除
  EditorTable(e){
    var that = this;
    // console.log(e)
    that.setData({
      canEditor:!that.data.canEditor,
      TablecurrentId:e.currentTarget.dataset.id,
      TablePicPath:e.currentTarget.dataset.tablepic,
    })
    console.log(that.data.TablePicPath)
    // console.log(that.data.canEditor)
    // console.log(that.data.currentId)
    // console.log(that.data.canEditor)
  },
  // 删除课表
  DeleteT(){
    var that = this;
    var DeleteTablePath = [];
    for(var i=0;i<that.data.TablePicPath.length;i++){
      DeleteTablePath[i] = that.data.CloudPicPath + that.data.TablePicPath[i];
    }
    wx.showModal({
      title:"提示",
      content:"是否删除该课表",
      success(res){
        if(res.confirm){
          wx.cloud.deleteFile({
            fileList:DeleteTablePath,
            success(res){
              console.log(res,"删除存储成功")
            },
            fail(err){
              console.log(err)
            }
          })
          db.collection("Table").doc(that.data.TablecurrentId).remove({
            success(){
              console.log("删除成功")
              that.onShow();
            }
          })
          
        }
        else if(res.cancel){
          that.setData({
            canEditor:false,
          })
        }
      }
    })
  },
  // 取消删除课表按钮事件
  TableCancel(){
    var that = this;
    that.setData({
      canEditor:false,
    })
  },
  // 长按删除事件
  DeleteTips(e){
    var that = this;
    // console.log(e)
    that.setData({
      TipsEditor:!that.data.TipsEditor,
      TipscurrentId:e.currentTarget.dataset.id,
      TipsPicPath:e.currentTarget.dataset.pic,
    })
    console.log(that.data.TipsPicPath)
  },
  // 删除便签按钮事件
  DeleteTipsBtn(){
    var that = this;
    var DeleteTipsPath = [];
    for(var i=0;i<that.data.TipsPicPath.length;i++){
      DeleteTipsPath[i] = that.data.CloudPicPath + that.data.TipsPicPath[i];
    }
    console.log(DeleteTipsPath);
    wx.showModal({
      title:"提示",
      content:"是否删除该便签",
      success(res){
        if(res.confirm){
          wx.cloud.deleteFile({
            fileList:DeleteTipsPath,
            success(res){
              console.log(res,"删除存储成功")
            },
            fail(err){
              console.log(err)
            }
          })
          db.collection("Note").doc(that.data.TipscurrentId).remove({
            success(){
              console.log("删除成功")
              that.onShow();
            }
          })
        }
        else if(res.cancel){
          that.setData({
            TipsEditor:false,
          })
        }
      }
    })
  },
  // 取消
  Cancel(){
    var that = this;
    that.setData({
      TipsEditor:false,
    })
  },
  // 相册详情页
  ToAlbum(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../Album/Album?index=' + index,
    })
    that.setData({
      isShow:false,
    })
  },
  // 获取选择的相册Id并展示删除图标
  getAlbumId(e){
    // console.log(e)
    var that = this;

    that.setData({
      isShow:true,
      AlbumCurrentId:e.currentTarget.dataset.id,
      AlbumPhoto:e.currentTarget.dataset.albumpic,
      AlbumCoverPic:e.currentTarget.dataset.coverpic,
    })

  },
  DeleteAlbum(){
    var that = this;
    var DeleteAPhoto = []; 
    // 相册有图片时删除相册图片和封面
    if(that.data.AlbumPhoto!=null){
      for(var i = 0;i<=that.data.AlbumPhoto.length;i++){
        DeleteAPhoto[i] = that.data.CloudPicPath + that.data.AlbumPhoto[i];
      }
      let ACP = that.data.CloudPicPath + that.data.AlbumCoverPic;
      var DeleteAPhoto = DeleteAPhoto.concat(ACP)
      wx.showModal({
        title:"提示",
        content:"是否删除该相册!",
        success(res){
          if(res.confirm){
            wx.cloud.deleteFile({
              fileList:DeleteAPhoto,
              success(res){
                console.log("云相册删除成功")
              },
              fail(err){
                console.log(err);
              }
            })
            db.collection("Album").doc(that.data.AlbumCurrentId).remove({
              success(){
                console.log("删除成功")
                that.onShow()
                that.setData({
                  isShow:false,
                })
                wx.showToast({
                  title: '删除成功',
                })
              }
            })
          }
          else if(res.cancel){
            that.setData({
              isShow:false,
            })
          }
        }
      })
    }
    // 相册没有图片时删除封面
    if(that.data.AlbumPhoto==null){
      let ACP = that.data.CloudPicPath + that.data.AlbumCoverPic;
      wx.showModal({
        title:"提示",
        content:"是否删除该相册!",
        success(res){
          if(res.confirm){
            wx.cloud.deleteFile({
              fileList:[ACP],
              success(res){
                console.log("云相册封面删除成功")
              },
              fail(err){
                console.log(err);
              }
            })
            db.collection("Album").doc(that.data.AlbumCurrentId).remove({
              success(){
                console.log("删除成功")
                that.onShow()
                that.setData({
                  isShow:false,
                })
                wx.showToast({
                  title: '删除成功',
                })
              }
            })
          }
          else if(res.cancel){
            that.setData({
              isShow:false,
            })
          }
        }
      })
    }
  },
  AddDis(){
    wx.navigateTo({
      url: '../Div/Div',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      index:options.index,
      hasUserInfo:wx.getStorageSync('isHasUserInfo'),
    })
    console.log(that.data.hasUserInfo)
    that.getTableData();
    that.getAlbumData();
    that.getTipsData();
    that.getDivData();
    wx.stopPullDownRefresh();
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
    var that = this;
    that.getTipsData();
    that.getTableData();
    that.getAlbumData();

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
    var that =this;
    that.getDivData()
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