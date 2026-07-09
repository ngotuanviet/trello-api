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
const update = async (req, res, next) => {
  const { id } = req.params

  try {
    const updatedColumn = await columnService.update(id, req.body)
    res.status(StatusCodes.OK).send({
      updatedColumn
    })

  } catch (error) { next(error) }
}
const deleteColumn = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await columnService.deleteColumn(id)
    res.status(StatusCodes.OK).send({
      result
    })

  } catch (error) { next(error) }
}
export const columnController = { createNew, update, deleteColumn }