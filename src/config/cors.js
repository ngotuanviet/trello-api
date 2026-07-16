import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'
import { WHITELIST_DOMAINS } from '~/utils/constants'

export const corsOptions = {
  origin: (origin, callback) => {
    // Neu moi truờng la local dev thi cho qua luon
    if (env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }
    // Ngược lại thì hiện tại code chúng ta đang làm còn 1 trường hợp là:
    // env.BUILD_MODE === 'production
    // Kiềm tra xem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }
    // Cuối cùng neu domain không được chắp nhận thì trả về tỗi
    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy`))
  },
  optionsSuccessStatus: 200,

  // Cho phép nhận cookies/credentials từ client
  credentials: true
}