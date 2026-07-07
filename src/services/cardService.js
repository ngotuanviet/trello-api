import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { cardModel } from '../models/cardModel.js'
import { columnModel } from '../models/columnModel.js'

const createNew = async (reqBody) => {
  try {
    const createCard = await cardModel.createNew(reqBody)
    const getCarDetail = await cardModel.findOneById(createCard.insertedId)
    if (getCarDetail) {
      await columnModel.pushCardOrderIds(getCarDetail)
    }
    return getCarDetail
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo column'
    )
  }
}
export const cardService = { createNew }