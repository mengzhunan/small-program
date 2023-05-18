// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async () => {
  return await db.collection('ComicDatabase').doc('3e6c12266426e6bf00db06c950edde0e').get()
}