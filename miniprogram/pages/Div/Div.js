const db = wx.cloud.database();
var UserLocation = require("../../utils/location/qqmap-wx-jssdk.min");
var util = require("../../utils/util");
var Location;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:null,
    remove:"",
    longitude:"",//经度
    latitude:"",//纬度
    province: "",
    city: "",
    county: "",
    addressDetail: "",
    DivData:[],
    DivPic:[],
    DivTemPath:[],
    isActive:false,
    isShow:false,
    hasUserInfo:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  //获取说说数据
  GetDivData(e){
    let that = this;
    let Div = e.detail.value;
    let AddTime = new Date();
    let AddDivTime = util.formatTime(AddTime);
    let userName = wx.getStorageSync('userInfo').nickName;
    let userAvatar = wx.getStorageSync('userInfo').avatarUrl;
    let DivImage = that.data.DivPic;
    let DivtemPath = that.data.DivTemPath;
    db.collection("Discussion").add({
      data:{
        userName,
        userAvatar,
        AddDivTime,
        DivContent:Div.DivContent,
        DetailLocation:that.data.addressDetail,
        DivPic:DivImage,
      }
    }).then(res=>{

    })
    that.upDivPic(DivtemPath,DivImage,0)
    that.setData({
      isActive:true,
      remove:'',
      DivTemPath:[],
    })
    if(that.data.isActive == true){
      wx.showToast({
        title: '上传成功',
      })
      that.setData({
        isShow:false,
      })
    }
  },

  //上传图片事件
  AddDivPic(){
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
            PicName[i] = AddPTime + Math.floor(Math.random() * 1000) + type;
          }
        }
        that.setData({
          DivPic:PicName,
          DivTemPath:temFile,
        })
      }
    })
  },
  // 图片上传云存储
  upDivPic:function (DivTemPath, DivPic , i){
    var that = this;
    wx.cloud.uploadFile({
      cloudPath:DivPic[i],
      filePath:DivTemPath[i],
      success(){
        console.log("上传成功");
        i++;
        if(i < DivTemPath.length){
          that.upDivPic(DivTemPath, DivPic , i)
        }
      }
    })
  },

  // 获取位置信息
  getLocation(){
    let that = this;
    wx.getLocation({
      type:"wgs84",
      success(res){
        console.log(res)
        that.setData({
          longitude:res.longitude,
          latitude:res.latitude,
          isShow:true,
        },()=>{
          that.TransformLocation();
        })
      }
    })
  },

  // 将获取的经纬度位置信息转化成详细的真实位置信息
  TransformLocation(){
    let that = this;
    Location.reverseGeocoder({
      location:{
        latitude:that.data.latitude,
        longitude:that.data.longitude,
      },
      success:function(res){
        console.log("获取成功");
        console.log(res);
        let tempData = res.result.address_component;
        that.setData({
          province:tempData.province,
          city:tempData.city,
          county:tempData.district,
          addressDetail: res.result.address,
        });
      },
      fail:function(err){
        console.log("err")
        console.error(error);
      },
      complete: function(res) {
        console.log("complete")
        console.log(res);
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      hasUserInfo:wx.getStorageSync('isHasUserInfo'),
    })
    console.log(that.data.hasUserInfo)
    Location = new UserLocation({
      key:"D5KBZ-2G2CV-524PU-U7YLZ-KE6RH-H3FED" //腾讯位置Key
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
    var that = this;
    that.setData({
      hasUserInfo:wx.getStorageSync('isHasUserInfo')
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