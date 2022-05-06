//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-3gtlq2234f937878',
        traceUser: true,
      })
    }

    this.globalData = {}
    wx.cloud.callFunction({
      name:"login"
    }).then(res=>{
      wx.setStorageSync('userOpenId', res.result["openid"])
    })
  },
})
