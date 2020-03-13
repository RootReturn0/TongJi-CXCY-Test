// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// // 云函数入口函数
// exports.main = (event, context) => {
//   console.log(event)
//   console.log(context)
//   return {
//     sum: event.a + event.b
//   }
// }

// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')
cloud.init({
  env: 'cxcy-return0'
}
)

// 云函数入口函数
exports.main = async (event, context) => {
  let getResponse = await got('http://www.beidounavi.top:9000/sendlocate')
  return {
    sum: getResponse.body
  }
}