import { StatusCodes } from 'http-status-codes'
import { columnService } from '../services/columnService.js'

const createNew = async (req, res, next) => {
  try {
    const createColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).send({
      createColumn
    })

  } catch (error) { next(error) }
}
export const columnController = { createNew }