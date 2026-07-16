import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
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
    const getNewUser = await userModel.findOneById(createdUser.insertedId).select('-password')

    return pickUser(getNewUser)
  } catch (error) {
    throw new error
  }
}
export const userService = { createNew }