import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { cardModel } from '../models/cardModel.js'

const createNew = async (reqBody) => {
  try {
    const createCard = await cardModel.createNew(reqBody)
    const newCarDetail = await cardModel.findOneById(createCard.insertedId)
    return newCarDetail
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo column'
    )
  }
}
export const cardService = { createNew }