import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { ResendProvider } from '~/providers/ResendProvider'
import { JwtProvider } from '~/providers/JwtProvider'
import { env } from '~/config/environment'
const createNew = async (reqBody, res, next) => {

  try {
    //kiếm tra email tồn tại hay chưa
    const exitUser = await userModel.findOneByEmail(reqBody.email)
    if (exitUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exits!')
    }
    // Tạo data để lưu vào Database
    // nameFromEmail: nếu email là ngotuanviet9@gmail.com thì username sẽ lấy là ngotuanviet
    const nameFromEmail = reqBody.email.split('@')[0]

    const newUser = {
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 10), // Tham số thứ 2 thể hiện độ phức tạp, giá trị càng cao thì băng càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail, // Mặc định để giống username khi đăng kí mới
      verifyToken: uuidv4()
    }
    // Thực hiện lưu thông tin user vào DataBase
    const createdUser = await userModel.createNew(newUser)
    // Gửi email cho người dùng xác thực tk
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello Web: Please verify your email before using our services'
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely,<br/> - Trello Web</h3>
    `
    // Gọi Provider gửi Emial
    await ResendProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
    return pickUser(getNewUser)
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo column'
    )

  }
}
const verifyAccount = async (reqBody) => {
  try {
    const exitUser = await userModel.findOneByEmail(reqBody.email)
    if (!exitUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }
    if (exitUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active')
    }
    if (reqBody.token !== exitUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')
    }
    // Nếu như mọi thứ oke  thì sẽ update thông tin user để verify tài khoản
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    // Thực hiện thông tin update user
    const updatedUser = await userModel.update(exitUser._id, updateData)
    return pickUser(updatedUser)
  } catch (error) { throw new ApiError(StatusCodes.BAD_REQUEST, 'Error verify Account') }

}
const login = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const exitUser = await userModel.findOneByEmail(reqBody.email)
    if (!exitUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }

    if (!bcrypt.compareSync(reqBody.password, exitUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')

    }
    if (!exitUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    }
    // Nếu mọi thứ ok thì bắt đầu tạo Tokens đăng nhập để trả về cho phía FE

    // tạo Thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: exitUser._id,
      email: exitUser.email
    }
    //Tạo ra 2 loại token, accessToken và refreshToken để trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_SECRET_SIGNATURE,

      env.REFRESH_TOKEN_LIFE
    )
    // Trả về thông tin của user kèm theo 2 cái token vừa tạo ra

    return {
      accessToken,
      refreshToken,
      ...pickUser(exitUser)
    }

  } catch (error) {
    throw error
  }
}
const refreshToken = async (refreshToken) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Verify / giài mã cái refresh token xem có hợp lệ không
    const refreshTokenDecoded = await JwtProvider.verifyToken(refreshToken, env.REFRESH_SECRET_SIGNATURE)

    // Doạn này vì chúng ta chi lưu những thông tin unique và co định của user trong token rồi, vì vậy có thể 
    // lay luon tu decoded ra, tiet kiem query vào DB de lay data mới.
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }
    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_SECRET_SIGNATURE,
      // 5 //5 s
      env.ACCESS_TOKEN_LIFE
    )
    return { accessToken }
  } catch (error) {
    throw error
  }
}
export const userService = { createNew, verifyAccount, login, refreshToken }