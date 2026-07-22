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
    console.log(updateData);
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tìm board mới')

  }
}
const deleteColumn = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    await columnModel.deleteOneById(columnId)
    await cardModel.deleteManyByColumnId(columnId)
    // Xoá columnID trong mảng columnOrderIds của board chứa nó
    await boardModel.pullColumnOrderIds(targetColumn)
    return {
      StatusCode: 200,
      deleteResult: 'Column and its Cards deleted successfully!'
    }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error Delete Column')

  }
}
export const columnService = { createNew, update, deleteColumn }