import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
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
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }

}
const update = async (req, res, next) => {

  const correctCondition = Joi.object({
    // Nếu cần làm tính năng di chuyển column sang Board khác thì mới thêm validate boardId 
    // boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ).default([]),

  })
  try {
    // chỉ định abortEarly: false có nhiều lỗi validation
    // đối với trường hợp update, cho phép Unknown để không cần đầy một số Field lên
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
const deleteColumn = async (req, res, next) => {

  const correctCondition = Joi.object({
    id: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required()


  })
  try {

    await correctCondition.validateAsync(req.params)
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const columnValidation = {
  createNew, update, deleteColumn
}