const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    to:null,
    TaskData:[],
    BookData:[],
    DivData:[],
    hasUserInfo:false,
    isDelBook:false,
    isDeleDiv:false,
    BookCurrentId:"",
    DivCurrentId:"",
    DivPicPath:[],
    BookPicPath:[],
    CloudPicPath:"cloud://cloud1-3gtlq2234f937878.636c-cloud1-3gtlq2234f937878-1305999115/",
  },

  // 获取任务数据
  getTask(){
    var that = this;
    wx.cloud.callFunction({
      name:"getTaskData",
    }).then(res=>{
      // that.setData({
      //   TaskData:res.data
      // })
      that.setData({
        TaskData:res.result.data,
      })
      console.log(that.data.TaskData)
    })
  },
  // 获取书籍数据
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
  // 获取说说信息
  getDivData(){
    let that = this;
    wx.cloud.callFunction({
      name:"getDisData"
    }).then(res=>{
      that.setData({
        DivData:res.result.data,
        // DivPicPath:res.result.data.DivPic
      })
      // console.log(that.data.DivData)
    })
  },

  // 获取选中书籍信息
  GetBookId(e){
    var that = this;
    that.setData({
      isDelBook:!that.data.isDelBook,
      BookCurrentId:e.currentTarget.dataset.id,
      BookPicPath:e.currentTarget.dataset.pic,
    })
    // console.log(that.data.isDelBook,that.data.BookCurrentId,that.data.BookPicPath)
  },

  // 删除书籍信息事件
  DeleteBook(){
    var that = this;
    var DeleteBookPath = "";
    DeleteBookPath = that.data.CloudPicPath + that.data.BookPicPath;
    // console.log(DeleteBookPath);
    wx.showModal({
      title:"提示",
      content:"是否删除该书",
      success(res){
        if(res.confirm){
          wx.cloud.deleteFile({
            fileList:[DeleteBookPath],
            success(res){
              console.log(res,"删除存储成功")
            },
            fail(err){
              console.log(err)
            }
          })
          db.collection("Book").doc(that.data.BookCurrentId).remove({
            success(){
              wx.showToast({
                title: '删除成功',
              })
              console.log("删除成功")
              that.onShow();
            }
          })
        }
        else if(res.cancel){
          that.setData({
            isDelBook:false,
          })
        }
      }
    })
  },
  // 书籍取消删除
  BookCancel(){
    var that = this;
    that.setData({
      isDelBook:false,
    })
  },
  // 获取说说Id
  getDivId(e){
    var that = this;
    that.setData({
      isDeleDiv:!that.data.isDeleDiv,
      DivCurrentId:e.currentTarget.dataset.id,
      DivPicPath:e.currentTarget.dataset.pic,
    })
    // console.log(e)
    console.log(that.data.isDeleDiv,that.data.DivCurrentId,that.data.DivPicPath)
  },

  // 删除说说事件
  DeleteDiv(){
    var that = this;
    var DeleteDivPath = [];
    for(var i=0;i<that.data.DivPicPath.length;i++){
      DeleteDivPath[i] = that.data.CloudPicPath + that.data.DivPicPath[i];
    }
    // console.log(DeleteDivPath);
    wx.showModal({
      title:"提示",
      content:"是否删除该说说",
      success(res){
        if(res.confirm){
          wx.cloud.deleteFile({
            fileList:DeleteDivPath,
            success(res){
              console.log("删除存储成功")
            },
            fail(err){
              console.log(err)
            }
          })
          db.collection("Discussion").doc(that.data.DivCurrentId).remove({
            success(){
              wx.showToast({
                title: '删除成功',
              })
              console.log("删除成功")
              that.onShow();
            }
          })
        }
        else if(res.cancel){
          that.setData({
            isDelDeiv:false,
          })
        }
      }
    })
  },
  // 取消删除
  CancelDiv(){
    var that = this;
    that.setData({
      isDeleDiv:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      to:options.to,
      hasUserInfo:wx.getStorageSync('isHasUserInfo'),
    })
    that.getTask();
    that.getBookData();
    that.getDivData();
    console.log(that.data.hasUserInfo)
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
    that.getBookData();
    that.getDivData();
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