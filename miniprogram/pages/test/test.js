const db=wx.cloud.database();
var util = require('../../utils/util.js');
Page({
  data:{
    isSubmit:false,
    isTUpLoad:false,
    isBUpLoad:false,
    isTipsLoad:false,
    isAlbumLoad:false,
    hasUserInfo:false,
    hasAlbumPic:false,
    type:null,
    TablePic:[],
    TableTemPath:[],
    BookPic:[],
    BookTemPath:[],
    TipsPic:[],
    TipsTemPath:[],
    AlbumPic:[],
    AlbumTemPath:[],
    remove:'',
    tabs:[
      {
        id:0,
        name:"课表",
        isActive:true,
      },
      {
        id:1,
        name:"书籍",
        isActive:false,
      },
      {
        id:2,
        name:"便签",
        isActive:false,
      },
      {
        id:3,
        name:"相册",
        isActive:false,
      },
    ],
  },
  // 新建任务
  // addTask(e){
  //   var that = this;
  //   if(that.data.hasUserInfo){
  //     var Task = e.detail.value;
  //     var AddTime = new Date();
  //     var AddTaskTime = util.formatTime(AddTime);
  //     var userName = wx.getStorageSync('userInfo').nickName;
  //     var userAvatar = wx.getStorageSync('userInfo').avatarUrl;
  //     // console.log(AddTaskTime)
  //     db.collection("Task").add({
  //       data:{
  //         Words:Task.Words,
  //         Exercise:Task.Exercise,
  //         Content:Task.Content,
  //         AddTaskTime:AddTaskTime,
  //         userName,
  //         userAvatar,
  //       }
  //     }).then(res=>{
  //       //console.log(res)
  //     })
  //     that.setData({
  //       isSubmit:true,
  //       remove:'',
  //     })
  //     if(that.data.isSubmit == true){
  //       var add = e.currentTarget.dataset.add;
  //       wx.showLoading({
  //         title: '提交成功',
  //         mask:true,
  //       })
  //       setTimeout(function(){
  //         wx.hideLoading()
  //         wx.reLaunch({
  //           url: '../index/index?add=' + add,
  //         })
  //       },500)
  //     }
  //   }
  //   else{
  //     wx.showToast({
  //       title: '请先登录!',
  //       icon:"error"
  //     })
  //   }
  //   //console.log(this.data.isSubmit)
  // },
  // 分类
  Chose(e){
    var that = this;
    const {list} = e.currentTarget.dataset;
    let {tabs} = that.data
    tabs.forEach((v,i)=>i==list?v.isActive=true:v.isActive=false);
    that.setData({
      tabs:tabs,
    })
  },
  // 新建课表
  addTable(e){
    var that = this;
    if(that.data.hasUserInfo){
      var Table = e.detail.value;
      var TableImage = that.data.TablePic;
      var AddTime = new Date();
      var AddTableTime = util.formatTime(AddTime);
      var userName = wx.getStorageSync('userInfo').nickName;
      var userAvatar = wx.getStorageSync('userInfo').avatarUrl;
      var TabletemPath = that.data.TableTemPath;
      // console.log(Table)
      // console.log(AddTableTime)
      db.collection("Table").add({
        data:{
          major:Table.major,
          term:Table.term,
          Date:Table.Date,
          TPic:TableImage,
          AddTableTime,
          userAvatar,
          userName,
        }
      }).then(res=>{
        // console.log("提交成功")
      })
      that.upTablePic(TabletemPath,TableImage,0);
      that.setData({
        isTUpLoad:true,
        remove:'',
      })
      // console.log(this.data.isTUpLoad)
      if(that.data.isTUpLoad == true){
        wx.showToast({
          title: '提交成功',
          mask:true,
        })
        that.resetTable();
      }
      // console.log(this.data.TablePic)
    }
    else{
      wx.showToast({
        title: '请先登录!',
        icon:"error",
      })
    }
  },
  // 重置课表
  resetTable(){
    var that = this;
    that.setData({
      isTUpLoad:false,
      TableTemPath:[],
    })
  },
  // 添加课表图片
  addPic(){
    var that = this;
    let AddTime = new Date();
    let AddPTime = util.myFormatTime(AddTime);
    wx.chooseImage({
      count: 3,
      sourceType:['album','camera'],
      success:res=>{
        let temFile = res.tempFilePaths;
        let PicName = [];
        if(temFile.length!=0){
          for(var i = 0; i < temFile.length; i++){
            var type = temFile[i].substring(temFile[i].lastIndexOf('.'));//获取临时路径的文件类型
            PicName[i] = AddPTime + Math.floor(Math.random() * 100) + type;
          }
        }
        // console.log(PicName)
        that.setData({
          TablePic:PicName,
          TableTemPath:temFile,
        })
        // console.log(that.data.TablePic)
      }
    })
  },
  // 将课表图片上传云存储
  upTablePic:function (TableTemPath, TablePic , i){
    var that = this;
    wx.cloud.uploadFile({
      cloudPath:TablePic[i],
      filePath:TableTemPath[i],
      success(){
        console.log("上传成功");
        i++;
        if(i < TableTemPath.length){
          that.upTablePic(TableTemPath, TablePic , i)
        }
      }
    })
  },
  // 新建书籍
  getBook(e){
    var that = this;
    if(that.data.hasUserInfo){
      var Book = e.detail.value
      var BookImage = that.data.BookPic;
      var AddTime = new Date();
      var AddBookTime = util.formatTime(AddTime);
      var userName = wx.getStorageSync('userInfo').nickName;
      var userAvatar = wx.getStorageSync('userInfo').avatarUrl;
      var BooktemPath = that.data.BookTemPath;
      // console.log(Book)
      db.collection("Book").add({
        data:{
          BookName:Book.bookname,
          BookAuthor:Book.bookauthor,
          BookType:Book.booktype,
          BookContent:Book.bookcontent,
          BookPic:BookImage,
          AddBookTime,
          userName,
          userAvatar,
        }
      }).then(res=>{
        // console.log("上传成功")
      })
      that.upBookPic(BooktemPath,BookImage,0)
      that.setData({
        isBUpLoad:true,
        remove:'',
      })
      if(that.data.isBUpLoad == true){
        wx.showToast({
          title: '上传成功',
        })
        that.resetBook();
      }
    }
    else{
      wx.showToast({
        title: '请先登录!',
        icon:"error",
      })
    }
  },
  // 添加书籍封面
  addBookPic(){
    var that = this;
    let AddTime = new Date();
    let AddPTime = util.myFormatTime(AddTime);
    wx.chooseImage({
      count: 3,
      sourceType:['album','camera'],
      success:res=>{
        let temFile = res.tempFilePaths;
        let PicName = [];
        if(temFile.length!=0){
          for(var i = 0; i < temFile.length; i++){
            var type = temFile[i].substring(temFile[i].lastIndexOf('.'));//获取临时路径的文件类型
            PicName[i] = AddPTime + Math.floor(Math.random() * 100) + type;
          }
        }
        that.setData({
          BookPic:PicName,
          BookTemPath:temFile,
        })
      }
    })
  },
  // 将书籍封面上传云存储
  upBookPic:function (BookTemPath, BookPic , i){
    var that = this;
    wx.cloud.uploadFile({
      cloudPath:BookPic[i],
      filePath:BookTemPath[i],
      success(){
        console.log("上传成功");
        i++;
        if(i < BookTemPath.length){
          that.upTablePic(BookTemPath, BookPic , i)
        }
      }
    })
  },
  // 重置书籍编辑信息
  resetBook(){
    var that = this;
    that.setData({
      isBUpLoad:false,
      BookTemPath:[],
    })
  },

  // 新建便签
  getTips(e){
    var that = this;
    if(that.data.hasUserInfo){
      var Tips = e.detail.value;
      var TipsImage = that.data.TipsPic;
      var AddTime = new Date();
      var AddTipsTime = util.formatTime(AddTime);
      var userName = wx.getStorageSync('userInfo').nickName;
      var userAvatar = wx.getStorageSync('userInfo').avatarUrl;
      var TipstemPath = that.data.TipsTemPath;
      // console.log(Tips)
      db.collection("Note").add({
        data:{
          TipsTitle:Tips.TipsTitle,
          TipsType:Tips.TipsType,
          TipsContent:Tips.TipsContent,
          TipsPic:TipsImage,
          AddTipsTime,
          userName,
          userAvatar,
        }
      }).then(res=>{
        // console.log("上传成功")
      })
      that.upTipsPic(TipstemPath,TipsImage,0)
      that.setData({
        isTipsLoad:true,
        remove:''
      })
      if(that.data.isTipsLoad == true){
        wx.showToast({
          title: '上传成功',
        })
        that.resetTips()
      }
    }
    else{
      wx.showToast({
        title: '请先登录!',
        icon:"error",
      })
    }
  },
  // 重置便签编辑
  resetTips(){
    var that = this;
    that.setData({
      isTipsLoad:false,
      TipsTemPath:[],
    })
  },
  // 添加便签图片
  AddTipsPic(){
    var that = this;
    let AddTime = new Date();
    let AddPTime = util.myFormatTime(AddTime);
    wx.chooseImage({
      count: 3,
      sourceType:['album','camera'],
      success:res=>{
        let temFile = res.tempFilePaths;
        let PicName = [];
        if(temFile.length!=0){
          for(var i = 0; i < temFile.length; i++){
            var type = temFile[i].substring(temFile[i].lastIndexOf('.'));//获取临时路径的文件类型
            PicName[i] = AddPTime + Math.floor(Math.random() * 100) + type;
          }
        }
        that.setData({
          TipsPic:PicName,
          TipsTemPath:temFile,
        })
      }
    })
  },
  // 将便签图片上传云存储
  upTipsPic:function (TipsTemPath, TipsPic , i){
    var that = this;
    wx.cloud.uploadFile({
      cloudPath:TipsPic[i],
      filePath:TipsTemPath[i],
      success(){
        console.log("上传成功");
        i++;
        if(i < TipsTemPath.length){
          that.upTablePic(TipsTemPath, TipsPic , i)
        }
      }
    })
  },

  // 新建相册
  getAlbum(e){
    var that = this;
    if(that.data.hasUserInfo){
      var Album = e.detail.value;
      var AddTime = new Date();
      var AddAlbumTime = util.formatTime(AddTime);
      var userName = wx.getStorageSync('userInfo').nickName;
      var userAvatar = wx.getStorageSync('userInfo').avatarUrl;
      var AlbumImage = that.data.AlbumPic;
      var AlbumtemPath = that.data.AlbumTemPath;
      db.collection("Album").add({
        data:{
          AlbumName:Album.AlbumName,
          AddAlbumTime,
          userAvatar,
          userName,
          AlbumPic:AlbumImage,
        }
      }).then(res=>{
        console.log("新建相册成功")
      })
      that.UpAlbumPic(AlbumtemPath,AlbumImage,0)
      that.setData({
        isAlbumLoad:true,
        remove:"",
      })
      if(that.data.isAlbumLoad == true){
        wx.showToast({
          title: '新建成功',
          mask:true,
        })
        that.resetAlbum();
      }
    }
    else{
      wx.showToast({
        title: '请先登录!',
        icon:"error",
      })
    }
  },

  // 重置相册编辑
  resetAlbum(){
    var that = this;
    that.setData({
      isAlbumLoad:false,
      hasAlbumPic:false,
      AlbumTemPath:[],
    })
  },

  // 添加相册封面
  AddAlbumPic(){
    var that = this;
    let AddTime = new Date();
    let AddPTime = util.myFormatTime(AddTime);
    wx.chooseImage({
      count: 1,
      sourceType:['album','camera'],
      success:res=>{
        let temFile = res.tempFilePaths;
        let PicName = [];
        if(temFile.length!=0){
          for(var i = 0; i < temFile.length; i++){
            var type = temFile[i].substring(temFile[i].lastIndexOf('.'));//获取临时路径的文件类型
            PicName[i] = AddPTime + Math.floor(Math.random() * 1000) + type;
          }
        }
        that.setData({
          AlbumPic:PicName,
          AlbumTemPath:temFile,
          hasAlbumPic:true,
        })
      }
    })
  },
  // 将封面上传云存储
  UpAlbumPic:function(AlbumTemPath, AlbumPic, i){
    var that = this;
    wx.cloud.uploadFile({
      cloudPath:AlbumPic[i],
      filePath:AlbumTemPath[i],
      success(){
        console.log("上传成功");
        i++;
        if(i < AlbumTemPath.length){
          that.upTablePic(AlbumTemPath, AlbumPic , i)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      type:options.type,
      hasUserInfo: wx.getStorageSync('isHasUserInfo'),
    })
    // console.log(that.data.hasUserInfo)
    //console.log(this.data.type)
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