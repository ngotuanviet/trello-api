import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
import { cardModel } from '../models/cardModel.js'
import { columnModel } from '../models/columnModel.js'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider.js'

const createNew = async (reqBody) => {
  try {
    const createCard = await cardModel.createNew(reqBody)
    const getCarDetail = await cardModel.findOneById(createCard.insertedId)
    if (getCarDetail) {
      await columnModel.pushCardOrderIds(getCarDetail)
    }
    return getCarDetail
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo column'
    )
  }
}
const update = async (cardId, reqBody, cardCoverFile) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    let updatedCard = {}
    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      // console.log("🚀 ~ update ~ uploadResult:", uploadResult)
      // lưu lại url (secure_url) của file ảnh vào trong DB
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    }
    else {
      // các trường hợp update chung như title description
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) {
    throw error
  }
}
export const cardService = { createNew, update }