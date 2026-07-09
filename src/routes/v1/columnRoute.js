import express from 'express'
import { columnValidation } from '../../validations/columnValidation.js'
import { columnController } from '../../controllers/columnController.js'
const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.send('hello')
  })
  .post(columnValidation.createNew, columnController.createNew)
Router.route('/:id')
  .put(columnValidation.update, columnController.update)
export default Router