/* eslint-disable no-useless-catch */
import { slugify } from '../utils/formatters.js'
import { boardModel } from '../models/boardModel.js'
import { columnModel } from '../models/columnModel.js'
import { cardModel } from '../models/cardModel.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'
import cloneDeep from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants.js'
const createNew = async (userId, reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createBoard = await boardModel.createNew(userId, newBoard)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId.toString())
    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án ... vv
    // Bằn email, notification về cho admin khi có 1 cái board mới được tạo ... vv
    return getNewBoard
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo board mới')
  }
}
const getDetail = async (userId, id) => {
  try {
    const board = await boardModel.getDetails(userId, id)
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
    throw error
  }
}
const update = async (boardId, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi cập nhật board')
  }
}
const moveCardToDifferentColumns = async (reqBody) => {
  try {
    // 1. Cập nhật mảng cardOrderIds của column cũ
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds
    })

    // 2. Cập nhật mảng cardOrderIds của column mới
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    // 3. Cập nhật columnId của card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return { updateResult: 'Successfully' }
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi di chuyển card')
  }
}
const getBoards = async (userId, page, itemsPerPage, queryFilter) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE
    const result = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10), queryFilter)
    return result
  } catch (error) {
    throw error
  }
}
export const boardService = {
  createNew,
  getDetail,
  update,
  moveCardToDifferentColumns, getBoards
}