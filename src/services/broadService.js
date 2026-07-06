/* eslint-disable no-useless-catch */
import { slugify } from '../utils/formatters.js'

import { boardModel } from '../models/boardModel.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId.toString())
    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án ... vv
    // Bằn email, notification về cho admin khi có 1 cái board mới được tạo ... vv
    return getNewBoard
  } catch (error) {
    throw error
  }
}
const getDetail = async (id) => {
  try {
    const board = await boardModel.findOneById(id)
    if (!board) {
      {
        throw new ApiError(StatusCodes.NOT_FOUND, 'board not found')
      }
    }
    return board
  } catch (error) {
    throw error
  }
}
export const boardService = {
  createNew,
  getDetail
}