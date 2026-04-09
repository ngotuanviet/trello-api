import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  console.log('====================================');
  console.log(req.body);
  console.log('====================================');
  try {
    res.status(StatusCodes.CREATED).send({
      message: 'Note: API create new board',

    })

  } catch (error) { next(error) }
}
export const boardController = {
  createNew
}