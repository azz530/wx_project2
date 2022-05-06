const db = wx.cloud.database();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:null,
    TipsData:[],
    ChagneTipsId:"",
    isChange:false,
    TipsPic:[],
    TipsPicPath:[],
    isShow:true,
    TipsTemPath:[],
  },
  // 获取便签数据
  getTipsData(){
    var that = this;
    let index = that.data.index;
    var TipsPic = that.data.TipsPic.TipsPicPath
    wx.cloud.callFunction({
      name:"getTipsData"
    }).then(res=>{
      this.setData({
        TipsData:res.result.data,
        ChagneTipsId:res.result.data[index]._id,
        TipsPicPath:res.result.data[index].TipsPic,
        TipsTemPath:res.result.data[index].TipsPic,
      })
      // console.log(this.data.TipsPicPath)
    })
  },
  // 更改便签数据
  ChangeTips(e){
    var that = this;
    var NewTips = e.detail.value;
    var ChangeTime = new Date();
    var NewTime = util.formatTime(ChangeTime);
    // console.log(NewTips)
    db.collection("Note").doc(that.data.ChagneTipsId).update({
      data:{
        TipsTitle:NewTips.TipsTitle,
        TipsType:NewTips.TipsType,
        TipsContent:NewTips.TipsContent,
        AddTipsTime:NewTime,
      }
    }).then(res=>{
      console.log("更改成功")
      // console.log(that.data.TipsPic)
    })
    that.setData({
      isChange:true,
    })
    if(that.data.isChange == true){
      wx.showLoading({
        title: '更改成功',
        mask:true,
      })
      setTimeout(function(){
        wx.hideLoading()
      },500)
    }
  },
  // 预览图
  ViewTipsPic(e){
    var that = this;
    var TipsPicId = e.currentTarget.id;
    var TipsImageP = that.data.TipsTemPath;
    // console.log(TipsImageP)
    var ImageSrc = "cloud://cloud1-3gtlq2234f937878.636c-cloud1-3gtlq2234f937878-1305999115/" + TipsImageP[TipsPicId];
    wx.previewImage({
      urls: [ImageSrc],
    })
  },

  // 在便签详情页中删除图片
  deletePic(e){
    var that = this;
    let index = that.data.index;
    var picId = e.currentTarget.id;
    var picPath = that.data.TipsData[index].TipsPic;
    var NewPic = that.data.TipsPicPath;
    const TipsTemPATH = that.data.TipsTemPath;
    var DeletePicPath = [];
    for(var i = 0; i < TipsTemPATH.length; i++){
      DeletePicPath[i] = "cloud://cloud1-3gtlq2234f937878.636c-cloud1-3gtlq2234f937878-1305999115/"+ TipsTemPATH[i];
    }  
    console.log(TipsTemPATH)
    console.log(DeletePicPath)
    wx.cloud.deleteFile({
      fileList:DeletePicPath,
      success(res){
        console.log(res,"删除存储成功")
      },
      fail(err){
        console.log(err)
      }
    })
    picPath.splice(picId,1);
    that.setData({
      TipsPicPath:picPath,
      isShow:false,
    })
    db.collection("Note").doc(that.data.ChagneTipsId).update({
      data:{
        TipsPic:NewPic,
      }
    }).then(res=>{
      // console.log("删除成功")
    })
    wx.showToast({
      title: '删除成功',
    })
  },

  // 删除便签
  deleteTips(){
    var that = this;
    db.collection("Note").doc(that.data.ChagneTipsId).remove({
      success(){
        console.log("删除成功")
      }
    })
    wx.navigateBack({
      delta:1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index:options.index
    })
    console.log(this.data.index)
    this.getTipsData();
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