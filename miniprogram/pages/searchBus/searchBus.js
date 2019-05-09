// searchBus.js
// 搜索公交路线
// 加载高德地图微信小程序SDK

var config_amap = require('../../libs/config-amap.js');

// 获取应用实例
const app = getApp()



Page({
  data: {
    stationData: {}
  },
  onLoad: function(e){

  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
  bindViewInput: function(e){
    var keywords = e.detail.value; 
    var key = config_amap.Config.key;
    var url = 'https://restapi.amap.com/v3/assistant/inputtips?s=rsv3&city=010&datatype=busline&citylimit=true&key=' + key + '&keywords=' + keywords;
    wx.request({
      url: url,
      success: res => {
        if(res.data.status == "1"){
          this.setData({
            stationData: res.data.tips
          })
        }
      },
      fail: info => {
        // 失败回调
        this.setData({
        })
      }
    })
  },
  bindViewSearch: function(event){
    app.globalData.searchKeyWords = event.target.dataset.keywords
    wx.navigateTo({
      url: '/pages/getBusMessage/getBusMessage'
    })
  }
})