import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { columnModel } from '../models/columnModel.js'

const createNew = async (reqBody) => {
  try {
    const createColumn = await columnModel.createNew(reqBody)
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId.toString())

    return getNewColumn
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo column'
    )
  }
}
export const columnService = { createNew }