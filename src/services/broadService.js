/* eslint-disable no-useless-catch */
import { slugify } from '../utils/formatters.js'
import { boardModel } from '../models/boardModel.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import cloneDeep from 'lodash'
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
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo board mới')
  }
}
const getDetail = async (id) => {
  try {
    const board = await boardModel.getDetails(id)
    if (!board) {
      {
        throw new ApiError(StatusCodes.NOT_FOUND, 'board không tồn tại')
      }
    }
    // cloneDeep để sao chép mảng không ảnh hưởng đến mảng ban đầu
    // const resBoard = cloneDeep(board)
    // đưa card về đúng columns
    // console.log(resBoard.columns);

    board.columns.forEach(column => {

      column.cards = board.cards.filter(card => card.columnId.toString() === column._id.toString())
    })


    delete board.cards
    return board
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tìm board mới')

  }
}
export const boardService = {
  createNew,
  getDetail
}