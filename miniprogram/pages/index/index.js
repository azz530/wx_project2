const db = wx.cloud.database();
Page({
  data: {
    door:[
      {
        id:0,
        name:"课表",
        icon:"../../images/table.png"
      },
      {
        id:1,
        name:"便签",
        icon:"../../images/note.png"
      },
      {
        id:2,
        name:"相册",
        icon:"../../images/pic.png"
      },
      {
        id:3,
        name:"讨论",
        icon:"../../images/talk.png"
      }
    ],
    TaskData:[],
    BookData:[],
    isChose:true,
    add:null,
    isShow:true,
    isFinish:false,
    isAbandon:false,
    hasTask:false,
    hasUserInfo:false,
    BookShow:true,
    Show:null,
  },
  // 图标链接
  Goto:function(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url:'../table/table?index=' + index,
    })
  },
  // 新增任务页面链接
  open:function(e){
    wx.navigateTo({
      url: '../task/task',
    })
  },
  // 不接任务
  close:function(){
    var that = this;
    that.setData({
      isChose:false
    })
  },

  // 获取云端任务数据
  getTask(){
    var that = this;
    wx.cloud.callFunction({
      name:"getTaskData",
    }).then(res=>{
      that.setData({
        TaskData:res.result.data[0],
      })
      // console.log(res)
      if(that.data.TaskData!=null&&that.data.isAbandon==false||that.data.isFinish==false){
        that.setData({
          hasTask:true,
          isShow:false,
        })
        if(that.data.TaskData.isAbandon==true||that.data.TaskData.isFinish==true){
          that.setData({
            hasTask:false,
            isShow:true,
          })
        }
        if(that.data.TaskData.isFinish==false&&that.data.TaskData.isAbandon==false){
          if(that.data.hasUserInfo){
            that.setData({
              isShow:false,
            })
          }
          else{
            that.setData({
              isShow:true
            })
          }
        }
      }
      // console.log(that.data.TaskId)
    })
  },
  // 获取书籍
  getBookData(){
    var that = this;
    wx.cloud.callFunction({
      name:"getBookData"
    }).then(res=>{
      that.setData({
        BookData:res.result.data
      })
      // console.log(that.data.BookData)
      
    })
  },

  // 完成任务

  done(e){
    var that = this;
    let TaskId = that.data.TaskData._id;
    that.setData({
      isFinish:true,
      isShow:true,
      hasTask:false,
    })
    db.collection("Task").doc(TaskId).update({
      data:{
        isFinish:true,
      }
    }).then(res=>{
      // console.log("完成")
    })
    wx.showToast({
      title: '恭喜你完成任务',
    })
    // console.log(that.data.isShow)
  },
  abandon(){
    var that = this;
    let TaskId = that.data.TaskData._id;
    that.setData({
      isAbandon:true,
      isShow:true,
      hasTask:false,
    })
    db.collection("Task").doc(TaskId).update({
      data:{
        isAbandon:true,
      }
    }).then(res=>{

    })
    wx.showToast({
      title: '真可惜',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      add:options.add,
      Show:options.Show,
      // hasUserInfo: wx.getStorageSync('isHasUserInfo'),
      hasUserInfo:wx.getStorageSync('isHasUserInfo'),
    })
    that.getBookData();

    if(that.data.isShow == false){
      that.getTask();
    }
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
    that.setData({
      hasUserInfo:wx.getStorageSync('isHasUserInfo'),
    })
    that.getBookData();
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
    var that = this;
    that.getBookData();
    that.getTask();
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