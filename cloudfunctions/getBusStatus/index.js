// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // console.log(event['StartStation'], event['EndStation'])
  try {
    return await db.collection('Doc_BjBusMsg').where({
      "StartStation": event['StartStation'],
      "EndStation": event['EndStation']
    }).get()
  } catch (e) {
    console.error(e)
  }
}