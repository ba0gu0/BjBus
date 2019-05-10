// 获取公交线路的实时信息
// getBusStatus.js
// 加载amap的key
var config_amap = require('../../libs/config-amap.js');

// 获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    busLineList: {},
    tempData: ''
  },
  getLineData: function (buslines) {
    for (var i = 0; i < buslines.length; i++){
      var tempBus = buslines[i];
      if (tempBus.start_time.length > 0 && tempBus.end_time.length > 0){
        buslines[i].start_time = tempBus.start_time.substr(0, 2) + ':' + tempBus.start_time.substr(2, 2);
        buslines[i].end_time = tempBus.end_time.substr(0, 2) + ':' + tempBus.end_time.substr(2, 2)
      }
      var stations = tempBus.busstops;
      var tempStations = [];
      for (var j = 0; j < stations.length; j++){
        var tempStationMarker = stations[j].location.split(',');
        var stationMarker = {};
        stationMarker.id = j;
        stationMarker.title = stations[j].name;
        stationMarker.longitude = tempStationMarker[0];
        stationMarker.latitude = tempStationMarker[1];
        // stationMarker.iconPath = '../../img/location.png';
        stationMarker.label = {
          content: stations[j].name,
          color: '#00CE00',
          anchorX: 0,
          anchorY: 0,
          fontSize: 10,
          borderRadius: 2,
          textAlign: 'center'
        }
        tempStations[j] = stationMarker;

      }
      buslines[i].locationStationXy = tempStations;
      buslines[i].mid_stop = stations[parseInt(stations.length / 2)].name;
      var polylines = tempBus.polyline.split(';');
      for (var k = 0; k < polylines.length; k++){
        var tempLocationSplit = polylines[k].split(',');
        var tempLocation = {};
        tempLocation.longitude = tempLocationSplit[0];
        tempLocation.latitude = tempLocationSplit[1];
        polylines[k] = tempLocation;
      }
      buslines[i].polyline = polylines;
      
    }
    return buslines;
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.searchKeyWords){
      var keywords = app.globalData.searchKeyWords;
    }
    var key = config_amap.Config.key;
    var url = 'https://restapi.amap.com/v3/bus/linename?s=rsv3&city=010&citylimit=true&extensions=all&output=json&city=010&offset=2&key=' + key + '&keywords=' + keywords;
    wx.request({
      url: url,
      success: res => {
        // console.log(res)
        if(res.data.status == '1') {
          var buslines = this.getLineData(res.data.buslines);
          this.setData({
            busLineList: buslines
          });
        } else {
          this.setData({
            busLineList: false
          });
        }
      }
    })
    // console.log(this.data);
  },
  bindViewGetBusMap: function (event){
    app.globalData.locationStationXy = event.target.dataset.locationstationxy;
    app.globalData.locationPolyLine = event.target.dataset.locationpolyline;
    app.globalData.busLineNmae = event.target.dataset.buslinenmae;
    wx.navigateTo({
      url: '/pages/getBusMap/getBusMap'
    })
  },
  bindViewGetBusRealTime: function (event) {
    app.globalData.busStartStop = event.target.dataset.busstartstop;
    app.globalData.busEndStop = event.target.dataset.busendstop;
    app.globalData.busMidStop = event.target.dataset.busmidstop;
    wx.navigateTo({
      url: '/pages/getBusRealTime/getBusRealTime'
    })
  }
})