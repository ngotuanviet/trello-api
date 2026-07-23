import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js'
import { GET_DB } from '../config/mongodb.js'
import { BOARD_TYPES } from '../utils/constants.js'
import { columnModel } from '../models/columnModel.js'
import { cardModel } from '../models/cardModel.js'
import { pagingSkipValue } from '~/utils/algorithms.js'
import { userModel } from '~/models/userModel.js'


// define collection
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(255).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  //những admin của  board
  ownerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  // những thành viên của board
  memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
// chỉ định các trường không muốn cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}
const createNew = async (userId, data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newBoardToAdd = {

      ...validData,
      ownerIds: [new ObjectId(userId)]
    }
    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newBoardToAdd)
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
const getDetails = async (userId, boardId) => {
  try {


    const queryConditions = [
      { _id: new ObjectId(boardId) },
      {
        _destroy: false
      },
      {
        $or: [
          { ownerIds: { $all: [new ObjectId(userId)] } },
          { memberIds: { $all: [new ObjectId(userId)] } }
        ]
      }]

    // return await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      {
        $match: {
          $and: queryConditions
        }
      }, {
        $lookup: {
          from: columnModel.COLUMN_COLLECTION_NAME,
          let: { board_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$boardId', '$$board_id'] },
                    { $eq: ['$boardId', { $toString: '$$board_id' }] }
                  ]
                }
              }
            }
          ],
          as: 'columns'
        }
      }, {
        $lookup: {
          from: cardModel.CARD_COLLECTION_NAME,
          let: { board_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$boardId', '$$board_id'] },
                    { $eq: ['$boardId', { $toString: '$$board_id' }] }
                  ]
                }
              }
            }
          ],
          as: 'cards'
        }
      }, {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'ownerIds',
          foreignField: '_id',
          as: 'owners',
          // pipeline trong lookup là để xử lý một hoặc nhiều luồng cần thiết
          // $project để chỉ định vài field không muốn lấy về bằng cách gán nó giá trị 0
          pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
        }
      }, {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'memberIds',
          foreignField: '_id',
          as: 'members',
          pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
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
      returnDocument: 'after'
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (boardId, updateData) => {
  try {
    // Lọc các field không cho phép trong INVALID_UPDATE_FIELDS
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
        throw new Error(`Không được cập nhật trường : ${JSON.stringify(updateData[fieldName])}`)
      }
    })

    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(_id)))
    }

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate({ _id: new ObjectId(boardId) }, { $set: updateData }, {
      returnDocument: 'after'
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
// Lấy một phần tử columnId ra khỏi mảng columnOrderIds
// sử dụng pull trong mongoDB ở trường hợp này để lấy một phần tử ra khỏi mảng rồi xoá nó đi
const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate({ _id: new ObjectId(column.boardId) }, { $pull: { columnOrderIds: new ObjectId(column._id) } }, {
      returnDocument: 'after'
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const queryConditions = [
      // Đièu kiện 1: Board chưa bị xoá
      {
        _destroy: false
      },
      // Điều kiện 02: cái thằng userId đang thực hiện request nay no phai thuộc vào một trong 2 cái mang ownerIds hoac memberIds, su dung toan tu Sall cua mongodb

      {
        $or: [
          { ownerIds: { $all: [new ObjectId(userId)] } },
          { memberIds: { $all: [new ObjectId(userId)] } }
        ]
      }]
    const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate(
      [
        {
          $match: {
            $and: queryConditions
          }
        },
        // sort title cua board theo A-Z (mac dinh se bị chữ B hoa đứng trước chữ a thường (theo chuan bang ma ASCII)
        { $sort: { title: 1 } },
        // $facet xử lý nhiều luồng trong một query
        {
          $facet: {
            // Luồng thứ nhất: Query boards \
            'queryBoards': [
              { $skip: pagingSkipValue(page, itemsPerPage) }, // bả qua số lương bản ghi của những page trước đó
              { $limit: itemsPerPage } // Giới hạn tối đa số lượng bản ghi trả về trên 1 trang
            ],

            // Luồng thứ hai: Query đến tổng số lượng bản ghi board trong database và trả về biến countedAllBoards
            'queryTotalBoards': [{ $count: 'countedAllBoards' }]
          }
        }
      ],
      // Khai báo thêm thuộc tính collation locale 'en' để fix chứ B hoa và chữ a thường ở trên
      // https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-collation-document-fields
      {
        collation: { locale: 'en' }
      }
    ).toArray()
    // console.log("🚀 ~ getBoards ~ query:", query)
    const res = query[0]
    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0

    }
  } catch (error) {
    throw new Error(error)
  }
}
export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById
  , getDetails, pushColumnOrderIds, update, pullColumnOrderIds, getBoards
}
// boardId: 6a4b65841f2db783506bbb9d
// columnId: 6a4b6c04dcac4aebdb6c12d5
// cardId: 6a4b6cbadcac4aebdb6c12d7