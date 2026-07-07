import Joi from 'joi'
import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js'
import { GET_DB } from '../config/mongodb.js'
import { BOARD_TYPES } from '../utils/constants.js'
import { columnModel } from '../models/columnModel.js'
import { cardModel } from '../models/cardModel.js'


// define collection
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createBoard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (id) => {
  try {


    return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (id) => {
  try {
    // return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          _id: new ObjectId(id),
          _destroy: false
        }
      }, {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      }, {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'boardId',
          as: 'cards'
        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}
// Nhiệm vụ hàm này push 1 giá trị columnId và cuối mảng columnOrderIds
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate({ _id: new ObjectId(column.boardId) }, { $push: { columnOrderIds: new ObjectId(column._id) } }, {
      ReturnDocument: 'after'
    })
    return result.value || null
  } catch (error) {
    throw new Error(error)
  }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById
  , getDetails, pushColumnOrderIds
}
// boardId: 6a4b65841f2db783506bbb9d
// columnId: 6a4b6c04dcac4aebdb6c12d5
// cardId: 6a4b6cbadcac4aebdb6c12d7