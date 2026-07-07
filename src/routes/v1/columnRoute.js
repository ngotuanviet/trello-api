import express from 'express'
import { columnValidation } from '../../validations/columnValidation.js'
import { columnController } from '../../controllers/columnController.js'
const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.send('hello')
  })
  .post(columnValidation.createNew, columnController.createNew)

export default Router