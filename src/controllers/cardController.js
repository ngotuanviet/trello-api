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
const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const userInfo = req.jwtDecoded
    const cardCoverFile = req.file
    const updatedCard = await cardService.update(cardId, req.body, cardCoverFile, userInfo)
    res.status(StatusCodes.OK).json(updatedCard)
  } catch (error) {
    next(error)
  }
}
export const cardController = { createNew, update }