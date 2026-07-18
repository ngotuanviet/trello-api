import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '../../validations/boardValidation.js'
import { boardController } from '../../controllers/boardController.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).send({ message: 'Note API get list boards' })
  })
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)
Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardToDifferentColumns, boardController.moveCardToDifferentColumns)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetail)
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)
  .delete(authMiddleware.isAuthorized, boardValidation.deleteBoardColumnIds, boardController.update)
export const boardRoute = Router