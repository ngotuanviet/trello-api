import { StatusCodes } from 'http-status-codes'
import { env } from '../config/environment.js'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req, res, next) => {
  // Đảm bảo err luôn là một object để tránh lỗi TypeError khi gán thuộc tính (ví dụ: khi dev gọi next(422))
  if (!err || typeof err !== 'object') {
    err = {
      statusCode: typeof err === 'number' ? err : StatusCodes.INTERNAL_SERVER_ERROR,
      message: typeof err === 'string' ? err : 'Unknown Error'
    }
  }

  // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    stack: err.stack
  }
  // console.error(responseError)

  // Chi khi moi truong la DEV thi moi tra ve Stack Trace de debug
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
  // ...
  // console.error(responseError)

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError)
}