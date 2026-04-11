/* eslint-disable no-useless-catch */
import { slugify } from '../utils/formatters.js'

import { boardModel } from '../models/boardModel.js'
const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createBoard.insertedId)



    // Làm thêm các xử lý logic khác với các Collection khác tùy đặc thù dự án ... vv
    // Bằn email, notification về cho admin khi có 1 cái board mới được tạo ... vv
    return getNewBoard
  } catch (error) {
    throw error
  }
}
export const boardService = {
  createNew
}