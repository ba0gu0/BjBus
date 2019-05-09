// index.js
// 获取应用实例

const app = getApp()

Page({
  data: {
    busStationData: {},
    onStation: [],
    busRealTime: {},
    realTimeStation: 3
  },
  getDbStation: function (startStation, endStation) {
    return new Promise((resolve, reject) => {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力;');
      } else {
        wx.cloud.init({
          traceUser: true,
        })
      }
      wx.cloud.callFunction({
        name: 'getBusStatus',
        data: {
          "StartStation": startStation,
          "EndStation": endStation
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
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
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
    }
    this.getDbStation(busStartStop, busEndStop).then(res => {
      if(res.length > 0){
        this.setData({
          busStationData: res[0]
        })
        this.getRealStation(res[0].LineValue, '3').then(res => {
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
          "endStop": busEndStop
        })
      }else{
        this.setData({
          busStationData: false
        })
      }
    });
    // console.log(this.data)
  },
  bindGetRealStation: function (event){
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
    wx.redirectTo({
      url: '/pages/getBusRealTime/getBusRealTime'
    })
  }
})