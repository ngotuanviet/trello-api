import { StatusCodes } from "http-status-codes";
import { env } from '~/config/environment';
import { JwtProvider } from '~/providers/JwtProvider';
import ApiError from '~/utils/ApiError';
const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client ~ withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken
  // Nếu như cái clientAccessToken không tồn tại thì trả về lỗi luôn
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found!)'))
    return
  }
  try {
    // Buớc 01: Thực hiện giai mã token xen nó có hợp lệ hay tà không
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_SECRET_SIGNATURE)
    // console.log(accessTokenDecoded);

    // Bước 02: Quan trọng: Nều như cái token hợp tệ, thì gễ cần phải lưu thông tin giải mã được vào cái req. jwtDecoded, de su dung cho cac tang can x ty o phia sau
    req.jwtDecoded = accessTokenDecoded
    // Buớc 03: Cho phép cái request di tiếp
    next()
  } catch (error) {
    // console.log('authMiddleware', error);


    // Neu cai accessToken no bị hết hạn (expired) thi minh cần trà về một cái mã loi cho phia FE biet đe gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }
    // Nều như cái accessToken nó không lợp lệ do bắt kỳ điều gi khác vụ hết hạn thì chúng ta cứ thằng tay trà về mã 401 cho phia FE gpi api sign_out luon
  }
}
export const authMiddleware = { isAuthorized }