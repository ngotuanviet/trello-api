import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js'

const createNew = async (req, res, next) => {

  const correctCondition = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),

    // // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),
    _destroy: Joi.boolean().default(false)
  })
  try {
    // chỉ định abortEarly: false có nhiều lỗi validation
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()

  } catch (error) {
    next(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
  }

}

export const columnValidation = {
  createNew
}