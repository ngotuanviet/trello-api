import cloudinary from 'cloudinary'

import streamifier from 'streamifier'
import { env } from '~/config/environment'
/**
* Tài liệu tham khảo
* https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
*/

// Bước cầu hình cloudinary, sử dụng v2 - version 2
const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})
// Khởi tạo func thực hiện uploadfile lên cloudinary
const streamUpload = (fileBuffer, folderName) => {

  return new Promise((resole, reject) => {
    // Tạo một cái luồng stream upload lên cloudinary
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (err, result) => {

      if (err) {
        console.log("🚀 ~ streamUpload ~ err:", err)

        reject(err)
      }
      else {
        resole(result)
      }
    })
    // thực hiện upload cái luồng trên bầng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}
export const CloudinaryProvider = { streamUpload }