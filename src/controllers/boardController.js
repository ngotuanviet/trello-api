import { StatusCodes } from 'http-status-codes'
import { boardService } from '../services/broadService.js'
const createNew = async (req, res, next) => {

  try {
    const createBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).send({
      createBoard
    })

  } catch (error) { next(error) }
}
const getDetail = async (req, res, next) => {
  const { id } = req.params
  try {
    const board = await boardService.getDetail(id)
    res.status(StatusCodes.OK).send({
      board
    })

  } catch (error) { next(error) }
}
export const boardController = {
  createNew,
  getDetail
}