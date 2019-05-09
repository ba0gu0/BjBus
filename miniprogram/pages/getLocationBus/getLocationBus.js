// getpoi.js
// 获取当前位置的公交站点信息
// 加载高德地图微信小程序SDK

var config_amap = require('../../libs/config-amap.js');
// 获取应用实例
const app = getApp()
Page({
  data: {
    markers: [],
    userLocation: {},
    textData: {},
  },
  splitRes: function splitRes(poisData) {
    for (var i = 0; i < poisData.length; i++) {
      poisData[i].address = poisData[i].address.split(';')
    }
    return poisData
  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
  onLoad: function () {
    var key = config_amap.Config.key

    if (app.globalData.userLocation) {
      this.setData({
        userLocation: app.globalData.userLocation,
      })
    } else {
      // 由于 getuserLocation 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userLocationReadyCallback = res => {
        this.setData({
          userLocation: res,
        })
      }
    }
    wx.request({
      url: 'https://restapi.amap.com/v3/place/around?s=rsv3&radius=500&types=交通设施服务&city=010&citylimit=true&extensions=all&sdkversion=1.4.14&keywords=公交站&key=' + key + '&location=' + this.data.userLocation.longitude + ',' + this.data.userLocation.latitude,
      success: res => {
        if (res.data.pois.length > 0){
          this.setData({
            // 成功回调
            textData: this.splitRes(res.data.pois)
          })
        }else{
          this.setData({
            textData: false
          })
        }
        
      },
      fail: info => {
        // 失败回调
        this.setData({
          textData: false
        })
      }
    })
  },
  bindViewGetBus: function (event) {
    app.globalData.searchKeyWords = event.target.dataset.keywords
    wx.navigateTo({
      url: '/pages/getBusMessage/getBusMessage'
    })
  }
})
