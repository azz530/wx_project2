const db=wx.cloud.database();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSubmit:false,
    remove:'',
    hasUserInfo:false,
  },
  addTask(e){
    var that = this;
    if(that.data.hasUserInfo){
      var Task = e.detail.value;
      var AddTime = new Date();
      var AddTaskTime = util.formatTime(AddTime);
      var userName = wx.getStorageSync('userInfo').nickName;
      var userAvatar = wx.getStorageSync('userInfo').avatarUrl;
      // console.log(AddTaskTime)
      db.collection("Task").add({
        data:{
          Words:Task.Words,
          Exercise:Task.Exercise,
          Content:Task.Content,
          AddTaskTime:AddTaskTime,
          userName,
          userAvatar,
          isFinish:false,
          isAbandon:false,
        }
      }).then(res=>{
        //console.log(res)
      })
      that.setData({
        isSubmit:true,
        remove:'',
      })
      if(that.data.isSubmit == true){
        var add = e.currentTarget.dataset.add;
        wx.showLoading({
          title: '提交成功',
          mask:true,
        })
        setTimeout(function(){
          wx.hideLoading()
          
          wx.navigateBack({
            delta: 1,
          })
        },500)
      }
    }
    else{
      wx.showToast({
        title: '请先登录!',
        icon:"error"
      })
    }
    //console.log(this.data.isSubmit)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    that.setData({
      hasUserInfo: wx.getStorageSync('isHasUserInfo'),
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