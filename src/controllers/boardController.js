import { StatusCodes } from 'http-status-codes'
import { boardService } from '../services/broadService.js'
const createNew = async (req, res, next) => {

  try {
    const userId = req.jwtDecoded._id
    const createBoard = await boardService.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).send({
      createBoard
    })

  } catch (error) { next(error) }
}
const getDetail = async (req, res, next) => {

  try {
    const { id } = req.params
    const userId = req.jwtDecoded._id
    const board = await boardService.getDetail(userId, id)
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
const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    // page va itemsPerPage dược truyền vào trong query url từ phía FE nên BE sẽ lầy thông qua req.query
    const { page, itemsPerPage } = req.query

    const queryFilter = req.query.q || {
      title: req.query['q[title]'],
      description: req.query['q[description]']
    }


    const results = await boardService.getBoards(userId, page, itemsPerPage, queryFilter)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}
export const boardController = {
  createNew,
  getDetail, update, moveCardToDifferentColumns, getBoards
}