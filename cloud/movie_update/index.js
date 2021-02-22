// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
  var total_before = event.critic_num * event.movie_score
  var total_after = (total_before + event.score) / (event.critic_num + 1)
  return await db.collection("movie")
    .where({
      movie_time_num: event.movie_time_num
    })
    .update({
      data: {
        critic_num: event.critic_num + 1,
        movie_score: Number(total_after.toFixed(2))
      }
    })
}