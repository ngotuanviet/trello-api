import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { columnModel } from '../models/columnModel.js'
import { boardModel } from '../models/boardModel.js'
import { cardModel } from '../models/cardModel.js'

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
const update = async (columnId, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tìm board mới')

  }
}
const deleteColumn = async (columnId) => {
  try {

    await columnModel.deleteOneById(columnId)
    await cardModel.deleteManyByColumnId(columnId)
    return {
      StatusCode: 200,
      deleteResult: 'Column and its Cards deleted successfully!'
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tìm board mới')

  }
}
export const columnService = { createNew, update, deleteColumn }