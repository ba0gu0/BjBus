// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    return await db.collection('Doc_UserHistory').where({
      "openId": wxContext.OPENID
    }).get()
  } catch (e) {
    console.error(e)
  }
}