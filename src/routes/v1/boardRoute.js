import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '../../validations/boardValidation.js'
import { boardController } from '../../controllers/boardController.js'
const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).send({ message: 'Note API get list boards' })
  })
  .post(boardValidation.createNew, boardController.createNew)
Router.route('/supports/moving_card')
  .put(boardValidation.moveCardToDifferentColumns, boardController.moveCardToDifferentColumns)

Router.route('/:id')
  .get(boardController.getDetail)
  .put(boardValidation.update, boardController.update)
  .delete(boardValidation.deleteBoardColumnIds, boardController.update)
export const boardRoute = Router