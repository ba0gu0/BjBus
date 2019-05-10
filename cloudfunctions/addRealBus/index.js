// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var realBus = event['busData']
  try {
    return await db.collection('Doc_UserHistory').add({
      data: {
        _id: wxContext.OPENID + '_' + realBus['shortLineName'],
        openId: wxContext.OPENID,
        appId: wxContext.APPID,
        startStop: realBus['startStop'],
        shortLineName: realBus['shortLineName'],
        endStop: realBus['endStop'],
        midStop: realBus['midStop'],
        lineName: realBus['lineName']
      }
    })
  } catch (e) {
    console.error(e)
  }
}