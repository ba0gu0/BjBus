// index.js
// 获取应用实例

const app = getApp()
if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力;');
} else {
  wx.cloud.init({
    traceUser: true,
  })
}
Page({
  data: {
    busStationData: {},
    onStation: [],
    busRealTime: {},
    realTimeStation: 3,
  },
  getDbStation: function (startStation, endStation, midStation) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getBusStatus',
        data: {
          "StartStation": startStation,
          "EndStation": endStation,
          "MidStation": midStation
        },
        success: res => {
          resolve(res.result.data)
        }
      })
    })
  },
  getRealStation: function(lineValue, stationValue = "1") {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://www.bjbus.com/api/api_line_rtime.php?uuid=' + lineValue + '&station=' + stationValue,
        success: res => {
          resolve(res)
        }
      })
    });
  },
  getOnStation: function (busList){
    var busLists = []
    for (var i = 0; i < busList.length; i ++){
      busLists.push((busList[i].top / 50).toFixed())
    }
    return busLists
  },
  addRealBus: function (busData){
    wx.cloud.callFunction({
      name: 'addRealBus',
      data: {
        "busData": busData,
      },
      success: res => {
        
      }
    })
  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
  onLoad: function(){
    if (app.globalData.busStartStop && app.globalData.busEndStop) {
      var busStartStop = app.globalData.busStartStop;
      var busEndStop = app.globalData.busEndStop;
      var busMidStop = app.globalData.busMidStop;
    }
    this.getDbStation(busStartStop, busEndStop, busMidStop).then(res => {
      if(res.length > 0){
        this.setData({
          busStationData: res[0],
        })
        this.getRealStation(res[0].Value, '3').then(res => {
          if (res.data.status == 'ok') {
            onStation = this.getOnStation(res.data.data.busList)
            this.setData({
              onStation: onStation,
              busRealTime: res.data.data.rTime
            })
          } else {
            this.setData({
              onStation: [],
              busRealTime: {}
            })
          }
        })
        var busLineNmae = res[0].LineName;
        shortLineName = busLineNmae.substr(0, busLineNmae.search(/\(/))
        this.addRealBus({
          "lineName": busLineNmae,
          "shortLineName": shortLineName,
          "startStop": busStartStop,
          "endStop": busEndStop,
          "midStop": busMidStop
        })
      }else{
        this.setData({
          busStationData: false
        })
      }
    });
    // console.log(this.data)
  },
  bindViewGetRealStation: function (event){
    var ststionValue =  event.target.dataset.ststionvalue;
    var lineValue = event.target.dataset.linevalue;
    this.getRealStation(lineValue, ststionValue).then(res => {
      if (res.data.status == 'ok') {
        onStation = this.getOnStation(res.data.data.busList)
        this.setData({
          onStation: onStation,
          busRealTime: res.data.data.rTime
        })
      } else {
        this.setData({
          onStation: [],
          busRealTime: {}
        })
      }
    })
    this.setData({
      realTimeStation: ststionValue
    })
    // console.log(this.data)
  },
  bindViewChangeLine: function (event) {
    app.globalData.busStartStop = event.target.dataset.startstop;
    app.globalData.busEndStop = event.target.dataset.endstop;
    app.globalData.busMidStop = null;
    wx.redirectTo({
      url: '/pages/getBusRealTime/getBusRealTime'
    })
  }
})