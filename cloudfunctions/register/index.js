// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var userInfo = event['userInfo']
  try {
    return await db.collection('Doc_UserInfo').add({
      data: {
        _id: wxContext.OPENID,
        openId: wxContext.OPENID,
        appId: wxContext.APPID,
        // avatarUrl: userInfo['avatarUrl'],
        // city: userInfo['city'],
        // country: userInfo['country'],
        // language: userInfo['language'],
        // nickName: userInfo['nickName'],
        // province: userInfo['province'],
        registerTime: new Date()
      }
    })
  } catch (e) {
    console.error(e)
  }
}