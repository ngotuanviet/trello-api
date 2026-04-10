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
export const boardController = {
  createNew
}