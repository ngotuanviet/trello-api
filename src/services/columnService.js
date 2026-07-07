import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { columnModel } from '../models/columnModel.js'
import { boardModel } from '../models/boardModel.js'

const createNew = async (reqBody) => {
  try {
    const createColumn = await columnModel.createNew(reqBody)
    const getNewColumn = await columnModel.findOneById(createColumn.insertedId.toString())
    if (getNewColumn) {
      // sử lý cấu trúc data ở dây trước khi trả dữ liệu về
      getNewColumn.cards = []
      // Cập nhật mảng columnsOrderIds trong collection boards\
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo column'
    )
  }
}
export const columnService = { createNew }