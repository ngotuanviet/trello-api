
import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js'
import { GET_DB } from '../config/mongodb.js'
import { ObjectId } from 'mongodb'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants.js'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  cover: Joi.string().default(null),
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  // Dữ liệu comments của Card chúng ta sẽ học cách nhúng - embedded vào bản ghi Card luôn như dưới đây:
  comments: Joi.array().items({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    userAvatar: Joi.string(),
    userDisplayName: Joi.string(),
    content: Joi.string(),
    // Chỗ này lưu ý vì dùng hàm $push đe thêm comment nen khong set default Date.now luôn giong hàm
    //insertOne khi create được.
    commentedAt: Joi.date().timestamp()
  }).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}
const createNew = async (data) => {
  try {

    const validData = await validateBeforeCreate(data)

    const NewData = {
      ...validData,
      columnId: new ObjectId(validData.columnId),
      boardId: new ObjectId(validData.boardId),

    }

    const createCard = await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(NewData)
    return createCard
  } catch (error) {
    throw new Error(error)
  }
}
const findOneById = async (id) => {
  try {


    return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })

  } catch (error) {
    throw new Error(error)
  }
}
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId']
const update = async (cardId, updateData) => {
  try {
    // Lọc các field không cho phép trong INVALID_UPDATE_FIELDS
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    if (updateData.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId)
    }

    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(columnId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
/**
* Đầy mot phần tử comment vào đầu mang comments!
* - Trong JS, ngược lại với push (thêm phần tử vào cuối mảng) sẽ là unshift (thêm phần tử vào đầu mằng)
* - Nhưng trong mongodb hiện tại chỉ có $push - mặc định đầy phần tử vào cuối mảng.
* Dĩ nhiên cứ lưu comment mới vào cuối mằng cũng được, nhưng nay sẽ học cách để thêm phần tử vào đầu mang
trong mongodb.
* Vần dùng $push, nhưng bọc data vào Array đe trong $each và chỉ định $position: 0
*/
const unshiftNewComment = async (cardId, commentData) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate({
      _id: new ObjectId(cardId)
    }, {
      $push: { comments: { $each: [commentData], $position: 0 } }
    }, { returnDocument: 'after' })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const updateMembers = async (cardId, incomingMemberInfo) => {
  try {
    // Tạo ra một biến updateCondition ban đầu là rồng
    let updateCondition = {}
    if (incomingMemberInfo.action == CARD_MEMBER_ACTIONS.ADD) {
      // console. log('Trường hợp Add, dùng $push: ', incomingMemberInfo)
      updateCondition = { $push: { memberIds: new ObjectId(incomingMemberInfo.userId) } }
    }
    if (incomingMemberInfo.action === CARD_MEMBER_ACTIONS.REMOVE) {
      // console. log('Trường hp Remove, dung $pull: ', incomingMemberInfo)
      updateCondition = { $pull: { memberIds: new ObjectId(incomingMemberInfo.userId) } }
    }
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      updateCondition, // truyền cái updateCondition ở đây
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew, findOneById, update, deleteManyByColumnId, unshiftNewComment, updateMembers
}