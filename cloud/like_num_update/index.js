// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("comment")
    .where({
      comment_time_num: event.comment_time_num
    })
    .update({
      data: {
        hasChange: event.hasChange,
        like_num: event.like_num
      }
    })
}