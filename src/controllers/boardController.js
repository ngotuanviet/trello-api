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
const update = async (req, res, next) => {
  const { id } = req.params

  try {
    const updatedBoard = await boardService.update(id, req.body)
    res.status(StatusCodes.OK).send({
      updatedBoard
    })

  } catch (error) { next(error) }
}
const moveCardToDifferentColumns = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumns(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}
export const boardController = {
  createNew,
  getDetail, update, moveCardToDifferentColumns
}