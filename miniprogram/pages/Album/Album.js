// pages/Album/Album.js
const db = wx.cloud.database();
var util = require("../../utils/util.js");
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:null,
    AlbumData:[],
    AlbumPhoto:[],
    CurrentAlbumId:"",
    isShow:false,
    DeleteAPicId:"",
    DeleteAPicPath:"",
  },
  // 获取相册数据
  getAlbumData(){
    var that = this;
    let index = that.data.index;
    wx.cloud.callFunction({
      name:"getAlbumData"
    }).then(res=>{
      that.setData({
        AlbumData:res.result.data,
        CurrentAlbumId:res.result.data[index]._id,
        AlbumPic:res.result.data[index].AlbumPhoto,
        AlbumTemPic:res.result.data[index].AlbumPhoto,
      })
      // console.log(that.data.CurrentAlbumId);
      // console.log(that.data.AlbumData)
    })
  },
  // 添加图片
  AddPhoto(){
    var that = this;
    let AddTime = new Date();
    let AddPTime = util.myFormatTime(AddTime);
    wx.chooseImage({
      count: 3,
      sourceType:['album','camera'],
      success:res=>{
        var PhotoTemPath = res.tempFilePaths;
        var PhotoType = [];
        var AlbumPhoto = [];
        for(var i = 0; i<PhotoTemPath.length;i++){
          PhotoType[i] = PhotoTemPath[i].substring(PhotoTemPath[i].lastIndexOf("."));
          AlbumPhoto[i] = AddPTime + Math.floor(Math.random() * 1000) + PhotoType[i];
          wx.cloud.uploadFile({
            cloudPath:AlbumPhoto[i],
            filePath:PhotoTemPath[i],
            success(res){
              // console.log(res) 
              that.onShow();
            }
          })
        }
        that.setData({
          AlbumPhoto,
        })
        db.collection("Album").where({
          _id:that.data.CurrentAlbumId
        }).update({
          data:{
            AlbumPhoto:_.unshift(that.data.AlbumPhoto),
            AddPhotoTime:AddPTime,
          }
        }).then(res=>{
          
        })
        // console.log(that.data.AlbumPhoto)
      }
    })
  },
  getPicpath(e){
    var that = this;
    that.setData({
      isShow:!that.data.isShow,
      DeleteAPicPath:e.currentTarget.dataset.apic,
    })
    // console.log(that.data.DeleteAPicPath)
  },
  DeleteAPic(e){
    var that = this;
    var DeletePath = [];
    console.log(e)
    console.log(that.data.DeleteAPicPath.length)
    DeletePath = "cloud://cloud1-3gtlq2234f937878.636c-cloud1-3gtlq2234f937878-1305999115/" + that.data.DeleteAPicPath;
    console.log(DeletePath)
    wx.cloud.deleteFile({
      fileList:[DeletePath],
      success(res){
        console.log("删除成功")
        db.collection("Album").doc(that.data.CurrentAlbumId).update({
          data:{
            AlbumPhoto:_.shift(that.data.DeleteAPicPath)
          }
        }).then(res=>{
          that.getAlbumData()
          console.log("数据库删除成功")
          wx.showToast({
            title: '删除成功',
          })
        })
        that.onShow();
      },
      fail(err){
        console.log(err)
      }
    })
  },
  // 预览图
  ViewAP(e){
    var that = this;
    var AlbumPicId = e.currentTarget.id;
    var AlbumImageP = that.data.AlbumPic;
    // console.log(AlbumPicId)
    // console.log(AlbumImageP)
    var ImageSrc = "cloud://cloud1-3gtlq2234f937878.636c-cloud1-3gtlq2234f937878-1305999115/" + AlbumImageP[AlbumPicId];
    wx.previewImage({
      urls: [ImageSrc],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      index:options.index,
    })
    // console.log(that.data.index);
    that.getAlbumData();
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
    that.getAlbumData()
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
    let that = this;
    that.getAlbumData();
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