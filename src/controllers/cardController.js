import { StatusCodes } from 'http-status-codes'
import { cardService } from '../services/cardService.js'


const createNew = async (req, res, next) => {
  try {
    const createCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).send({
      createCard
    })

  } catch (error) { next(error) }
}
export const cardController = { createNew }