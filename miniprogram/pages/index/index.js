// index.js
// 获取应用实例

const app = getApp()

if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    traceUser: true,
  })
}

Page({
  data: {
    userInfo: {},
    userLocation: {},
    hasUserInfo: false,
    hasUserLocation: false,
    errorMsgUserLocation: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lineNmaes: {}
  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.userLocation) {
      this.setData({
        userLocation: app.globalData.userLocation,
        hasUserLocation: true
      })
    } else {
      // 由于 getuserLocation 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userLocationReadyCallback = res => {
        this.setData({
          userLocation: res,
          hasUserLocation: true
        })
      }
    }
    // console.log(this.data.userLocation);
    wx.cloud.callFunction({
      name: 'getHistory',
      success: res => {
        if (res.result.data.length > 0){
          this.setData({
            lineNmaes: res.result.data
          })
        }else{
          this.setData({
            lineNmaes: false
          })
        }
      }
    })
  },
  bindViewGetLocationBus: function () {
    wx.navigateTo({
      url: '/pages/getLocationBus/getLocationBus'
    })
  }, 
  bindViewSearchBus: function () {
    wx.navigateTo({
      url: '/pages/searchBus/searchBus'
    })
  },
  // 事件处理函数
  bindViewGetLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        app.globalData.userLocation = res;
        this.setData({
          userLocation: res,
          hasUserLocation: true,
          errorMsgUserLocation: ''
        })
      },
      fail: info => {
        this.setData({
          errorMsgUserLocation: '获取定位信息失败,部分功能无法使用.'
        })
      }
    })
  },
  bindViewGetUserInfo: function (event) {
    if (event.detail.userInfo){
      app.globalData.userInfo = event.detail.userInfo
      wx.cloud.callFunction({
        name: 'register',
        data: {
          "userInfo": app.globalData.userInfo
        },
        success: res => {
        }
      })
      this.setData({
        userInfo: event.detail.userInfo,
        hasUserInfo: true,
        errorMsgUserInfo: ''
      })
    }
  },
  bindViewHistory: function (event){
    app.globalData.busStartStop = event.target.dataset.startstop
    app.globalData.busEndStop = event.target.dataset.endstop
    app.globalData.busLineNmae = event.target.dataset.linenmae;
    wx.navigateTo({
      url: '/pages/getBusRealTime/getBusRealTime'
    })
  },
  bindViewClearHistory: function (){
    wx.cloud.callFunction({
      name: 'clearHistory',
      success: res => {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  }
})
