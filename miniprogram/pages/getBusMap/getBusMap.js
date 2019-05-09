// index.js
// 获取应用实例

const app = getApp()

Page({
  data:{
    lineName: '000路',
    latitude: '39.938003',
    longitude: '116.353671',
    markers: [{

    }],
    polyline: [{

    }],
    includePoints: [{

    }],
  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
  onLoad: function () {
    if (app.globalData.busLineNmae) {
      var locationStationXy = app.globalData.locationStationXy;
      var locationPolyLine = app.globalData.locationPolyLine;
      var busLineNmae = app.globalData.busLineNmae;
    }
    var locationIncludePoints = [];
    var maxLatitude = locationStationXy[0].latitude;
    var minLatitude = maxLatitude;
    var maxLongitude = locationStationXy[0].longitude;
    var minLongitude = maxLongitude;
    for (i = 0; i < locationStationXy.length; i++){
      var tempData = locationStationXy[i];
      var tempItude = {};
      tempItude.latitude = tempData.latitude;
      tempItude.longitude = tempData.longitude;
      locationIncludePoints[i] = tempItude;
      if (tempData.latitude < minLatitude){
        minLatitude = tempData.latitude
      }
      if (tempData.latitude > maxLatitude) {
        maxLatitude = tempData.latitude
      }
      if (tempData.longitude < minLongitude) {
        minLongitude = tempData.longitude
      }
      if (tempData.longitude > maxLongitude) {
        maxLongitude = tempData.longitude
      }
    }
    var locationPolyLines = [];
    var tempPolyLines = {}
    tempPolyLines.points = locationPolyLine;
    tempPolyLines.color = '#25C2F2';
    tempPolyLines.width	= 8;
    locationPolyLines[0] = tempPolyLines;
    this.setData({
      lineName: busLineNmae,
      markers: locationStationXy,
      polyline: locationPolyLines,
      includePoints: locationIncludePoints,
      latitude: (parseFloat(maxLatitude) + parseFloat(minLatitude))/2,
        longitude: (parseFloat(maxLongitude) + parseFloat(minLongitude))/2
    })
    // console.log(this.data)
  }

})