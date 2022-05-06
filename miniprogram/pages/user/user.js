// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hasUserInfo:false,
  },
  getUserProfile(){
    if(!wx.getStorageSync('userOpenId')){
      wx.cloud.callFunction({
        name:"login"
      }).then(res=>{
        wx.setStorageSync('userOpenId', res.result["openid"])
      })
    }
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success:(res)=>{
        this.setData({
          userInfo:res.userInfo,
          hasUserInfo:true
        })
        console.log(res)
        wx.setStorageSync('isHasUserInfo','true')
        wx.setStorageSync('userInfo', res.userInfo)
      },
      fail(){
        wx.setStorageSync('isHasUserInfo', "false")
      }
    })
  },
  Logout(){
    var that = this;
    var Show = 0;
    if(that.data.hasUserInfo == true){
      wx.showModal({
        title:"提示",
        content:"是否注销登录!",
        success(res){
          if(res.confirm){
            that.setData({
              hasUserInfo:false,
              userInfo:{},
            })
            wx.clearStorage();
            wx.reLaunch({
              url: '../index/index?Show=' + Show,
            })
          }
          else if(res.cancel){
  
          }
        }
      })
    }
  },
  nav1(e){
    var to = e.currentTarget.dataset.to;
    wx.navigateTo({
      url: '../Detail/Detail?to=' + to,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('isHasUserInfo') == true){
      this.setData({
        hasUserInfo:true,
      })
    }
    if(wx.getStorageSync('userInfo')!={}){
      this.setData({
        userInfo:wx.getStorageSync('userInfo')
      })
    }
    console.log(this.data.hasUserInfo)
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