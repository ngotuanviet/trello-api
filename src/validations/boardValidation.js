import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {

  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().message({
      'any. required': 'Title is required ',
      'string.empty': 'Title is not allowed to be empty ',
      'string.min': 'Title min 3 chars ',
      'string.max': 'Title max 50 chars ',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(5256).trim().strict(),
  })
  try {
    // chỉ định abortEarly: false có nhiều lỗi validation
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    // next()
    res.status(StatusCodes.CREATED).send({
      message: 'Note: API create new board',

    })
  } catch (error) {
    console.log(error);
    console.log(new Error(error));

    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
      errors: new Error(error).message
    })

  }

}

export const boardValidation = {
  createNew
}